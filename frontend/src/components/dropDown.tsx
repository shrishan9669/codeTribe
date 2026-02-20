import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {socket} from '../socket/socket'
interface Props {
  language: string
  setLanguage: (lang: string) => void
  groupId:string
}

const languages = [
  { label: "JavaScript", value: "javascript", icon: "🟨" },
  { label: "TypeScript", value: "typescript", icon: "🔷" },
  { label: "Python", value: "python", icon: "🐍" },
  { label: "C++", value: "cpp", icon: "⚙️" },
  { label: "Java", value: "java", icon: "☕" },
]

export default function LanguageDropdown({ language, setLanguage,groupId }: Props) {
  const [open, setOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const selected = languages.find(l => l.value === language)

  // close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  function handleChange(value:any){
    setLanguage(value)
    
    socket.emit('language-set',{groupId,language:value})
    setOpen(false)
  }

  return (
    <div className="relative w-56" ref={dropdownRef}>
      
      {/* Button */}
      <button
        onClick={() => setOpen(prev => !prev)}
        className="w-full flex items-center justify-between px-4 py-2 rounded-xl 
                   bg-slate-800 text-white shadow-md hover:bg-slate-700 
                   transition-all duration-200"
      >
        <span className="flex items-center gap-2">
          <span>{selected?.icon}</span>
          {selected?.label}
        </span>
        <span className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}>
          ▼
        </span>
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute mt-2 w-full bg-slate-900 text-white rounded-xl shadow-xl overflow-hidden z-50"
          >
            {languages.map((lang) => (
              <button
                key={lang.value}
                onClick={()=> handleChange(lang.value)}
                className="w-full px-4 py-2 flex items-center gap-2 
                           hover:bg-slate-700 transition-all duration-150 text-left"
              >
                <span>{lang.icon}</span>
                {lang.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
