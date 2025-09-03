import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import HeroSection from '../components/HeroSection';
import SearchSection from '../components/SearchSection';
import TopRatedSection from '../components/TopRatedSection';
import CategorySection from '../components/CategorySection';
import TestimonialSection from '../components/TestimonialSection';
import { ArrowRight, Award, Clock, PenTool as Tool } from 'lucide-react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    document.title = 'Luxe Interiors | Premium Home Interior Design';
  }, []);

  const features = [
    {
      icon: Award,
      title: 'Premium Quality',
      description: 'We use only the highest quality materials for all our designs and installations.'
    },
    {
      icon: Clock,
      title: 'Quick Installation',
      description: 'Our expert team ensures a fast and hassle-free installation process.'
    },
    {
      icon: Tool,
      title: 'Custom Solutions',
      description: 'Choose from our designs and we\'ll customize them to fit your space perfectly.'
    }
  ];

  return (
    <div>
      {/* Hero Section */}
      <HeroSection showAuthButtons={!isAuthenticated} />

      {/* Search Section */}
      <SearchSection />

      {/* Top Rated Section */}
      <TopRatedSection />

      {/* Category Section */}
      <CategorySection />

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <motion.h2 
              className="section-title"
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              Why Choose Us
            </motion.h2>
            <motion.p 
              className="section-subtitle mx-auto"
              initial={{ opacity: 0, y: -10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              We pride ourselves on providing exceptional interior solutions
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div 
                key={index}
                className="bg-gray-50 rounded-xl p-8 text-center transition-all hover:shadow-elegant"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <feature.icon size={28} className="text-primary-600" />
                </div>
                <h3 className="text-xl font-serif font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <TestimonialSection />

      {/* CTA Section */}
      <section className="py-20 bg-gray-50">
        <div className="container-custom">
          <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-2xl overflow-hidden shadow-elegant-lg">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/2 p-10 md:p-16">
                <motion.h2 
                  className="text-3xl md:text-4xl font-serif font-bold text-white mb-4"
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  Ready to Transform Your Home?
                </motion.h2>
                <motion.p 
                  className="text-white/90 mb-8"
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  Explore our catalog of premium interior designs and let our experts bring your vision to life.
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <Link 
                    to="/services" 
                    className="btn btn-secondary group"
                  >
                    Browse Our Designs
                    <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
                  </Link>
                </motion.div>
              </div>
              <div className="md:w-1/2 relative">
                <img
                  src="https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg"
                  alt="Luxury living room"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-l from-transparent to-primary-800/70 md:bg-none"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;