import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { api } from "../services/api";
import { Trip } from "../types";
import { Loader2, Plane, MapPin, Calendar, Globe, Share2 } from "lucide-react";
import { format } from "date-fns";

export default function PublicTrip() {
  const { id } = useParams<{ id: string }>();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      api.getPublicTrip(id)
        .then(setTrip)
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="w-12 h-12 animate-spin text-indigo-600" />
    </div>
  );

  if (!trip) return (
    <div className="min-h-screen flex items-center justify-center text-center p-6">
      <div>
        <Globe className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
        <h1 className="text-2xl font-bold">Trip not found or private</h1>
        <p className="text-neutral-500 mt-2">The owner hasn't shared this trip publicly yet.</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-neutral-50 pb-20">
      <nav className="h-16 bg-white border-b border-neutral-100 sticky top-0 z-30 flex items-center justify-between px-6">
        <div className="flex items-center gap-2 font-bold text-xl">
          <Plane className="text-indigo-600" /> Traveloop
        </div>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg shadow-indigo-100">
          Copy Trip
        </button>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="rounded-[3rem] h-[300px] overflow-hidden relative mb-10 shadow-2xl">
          {trip.cover_photo ? (
            <img src={trip.cover_photo} alt={trip.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-10 text-white">
            <h1 className="text-4xl font-extrabold">{trip.name}</h1>
            <p className="mt-2 opacity-80">{trip.description}</p>
          </div>
        </div>

        <div className="space-y-12">
          {trip.stops?.map((stop, index) => (
            <div key={stop.id} className="relative pl-12">
               <div className="absolute left-[20px] top-0 bottom-0 w-1 bg-neutral-200" />
               <div className="absolute left-[10px] top-0 w-6 h-6 bg-indigo-600 rounded-full border-4 border-white" />
               
               <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-neutral-100">
                  <h3 className="text-2xl font-bold">{stop.city_name}</h3>
                  <div className="flex gap-4 text-sm text-neutral-500 mt-2 font-semibold">
                    <span className="flex items-center gap-1"><MapPin className="w-4 h-4"/> {stop.country}</span>
                    <span className="flex items-center gap-1"><Calendar className="w-4 h-4"/> {stop.arrival_date ? format(new Date(stop.arrival_date), "MMM d") : ""}</span>
                  </div>

                  <div className="mt-6 space-y-3">
                    {stop.activities.map(act => (
                      <div key={act.id} className="flex justify-between p-4 bg-neutral-50 rounded-2xl">
                        <span className="font-bold text-neutral-700">{act.name}</span>
                        <span className="text-sm font-bold text-indigo-600">₹{act.cost}</span>
                      </div>
                    ))}
                  </div>
               </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
