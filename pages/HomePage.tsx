import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Play, Zap, ShieldCheck, DollarSign, Monitor, Cpu, ArrowRight, MousePointerClick 
} from 'lucide-react';
import { BuildState, PartCategory } from '../types';
import { MOCK_PARTS } from '../constants';
import HeroBackground from '../components/HeroBackground';

interface HomePageProps {
  onLoadPreset: (parts: BuildState) => void;
}

// --- MOCK PRESETS ---
const PRESETS = [
  {
    id: 'starter',
    name: 'Starter 1080p Build',
    description: 'Perfect for competitive gaming at 1080p. Great value performance.',
    price: 850,
    parts: {
        [PartCategory.CPU]: MOCK_PARTS.find(p => p.name.includes('5600X')),
        [PartCategory.GPU]: MOCK_PARTS.find(p => p.name.includes('7600')),
        [PartCategory.MOTHERBOARD]: MOCK_PARTS.find(p => p.name.includes('B550')),
        [PartCategory.RAM]: MOCK_PARTS.find(p => p.name.includes('LPX 16GB')),
        [PartCategory.CASE]: MOCK_PARTS.find(p => p.name.includes('4000D')),
        [PartCategory.PSU]: MOCK_PARTS.find(p => p.name.includes('650')),
        [PartCategory.STORAGE]: MOCK_PARTS.find(p => p.name.includes('SN850X'))
    }
  },
  {
    id: 'midrange',
    name: '1440p High Refresh',
    description: 'The sweet spot. Balanced power for modern titles at high settings.',
    price: 1650,
    parts: {
        [PartCategory.CPU]: MOCK_PARTS.find(p => p.name.includes('7800X3D')),
        [PartCategory.GPU]: MOCK_PARTS.find(p => p.name.includes('7800 XT')),
        [PartCategory.MOTHERBOARD]: MOCK_PARTS.find(p => p.name.includes('B650')),
        [PartCategory.RAM]: MOCK_PARTS.find(p => p.name.includes('Trident')),
        [PartCategory.CASE]: MOCK_PARTS.find(p => p.name.includes('H9')),
        [PartCategory.PSU]: MOCK_PARTS.find(p => p.name.includes('850')),
        [PartCategory.COOLER]: MOCK_PARTS.find(p => p.name.includes('Kraken')),
    }
  },
  {
    id: 'elite',
    name: '4K Ultra Workstation',
    description: 'No compromises. Top-tier components for creating and gaming.',
    price: 3400,
    parts: {
        [PartCategory.CPU]: MOCK_PARTS.find(p => p.name.includes('14900K')),
        [PartCategory.GPU]: MOCK_PARTS.find(p => p.name.includes('4090')),
        [PartCategory.MOTHERBOARD]: MOCK_PARTS.find(p => p.name.includes('Z790')),
        [PartCategory.RAM]: MOCK_PARTS.find(p => p.name.includes('Vengeance 32GB')),
        [PartCategory.CASE]: MOCK_PARTS.find(p => p.name.includes('Lian Li')),
        [PartCategory.PSU]: MOCK_PARTS.find(p => p.name.includes('1000')),
        [PartCategory.COOLER]: MOCK_PARTS.find(p => p.name.includes('Kraken')),
        [PartCategory.FAN]: MOCK_PARTS.find(p => p.name.includes('Lian Li')),
    }
  }
];

const HomePage: React.FC<HomePageProps> = ({ onLoadPreset }) => {
  const navigate = useNavigate();

  const handleStart = () => {
      navigate('/builder');
  };

  const handlePresetClick = (parts: any) => {
      // Filter out undefined parts in case mocks changed
      const cleanParts: BuildState = {};
      Object.keys(parts).forEach(k => {
          if(parts[k]) cleanParts[k] = parts[k];
      });
      onLoadPreset(cleanParts);
  };

  return (
    <div className="flex-1 h-full overflow-y-auto bg-[#07070A] relative custom-scrollbar">
      
      {/* Immersive Background */}
      <HeroBackground />

      {/* --- HERO SECTION --- */}
      <section className="relative min-h-[85vh] flex flex-col items-center justify-center text-center px-6 py-20 overflow-hidden">
          
          <div className="relative z-10 max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
              
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-4 shadow-lg shadow-indigo-500/5">
                  <Zap size={12} fill="currentColor" /> v2.0 Now Available
              </div>

              <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white leading-tight">
                  Interactive PC Building <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
                      in Real-Time 3D
                  </span>
              </h1>
              
              <p className="text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">
                  Design your dream rig with professional compatibility checking, 
                  live pricing, and beautiful visualization.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                  <button 
                    onClick={handleStart}
                    className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-bold text-lg shadow-[0_0_40px_rgba(79,70,229,0.4)] transition-all hover:scale-105 active:scale-95 flex items-center gap-2 border border-indigo-400/20"
                  >
                      <Play size={20} fill="currentColor" /> Start Building
                  </button>
                  <button 
                    onClick={() => {
                        const el = document.getElementById('presets');
                        el?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-2xl font-bold text-lg transition-all flex items-center gap-2 backdrop-blur-md"
                  >
                      View Presets
                  </button>
              </div>

              {/* Feature Pills */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-12 text-left">
                  {[
                      { icon: ShieldCheck, title: "100% Compatible", desc: "Auto-check logic" },
                      { icon: DollarSign, title: "Live Pricing", desc: "Real-time rates" },
                      { icon: Monitor, title: "4K 3D View", desc: "360° inspection" },
                      { icon: Zap, title: "Power Est.", desc: "Wattage calc" },
                  ].map((feat, i) => (
                      <div key={i} className="p-4 bg-zinc-900/40 backdrop-blur-sm border border-white/5 rounded-xl flex flex-col gap-2 hover:bg-zinc-800/60 transition-colors group cursor-default">
                          <feat.icon className="text-indigo-400 group-hover:text-indigo-300 transition-colors" size={24} />
                          <div>
                              <p className="font-bold text-white text-sm">{feat.title}</p>
                              <p className="text-zinc-500 text-xs">{feat.desc}</p>
                          </div>
                      </div>
                  ))}
              </div>

          </div>
      </section>

      {/* --- QUICK START PRESETS --- */}
      <section id="presets" className="relative z-10 max-w-7xl mx-auto px-6 py-24">
          <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-white mb-4">Quick Start Configurations</h2>
              <p className="text-zinc-400">Choose a starting point and customize it to perfection.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {PRESETS.map((preset) => (
                  <div 
                    key={preset.id}
                    onClick={() => handlePresetClick(preset.parts)}
                    className="group bg-zinc-900/60 backdrop-blur-md border border-white/5 rounded-3xl overflow-hidden cursor-pointer hover:border-indigo-500/50 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300 relative"
                  >
                      {/* Card Header Gradient */}
                      <div className={`h-2 w-full bg-gradient-to-r ${
                          preset.id === 'elite' ? 'from-amber-500 to-orange-600' :
                          preset.id === 'midrange' ? 'from-indigo-500 to-cyan-600' :
                          'from-emerald-500 to-green-600'
                      }`}></div>

                      <div className="p-8">
                          <div className="flex justify-between items-start mb-4">
                              <div className={`p-3 rounded-2xl ${
                                  preset.id === 'elite' ? 'bg-amber-500/10 text-amber-500' :
                                  preset.id === 'midrange' ? 'bg-indigo-500/10 text-indigo-500' :
                                  'bg-emerald-500/10 text-emerald-500'
                              }`}>
                                  {preset.id === 'elite' ? <Zap size={24} /> : preset.id === 'midrange' ? <Monitor size={24} /> : <MousePointerClick size={24} />}
                              </div>
                              <span className="text-lg font-bold text-white">
                                  ${preset.price}
                              </span>
                          </div>

                          <h3 className="text-xl font-bold text-white mb-2 group-hover:text-indigo-400 transition-colors">
                              {preset.name}
                          </h3>
                          <p className="text-zinc-400 text-sm mb-6 leading-relaxed">
                              {preset.description}
                          </p>

                          {/* Mini Specs */}
                          <div className="space-y-3 mb-8">
                              <div className="flex items-center gap-3 text-sm text-zinc-300">
                                  <Cpu size={16} className="text-zinc-500" />
                                  <span className="truncate">{preset.parts[PartCategory.CPU]?.name.split(' ').slice(0,3).join(' ')}</span>
                              </div>
                              <div className="flex items-center gap-3 text-sm text-zinc-300">
                                  <Monitor size={16} className="text-zinc-500" />
                                  <span className="truncate">{preset.parts[PartCategory.GPU]?.name.split(' ').slice(0,3).join(' ')}</span>
                              </div>
                          </div>

                          <button className="w-full py-3 bg-white/5 hover:bg-indigo-600 hover:text-white text-zinc-300 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 group-hover:bg-indigo-600 group-hover:text-white">
                              Load Configuration <ArrowRight size={16} />
                          </button>
                      </div>
                  </div>
              ))}
          </div>
      </section>

    </div>
  );
};

export default HomePage;