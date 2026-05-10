import { useState } from "react";
import { motion } from "motion/react";
import { CheckSquare, Plus, Trash2, Smartphone, Shirt, FileText, BriefcaseMedical } from "lucide-react";

type Item = { id: string; name: string; checked: boolean };
type Category = {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  items: Item[];
};

const INITIAL_CATEGORIES: Category[] = [
  {
    id: "docs",
    name: "Documents & Money",
    icon: <FileText className="w-5 h-5" />,
    color: "bg-blue-50 text-blue-600",
    items: [
      { id: "d1", name: "Passport / ID Card", checked: false },
      { id: "d2", name: "Flight Tickets & Boarding Pass", checked: false },
      { id: "d3", name: "Travel Insurance", checked: false },
      { id: "d4", name: "Credit Cards & Cash", checked: false },
    ]
  },
  {
    id: "electronics",
    name: "Electronics",
    icon: <Smartphone className="w-5 h-5" />,
    color: "bg-purple-50 text-purple-600",
    items: [
      { id: "e1", name: "Smartphone & Charger", checked: false },
      { id: "e2", name: "Universal Power Adapter", checked: false },
      { id: "e3", name: "Power Bank", checked: false },
      { id: "e4", name: "Headphones / Earbuds", checked: false },
    ]
  },
  {
    id: "clothing",
    name: "Clothing",
    icon: <Shirt className="w-5 h-5" />,
    color: "bg-orange-50 text-orange-600",
    items: [
      { id: "c1", name: "T-shirts / Tops", checked: false },
      { id: "c2", name: "Pants / Shorts", checked: false },
      { id: "c3", name: "Underwear & Socks", checked: false },
      { id: "c4", name: "Comfortable Walking Shoes", checked: false },
      { id: "c5", name: "Light Jacket / Sweater", checked: false },
    ]
  },
  {
    id: "toiletries",
    name: "Toiletries & Health",
    icon: <BriefcaseMedical className="w-5 h-5" />,
    color: "bg-emerald-50 text-emerald-600",
    items: [
      { id: "t1", name: "Toothbrush & Toothpaste", checked: false },
      { id: "t2", name: "Deodorant", checked: false },
      { id: "t3", name: "Sunscreen", checked: false },
      { id: "t4", name: "Basic First Aid (Band-aids, Painkillers)", checked: false },
      { id: "t5", name: "Prescription Medications", checked: false },
    ]
  }
];

export default function PackingChecklist() {
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);

  const toggleItem = (categoryId: string, itemId: string) => {
    setCategories(prev => prev.map(cat => {
      if (cat.id === categoryId) {
        return {
          ...cat,
          items: cat.items.map(item => item.id === itemId ? { ...item, checked: !item.checked } : item)
        };
      }
      return cat;
    }));
  };

  const deleteItem = (categoryId: string, itemId: string) => {
    setCategories(prev => prev.map(cat => {
      if (cat.id === categoryId) {
        return { ...cat, items: cat.items.filter(item => item.id !== itemId) };
      }
      return cat;
    }));
  };

  const totalItems = categories.reduce((acc, cat) => acc + cat.items.length, 0);
  const packedItems = categories.reduce((acc, cat) => acc + cat.items.filter(i => i.checked).length, 0);
  const progress = totalItems === 0 ? 0 : Math.round((packedItems / totalItems) * 100);

  return (
    <div className="min-h-screen bg-neutral-50 pb-20">
      <div className="max-w-4xl mx-auto px-6 lg:px-10 py-10">
        
        {/* Header & Progress */}
        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-neutral-100 mb-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div>
              <h1 className="text-3xl font-extrabold text-neutral-900 flex items-center gap-3">
                <div className="bg-indigo-100 p-2 rounded-xl text-indigo-600">
                  <CheckSquare className="w-7 h-7" />
                </div>
                Packing Checklist
              </h1>
              <p className="text-neutral-500 mt-2 text-lg">Don't forget the essentials for your trip.</p>
            </div>
            
            <div className="text-center md:text-right">
              <p className="text-4xl font-extrabold text-indigo-600">{progress}%</p>
              <p className="text-sm font-bold text-neutral-400 uppercase tracking-wider">Packed</p>
            </div>
          </div>
          
          <div className="w-full bg-neutral-100 rounded-full h-4 overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="bg-indigo-600 h-4 rounded-full"
            ></motion.div>
          </div>
        </div>

        {/* Categories */}
        <div className="space-y-6">
          {categories.map(category => {
            const catPacked = category.items.filter(i => i.checked).length;
            const catTotal = category.items.length;
            
            return (
              <div key={category.id} className="bg-white rounded-[2rem] shadow-sm border border-neutral-100 overflow-hidden">
                <div className="p-6 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl ${category.color}`}>
                      {category.icon}
                    </div>
                    <h2 className="text-xl font-bold text-neutral-900">{category.name}</h2>
                  </div>
                  <span className="font-semibold text-neutral-500 bg-white px-3 py-1 rounded-full shadow-sm border border-neutral-200 text-sm">
                    {catPacked} / {catTotal}
                  </span>
                </div>
                
                <div className="p-4 sm:p-6">
                  {category.items.length > 0 ? (
                    <ul className="space-y-3">
                      {category.items.map(item => (
                        <li key={item.id} className="flex items-center justify-between group p-2 hover:bg-neutral-50 rounded-xl transition-colors">
                          <label className="flex items-center gap-4 cursor-pointer flex-1">
                            <div className="relative flex items-center justify-center">
                              <input 
                                type="checkbox" 
                                checked={item.checked}
                                onChange={() => toggleItem(category.id, item.id)}
                                className="peer appearance-none w-6 h-6 border-2 border-neutral-300 rounded-lg checked:border-indigo-600 checked:bg-indigo-600 transition-colors cursor-pointer"
                              />
                              <CheckSquare className="absolute w-4 h-4 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" />
                            </div>
                            <span className={`text-lg font-medium transition-colors ${item.checked ? 'text-neutral-400 line-through' : 'text-neutral-800'}`}>
                              {item.name}
                            </span>
                          </label>
                          <button 
                            onClick={() => deleteItem(category.id, item.id)}
                            className="opacity-0 group-hover:opacity-100 p-2 text-neutral-400 hover:text-red-500 transition-all rounded-lg hover:bg-red-50"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-center text-neutral-400 py-4 font-medium">No items in this category.</p>
                  )}
                  
                  <div className="mt-4 pt-4 border-t border-neutral-100">
                    <button className="flex items-center gap-2 text-sm font-bold text-indigo-600 hover:text-indigo-800 transition-colors">
                      <Plus className="w-4 h-4" /> Add Item
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-10 text-center">
          <button className="inline-flex items-center gap-2 bg-neutral-900 text-white px-6 py-4 rounded-2xl font-bold hover:bg-neutral-800 transition-all shadow-lg">
            <Plus className="w-5 h-5" /> Add New Category
          </button>
        </div>

      </div>
    </div>
  );
}
