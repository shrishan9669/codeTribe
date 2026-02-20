
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import {
  User,
  Mail,
  Key,
  Code,
  Camera,
  Edit2,
  Save,
  Lock,
  Shield,
  CheckCircle,
  X,
  Plus,
  Eye,
  EyeOff,
  Globe,
  Github,
  Linkedin,
  Twitter,
  Edit,
  Link2,
  Trash2,
  Upload
} from "lucide-react";

import axios from "axios";
import { LiaLinkedin } from "react-icons/lia";
import TopPopup from "../../components/topPopup";
import Spinner from "../../components/spinner";

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [techStack, setTechStack] = useState<String[]>([]);
  const [newTech, setNewTech] = useState("");

  // Mock user data
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    bio: "",
    location: "",
    github: "",
    linkdin: "",
    });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const handleSaveProfile = async () => {
     

    setLoading({
        id:'updatingprofile',
        loading:true
    })
    try{
        const Updating = await axios({
            url:'http://localhost:3000/user/updateProfile',
            method:'POST',
            data:userData,
            headers:{
                Authorization:`Bearer ${localStorage.getItem('token')}`
            }
        })

        if(Updating.data && Updating.data.ok){
            setError(Updating.data.msg)
            setShow(true)
        }
    }
    catch(err:any){
        console.log(err)
        setError(err?.response?.data?.msg)
        setShow(true)
    }
    finally{
        setLoading({
            id:'updatingprofile',
            loading:false
        })
    }
    // Add save logic here
  };

  const handleAddTech = () => {
    if (newTech.trim() && !techStack.includes(newTech.trim())) {
      setTechStack([...techStack, newTech.trim()]);
      setNewTech("");
    }
  };

  const handleRemoveTech = (tech:any) => {
    setTechStack(techStack.filter(t => t !== tech));
  };

  const [loading,setLoading] = useState({
    id:'',
    loading:false
  })
  const handleChangePassword = async() => {
    // Add password change logic here
    if(passwordData.newPassword !== passwordData.confirmPassword){
        setError(`New password and confirm password doesn't match`)
        setShow(true)
        return ;
    }

    setLoading({
        id:'changepassword',
        loading:true
    })
    try{
      const changing = await axios({
        url:'http://localhost:3000/user/updatePassword',
        method:'POST',
        headers:{
            Authorization:`Bearer ${localStorage.getItem('token')}`,
        
        },
        data:{
            currentPassword:passwordData.currentPassword,
            newPassword:passwordData.newPassword
        }
      })

      if(changing.data && changing.data.ok){
        setError(changing.data.msg)
        setShow(true)

        Get_User_Details()
      }
    }
    catch(err:any){
        console.log(err)
        setError(err?.response?.data?.msg || "Some went wrong!!")
        setShow(true)
    }
    finally{
        setLoading({
            id:'changepassword',
            loading:false
        })
    
    }

   
  };

  const [error,setError] = useState('')
  const [show,setShow] = useState(false)

  async function Get_User_Details(){
    try{
       const Details = await axios({
        url:'http://localhost:3000/user/User',
        method:"GET",
        headers:{
            Authorization:`Bearer ${localStorage.getItem('token')}`
        }
       })

       if(Details.data && Details.data.ok){
        setUserData(Details.data.user)
        setTechStack(Details.data.user.techStack)
        setError(Details.data.msg)
        setShow(true)
       } 
    }
    catch(err:any){
        console.log(err)
        setError(err?.response?.data?.msg || "Something went wrong.")
        setShow(true)
    }
  }

  const passwordRegexDetailed = {
    regex: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    
    // Individual checks for better error messages
    hasLowercase: /[a-z]/,
    hasUppercase: /[A-Z]/,
    hasNumber: /\d/,
    hasSpecialChar: /[@$!%*?&]/,
    minLength: /^.{8,}$/
    };

    // requirements check k liye
function password_pura_points(){
    const returnIndicesArray = [];
  
             if(passwordRegexDetailed.hasLowercase.test(passwordData.newPassword)){
                returnIndicesArray.push(2);
            }
            if(passwordRegexDetailed.hasNumber.test(passwordData.newPassword)){
                returnIndicesArray.push(3)
            }if(passwordRegexDetailed.hasSpecialChar.test(passwordData.newPassword)){
                returnIndicesArray.push(4)
            }if(passwordRegexDetailed.hasUppercase.test(passwordData.newPassword)){
                returnIndicesArray.push(1)
            }if(passwordRegexDetailed.minLength.test(passwordData.newPassword)){
                returnIndicesArray.push(0)
            }

            return returnIndicesArray

}

  useEffect(()=>{
    Get_User_Details()
  },[])

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-black to-gray-900 py-8 px-4">
        <TopPopup show={show} onClose={()=> setShow(false)} text={error}/>
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden -z-10">
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-20 left-20 w-96 h-96 bg-linear-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -150, 0],
            y: [0, 100, 0],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute bottom-20 right-20 w-80 h-80 bg-linear-to-r from-emerald-500/10 to-teal-500/10 rounded-full blur-3xl"
        />
      </div>

      <div className="max-w-6xl mx-auto">
        {/* Banner Section */}
        <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative bg-linear-to-r from-blue-900/20 via-purple-900/20 to-pink-900/20 rounded-3xl overflow-hidden mb-24 pt-28 md:mb-32"
        >
        <div className="relative">
            {/* Banner Background */}
            <div className="h-48 md:h-56 bg-linear-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20" />
            
            {/* linear Overlay */}
            <div className="absolute inset-0 bg-linear-to-t from-gray-900 via-transparent to-transparent" />
        </div>
        
        {/* Profile Info Card - Moved UP to show properly */}
        <div className="absolute -bottom-20 left-4 right-4 md:left-8 md:right-8">
            <div className="bg-gray-900/90 backdrop-blur-xl rounded-2xl border border-gray-700/50 shadow-2xl p-4 md:p-6 lg:p-8">
            <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-6 lg:space-x-8">
                {/* Profile Picture */}
                <motion.div
                whileHover={{ scale: 1.05 }}
                className="relative -mt-16 md:-mt-20"
                >
                <div className="w-28 h-28 md:w-36 md:h-36 lg:w-40 lg:h-40 rounded-2xl bg-linear-to-br from-blue-600 to-purple-600 flex items-center justify-center overflow-hidden border-4 border-gray-900 shadow-2xl">
                    <User className="w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 text-white" />
                </div>
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="absolute bottom-2 right-2 p-2 bg-gray-900/80 backdrop-blur-sm rounded-full border border-gray-700 shadow-lg"
                >
                    <Camera className="w-3 h-3 md:w-4 md:h-4 text-white" />
                </motion.button>
                </motion.div>

                {/* User Info */}
                <div className="flex-1 text-center md:text-left">
                <div className="flex flex-col md:flex-row md:items-start justify-between mb-4 space-y-4 md:space-y-0">
                    <div className="flex-1">
                    <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2">
                        {userData.name}
                    </h1>
                    <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-6 text-gray-400">
                        <div className="flex items-center justify-center md:justify-start">
                        <Mail className="w-4 h-4 mr-2 shrink-0" />
                        <span className="text-sm md:text-base truncate">{userData.email}</span>
                        </div>
                        <div className="flex items-center justify-center md:justify-start">
                        <Globe className="w-4 h-4 mr-2 shrink-0" />
                        <span className="text-sm md:text-base">{userData.location}</span>
                        </div>
                    </div>
                    </div>
                   
                </div>

                <p className="text-gray-300 text-sm md:text-base mb-6 leading-relaxed">
                    {userData.bio}
                </p>

                {/* Tech Stack */}
                <div className="mb-6">
                    <div className="flex items-center mb-3">
                    <Code className="w-5 h-5 text-blue-400 mr-2" />
                    <h3 className="text-lg font-semibold text-white">Tech Stack</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                    {techStack.map((tech, index) => (
                        <motion.div
                        
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="group relative"
                        >
                        <span className="px-3 py-1.5 bg-gray-800/50 border border-gray-700 rounded-full text-sm text-gray-300">
                            {tech}
                        </span>
                        
                        </motion.div>
                    ))}
                    
                    </div>
                </div>

                {/* Social Links */}
                <div className="flex items-center justify-center md:justify-start space-x-4">
                    <motion.a
                    whileHover={{ scale: 1.1, y: -2 }}
                    href={`https://github.com/${userData.github}`}
                    className="p-2 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                    >
                    <Github className="w-5 h-5 text-gray-400" />
                    </motion.a>
                    <motion.a
                    whileHover={{ scale: 1.1, y: -2 }}
                    href={`https://linkedin.com/in/${userData.linkdin}`}
                    className="p-2 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                    >
                    <LiaLinkedin className="w-5 h-5 text-blue-400" />
                    </motion.a>
                    
                </div>
                </div>
            </div>
            </div>
        </div>
        </motion.div>

        {/* Main Content */}
        <div className="mt-24">
          {/* Tabs */}
          <div className="flex space-x-1 bg-gray-900/50 backdrop-blur-sm rounded-2xl p-1 mb-8 max-w-2xl mx-auto">
            {[
              { id: "profile", label: "Profile Details", icon: User },
              { id: "password", label: "Change Password", icon: Lock },
              { id: "edit", label: "Edit Details", icon: Edit }
            ].map((tab) => (
              <motion.button
                key={tab.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all duration-300 flex items-center justify-center ${activeTab === tab.id
                    ? "bg-linear-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                    : "text-gray-400 hover:text-gray-300"
                  }`}
              >
                <tab.icon className="w-4 h-4 mr-2" />
                {tab.label}
              </motion.button>
            ))}
          </div>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            {/* Profile Details Tab */}
            {activeTab === "profile" && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="max-w-2xl mx-auto"
              >
                <div className="bg-gray-900/40 backdrop-blur-xl rounded-3xl border border-gray-700/50 p-6 md:p-8">
                  <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                    <User className="w-6 h-6 mr-3 text-blue-400" />
                    Personal Information
                  </h2>

                  <div className="space-y-6">
                    {/* Name Field */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Full Name
                      </label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                        <input
                          type="text"
                          value={userData.name}
                          onChange={(e) => setUserData({...userData, name: e.target.value})}
                          disabled={!isEditing}
                          className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white disabled:text-gray-400 disabled:bg-gray-800/30 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                        />
                      </div>
                    </div>

                    {/* Email Field */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                        <input
                          type="email"
                          value={userData.email}
                          onChange={(e) => setUserData({...userData, email: e.target.value})}
                          disabled={!isEditing}
                          className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white disabled:text-gray-400 disabled:bg-gray-800/30 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                        />
                      </div>
                    </div>

                    {/* Bio Field */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Bio
                      </label>
                      <textarea
                        value={userData.bio}
                        onChange={(e) => setUserData({...userData, bio: e.target.value})}
                        disabled={!isEditing}
                        rows={4}
                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white disabled:text-gray-400 disabled:bg-gray-800/30 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 resize-none"
                      />
                    </div>

                    {/* Location Field */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Location
                      </label>
                      <div className="relative">
                        <Globe className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                        <input
                          type="text"
                          value={userData.location}
                          onChange={(e) => setUserData({...userData, location: e.target.value})}
                          disabled={!isEditing}
                          className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white disabled:text-gray-400 disabled:bg-gray-800/30 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                        />
                      </div>
                    </div>

                    {isEditing && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="pt-6 border-t border-gray-800"
                      >
                        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                          <Github className="w-5 h-5 mr-2" />
                          Social Links
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {['github', 'linkedin', 'twitter'].map((platform) => (
                            <div key={platform}>
                              <label className="block text-xs font-medium text-gray-400 mb-1 capitalize">
                                {platform}
                              </label>
                              <input
                                type="text"
                                value={""}
                                onChange={(e) => setUserData({...userData, [platform]: e.target.value})}
                                className="w-full px-3 py-2 bg-gray-800/30 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                                placeholder={`Your ${platform} username`}
                              />
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Change Password Tab */}
            {activeTab === "password" && (
              <motion.div
                key="password"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="max-w-2xl mx-auto"
              >
                <div className="bg-gray-900/40 backdrop-blur-xl rounded-3xl border border-gray-700/50 p-6 md:p-8">
                  <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                    <Shield className="w-6 h-6 mr-3 text-emerald-400" />
                    Change Password
                  </h2>

                  <div className="space-y-6">
                    {/* Current Password */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Current Password
                      </label>
                      <div className="relative">
                        <Key className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                        <input
                          type={showCurrentPassword ? "text" : "password"}
                          value={passwordData.currentPassword}
                          onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                          className="w-full pl-12 pr-12 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300"
                          placeholder="Enter current password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-400"
                        >
                          {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    {/* New Password */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        New Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                        <input
                          type={showNewPassword ? "text" : "password"}
                          value={passwordData.newPassword}
                          onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                          className="w-full pl-12 pr-12 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300"
                          placeholder="Enter new password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-400"
                        >
                          {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    {/* Confirm Password */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Confirm New Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          value={passwordData.confirmPassword}
                          onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                          className="w-full pl-12 pr-12 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300"
                          placeholder="Confirm new password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-400"
                        >
                          {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    {/* Password Requirements */}
                    <div className="p-4 bg-gray-800/30 rounded-xl border border-gray-700/50">
                      <h3 className="text-sm font-medium text-gray-300 mb-2 flex items-center">
                        <Shield className="w-4 h-4 mr-2 text-emerald-400" />
                        Password Requirements
                      </h3>
                      <ul className="space-y-1 text-xs text-gray-400">
                        {[
                            "At least 8 characters",
                            "One uppercase letter",
                            "One lowercase letter",
                            "One number",
                            "One special character"
                        ].map((req, index) => (
                          <li key={index} className="flex items-center">
                            <CheckCircle className={`w-3 h-3 ${password_pura_points().includes(index) ? 'text-emerald-400':'text-emerald-50'}  mr-2`} />
                            {req}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Change Password Button */}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleChangePassword}
                      disabled={loading.id==='changepassword' && loading.loading}
                      className="w-full py-4 px-6 bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold rounded-xl shadow-lg transition-all duration-300 flex items-center justify-center"
                    >
                      <Lock className="w-5 h-5 mr-2" />
                      {loading.id==='changepassword' && loading.loading   ? <Spinner/>:'Change Password'}
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'edit' && (
                <motion.div
                    key="edit-tab"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="max-w-2xl mx-auto"
                >
                    <div className="bg-gray-900/40 backdrop-blur-xl rounded-3xl border border-gray-700/50 p-6 md:p-8">
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                        <Edit2 className="w-6 h-6 mr-3 text-blue-400" />
                        Edit Profile
                    </h2>

                    <div className="space-y-6">
                        {/* Profile Picture Upload */}
                        <div>
                        <label className="block text-sm font-medium text-gray-300 mb-3">
                            Profile Picture
                        </label>
                        <div className="flex items-center space-x-6">
                            <motion.div
                            whileHover={{ scale: 1.05 }}
                            className="relative"
                            >
                            <div className="w-24 h-24 rounded-2xl bg-linear-to-br from-blue-600 to-purple-600 flex items-center justify-center overflow-hidden border-4 border-gray-800">
                                <User className="w-12 h-12 text-white" />
                            </div>
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="absolute -bottom-2 -right-2 p-2 bg-gray-900 border border-gray-700 rounded-full shadow-lg"
                            >
                                <Camera className="w-4 h-4 text-white" />
                            </motion.button>
                            </motion.div>
                            <div className="flex-1">
                            <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-3">
                                <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                id="profile-upload"
                                />
                                <motion.label
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                htmlFor="profile-upload"
                                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-700 rounded-xl cursor-pointer flex items-center justify-center"
                                >
                                <Upload className="w-4 h-4 mr-2" />
                                Upload New Photo
                                </motion.label>
                                <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-xl flex items-center justify-center"
                                >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Remove Photo
                                </motion.button>
                            </div>
                            <p className="text-xs text-gray-500 mt-2">
                                Recommended: Square image, at least 400x400px
                            </p>
                            </div>
                        </div>
                        </div>

                        {/* Name Field */}
                        <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Full Name
                        </label>
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                            <input
                            type="text"
                            value={userData.name}
                            onChange={(e) => setUserData({...userData, name: e.target.value})}
                            className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                            placeholder="Enter your full name"
                            />
                        </div>
                        </div>

                        {/* Email Field */}
                        <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Email Address
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                            <input
                            type="email"
                            value={userData.email}
                            onChange={(e) => setUserData({...userData, email: e.target.value})}
                            className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                            placeholder="Enter your email address"
                            />
                        </div>
                        </div>

                        {/* Bio Field */}
                        <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Bio
                        </label>
                        <textarea
                            value={userData.bio}
                            onChange={(e) => setUserData({...userData, bio: e.target.value})}
                            rows={4}
                            className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 resize-none"
                            placeholder="Tell us about yourself..."
                        />
                        </div>

                        {/* Location Field */}
                        <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Location
                        </label>
                        <div className="relative">
                            <Globe className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                            <input
                            type="text"
                            value={userData.location}
                            onChange={(e) => setUserData({...userData, location: e.target.value})}
                            className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                            placeholder="Enter your location"
                            />
                        </div>
                        </div>

                        {/* Tech Stack */}
                        <div>
                        <div className="flex items-center justify-between mb-3">
                            <label className="block text-sm font-medium text-gray-300">
                            Tech Stack
                            </label>
                            <span className="text-xs text-gray-500">
                            {techStack.length}/10 skills
                            </span>
                        </div>
                        
                        {/* Current Tech Stack */}
                        <div className="flex flex-wrap gap-2 mb-4">
                            {techStack.map((tech, index) => (
                            <motion.div
                               
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: index * 0.1 }}
                                className="group relative"
                            >
                                <span className="px-3 py-1.5 bg-gray-800/50 border border-gray-700 rounded-full text-sm text-gray-300">
                                {tech}
                                </span>
                                <motion.button
                                whileHover={{ scale: 1.1 }}
                                onClick={() => handleRemoveTech(tech)}
                                className="absolute -top-1 -right-1 p-1 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                <X className="w-2 h-2 text-white" />
                                </motion.button>
                            </motion.div>
                            ))}
                        </div>

                        {/* Add New Tech */}
                        <div className="flex items-center space-x-3">
                            <div className="flex-1 relative">
                            <input
                                type="text"
                                value={newTech}
                                onChange={(e) => setNewTech(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleAddTech()}
                                className="w-full pl-4 pr-10 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                                placeholder="Add a new skill (e.g., React, Node.js)"
                            />
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={handleAddTech}
                                disabled={!newTech.trim() || techStack.length >= 10}
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1.5 bg-linear-to-r from-blue-600 to-purple-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Plus className="w-4 h-4 text-white" />
                            </motion.button>
                            </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                            Press Enter or click + to add. Click on skill to remove.
                        </p>
                        </div>

                        {/* Social Links */}
                        <div className="pt-4 border-t border-gray-800">
                        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                            <Link2 className="w-5 h-5 mr-2 text-blue-400" />
                            Social Links
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[
                            { platform: 'github', icon: Github, placeholder: 'username', color: 'text-gray-400' },
                            { platform: 'linkedin', icon: Linkedin, placeholder: 'username', color: 'text-blue-400' }
                           
                            ].map(({ platform, icon: Icon, placeholder, color }) => (
                            <div key={platform}>
                                <label className="block text-xs font-medium text-gray-400 mb-1 capitalize">
                                {platform === 'portfolio' ? 'Website' : platform}
                                </label>
                                <div className="relative">
                                <Icon className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${color}`} />
                                <input
                                    type="text"
                                    value={platform==='github' ? userData.github:userData.linkdin}
                                    onChange={(e) => setUserData({...userData, [platform]: e.target.value})}
                                    className="w-full pl-10 pr-3 py-2.5 bg-gray-800/30 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    placeholder={placeholder}
                                />
                                </div>
                            </div>
                            ))}
                        </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-6 border-t border-gray-800">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setActiveTab('profile')}
                            className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-700 rounded-xl flex items-center justify-center"
                        >
                            <X className="w-4 h-4 mr-2" />
                            Cancel
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleSaveProfile}
                            disabled={loading.id==='updatingprofile' && loading.loading}
                            className="px-6 py-3 bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl flex items-center justify-center"
                        >
                            <Save className="w-4 h-4 mr-2" />
                            
                            {loading.id==='updatingprofile' && loading.loading  ? <Spinner/>:"Save Changes"}
                        </motion.button>
                        </div>
                    </div>
                    </div>
                </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;