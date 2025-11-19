import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const About = () => {
  const offers = [
      { icon: "BOOK", title: "Curated resources for skill development and career growth", color: "from-blue-500 to-purple-600" },
      { icon: "WELL", title: "Health and wellness information and support", color: "from-green-500 to-teal-600" },
      { icon: "TEAM", title: "Community forums and networking opportunities", color: "from-pink-500 to-red-600" },
      { icon: "STUDY", title: "Educational content and mentorship programs", color: "from-yellow-500 to-orange-600" },
      { icon: "EVENT", title: "Events and workshops focused on empowerment", color: "from-indigo-500 to-blue-600" },
    ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-6xl mx-auto"
    >
      <motion.div variants={itemVariants} className="mb-8">
        <Link
          to="/"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors duration-300"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Home
        </Link>
      </motion.div>

      <motion.div variants={itemVariants} className="text-center mb-12">
        <h2 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
          About Empower Her
        </h2>
        <p className="text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
          Empower Her is a vibrant platform dedicated to advancing gender equality and women's empowerment worldwide.
          We align with UN Sustainable Development Goal 5 (Gender Equality) by providing resources, community support,
          and opportunities for women to thrive in every aspect of life.
        </p>
      </motion.div>

      <motion.div variants={itemVariants} className="mb-12">
        <div className="bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 rounded-2xl p-8 shadow-xl">
          <h3 className="text-4xl font-semibold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-6 text-center">
            Our Mission
          </h3>
          <p className="text-xl text-gray-700 text-center max-w-4xl mx-auto leading-relaxed">
            To create a supportive ecosystem where women can access education, health resources, economic opportunities,
            and community networks to break barriers and achieve their full potential. We believe in celebrating
            diversity, fostering innovation, and building a world where every woman can lead with confidence.
          </p>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="mb-12">
        <h3 className="text-4xl font-semibold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent mb-8 text-center">
          What We Offer
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {offers.map((offer, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ scale: 1.05, rotateY: 5 }}
              className={`bg-gradient-to-br ${offer.color} p-6 rounded-xl shadow-lg text-white cursor-pointer`}
            >
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center text-white font-bold text-sm mb-4">
                {offer.icon}
              </div>
              <p className="text-lg font-medium leading-relaxed">{offer.title}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="text-center">
        <div className="bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 rounded-2xl p-8 shadow-xl">
          <h3 className="text-4xl font-semibold text-white mb-6">
            Join Our Global Movement
          </h3>
          <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
            Be part of the movement. Whether you're seeking resources, sharing your story, or want to contribute
            to the community, Empower Her welcomes you with open arms. Together, we can create lasting change.
          </p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block"
          >
            <Link
              to="/resources"
              className="bg-white text-purple-600 px-8 py-3 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 inline-block"
            >
              Start Your Journey
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default About;