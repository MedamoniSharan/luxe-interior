import { Link } from 'react-router-dom';
import { Sofa, Phone, Mail, MapPin, Facebook, Instagram, Twitter } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-primary-900 text-white">
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo & About */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Sofa size={28} className="text-secondary-400" />
              <span className="text-xl font-serif font-bold">Luxe Interiors</span>
            </div>
            <p className="text-gray-300 max-w-xs">
              Revolutionizing home interior design with premium, ready-to-install solutions that transform your living spaces.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="#" className="text-gray-300 hover:text-secondary-400 transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-secondary-400 transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-secondary-400 transition-colors">
                <Twitter size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-serif font-bold mb-4 text-white">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-secondary-400 transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/services" className="text-gray-300 hover:text-secondary-400 transition-colors">Services</Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-300 hover:text-secondary-400 transition-colors">About Us</Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-secondary-400 transition-colors">Contact Us</Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-serif font-bold mb-4 text-white">Our Services</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/services" className="text-gray-300 hover:text-secondary-400 transition-colors">TV Units</Link>
              </li>
              <li>
                <Link to="/services" className="text-gray-300 hover:text-secondary-400 transition-colors">Living Room Design</Link>
              </li>
              <li>
                <Link to="/services" className="text-gray-300 hover:text-secondary-400 transition-colors">Kitchen Design</Link>
              </li>
              <li>
                <Link to="/services" className="text-gray-300 hover:text-secondary-400 transition-colors">Show Cases</Link>
              </li>
              <li>
                <Link to="/services" className="text-gray-300 hover:text-secondary-400 transition-colors">Bedroom Design</Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-serif font-bold mb-4 text-white">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3">
                <Phone size={20} className="text-secondary-400 mt-1 flex-shrink-0" />
                <span className="text-gray-300">+91 9392335014</span>
              </li>
              <li className="flex items-start space-x-3">
                <Mail size={20} className="text-secondary-400 mt-1 flex-shrink-0" />
                <span className="text-gray-300">info@intoeries.com</span>
              </li>
              <li className="flex items-start space-x-3">
                <MapPin size={20} className="text-secondary-400 mt-1 flex-shrink-0" />
                <span className="text-gray-300"></span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center">
          <p className="text-gray-400">
            &copy; {new Date().getFullYear()} intoeries. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;