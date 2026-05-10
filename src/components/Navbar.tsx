import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Plane, Compass, Users, Map, DollarSign, ListTodo, FileText, CheckSquare, User, LogOut, ChevronDown, MoreHorizontal, Plus } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Don't show navbar on auth or landing page
  if (!user || location.pathname === "/" || location.pathname === "/auth") return null;

  return (
    <nav className="bg-white border-b border-neutral-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center gap-8">
            <Link to="/dashboard" className="flex items-center gap-2">
              <div className="bg-indigo-600 p-1.5 rounded-lg">
                <Plane className="text-white w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-neutral-900">Traveloop</span>
            </Link>

            <div className="hidden md:flex items-center gap-4">
              <NavLink to="/dashboard" icon={<Compass />} label="Dashboard" current={location.pathname} />
              <NavLink to="/trips" icon={<Map />} label="Trips" current={location.pathname} />
              <NavLink to="/trips/new" icon={<Plus />} label="Plan a Trip" current={location.pathname} />
              <NavLink to="/explore" icon={<Plane />} label="Explore" current={location.pathname} />
              <NavLink to="/community" icon={<Users />} label="Community" current={location.pathname} />

              {/* Dropdown for remaining pages */}
              <div className="relative ml-2" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${isDropdownOpen ? "bg-indigo-50 text-indigo-700 shadow-sm border border-indigo-100" : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 border border-transparent"
                    }`}
                >
                  <MoreHorizontal className="w-4 h-4" />
                  More
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`} />
                </button>

                <AnimatePresence>
                  {isDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute left-0 mt-2 w-56 rounded-2xl shadow-xl bg-white ring-1 ring-black/5 p-2"
                    >
                      <DropdownLink to="/itinerary-builder" icon={<ListTodo />} label="Itinerary Builder" onClick={() => setIsDropdownOpen(false)} />
                      <DropdownLink to="/expenses" icon={<DollarSign />} label="Expenses" onClick={() => setIsDropdownOpen(false)} />
                      <DropdownLink to="/notes" icon={<FileText />} label="Travel Notes" onClick={() => setIsDropdownOpen(false)} />
                      <DropdownLink to="/packing-checklist" icon={<CheckSquare />} label="Packing Checklist" onClick={() => setIsDropdownOpen(false)} />
                      <DropdownLink to="/activities" icon={<Map />} label="Activities" onClick={() => setIsDropdownOpen(false)} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link to="/profile" className="flex items-center gap-2 text-neutral-600 hover:text-indigo-600 font-semibold transition-colors py-2 px-3 rounded-xl hover:bg-indigo-50">
              <User className="w-5 h-5" />
              <span className="hidden sm:inline">{user?.name?.split(" ")[0]}</span>
            </Link>
            <button
              onClick={logout}
              className="text-neutral-400 hover:text-red-600 transition-colors p-2 rounded-xl hover:bg-red-50"
              title="Sign Out"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

function NavLink({ to, icon, label, current }: { to: string, icon: React.ReactNode, label: string, current: string }) {
  const active = current === to || current.startsWith(to + "/");
  return (
    <Link
      to={to}
      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${active ? "bg-indigo-50 text-indigo-700 shadow-sm border border-indigo-100" : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 border border-transparent"
        }`}
    >
      <span className="w-4 h-4">{icon}</span>
      {label}
    </Link>
  );
}

function DropdownLink({ to, icon, label, onClick }: { to: string, icon: React.ReactNode, label: string, onClick: () => void }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-neutral-600 hover:text-indigo-700 hover:bg-indigo-50 transition-colors"
    >
      <span className="w-4 h-4">{icon}</span>
      {label}
    </Link>
  );
}
