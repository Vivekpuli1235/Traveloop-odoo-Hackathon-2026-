import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { Users, Star, MapPin, Globe, Map, Plus, Loader2, X } from "lucide-react";
import { api } from "../services/api";
import { CommunityRating } from "../types";
import { format } from "date-fns";

export default function Community() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"india" | "global">("india");
  const [ratings, setRatings] = useState<{ indian_cities: CommunityRating[], international_countries: CommunityRating[] }>({ indian_cities: [], international_countries: [] });
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchRatings();
  }, []);

  const fetchRatings = async () => {
    try {
      const data = await api.getCommunityRatings();
      setRatings(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      location_name: formData.get("location_name") as string,
      country_name: formData.get("country_name") as string,
      is_india: formData.get("is_india") === "true",
      rating: Number(formData.get("rating")),
      review: formData.get("review") as string,
    };

    try {
      await api.addRating(data);
      setShowModal(false);
      fetchRatings();
    } catch (error) {
      console.error("Failed to post review");
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50">
      <Loader2 className="w-12 h-12 animate-spin text-indigo-600" />
    </div>
  );

  const displayedRatings = activeTab === "india" ? ratings.indian_cities : ratings.international_countries;

  return (
    <div className="min-h-screen bg-neutral-50 pb-20">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-800 text-white py-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=2000&auto=format&fit=crop')] opacity-20 mix-blend-overlay object-cover w-full h-full" />
        <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4 flex items-center gap-4">
              <Users className="w-10 h-10 text-indigo-300" /> Traveloop Community
            </h1>
            <p className="text-indigo-100 text-lg max-w-2xl leading-relaxed">
              Discover the world through the eyes of fellow travelers. Read authentic reviews, find top-rated destinations, and share your own experiences.
            </p>
          </div>
          <button 
            onClick={() => setShowModal(true)}
            className="bg-white text-indigo-900 px-8 py-4 rounded-2xl font-extrabold flex items-center gap-2 hover:bg-indigo-50 transition-colors shadow-xl shrink-0"
          >
            <Plus className="w-5 h-5" /> Write a Review
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-8 relative z-20">
        {/* Toggle Controls */}
        <div className="bg-white rounded-3xl p-2 shadow-lg shadow-neutral-200/50 flex mb-12 max-w-md mx-auto">
          <button 
            onClick={() => setActiveTab("india")}
            className={`flex-1 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all ${activeTab === 'india' ? 'bg-indigo-600 text-white shadow-md' : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50'}`}
          >
            <MapPin className="w-5 h-5" /> Explore India
          </button>
          <button 
            onClick={() => setActiveTab("global")}
            className={`flex-1 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all ${activeTab === 'global' ? 'bg-purple-600 text-white shadow-md' : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50'}`}
          >
            <Globe className="w-5 h-5" /> Global Destinations
          </button>
        </div>

        {/* Ratings Feed */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {displayedRatings.length === 0 ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="col-span-full text-center py-20 bg-white rounded-[3rem] border border-neutral-100">
                <Map className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-neutral-800 mb-2">No reviews yet</h3>
                <p className="text-neutral-500">Be the first to review a destination here!</p>
              </motion.div>
            ) : (
              displayedRatings.map((rating) => (
                <motion.div 
                  key={rating.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  onClick={() => navigate(`/activities?q=${encodeURIComponent(rating.location_name + ', ' + rating.country_name)}`)}
                  className="bg-white rounded-[2.5rem] overflow-hidden border border-neutral-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col cursor-pointer"
                >
                  <div className="h-48 relative overflow-hidden bg-neutral-100">
                    {rating.image_url ? (
                      <img src={rating.image_url} alt={rating.location_name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                        <MapPin className="w-10 h-10 text-indigo-300" />
                      </div>
                    )}
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-xl font-bold text-sm flex items-center gap-1 shadow-sm">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" /> {Number(rating.rating).toFixed(1)}
                    </div>
                  </div>
                  
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="mb-4">
                      <h3 className="text-xl font-extrabold text-neutral-900">{rating.location_name}</h3>
                      <p className="text-sm font-semibold text-indigo-600 uppercase tracking-wider">{rating.country_name}</p>
                    </div>
                    
                    <p className="text-neutral-600 leading-relaxed italic mb-6 flex-1">"{rating.review}"</p>
                    
                    <div className="flex items-center justify-between text-xs font-bold text-neutral-400 border-t border-neutral-100 pt-4 mt-auto">
                      <span>By {rating.reviewer_name || `User #${rating.user_id}`}</span>
                      <span>{format(new Date(rating.created_at), "MMM d, yyyy")}</span>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Write Review Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowModal(false)} className="absolute inset-0 bg-neutral-900/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="bg-white w-full max-w-xl rounded-[2.5rem] p-8 shadow-2xl relative z-10">
              <button onClick={() => setShowModal(false)} className="absolute top-6 right-6 p-2 bg-neutral-100 text-neutral-500 hover:text-neutral-900 rounded-full transition-colors"><X className="w-5 h-5" /></button>
              
              <h2 className="text-2xl font-extrabold mb-2">Share Your Experience</h2>
              <p className="text-neutral-500 mb-6">Help the community by reviewing a destination.</p>
              
              <form onSubmit={handleReviewSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-neutral-700">Location / City</label>
                    <input name="location_name" required placeholder="e.g. Kyoto" className="w-full p-4 bg-neutral-50 border border-neutral-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500/20" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-neutral-700">Country</label>
                    <input name="country_name" required placeholder="e.g. Japan" className="w-full p-4 bg-neutral-50 border border-neutral-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500/20" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-neutral-700">Category</label>
                    <select name="is_india" className="w-full p-4 bg-neutral-50 border border-neutral-200 rounded-2xl outline-none cursor-pointer">
                      <option value="true">Indian City</option>
                      <option value="false">International</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-neutral-700">Rating (1-5)</label>
                    <input name="rating" type="number" min="1" max="5" step="0.1" required placeholder="5.0" className="w-full p-4 bg-neutral-50 border border-neutral-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500/20" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-neutral-700">Your Review</label>
                  <textarea name="review" required placeholder="What did you love? Any tips?" className="w-full p-4 bg-neutral-50 border border-neutral-200 rounded-2xl outline-none min-h-[120px] focus:ring-2 focus:ring-indigo-500/20 resize-none" />
                </div>

                <button type="submit" className="w-full bg-indigo-600 text-white font-bold py-4 rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 flex items-center justify-center gap-2">
                  Post Review <Star className="w-4 h-4 fill-white" />
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
