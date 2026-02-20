import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import Spinner from "../../components/spinner";
import TopPopup from "../../components/topPopup";

export default function EachGroup() {
  const { id } = useParams();
  const [group, setGroup] = useState<any>(null);
  const [error, setError] = useState("");
  const [show,setShow] = useState(false)
  const [toggleLoading,setToggleloading] = useState(false)
  async function fetchGroup() {
    try {
      const res = await axios.get(
        `http://localhost:3000/user/groups/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (res.data.ok) {
        setGroup(res.data.newGroup);
        setError(res.data.msg)
        setShow(true)
      }
    } catch (err: any) {
      setError(err.response?.data?.msg || "Failed to load group");
      setShow(true)
    }
  }

  async function DeleteGroup(){
    setLoading({
      id:'delete',
      loading:true
    })
    try{
        const Deleting = await axios({
          url:`http://localhost:3000/user/groups/${id}/delete`,
          method:'DELETE',
          headers:{
            Authorization:`Bearer ${localStorage.getItem('token')}`
          }
        })

        if(Deleting.data && Deleting.data.ok){
          setError(Deleting.data.msg)
          setShow(true)

          setTimeout(()=>{
              window.location.href ='/user/dashboard'
          },3000)
        }
    }
    catch(err:any){
       setError(err.response?.data?.msg || "Failed to delete group");
       setShow(true)
    }
    finally{
        setLoading({
          id:'delete',
          loading:false
        })
    }
  }

  async function LeaveGroup(){
    setLoading({
      id:'leave',
      loading:true
    })
    try{
        const Leaving = await axios({
          url:`http://localhost:3000/user/groups/${id}/leave`,
          method:'DELETE',
          headers:{
            Authorization:`Bearer ${localStorage.getItem('token')}`
          }
        })

        if(Leaving.data && Leaving.data.ok){
          setError(Leaving.data.msg)
          setShow(true)
        }
    }
    catch(err:any){
       setError(err.response?.data?.msg || "Failed to delete group");
       setShow(true)
    }
    finally{
        setLoading({
          id:'leave',
          loading:false
        })
    }
  }

  async function ChangeIsPublic(value:boolean){

    setToggleloading(true)
    try{
        const Changing = await axios({
          url:`http://localhost:3000/user/groups/${id}/changeisPublic`,
          method:'POST',
          headers:{
            Authorization:`Bearer ${localStorage.getItem('token')}`
          },
          data:{
            isPublic:value
          }
        })

        if(Changing.data && Changing.data.ok){
          fetchGroup()
        }
    }
    catch(err:any){
       setError(err.response?.data?.msg || "Failed to delete group");
       setShow(true)
    }
    finally{
      setToggleloading(false)
    }
  }

  async function RemoveMember(memberId:any){
    setLoading({
      id:(memberId),
      loading:true
    })
    try{
      const Removing = await axios({
        url:`http://localhost:3000/user/groups/removeMember?groupId=${id}&memberId=${memberId}`,
        method:"DELETE",
        headers:{
          Authorization:`Bearer ${localStorage.getItem('token')}`
        }
        
      })

      if(Removing.data && Removing.data.ok){
        setError("Member removed successfully.")
        setShow(true)
        fetchGroup()
      }
    }
    catch(err:any){
       console.log(err)
       setError(err?.response?.data?.msg)
       setShow(true)
    }
    finally{
      setLoading({
        id:(memberId),
        loading:false
      })
    }
  }

  async function RoleChange(memberId:any,changeTo:any){
      setRoleChangeloader({
        id:(memberId),
        loading:true
      })

      try{
       const Admining = await axios({
        url:`http://localhost:3000/user/groups/roleChange`,
        method:'POST',
        data:{
          groupId:id,
          memberId,
          changeTo
        },
        headers:{
          Authorization:`Bearer ${localStorage.getItem('token')}`
        }
       })

       if(Admining.data && Admining.data.ok){
        if(changeTo=='EDITOR'){
          setError("Adminship left successfully")
        }
        else setError("Now become an Admin")
        setShow(true)
        fetchGroup()
       }
      }
      catch(err:any){
        console.log(err)
        setError(err?.response?.data?.msg)
        setShow(true)
      }
      finally{
        setRoleChangeloader({
          id:(memberId),
          loading:false
        })
      }
  }

  async function LeaveAdminship(){
    setRoleChangeloader({
      id:'HOST',
      loading:true
    })
    try{
      const Leaving_Adminship = await axios({
        url:`http://localhost:3000/user/groups/${id}/leaveAdminship`,
        method:"POST",
        headers:{
          Authorization:`Bearer ${localStorage.getItem('token')}`
        }
      })

      if(Leaving_Adminship.data && Leaving_Adminship.data.ok){
        setError("Left adminship successfully")
        setShow(true)
        fetchGroup()
      }
    }
    catch(err:any){
      console.log(err)
      setError(err?.response?.data?.msg)
      setShow(true)
    }
    finally{
      setRoleChangeloader({
      id:'HOST',
      loading:false
    })
    }
  }

  const [loading,setLoading] = useState({
    id:'',
    loading:false
  })
  
  const [roleChangeLoader,setRoleChangeloader] = useState({
    id:'',
    loading:false
  })

  


   const [publicToggle,setPublicToggle] = useState<Boolean>(false) 

   useEffect(() => {
    fetchGroup();
   }, []);

   useEffect(() => {
      if (group) {
        setPublicToggle(group.isPublic);
      }
    }, [group]);


    // Fetch room

    const [room,setRoom] = useState(false)
    
    async function FetchRoom(){
      setLoading({
        id:"getroom",
        loading:true
      })
    try{
       const Room = await axios({
        url:`http://localhost:3000/user/rooms/${id}/code`,
        method:'GET',
        headers:{
          Authorization:`Bearer ${localStorage.getItem('token')}`
        }
       })

       if(Room.data && Room.data.ok){
        setRoom(true)
       }
    }
    catch(err:any){
      setError(err?.response?.data?.msg || "Something went wrong")
      setShow(true)
    }
    finally{
      setLoading({
        id:"getroom",
        loading:false
      })
    }
    }


    async function CreateRoom(){
      setLoading({
        id:'creatingroom',
        loading:true
      })
      try{
         const Creating = await axios({
          url:`http://localhost:3000/user/rooms/${id}/create-room`,
          method:"POST",
          headers:{
            Authorization:`Bearer ${localStorage.getItem('token')}`
          }
         })

         if(Creating.data && Creating.data.ok){
          window.location.href = `/user/${id}/live`
         }
      }
      catch(err:any){
        console.log(err)
        setError(err?.response?.data?.msg)
        setShow(true)
      }
      finally{
        setLoading({
          id:'creatingroom',
          loading:false
        })
      }
    }
    useEffect(()=>{
       FetchRoom()
    },[id])



  if (!group)
    return (
      <div className="flex h-screen w-screen items-center justify-center text-slate-500">
         <Spinner borderColor={'blue'}/>
      </div>
    );

   
  

  return (
    <div className="min-h-screen bg-slate-100 p-6 md:p-10">
        <TopPopup show={show} onClose={()=> setShow(false)} text={error}/>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl bg-white p-6 shadow-md"
      >
        <div className="flex flex-col md:flex-row md:justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">
              {group.name}
            </h1>

            <p className="mt-3 text-slate-500">
              {group.description}
            </p>

            <div className="mt-4 flex w-125 items-center justify-between gap-3">

              <div className="flex items-center gap-3">
              <span className="rounded-full bg-blue-100 px-4 py-1 text-xs font-medium text-blue-600">
                {group.isPublic ? "Public" : "Private"}
              </span>

              <span className="rounded-full bg-green-100 px-4 py-1 text-xs font-medium text-green-600">
                {group._count.members} Members
              </span>

              <span className="rounded-full bg-purple-100 px-4 py-1 text-xs font-medium text-purple-600">
                Your Role: {group.role}
              </span>

              </div>
              
            {group.role === 'HOST' && <div className="flex items-center gap-3 mt-4">
                <span className="text-sm font-medium text-slate-600">
                  {publicToggle ? "Public" : "Private"}
                </span>

                <button
                  type="button"
                  disabled={toggleLoading}
                  onClick={() => {
                    const newValue = !publicToggle;  // pehle calculate karo
                    setPublicToggle(newValue);       // UI update
                    ChangeIsPublic(newValue);        // backend ko new value bhejo
                  }}
                  className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors duration-300 
                  ${publicToggle ? "bg-green-500" : "bg-gray-300"}`}
                >
                  <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform duration-300
                    ${publicToggle ? "translate-x-8" : "translate-x-1"}`}
                  />
                </button>
              </div>}
               
            
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex gap-8 items-center self-start">
           

            {group.role === "HOST" && (
              <button
              disabled={loading.id==='delete' ? loading.loading:false}
              onClick={DeleteGroup}
              className="rounded-xl bg-red-500 px-5 flex justify-center py-2 text-white hover:bg-red-600 transition">
                {loading.id==='delete' && loading.loading ? <Spinner/>:'Delete Group'}
              </button>
            )}

            {group.role === 'HOST' && (
           
                    <button
                    disabled={roleChangeLoader.id==='HOST' && roleChangeLoader.loading}
                    onClick={()=> LeaveAdminship()}
                    className="rounded-xl bg-blue-500 px-5 flex justify-center py-2 text-white hover:bg-blue-600 transition">
                    {roleChangeLoader.id==='HOST' && roleChangeLoader.loading  ? <Spinner borderColor="bg-blue-400"/>:'Leave Adminship'}
                    </button>
                
            )}
            <button
            disabled={loading.id==='leave' ? loading.loading:false}
             onClick={LeaveGroup}
            className="rounded-xl bg-slate-200 px-5 flex justify-center py-2 hover:bg-slate-300 transition">
              {loading.id==='leave' && loading.loading  ? <Spinner/>:'Leave Group'}
            </button>
          </div>
        </div>
      </motion.div>

      {/* ================= MEMBERS SECTION ================= */}
      <div className="mt-10">
        <div className="flex justify-between items-center">
          <h2 className="mb-6 text-xl font-semibold text-slate-700">
            Members
          </h2>

          
          {(loading.id==='getroom' || loading.id==='creatingroom') &&  <button
            onClick={() => {
              if(room){
                window.location.href = (`/user/${id}/live`)
              }
              else{
                CreateRoom()
              }
            }}
            disabled={(loading.id==='getroom' && loading.loading)}
            className="bg-linear-to-r from-indigo-500 to-purple-600 
                      text-white px-6 py-2 rounded-lg shadow-lg 
                      hover:scale-105 transition"
          >
            {(loading.id==='getroom' && loading.loading) || (loading.id==='creatingroom' && loading.loading)  ? <Spinner/>: (room) ? "Join room":'Create room'}
          </button>}
         

        </div>
        

        <div className="grid gap-4">
          {group.members.map((EDITOR: any, index: number) => (
            <motion.div
              key={EDITOR.user.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center justify-between rounded-xl bg-white p-4 shadow-sm hover:shadow-md transition"
            >
              {/* LEFT SIDE */}
              <div className="flex items-center gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-600 text-white font-semibold text-lg">
                  {EDITOR.user.name[0].toUpperCase()}
                </div>

                <div>
                  <p className="font-medium text-slate-800">
                    {EDITOR.user.name}
                  </p>

                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      EDITOR.role === "HOST"
                        ? "bg-purple-100 text-purple-600"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {EDITOR.role}
                  </span>
                </div>
              </div>

              {/* RIGHT SIDE (Admin Controls) */}
              {group.role === "HOST" && (
                <div className="flex gap-3">
                  {EDITOR.role !== "HOST" && (
                    <button
                    disabled={roleChangeLoader.id===EDITOR.user.id && roleChangeLoader.loading}
                    onClick={()=> RoleChange(EDITOR.user.id,'HOST')}
                    className="text-xs bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 transition">
                    {roleChangeLoader.id===EDITOR.user.id && roleChangeLoader.loading  ? <Spinner borderColor="bg-blue-400"/>:'Make HOST'}
                    </button>
                  )}

                 

                  

                  <button
                   disabled={loading===(EDITOR.user.id) && loading.loading}
                  onClick={()=> RemoveMember(EDITOR.user.id)}
                  className="text-xs bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition">
                    {loading.id===EDITOR.user.id && loading.loading  ? <Spinner borderColor="bg-blue-400"/>:'Remove'}
                  </button>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

    </div>
  );
}
