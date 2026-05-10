import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { Globe, MapPin, Calendar, Users, ArrowRight } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-4 bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-neutral-100">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
            <Globe className="text-white w-6 h-6" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-neutral-900">Traveloop</span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/auth" className="text-sm font-medium text-neutral-600 hover:text-indigo-600 transition-colors">Login</Link>
          <Link to="/auth" className="bg-indigo-600 text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200">
            Start Planning
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="px-6 pt-20 pb-32 max-w-7xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-neutral-900 mb-6 leading-tight">
            Personalized Travel Planning <br />
            <span className="text-indigo-600">Made Easy</span>
          </h1>
          <p className="text-xl text-neutral-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            Dream, design, and organize your multi-city journeys with Traveloop. 
            The intelligent platform for modern travelers.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/auth" className="w-full sm:w-auto bg-indigo-600 text-white px-8 py-4 rounded-2xl text-lg font-bold hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 flex items-center justify-center gap-2">
              Plan Your Next Trip <ArrowRight className="w-5 h-5" />
            </Link>
            <button className="w-full sm:w-auto bg-white border border-neutral-200 text-neutral-900 px-8 py-4 rounded-2xl text-lg font-bold hover:bg-neutral-50 transition-all">
              Explore Destinations
            </button>
          </div>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="bg-white py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything you need to travel better</h2>
            <p className="text-neutral-500">Powerful tools for stress-free planning</p>
          </div>
          <div className="grid md:grid-cols-3 gap-12">
            {[
              { icon: <MapPin />, title: "Itinerary Builder", desc: "Craft detailed multi-city plans with ease. Reorder stops and assign activities." },
              { icon: <Calendar />, title: "Visual Timeline", desc: "See your entire journey at a glance with our intuitive calendar and timeline views." },
              { icon: <Users />, title: "Collaboration", desc: "Share your plans with friends or the public. Get inspired by others' journeys." }
            ].map((feature, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -5 }}
                className="p-8 rounded-3xl bg-neutral-50 border border-neutral-100"
              >
                <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center text-indigo-600 mb-6 border border-neutral-100">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-neutral-600 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-12 px-6 border-t border-neutral-100 text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Globe className="text-indigo-600 w-5 h-5" />
          <span className="text-lg font-bold">Traveloop</span>
        </div>
        <p className="text-neutral-500 text-sm">© 2026 Traveloop. All rights reserved.</p>
      </footer>
    </div>
  );
}
