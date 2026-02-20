import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import {
  LogOut,
  LogIn,
  UserPlus,
  Users,
  UserCheck,
  Code,
  Menu,
  X,
  ChevronDown
} from "lucide-react";

const Header = () => {
  const [hasToken, setHasToken] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showGroupsDropdown, setShowGroupsDropdown] = useState(false);

  // Check token on mount and storage changes
  useEffect(() => {
    const checkToken = () => {
      const token = localStorage.getItem("token");
      setHasToken(!!token);
    };

    checkToken();

    // Listen for storage changes
    const handleStorageChange = () => checkToken();
    window.addEventListener("storage", handleStorageChange);

    // Listen for scroll
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Mock logout function
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href ='/login'
};

  // Mock login function
  const handleLogin = () => {
    window.location.href ='/login'
  };

  const token = localStorage.getItem('token') || ''
 const userProfile = {
  name:'',
  image:""
 }
  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-gray-900/90 backdrop-blur-xl border-b border-gray-800/50"
            : "bg-linear-to-r from-gray-900 via-gray-900 to-gray-950"
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo / Brand */}
            <motion.div
              onClick={()=> token ? window.location.href = '/user/dashboard':'/'}
              whileHover={{ scale: 1.05 }}
              className="flex cursor-pointer items-center space-x-3"
            >
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
                className="p-2 bg-linear-to-br from-blue-600 to-purple-600 rounded-xl"
              >
                <Code className="w-6 h-6 text-white" />
              </motion.div>
              <div>
                <motion.span
                  className="text-2xl font-bold bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
                  animate={{ 
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
                  }}
                  transition={{ 
                    duration: 5, 
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  style={{ 
                    backgroundSize: "200% 100%",
                    backgroundImage: "linear-gradient(to right, #60a5fa, #8b5cf6, #60a5fa)"
                  }}
                >
                  CodeTribe
                </motion.span>
                <p className="text-xs text-gray-400">Develop Together</p>
              </div>
            </motion.div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-4">
              <AnimatePresence>
                {hasToken ? (
                  <>
                    {/* Groups Dropdown */}
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
                        className="flex items-center px-4 py-2 rounded-xl bg-gray-800/50 hover:bg-gray-800 text-gray-300 hover:text-white transition-all duration-300"
                      >
                        <Users className="w-4 h-4 mr-2" />
                        Groups
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
                            className="absolute top-full left-0 mt-2 w-48 bg-gray-900/95 backdrop-blur-xl rounded-2xl border border-gray-800 shadow-2xl overflow-hidden"
                          >
                            <motion.a
                              whileHover={{ x: 5, backgroundColor: "rgba(30, 41, 59, 0.5)" }}
                              href="/my-groups"
                              className="flex items-center px-4 py-3 text-gray-300 hover:text-white transition-colors"
                            >
                              <Users className="w-4 h-4 mr-3 text-blue-400" />
                              My Groups
                            </motion.a>
                            <div className="h-px bg-gray-800" />
                            <motion.a
                              whileHover={{ x: 5, backgroundColor: "rgba(30, 41, 59, 0.5)" }}
                              href="/user/joinGroups"
                              className="flex items-center px-4 py-3 text-gray-300 hover:text-white transition-colors"
                            >
                              <UserCheck className="w-4 h-4 mr-3 text-green-400" />
                              Join Groups
                            </motion.a>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>

                    {/* Profile & Logout */}
                    <motion.div
                      key="auth-buttons"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="flex items-center cursor-pointer space-x-4"
                    >
                       <motion.div
                          onClick={()=> window.location.href = '/user/profileDetails'}
                          whileHover={{ scale: 1.1 }}
                          className="relative"
                        >
                        <div className="w-10 h-10 rounded-full bg-linear-to-br from-blue-600 to-purple-600 flex items-center justify-center overflow-hidden border-2 border-gray-700/50">
                          {userProfile?.image || "" ? (
                            <img
                              src={userProfile.image}
                              alt={userProfile.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-white font-bold text-lg">
                              {userProfile?.name?.[0]?.toUpperCase() || "U"}
                            </span>
                          )}
                          
                          
                          
                        </div>
                      </motion.div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleLogout}
                        className="px-4 py-2 bg-linear-to-r from-red-600/20 to-red-600/10 hover:from-red-600/30 hover:to-red-600/20 text-red-400 border border-red-500/30 rounded-xl flex items-center transition-all duration-300"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Logout
                      </motion.button>
                    </motion.div>
                  </>
                ) : (
                  <motion.div
                    key="guest-buttons"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex items-center space-x-2"
                  >
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleLogin}
                      className="px-4 py-2 bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl flex items-center transition-all duration-300"
                    >
                      <LogIn className="w-4 h-4 mr-2" />
                      Login
                    </motion.button>
                    <motion.button
                     onClick={()=> window.location.href ='/register'}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 bg-gray-800/50 hover:bg-gray-800 text-gray-300 hover:text-white border border-gray-700 rounded-xl flex items-center transition-all duration-300"
                    >
                      <UserPlus className="w-4 h-4 mr-2" />
                      Register
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </nav>

            {/* Mobile Menu Button */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-xl bg-gray-800/50 hover:bg-gray-800 text-gray-300"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden border-t border-gray-800/50 bg-gray-900/95 backdrop-blur-xl"
            >
              <div className="container mx-auto px-4 py-4 space-y-2">
                {hasToken ? (
                  <>
                    <motion.a
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.1 }}
                      href="/my-groups"
                      className="flex items-center px-4 py-3 rounded-xl bg-gray-800/50 text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
                    >
                      <Users className="w-5 h-5 mr-3 text-blue-400" />
                      My Groups
                    </motion.a>
                    <motion.a
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.15 }}
                      onClick={()=> window.location.href = '/user/joinGroups'}
                      className="flex items-center px-4 py-3 rounded-xl bg-gray-800/50 text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
                    >
                      <UserCheck className="w-5 h-5 mr-3 text-green-400" />
                      Join Groups
                    </motion.a>
                    <motion.button
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      onClick={handleLogout}
                      className="w-full flex items-center justify-center px-4 py-3 rounded-xl bg-linear-to-r from-red-600 to-red-700 text-white"
                    >
                      <LogOut className="w-5 h-5 mr-2" />
                      Logout
                    </motion.button>
                  </>
                ) : (
                  <>
                    <motion.button
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.1 }}
                      onClick={handleLogin}
                      className="w-full flex items-center justify-center px-4 py-3 rounded-xl bg-linear-to-r from-blue-600 to-purple-600 text-white"
                    >
                      <LogIn className="w-5 h-5 mr-2" />
                      Login
                    </motion.button>
                    <motion.button
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.15 }}
                      className="w-full flex items-center justify-center px-4 py-3 rounded-xl bg-gray-800 text-gray-300 border border-gray-700"
                    >
                      <UserPlus className="w-5 h-5 mr-2" />
                      Register
                    </motion.button>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Decorative Elements */}
      <div className="fixed top-0 left-0 right-0 h-1 z-50 overflow-hidden">
        <motion.div
          className="h-full bg-linear-to-r from-blue-500 via-purple-500 to-blue-500"
          animate={{ 
            x: ["-100%", "100%"]
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

      {/* Background Blobs */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
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
          className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"
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
          className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"
        />
      </div>

      {/* Spacer for fixed header */}
      <div className="h-16" />
    </>
  );
};

export default Header;