import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../services/api";
import { ChevronLeft, Calendar, FileText, Loader2, ArrowRight, Plane, Car, Coffee, Home, Check, MapPin, Plus, Trash2, Clock } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Stop } from "../types";

export default function CreateTrip() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [createdTripId, setCreatedTripId] = useState<number | null>(null);
  
  // Stops added during Step 3
  const [stops, setStops] = useState<Stop[]>([]);

  // Step 3 UI States
  const [newStop, setNewStop] = useState({ city_name: "", country: "", arrival_date: "", departure_date: "" });
  const [showActivityFormFor, setShowActivityFormFor] = useState<number | null>(null);
  const [newActivity, setNewActivity] = useState({ name: "", time: "", cost: 0, description: "" });

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    start_date: "",
    end_date: "",
    budget_flights: 0,
    budget_cabs: 0,
    budget_food: 0,
    budget_accommodation: 0
  });

  const handleNextStep = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
      return;
    }
    if (step === 2) {
      setLoading(true);
      try {
        const trip = await api.createTrip(formData);
        setCreatedTripId(trip.id);
        setStep(3);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleFinish = () => {
    navigate(`/trips/${createdTripId}`);
  };

  const handleAddStop = async () => {
    if (!createdTripId || !newStop.city_name) return;
    setLoading(true);
    try {
      const stopData = { ...newStop, order_index: stops.length + 1 };
      const stop = await api.addStop(createdTripId, stopData);
      setStops([...stops, { ...stop, activities: [] }]);
      setNewStop({ city_name: "", country: "", arrival_date: "", departure_date: "" });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleAddActivity = async (stopId: number) => {
    if (!newActivity.name) return;
    setLoading(true);
    try {
      const activity = await api.addActivity(stopId, { ...newActivity, category: "Planned" });
      setStops(stops.map(s => s.id === stopId ? { ...s, activities: [...s.activities, activity] } : s));
      setNewActivity({ name: "", time: "", cost: 0, description: "" });
      setShowActivityFormFor(null);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (step === 3) {
      handleFinish(); // If they go back from 3, they already created it, so just go to details
    } else if (step === 2) {
      setStep(1);
    } else {
      navigate("/dashboard");
    }
  };

  const totalBudget = Number(formData.budget_flights) + Number(formData.budget_cabs) + Number(formData.budget_food) + Number(formData.budget_accommodation);

  return (
    <div className="min-h-screen bg-neutral-50 px-6 py-12 lg:py-20 overflow-x-hidden">
      <div className="max-w-2xl mx-auto relative">
        <button 
          onClick={handleBack}
          className="inline-flex items-center gap-2 text-neutral-500 hover:text-neutral-900 font-semibold mb-8 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" /> 
          {step === 3 ? "Skip & Finish" : step === 2 ? "Back to Details" : "Back to Dashboard"}
        </button>

        <div className="flex justify-center mb-10">
          <div className="flex items-center gap-4">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${step >= 1 ? 'bg-indigo-600 text-white' : 'bg-neutral-200 text-neutral-500'}`}>1</div>
            <div className={`w-12 h-1 rounded-full transition-colors ${step >= 2 ? 'bg-indigo-600' : 'bg-neutral-200'}`}></div>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${step >= 2 ? 'bg-indigo-600 text-white' : 'bg-neutral-200 text-neutral-500'}`}>2</div>
            <div className={`w-12 h-1 rounded-full transition-colors ${step >= 3 ? 'bg-indigo-600' : 'bg-neutral-200'}`}></div>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${step >= 3 ? 'bg-indigo-600 text-white' : 'bg-neutral-200 text-neutral-500'}`}>3</div>
          </div>
        </div>

        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-xl shadow-neutral-200/50 border border-neutral-100"
        >
          <div className="mb-10 text-center">
            <h1 className="text-3xl font-extrabold text-neutral-900 mb-2">
              {step === 1 ? "Plan a New Adventure" : step === 2 ? "Estimate Your Budget" : "Pin Your Activities"}
            </h1>
            <p className="text-neutral-500">
              {step === 1 ? "Let's build your dream itinerary together." 
               : step === 2 ? "Set your expected costs so we can track expenses." 
               : "Where are you going and what will you do?"}
            </p>
          </div>

          {step < 3 ? (
            <form onSubmit={handleNextStep} className="space-y-8">
              {step === 1 ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-neutral-700 ml-1">Trip Name</label>
                    <div className="relative">
                      <FileText className="absolute left-4 top-3.5 h-5 w-5 text-neutral-400" />
                      <input type="text" required placeholder="European Summer Tour" className="w-full pl-12 pr-4 py-4 bg-neutral-50 border border-neutral-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-lg" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-neutral-700 ml-1">Start Date</label>
                      <div className="relative">
                        <Calendar className="absolute left-4 top-3.5 h-5 w-5 text-neutral-400" />
                        <input type="date" required className="w-full pl-12 pr-4 py-4 bg-neutral-50 border border-neutral-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20" value={formData.start_date} onChange={(e) => setFormData({ ...formData, start_date: e.target.value })} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-neutral-700 ml-1">End Date</label>
                      <div className="relative">
                        <Calendar className="absolute left-4 top-3.5 h-5 w-5 text-neutral-400" />
                        <input type="date" required className="w-full pl-12 pr-4 py-4 bg-neutral-50 border border-neutral-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20" value={formData.end_date} onChange={(e) => setFormData({ ...formData, end_date: e.target.value })} />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-neutral-700 ml-1">Description (Optional)</label>
                    <textarea placeholder="Briefly describe your trip goals..." className="w-full p-4 bg-neutral-50 border border-neutral-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 min-h-[120px]" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
                  </div>
                </motion.div>
              ) : (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-neutral-700 ml-1 flex items-center gap-2"><Plane className="w-4 h-4 text-indigo-600"/> Flights</label>
                      <div className="relative"><span className="absolute left-4 top-4 font-bold text-neutral-400">₹</span><input type="number" min="0" className="w-full pl-10 pr-4 py-4 bg-neutral-50 border border-neutral-200 rounded-2xl text-lg" value={formData.budget_flights || ""} onChange={(e) => setFormData({ ...formData, budget_flights: Number(e.target.value) })} /></div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-neutral-700 ml-1 flex items-center gap-2"><Home className="w-4 h-4 text-cyan-600"/> Accommodation</label>
                      <div className="relative"><span className="absolute left-4 top-4 font-bold text-neutral-400">₹</span><input type="number" min="0" className="w-full pl-10 pr-4 py-4 bg-neutral-50 border border-neutral-200 rounded-2xl text-lg" value={formData.budget_accommodation || ""} onChange={(e) => setFormData({ ...formData, budget_accommodation: Number(e.target.value) })} /></div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-neutral-700 ml-1 flex items-center gap-2"><Coffee className="w-4 h-4 text-orange-600"/> Food & Dining</label>
                      <div className="relative"><span className="absolute left-4 top-4 font-bold text-neutral-400">₹</span><input type="number" min="0" className="w-full pl-10 pr-4 py-4 bg-neutral-50 border border-neutral-200 rounded-2xl text-lg" value={formData.budget_food || ""} onChange={(e) => setFormData({ ...formData, budget_food: Number(e.target.value) })} /></div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-neutral-700 ml-1 flex items-center gap-2"><Car className="w-4 h-4 text-emerald-600"/> Transit</label>
                      <div className="relative"><span className="absolute left-4 top-4 font-bold text-neutral-400">₹</span><input type="number" min="0" className="w-full pl-10 pr-4 py-4 bg-neutral-50 border border-neutral-200 rounded-2xl text-lg" value={formData.budget_cabs || ""} onChange={(e) => setFormData({ ...formData, budget_cabs: Number(e.target.value) })} /></div>
                    </div>
                  </div>
                  <div className="bg-indigo-50 p-6 rounded-2xl mt-8 flex items-center justify-between border border-indigo-100">
                    <span className="font-bold text-indigo-900">Total Budget</span>
                    <span className="text-3xl font-extrabold text-indigo-600">₹{totalBudget.toLocaleString()}</span>
                  </div>
                </motion.div>
              )}

              <button type="submit" disabled={loading} className="w-full py-5 bg-indigo-600 text-white rounded-3xl font-extrabold text-xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 disabled:opacity-70 flex items-center justify-center gap-2">
                {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : step === 1 ? <>Next: Set Budgets <ArrowRight className="w-6 h-6" /></> : <>Create & Add Activities <ArrowRight className="w-6 h-6" /></>}
              </button>
            </form>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
              
              {/* Destinations & Activities List */}
              <div className="space-y-6">
                {stops.map((stop, i) => (
                  <div key={stop.id} className="p-6 bg-neutral-50 rounded-3xl border border-neutral-100">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-extrabold text-lg flex items-center gap-2 text-indigo-900"><MapPin className="w-5 h-5 text-indigo-500" /> {stop.city_name}, {stop.country}</h3>
                      <button onClick={() => setShowActivityFormFor(stop.id)} className="text-sm font-bold text-indigo-600 bg-indigo-100 px-3 py-1.5 rounded-lg flex items-center gap-1 hover:bg-indigo-200"><Plus className="w-4 h-4"/> Activity</button>
                    </div>

                    {showActivityFormFor === stop.id && (
                      <div className="bg-white p-4 rounded-2xl border border-neutral-200 mb-4 shadow-sm">
                        <input placeholder="Activity Name (e.g. Eiffel Tower)" className="w-full p-3 bg-neutral-50 rounded-xl mb-3 border border-neutral-100 font-medium" value={newActivity.name} onChange={e => setNewActivity({...newActivity, name: e.target.value})} />
                        <div className="flex gap-3 mb-3">
                          <input type="time" className="flex-1 p-3 bg-neutral-50 rounded-xl border border-neutral-100" value={newActivity.time} onChange={e => setNewActivity({...newActivity, time: e.target.value})} />
                          <input type="number" placeholder="Cost (₹)" className="flex-1 p-3 bg-neutral-50 rounded-xl border border-neutral-100" value={newActivity.cost || ""} onChange={e => setNewActivity({...newActivity, cost: Number(e.target.value)})} />
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => handleAddActivity(stop.id)} disabled={loading} className="flex-1 bg-indigo-600 text-white font-bold py-2 rounded-xl text-sm">Save</button>
                          <button onClick={() => setShowActivityFormFor(null)} className="flex-1 bg-neutral-200 text-neutral-700 font-bold py-2 rounded-xl text-sm">Cancel</button>
                        </div>
                      </div>
                    )}

                    <div className="space-y-2">
                      {stop.activities.map(act => (
                        <div key={act.id} className="flex items-center gap-3 p-3 bg-white rounded-xl border border-neutral-100 shadow-sm">
                          <div className="bg-emerald-100 p-2 rounded-lg text-emerald-600"><Check className="w-4 h-4" /></div>
                          <div className="flex-1">
                            <h4 className="font-bold text-neutral-800">{act.name}</h4>
                            <p className="text-xs text-neutral-500 font-medium">{act.time || "Anytime"} • ₹{act.cost}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Add New Stop Form */}
              <div className="p-6 bg-white border-2 border-dashed border-neutral-200 rounded-3xl">
                <h4 className="font-bold text-neutral-700 mb-4 flex items-center gap-2"><MapPin className="w-4 h-4" /> Add Destination Stop</h4>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <input placeholder="City Name" className="w-full p-4 bg-neutral-50 rounded-xl border border-neutral-100 font-medium" value={newStop.city_name} onChange={e => setNewStop({...newStop, city_name: e.target.value})} />
                  <input placeholder="Country" className="w-full p-4 bg-neutral-50 rounded-xl border border-neutral-100 font-medium" value={newStop.country} onChange={e => setNewStop({...newStop, country: e.target.value})} />
                </div>
                <button onClick={handleAddStop} disabled={!newStop.city_name || loading} className="w-full bg-neutral-900 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 disabled:opacity-50">
                  <Plus className="w-5 h-5"/> Pin Location
                </button>
              </div>

              <button onClick={handleFinish} className="w-full py-5 bg-indigo-600 text-white rounded-3xl font-extrabold text-xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 flex items-center justify-center gap-2 mt-8">
                Finish Planning <Check className="w-6 h-6" />
              </button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
