import { useState, useEffect, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { Trip, Stop, ChecklistItem, TripNote } from "../types";
import { 
  ChevronLeft, Plus, Calendar, MapPin, Share2, 
  Trash2, Edit2, Loader2, ArrowRight, MoreVertical,
  Clock, DollarSign, Wallet, CheckCircle2, ListTodo, FileText, Sparkles, X, Check
} from "lucide-react";
import { format } from "date-fns";
import { motion, AnimatePresence } from "motion/react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

export default function TripDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"itinerary" | "budget" | "checklist" | "notes">("itinerary");
  const [showAddStop, setShowAddStop] = useState(false);
  // Checklist State
  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
  const [newChecklistItem, setNewChecklistItem] = useState("");

  // Notes State
  const [notes, setNotes] = useState<TripNote[]>([]);
  const [newNote, setNewNote] = useState("");

  const fetchTrip = useCallback(async () => {
    if (!id) return;
    try {
      const data = await api.getTrip(id);
      setTrip(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  const fetchChecklist = useCallback(async () => {
    if (id) {
      const data = await api.getChecklist(id);
      setChecklist(data);
    }
  }, [id]);

  const fetchNotes = useCallback(async () => {
    if (id) {
      const data = await api.getNotes(id);
      setNotes(data);
    }
  }, [id]);

  useEffect(() => {
    fetchTrip();
    fetchChecklist();
    fetchNotes();
  }, [fetchTrip, fetchChecklist, fetchNotes]);

  const handleAddStop = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      city_name: formData.get("city_name") as string,
      country: formData.get("country") as string,
      arrival_date: formData.get("arrival_date") as string,
      departure_date: formData.get("departure_date") as string,
      order_index: (trip?.stops?.length || 0) + 1
    };
    
    if (id) {
      await api.addStop(id, data);
      setShowAddStop(false);
      fetchTrip();
    }
  };

  const handleAddChecklistItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChecklistItem.trim() || !id) return;
    const item = await api.addChecklistItem(id, { task: newChecklistItem, category: "General" });
    setChecklist([...checklist, item]);
    setNewChecklistItem("");
  };

  const toggleChecklistItem = async (item: ChecklistItem) => {
    await api.toggleChecklistItem(item.id, !item.is_packed);
    setChecklist(checklist.map(i => i.id === item.id ? { ...i, is_packed: !i.is_packed } : i));
  };

  const deleteChecklistItem = async (itemId: number) => {
    await api.deleteChecklistItem(itemId);
    setChecklist(checklist.filter(i => i.id !== itemId));
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim() || !id) return;
    const note = await api.addNote(id, { content: newNote });
    setNotes([note, ...notes]);
    setNewNote("");
  };

  const deleteNote = async (noteId: number) => {
    await api.deleteNote(noteId);
    setNotes(notes.filter(n => n.id !== noteId));
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50">
      <Loader2 className="w-12 h-12 animate-spin text-indigo-600" />
    </div>
  );

  if (!trip) return <div>Trip not found</div>;

  // Budget Data
  const budgetData = trip.stops?.reduce((acc: any[], stop) => {
    const cost = stop.activities.reduce((sum, act) => sum + Number(act.cost), 0);
    acc.push({ name: stop.city_name, value: cost });
    return acc;
  }, []) || [];

  const totalCost = budgetData.reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Top Header */}
      <div className="bg-white border-b border-neutral-100 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center gap-2 text-neutral-500 hover:text-neutral-900 font-semibold transition-colors">
            <ChevronLeft className="w-5 h-5" /> All Trips
          </Link>
          <div className="flex items-center gap-3">
            <button 
              onClick={async () => {
                if (window.confirm("Are you sure you want to delete this trip?")) {
                  await api.deleteTrip(trip.id);
                  navigate("/dashboard");
                }
              }}
              className="p-2 text-neutral-400 hover:text-red-500 transition-colors"
              title="Delete Trip"
            >
              <Trash2 className="w-5 h-5" />
            </button>
            <button className="flex items-center gap-2 bg-neutral-100 text-neutral-600 px-4 py-2 rounded-xl text-sm font-bold hover:bg-neutral-200 transition-all">
              <Share2 className="w-4 h-4" /> Share
            </button>
            <button className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">
              Publish
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-10">
        {/* Banner Section */}
        <section className="mb-10">
           <div className="h-[300px] rounded-[3rem] overflow-hidden relative shadow-2xl shadow-neutral-200">
            {trip.cover_photo ? (
              <img src={trip.cover_photo} alt={trip.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex flex-col justify-end p-10">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="bg-white/20 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                  {trip.stops?.length || 0} stops
                </span>
                <span className="bg-white/20 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                  {trip.start_date ? format(new Date(trip.start_date), "MMM d") : "..."} — {trip.end_date ? format(new Date(trip.end_date), "MMM d, yyyy") : "..."}
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">{trip.name}</h1>
              {trip.description && <p className="text-white/80 mt-3 text-lg leading-relaxed max-w-2xl">{trip.description}</p>}
            </div>
          </div>
        </section>

        {/* Tab Navigation */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-10">
          <div className="flex flex-wrap items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <TabButton label="Itinerary" icon={<MapPin className="w-4 h-4" />} active={activeTab === "itinerary"} onClick={() => setActiveTab("itinerary")} />
            <TabButton label="Budget" icon={<Wallet className="w-4 h-4" />} active={activeTab === "budget"} onClick={() => setActiveTab("budget")} />
            <TabButton label="Checklist" icon={<ListTodo className="w-4 h-4" />} active={activeTab === "checklist"} onClick={() => setActiveTab("checklist")} />
            <TabButton label="Notes" icon={<FileText className="w-4 h-4" />} active={activeTab === "notes"} onClick={() => setActiveTab("notes")} />
          </div>
        </div>

        {/* Dynamic Content */}
        <div className="min-h-[400px]">
          {activeTab === "itinerary" && (
            <div className="space-y-12">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-neutral-900">Journey Path</h2>
                <button 
                  onClick={() => setShowAddStop(true)}
                  className="flex items-center gap-2 bg-indigo-50 text-indigo-600 px-5 py-2.5 rounded-2xl text-sm font-bold hover:bg-indigo-100 transition-all"
                >
                  <Plus className="w-4 h-4" /> Add Destination
                </button>
              </div>

              {trip.stops?.length === 0 ? (
                <div className="bg-white p-20 rounded-[2.5rem] text-center border-2 border-dashed border-neutral-200">
                  <MapPin className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
                  <p className="text-neutral-500 font-medium">Your itinerary is empty. Start adding cities to your trip!</p>
                </div>
              ) : (
                <div className="space-y-8">
                  {trip.stops?.map((stop, index) => (
                    <StopCard key={stop.id} stop={stop} index={index} onActivityAdded={fetchTrip} />
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "budget" && (
            <div className="grid md:grid-cols-2 gap-10">
              <div className="bg-white p-8 rounded-[2.5rem] border border-neutral-100 shadow-sm">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <DollarSign className="text-indigo-600" /> Cost Summary
                </h3>
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-6 bg-neutral-50 rounded-3xl">
                    <span className="text-neutral-500 font-semibold">Estimated Total</span>
                    <span className="text-3xl font-extrabold text-neutral-900">₹{totalCost.toLocaleString()}</span>
                  </div>
                  <div className="space-y-4">
                    {budgetData.map((data, i) => (
                      <div key={i} className="flex items-center justify-between px-2">
                        <span className="text-neutral-600 font-medium">{data.name}</span>
                        <span className="text-neutral-900 font-bold">₹{data.value.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-white p-8 rounded-[2.5rem] border border-neutral-100 shadow-sm flex flex-col items-center justify-center">
                <h3 className="text-xl font-bold mb-6 text-center w-full">Expense Distribution</h3>
                <div className="w-full h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={budgetData.length > 0 ? budgetData : [{ name: "No data", value: 1 }]}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {budgetData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={["#4F46E5", "#06B6D4", "#10B981", "#F59E0B", "#F43F5E"][index % 5]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {activeTab === "checklist" && (
            <div className="max-w-2xl mx-auto">
              <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-neutral-100">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-2xl font-bold">Packing List</h3>
                  <span className="text-sm font-bold text-neutral-400">
                    {checklist.filter(i => i.is_packed).length}/{checklist.length} Packed
                  </span>
                </div>

                <form onSubmit={handleAddChecklistItem} className="flex gap-4 mb-8">
                  <input 
                    type="text" 
                    value={newChecklistItem}
                    onChange={(e) => setNewChecklistItem(e.target.value)}
                    placeholder="Add item (e.g. Passport, Sunscreen)" 
                    className="flex-1 p-4 bg-neutral-50 border border-neutral-100 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                  <button type="submit" className="bg-indigo-600 text-white p-4 rounded-2xl hover:bg-indigo-700 transition-all">
                    <Plus className="w-6 h-6" />
                  </button>
                </form>

                <div className="space-y-3">
                  {checklist.length === 0 ? (
                    <div className="text-center py-10">
                      <p className="text-neutral-400">Your checklist is empty.</p>
                    </div>
                  ) : (
                    checklist.map(item => (
                      <div key={item.id} className="flex items-center justify-between p-4 bg-neutral-50 rounded-2xl group">
                        <div className="flex items-center gap-4">
                          <button 
                            onClick={() => toggleChecklistItem(item)}
                            className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${item.is_packed ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-neutral-300 bg-white'}`}
                          >
                            {item.is_packed && <Check className="w-4 h-4" />}
                          </button>
                          <span className={`font-semibold ${item.is_packed ? 'text-neutral-400 line-through' : 'text-neutral-700'}`}>
                            {item.task}
                          </span>
                        </div>
                        <button onClick={() => deleteChecklistItem(item.id)} className="opacity-0 group-hover:opacity-100 p-2 text-neutral-400 hover:text-red-500 transition-all">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === "notes" && (
            <div className="max-w-2xl mx-auto space-y-8">
              <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-neutral-100">
                <h3 className="text-2xl font-bold mb-6">Trip Journal & Notes</h3>
                <form onSubmit={handleAddNote} className="space-y-4">
                  <textarea 
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Write a memory or an important detail..." 
                    className="w-full p-6 bg-neutral-50 border border-neutral-100 rounded-[2rem] outline-none focus:ring-2 focus:ring-indigo-500/20 min-h-[150px]"
                  />
                  <button type="submit" className="w-full bg-neutral-900 text-white py-4 rounded-2xl font-bold hover:bg-neutral-800 transition-all flex items-center justify-center gap-2">
                    <Plus className="w-5 h-5" /> Save Note
                  </button>
                </form>
              </div>

              <div className="space-y-6">
                {notes.map(note => (
                  <div key={note.id} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-neutral-100 relative group">
                    <button onClick={() => deleteNote(note.id)} className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 p-2 text-neutral-400 hover:text-red-500 transition-all">
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <div className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-3">
                      {format(new Date(note.created_at), "MMM d, yyyy • h:mm a")}
                    </div>
                    <p className="text-neutral-700 leading-relaxed font-medium whitespace-pre-wrap">{note.content}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Add Stop Modal */}
      <AnimatePresence>
        {showAddStop && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddStop(false)}
              className="absolute inset-0 bg-neutral-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white w-full max-w-lg rounded-[2.5rem] p-8 shadow-2xl relative z-10"
            >
              <h2 className="text-2xl font-extrabold mb-6">Add Destination Stop</h2>
              <form onSubmit={handleAddStop} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-neutral-700">City Name</label>
                  <input name="city_name" required placeholder="e.g. Paris" className="w-full p-4 bg-neutral-50 border border-neutral-200 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-neutral-700">Country</label>
                  <input name="country" placeholder="e.g. France" className="w-full p-4 bg-neutral-50 border border-neutral-200 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 outline-none" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-neutral-700">Arrival</label>
                    <input name="arrival_date" type="date" className="w-full p-4 bg-neutral-50 border border-neutral-200 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-neutral-700">Departure</label>
                    <input name="departure_date" type="date" className="w-full p-4 bg-neutral-50 border border-neutral-200 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 outline-none" />
                  </div>
                </div>
                <div className="flex gap-4 pt-4">
                  <button type="button" onClick={() => setShowAddStop(false)} className="flex-1 py-4 font-bold text-neutral-500 hover:text-neutral-900 transition-colors">Cancel</button>
                  <button type="submit" className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">Add Stop</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function TabButton({ label, icon, active, onClick }: { label: string, icon: React.ReactNode, active: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold transition-all whitespace-nowrap ${active ? 'bg-neutral-900 text-white shadow-lg shadow-neutral-200' : 'bg-white text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900 border border-neutral-100'}`}
    >
      {icon} {label}
    </button>
  );
}

function StopCard({ stop, index, onActivityAdded }: { stop: Stop, index: number, onActivityAdded: () => void }) {
  const [showAddActivity, setShowAddActivity] = useState(false);

  const handleAddActivity = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      cost: Number(formData.get("cost")),
      time: formData.get("time") as string,
      description: formData.get("description") as string,
      category: "Default"
    };
    await api.addActivity(stop.id, data);
    setShowAddActivity(false);
    onActivityAdded();
  };

  return (
    <div className="relative pl-12 md:pl-16">
      {/* Timeline Line */}
      <div className="absolute left-[23px] top-0 bottom-0 w-1 bg-neutral-200 rounded-full" />
      <div className="absolute left-[13px] top-0 w-6 h-6 bg-indigo-600 rounded-full border-4 border-white shadow-sm flex items-center justify-center">
        <div className="w-1.5 h-1.5 bg-white rounded-full" />
      </div>

      <div className="bg-white p-8 rounded-[2.5rem] border border-neutral-100 shadow-sm relative group">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-indigo-600 font-bold text-sm uppercase tracking-wider mb-1">
              <MapPin className="w-4 h-4" /> Stop {index + 1}
            </div>
            <h3 className="text-2xl font-extrabold text-neutral-900">{stop.city_name}, {stop.country}</h3>
            <p className="text-neutral-500 font-semibold text-sm mt-1">
              {stop.arrival_date ? format(new Date(stop.arrival_date), "MMM d") : "?"} — {stop.departure_date ? format(new Date(stop.departure_date), "MMM d") : "?"}
            </p>
          </div>
          <button 
            onClick={() => setShowAddActivity(true)}
            className="flex items-center gap-2 bg-neutral-900 text-white px-5 py-2.5 rounded-2xl text-sm font-bold hover:bg-neutral-800 transition-all self-start"
          >
            <Plus className="w-4 h-4" /> Add Activity
          </button>
        </div>

        {/* Activity List */}
        <div className="space-y-4">
          {stop.activities.length === 0 ? (
            <p className="text-neutral-400 text-sm italic">No activities planned for this stop.</p>
          ) : (
            stop.activities.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between p-4 bg-neutral-50 rounded-2xl group/act">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-indigo-600 border border-neutral-100 shadow-sm">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-neutral-900">{activity.name}</h4>
                    <p className="text-xs text-neutral-500 font-semibold">{activity.time || "No time"} • ₹{activity.cost}</p>
                  </div>
                </div>
                <button className="opacity-0 group-hover/act:opacity-100 p-2 text-neutral-400 hover:text-red-500 transition-all">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Activity Modal */}
      <AnimatePresence>
        {showAddActivity && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowAddActivity(false)} className="absolute inset-0 bg-neutral-900/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white w-full max-w-lg rounded-[2.5rem] p-8 shadow-2xl relative z-10">
              <h2 className="text-2xl font-extrabold mb-6">Add Activity to {stop.city_name}</h2>
              <form onSubmit={handleAddActivity} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-neutral-700">Activity Name</label>
                  <input name="name" required placeholder="e.g. Eiffel Tower Visit" className="w-full p-4 bg-neutral-50 border border-neutral-200 rounded-2xl outline-none" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-neutral-700">Time</label>
                    <input name="time" type="time" className="w-full p-4 bg-neutral-50 border border-neutral-200 rounded-2xl outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-neutral-700">Cost (₹)</label>
                    <input name="cost" type="number" defaultValue="0" className="w-full p-4 bg-neutral-50 border border-neutral-200 rounded-2xl outline-none" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-neutral-700">Description</label>
                  <textarea name="description" placeholder="Notes about this activity..." className="w-full p-4 bg-neutral-50 border border-neutral-200 rounded-2xl outline-none min-h-[100px]" />
                </div>
                <div className="flex gap-4 pt-4">
                  <button type="button" onClick={() => setShowAddActivity(false)} className="flex-1 py-4 font-bold text-neutral-500 hover:text-neutral-900">Cancel</button>
                  <button type="submit" className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-100">Save Activity</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ComingSoon({ feature }: { feature: string }) {
  return (
    <div className="bg-white p-20 rounded-[3rem] text-center border-2 border-dashed border-neutral-100 flex flex-col items-center">
      <div className="w-16 h-16 bg-neutral-50 rounded-full flex items-center justify-center mb-6">
        <Plus className="text-neutral-300 w-8 h-8" />
      </div>
      <h3 className="text-xl font-bold mb-2">{feature} coming soon</h3>
      <p className="text-neutral-400 max-w-xs">We're building this feature to make your planning even better.</p>
    </div>
  );
}
