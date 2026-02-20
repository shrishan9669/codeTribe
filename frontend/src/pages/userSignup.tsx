import  { useState } from 'react';
import { motion } from 'framer-motion';
import { TECH_STACK_OPTIONS } from '../lists';
import axios from 'axios';
import TopPopup from '../components/topPopup';
import Spinner from '../components/spinner';

type FormData = {
  name: string;
  email: string;
  password: string;
  techStack: string[];
};
const UserSignup = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
    techStack:[]
  });
  const [error,setError] = useState('')
  const [show,setShow] = useState(false)
  const [loading,setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false);


  const handleChange = (e:any) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const inputVariants = {
    focus: {
      scale: 1.02,
      transition: { duration: 0.2 }
    }
  };

  function addTech(value:string){

    const hasSome = formData.techStack.some(each => each===value);
    console.log(hasSome)
    if(!hasSome){
      setFormData(prev => ({...prev,techStack:[...prev.techStack,value]}))
      console.log(formData.techStack)
    }
  }

  function removeTech(value:string){

    setFormData(prev => ({...prev,techStack:prev.techStack.filter(each=> each!==value)}))
  }

  

  async function RegisterReq(e:any){
    e.preventDefault()

    const hasEmtpyField = Object.keys(formData).some(eachKey => {
      if(eachKey==='techStack') return false;

      const value = formData[eachKey as keyof FormData]
      return typeof value==='string' &&  value.trim()===''
    })

    if(hasEmtpyField){
      alert("All fields required!!");
      return ;
    }

    setLoading(true)
    try{
         const Sending = await axios({
            url:'http://localhost:3000/user/createUser',
            data:formData,
            method:'POST'
         })

         setError(Sending.data.msg)
         setShow(true)
    }
    catch(err:any){
        console.log(err)
         if (err.response && err.response.data && err.response.data.msg) {
          setError(err.response.data.msg);
          
        } else {
          setError("Something went wrong. Please try again.");
        }
        setShow(true)
    }
    finally{
      setLoading(false)
    }
  }
  

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center p-4">
      <TopPopup text={error} show={show} onClose={()=> setShow(false)}/>
     
      <motion.div
       
        initial="hidden"
        animate="visible"
        className="bg-gray-800/30 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-700/50 p-8 w-full max-w-md"
      >
        <div className="text-center mb-10">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            className="inline-block p-3  from-blue-500 to-purple-600 rounded-xl mb-4"
          >
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-3xl font-bold text-white mb-2"
          >
            Welcome Back
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-gray-400"
          >
            Create your account
          </motion.p>
        </div>

        <form className="space-y-6">
          {/* Name Field */}
          <motion.div whileHover={{ scale: 1.01 }} whileFocus="focus">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Full Name
            </label>
            <motion.div variants={inputVariants}>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter your full name"
              />
            </motion.div>
          </motion.div>

          {/* Email Field */}
          <motion.div whileHover={{ scale: 1.01 }} whileFocus="focus">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Email Address
            </label>
            <motion.div variants={inputVariants}>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter your email"
              />
            </motion.div>
          </motion.div>

          {/* Password Field */}
          <motion.div whileHover={{ scale: 1.01 }} whileFocus="focus">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Password
            </label>
            <motion.div className='flex justify-between items-center w-full px-2   border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200' variants={inputVariants}>
              <input
                type={showPassword ? "text":'password'}
                name="password"
                value={formData.password}
                onChange={handleChange} 
                className="h-full w-full px-4 py-3 outline-0"
                placeholder="Enter your password"
              />

              <button 
              className='className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"'
              type='button'
              onClick={()=> setShowPassword(!showPassword)}
              >
               {showPassword ? (
            // 👁️ Eye Off Icon
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.015.15-1.994.43-2.918M6.1 6.1A9.955 9.955 0 0112 5c5.523 0 10 4.477 10 10a9.96 9.96 0 01-4.43 8.316M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3l18 18"
              />
            </svg>
             ) : (
            // 👁️ Eye Icon
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
          )}
              </button>
             
              
            </motion.div>
            </motion.div>


               {/* Tech stack array */}
            <motion.div whileHover={{ scale: 1.01 }} whileFocus="focus">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Add tech Stack
            </label>
            <div className='flex flex-wrap gap-2' >
                    {
                        formData.techStack.map(each =>{
                            return <span className='px-3 py-2 rounded-2xl bg-black text-white flex items-center gap-2 cursor-pointer'>{each} <span onClick={()=> removeTech(each)} className='cursor-pointer'>X</span></span>
                        })
                    }
                </div>
            <motion.div variants={inputVariants} >
              <select onChange={(e)=>addTech(e.target.value)} className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl mt-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" name="" id="">
                
                <option value="" hidden>Select</option>
                {
                    TECH_STACK_OPTIONS.map(each => {
                        return <option value={each} key={each}>
                              {each}
                        </option>
                    })
                }
              </select>
            </motion.div>
          </motion.div>

        

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type='button'
            disabled={loading}
            onClick={RegisterReq}
            className={`w-full py-3.5 px-4  bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg transition-all duration-200 flex items-center justify-center ${loading ? 'cursor-not-allowed':''}`}
          >
            <span>{loading ? <Spinner/>:'Sign up'}</span>
            <motion.svg
              className="w-5 h-5 ml-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              animate={{ x: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </motion.svg>
          </motion.button>
        </form>

        

        

        {/* Sign in Link */}
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-8 text-center text-gray-400 text-sm"
        >
          Already have an account?{' '}
          <motion.a
            onClick={()=> window.location.href = "/login"}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            href="#"
            className="text-blue-400 hover:text-blue-300 font-medium transition-colors duration-200"
          >
            Sign in
          </motion.a>
        </motion.p>
      </motion.div>

      {/* Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -100, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
        />
      </div>
    </div>
  );
};

export default UserSignup;