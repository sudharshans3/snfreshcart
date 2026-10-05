import React from 'react';
import { Sparkles, Sprout, ShieldAlert, Award } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 transition-colors duration-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <span className="text-agricultural-700 dark:text-agricultural-400 font-bold uppercase tracking-wider text-xs">Our Journey</span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white">
            Rooted in Quality & Trust
          </h1>
          <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            SN FreshCart was founded in Nashik with a singular mission: to eliminate middleman inefficiencies and deliver top-grade sorting for commercial and domestic buyers.
          </p>
        </div>

        {/* Hero image grid block */}
        <div className="rounded-2xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-850">
          <img
            src="https://images.unsplash.com/photo-1580201006675-4131b18cf53f?auto=format&fit=crop&q=80&w=1200"
            alt="Onion agriculture"
            className="w-full h-80 object-cover"
          />
        </div>

        {/* Three core pillars */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-850 shadow-sm flex items-start space-x-4">
            <div className="p-3 bg-agricultural-100 dark:bg-agricultural-950/20 text-agricultural-750 dark:text-agricultural-400 rounded-xl">
              <Sprout size={24} />
            </div>
            <div className="space-y-1.5">
              <h3 className="font-bold text-lg text-slate-900 dark:text-white">Direct Sourcing</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                By purchasing straight from farmers in Nashik and surrounding regions, we secure the freshest yields and pass savings directly to our patrons.
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-850 shadow-sm flex items-start space-x-4">
            <div className="p-3 bg-onionorange-100 dark:bg-onionorange-950/20 text-onionorange-600 dark:text-onionorange-450 rounded-xl">
              <Award size={24} />
            </div>
            <div className="space-y-1.5">
              <h3 className="font-bold text-lg text-slate-900 dark:text-white">State-of-the-art Grading</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                We grade onions according to size (big, medium, small), dryness of layers, and skin thickness, ensuring the highest grade transport longevity.
              </p>
            </div>
          </div>
        </div>

        {/* Detailed Business Narrative */}
        <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-150 dark:border-slate-850 shadow-sm space-y-6">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Cultivating the Future</h2>
          <p className="text-sm text-slate-600 dark:text-slate-450 leading-relaxed">
            Traditionally, the agricultural trading business has suffered from lack of price clarity, multiple layers of commission agents, and high sorting waste. This meant farmers received lower payouts, while final buyers paid premium prices for inconsistent quality.
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-450 leading-relaxed">
            SN FreshCart leverages tech to solve this. Our admin dashboard tracks pricing history transparently. Customers can check out and track orders online, with the security that our grading centers in Nashik sort each product to spec before it goes out.
          </p>
          <div className="border-t border-slate-100 dark:border-slate-800 pt-6 grid grid-cols-3 gap-4 text-center">
            <div>
              <span className="text-2xl font-extrabold text-agricultural-700 dark:text-agricultural-400">10k+ Tons</span>
              <span className="block text-xs text-slate-400 mt-0.5">Onions Shipped</span>
            </div>
            <div>
              <span className="text-2xl font-extrabold text-onionorange-600 dark:text-onionorange-500">2,500+</span>
              <span className="block text-xs text-slate-400 mt-0.5">Active Bulk Buyers</span>
            </div>
            <div>
              <span className="text-2xl font-extrabold text-amber-600 dark:text-amber-500">99.2%</span>
              <span className="block text-xs text-slate-400 mt-0.5">On-Time Deliveries</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
