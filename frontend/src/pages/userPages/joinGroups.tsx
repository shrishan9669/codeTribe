import axios from "axios"
import { useEffect, useState } from "react"
import TopPopup from "../../components/topPopup"
import Spinner from "../../components/spinner"

interface GroupDetails{
    id:number,
    name:string,
    description:string,
    _count:{
        members:number
    }
}
export default function JoinGroups(){
    const[show,setShow] = useState(false)
    const[error,setError] = useState('')
    const[loading,setLoading] = useState(false)
    
    const[publicLoader,setPublicLoader] = useState({
      id:-1,
      loading:false
    })

    const [groups,setGroups] = useState<GroupDetails[]>([])
    async function Show_Groups(){

    setLoading(true)
      try{
         const Get_Groups = await axios({
            url:'http://localhost:3000/user/groups/toJoin',
            method:'GET',
            headers:{
                Authorization:`Bearer ${localStorage.getItem('token')}`
            }
         })

         if(Get_Groups.data && Get_Groups.data.ok){
             setGroups(Get_Groups.data.Groups)
             setError(Get_Groups.data.msg)
             setShow(true)
         }
      }
      catch(err:any){
        console.log(err)
        setError(err?.response?.data?.msg || "Something went wrong")
        setShow(true)
      }
      finally{
        setLoading(false)
      }
    }

    async function JoinGroup(groupId:any){

      setPublicLoader({
        id:groupId,
        loading:true
      })

      try{
          const Joining = await axios({
            url:`http://localhost:3000/user/groups/${groupId}/join`,
            method:"POST",
            headers:{
              Authorization:`Bearer ${localStorage.getItem('token')}`
            }
          })

          if(Joining.data && Joining.data.ok){
            setError("You can see your dashboard to see joined groups.")
            setShow(true)
            Show_Groups()
          }
      }
      catch(err:any){
        console.log(err)
        setError(err?.response?.data?.msg)
        setShow(true)
      }
      finally{
        setPublicLoader({
          id:groupId,
          loading:false
        })
      }
    }
    

   useEffect(()=>{
    Show_Groups()
   },[])
  return (
  <div className="min-h-screen bg-slate-100 p-6 md:p-10">

    <TopPopup text={error} show={show} onClose={()=> setShow(false)}/>
    {/* Header */}
    <div className="flex items-center justify-between mb-8">
      <h1 className="text-2xl md:text-3xl font-bold text-slate-800">
        🌍 Explore Groups
      </h1>

      <button
        onClick={Show_Groups}
        className="rounded-xl bg-blue-600 px-6 py-2 text-white hover:bg-blue-700 transition shadow"
      >
        {loading ? <Spinner/>:'Show Groups'}
      </button>
    </div>

    

    {/* Groups Grid */}
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {groups.map((group, index) => (
        <div
          key={index}
          className="rounded-2xl bg-white p-6 shadow-sm hover:shadow-lg transition duration-300 flex flex-col justify-between"
        >
          <div>
            <h2 className="text-lg font-semibold text-slate-800">
              {group.name}
            </h2>

            <p className="mt-2 text-sm text-slate-500 line-clamp-3">
              {group.description}
            </p>

            <div className="mt-4 inline-block rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-600">
              {group._count.members} Members
            </div>
          </div>

          <button
          onClick={()=> JoinGroup(group.id)}
          className="mt-6 w-full rounded-xl bg-blue-600 py-2 text-sm font-medium text-white hover:bg-blue-700 transition">
            {publicLoader.id===group.id  && publicLoader.loading  ? <Spinner/>:'Join Group'}
          </button>
        </div>
      ))}
    </div>

    {/* Empty State */}
    { groups.length === 0  && (
      <div className="mt-10 text-center text-slate-500">
        No groups available to join.
      </div>
    )}
  </div>
);

}