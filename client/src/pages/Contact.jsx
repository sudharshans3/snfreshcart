import React, { useState } from 'react';
import {
  Mail,
  Phone,
  MapPin,
  Send,
  MessageSquareCode,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import api from '../utils/api';

const Contact = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError('');
    setSubmitted(false);

    try {
      await api.post('/contact', {
        name,
        email,
        subject,
        message,
      });

      setSubmitted(true);

      setName('');
      setEmail('');
      setSubject('');
      setMessage('');

      setTimeout(() => {
        setSubmitted(false);
      }, 5000);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Something went wrong. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const openWhatsApp = () => {
    const number = '916374353680';

    const text = encodeURIComponent(
      'Hello SN FreshCart Team, I am interested in sourcing products. Please share the pricing details.'
    );

    window.open(`https://wa.me/${number}?text=${text}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 transition-colors duration-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-12">

        {/* Title */}
        <div className="text-center space-y-2">
          <span className="text-agricultural-700 dark:text-agricultural-400 font-bold uppercase tracking-wider text-xs">
            Reach Out
          </span>

          <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">
            Connect With Our Yard
          </h1>

          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
            Have questions about bulk shipping, sorting specs, or daily custom
            price quotes? Contact our sales office in Salem, Tamil Nadu.
          </p>
        </div>

        {/* Contact info + form */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Info Details */}
          <div className="space-y-6">

            {/* Phone */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-850 shadow-sm flex items-start space-x-4">
              <div className="p-3 bg-agricultural-100 dark:bg-agricultural-950/20 text-agricultural-750 dark:text-agricultural-450 rounded-xl">
                <Phone size={20} />
              </div>

              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  Phone Support
                </h3>

                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Mon-Sat (9:00 AM - 6:00 PM)
                </p>

                <a
                  href="tel:+916374353680"
                  className="text-sm text-agricultural-700 dark:text-agricultural-400 font-bold hover:underline block mt-1"
                >
                  +91 63743 53680
                </a>
              </div>
            </div>

            {/* Email */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-850 shadow-sm flex items-start space-x-4">
              <div className="p-3 bg-onionorange-100 dark:bg-onionorange-950/20 text-onionorange-600 dark:text-onionorange-450 rounded-xl">
                <Mail size={20} />
              </div>

              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  Email Inbox
                </h3>

                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Average response within 3 hours.
                </p>

                <a
                  href="mailto:sudharshanneela2006@gmail.com"
                  className="text-sm text-onionorange-600 dark:text-onionorange-450 font-bold hover:underline block mt-1"
                >
                  sudharshanneela2006@gmail.com
                </a>
              </div>
            </div>

            {/* Address */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-850 shadow-sm flex items-start space-x-4">
              <div className="p-3 bg-amber-100 dark:bg-amber-950/20 text-amber-600 dark:text-amber-450 rounded-xl">
                <MapPin size={20} />
              </div>

              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  Our Yard Address
                </h3>

                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mt-1">
                  Kanavaipudur, Kadayampatti (T.K), Salem District, Tamil Nadu,
                  Pincode: 636354, India.
                </p>
              </div>
            </div>

            {/* WhatsApp */}
            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white p-6 rounded-2xl shadow-md space-y-4">
              <div className="flex items-center space-x-2">
                <MessageSquareCode size={20} />

                <h3 className="font-bold text-sm uppercase tracking-wide">
                  WhatsApp Support
                </h3>
              </div>

              <p className="text-[11px] leading-relaxed text-emerald-100">
                Want immediate price negotiations or invoice copies? Chat with
                our logistics assistant on WhatsApp.
              </p>

              <button
                type="button"
                onClick={openWhatsApp}
                className="w-full bg-white hover:bg-emerald-50 text-emerald-700 font-bold text-xs py-2.5 rounded-xl flex items-center justify-center space-x-1.5 shadow-sm transition-all"
              >
                <span>Chat on WhatsApp</span>
              </button>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-150 dark:border-slate-850 shadow-sm space-y-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Send Us a Message
            </h2>

            {/* Success */}
            {submitted && (
              <div className="bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 p-4 rounded-xl border border-emerald-200 dark:border-emerald-900/50 flex items-center space-x-2 text-xs">
                <CheckCircle2 size={16} />

                <span>
                  Thank you! Your message was submitted successfully. Our desk
                  will contact you soon.
                </span>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400 p-4 rounded-xl border border-red-200 dark:border-red-900/50 flex items-center space-x-2 text-xs">
                <AlertCircle size={16} />

                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Name + Email */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500 block">
                    Your Name
                  </label>

                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full px-4 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-agricultural-600 dark:focus:ring-agricultural-500 text-slate-900 dark:text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500 block">
                    Your Email
                  </label>

                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="john@example.com"
                    className="w-full px-4 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-agricultural-600 dark:focus:ring-agricultural-500 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Subject */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 block">
                  Subject
                </label>

                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Bulk order inquiry, transit status..."
                  className="w-full px-4 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-agricultural-600 dark:focus:ring-agricultural-500 text-slate-900 dark:text-white"
                />
              </div>

              {/* Message */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 block">
                  Message
                </label>

                <textarea
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Write your detailed query here..."
                  className="w-full px-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-agricultural-600 dark:focus:ring-agricultural-500 text-slate-900 dark:text-white"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center space-x-2 bg-agricultural-750 hover:bg-agricultural-800 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-md transition-colors disabled:opacity-50"
              >
                <Send size={14} />

                <span>
                  {loading ? 'Sending...' : 'Send Message'}
                </span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;