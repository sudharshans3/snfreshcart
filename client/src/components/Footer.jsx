import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 dark:bg-black dark:text-slate-400 transition-colors duration-200 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Column */}
          <div className="space-y-4 col-span-1 md:col-span-1">
            <span className="text-xl font-bold bg-gradient-to-r from-agricultural-500 to-onionorange-500 bg-clip-text text-transparent">
              SN FreshCart
            </span>
            <p className="text-sm text-slate-400">
              Your premium marketplace for top-grade, direct-from-farm onions, potatoes, garlic, coconut, and vegetables. Bulk supply and daily updated wholesale rates.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-agricultural-400 transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-agricultural-400 transition-colors">Our Products</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-agricultural-400 transition-colors">Contact Support</Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-agricultural-400 transition-colors">Wholesale Produce</Link>
              </li>
            </ul>
          </div>

          {/* Onion Varieties */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Varieties
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/products?category=Red%20Onion" className="hover:text-agricultural-400 transition-colors">Red Onions</Link>
              </li>

              <li>
                <Link to="/products?category=Small%20Onion%20(Shallots)" className="hover:text-agricultural-400 transition-colors">Small Onions (Shallots)</Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Contact Us
            </h3>
            <div className="flex items-start space-x-2.5 text-sm">
              <MapPin size={18} className="text-agricultural-500 mt-0.5 flex-shrink-0" />
              <span>Kanavaipudur, Kadayampatti (T.K), Salem, TN, India</span>
            </div>
            <div className="flex items-center space-x-2.5 text-sm">
              <Phone size={16} className="text-agricultural-500 flex-shrink-0" />
              <span>+91 63743 53680</span>
            </div>
            <div className="flex items-center space-x-2.5 text-sm">
              <Mail size={16} className="text-agricultural-500 flex-shrink-0" />
              <span>sudharshanneela2006@gmail.com</span>
            </div>
          </div>
        </div>

        {/* Bottom copyright section */}
        <div className="mt-12 pt-8 border-t border-slate-800 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>&copy; {new Date().getFullYear()} SN FreshCart. All rights reserved.</p>
          <p className="flex items-center space-x-1">
            <span>Cultivated with care and modern tech</span>
            <Heart size={12} className="text-rose-500 fill-rose-500" />
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
