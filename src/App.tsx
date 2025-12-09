
import { Stage } from '@/components/visualizer/Stage'
import { BubbleSort } from '@/components/visualizer/sorting/BubbleSort'
import { useAlgoStore } from '@/store/useAlgoStore'
import { Play, Pause, RotateCcw, StepForward, RefreshCw, ChevronLeft, Github, Box, Layers } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Dashboard } from './components/Dashboard'

import { useState } from 'react'

// Internal component for handling Tabs
// This keeps the App logic clean and solves the state management for tabs
const TabbedSidebar = ({ currentAlgorithm, isPlaying, logs, currentLine }: { currentAlgorithm: any, isPlaying: boolean, logs: string[], currentLine: number | null }) => {
    const [activeTab, setActiveTab] = useState<'Overview' | 'Learn' | 'Logs'>('Overview')

    return (
        <div className="flex-1 flex flex-col min-h-0 space-y-4">
            {/* Tabs Header */}
            <div className="flex bg-white/5 p-1 rounded-lg">
            {['Overview', 'Learn', 'Logs'].map(tab => (
                <button
                    key={tab}
                    onClick={() => setActiveTab(tab as any)}
                    className={cn(
                        "flex-1 py-1.5 text-xs font-medium rounded-md transition-all",
                        activeTab === tab 
                            ? "bg-cyan-500/20 text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.1)]" 
                            : "text-muted-foreground hover:text-white hover:bg-white/5"
                    )}
                >
                    {tab}
                </button>
            ))}
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                
                {/* OVERVIEW TAB */}
                {activeTab === 'Overview' && (
                    <div className="space-y-4 animate-fade-in">
                        <div className="space-y-2">
                            <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                                {currentAlgorithm?.name || 'Unknown Algo'}
                            </h2>
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] px-2 py-1 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-mono tracking-wider">
                                    TIME: {currentAlgorithm?.complexity || 'N/A'}
                                </span>
                                <span className="text-[10px] px-2 py-1 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20 font-mono tracking-wider">
                                    SPACE: O(1)
                                </span>
                            </div>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed border-l-2 border-white/5 pl-3">
                            {currentAlgorithm?.description}
                        </p>
                        
                        {/* Status Widget */}
                        <div className="p-3 rounded-xl bg-white/5 border border-white/5 hover:border-cyan-500/30 transition-colors mt-4">
                            <div className="text-[10px] text-muted-foreground/70 mb-1">Status</div>
                            <div className="text-sm font-mono text-cyan-400 flex items-center gap-2 font-bold">
                                <span className={cn("w-2 h-2 rounded-full shadow-[0_0_10px_currentColor]", isPlaying ? "bg-green-500 animate-pulse text-green-500" : "bg-yellow-500 text-yellow-500")} />
                                {isPlaying ? "RUNNING" : "IDLE"}
                            </div>
                        </div>

                         {/* Algorithm Logic (Code Snippet) - Moved here */}
                         <div className="mt-6 pt-4 border-t border-white/5">
                            <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70 mb-3">Algorithm Logic</h3>
                            <div className="p-4 rounded-xl bg-[#0b101b] border border-white/5 font-mono text-xs overflow-hidden relative shadow-inner group">
                                <div className="absolute left-0 top-0 bottom-0 w-8 bg-white/5 text-gray-600 flex flex-col items-center pt-4 select-none border-r border-white/5 text-[10px] font-medium">
                                    <div>1</div><div>2</div><div>3</div><div>4</div><div>5</div><div>6</div>
                                </div>
                                <pre className="pl-6 text-gray-400 pointer-events-none group-hover:text-gray-300 transition-colors leading-6">
{`for (i = 0; i < n; i++) {
  for (j = 0; j < n-i-1; j++) {
    if (curr > next) {
      swap(curr, next);
    }
  }
}`}
                                </pre>
                                {/* Active Line Indicator */}
                                {currentLine && (
                                    <div 
                                        className="absolute left-0 w-full h-6 bg-yellow-500/10 border-l-2 border-yellow-500 pointer-events-none transition-all duration-300" 
                                        style={{ top: `${(currentLine - 1) * 1.5 + 1}rem` }}
                                    />
                                )}
                            </div>
                         </div>
                    </div>
                )}

                {/* LEARN TAB */}
                {activeTab === 'Learn' && (
                     <div className="space-y-6 animate-fade-in pb-4">
                        {currentAlgorithm?.learning ? (
                            <>
                                <div className="space-y-2">
                                    <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-widest border-b border-white/10 pb-1">How it Works</h4>
                                    <p className="text-xs text-muted-foreground leading-relaxed">
                                        {currentAlgorithm.learning.introduction}
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <h4 className="text-xs font-bold text-purple-400 uppercase tracking-widest border-b border-white/10 pb-1">Complexity Analysis</h4>
                                    <p className="text-xs text-muted-foreground leading-relaxed">
                                        {currentAlgorithm.learning.complexityAnalysis}
                                    </p>
                                </div>

                                {/* Interview Cheat Sheet */}
                                {currentAlgorithm.learning.interviewNotes && (
                                    <div className="space-y-3 bg-white/5 p-3 rounded-lg border border-white/5 mt-2">
                                        <h4 className="text-[10px] font-bold text-white uppercase tracking-widest flex items-center gap-2">
                                           <span>🎓</span> Interview Cheat Sheet
                                        </h4>
                                        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-[10px]">
                                            <div className="text-muted-foreground">Stability:</div>
                                            <div className="text-foreground">{currentAlgorithm.learning.interviewNotes.stability}</div>
                                            
                                            <div className="text-muted-foreground">In-Place:</div>
                                            <div className="text-foreground">{currentAlgorithm.learning.interviewNotes.inPlace}</div>
                                            
                                            <div className="text-muted-foreground">Best Case:</div>
                                            <div className="text-green-400/80">{currentAlgorithm.learning.interviewNotes.bestCase}</div>
                                            
                                            <div className="text-muted-foreground">Worst Case:</div>
                                            <div className="text-red-400/80">{currentAlgorithm.learning.interviewNotes.worstCase}</div>
                                        </div>
                                        <div className="pt-2 border-t border-white/5 mt-1">
                                            <div className="text-[10px] text-muted-foreground mb-1">Key Takeaway:</div>
                                            <div className="text-xs italic text-cyan-200/70">"{currentAlgorithm.learning.interviewNotes.keyTakeaway}"</div>
                                        </div>
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <h4 className="text-xs font-bold text-green-400 uppercase tracking-widest border-b border-white/10 pb-1">Real World Uses</h4>
                                    <ul className="list-disc list-inside text-xs text-muted-foreground leading-relaxed space-y-1">
                                        {currentAlgorithm.learning.realWorldUses.map((use: string, i: number) => (
                                            <li key={i}>{use}</li>
                                        ))}
                                    </ul>
                                </div>
                            </>
                        ) : (
                            <div className="text-center py-10 text-muted-foreground italic text-xs">
                                No learning content available for this algorithm yet.
                            </div>
                        )}
                     </div>
                )}

                {/* LOGS TAB */}
                {activeTab === 'Logs' && (
                    <div className="flex-1 flex flex-col h-full animate-fade-in">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-[10px] uppercase tracking-widest text-muted-foreground/70">Execution Stream</span>
                            <span className="text-[9px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400">{logs.length} Events</span>
                        </div>
                        <div className="flex-1 overflow-y-auto bg-black/40 rounded-lg p-3 font-mono text-[10px] space-y-1.5 border border-white/5 shadow-inner custom-scrollbar min-h-[300px]">
                            {logs.length === 0 ? (
                                <div className="text-white/20 italic text-center mt-10">Waiting to start execution...</div>
                            ) : (
                                logs.map((log, i) => (
                                    <div key={i} className="text-muted-foreground/80 border-b border-white/5 pb-1 last:border-0 flex gap-2">
                                        <span className="text-cyan-500 shrink-0">[{logs.length - i}]</span>
                                        <span>{log}</span>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

function App() {
  const { 
    view, 
    setView, 
    viewMode,
    setViewMode,
    currentAlgorithm, 
    isPlaying, 
    setIsPlaying, 
    reset, 
    generateArray,
    selectAlgorithm,
    currentLine,
    logs
  } = useAlgoStore()
  
  // Handle toggling between Dashboard and Visualizer
  const handleNavClick = (viewName: 'dashboard' | 'visualizer') => {
    setView(viewName)
  }

  return (
    <div className="w-full h-screen bg-background text-foreground flex flex-col overflow-hidden font-sans selection:bg-cyan-500/30">
      {/* Navbar with Glassmorphism */}
      <header className="h-16 border-b border-white/5 bg-[#020617]/80 backdrop-blur-md px-6 flex items-center justify-between z-20 sticky top-0 supports-[backdrop-filter]:bg-[#020617]/60">
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => handleNavClick('dashboard')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center font-bold text-white shadow-[0_0_20px_rgba(6,182,212,0.3)] group-hover:scale-105 transition-transform duration-300">
            AV
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-cyan-400 to-white bg-clip-text text-transparent group-hover:to-cyan-200 transition-all">
              AlgoVision
            </h1>
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-mono mt-0.5 group-hover:text-cyan-400/70 transition-colors">3D Algorithm Visualizer</p>
          </div>
        </div>
        
        {/* Navigation / Breadcrumbs */}
        {view === 'visualizer' && currentAlgorithm && (
          <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground animate-fade-in px-4 py-1.5 rounded-full bg-white/5 border border-white/5">
            <button onClick={() => setView('dashboard')} className="hover:text-white transition-colors flex items-center gap-1">
              <ChevronLeft size={14} /> Dashboard
            </button>
            <span className="opacity-30">/</span>
            <span className="text-cyan-400 font-medium">{currentAlgorithm.name}</span>
          </div>
        )}

        <div className="flex items-center gap-4">
           <a href="https://github.com/kartikeykumar/unique-showreel" target="_blank" rel="noopener noreferrer" className="p-2 text-muted-foreground hover:text-white transition-colors">
              <Github size={20} />
           </a>
           <div className="w-px h-6 bg-white/10" />
           <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-700 to-gray-800 border border-white/10 ring-2 ring-transparent hover:ring-cyan-500/50 transition-all cursor-pointer" />
        </div>
      </header>

      {/* Main Content Area */}
      {view === 'dashboard' ? (
        <Dashboard onSelect={selectAlgorithm} />
      ) : (
        <main className="flex-1 flex min-h-0 relative animate-fade-in">
          
          {/* Left Control Panel / Sidebar */}
          <aside className="w-80 border-r border-white/5 bg-[#020617]/90 backdrop-blur-sm p-6 flex flex-col hidden lg:flex z-10 shadow-[5px_0_30px_rgba(0,0,0,0.5)]">
            <div className="space-y-8">
              {/* Back Button */}
              <button 
                onClick={() => setView('dashboard')}
                className="flex items-center gap-2 text-muted-foreground hover:text-cyan-400 transition-colors text-sm font-medium mb-2 group"
              >
                <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                Back to Algorithms
              </button>

              {/* Controls & Info Tabs */}
              <TabbedSidebar 
                 currentAlgorithm={currentAlgorithm} 
                 isPlaying={isPlaying}
                 logs={logs}
                 currentLine={currentLine}
              />
            </div>
          </aside>

          {/* 3D Visualizer Stage */}
          <div className="flex-1 relative bg-gradient-to-b from-[#020617] to-[#0f172a] perspective-1000">
             {/* Overlay Controls */}
             <div className="absolute top-6 left-6 z-10 flex gap-2">
                <button 
                  onClick={() => generateArray(15)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-black/40 hover:bg-black/60 border border-white/10 text-sm font-medium transition-all backdrop-blur hover:scale-105 active:scale-95 text-white/90 shadow-lg"
                >
                  <RefreshCw size={14} /> New Array
                </button>
                
                {/* 2D/3D Toggle */}
                <div className="flex bg-black/40 rounded-lg p-1 border border-white/10 backdrop-blur">
                    <button 
                        onClick={() => setViewMode('2d')}
                        className={cn(
                            "px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-1.5",
                            viewMode === '2d' 
                                ? "bg-cyan-500/20 text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.2)]" 
                                : "text-muted-foreground hover:text-white"
                        )}
                    >
                        <Layers size={12} /> 2D
                    </button>
                    <button 
                        onClick={() => setViewMode('3d')}
                        className={cn(
                            "px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-1.5",
                            viewMode === '3d' 
                                ? "bg-purple-500/20 text-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.2)]" 
                                : "text-muted-foreground hover:text-white"
                        )}
                    >
                        <Box size={12} /> 3D
                    </button>
                </div>
             </div>
             
             {/* Playback Controls (Floating) */}
             <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex items-center gap-4 p-3 rounded-2xl bg-black/60 backdrop-blur-xl border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.5)] ring-1 ring-white/5">
                <button 
                  onClick={reset}
                  className="p-3 rounded-xl hover:bg-white/10 text-white/50 hover:text-white transition-all hover:scale-110 active:scale-95"
                  title="Reset"
                >
                  <RotateCcw size={18} />
                </button>
                
                <button className="p-3 rounded-xl hover:bg-white/10 text-white/50 hover:text-white transition-all hover:scale-110 active:scale-95">
                   <StepForward className="rotate-180" size={18} />
                </button>

                <button 
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 flex items-center justify-center text-white shadow-[0_0_30px_rgba(6,182,212,0.4)] transition-all transform hover:scale-105 active:scale-95 hover:-translate-y-1"
                >
                  {isPlaying ? <Pause fill="white" size={24} /> : <Play fill="white" className="ml-1" size={24} />}
                </button>
                
                <button className="p-3 rounded-xl hover:bg-white/10 text-white/50 hover:text-white transition-all hover:scale-110 active:scale-95">
                   <StepForward size={18} />
                </button>

                <div className="w-px h-8 bg-white/10 mx-2" />
                
                <div className="flex flex-col gap-1 w-24 px-2">
                  <div className="flex justify-between items-center w-full">
                    <span className="text-[9px] text-white/40 font-mono tracking-wider uppercase">Slow</span>
                    <span className="text-[9px] text-white/40 font-mono tracking-wider uppercase">Fast</span>
                  </div>
                  <input 
                    type="range" 
                    min="50" 
                    max="1000" 
                    step="50"
                    className="h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan-500 w-full"
                  />
                </div>
             </div>

             <Stage className="rounded-none border-0 shadow-none">
                {/* Dynamically render algo based on ID - currently only BubbleSort */}
                <BubbleSort />
             </Stage>
          </div>
        </main>
      )}
    </div>
  )
}

export default App
