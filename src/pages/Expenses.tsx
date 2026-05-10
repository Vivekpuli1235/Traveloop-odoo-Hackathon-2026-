import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { DollarSign, TrendingDown, TrendingUp, Plus, Receipt, Coffee, Plane, Home, ShoppingBag, CreditCard, ChevronDown, Map } from "lucide-react";
import { api } from "../services/api";
import { Trip } from "../types";

export default function Expenses() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [selectedTripId, setSelectedTripId] = useState<string>("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await api.getTrips();
        setTrips(data);
      } catch (error) {
        console.error("Failed to load trips", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Filter logic
  const activeTrips = selectedTripId === "all" ? trips : trips.filter(t => t.id.toString() === selectedTripId);
  
  // Calculate Budgets based on selected trips
  const budgetFlights = activeTrips.reduce((acc, trip) => acc + Number(trip.budget_flights || 0), 0);
  const budgetCabs = activeTrips.reduce((acc, trip) => acc + Number(trip.budget_cabs || 0), 0);
  const budgetFood = activeTrips.reduce((acc, trip) => acc + Number(trip.budget_food || 0), 0);
  const budgetAccommodation = activeTrips.reduce((acc, trip) => acc + Number(trip.budget_accommodation || 0), 0);
  const budgetShopping = selectedTripId === "all" ? 500 : 100; // Mock shopping budget

  const totalBudget = budgetFlights + budgetCabs + budgetFood + budgetAccommodation + budgetShopping;

  // Mock Actual Spent (in reality, this would be sum of 'activities' costs)
  const spentFlights = budgetFlights * 0.8; 
  const spentCabs = budgetCabs * 0.6;
  const spentFood = budgetFood * 0.9;
  const spentAccommodation = budgetAccommodation * 1.0;
  const spentShopping = budgetShopping * 0.4;

  const totalSpent = spentFlights + spentCabs + spentFood + spentAccommodation + spentShopping;
  const remaining = totalBudget - totalSpent;
  const percentageSpent = totalBudget === 0 ? 0 : Math.round((totalSpent / totalBudget) * 100);

  const EXPENSE_DATA = [
    { name: "Flights", value: budgetFlights, color: "#4f46e5", icon: <Plane className="w-5 h-5" /> },
    { name: "Accommodation", value: budgetAccommodation, color: "#06b6d4", icon: <Home className="w-5 h-5" /> },
    { name: "Food & Dining", value: budgetFood, color: "#f59e0b", icon: <Coffee className="w-5 h-5" /> },
    { name: "Cabs & Transit", value: budgetCabs, color: "#10b981", icon: <Receipt className="w-5 h-5" /> },
    { name: "Shopping", value: budgetShopping, color: "#ec4899", icon: <ShoppingBag className="w-5 h-5" /> },
  ].filter(item => item.value > 0);

  const DAILY_SPEND = [
    { day: "Mon", amount: (totalSpent * 0.1).toFixed(0) },
    { day: "Tue", amount: (totalSpent * 0.2).toFixed(0) },
    { day: "Wed", amount: (totalSpent * 0.15).toFixed(0) },
    { day: "Thu", amount: (totalSpent * 0.25).toFixed(0) },
    { day: "Fri", amount: (totalSpent * 0.1).toFixed(0) },
    { day: "Sat", amount: (totalSpent * 0.15).toFixed(0) },
    { day: "Sun", amount: (totalSpent * 0.05).toFixed(0) },
  ];

  if (loading) {
    return <div className="min-h-screen bg-neutral-50 flex items-center justify-center">Loading budgets...</div>;
  }

  return (
    <div className="min-h-screen bg-neutral-50 pb-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-extrabold text-neutral-900 flex items-center gap-3">
              <div className="bg-indigo-100 p-2 rounded-xl text-indigo-600">
                <DollarSign className="w-7 h-7" />
              </div>
              Budget & Expenses
            </h1>
            <p className="text-neutral-500 mt-1 text-lg">Keep track of your spending across your trips.</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <select 
                value={selectedTripId}
                onChange={(e) => setSelectedTripId(e.target.value)}
                className="appearance-none bg-white border border-neutral-200 text-neutral-700 font-bold py-3 pl-4 pr-10 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 cursor-pointer"
              >
                <option value="all">🌍 Overall Expenses</option>
                {trips.map(trip => (
                  <option key={trip.id} value={trip.id}>📍 {trip.name}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-3.5 w-5 h-5 text-neutral-400 pointer-events-none" />
            </div>

            <button className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 flex items-center justify-center gap-2">
              <Plus className="w-5 h-5" /> Add Expense
            </button>
          </div>
        </div>

        {totalBudget === 0 && selectedTripId !== "all" ? (
          <div className="bg-white p-12 rounded-[2rem] text-center border-2 border-dashed border-neutral-200">
            <Map className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-neutral-800 mb-2">No budget set for this trip</h3>
            <p className="text-neutral-500">You haven't added any budget estimates for this trip yet.</p>
          </div>
        ) : (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              <motion.div whileHover={{ y: -5 }} className="bg-white p-6 rounded-[2rem] shadow-sm border border-neutral-100">
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-indigo-50 p-2 rounded-lg text-indigo-600"><CreditCard className="w-5 h-5" /></div>
                  <h3 className="font-bold text-neutral-500">Estimated Budget</h3>
                </div>
                <p className="text-4xl font-extrabold text-neutral-900">₹{totalBudget.toLocaleString()}</p>
              </motion.div>

              <motion.div whileHover={{ y: -5 }} className="bg-white p-6 rounded-[2rem] shadow-sm border border-neutral-100">
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-red-50 p-2 rounded-lg text-red-600"><TrendingDown className="w-5 h-5" /></div>
                  <h3 className="font-bold text-neutral-500">Actual Spent</h3>
                </div>
                <div className="flex items-end gap-3">
                  <p className="text-4xl font-extrabold text-neutral-900">₹{totalSpent.toLocaleString()}</p>
                  <span className="text-sm font-bold text-red-500 mb-1">{percentageSpent}%</span>
                </div>
              </motion.div>

              <motion.div whileHover={{ y: -5 }} className="bg-white p-6 rounded-[2rem] shadow-sm border border-neutral-100">
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-emerald-50 p-2 rounded-lg text-emerald-600"><TrendingUp className="w-5 h-5" /></div>
                  <h3 className="font-bold text-neutral-500">Remaining</h3>
                </div>
                <p className="text-4xl font-extrabold text-neutral-900">₹{remaining.toLocaleString()}</p>
              </motion.div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Charts Section */}
              <div className="lg:col-span-2 space-y-8">
                <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-neutral-100">
                  <h3 className="text-xl font-bold text-neutral-900 mb-6">Daily Spending Trend</h3>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={DAILY_SPEND}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e5e5" />
                        <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#737373', fontSize: 14 }} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#737373', fontSize: 14 }} dx={-10} tickFormatter={(value) => `₹${value}`} />
                        <Tooltip cursor={{ fill: '#f5f5f5' }} contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                        <Bar dataKey="amount" fill="#4f46e5" radius={[6, 6, 0, 0]} barSize={40} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-neutral-100">
                  <h3 className="text-xl font-bold text-neutral-900 mb-6">Budget Breakdown</h3>
                  <div className="flex flex-col md:flex-row items-center gap-8">
                    <div className="h-64 w-full md:w-1/2">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={EXPENSE_DATA} cx="50%" cy="50%" innerRadius={70} outerRadius={100} paddingAngle={5} dataKey="value">
                            {EXPENSE_DATA.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} stroke="transparent" />
                            ))}
                          </Pie>
                          <Tooltip contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="w-full md:w-1/2 space-y-4">
                      {EXPENSE_DATA.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                            <span className="font-semibold text-neutral-700">{item.name}</span>
                          </div>
                          <span className="font-bold text-neutral-900">₹{item.value.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Transactions */}
              <div className="lg:col-span-1">
                <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-neutral-100 h-full">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-xl font-bold text-neutral-900">Recent Transactions</h3>
                    <button className="text-sm font-semibold text-indigo-600 hover:underline">View All</button>
                  </div>
                  
                  <div className="space-y-6">
                    {[
                      { title: "Delta Airlines", date: "Today", amount: spentFlights, category: "Flights", icon: <Plane className="text-indigo-600 w-5 h-5"/>, color: "bg-indigo-100" },
                      { title: "Hotel Booking", date: "Yesterday", amount: spentAccommodation, category: "Accommodation", icon: <Home className="text-cyan-600 w-5 h-5"/>, color: "bg-cyan-100" },
                      { title: "Restaurant", date: "Yesterday", amount: spentFood * 0.5, category: "Food & Dining", icon: <Coffee className="text-orange-600 w-5 h-5"/>, color: "bg-orange-100" },
                      { title: "Uber Ride", date: "Oct 12", amount: spentCabs, category: "Cabs & Transit", icon: <Receipt className="text-emerald-600 w-5 h-5"/>, color: "bg-emerald-100" },
                    ].filter(t => t.amount > 0).map((tx, idx) => (
                      <div key={idx} className="flex items-center justify-between p-4 rounded-2xl hover:bg-neutral-50 transition-colors border border-transparent hover:border-neutral-100">
                        <div className="flex items-center gap-4">
                          <div className={`${tx.color} p-3 rounded-xl`}>
                            {tx.icon}
                          </div>
                          <div>
                            <h4 className="font-bold text-neutral-900">{tx.title}</h4>
                            <p className="text-sm font-medium text-neutral-500">{tx.category} • {tx.date}</p>
                          </div>
                        </div>
                        <span className="font-extrabold text-neutral-900">₹{tx.amount.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
            </div>
          </>
        )}
      </div>
    </div>
  );
}
