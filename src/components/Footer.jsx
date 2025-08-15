import React from 'react'
import { Leaf } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Leaf className="h-8 w-8 text-primary-400" />
              <span className="text-xl font-bold">eGrowtify</span>
            </div>
            <p className="text-gray-300 mb-4">
              Smart garden management system that helps you grow healthy plants with AI-powered insights and automated care.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="/" className="text-gray-300 hover:text-white transition-colors">Home</a></li>
              <li><a href="/features" className="text-gray-300 hover:text-white transition-colors">Features</a></li>
              <li><a href="/login" className="text-gray-300 hover:text-white transition-colors">Login</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <p className="text-gray-300">support@egrowtify.com</p>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 eGrowtify. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer

