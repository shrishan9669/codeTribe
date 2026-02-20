import { useEffect, useRef, useState } from "react"
import { useParams } from "react-router-dom"
import { motion, AnimatePresence, useTime, useTransform } from "framer-motion";
import Editor from "@monaco-editor/react"
import {socket} from  '../../socket/socket'
import LanguageDropdown from "../../components/dropDown"
import axios from "axios"
import Spinner from "../../components/spinner"
import TopPopup from "../../components/topPopup"
import { RxHamburgerMenu, RxResume } from "react-icons/rx"
import { ChevronDown, UserCheck, Users } from "lucide-react"
import type { i } from "framer-motion/client";
import { MdGroupRemove } from "react-icons/md";
import { BiBlock } from "react-icons/bi";

export default function Room() {
  const { groupId } = useParams()
  const [code, setCode] = useState("// Start coding here...")
  const isRemoteChange = useRef(false)
  const [userCount,setUserCount] = useState(0)
  const [userdata,setUserdata]  = useState({
    userId:-1,
    name:'',
    role:''
  })
  const [loading,setLoading] = useState(true)
  const [developers,setDevelopers] = useState<{socketId:string,userId:string,name:string,role:string,editing:boolean}[]>([])
  const [typingDevs,setTypingDevs] = useState<{userId:string,name:string}[]>([])
  const [output, setOutput] = useState("")
  const [language,setLanguage] = useState('javascript')
  const [isRunning,setRunning] = useState(false)
  const [error,setError] = useState('')
  const [show,setShow] = useState(false)
  const [showUserDots,setUserDots] = useState({
      id:-1,
      show:false
    })
    const [showGroupsDropdown,setShowGroupsDropdown] = useState(false)
    const [autoLoader,setAutoLoader] = useState(false)
    const [versions,setVersions] = useState<any[]>([])
    const [selectedVersion,setSelectedVersion] = useState<any>(-1)
    const [restoreLoader,setRestoreLoader] = useState(false)
    const [canEdit,setCanEdit] = useState(true)
    async function Userdata(){
    try{
        const data = await axios({
          url:`http://localhost:3000/user/personal?groupId=${groupId}`,
          method:'GET',
          headers:{
            Authorization:`Bearer ${localStorage.getItem('token')}`
          }
        })
        if(data.data && data.data.ok){
          setUserdata(data.data.user)
          setLoading(false)
        }

    }
    catch(err:any){
      console.log(err)
      console.log(err?.response?.data?.msg)
    }
    }
    //  typing logic
    let typingTimeout:any;

    const handleTyping = (value:string)=>{

      if(!value.trim()) return 

      if(userdata.userId !== -1 && userdata.name){
        console.log("Typing ho rhi hai..")
        
        socket.emit("typing",{groupId,userId:userdata.userId,name:userdata.name})

        clearTimeout(typingTimeout)

        typingTimeout = setTimeout(()=>{
          socket.emit("stopTyping",{groupId,userId:userdata.userId})
        },2000)
      }
   
    }

    function handleChange(value: string | undefined) {
    if (!value) return

    setCode(value)
    handleTyping(value)
    if (!isRemoteChange.current) {
      socket.emit("code-change", { groupId: groupId, code: value })
    }

    isRemoteChange.current = false
    }

 
    function handleRunCode(){
      if(!code.trim()) return ;
      setRunning(true)

      socket.emit('runCode',({code,language:language.toLowerCase(),groupId}))
    }


  // Auto save to db 

    async function Auto_Save(){

      setAutoLoader(true)
      try{
        const auto_save = await axios({
          url:`http://localhost:3000/user/rooms/${groupId}/putCode`,
          data:{
            code,
            language
          },
          method:'PUT',
          headers:{
            Authorization:`Bearer ${localStorage.getItem('token')}`
          }
        })

        }
      catch(err){
        console.log(err)
      }
      finally{
        setAutoLoader(false)
      }
    }

  // Manual version save

    const [manualLoader,setVersionLoader] = useState(false)
    async function ManualVersion(){
      setVersionLoader(true)
      try{
        const VersionSave = await axios({
          url:`http://localhost:3000/user/rooms/${groupId}/version`,
          method:'POST',
          data:{
            code,
            language
          },
          headers:{
            Authorization:`Bearer ${localStorage.getItem('token')}`
          }
        })

        if(VersionSave.data && VersionSave.data.ok){
          VersionHistory()
          setError('Version saved successfully')
          setShow(true)

        }
      }
      catch(err:any){
        console.log(err)
        setError(err?.response?.data?.msg)
        setShow(true)
      }
      finally{
        setVersionLoader(false)
      }
    }
 
 
    async function VersionHistory(){
      try{
        const Versions = await axios({
          url:`http://localhost:3000/user/rooms/${groupId}/versionHistory`,
          method:"GET",
          headers:{
            Authorization:`Bearer ${localStorage.getItem('token')}`
          }
        })

        if(Versions.data && Versions.data.versions){
          setVersions(Versions.data.versions)
        }
      }
      catch(err:any){
        console.log(err)
        setError(err?.response?.data?.msg)
        setShow(true)
      }
    }

    
    async function RestoreVersion(){
      setRestoreLoader(true)
      try{
        socket.emit('code-restore', {
          groupId,versionId:selectedVersion,userId:userdata.userId
        })
      }
      catch(err:any){
        setError("Restored failed")
        setShow(true)
      }
    
    }

    function KickDev(socketId:any,devRole:any){
      if(devRole==='HOST'){
        setError(`HOST can't be kicked`)
        setShow(true)
        return;
      }
      socket.emit('kick-user',{groupId,socketId})
    }

    function BlockEditing(socketId:any,devRole:any){
       if(devRole==='HOST') {
        setError(`HOST can't be kicked`)
        setShow(true)
        return;
       }

       socket.emit('stop-editing',({socketId,groupId,role:userdata.role}))

    }
    function ResumeEditing(socketId:any){
      socket.emit('allow-editing',({socketId,groupId,role:userdata.role}))
    }


    

    useEffect(()=>{
      const timeout = setTimeout(()=>{
        Auto_Save()
      },3000)

      return ()=> clearTimeout(timeout)
    },[code])
    useEffect(()=>{
      VersionHistory()
    },[groupId])

    useEffect(()=>{
      return ()=>{
        socket.disconnect()
      }
    },[])

    useEffect(() => {
      Userdata()
    }, [])

    // Join room when userdata ready
    useEffect(() => {
      if (userdata.userId !== -1 && userdata.name) {
        console.log("HEllo")
        socket.emit("join-room", {
          groupId,
          userId: userdata.userId,
          name: userdata.name,
          role:userdata.role
        })
      }

    }, [userdata, groupId])

    useEffect(() => {
      socket.on("receive-code", (incomingCode) => {
        isRemoteChange.current = true
        setCode(incomingCode)
      })

      socket.on("room-users-count", (count:any) => {
        setUserCount(count)
      })

      socket.on("room-users", (users:any) => {
        setDevelopers(users)
        console.log(users)
      })

      socket.on("receive-language", (language) => {
        setLanguage(language)
      })

      // jo jo typing karrha hai...wo array mein store hoga..
      socket.on('showTyping',(typingData)=>{
        console.log(typingData)
          setTypingDevs((prev:any) => {
             const previousExists = prev.find((dev:any) => dev.userId===typingData.userId)

             if(previousExists) return prev

             return [...prev,typingData]
          })
      })

      // jo ruk gya use filter out karo
      socket.on('hideTyping',(typingData)=>{
       setTypingDevs(prev => prev.filter(dev => dev.userId!==typingData.userId))
      })

      socket.on('restore-success',()=>{
        setRestoreLoader(false)
      })
      socket.on('restore-error',(msg)=>{
        setError(msg)
        setShow(true)
      })

      socket.on('codeOutput',(output)=>{
         setOutput(output.stdout || output.stderr  || output.compile_output || output.error || "No Output")

         setRunning(false)
      })
      
      socket.on('kicked',()=>{
        setError('You are kicked by HOST')
        setShow(true)

        setTimeout(()=>{
           window.location.href = '/user/dashboard'
        },3000)
      })

      socket.on('block-editing',()=>{
         setError('HOST blocked you from editing.')
         setShow(true)
         setCanEdit(false)
      })

      socket.on('resume-editing',()=>{
         setError('HOST allowed you to edit.')
         setShow(true)
         setCanEdit(true)
      })

      return () => {
        socket.off("receive-code")
        socket.off("room-users-count")
        socket.off("room-users")
        socket.off("receive-language")
        socket.off('showTyping')
        socket.off('hideTyping')
        socket.off('codeOutput')
        socket.off('restore-success')
        socket.off('restore-error')
        socket.off('kicked')
        socket.off('block-editing')
        socket.off('resume-editing')
      }
    }, [])






  if(loading){
     return <div className="w-screen h-screen flex justify-center items-center">
         <Spinner borderColor="bg-blue-500"/>
     </div>
  }


  return (
    <div className="h-screen overflow-hidden bg-gray-900 text-white flex flex-col">
    <TopPopup show={show} text={error} onClose={()=> setShow(false)}  />
  {/* Header */}
  <div className="p-4 flex gap-10 items-center border-b border-slate-700">
    
    <h1 className="text-xl font-bold tracking-wide">
      💻 Live Coding Room
    </h1>

    {/* Developers Section */}
    <div className="flex items-center gap-4">
      
      <div className="text-sm text-slate-400">
        Active Developers: 
        <span className="ml-1 font-semibold text-white">
          {userCount}
        </span>
      </div>

      <div className="flex items-center gap-2 max-w-xl">
        {developers.map((dev, index) => (
          <div
            onMouseEnter={()=>{
              setUserDots({
                id: Number(dev.userId), show: true
              })
            }}

            onMouseLeave={() =>
              setUserDots({ id: Number(dev.userId), show: false })
            }
            key={dev.socketId || index}
            className={`flex items-center gap-2 bg-slate-800 px-3 py-1 rounded-full shadow-md`}
          >
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>

            {/* Avatar */}
            <div className={`w-6 h-6 rounded-full ${dev.role==='HOST' ? 'bg-red-500':'bg-indigo-600'}  flex items-center justify-center text-xs font-bold`}>
              {dev.name?.charAt(0).toUpperCase()}
            </div>

            <span className="text-sm text-slate-200 whitespace-nowrap">
              {dev.name}
            </span>

            {typingDevs.some(t => t.userId === dev.userId) && (
              <div>
                <TypingIndicator />
              </div>
            )}

            {showUserDots.id===Number(dev.userId) && showUserDots.show && userdata.role==='HOST' && dev.role!=='HOST'  && <div>
                  <motion.div
                        key="groups-dropdown"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="relative"
                      >
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setShowGroupsDropdown(!showGroupsDropdown)}
                          className="flex items-center px-4 py-2 rounded-xl bg-gray-800/50 hover:bg-gray-800 text-gray-300  hover:text-white transition-all duration-300"
                        >
                        
                          <RxHamburgerMenu/>
                          <motion.div
                            animate={{ rotate: showGroupsDropdown ? 180 : 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <ChevronDown className="w-4 h-4 ml-2" />
                          </motion.div>
                        </motion.button>

                        <AnimatePresence>
                          {showGroupsDropdown && (
                            <motion.div
                              initial={{ opacity: 0, y: -10, scale: 0.95 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: -10, scale: 0.95 }}
                              className="absolute z-50 top-full left-0 mt-2 w-48 bg-gray-900/95 backdrop-blur-xl rounded-2xl border border-gray-800 shadow-2xl overflow-hidden"
                            >
                              <motion.a
                                whileHover={{ x: 5, backgroundColor: "rgba(30, 41, 59, 0.5)" }}
                                onClick={()=> KickDev(dev.socketId,dev.role)}
                                className="flex items-center px-4 py-3 cursor-pointer text-gray-300 hover:text-white transition-colors"
                              >
                                <MdGroupRemove className="w-4 h-4 mr-3 text-blue-400" />
                                Kick devloper
                              </motion.a>
                              <div className="h-px bg-gray-800" />

                              {/* block editing */}
                              {dev.editing &&  <motion.a
                                whileHover={{ x: 5, backgroundColor: "rgba(30, 41, 59, 0.5)" }}
                                onClick={()=> BlockEditing(dev.socketId,dev.role)}
                                className="flex items-center px-4 cursor-pointer py-3 text-gray-300 hover:text-white transition-colors"
                              >
                                <BiBlock className="w-4 h-4 mr-3 text-green-400"/>
                                Block editing
                              </motion.a>
                            }
                             
                             {/* resume editing */}
                             {!dev.editing &&
                              <motion.a
                                whileHover={{ x: 5, backgroundColor: "rgba(30, 41, 59, 0.5)" }}
                                onClick={()=> ResumeEditing(dev.socketId)}
                                className="flex items-center px-4 cursor-pointer py-3 text-gray-300 hover:text-white transition-colors"
                              >
                                <RxResume className="w-4 h-4 mr-3 text-green-400"/>
                                Resume editing
                              </motion.a> }
                              

                              
                            </motion.div>
                          )}
                        </AnimatePresence>
                  </motion.div>
                  
            </div>}
          </div>
        ))}
      </div>

    </div>

     {/*  Run Button Section */}
  <div className="flex items-center gap-3">
    
    <button
      onClick={handleRunCode}
      disabled={isRunning}
      className="bg-green-500 hover:bg-green-600 px-5 py-2 rounded-md font-semibold transition disabled:opacity-50"
    >
      {isRunning ? <span className="animate-spin">⚙</span> : "▶ Run Code"}
    </button>

  </div>
  </div>

  {/* Language Dropdown */}
  <div className="p-3 items-center justify-between px-10 flex ">
    <LanguageDropdown 
      groupId={String(groupId)} 
      language={language} 
      setLanguage={setLanguage} 
    />

   {userdata.role==='HOST' &&   <div className="flex items-center gap-9">
      <button
      disabled={manualLoader}
      onClick={ManualVersion}
      className="px-3 py-1 bg-gray-800 hover:bg-gray-700 cursor-pointer  rounded-xl">{manualLoader ? <Spinner/>:"Save version"}</button>
      <span className="text-green-300 font-medium">{autoLoader ? <Spinner/>:'Auto save on'}</span>
    </div>}
  
  </div>

  {/* Editor */}
  <div className="flex gap-3 h-full">
    <Editor
      height="100%"
      theme="vs-dark"
      language={language}
      value={code}
      onChange={handleChange}
      options={
        {
          readOnly:!canEdit
        }
      }
    />

    {/* version history only when user is HOST */}

  {userdata.role==='HOST' && <div className="w-80 bg-zinc-900 border-l border-zinc-700 p-4 overflow-y-auto">
    <div className="flex mb-4 items-center justify-between">
    <h2 className="text-lg font-semibold  text-white">
      Version History
    </h2>

    <button
    disabled={selectedVersion<0 || restoreLoader}
    onClick={RestoreVersion}
    className={`px-3 py-1  ${selectedVersion>0 ? 'bg-gray-800 cursor-pointer hover:bg-gray-700':'bg-slate-800 text-slate-500 cursor-not-allowed'}  rounded-2xl`}>{restoreLoader ? <Spinner/>:'Restore'}</button>
    </div>
    

    {versions.length > 0 && versions.map((version) => (
      <div
        key={version.id}
        onClick={()=> {
          if(selectedVersion && selectedVersion===version.id){
            setSelectedVersion(-1)
             console.log("Unselected")
          }else{
            setSelectedVersion(version.id)
            console.log("Selected")
          }
        }}
        className={`p-3 mb-3 rounded-lg ${selectedVersion == version.id ? 'bg-zinc-700':''}  hover:bg-zinc-700 cursor-pointer transition`}
      >
        <p className="text-sm text-white">
          {version.user.name}
        </p>
        <p className="text-xs text-zinc-400">
          {new Date(version.createdAt).toLocaleString()}
        </p>
      </div>
    ))}
  </div>}
    
   
  </div>

  {output && (
  <div className="h-[300px] bg-black border-t border-slate-700 p-4 font-mono text-sm">
    {output}
  </div>
  )}

</div>

  )
}


const TypingIndicator = () => {
  return (
    <div className="flex items-center space-x-1">
      <span className="w-2 h-2 bg-gray-100 rounded-full animate-bounce"></span>
      <span className="w-2 h-2 bg-gray-100 rounded-full animate-bounce [animation-delay:0.2s]"></span>
      <span className="w-2 h-2 bg-gray-100 rounded-full animate-bounce [animation-delay:0.4s]"></span>
    </div>
  );
};


