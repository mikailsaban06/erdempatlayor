import React, { useState } from 'react';
import { Rotate3D, Lightbulb, Menu, X, Eye, Monitor, Save } from 'lucide-react';
import ThreeScene from '../components/ThreeScene';
import PartsPanel from '../components/PartsPanel';
import QuickAddModal from '../components/QuickAddModal';
import { BuildState, Part, PartCategory, Theme, Currency } from '../types';

interface BuilderPageProps {
  build: BuildState;
  setBuild: React.Dispatch<React.SetStateAction<BuildState>>;
  theme: Theme;
  currency: Currency;
  rgbOn: boolean;
  setRgbOn: (val: boolean) => void;
  autoRotate: boolean;
  setAutoRotate: (val: boolean) => void;
  onThumbnailUpdate?: (dataUrl: string) => void;
  onSave: () => void;
}

const BuilderPage: React.FC<BuilderPageProps> = ({
  build, setBuild, theme, currency,
  rgbOn, setRgbOn, autoRotate, setAutoRotate,
  onThumbnailUpdate, onSave
}) => {
  const [isMobilePanelOpen, setIsMobilePanelOpen] = useState(false);
  const [quickAddCategory, setQuickAddCategory] = useState<PartCategory | null>(null);

  const handleSelectPart = (part: Part) => {
    setBuild(prev => ({ ...prev, [part.category]: part }));
  };

  const handleRemovePart = (category: PartCategory) => {
    setBuild(prev => {
      const newState = { ...prev };
      delete newState[category];
      return newState;
    });
  };

  return (
    <div className="flex-1 flex relative overflow-hidden h-full">
        
        {/* Modals */}
        {quickAddCategory && (
            <QuickAddModal 
              category={quickAddCategory}
              onClose={() => setQuickAddCategory(null)}
              onAddPart={handleSelectPart}
              currentPartId={build[quickAddCategory]?.id}
              currentBuild={build}
              currency={currency}
            />
        )}

        {/* Center Stage (3D) */}
        <main className="flex-1 relative flex flex-col min-w-0 bg-gray-100 dark:bg-[#09090b]">
            
            {/* 3D Canvas */}
            <div className="flex-1 relative z-0">
               <ThreeScene 
                 build={build} 
                 rgbOn={rgbOn} 
                 autoRotate={autoRotate} 
                 theme={theme}
                 onThumbnailUpdate={onThumbnailUpdate} 
               />
            </div>

            {/* Bottom Floating Controls */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 w-auto">
              <div className="flex items-center gap-2 p-1.5 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md border border-gray-200 dark:border-white/10 rounded-full shadow-2xl">
                  
                  <button 
                      onClick={() => setRgbOn(!rgbOn)}
                      className={`flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 ${rgbOn ? 'bg-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.5)]' : 'hover:bg-gray-200 dark:hover:bg-zinc-800 text-gray-500 dark:text-zinc-400'}`}
                      title="Toggle RGB"
                  >
                      <Lightbulb size={18} className={rgbOn ? "fill-current" : ""} />
                  </button>

                  <button 
                      onClick={() => setAutoRotate(!autoRotate)}
                      className={`flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 ${autoRotate ? 'bg-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.5)]' : 'hover:bg-gray-200 dark:hover:bg-zinc-800 text-gray-500 dark:text-zinc-400'}`}
                      title="Auto Rotate"
                  >
                      <Rotate3D size={18} className={autoRotate ? "animate-spin-slow" : ""} />
                  </button>

                  <div className="w-px h-6 bg-gray-300 dark:bg-zinc-700 mx-1"></div>

                  <button 
                     onClick={onSave}
                     className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full font-bold text-sm transition-all shadow-lg shadow-indigo-500/25 active:scale-95 group"
                  >
                     <Save size={18} className="group-hover:scale-110 transition-transform" />
                     <span>Save</span>
                  </button>

                  <div className="w-px h-6 bg-gray-300 dark:bg-zinc-700 mx-1"></div>

                   <button 
                      className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-200 dark:hover:bg-zinc-800 text-gray-500 dark:text-zinc-400 transition-colors"
                      title="Reset View"
                  >
                      <Eye size={18} />
                  </button>
                  
                   <button 
                      className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-200 dark:hover:bg-zinc-800 text-gray-500 dark:text-zinc-400 transition-colors"
                      title="Toggle Case"
                  >
                      <Monitor size={18} />
                  </button>
              </div>
            </div>

            {/* Mobile Menu Toggle */}
            <button 
              className="lg:hidden absolute top-4 right-4 z-30 p-2 bg-white/90 dark:bg-zinc-900/90 border border-gray-200 dark:border-zinc-700 rounded-lg text-gray-900 dark:text-white shadow-lg backdrop-blur-md"
              onClick={() => setIsMobilePanelOpen(!isMobilePanelOpen)}
            >
              {isMobilePanelOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
         </main>

         {/* Right Parts Panel */}
         <div 
            className={`
              fixed lg:static inset-y-0 right-0 z-40 
              w-96 xl:w-[450px] flex-shrink-0 shadow-2xl lg:shadow-none
              transform transition-transform duration-300 ease-in-out
              ${isMobilePanelOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
              bg-white dark:bg-zinc-950 border-l border-gray-200 dark:border-zinc-800
            `}
          >
             <PartsPanel 
                currentBuild={build} 
                onOpenQuickAdd={setQuickAddCategory} 
                onRemovePart={handleRemovePart}
                currency={currency}
                className="h-full"
             />
          </div>
    </div>
  );
};

export default BuilderPage;