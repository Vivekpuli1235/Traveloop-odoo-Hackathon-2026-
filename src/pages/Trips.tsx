import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { api } from "../services/api";
import { Trip } from "../types";
import { motion } from "motion/react";
import { Plane, Calendar, MapPin, Loader2, Plus, LayoutGrid, Clock, CheckCircle } from "lucide-react";
import { format, isBefore, isAfter, isWithinInterval, startOfDay } from "date-fns";

export default function Trips() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"ongoing" | "upcoming" | "previous">("upcoming");

  useEffect(() => {
    async function loadTrips() {
      try {
        const data = await api.getTrips();
        setTrips(data);
      } catch (error) {
        console.error("Failed to load trips", error);
      } finally {
        setLoading(false);
      }
    }
    loadTrips();
  }, []);

  const today = startOfDay(new Date());

  const ongoingTrips = trips.filter(trip => {
    if (!trip.start_date || !trip.end_date) return false;
    return isWithinInterval(today, { 
      start: startOfDay(new Date(trip.start_date)), 
      end: startOfDay(new Date(trip.end_date)) 
    });
  });

  const upcomingTrips = trips.filter(trip => {
    if (!trip.start_date) return false;
    return isAfter(startOfDay(new Date(trip.start_date)), today);
  });

  const previousTrips = trips.filter(trip => {
    if (!trip.end_date) return false;
    return isBefore(startOfDay(new Date(trip.end_date)), today);
  });

  // Items to show based on tab
  const getDisplayTrips = () => {
    if (activeTab === "ongoing") return ongoingTrips;
    if (activeTab === "upcoming") return upcomingTrips;
    return previousTrips;
  };

  const displayTrips = getDisplayTrips();

  return (
    <div className="min-h-screen bg-neutral-50 pb-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-extrabold text-neutral-900 flex items-center gap-3">
              <div className="bg-indigo-100 p-2 rounded-xl text-indigo-600">
                <MapPin className="w-7 h-7" />
              </div>
              My Trips
            </h1>
            <p className="text-neutral-500 mt-1 text-lg">Manage all your past, present, and future adventures.</p>
          </div>
          <Link to="/trips/new" className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 flex items-center justify-center gap-2">
            <Plus className="w-5 h-5" /> Plan New Trip
          </Link>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 bg-white p-2 rounded-2xl shadow-sm border border-neutral-100 w-fit">
          <TabButton 
            active={activeTab === "ongoing"} 
            onClick={() => setActiveTab("ongoing")}
            icon={<Clock className="w-4 h-4"/>}
            label={`Ongoing (${ongoingTrips.length})`}
            activeColor="bg-amber-100 text-amber-700"
          />
          <TabButton 
            active={activeTab === "upcoming"} 
            onClick={() => setActiveTab("upcoming")}
            icon={<LayoutGrid className="w-4 h-4"/>}
            label={`Upcoming (${upcomingTrips.length})`}
            activeColor="bg-indigo-100 text-indigo-700"
          />
          <TabButton 
            active={activeTab === "previous"} 
            onClick={() => setActiveTab("previous")}
            icon={<CheckCircle className="w-4 h-4"/>}
            label={`Previous (${previousTrips.length})`}
            activeColor="bg-emerald-100 text-emerald-700"
          />
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-indigo-500" />
          </div>
        ) : (
          <motion.div 
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {displayTrips.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {displayTrips.map((trip) => (
                  <TripCard key={trip.id} trip={trip} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-[2rem] p-16 text-center border-2 border-dashed border-neutral-200">
                <div className="w-24 h-24 bg-neutral-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Plane className="text-neutral-400 w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold mb-2">No {activeTab} trips found</h3>
                <p className="text-neutral-500 mb-8 max-w-sm mx-auto">
                  {activeTab === "ongoing" && "You aren't currently on a trip. Time to pack your bags?"}
                  {activeTab === "upcoming" && "You have no future trips planned. Start dreaming!"}
                  {activeTab === "previous" && "You haven't completed any trips yet."}
                </p>
                <Link to="/trips/new" className="inline-flex items-center gap-2 bg-neutral-900 text-white px-8 py-4 rounded-2xl font-bold hover:bg-neutral-800 transition-all">
                  <Plus className="w-5 h-5" /> Start Planning
                </Link>
              </div>
            )}
          </motion.div>
        )}

      </div>
    </div>
  );
}

function TabButton({ active, onClick, icon, label, activeColor }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string, activeColor: string }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all ${
        active 
          ? activeColor
          : "text-neutral-500 hover:bg-neutral-50"
      }`}
    >
      {icon} {label}
    </button>
  );
}

function TripCard({ trip }: { trip: Trip }) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white rounded-[1.5rem] overflow-hidden shadow-sm border border-neutral-100 group"
    >
      <Link to={`/trips/${trip.id}`}>
        <div className="h-48 bg-neutral-200 relative overflow-hidden">
          {trip.cover_photo ? (
            <img src={trip.cover_photo} alt={trip.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <Plane className="text-white/50 w-12 h-12" />
            </div>
          )}
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider text-indigo-600 shadow-sm">
            {trip.is_public ? "Public" : "Private"}
          </div>
        </div>
        <div className="p-6">
          <h3 className="text-xl font-extrabold text-neutral-900 mb-3 line-clamp-1">{trip.name}</h3>
          <div className="flex flex-col gap-2 text-sm text-neutral-500 font-medium">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-indigo-400" />
              <span>
                {trip.start_date ? format(new Date(trip.start_date), "MMM d, yyyy") : "TBD"} 
                {trip.end_date && ` - ${format(new Date(trip.end_date), "MMM d, yyyy")}`}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-400" />
              <span>{trip.stops?.length || 0} destinations planned</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
