import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Search, MapPin, Star, Plus, Map as MapIcon, Compass, Coffee, ShoppingBag, Camera } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const CATEGORIES = [
  { id: "all", name: "All", icon: Compass },
  { id: "attractions", name: "Attractions", icon: Camera },
  { id: "food", name: "Food & Dining", icon: Coffee },
  { id: "shopping", name: "Shopping", icon: ShoppingBag },
];

const MOCK_PLACES = [
  {
    id: 1,
    name: "Eiffel Tower",
    category: "attractions",
    rating: 4.8,
    reviews: "324k",
    image: "https://images.unsplash.com/photo-1543305113-2d2331c1cae8?q=80&w=800",
    description: "Iconic wrought-iron spire and global symbol of France.",
    distance: "1.2 km away"
  },
  {
    id: 2,
    name: "Louvre Museum",
    category: "attractions",
    rating: 4.9,
    reviews: "156k",
    image: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?q=80&w=800",
    description: "World's largest art museum and historic monument.",
    distance: "2.5 km away"
  },
  {
    id: 3,
    name: "Le Jules Verne",
    category: "food",
    rating: 4.6,
    reviews: "4.2k",
    image: "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?q=80&w=800",
    description: "Upscale dining on the 2nd floor of the Eiffel Tower.",
    distance: "1.2 km away"
  },
  {
    id: 4,
    name: "Champs-Élysées",
    category: "shopping",
    rating: 4.7,
    reviews: "89k",
    image: "https://images.unsplash.com/photo-1502602898657-3e907fa3a2ed?q=80&w=800",
    description: "Famous avenue known for its theaters, cafés, and luxury shops.",
    distance: "3.1 km away"
  },
];

export default function Activities() {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get("q") || "Paris, France";
  
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [activeCategory, setActiveCategory] = useState("all");
  const [savedActivities, setSavedActivities] = useState<number[]>([]);

  const filteredPlaces = MOCK_PLACES.filter(place => 
    activeCategory === "all" ? true : place.category === activeCategory
  );

  const toggleSave = (id: number) => {
    setSavedActivities(prev => 
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col md:flex-row">
      {/* Left Sidebar: Map & Search */}
      <div className="w-full md:w-1/2 lg:w-5/12 bg-white flex flex-col border-r border-neutral-100 shadow-xl z-10">
        <div className="p-6 pb-4">
          <h1 className="text-2xl font-extrabold text-neutral-900 mb-6 flex items-center gap-2">
            <MapIcon className="w-6 h-6 text-indigo-600" /> Discover Places
          </h1>
          
          <div className="relative mb-6">
            <Search className="absolute left-4 top-4 text-neutral-400 w-5 h-5" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search a city or place..." 
              className="w-full pl-12 pr-4 py-4 bg-neutral-100 rounded-2xl font-bold text-neutral-800 outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {CATEGORIES.map(cat => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${
                    isActive 
                      ? "bg-neutral-900 text-white shadow-md" 
                      : "bg-neutral-100 text-neutral-500 hover:bg-neutral-200"
                  }`}
                >
                  <Icon className="w-4 h-4" /> {cat.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Embedded Free Google Map */}
        <div className="flex-1 min-h-[400px] relative bg-neutral-200">
          <iframe
            title="Google Map"
            className="w-full h-full border-0 grayscale-[20%] contrast-125"
            src={`https://maps.google.com/maps?q=${encodeURIComponent(searchQuery)}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
            allowFullScreen
          ></iframe>
          <div className="absolute top-4 left-4 right-4 bg-white/90 backdrop-blur-md p-3 rounded-xl shadow-lg border border-white flex items-center justify-between pointer-events-none">
            <div className="flex items-center gap-2 font-bold text-neutral-800">
              <MapPin className="w-5 h-5 text-indigo-600" /> Showing results near {searchQuery.split(',')[0]}
            </div>
          </div>
        </div>
      </div>

      {/* Right Content: Suggestions Feed */}
      <div className="w-full md:w-1/2 lg:w-7/12 p-6 lg:p-10 overflow-y-auto max-h-screen">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-extrabold text-neutral-900">Nearby Suggestions</h2>
          <span className="text-sm font-bold text-neutral-500 bg-neutral-200 px-3 py-1 rounded-lg">{filteredPlaces.length} places found</span>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <AnimatePresence>
            {filteredPlaces.map((place) => (
              <motion.div 
                key={place.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-[2rem] overflow-hidden shadow-lg shadow-neutral-200/50 border border-neutral-100 group"
              >
                <div className="h-48 overflow-hidden relative">
                  <img 
                    src={place.image} 
                    alt={place.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-xl flex items-center gap-1 font-bold text-sm shadow-sm">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" /> {place.rating}
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-xl font-extrabold text-neutral-900">{place.name}</h3>
                      <p className="text-sm font-semibold text-indigo-600 mt-1">{place.distance}</p>
                    </div>
                  </div>
                  
                  <p className="text-neutral-500 text-sm font-medium mt-3 mb-6 line-clamp-2">
                    {place.description}
                  </p>

                  <button 
                    onClick={() => toggleSave(place.id)}
                    className={`w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                      savedActivities.includes(place.id) 
                        ? "bg-emerald-50 text-emerald-600 border border-emerald-200" 
                        : "bg-neutral-900 text-white hover:bg-neutral-800"
                    }`}
                  >
                    {savedActivities.includes(place.id) ? "Added to Trip" : <><Plus className="w-4 h-4" /> Add to Trip</>}
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
