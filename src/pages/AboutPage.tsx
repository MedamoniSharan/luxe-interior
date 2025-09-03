import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Award, ShieldCheck, Clock, PenTool as Tool, CheckCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const AboutPage = () => {
  useEffect(() => {
    document.title = 'About Us | Luxe Interiors';
  }, []);

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  const valueProps = [
    {
      icon: Award,
      title: 'Premium Quality',
      description: 'We use only the highest quality materials for all our designs and installations.'
    },
    {
      icon: ShieldCheck,
      title: '5-Year Warranty',
      description: 'All our products come with a 5-year warranty against manufacturing defects.'
    },
    {
      icon: Clock,
      title: 'Timely Delivery',
      description: 'We value your time and ensure prompt delivery and installation.'
    },
    {
      icon: Tool,
      title: 'Expert Installation',
      description: 'Our skilled craftsmen ensure flawless installation every time.'
    }
  ];

  return (
    <div className="min-h-screen pt-24 pb-16">
      {/* Hero section */}
      <div className="bg-gradient-to-r from-primary-800 to-primary-900 text-white py-16">
        <div className="container-custom">
          <motion.h1 
            className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            About Luxe Interiors
          </motion.h1>
          <motion.p 
            className="text-white/80 max-w-2xl text-lg"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Revolutionizing home interior design with premium, ready-to-install solutions
          </motion.p>
        </div>
      </div>

      {/* Our Story */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              variants={fadeIn}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-serif font-bold text-primary-800 mb-6">Our Story</h2>
              <div className="border-l-4 border-secondary-400 pl-6 mb-6">
                <p className="text-lg text-gray-700 italic font-serif">
                  "We believe everyone deserves to live in a space that reflects their unique personality and enhances their daily life."
                </p>
              </div>
              <p className="text-gray-600 mb-4">
                Founded in 2020, Luxe Interiors was born from a vision to simplify the process of creating beautiful living spaces. We noticed that traditional interior design services were often time-consuming, expensive, and stressful for homeowners.
              </p>
              <p className="text-gray-600 mb-4">
                Our innovative approach allows customers to browse and select pre-designed interior elements online, which are then custom-fitted to their homes by our expert installation team. This revolutionary model combines the convenience of online shopping with the precision of professional installation.
              </p>
              <p className="text-gray-600">
                Today, we're proud to be at the forefront of the interior design industry in India, having transformed thousands of homes across the country.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="relative"
            >
              <div className="aspect-video rounded-2xl overflow-hidden shadow-elegant-lg">
                <img 
                  src="https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg" 
                  alt="Luxury interior design" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 w-48 h-48 rounded-xl overflow-hidden shadow-elegant border-4 border-white">
                <img 
                  src="https://images.pexels.com/photos/1571458/pexels-photo-1571458.jpeg" 
                  alt="Interior design detail" 
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <motion.h2 
              className="section-title"
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              Our Values
            </motion.h2>
            <motion.p 
              className="section-subtitle mx-auto"
              initial={{ opacity: 0, y: -10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              What sets us apart and drives everything we do
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {valueProps.map((value, index) => (
              <motion.div 
                key={index}
                className="bg-white rounded-xl p-8 text-center shadow-elegant h-full"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <value.icon size={28} className="text-secondary-600" />
                </div>
                <h3 className="text-xl font-serif font-semibold mb-3 text-primary-800">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Process */}
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
              Our Process
            </motion.h2>
            <motion.p 
              className="section-subtitle mx-auto"
              initial={{ opacity: 0, y: -10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Simple steps to transform your home
            </motion.p>
          </div>

          <div className="relative">
            {/* Connecting line */}
            <div className="absolute top-0 bottom-0 left-1/2 w-1 bg-primary-100 transform -translate-x-1/2 hidden md:block"></div>
            
            <div className="space-y-12 relative">
              {/* Step 1 */}
              <div className="relative">
                <motion.div 
                  className="flex flex-col md:flex-row items-center"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  <div className="md:w-1/2 md:pr-12 md:text-right mb-6 md:mb-0">
                    <span className="inline-block px-3 py-1 bg-primary-100 text-primary-600 rounded-full text-sm font-medium mb-2">
                      Step 1
                    </span>
                    <h3 className="text-2xl font-serif font-bold text-gray-800 mb-2">Browse & Select</h3>
                    <p className="text-gray-600">
                      Explore our wide range of interior design solutions for different rooms and select the ones that match your style preferences.
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-primary-600 text-white flex items-center justify-center z-10 md:mx-6 mb-6 md:mb-0">
                    <span className="font-bold">1</span>
                  </div>
                  <div className="md:w-1/2 md:pl-12 hidden md:block">
                    <img 
                      src="https://images.pexels.com/photos/6585601/pexels-photo-6585601.jpeg" 
                      alt="Browsing designs" 
                      className="rounded-lg shadow-elegant"
                    />
                  </div>
                </motion.div>
              </div>

              {/* Step 2 */}
              <div className="relative">
                <motion.div 
                  className="flex flex-col md:flex-row items-center md:flex-row-reverse"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  <div className="md:w-1/2 md:pl-12 md:text-left mb-6 md:mb-0">
                    <span className="inline-block px-3 py-1 bg-primary-100 text-primary-600 rounded-full text-sm font-medium mb-2">
                      Step 2
                    </span>
                    <h3 className="text-2xl font-serif font-bold text-gray-800 mb-2">Consultation</h3>
                    <p className="text-gray-600">
                      Our expert team will contact you to discuss your selections, take measurements, and customize the design to fit your space.
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-primary-600 text-white flex items-center justify-center z-10 md:mx-6 mb-6 md:mb-0">
                    <span className="font-bold">2</span>
                  </div>
                  <div className="md:w-1/2 md:pr-12 hidden md:block">
                    <img 
                      src="https://images.pexels.com/photos/1109541/pexels-photo-1109541.jpeg" 
                      alt="Consultation" 
                      className="rounded-lg shadow-elegant"
                    />
                  </div>
                </motion.div>
              </div>

              {/* Step 3 */}
              <div className="relative">
                <motion.div 
                  className="flex flex-col md:flex-row items-center"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  <div className="md:w-1/2 md:pr-12 md:text-right mb-6 md:mb-0">
                    <span className="inline-block px-3 py-1 bg-primary-100 text-primary-600 rounded-full text-sm font-medium mb-2">
                      Step 3
                    </span>
                    <h3 className="text-2xl font-serif font-bold text-gray-800 mb-2">Manufacturing</h3>
                    <p className="text-gray-600">
                      We craft your selected designs with premium materials in our state-of-the-art facility to ensure top quality.
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-primary-600 text-white flex items-center justify-center z-10 md:mx-6 mb-6 md:mb-0">
                    <span className="font-bold">3</span>
                  </div>
                  <div className="md:w-1/2 md:pl-12 hidden md:block">
                    <img 
                      src="https://images.pexels.com/photos/1094767/pexels-photo-1094767.jpeg" 
                      alt="Manufacturing" 
                      className="rounded-lg shadow-elegant"
                    />
                  </div>
                </motion.div>
              </div>

              {/* Step 4 */}
              <div className="relative">
                <motion.div 
                  className="flex flex-col md:flex-row items-center md:flex-row-reverse"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  <div className="md:w-1/2 md:pl-12 md:text-left mb-6 md:mb-0">
                    <span className="inline-block px-3 py-1 bg-primary-100 text-primary-600 rounded-full text-sm font-medium mb-2">
                      Step 4
                    </span>
                    <h3 className="text-2xl font-serif font-bold text-gray-800 mb-2">Installation</h3>
                    <p className="text-gray-600">
                      Our skilled installation team will visit your home at a scheduled time to professionally fit your new interior elements.
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-primary-600 text-white flex items-center justify-center z-10 md:mx-6 mb-6 md:mb-0">
                    <span className="font-bold">4</span>
                  </div>
                  <div className="md:w-1/2 md:pr-12 hidden md:block">
                    <img 
                      src="https://images.pexels.com/photos/3990359/pexels-photo-3990359.jpeg" 
                      alt="Installation" 
                      className="rounded-lg shadow-elegant"
                    />
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900 text-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <motion.h2 
              className="text-3xl sm:text-4xl font-serif font-bold mb-4 text-white"
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              Why Choose Luxe Interiors
            </motion.h2>
            <motion.div 
              className="w-16 h-1 bg-secondary-400 mx-auto my-6"
              initial={{ width: 0 }}
              whileInView={{ width: 64 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            ></motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { 
                title: "Hassle-free Process",
                points: ["Select designs online", "Pre-made solutions", "Professional installation", "No long waiting periods"]
              },
              { 
                title: "Quality Assurance",
                points: ["Premium materials", "Expert craftsmanship", "5-year warranty", "Post-installation support"]
              },
              { 
                title: "Customer Satisfaction",
                points: ["1000+ happy clients", "95% customer satisfaction", "4.8/5 average rating", "Transparent pricing"]
              }
            ].map((item, index) => (
              <motion.div 
                key={index}
                className="bg-white/10 backdrop-blur-md rounded-xl p-8 shadow-elegant h-full"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <h3 className="text-xl font-serif font-semibold mb-6 text-secondary-400">{item.title}</h3>
                <ul className="space-y-3">
                  {item.points.map((point, i) => (
                    <li key={i} className="flex items-start">
                      <CheckCircle size={18} className="text-secondary-400 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-white/90">{point}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <motion.div 
            className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-2xl overflow-hidden shadow-elegant-lg"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="p-10 md:p-16 text-center">
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-4">Ready to Transform Your Home?</h2>
              <p className="text-white/90 mb-8 max-w-2xl mx-auto">
                Browse our collection of premium interior designs and let our experts bring your vision to life.
              </p>
              <Link 
                to="/services" 
                className="btn btn-secondary group text-lg"
              >
                Explore Our Designs
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;