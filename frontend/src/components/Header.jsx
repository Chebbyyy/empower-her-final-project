import React from 'react';
import { motion } from 'framer-motion';

function Header() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white p-8 text-center mb-8 shadow-2xl"
    >
      <motion.h1
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6, type: "spring", stiffness: 100 }}
        className="text-5xl font-bold mb-2 bg-gradient-to-r from-white to-accent-200 bg-clip-text text-transparent"
      >
        Empower Her
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="text-xl opacity-90 font-light"
      >
        Building a Better Future for Women
      </motion.p>
    </motion.header>
  );
}

export default Header;
