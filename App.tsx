import React, { useState, useMemo, useEffect, useRef } from 'react';
import { HashRouter, Routes, Route, Navigate, useSearchParams, useNavigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import BuildsModal from './components/BuildsModal';
import HomePage from './pages/HomePage';
import BuilderPage from './pages/BuilderPage';
import UpdatesPage from './pages/UpdatesPage';
import BenchmarksPage from './pages/BenchmarksPage'; 
import CompletedBuildsPage from './pages/CompletedBuildsPage'; 
import CommunityPage from './pages/CommunityPage'; 
import GroupProfilePage from './pages/GroupProfilePage'; 
import CreateGroupPage from './pages/CreateGroupPage'; 
import GroupSettingsPage from './pages/GroupSettingsPage'; 
import ShareBuildsPage from './pages/ShareBuildsPage';
import SharedBuildDetailPage from './pages/SharedBuildDetailPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import { BuildState, Part, PartCategory, BuildStats, SavedBuild, Theme, Currency, Language } from './types';
import { CURRENCIES } from './utils/currency';
import { UPDATES_DATA } from './data/updates';
import { CURRENT_USER } from './utils/communityStore';
import { checkCompatibility } from './utils/compatibility';

// Placeholder Pages for other routes
const PlaceholderPage = ({ title }: { title: string }) => (
    <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-[#09090b]">
        <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-300 dark:text-zinc-700 mb-2">{title}</h2>
            <p className="text-gray-400 dark:text-zinc-600">Coming Soon</p>
        </div>
    </div>
);

// Wrapper for handling preset loading which requires navigation
const PageContent = ({ 
    theme, toggleTheme, currency, setCurrency, buildName, setBuildName, 
    setIsBuildsModalOpen, handleCreateNewBuild, handleShareBuild, stats,
    build, setBuild, rgbOn, setRgbOn, autoRotate, setAutoRotate, 
    setCurrentThumbnail, handleManualSave, savedBuilds, 
    handleLoadBuild, handleDeleteBuild, handleCloneBuild,
    handleLoadPreset, currentBuildId, handleForkBuild
}: any) => {
    return (
        <div className="flex-1 flex flex-col min-w-0 h-full relative">
          <Header 
              theme={theme}
              toggleTheme={toggleTheme}
              currency={currency}
              setCurrency={setCurrency}
              buildName={buildName}
              setBuildName={setBuildName}
              onOpenBuilds={() => setIsBuildsModalOpen(true)}
              onCreateNew={handleCreateNewBuild}
              onShareBuild={handleShareBuild}
              stats={stats}
              username={CURRENT_USER.username}
          />

          <Routes>
             {/* Home Page */}
             <Route path="/" element={
                 <HomePage onLoadPreset={handleLoadPreset} />
             } />

             {/* Builder Route */}
             <Route path="/builder" element={
                 <BuilderPage 
                    build={build}
                    setBuild={setBuild}
                    theme={theme}
                    currency={currency}
                    rgbOn={rgbOn}
                    setRgbOn={setRgbOn}
                    autoRotate={autoRotate}
                    setAutoRotate={setAutoRotate}
                    onThumbnailUpdate={setCurrentThumbnail}
                    onSave={handleManualSave}
                 />
             } />

             {/* Updates Route */}
             <Route path="/updates" element={<UpdatesPage />} />

             {/* Benchmarks Route */}
             <Route path="/benchmarks" element={<BenchmarksPage />} />

             {/* Completed Builds Gallery */}
             <Route path="/completed-builds" element={
                 <CompletedBuildsPage 
                    savedBuilds={savedBuilds}
                    onLoad={handleLoadBuild}
                    onDelete={handleDeleteBuild}
                    onClone={handleCloneBuild}
                    currency={currency}
                 />
             } />

             {/* Community Routes */}
             <Route path="/community" element={<CommunityPage />} />
             <Route path="/community/create" element={<CreateGroupPage />} />
             <Route path="/g/:slug" element={<GroupProfilePage />} />
             <Route path="/g/:slug/settings" element={<GroupSettingsPage />} />

             {/* Shared Builds Routes */}
             <Route path="/share" element={
                <ShareBuildsPage savedBuilds={savedBuilds} currency={currency} />
             } />
             <Route path="/share/:id" element={
                <SharedBuildDetailPage 
                    currency={currency} 
                    onView={handleLoadPreset} 
                    onFork={handleForkBuild} 
                />
             } />

             {/* User Profile */}
             <Route path="/profile" element={
                <ProfilePage currency={currency} />
             } />

             {/* Settings */}
             <Route path="/settings" element={
                <SettingsPage />
             } />

             {/* Placeholder Routes */}
             <Route path="/products" element={<PlaceholderPage title="Product Catalog" />} />
             <Route path="/sales" element={<PlaceholderPage title="Sales & Deals" />} />
             <Route path="/tools" element={<PlaceholderPage title="Useful Tools" />} />
             <Route path="/compare" element={<PlaceholderPage title="Compare Parts" />} />
             <Route path="/gallery" element={<PlaceholderPage title="3D Gallery" />} />
             <Route path="/support" element={<PlaceholderPage title="Support & Help Center" />} />
             
             {/* Catch all */}
             <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
    );
};


function App() {
  // --- Global State ---
  const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem('rigbuilder_theme') as Theme) || 'dark');
  const [lang, setLang] = useState<Language>('en');
  const [currency, setCurrency] = useState<Currency>(() => {
    try {
        const saved = localStorage.getItem('rigbuilder_currency');
        return saved ? JSON.parse(saved) : CURRENCIES[0]; 
    } catch { return CURRENCIES[0]; }
  });
  
  // --- Build State (Lifted to App to persist across navigation) ---
  const [build, setBuild] = useState<BuildState>({});
  const [buildName, setBuildName] = useState<string>('New Gaming Rig');
  const [currentBuildId, setCurrentBuildId] = useState<string | null>(null);
  
  // Thumbnail State - populated by ThreeScene
  const [currentThumbnail, setCurrentThumbnail] = useState<string | undefined>(undefined);
  
  // --- Builder UI State ---
  const [rgbOn, setRgbOn] = useState(true);
  const [autoRotate, setAutoRotate] = useState(false);
  const [isBuildsModalOpen, setIsBuildsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // --- Updates Logic ---
  const [unreadUpdatesCount, setUnreadUpdatesCount] = useState(0);

  // --- Saved Builds ---
  const [savedBuilds, setSavedBuilds] = useState<SavedBuild[]>(() => {
    try {
        const data = JSON.parse(localStorage.getItem('rigbuilder_builds') || '[]');
        return Array.isArray(data) ? data : []; // Robust check
    } catch { return []; }
  });

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  // --- Initial Load Logic (Updates Badge) ---
  useEffect(() => {
    // Calculate unread updates
    const checkUnread = () => {
        try {
            const readIds = JSON.parse(localStorage.getItem('rigbuilder_read_updates') || '[]');
            const unread = UPDATES_DATA.filter(u => !readIds.includes(u.id)).length;
            setUnreadUpdatesCount(unread);
        } catch { setUnreadUpdatesCount(0); }
    };

    checkUnread();
    window.addEventListener('updates-read', checkUnread);
    return () => window.removeEventListener('updates-read', checkUnread);
  }, []);

  // --- Effects ---
  useEffect(() => {
    if (theme === 'dark') {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('rigbuilder_theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('rigbuilder_currency', JSON.stringify(currency));
  }, [currency]);

  // Auto-save current build with Debounce
  // This prevents saving to localStorage on every single frame or minor update
  useEffect(() => {
    if (currentBuildId) {
        const saveTimeout = setTimeout(() => {
            setSavedBuilds(prev => {
                const updated = prev.map(b => b.id === currentBuildId ? { 
                    ...b, 
                    parts: build, 
                    name: buildName, 
                    updatedAt: Date.now(),
                    thumbnail: currentThumbnail || b.thumbnail // Update thumbnail if available
                } : b);
                localStorage.setItem('rigbuilder_builds', JSON.stringify(updated));
                return updated;
            });
        }, 1000); // Wait 1 second after last change

        return () => clearTimeout(saveTimeout);
    }
  }, [build, buildName, currentThumbnail, currentBuildId]); 

  // --- Build Management Handlers ---
  const handleCreateNewBuild = () => {
    setCurrentBuildId(null);
    setBuild({});
    setBuildName('New Gaming Rig');
    setCurrentThumbnail(undefined);
    showToast("Started new build");
    // We assume this might be called from Home, we should probably redirect there but 
    // usually create new is from Header which is available everywhere.
  };

  // Helper function to load a build by ID (used by URLListener)
  const loadBuildById = (id: string) => {
      try {
          const savedBuildsLocal = JSON.parse(localStorage.getItem('rigbuilder_builds') || '[]');
          if (Array.isArray(savedBuildsLocal)) {
              const found = savedBuildsLocal.find((b: SavedBuild) => b.id === id);
              if (found) {
                  setBuild(found.parts);
                  setBuildName(found.name);
                  setCurrentBuildId(found.id);
                  showToast(`Loaded build: ${found.name}`);
                  // Note: Navigation to /builder is handled by component consuming this or manual redirect needed
                  // Since URLListener is non-navigating, we'll leave as is, user will likely be on builder if they use link?
                  // Actually shared links open the app. We should probably force builder view.
                  window.location.hash = '/builder'; 
              }
          }
      } catch (e) {
          console.error("Error loading build by ID", e);
      }
  };

  const handleLoadBuild = (saved: SavedBuild) => {
      setBuild(saved.parts);
      setBuildName(saved.name);
      setCurrentBuildId(saved.id);
      setIsBuildsModalOpen(false);
      showToast("Build loaded successfully");
  };

  const handleLoadPreset = (parts: BuildState) => {
      setBuild(parts);
      setBuildName("Custom Preset Build");
      setCurrentBuildId(null); // It's a new unsaved build
      showToast("Preset loaded! Start customizing.");
      // Navigation is handled inside HomePage navigate('/builder') call
      // Wait, HomePage calls this then navigates. Logic aligns.
      window.location.hash = '/builder'; 
  };

  // NEW: Handle Fork/Remix from Community
  const handleForkBuild = (parts: BuildState, originalName: string) => {
      const newId = crypto.randomUUID();
      const newName = `${originalName} (Remix)`;
      const newBuild: SavedBuild = {
          id: newId,
          name: newName,
          updatedAt: Date.now(),
          parts: parts,
          thumbnail: undefined // Reset thumbnail as user hasn't viewed it yet
      };
      
      // Save immediately
      setSavedBuilds(prev => {
          const updated = [newBuild, ...prev];
          localStorage.setItem('rigbuilder_builds', JSON.stringify(updated));
          return updated;
      });

      // Load into active state
      setBuild(parts);
      setBuildName(newName);
      setCurrentBuildId(newId);
      
      showToast("Build forked! Redirecting to builder...");
      window.location.hash = '/builder';
  };

  const handleDeleteBuild = (id: string) => {
      setSavedBuilds(prev => {
          const updated = prev.filter(b => b.id !== id);
          localStorage.setItem('rigbuilder_builds', JSON.stringify(updated));
          return updated;
      });
      if (currentBuildId === id) handleCreateNewBuild();
  };

  const handleCloneBuild = (saved: SavedBuild) => {
      const newBuild: SavedBuild = {
          ...saved,
          id: crypto.randomUUID(),
          name: `${saved.name} (Copy)`,
          updatedAt: Date.now()
      };
      setSavedBuilds(prev => {
          const updated = [newBuild, ...prev];
          localStorage.setItem('rigbuilder_builds', JSON.stringify(updated));
          return updated;
      });
      showToast("Build cloned");
  };

  const handleShareBuild = () => {
    let idToShare = currentBuildId;
    if (!idToShare) {
        const tempId = crypto.randomUUID();
        const tempBuild: SavedBuild = {
            id: tempId,
            name: buildName,
            updatedAt: Date.now(),
            parts: build,
            thumbnail: currentThumbnail
        };
        setSavedBuilds(prev => {
            const updated = [tempBuild, ...prev];
            localStorage.setItem('rigbuilder_builds', JSON.stringify(updated));
            return updated;
        });
        setCurrentBuildId(tempId);
        idToShare = tempId;
    }
    
    // HashRouter URL construction: base_url/#/?b=ID
    const url = `${window.location.origin}${window.location.pathname}#/?b=${idToShare}`;
    
    navigator.clipboard.writeText(url).then(() => {
        showToast("Build link copied to clipboard!");
    });
  };

  const handleManualSave = () => {
      if (currentBuildId) {
          // It's an existing build, ensure it's up to date
          setSavedBuilds(prev => {
              const updated = prev.map(b => b.id === currentBuildId ? { 
                  ...b, 
                  parts: build, 
                  name: buildName, 
                  updatedAt: Date.now(),
                  thumbnail: currentThumbnail || b.thumbnail 
              } : b);
              localStorage.setItem('rigbuilder_builds', JSON.stringify(updated));
              return updated;
          });
          showToast("Build saved successfully!");
      } else {
          // Create new
          const newId = crypto.randomUUID();
          const newBuild: SavedBuild = {
              id: newId,
              name: buildName,
              updatedAt: Date.now(),
              parts: build,
              thumbnail: currentThumbnail
          };
          setSavedBuilds(prev => {
              const updated = [newBuild, ...prev];
              localStorage.setItem('rigbuilder_builds', JSON.stringify(updated));
              return updated;
          });
          setCurrentBuildId(newId);
          showToast("Build saved successfully!");
      }
  };

  const showToast = (msg: string) => {
      setToastMessage(msg);
      setTimeout(() => setToastMessage(null), 3000);
  };

  // --- Stats Calculation (Needed for Header) ---
  const stats: BuildStats = useMemo(() => {
    return checkCompatibility(build);
  }, [build]);


  return (
    <HashRouter>
      <div className={`flex h-screen w-full bg-gray-50 dark:bg-zinc-950 text-gray-900 dark:text-zinc-100 overflow-hidden font-sans selection:bg-indigo-500/30 transition-colors duration-300`}>
        
        {/* Toast Notification */}
        {toastMessage && (
            <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] bg-zinc-900 text-white px-6 py-3 rounded-full shadow-2xl animate-in slide-in-from-top-5 fade-in duration-300 font-medium text-sm flex items-center gap-2">
                <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                {toastMessage}
            </div>
        )}

        <BuildsModal 
          isOpen={isBuildsModalOpen}
          onClose={() => setIsBuildsModalOpen(false)}
          savedBuilds={savedBuilds}
          currentBuildId={currentBuildId}
          onLoad={handleLoadBuild}
          onDelete={handleDeleteBuild}
          onClone={handleCloneBuild}
          currency={currency}
          lang={lang}
        />

        {/* 1. Left Sidebar with Routing Links */}
        <div className="hidden md:flex flex-shrink-0 z-50 relative h-full">
          <Sidebar updatesCount={unreadUpdatesCount} />
        </div>

        {/* 2. Main Layout - Wrapped to pass props to router children easily via context or props drilling */}
        <PageContent 
            theme={theme} toggleTheme={toggleTheme} currency={currency} setCurrency={setCurrency} 
            buildName={buildName} setBuildName={setBuildName} 
            setIsBuildsModalOpen={setIsBuildsModalOpen} handleCreateNewBuild={handleCreateNewBuild} 
            handleShareBuild={handleShareBuild} stats={stats} 
            build={build} setBuild={setBuild} rgbOn={rgbOn} setRgbOn={setRgbOn} 
            autoRotate={autoRotate} setAutoRotate={setAutoRotate} setCurrentThumbnail={setCurrentThumbnail} 
            handleManualSave={handleManualSave} savedBuilds={savedBuilds} 
            handleLoadBuild={handleLoadBuild} handleDeleteBuild={handleDeleteBuild} handleCloneBuild={handleCloneBuild}
            handleLoadPreset={handleLoadPreset} currentBuildId={currentBuildId} handleForkBuild={handleForkBuild}
        />

      </div>
    </HashRouter>
  );
}

export default App;