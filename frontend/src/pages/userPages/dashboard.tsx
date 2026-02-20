import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import {useEffect, useState} from "react";
import TopPopup from "../../components/topPopup";
import { X } from "lucide-react";
import Spinner from "../../components/spinner";

export default function Dashboard() {
  
  const[show,setShow] = useState(false)
  const[error,setError] = useState('')
  const[loading,setLoading] = useState({
    id:-1,
    loading:false
  })
  const [noofgroups,setNoOfGroups] = useState({
    totalGroups:'',
    adminGroups:''
  })

  async function No_OF_Groups(){
    
    try{
         const NoOfGroups = await axios({
            url:'http://localhost:3000/user/totalGroups',
            method:'GET',
            headers:{
                Authorization:`Bearer ${localStorage.getItem('token')}`
            }
         })

         if(NoOfGroups.data && NoOfGroups.data.ok){
                setNoOfGroups({
                    adminGroups:NoOfGroups.data.hostGroups,
                    totalGroups:NoOfGroups.data.TotalGroups
                })
         }


         setError(NoOfGroups.data.msg);
         setShow(true)

    }
    catch(err:any){
        console.log(err);
         
         if(err.response && err.response.data && err.response.data.msg){
                setError(err.response.data.msg)
        }
        else{
        setError("Something went wrong!!")
        }
        setShow(true)
    }
  }

 


  interface  GroupDetails{
      role:string,
      group:{
        id:number,
        name:string,
        isPublic:boolean,
        description:string,
        _count:{
            members:number
        }
      } 
  }

  

  const [Groups,setGroups] = useState<GroupDetails[]>([])
  async function MyGroups(){
   
    try{
        const Details = await axios({
            url:'http://localhost:3000/user/groups/my',
            method:'GET',
            headers:{
                Authorization:`Bearer ${localStorage.getItem('token')}`
            }
        })

        if(Details.data && Details.data.ok){
            setGroups(Details.data.myGroups)
        }

        setError(Details.data.msg)
        setShow(true)
    }
    catch(err:any){
         if(err.response && err.response.data && err.response.data.msg){
              setError(err.response.data.msg)
        }
        else{
        setError("Something went wrong!!")
        }
        setShow(true)
    }
  }

  async function LeaveGroup(id:number){
    setLoading({
      id:id,
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

          setTimeout(()=>{
            MyGroups()
          },3000)
        }
    }
    catch(err:any){
       setError(err.response?.data?.msg || "Failed to delete group");
       setShow(true)
    }
    finally{
        setLoading({
          id:id,
          loading:false
        })
    }
  }


  const [showCreateGroup,setCreateGroup] = useState(false)

  useEffect(()=>{
    No_OF_Groups()
    MyGroups()
  },[])

  const [filterView,setFilterView] = useState('')
  const [filterMember,setFilterMember] = useState('')

  let filteredGroups:GroupDetails[] = []

  if(Groups.length > 0){
    filteredGroups = Groups.filter(each => {
       const public_or_private = each.group.isPublic ? 'Public':'Private'
       const isPublic = filterView==='' || filterView===public_or_private

       const admin_or_member = filterMember==='' || filterMember===each.role

       return isPublic && admin_or_member
    })
  }


  return (
    <div className="min-h-screen bg-gray-100 p-6">

        {/* Top pop up */}
        <TopPopup show={show} text={error} onClose={()=> setShow(false)}/>


      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-800">👋 Welcome, {localStorage.getItem('name')  || "ishan"}</h1>
        <p className="text-gray-500 mt-1">Manage your groups and collaborations</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <motion.div
          whileHover={{ scale: 1.03 }}
          className="bg-white rounded-2xl shadow p-6"
        >
          <p className="text-gray-500">Total Groups</p>
          <h2 className="text-4xl font-bold text-indigo-600 mt-2">{noofgroups.totalGroups}</h2>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.03 }}
          className="bg-white rounded-2xl shadow p-6"
        >
          <p className="text-gray-500">Admin Groups</p>
          <h2 className="text-4xl font-bold text-green-600 mt-2">{noofgroups.adminGroups}</h2>
        </motion.div>
      </div>

      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">📋 My Memberships</h2>

        <div className="flex items-center gap-5">
          <div className="relative w-60">

            <select
              onChange={(e)=> setFilterView(e.target.value)}
              name="isPublic"
              id="isPublic"
              className="w-full appearance-none bg-white border border-gray-300 text-gray-700 py-2.5 px-4 pr-10 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
            >
              <option value="" hidden>Filter by view</option>
              <option value="">All</option>
              <option value="Private">Private</option>
              <option value="Public">Public</option>
            </select>

            
            <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          <div className="relative w-60">
            <select
              onChange={(e)=> setFilterMember(e.target.value)}
              name="isPublic"
              id="isPublic"
              className="w-full appearance-none bg-white border border-gray-300 text-gray-700 py-2.5 px-4 pr-10 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
            >
              <option value="" hidden>Filter by owenership</option>
              <option value="">All</option>
              <option value="HOST">Host</option>
              <option value="EDITOR">Editor</option>
            </select>

            
            <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>


          

            <motion.button
              onClick={()=> setCreateGroup(true)}
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.05 }}
              className="bg-indigo-600 text-white px-5 py-2 rounded-xl shadow hover:bg-indigo-700"
            >
              ➕ Create Group
            </motion.button>
        </div>
      
      </div>

      {/* Groups List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGroups && filteredGroups.length>0 && filteredGroups.map((each) => (
          <motion.div
            
            key={each.group.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -5 }}
            className="bg-white rounded-2xl shadow p-5"
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-1">
                <h3 className="text-lg font-semibold text-gray-800">{each.group.name}</h3>
              <span
                className={`text-xs px-3 py-1 rounded-full font-medium ${
                  each.group.isPublic === true
                    ? "bg-green-100 text-green-700"
                    : "bg-blue-100 text-blue-700"
                }`}
              >
                {each.group.isPublic ? 'Public':'Private'}
              </span>
              </div>
              <span
                className={`text-xs px-3 py-1 rounded-full font-medium ${
                  each.role === "HOST"
                    ? "bg-green-100 text-green-700"
                    : "bg-blue-100 text-blue-700"
                }`}
              >
                {each.role}
              </span>
            </div>

            <div className="flex mt-2 justify-between items-center">
              <p className="text-slate-400 text-sm">{each.group.description}</p> 
            </div>

            


            <p className="text-sm text-gray-500 mt-2">👥 {each.group._count.members} {each.group._count.members > 1 ? 'members':'members'}</p>

            <div className="mt-4 flex justify-between">
              <button
              onClick={()=> window.location.href =`/user/${each.group.id}`}
              className="text-indigo-600 font-medium cursor-pointer hover:underline">
                View
              </button>
              <button
              onClick={()=> LeaveGroup(each.group.id)}
              className="text-red-500 cursor-pointer font-medium hover:underline">
                {loading.id===each.group.id && loading.loading  ? <Spinner/>:'Leave'}
              </button>
            </div>
          </motion.div>
        ))}
      </div>


    {showCreateGroup && <CreateGroupModal reloadGroups={MyGroups} onClose={()=> setCreateGroup(false)}/>}
    </div>
  );
}



interface Props {
  onClose: () => void;
  reloadGroups:()=> void;
}

const CreateGroupModal = ({ onClose,reloadGroups}: Props) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [Public,setPublic] = useState(true)
  const [loading,setLoading] = useState(false)
  const [error,setError] = useState('')
  const [show,setShow] = useState(false)

 
  const handleSubmit = async() => {
    if (!name.trim() || !description.trim()) return;

    setLoading(true)

    try{
         const CreatingGroup = await axios({
            url:'http://localhost:3000/user/groups',
            method:'POST',
            headers:{
                Authorization:`Bearer ${localStorage.getItem('token')}`
            }
            ,data:{
                name,description,isPublic:Public
            }
         })

        if(CreatingGroup.data && CreatingGroup.data.ok){
            onClose()
            reloadGroups()
        }
        
    }
    catch(err:any){
        
        console.log(err)

         if(err.response && err.response.data && err.response.data.msg){
            setError(err.response.data.msg)
         }
         else{
            setError("Something went wrong!!")
         }
         
         setShow(true)
        
    }
    finally{
        setLoading(false)
    }
   
   
  };

  const characters = 100;

  return (
    <AnimatePresence>

        <TopPopup show={show} text={error} onClose={()=> setShow(false)}/>
      { (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
          >
            <h2 className="text-xl flex items-center justify-between font-semibold text-gray-800">
              ➕ Create New Group

              <X onClick={onClose} className="hover:text-slate-500 cursor-pointer"/>
            </h2>

            <div className="mt-4 space-y-3">
              <input
                type="text"
                placeholder="Group name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full  rounded-lg border border-gray-300 px-4 py-2 text-sm outline-none focus:border-blue-500"
              />

              <textarea
                placeholder="Group description"
                value={description}
                rows={4}
                onChange={(e) => {
                    if (e.target.value.length <= characters) {
                    setDescription(e.target.value);
                    }
                    }}
                 className={`w-full resize-none border-gray-300 rounded-lg border px-4 py-2 text-sm outline-none `}
              />

              <div className="justify-end flex w-full text-slate-400">
                  <span>{characters-(description.trim().length) + " /100 characters left"}</span>
              </div>

                            <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">
                    Private Group
                </span>

                <button
                    type="button"
                    onClick={() => setPublic(prev => !prev)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                    ${!Public ? "bg-blue-600" : "bg-gray-300"}`}
                >
                    <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                        ${!Public ? "translate-x-6" : "translate-x-1"}`}
                    />
                </button>
                </div>
              
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={onClose}
                className="rounded-lg px-4 py-2 text-sm text-gray-600 hover:bg-gray-100"
              >
                Cancel
              </button>

              <button
                onClick={handleSubmit}
                className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                {loading ? <Spinner/>:'Create'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};



