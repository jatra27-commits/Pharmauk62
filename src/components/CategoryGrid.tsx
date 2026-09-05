import React from 'react';
import { 
  Moon, 
  HeartHandshake, 
  Activity, 
  Brain, 
  ShieldAlert, 
  Flame, 
  Sparkles, 
  Smile, 
  Wind,
  Layers
} from 'lucide-react';
import { ProductCategory } from '../types';
import { REST_EASY_PRODUCTS } from '../data/medicineCatalog';

interface CategoryGridProps {
  selectedCategory: ProductCategory | 'All';
  onSelectCategory: (category: ProductCategory | 'All') => void;
}

export const CategoryGrid: React.FC<CategoryGridProps> = ({
  selectedCategory,
  onSelectCategory
}) => {
  const categories: { name: ProductCategory; icon: React.ReactNode; description: string; popular?: boolean }[] = [
    {
      name: 'Sleep Aids',
      icon: <Moon className="w-5 h-5" />,
      description: 'Zopiclone (7.5mg, 10mg, 20mg), Zolpidem, Nitrazepam & Midazolam',
      popular: true
    },
    {
      name: 'Anxiety & Calm',
      icon: <HeartHandshake className="w-5 h-5" />,
      description: 'Diazepam (Sedil, Easium, Elipam), Clonazepam, Xanax, Lorazepam & Pregabalin',
      popular: true
    },
    {
      name: 'Pain Relief',
      icon: <Activity className="w-5 h-5" />,
      description: 'Tramadol 100mg & Pain O Soma (Carisoprodol 350mg/500mg)',
      popular: true
    },
    {
      name: 'Nootropics & Focus',
      icon: <Brain className="w-5 h-5" />,
      description: 'Modafinil 200mg & Ritalin 10mg (Methylphenidate)',
      popular: true
    }
  ];

  return (
    <section className="py-8 bg-[#0b0f19]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">
          <div>
            <span className="text-xs font-semibold text-cyan-400 uppercase tracking-widest">
              Clinical Specialities
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white font-serif-heading">
              Shop by Medical Category
            </h2>
          </div>
          <button
            onClick={() => onSelectCategory('All')}
            className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
              selectedCategory === 'All'
                ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-bold'
                : 'text-slate-300 border-slate-700 hover:border-cyan-400 bg-[#0f172a]'
            }`}
          >
            View All Categories ({REST_EASY_PRODUCTS.length})
          </button>
        </div>

        {/* Category Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5">
          {categories.map((cat) => {
            const count = REST_EASY_PRODUCTS.filter(p => p.category === cat.name).length;
            const isSelected = selectedCategory === cat.name;

            return (
              <button
                key={cat.name}
                onClick={() => onSelectCategory(cat.name)}
                className={`p-4 rounded-xl text-left transition-all relative overflow-hidden group cursor-pointer border ${
                  isSelected
                    ? 'bg-gradient-to-br from-[#111e38] to-[#0c1527] border-cyan-400 shadow-lg shadow-cyan-950/80 scale-[1.02]'
                    : 'bg-[#0f172a]/80 border-slate-800 hover:border-cyan-500/50 hover:bg-[#162033]'
                }`}
              >
                {cat.popular && (
                  <span className="absolute top-2 right-2 text-[9px] font-bold px-1.5 py-0.5 rounded bg-cyan-400/20 text-cyan-300 border border-cyan-400/30 uppercase tracking-wider">
                    Popular
                  </span>
                )}

                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 transition-colors ${
                  isSelected 
                    ? 'bg-cyan-500 text-slate-950' 
                    : 'bg-cyan-950/60 text-cyan-400 group-hover:bg-cyan-900/80 group-hover:text-cyan-200 border border-cyan-700/30'
                }`}>
                  {cat.icon}
                </div>

                <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-slate-400 mt-1 line-clamp-1">
                  {cat.description}
                </p>

                <div className="mt-3 flex items-center justify-between text-[11px] text-cyan-400 font-medium">
                  <span>{count} Treatments</span>
                  <span className="text-cyan-500 group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
