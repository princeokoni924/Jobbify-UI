import React from 'react'
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import {CheckCircle} from 'lucide-react'
const SuccessScreen = () => {
              return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 1, y: 0.9 }}
          animate={{ opacity: 1, y: 1 }}
        >
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
            <div className="mb-6">
              <CheckCircle className="w-20 h-20 text-green-500 mx-auto" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">
              Application submitted!
            </h2>

            <p className="text-gray-600 mb-6">
              Your application has been successfully submitted. The employer
              will review your application and get back to you soon.
            </p>
            <div className="animate-spin w-6 h-6 border-4 border-blue-600 border-t-transparent rounded-full mx-auto" />
            <p className="text-sm text-gray-500">
              Redirecting to browse jobs, Please wait....
            </p>
          </div>
        </motion.div>
      </div>
    );
}

export default SuccessScreen;