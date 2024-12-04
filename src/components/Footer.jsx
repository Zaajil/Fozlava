import { motion } from 'framer-motion'
import { Heart,  Twitter, Mail, Instagram } from 'lucide-react'

const Footer = () => {
  const currentYear = new Date().getFullYear()
  
  const socialLinks = [
    {
      name: 'Instagram',
      href: 'https://www.instagram.com/fc_students_union?igsh=MTRld2Fwc2FoZ3ZkNw==',
      icon: Instagram,
    },
    {
      name: 'Twitter',
      href: 'https://twitter.com',
      icon: Twitter,
    },
    {
      name: 'Email',
      href: 'fcstudentsunion@gmail.com',
      icon: Mail,
    },
  ]



  return (
    <footer className="relative mt-auto">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 pointer-events-none" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-center items-center w-full mb-8">
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.2 }}
    className="space-y-4 text-center"
  >
    <h3 className="text-lg font-semibold text-white">Connect With Us</h3>
    <div className="flex justify-center space-x-4">
      {socialLinks.map((social) => (
        <a
          key={social.name}
          href={social.href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-300 hover:text-white transition-colors duration-200"
          aria-label={social.name}
        >
          <social.icon className="w-5 h-5" />
        </a>
      ))}
    </div>
  </motion.div>
</div>


        {/* Copyright */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="pt-8 mt-8 border-t border-white/10"
        >
          <p className="text-center text-gray-300 text-sm flex items-center justify-center gap-1">
            Made with <Heart className="w-4 h-4 text-red-500" /> © {currentYear}
          </p>
        </motion.div>
      </div>
    </footer>
  )
}

export default Footer