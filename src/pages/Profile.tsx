import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";
import { User as UserIcon, Mail, Settings, ChevronLeft, Camera, LogOut, MapPin, Compass, Heart, Loader2, Edit3, X, Check } from "lucide-react";

export default function Profile() {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: "",
    photo: "",
    interested_places: "",
    travel_interests: "",
    dream_places: ""
  });

  useEffect(() => {
    api.getProfile().then((data) => {
      setProfile(data);
      setFormData({
        name: data.name || "",
        photo: data.photo || "",
        interested_places: data.interested_places || "",
        travel_interests: data.travel_interests || "",
        dream_places: data.dream_places || ""
      });
    }).finally(() => setLoading(false));
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, photo: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.updateProfile(formData);
      // Reload profile to reflect changes
      const updatedProfile = await api.getProfile();
      setProfile(updatedProfile);
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update profile", error);
    } finally {
      setSaving(false);
    }
  };

  const cancelEdit = () => {
    if (profile) {
      setFormData({
        name: profile.name || "",
        photo: profile.photo || "",
        interested_places: profile.interested_places || "",
        travel_interests: profile.travel_interests || "",
        dream_places: profile.dream_places || ""
      });
    }
    setIsEditing(false);
  };

  if (!user || loading) return (
    <div className="min-h-screen flex justify-center items-center">
      <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
    </div>
  );

  return (
    <div className="min-h-screen bg-neutral-50 px-6 py-10 pb-20">
      <div className="max-w-3xl mx-auto">
        <Link to="/dashboard" className="flex items-center gap-2 text-neutral-500 hover:text-neutral-900 transition-colors font-bold mb-8">
          <ChevronLeft className="w-5 h-5" /> Dashboard
        </Link>

        <div className="bg-white rounded-[2.5rem] p-10 shadow-xl shadow-neutral-200/50 border border-neutral-100">
          <div className="flex flex-col items-center text-center mb-10">
            <div className="relative mb-6">
              <div className="w-32 h-32 bg-indigo-100 rounded-full flex items-center justify-center overflow-hidden border-4 border-white shadow-lg">
                {formData.photo ? (
                  <img src={formData.photo} alt={formData.name} className="w-full h-full object-cover" />
                ) : (
                  <UserIcon className="w-16 h-16 text-indigo-400" />
                )}
              </div>
              {isEditing && (
                <>
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-1 right-1 bg-indigo-600 text-white p-2.5 rounded-full shadow-lg border-2 border-white hover:bg-indigo-700 transition-all"
                  >
                    <Camera className="w-5 h-5" />
                  </button>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*" 
                    onChange={handleImageUpload} 
                  />
                </>
              )}
            </div>
            
            {isEditing ? (
              <input 
                type="text" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="Your Name"
                className="text-3xl font-extrabold text-neutral-900 text-center outline-none bg-neutral-50 px-4 py-2 rounded-xl transition-colors border border-neutral-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              />
            ) : (
              <h1 className="text-3xl font-extrabold text-neutral-900 px-4 py-2">{formData.name || "Add your name"}</h1>
            )}
            <p className="text-neutral-500 font-medium mt-2">{user.email}</p>
          </div>

          <div className="grid grid-cols-1 gap-6 mb-10">
            <div className="space-y-3">
              <label className="text-sm font-bold text-neutral-700 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-indigo-500" /> Interested Places
              </label>
              {isEditing ? (
                <input 
                  type="text"
                  value={formData.interested_places}
                  onChange={(e) => setFormData({...formData, interested_places: e.target.value})}
                  placeholder="e.g. Kyoto, Machu Picchu, Swiss Alps"
                  className="w-full p-4 bg-neutral-50 border border-neutral-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              ) : (
                <div className="w-full p-4 bg-neutral-50 border border-transparent rounded-2xl text-neutral-800 font-medium">
                  {formData.interested_places || <span className="text-neutral-400 italic">No places added yet.</span>}
                </div>
              )}
            </div>

            <div className="space-y-3">
              <label className="text-sm font-bold text-neutral-700 flex items-center gap-2">
                <Compass className="w-4 h-4 text-emerald-500" /> Travel Interests
              </label>
              {isEditing ? (
                <input 
                  type="text"
                  value={formData.travel_interests}
                  onChange={(e) => setFormData({...formData, travel_interests: e.target.value})}
                  placeholder="e.g. Adventure, Food, Culture, Backpacking"
                  className="w-full p-4 bg-neutral-50 border border-neutral-200 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              ) : (
                <div className="w-full p-4 bg-neutral-50 border border-transparent rounded-2xl text-neutral-800 font-medium">
                  {formData.travel_interests || <span className="text-neutral-400 italic">No interests added yet.</span>}
                </div>
              )}
            </div>

            <div className="space-y-3">
              <label className="text-sm font-bold text-neutral-700 flex items-center gap-2">
                <Heart className="w-4 h-4 text-pink-500" /> Dream Destinations
              </label>
              {isEditing ? (
                <input 
                  type="text"
                  value={formData.dream_places}
                  onChange={(e) => setFormData({...formData, dream_places: e.target.value})}
                  placeholder="e.g. Antarctica, Northern Lights in Norway"
                  className="w-full p-4 bg-neutral-50 border border-neutral-200 rounded-2xl outline-none focus:ring-2 focus:ring-pink-500/20"
                />
              ) : (
                <div className="w-full p-4 bg-neutral-50 border border-transparent rounded-2xl text-neutral-800 font-medium">
                  {formData.dream_places || <span className="text-neutral-400 italic">No dream destinations added yet.</span>}
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-neutral-100">
            {isEditing ? (
              <>
                <button 
                  onClick={cancelEdit}
                  className="py-4 px-8 bg-white text-neutral-600 border border-neutral-200 rounded-2xl font-bold hover:bg-neutral-50 transition-all flex items-center justify-center gap-2"
                >
                  <X className="w-5 h-5" /> Cancel
                </button>
                <button 
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 disabled:opacity-70 transition-all"
                >
                  {saving && <Loader2 className="w-5 h-5 animate-spin" />}
                  {saving ? "Saving..." : <><Check className="w-5 h-5" /> Save Changes</>}
                </button>
              </>
            ) : (
              <>
                <button 
                  onClick={() => setIsEditing(true)}
                  className="flex-1 py-4 bg-neutral-900 text-white rounded-2xl font-bold hover:bg-neutral-800 shadow-lg shadow-neutral-200 flex items-center justify-center gap-2 transition-all"
                >
                  <Edit3 className="w-5 h-5" /> Update Profile
                </button>
                <button 
                  onClick={logout}
                  className="py-4 px-8 bg-white text-red-600 border border-red-100 rounded-2xl font-bold hover:bg-red-50 transition-all flex items-center justify-center gap-2"
                >
                  <LogOut className="w-5 h-5" /> Sign Out
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
