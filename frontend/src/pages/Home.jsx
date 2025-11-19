import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Entrepreneur",
    content: "EmpowerHer gave me the confidence and resources I needed to start my own business. The community support is incredible!",
    avatar: "SJ"
  },
  {
    id: 2,
    name: "Maria Rodriguez",
    role: "Software Engineer",
    content: "The educational resources and mentorship programs helped me transition into tech. I'm now leading a team of developers!",
    avatar: "MR"
  },
  {
    id: 3,
    name: "Aisha Patel",
    role: "Community Leader",
    content: "This platform connected me with amazing women who share my vision. Together, we're creating real change in our communities.",
    avatar: "AP"
  },
  {
    id: 4,
    name: "Emma Thompson",
    role: "Healthcare Professional",
    content: "The wellness resources and support network have been transformative. I feel empowered in every aspect of my life.",
    avatar: "ET"
  }
];

function TestimonialsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <div className="relative max-w-4xl mx-auto">
      <div className="overflow-hidden rounded-2xl bg-gradient-to-r from-primary-50 to-secondary-50 p-8 shadow-xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white font-bold text-xl mb-4">
              {testimonials[currentIndex].avatar}
            </div>
            <blockquote className="text-lg text-gray-700 mb-6 italic">
              "{testimonials[currentIndex].content}"
            </blockquote>
            <div>
              <h4 className="font-semibold text-primary-700">{testimonials[currentIndex].name}</h4>
              <p className="text-sm text-gray-600">{testimonials[currentIndex].role}</p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation buttons */}
      <button
        onClick={prevTestimonial}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-3 shadow-lg transition-all duration-300"
      >
        <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={nextTestimonial}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-3 shadow-lg transition-all duration-300"
      >
        <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Dots indicator */}
      <div className="flex justify-center mt-6 space-x-2">
        {testimonials.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? 'bg-primary-600 scale-125'
                : 'bg-gray-300 hover:bg-primary-300'
            }`}
          />
        ))}
      </div>
    </div>
  );
}

function HomePage() {
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

  const keyAreas = [
      { title: "Education and Skill Development", color: "from-blue-500 to-purple-600", icon: "EDU" },
      { title: "Health and Wellness", color: "from-green-500 to-teal-600", icon: "HLTH" },
      { title: "Economic Empowerment", color: "from-yellow-500 to-orange-600", icon: "ECON" },
      { title: "Community Support", color: "from-pink-500 to-red-600", icon: "COMM" },
      { title: "Leadership Development", color: "from-indigo-500 to-blue-600", icon: "LEAD" },
    ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="text-center"
    >
      <motion.div variants={itemVariants}>
        <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
          Welcome to Empower Her
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          A vibrant platform dedicated to women's empowerment and gender equality, celebrating diversity and strength.
        </p>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="inline-block"
        >
          <Link
            to="/register"
            className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-3 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Join Our Community
          </Link>
        </motion.div>
      </motion.div>

      <motion.section variants={itemVariants} className="mb-12 mt-12">
        <h2 className="text-4xl font-semibold bg-gradient-to-r from-empower-purple to-secondary-600 bg-clip-text text-transparent mb-6">
          Our Mission
        </h2>
        <p className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
          To provide resources, support, and community for women striving for equality and empowerment in all aspects of life.
          We believe in creating a world where every woman can thrive, innovate, and lead.
        </p>
      </motion.section>

      <motion.section variants={itemVariants} className="mb-12">
        <h2 className="text-4xl font-semibold bg-gradient-to-r from-empower-green to-accent-600 bg-clip-text text-transparent mb-8">
          Key Areas of Focus
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {keyAreas.map((area, index) => (
            <motion.div
              key={area.title}
              variants={itemVariants}
              whileHover={{ scale: 1.05, rotateY: 5 }}
              className={`bg-gradient-to-br ${area.color} p-6 rounded-xl shadow-lg text-white cursor-pointer`}
            >
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center text-white font-bold text-sm mb-3">
                {area.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{area.title}</h3>
              <p className="text-sm opacity-90">Empowering women through comprehensive support and resources.</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      <motion.section variants={itemVariants} className="mb-12">
        <h2 className="text-4xl font-semibold bg-gradient-to-r from-yellow-600 to-pink-600 bg-clip-text text-transparent mb-8">
          What Women Are Saying
        </h2>
        <TestimonialsCarousel />
      </motion.section>

      <motion.section variants={itemVariants} className="mb-12">
        <h2 className="text-4xl font-semibold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-8 text-center">
          Featured Women
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          {[
            { name: "Michelle Obama", role: "Girls’ education advocate", image: "/images/Michelle Obama.jpg" },
            { name: "Malala Yousafzai", role: "Girls’ rights & education activist", image: "/images/Malala.jpg" },
            { name: "Graça Machel", role: "Women & children’s rights leader", image: "/images/Graca.jpg" },
            { name: "Purity Kagwiria", role: "Young women’s leadership mentor", image: "/images/purity.jpg" }
          ].map((woman, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05, y: -5 }}
              className="text-center"
            >
              <div className="relative mb-4">
                <img
                  src={woman.image}
                  alt={woman.name}
                  className="w-32 h-32 rounded-full mx-auto object-cover shadow-lg border-4 border-white"
                />
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">★</span>
                </div>
              </div>
              <h3 className="font-semibold text-gray-800 mb-1">{woman.name}</h3>
              <p className="text-sm text-gray-600">{woman.role}</p>
            </motion.div>
          ))}
        </div>
        <div className="text-center mt-8">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              to="/gallery"
              className="inline-block bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              View Women's inspiration gallery →
            </Link>
          </motion.div>
        </div>
      </motion.section>

      <motion.section variants={itemVariants} className="mb-8">
        <h2 className="text-4xl font-semibold bg-gradient-to-r from-empower-gold to-empower-pink bg-clip-text text-transparent mb-6">
          Start Your Journey
        </h2>
        <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
          Explore resources, connect with inspiring women, and take steps towards empowerment.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              to="/resources"
              className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all duration-300"
            >
              Explore Resources
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              to="/about"
              className="bg-gradient-to-r from-purple-500 to-pink-600 text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all duration-300"
            >
              Learn More
            </Link>
          </motion.div>
        </div>
      </motion.section>
    </motion.div>
  );
}

export default HomePage;
