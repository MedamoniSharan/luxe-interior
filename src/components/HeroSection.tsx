import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Lottie from 'lottie-react';
import heroAnimation from '../assets/hero-animation.json';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface HeroSectionProps {
  showAuthButtons?: boolean;
}

const HeroSection = ({ showAuthButtons = false }: HeroSectionProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const slides = [
    {
      title: "Transform Your Living Space",
      subtitle: "Luxury interior design solutions that reflect your personality",
      cta: "Explore Our Designs",
      link: "/services"
    },
    {
      title: "Ready-to-Install Solutions",
      subtitle: "We bring your dream interior to life with premium fitting services",
      cta: "View Services",
      link: "/services"
    },
    {
      title: "Elegance in Every Detail",
      subtitle: "Discover our curated collection of high-end interior elements",
      cta: "See Collection",
      link: "/services"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [slides.length]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900 overflow-hidden">
      {/* Background particles */}
      <div className="absolute inset-0 opacity-10">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute animate-float rounded-full bg-white"
            style={{
              width: `${Math.random() * 10 + 5}px`,
              height: `${Math.random() * 10 + 5}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 10 + 10}s`
            }}
          />
        ))}
      </div>

      <div className="container-custom flex flex-col md:flex-row h-screen pt-24">
        {/* Text Content */}
        <motion.div 
          className="flex-1 flex flex-col justify-center text-white z-10 pt-8 md:pt-0"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {slides.map((slide, index) => (
            <div 
              key={index} 
              className={`transition-opacity duration-700 ${
                currentSlide === index ? 'opacity-100' : 'opacity-0 absolute'
              }`}
            >
              <motion.span 
                className="text-secondary-400 uppercase tracking-widest font-semibold mb-2 block"
                variants={itemVariants}
              >
                Premium Interior Design
              </motion.span>
              <motion.h1 
                className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold mb-4 text-white"
                variants={itemVariants}
              >
                {slide.title}
              </motion.h1>
              <motion.p 
                className="text-lg text-gray-300 mb-8 max-w-xl"
                variants={itemVariants}
              >
                {slide.subtitle}
              </motion.p>
              <motion.div variants={itemVariants}>
                <Link 
                  to={slide.link} 
                  className="btn btn-secondary group"
                >
                  {slide.cta}
                  <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
                </Link>
              </motion.div>
            </div>
          ))}

          {showAuthButtons && (
            <motion.div 
              variants={itemVariants}
              className="flex gap-4 mt-6"
            >
              <Link to="/login" className="btn btn-secondary">
                Login
                <ArrowRight className="ml-2" size={20} />
              </Link>
              <Link to="/signup" className="btn btn-outline border-white text-white hover:bg-white/10">
                Sign Up
                <ArrowRight className="ml-2" size={20} />
              </Link>
            </motion.div>
          )}
        </motion.div>

        {/* Animation/Image */}
        <motion.div 
          className="flex-1 flex items-center justify-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <div className="relative w-full max-w-lg">
            <Lottie 
              animationData={heroAnimation} 
              className="w-full h-auto" 
              loop={true}
            />
          </div>
        </motion.div>
      </div>

      {/* Slide indicators */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              currentSlide === index ? 'bg-secondary-400 w-10' : 'bg-white/50'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroSection;