import { motion } from "framer-motion";

export default function SurpriseContent() {
  return (
    <motion.div
      
      
      
      className="fixed top-0 left-0 w-full h-screen flex items-center justify-center bg-pink-100 backdrop-blur-sm z-50"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-2xl p-6 w-[80%] max-w-md text-center shadow-2xl"
      >
        <h1 className="text-2xl font-bold mb-4">🎉 Surprise 🎉</h1>
        <p>Add your photos & message here 💕</p>
      </motion.div>
    </motion.div>
  );
}