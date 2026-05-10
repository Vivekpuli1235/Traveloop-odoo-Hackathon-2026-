import { motion } from "motion/react";
import { Search, MapPin, Sun, Snowflake, Leaf, Compass } from "lucide-react";

const indianCities = [
  { name: "Goa", image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", tag: "Beaches & Nightlife" },
  { name: "Jaipur", image: "https://images.unsplash.com/photo-1477587458883-47145ed94245?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", tag: "Royal Heritage" },
  { name: "Kerala", image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", tag: "Backwaters & Nature" },
  { name: "Varanasi", image: "https://images.unsplash.com/photo-1561361058-c24cecae14cf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", tag: "Spiritual Culture" },
  { name: "Ladakh", image: "https://images.unsplash.com/photo-1581793746485-04698e79a4e8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", tag: "Adventure" },
  { name: "Agra", image: "https://images.unsplash.com/photo-1564507592208-0282bc7291a8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", tag: "Iconic Monuments" }
];

const categories = [
  {
    title: "Summer Paradises",
    icon: <Sun className="w-5 h-5 text-orange-500" />,
    destinations: [
      { name: "Santorini, Greece", image: "https://images.unsplash.com/photo-1533105079780-92b9be482077?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
      { name: "Bali, Indonesia", image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
      { name: "Amalfi Coast, Italy", image: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
      { name: "Maui, Hawaii", image: "https://images.unsplash.com/photo-1542259009477-d625272157b7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
    ]
  },
  {
    title: "Winter Wonderlands",
    icon: <Snowflake className="w-5 h-5 text-blue-500" />,
    destinations: [
      { name: "Zermatt, Switzerland", image: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
      { name: "Banff, Canada", image: "https://images.unsplash.com/photo-1623594362141-9c60e487da84?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
      { name: "Hokkaido, Japan", image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
      { name: "Tromsø, Norway", image: "https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
    ]
  },
  {
    title: "Spring Blossoms",
    icon: <Leaf className="w-5 h-5 text-emerald-500" />,
    destinations: [
      { name: "Kyoto, Japan", image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" }, // Using a nice spring-like temple
      { name: "Keukenhof, Netherlands", image: "https://images.unsplash.com/photo-1585553616435-2dc0a54e271d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
      { name: "Paris, France", image: "https://images.unsplash.com/photo-1502602898657-3e9076002082?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
      { name: "Washington D.C., USA", image: "https://images.unsplash.com/photo-1582236087524-8149eb01d293?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
    ]
  }
];

export default function Explore() {
  return (
    <div className="min-h-screen bg-neutral-50 pb-20">
      {/* Search Hero */}
      <div className="bg-indigo-600 px-6 py-16 md:py-24 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6">Where to next?</h1>
        <div className="max-w-2xl mx-auto relative">
          <Search className="absolute left-4 top-4 text-neutral-400 w-6 h-6" />
          <input 
            type="text" 
            placeholder="Search for destinations, cities, or categories..." 
            className="w-full pl-14 pr-4 py-4 rounded-2xl text-lg focus:outline-none focus:ring-4 focus:ring-indigo-300 shadow-xl"
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-10 -mt-8 relative z-10 space-y-16">
        
        {/* Incredible India Section */}
        <section>
          <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-neutral-100">
            <div className="flex items-center gap-3 mb-8">
              <div className="bg-orange-100 p-2.5 rounded-xl">
                <MapPin className="text-orange-600 w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-neutral-900">Incredible India</h2>
                <p className="text-neutral-500 font-medium">Top picks from across the country</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {indianCities.map((city, idx) => (
                <DestinationCard 
                  key={idx} 
                  title={city.name} 
                  image={city.image} 
                  tag={city.tag} 
                />
              ))}
            </div>
          </div>
        </section>

        {/* Global Categories Section */}
        <section className="space-y-12">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-extrabold text-neutral-900 mb-4 flex items-center justify-center gap-3">
              <Compass className="text-indigo-600 w-8 h-8" />
              Global Escapes
            </h2>
            <p className="text-neutral-500 text-lg">
              Find the perfect international destination tailored to the season you want to travel.
            </p>
          </div>

          {categories.map((category, idx) => (
            <div key={idx} className="space-y-6">
              <div className="flex items-center gap-3 border-b border-neutral-200 pb-3">
                <div className="bg-white p-2 rounded-lg shadow-sm border border-neutral-100">
                  {category.icon}
                </div>
                <h3 className="text-2xl font-bold text-neutral-800">{category.title}</h3>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {category.destinations.map((dest, destIdx) => (
                  <DestinationCard 
                    key={destIdx} 
                    title={dest.name} 
                    image={dest.image} 
                  />
                ))}
              </div>
            </div>
          ))}
        </section>

      </div>
    </div>
  );
}

function DestinationCard({ title, image, tag }: { title: string, image: string, tag?: string }) {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      className="relative rounded-[1.5rem] overflow-hidden shadow-sm group h-72 cursor-pointer bg-neutral-200"
    >
      <img src={image} alt={title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex flex-col justify-end p-6">
        {tag && (
          <span className="bg-white/20 backdrop-blur-md text-white text-xs font-bold uppercase tracking-wider py-1 px-3 rounded-full self-start mb-3 border border-white/30">
            {tag}
          </span>
        )}
        <h3 className="text-2xl font-bold text-white leading-tight drop-shadow-md">{title}</h3>
      </div>
    </motion.div>
  );
}
