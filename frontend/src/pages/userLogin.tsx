import { motion } from "framer-motion";

import TopPopup from "../components/topPopup";
import axios from "axios";
import { GoogleLogin } from "@react-oauth/google";
import Spinner from "../components/spinner";




interface Logindetails{
    email:string,
    password:string
}
const LoginPage = () => {
    
    const [formData,setFormdata] = useState<Logindetails>({
        email:"",
        password:""
    })
      const [error,setError] = useState('')
      const [show,setShow] = useState(false)
      const [loading,setLoading] = useState(false)
      const [showPassword, setShowPassword] = useState(false);
      

      const [showOTP,setShowOTP] = useState(false)

    function handleChange(e:any){
         setFormdata(prev => ({
            ...prev,
            [e.target.name]:e.target.value
         }))

    }

    async function Loginreq(e:any){

      e.preventDefault()
      setLoading(true)
        try{
            const LoginRes = await axios({
                url:`http://localhost:3000/user/userLogin?email=${formData.email}&password=${formData.password}`,
                method:'GET',
            })

            if(LoginRes.data && LoginRes.data.ok){
                localStorage.setItem('token',LoginRes.data.token)
                window.location.href='/user/dashboard'
            }
            setError(LoginRes.data.msg);
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
        finally{
            setLoading(false)
        }
    }

    async function HandleGoogleSignin(response: any) {
      console.log("token -> " + response.credential)
      try {
        const token = response.credential;
        const res = await axios.post(
          "http://localhost:3000/user/google-login",
          { token },
        );

        if (res.data && res.data.ok) {
        
          localStorage.setItem('email', res.data.email);
          localStorage.setItem('name', res.data.name);
          localStorage.setItem('token', res.data.token);
          window.location.href='/user/dashboard'
         
        }
        
        setError(res.data.msg);
        setShow(true)
      } catch (err: any) {
        if (err.response && err.response.data && err.response.data.msg) {
          setError(err.response.data.msg);
        } else {
          setError("Something went wrong. Try again later.");
        }
        setShow(true)
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
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -150, 0],
            y: [0, 100, 0],
            rotate: [360, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-r from-cyan-500/10 to-pink-500/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-1/2 left-1/3 w-64 h-64 bg-gradient-to-r from-emerald-500/5 to-teal-500/5 rounded-full blur-3xl"
        />
      </div>

      {/* Main Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="bg-gray-900/40 backdrop-blur-xl rounded-3xl border border-gray-700/50 shadow-2xl p-8 md:p-10">
          {/* Logo/Header Section */}
          <div className="text-center mb-10">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
              className="inline-flex items-center justify-center p-4 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl mb-6 shadow-lg"
            >
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2"
            >
              Welcome Back
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-gray-400 text-sm"
            >
              Sign in to access your account
            </motion.p>
          </div>

          {/* Form */}
          <form onSubmit={Loginreq} className="space-y-6">
            {/* Email Field */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileFocus={{ scale: 1.02 }}
                className="relative"
              >
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </div>
                <input
                  required
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-4 bg-gray-800/50 border border-gray-700 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  placeholder="you@example.com"
                />
              </motion.div>
            </motion.div>

            {/* Password Field */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-300">
                  Password
                </label>
                <motion.a
                onClick={()=> setShowOTP(true)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  href="#"
                  className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Forgot password?
                </motion.a>
              </div>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileFocus={{ scale: 1.02 }}
                className="relative"
              >
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  required
                  type={showPassword ? "text":"password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-12 pr-12 py-4 bg-gray-800/50 border border-gray-700 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  placeholder="Enter your password"
                />
               <button 
              className='absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700'
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

      
            {/* Sign In Button */}
            <motion.div

              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <motion.button
                
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-2xl shadow-lg transition-all duration-300 flex items-center justify-center group"
              >
                <span className="mr-2">{loading ? <Spinner/>:'Sign in'}</span>
                <motion.svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  animate={{ x: [0, 5, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </motion.svg>
              </motion.button>
            </motion.div>
          </form>

          {/* Divider */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="my-8"
          >
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-700/50"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-gray-900/40 text-gray-500">Or continue with</span>
              </div>
            </div>
          </motion.div>

          {/* Google Sign In */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
          >

            <GoogleLogin
                    onSuccess={HandleGoogleSignin}
                    onError={() => {
                      setError("Google login failed. Please try again.")
                      setShow(true)
                    }}
                    shape="rectangular"
                    size="large"
                    width="100%"
                    text="continue_with"
                    logo_alignment="left"
                  />
          </motion.div>

          {/* Sign Up Link */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1 }}
            className="mt-8 text-center"
          >
            <p className="text-gray-400 text-sm">
              Don't have an account?{" "}
              <motion.a
                onClick={()=> window.location.href = "/register"}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="#"
                className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
              >
                Sign up
              </motion.a>
            </p>
          </motion.div>
        </div>

        {/* Floating Particles */}
        <div className="absolute -top-10 -right-10 w-20 h-20">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              animate={{
                y: [0, -20, 0],
                x: [0, Math.sin(i) * 10, 0],
              }}
              transition={{
                duration: 2 + i,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.3,
              }}
              className="absolute w-2 h-2 bg-blue-400/30 rounded-full"
              style={{
                left: `${i * 30}px`,
                top: `${i * 20}px`,
              }}
            />
          ))}
        </div>
      </motion.div>

      {showOTP && <OtpSend_ToEmail onClose={()=> setShowOTP(false)}/>}
    </div>
  );
};


import { AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useState } from "react";

function OtpSend_ToEmail({ onClose }: any) {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [isOTPSent, setIsOTPSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error,setError] = useState('')
  const [show,setShow] = useState(false)

  async function Send_OTP() {
    setIsLoading(true);
    try {
      const OTPRes = await axios({
        url: `http://localhost:3000/user/send-otp?email=${email}`,
        method: "GET",
      });

      if (OTPRes.data && OTPRes.data.ok) {
        localStorage.setItem("otp", OTPRes.data.otp);
        localStorage.setItem('email',email);
        setIsOTPSent(true);
      }

      setError(OTPRes.data.msg);
      setShow(true);
    } catch (err: any) {
      console.log(err);

      if (err.response && err.response.data && err.response.data.msg) {
        setError(err.response.data.msg);
      } else {
        setError("Something went wrong!!");
      }
      setShow(true);
    } finally {
      setIsLoading(false);
    }
  }

  async function Verify_OTP() {
    // Add your OTP verification logic here
    if(localStorage.getItem('otp')===otp){
      localStorage.removeItem('otp')
      window.location.href = '/forgetPassword'
    }
    else{
      setError("OTP doesn't match.")
      setShow(true)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
    >

      <TopPopup text={error} show={show} onClose={()=> setShow(false)}/>

      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        transition={{ type: "spring", damping: 25 }}
        className="w-full max-w-md bg-gradient-to-br from-gray-900 to-gray-950 rounded-3xl border border-gray-800 shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="relative p-8 border-b border-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl shadow-lg">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  {isOTPSent ? "Verify OTP" : "Secure Verification"}
                </h2>
                <p className="text-gray-400 text-sm mt-1">
                  {isOTPSent
                    ? "Enter the 6-digit code sent to your email"
                    : "Enter your email to receive verification code"}
                </p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="p-2 hover:bg-gray-800/50 rounded-xl transition-colors"
            >
              <X className="w-5 h-5 text-gray-400" />
            </motion.button>
          </div>

          {/* Progress Indicator */}
          <div className="flex items-center justify-center mt-6">
            <div className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${!isOTPSent
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                    : "bg-gray-800 text-gray-400"
                  }`}
              >
                1
              </div>
              <div className="w-16 h-1 mx-2 bg-gray-800">
                <motion.div
                  className="h-full bg-gradient-to-r from-blue-600 to-purple-600"
                  initial={{ width: "0%" }}
                  animate={{ width: isOTPSent ? "100%" : "0%" }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${isOTPSent
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                    : "bg-gray-800 text-gray-400"
                  }`}
              >
                2
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          <AnimatePresence mode="wait">
            {!isOTPSent ? (
              <motion.div
                key="email-form"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-6"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Email Address
                  </label>
                  <motion.div whileHover={{ scale: 1.02 }} className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <svg
                        className="w-5 h-5 text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                        />
                      </svg>
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-gray-800/50 border border-gray-700 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                      placeholder="Enter your email address"
                    />
                  </motion.div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={Send_OTP}
                  disabled={isLoading || !email}
                  className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-700 disabled:to-gray-800 disabled:cursor-not-allowed text-white font-semibold rounded-2xl shadow-lg transition-all duration-300 flex items-center justify-center"
                >
                  {isLoading ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 mr-2 border-2 border-white border-t-transparent rounded-full"
                      />
                      Sending OTP...
                    </>
                  ) : (
                    <>
                      Send Verification Code
                      <svg
                        className="w-5 h-5 ml-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 7l5 5m0 0l-5 5m5-5H6"
                        />
                      </svg>
                    </>
                  )}
                </motion.button>

                <div className="text-center">
                  <p className="text-gray-400 text-sm">
                    We'll send a 6-digit verification code to your email
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="otp-form"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-6"
              >
                {/* Email Display */}
                <div className="p-4 bg-gray-800/30 rounded-2xl border border-gray-700/50">
                  <p className="text-gray-400 text-sm mb-1">OTP sent to:</p>
                  <div className="flex items-center">
                    <svg
                      className="w-4 h-4 text-blue-400 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    <p className="text-white font-medium">{email}</p>
                  </div>
                </div>

                {/* OTP Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    6-Digit Verification Code
                  </label>
                  <div className="grid grid-cols-6 gap-3 mb-6">
                    {[...Array(6)].map((_, index) => (
                      <motion.div
                        key={index}
                        whileHover={{ scale: 1.05 }}
                        whileFocus={{ scale: 1.05 }}
                        className="relative"
                      >
                        <input
                          type="text"
                          
                          value={otp[index] || ""}
                          onChange={(e) => {
                            const newOtp = otp.split("");
                            newOtp[index] = e.target.value;
                            setOtp(newOtp.join("").slice(0, 6));
                          }}
                          className="w-full aspect-square text-center text-2xl font-bold bg-gray-800/50 border border-gray-700 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                        />
                      </motion.div>
                    ))}
                  </div>

                  {/* Resend Timer */}
                  <div className="flex items-center justify-between mb-6">
                    <p className="text-gray-400 text-sm">
                      Code expires in:{" "}
                      <span className="text-blue-400 font-semibold">04:59</span>
                    </p>
                    <button onClick={Send_OTP} className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
                     {isLoading ? <Spinner/>:"Resend OTP"}
                    </button>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={Verify_OTP}
                  disabled={otp.length !== 6}
                  className="w-full py-4 px-6 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:from-gray-700 disabled:to-gray-800 disabled:cursor-not-allowed text-white font-semibold rounded-2xl shadow-lg transition-all duration-300 flex items-center justify-center"
                >
                  Verify & Continue
                  <svg
                    className="w-5 h-5 ml-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-800 bg-gray-900/30">
          <p className="text-center text-gray-500 text-sm">
            Can't find the code? Check your spam folder
          </p>
        </div>
      </motion.div>

      {/* Background Animation */}
      <div className="absolute inset-0 -z-10">
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -100, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"
        />
      </div>
    </motion.div>
  );
}





export default LoginPage;