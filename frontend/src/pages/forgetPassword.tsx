import axios from "axios";
import { motion } from "framer-motion";

import { Eye , Lock, Shield, Check, EyeClosed } from "lucide-react";
import { useState } from "react";
import Spinner from "../components/spinner";
import TopPopup from "../components/topPopup";

const ForgotPassword = () => {

    const [newPass,setNewPass] = useState('');
    const [confirmPass,setConfirmPass] = useState('');

    const [showpass,setShowPass] = useState(false);
    const [loading,setLoading] = useState(false)
    const [error,setError] = useState('')
    const [show,setShow] = useState(false)
const passwordRegexDetailed = {
  regex: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  
  // Individual checks for better error messages
  hasLowercase: /[a-z]/,
  hasUppercase: /[A-Z]/,
  hasNumber: /\d/,
  hasSpecialChar: /[@$!%*?&]/,
  minLength: /^.{8,}$/
};

// password strength measure ke liye
function returnPasswordStrength(){
    let strengthNum = 0;

    if(passwordRegexDetailed.hasLowercase.test(newPass)){
        strengthNum++;
    }
    if(passwordRegexDetailed.hasNumber.test(newPass)){
        strengthNum++;
    }if(passwordRegexDetailed.hasSpecialChar.test(newPass)){
        strengthNum++;
    }if(passwordRegexDetailed.hasUppercase.test(newPass)){
        strengthNum++;
    }if(passwordRegexDetailed.minLength.test(newPass)){
        strengthNum++;
    }

    return strengthNum
}

// requirements check k liye
function password_pura_points(){
    const returnIndicesArray = [];
  const array = [
                "At least 8 characters",
                "One uppercase letter",
                "One lowercase letter",
                "One number",
                "One special character"
              ]

             if(passwordRegexDetailed.hasLowercase.test(newPass)){
                returnIndicesArray.push(2);
            }
            if(passwordRegexDetailed.hasNumber.test(newPass)){
                returnIndicesArray.push(3)
            }if(passwordRegexDetailed.hasSpecialChar.test(newPass)){
                returnIndicesArray.push(4)
            }if(passwordRegexDetailed.hasUppercase.test(newPass)){
                returnIndicesArray.push(1)
            }if(passwordRegexDetailed.minLength.test(newPass)){
                returnIndicesArray.push(0)
            }

            return returnIndicesArray

}

async function ChangePassword(){
    
    setLoading(true)
    try{
       const Changing = await axios({
        url:'http://localhost:3000/user/forgetPassword',
        method:"POST",
        data:{
            email:localStorage.getItem('email'),
            newPassword:newPass 
        }
       })

       if(Changing.data && Changing.data.ok){
           localStorage.clear();
       }

       
       setError(Changing.data.msg);
       setShow(true);

    }
    catch(err:any){
        console.log(err)

        if(err.response && err.response.data && err.response.data.msg){
             setError(err.response.data.msg)
        }
        else{
             setError(err.response.data.msg)
        }

        setShow(true)
    }
    finally{
        setLoading(false)
    }
}

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center p-4 relative overflow-hidden">

        <TopPopup text={error} show={show} onClose={()=> setShow(false)}/>
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            rotate: [0, 360],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -150, 0],
            y: [0, 100, 0],
            rotate: [360, 0],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-1/2 left-1/3 w-64 h-64 bg-gradient-to-r from-green-500/5 to-emerald-500/5 rounded-full blur-3xl"
        />
      </div>

      {/* Main Card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="bg-gray-900/40 backdrop-blur-xl rounded-3xl border border-gray-700/50 shadow-2xl p-8 md:p-10">
          {/* Header */}
          <div className="text-center mb-10">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
              className="inline-flex items-center justify-center p-4 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-2xl mb-6 shadow-lg"
            >
              <Lock className="w-10 h-10 text-white" />
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent mb-2"
            >
              Reset Password
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-gray-400 text-sm"
            >
              Create a strong new password for your account
            </motion.p>
          </div>

          {/* Password Requirements */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-8 p-4 bg-gray-800/30 rounded-2xl border border-gray-700/50"
          >
            <div className="flex items-center mb-2">
              <Shield className="w-4 h-4 text-emerald-400 mr-2" />
              <h3 className="text-sm font-medium text-gray-300">Password Requirements</h3>
            </div>
            <ul className="space-y-1 text-xs text-gray-400">
              {[
                "At least 8 characters",
                "One uppercase letter",
                "One lowercase letter",
                "One number",
                "One special character"
              ].map((req, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="flex items-center"
                >
                  <div className={`w-2 h-2 rounded-full ${password_pura_points().includes(index) ? 'bg-emerald-700':'bg-emerald-200'}  mr-2`} />
                  {req}
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Form */}
          <form className="space-y-6">
            {/* New Password Field */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
            >
              <label className="block text-sm font-medium text-gray-300 mb-2">
                New Password
              </label>
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="relative"
              >
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  onChange={(e)=> setNewPass(e.target.value)}
                  required 
                  value={newPass}
                  type={showpass ? 'text':'password'}
                  className="w-full pl-12 pr-12 py-4 bg-gray-800/50 border border-gray-700 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300"
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-400 transition-colors"
                >
                  {showpass ? <EyeClosed onClick={()=> setShowPass(prev => !prev)} className="w-5 h-5"/>:<Eye className="w-5 h-5"  onClick={()=> setShowPass(prev => !prev)}/>}
                </button>
              </motion.div>
              
              {/* Password Strength Meter */}
              <div className="mt-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-400">Password strength</span>
                  <span className="text-xs font-medium text-emerald-400">Strong</span>
                </div>
                <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: "0%" }}
                    animate={{ width: `${returnPasswordStrength()*20}%` }}
                    transition={{ duration: 1, delay: 1 }}
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-500"
                  />
                </div>
              </div>
            </motion.div>

            {/* Confirm Password Field */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
            >
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Confirm New Password
              </label>
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="relative"
              >
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  value={confirmPass}
                  onChange={(e) => setConfirmPass(e.target.value)}
                  required
                  type="password"
                  className="w-full pl-12 pr-12 py-4 bg-gray-800/50 border border-gray-700 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300"
                  placeholder="Confirm new password"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 1.2 }}
                  >
                    <Check className="h-5 w-5 text-emerald-400" />
                  </motion.div>
                </div>
              </motion.div>
              
              {((newPass.trim()!=='' && confirmPass.trim()!=='') && (newPass===confirmPass)) && <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="mt-2 flex items-center text-emerald-400 text-sm"
              >
                <Check className="w-4 h-4 mr-1" />
                Passwords match
              </motion.div>}
              {/* Password Match Indicator */}
              
            </motion.div>

            {/* Submit Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                onClick={ChangePassword}
                disabled={loading || (newPass.trim()==='' || confirmPass.trim()==='')}
                className="w-full py-4 px-6 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold rounded-2xl shadow-lg transition-all duration-300 flex items-center justify-center group"
              >
                <span className="mr-2">{loading ? <Spinner/>:'Reset Password'}</span>
                <motion.svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  animate={{ rotate: [0, 360] }}
                  transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </motion.svg>
              </motion.button>
            </motion.div>
          </form>

      

          {/* Back to Login */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="mt-8 text-center"
          >
            <p className="text-gray-400 text-sm">
              Remember your password?{" "}
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="#"
                onClick={()=> window.location.href = '/login'}
                className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
              >
                Back to login
              </motion.a>
            </p>
          </motion.div>
        </div>

        {/* Floating Particles */}
        <div className="absolute -bottom-10 -left-10 w-40 h-40">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              animate={{
                y: [0, -30, 0],
                x: [0, Math.sin(i) * 15, 0],
                opacity: [0.3, 0.8, 0.3],
              }}
              transition={{
                duration: 3 + i * 0.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.2,
              }}
              className="absolute w-1 h-1 bg-emerald-400/40 rounded-full"
              style={{
                left: `${i * 20}px`,
                top: `${i * 15}px`,
              }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;