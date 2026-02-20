import dotenv from 'dotenv'

import Express from 'express'
import cors from 'cors'

import userRouter from './user.js'
import adminRouter from './admin.js'
import { fileURLToPath } from "url";
import path from "path";
import { Server } from 'socket.io'
import http from 'http'
import executeCode from './services/judgeOServices.js'
import languageMap from './config/languageMap.js'
import { prisma } from './Prisma/client.js'
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// IMPORTANT: dist/src se env 2 level upar hota hai
dotenv.config({
  path: path.resolve(__dirname, "../../.env")
});

const app = Express();
const server = http.createServer(app)


app.use(cors())
app.use(Express.json())
app.use('/user',userRouter)
app.use('/admin',adminRouter)


const io = new Server(server, {
  cors:{
    origin:'*',
    methods:['GET','POST']
  }
})



// Existing code and editor language maintain rehegi..
const roomState:Record<string,{code:string,language:string}> = {}

// Existing roomUsers store 
const roomUsers :Record<string,{socketId:string,userId:string,name:string,role:string,editing:boolean}[]> = {}

// maintaining editingPermission state

const editingPermissions : Record<string,Set<string>> = {}

io.on('connection',(socket) => {
  console.log("User connected :",socket.id)


  // jab koi new user join kare room
  socket.on('join-room',async({groupId,userId,name,role}) => {
    
    socket.join(String(groupId))
    console.log("JOIN EVENT RECEIVED:", {groupId,userId,name})
    console.log("Joined room:",groupId)

    if(!editingPermissions[groupId]){
      editingPermissions[groupId] = new Set()
    }

    editingPermissions[groupId].add(socket.id)
 
    // storing..groupId to custom data of socket
    socket.data.roomId = groupId


    if(!roomState[groupId]){
      // if no state initially then set db code
      const roomCode = await prisma.roomCode.findUnique({
        where:{
          groupId:Number(groupId)
        }
      })
    
      console.log("Room code id -> " + roomCode?.id)
      if(!roomCode){
        roomState[groupId] = {
          language: 'javascript',
          code: ''
        }
      }
      else{
         roomState[groupId] = {
          language:roomCode.language,
          code:roomCode.code 
        }
      }

     
    }

    
    socket.emit('receive-language',roomState[groupId].language)
    socket.emit('receive-code',roomState[groupId].code)
    

    // users add karo..
    if(!roomUsers[groupId]){
      roomUsers[groupId] = []
    }
    roomUsers[groupId].push({
      socketId:String(socket.id),
      userId:String(userId),
      name:name,
      role:role,
      editing:true
    })


    io.to(groupId).emit("room-users-count", io.sockets.adapter.rooms.get(groupId)?.size)
    io.to(groupId).emit('room-users',roomUsers[groupId])
  })


  // jab..koi code change kare tab..ye hit hoga..

  socket.on('code-change',({groupId,code}) => {

    // Only allowed to change code when present in state
    if(!editingPermissions[groupId]?.has(socket.id)){
      return;
    }

    if(!roomState[groupId]){
      roomState[groupId] = {code,language:'javascript'}
    }
    else{
      roomState[groupId].code = code
    }
    socket.to(String(groupId)).emit('receive-code',code)
  })

 
  // jab koi..language select kare

  socket.on('language-set',({groupId,language}) => {
    if(!roomState[groupId]){
      roomState[groupId] = {code:'',language}
    }
    else{
      roomState[groupId].language = language
    }
    socket.to(String(groupId)).emit('receive-language',language)
  })


  // when typing kare koi
  socket.on('typing',({groupId,name,userId})=>{
    console.log("Typing data coming" + name)
    socket.to(groupId).emit('showTyping',{
      userId:String(userId),
      name
    })
  })


  // when stoptyping
  socket.on('stopTyping',({groupId,userId})=>{
    socket.to(groupId).emit('hideTyping',{
      userId:String(userId)
    })
  })


  // code restoring logic(db save , roomState , broadcast)
  socket.on('code-restore',async({groupId,versionId,userId})=>{
      console.log("Version id + " + versionId)
    try {

      // check whether user is host or not
      const isHost = await prisma.groupMember.findFirst({
       where:{
        role:'HOST',
        groupId:Number(groupId),
        userId:Number(userId)
       }
      })

      if(!isHost){
        socket.emit('restore-error','Only host is allowed to restore code')
        return ;
      }

      
      const version = await prisma.codeVersion.findUnique({
        where: { id: Number(versionId) }
      });

      if (!version) {
        socket.emit('restore-error', 'Version not found');
        return;
      }

      //  Update DB
      await prisma.roomCode.update({
        where: { id: version.roomCodeId },
        data: {
          language: version.language,
          code: version.code
        }
      });

      //  Update memory
      roomState[groupId] = {
        language: version.language,
        code: version.code
      };

      //  Broadcast
      io.to(String(groupId)).emit('receive-language', version.language);
      io.to(String(groupId)).emit('receive-code', version.code);


      // success message
      socket.emit('restore-success')

  } catch (err) {
      console.error("Restore error:", err);
      socket.emit('restore-error', 'Restore failed');
  }
  })

  socket.on('kick-user',({socketId,groupId})=>{
    
    console.log("Enter kicking part -> " + socketId + " " + groupId)
     
    const  targetSocket = io.sockets.sockets.get(String(socketId))

    if(!targetSocket) return ;

    // remove it from sockets
    targetSocket.leave(String(groupId))

    // roomUsers update
    if(roomUsers[groupId]){
      roomUsers[groupId] = roomUsers[groupId].filter(each => each.socketId!==String(socketId))
    }

    // notify user
    targetSocket.emit('kicked')

    // broad caste list and users count
    io.to(groupId).emit('room-users',roomUsers[groupId])
    io.to(groupId).emit('room-users-count',roomUsers[groupId]?.length || 0)
  })

  socket.on('stop-editing',({socketId,groupId,role})=>{

    if(role!=='HOST') return ;

    const targetSocket = io.sockets.sockets.get(String(socketId))

    if(!targetSocket) return ;

    // removing from editingState
    editingPermissions[groupId]?.delete(socketId)

    // set editing false from true
    if(roomUsers[groupId]){
      roomUsers[groupId] = roomUsers[groupId].map(each => {
        if(each.socketId===String(socketId)){
          let newObj = {...each,editing:false}
          return newObj
        }
        else return each
      } )
    }

   io.to(groupId).emit('room-users',roomUsers[groupId])
   targetSocket.emit('block-editing')
  })

  socket.on('allow-editing',({socketId,groupId,role})=>{
     if(role!=='HOST') return ;

     const targetSocket = io.sockets.sockets.get(String(socketId))

     if(!targetSocket) return;

    //  add this socket to editing permission
     editingPermissions[groupId]?.add(socketId)

     if(roomUsers[groupId]){
      roomUsers[groupId] = roomUsers[groupId].map(each => {
        if(each.socketId===String(socketId)){
          let newObj = {...each,editing:true}
          return newObj
        }
        else return each
      })
     }

     targetSocket.emit('resume-editing')

     io.to(groupId).emit('room-users',roomUsers[groupId])
  })


  // Code Execution socket logic

  socket.on('runCode',async({code,language,groupId})=>{
    try{
      const languageId = languageMap[language] 
      
      const result = await executeCode(code,languageId)
 
      console.log("Here is the result " + result)
      io.to(groupId).emit('codeOutput',result)
    }
    catch(err:any){
     console.log("Full Error:", err);

      io.to(groupId).emit('codeOutput', {
        error: err.response?.data?.message || "Execution failed"
      });
    }
  })



   socket.on('disconnect',()=>{
    console.log("User disconnected:", socket.id)
    const room = socket.data.roomId

    if(room && roomUsers[room]){
      // getting user count on disconnect
     

      // filter out disconnected user
      roomUsers[room] = roomUsers[room].filter(user => user.socketId!==String(socket.id))
      const userCount = roomUsers[room].length
      io.to(room).emit('room-users',roomUsers[room])
      io.to(room).emit('room-users-count',userCount)

    }

  

  })
  

})

server.listen(3000,()=>{
  console.log("Server is running on port 3000")
})


