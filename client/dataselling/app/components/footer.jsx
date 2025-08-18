// components/Footer.js
import Link from 'next/link';
import { Phone, Clock, MapPin, MessageCircle, Home, ArrowUpRight, Activity, Mail, Github, Twitter, Linkedin, Send, Sparkles, Globe, Zap } from 'lucide-react';

const Footer = () => {
  const adminPhone = "+";
  const whatsappLink = `https://whatsapp.com/channel/0029VbB174796H4JCaqzq43S`;

  return (
    <footer className="relative bg-black border-t border-gray-800">
      {/* Gradient overlay at top */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent"></div>
      
      <div className="container mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-cyan-500 blur-lg opacity-50"></div>
                <Activity className="relative text-emerald-400" size={32} />
              </div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                dataSwap
              </h2>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Your premium data service provider. Fast, reliable, and secure data solutions at your fingertips.
            </p>
            {/* Social Links */}
            <div className="flex space-x-3 pt-4">
              <a href="#" className="p-2 rounded-lg bg-gray-900/50 border border-gray-800 hover:border-emerald-500/50 hover:bg-emerald-500/10 transition-all duration-200 group">
                <Twitter size={16} className="text-gray-400 group-hover:text-emerald-400 transition-colors" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-gray-900/50 border border-gray-800 hover:border-cyan-500/50 hover:bg-cyan-500/10 transition-all duration-200 group">
                <Linkedin size={16} className="text-gray-400 group-hover:text-cyan-400 transition-colors" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-gray-900/50 border border-gray-800 hover:border-violet-500/50 hover:bg-violet-500/10 transition-all duration-200 group">
                <Github size={16} className="text-gray-400 group-hover:text-violet-400 transition-colors" />
              </a>
            </div>
          </div>

          {/* Operating Hours */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-6 flex items-center">
              <Clock size={18} className="mr-2 text-amber-400" />
              Operating Hours
            </h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 rounded-full bg-emerald-400 mt-2 animate-pulse"></div>
                <div>
                  <p className="text-gray-300 text-sm font-medium">Monday - Saturday</p>
                  <p className="text-gray-500 text-sm">8:00 AM - 9:00 PM</p>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 rounded-full bg-cyan-400 mt-2 animate-pulse"></div>
                <div>
                  <p className="text-gray-300 text-sm font-medium">Sunday</p>
                  <p className="text-gray-500 text-sm">Orders processed Monday morning</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-6 flex items-center">
              <Zap size={18} className="mr-2 text-violet-400" />
              Quick Access
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-gray-400 hover:text-white text-sm transition-colors duration-200 flex items-center group">
                  <ArrowUpRight size={14} className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/mtn" className="text-gray-400 hover:text-white text-sm transition-colors duration-200 flex items-center group">
                  <ArrowUpRight size={14} className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  MTN Data
                </Link>
              </li>
              <li>
                <Link href="/at" className="text-gray-400 hover:text-white text-sm transition-colors duration-200 flex items-center group">
                  <ArrowUpRight size={14} className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  AT Data
                </Link>
              </li>
              <li>
                <Link href="/telecel" className="text-gray-400 hover:text-white text-sm transition-colors duration-200 flex items-center group">
                  <ArrowUpRight size={14} className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Telecel Data
                </Link>
              </li>
              <li>
                <Link href="/orders" className="text-gray-400 hover:text-white text-sm transition-colors duration-200 flex items-center group">
                  <ArrowUpRight size={14} className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Order History
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Section */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-6 flex items-center">
              <MessageCircle size={18} className="mr-2 text-rose-400" />
              Get in Touch
            </h3>
            <div className="space-y-4">
              {/* Phone */}
              <a 
                href={`tel:${adminPhone}`}
                className="flex items-center space-x-3 p-3 rounded-xl bg-gray-900/30 border border-gray-800 hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all duration-200 group"
              >
                <div className="p-2 rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 group-hover:scale-110 transition-transform">
                  <Phone size={14} className="text-black" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Call Admin</p>
                  <p className="text-sm text-gray-300 font-medium">+233 55 044 7846</p>
                </div>
              </a>

              {/* WhatsApp */}
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-3 p-3 rounded-xl bg-gray-900/30 border border-gray-800 hover:border-green-500/50 hover:bg-green-500/5 transition-all duration-200 group"
              >
                <div className="p-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 group-hover:scale-110 transition-transform">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="black"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-gray-500">WhatsApp</p>
                  <p className="text-sm text-gray-300 font-medium">Join our group</p>
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="border-t border-gray-800 pt-8 mb-8">
          <div className="max-w-2xl mx-auto text-center">
            <h4 className="text-lg font-semibold text-white mb-3 flex items-center justify-center">
              <Sparkles className="mr-2 text-amber-400" size={20} />
              Stay Updated
            </h4>
            <p className="text-gray-400 text-sm mb-6">Get exclusive offers and updates on new data packages</p>
            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <div className="relative flex-1">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={16} />
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full pl-10 pr-4 py-3 bg-gray-900/50 border border-gray-800 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 focus:bg-gray-900/70 transition-all duration-200"
                />
              </div>
              <button
                type="submit"
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-cyan-500 blur-lg opacity-50 group-hover:opacity-75 transition-opacity rounded-xl"></div>
                <div className="relative bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-black px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center">
                  Subscribe
                  <Send size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-center md:text-left">
              <p className="text-gray-400 text-sm">
                &copy; {new Date().getFullYear()} <span className="font-semibold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">dataSwap</span>. All rights reserved.
              </p>
              <p className="text-gray-600 text-xs mt-1">
                Powered by <span className="text-violet-400 font-medium">jessica</span>
              </p>
            </div>
            <div className="flex space-x-6 text-sm">
              <Link href="#" className="text-gray-500 hover:text-gray-300 transition-colors">
                Privacy Policy
              </Link>
              <Link href="#" className="text-gray-500 hover:text-gray-300 transition-colors">
                Terms of Service
              </Link>
              <Link href="#" className="text-gray-500 hover:text-gray-300 transition-colors">
                Support
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative gradient line at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent"></div>
    </footer>
  );
};

export default Footer;