import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";
import { Trip } from "../types";
import { Plus, Calendar, MapPin, Search, Plane, TrendingUp, Settings, LogOut, Loader2, List } from "lucide-react";
import { format } from "date-fns";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [topRatings, setTopRatings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.getTrips().then(setTrips),
      api.getTopRatings().then(setTopRatings)
    ]).finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex min-h-screen bg-neutral-50">


      {/* Main Content */}
      <main className="flex-1 p-6 lg:p-10 max-w-7xl mx-auto w-full overflow-y-auto">
        {/* Hero Banner */}
        <div className="relative w-full h-64 rounded-3xl overflow-hidden mb-10 shadow-lg">
          <img
            src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
            alt="Travel Banner"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent"></div>
          <div className="absolute inset-0 flex flex-col justify-center px-10">
            <h1 className="text-4xl font-extrabold text-white mb-2 drop-shadow-md">
              Hello, {user?.name?.split(" ")[0]}!
            </h1>
            <p className="text-white/90 text-lg mb-6 font-medium max-w-md">
              Ready for your next adventure? The world is waiting.
            </p>
            <div>
              <Link to="/trips/new" className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-indigo-900/20">
                <Plus className="w-5 h-5" /> Plan New Trip
              </Link>
            </div>
          </div>
        </div>

        {/* Stats / Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <StatCard title="Total Trips" value={trips.length} icon={<Plane className="text-blue-500" />} />
          <StatCard title="Shared Trips" value={trips.filter(t => t.is_public).length} icon={<TrendingUp className="text-emerald-500" />} />
          <StatCard title="Points Earned" value="1,240" icon={<TrendingUp className="text-orange-500" />} />
        </div>

        {/* Trips Section */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-neutral-900">Your Recent Trips</h2>
            <Link to="/dashboard" className="text-sm font-semibold text-indigo-600 hover:underline">View All</Link>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-10 h-10 animate-spin text-indigo-500" />
            </div>
          ) : trips.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trips.map((trip) => (
                <TripCard key={trip.id} trip={trip} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center border-2 border-dashed border-neutral-200">
              <div className="w-20 h-20 bg-neutral-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Calendar className="text-neutral-400 w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold mb-2">No trips planned yet</h3>
              <p className="text-neutral-500 mb-8 max-w-sm mx-auto">
                Start by creating your first trip and adding some destinations.
              </p>
              <Link to="/trips/new" className="inline-flex items-center gap-2 bg-neutral-900 text-white px-6 py-3 rounded-2xl font-bold hover:bg-neutral-800 transition-all">
                <Plus className="w-5 h-5" /> Create My First Trip
              </Link>
            </div>
          )}
        </section>

        {/* Suggested Trips Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-neutral-900">Community Top Picks</h2>
            <Link to="/community" className="text-sm font-semibold text-indigo-600 hover:underline">See All Ratings</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {topRatings.length > 0 ? (
              topRatings.map((rating, idx) => (
                <SuggestedCard
                  key={idx}
                  title={`${rating.location_name}, ${rating.country_name}`}
                  image={rating.image_url || `https://source.unsplash.com/800x600/?${rating.location_name}`}
                  duration={`${Number(rating.avg_rating).toFixed(1)} Stars`}
                  onClick={() => navigate(`/activities?q=${encodeURIComponent(rating.location_name + ', ' + rating.country_name)}`)}
                />
              ))
            ) : (
              <p className="text-neutral-500">No community suggestions available yet.</p>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

function SuggestedCard({ title, image, duration, onClick }: { title: string, image: string, duration: string, onClick?: () => void }) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      onClick={onClick}
      className="relative rounded-3xl overflow-hidden shadow-sm group h-64 cursor-pointer"
    >
      <img src={image} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6">
        <h3 className="text-xl font-bold text-white mb-1">{title}</h3>
        <div className="flex items-center gap-2 text-white/80 text-sm font-medium">
          <Calendar className="w-4 h-4" />
          <span>{duration}</span>
        </div>
      </div>
    </motion.div>
  );
}

function SidebarLink({ icon, label, to, active = false }: { icon: React.ReactNode, label: string, to?: string, active?: boolean }) {
  if (to) {
    return (
      <Link to={to} className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all ${active ? 'bg-indigo-50 text-indigo-600' : 'text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900'}`}>
        {icon}
        <span className="font-semibold text-sm">{label}</span>
      </Link>
    );
  }
  return (
    <button className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all ${active ? 'bg-indigo-50 text-indigo-600' : 'text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900'}`}>
      {icon}
      <span className="font-semibold text-sm">{label}</span>
    </button>
  );
}

function StatCard({ title, value, icon }: { title: string, value: string | number, icon: React.ReactNode }) {
  return (
    <div className="bg-white p-6 rounded-3xl border border-neutral-100 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 bg-neutral-50 rounded-2xl">{icon}</div>
      </div>
      <div>
        <p className="text-sm font-semibold text-neutral-500">{title}</p>
        <p className="text-3xl font-extrabold text-neutral-900 mt-1">{value}</p>
      </div>
    </div>
  );
}

function TripCard({ trip }: { trip: Trip }) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white rounded-3xl overflow-hidden shadow-sm border border-neutral-100 group"
    >
      <Link to={`/trips/${trip.id}`}>
        <div className="h-40 bg-neutral-200 relative overflow-hidden">
          {trip.cover_photo ? (
            <img src={trip.cover_photo} alt={trip.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <Plane className="text-white/50 w-12 h-12" />
            </div>
          )}
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-indigo-600 shadow-sm">
            {trip.is_public ? "Public" : "Private"}
          </div>
        </div>
        <div className="p-6">
          <h3 className="text-lg font-extrabold text-neutral-900 mb-2 truncate">{trip.name}</h3>
          <div className="flex items-center gap-4 text-sm text-neutral-500">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              <span>{trip.start_date ? format(new Date(trip.start_date), "MMM d") : "No date"}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4" />
              <span>{trip.stops?.length || 0} stops</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
