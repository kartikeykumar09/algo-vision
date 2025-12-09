import { LinearSearch } from '@/components/visualizer/searching/LinearSearch'
import { BinarySearch } from '@/components/visualizer/searching/BinarySearch'
import { Stage } from '@/components/visualizer/Stage'
import { BubbleSort } from '@/components/visualizer/sorting/BubbleSort'
import { QuickSort } from '@/components/visualizer/sorting/QuickSort'
import { MergeSort } from '@/components/visualizer/sorting/MergeSort'
import { InsertionSort } from '@/components/visualizer/sorting/InsertionSort'
import { SelectionSort } from '@/components/visualizer/sorting/SelectionSort'
import { HeapSort } from '@/components/visualizer/sorting/HeapSort'


import { useAlgoStore } from '@/store/useAlgoStore'
import { Play, Pause, RotateCcw, StepForward, RefreshCw, ChevronLeft, Github, Box, Layers } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Dashboard } from './components/Dashboard'

import { useState, useEffect } from 'react'
import { Routes, Route, useNavigate, useParams, Link } from 'react-router-dom'
import { ALGOS } from '@/data/algorithms'

// Internal component for handling Tabs
// This keeps the App logic clean and solves the state management for tabs
const TabbedSidebar = ({ currentAlgorithm, isPlaying, logs, currentLine, targetValue }: { currentAlgorithm: any, isPlaying: boolean, logs: string[], currentLine: number | null, targetValue: number | null }) => {
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

                        {/* Problem Statement Widget */}
                        <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-500/5 to-blue-500/5 border border-cyan-500/10 mt-4 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-cyan-500/10 to-transparent blur-xl pointer-events-none" />
                            <div className="text-[10px] text-cyan-400/80 mb-1 uppercase tracking-widest font-bold">Current Goal</div>
                            <div className="text-sm text-foreground font-medium flex items-center gap-2">
                                {currentAlgorithm.id.includes('sort') ? (
                                    <span>Sort array in <span className="text-cyan-400">ascending order</span></span>
                                ) : (
                                    <span>Find index of value <span className="inline-flex items-center justify-center px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-400 font-mono text-xs border border-cyan-500/30 ml-1">{targetValue ?? '?'}</span></span>
                                )}
                            </div>
                        </div>
                        
                        {/* Status Widget */}
                        <div className="p-3 rounded-xl bg-white/5 border border-white/5 hover:border-cyan-500/30 transition-colors mt-4">
                            <div className="text-[10px] text-muted-foreground/70 mb-1">Status</div>
                            <div className="text-sm font-mono text-cyan-400 flex items-center gap-2 font-bold">
                                <span className={cn("w-2 h-2 rounded-full shadow-[0_0_10px_currentColor]", isPlaying ? "bg-green-500 animate-pulse text-green-500" : "bg-yellow-500 text-yellow-500")} />
                                {isPlaying ? "RUNNING" : "IDLE"}
                            </div>
                        </div>

{/* Code Snippet */}
<div className="mt-6 pt-4 border-t border-white/5">
    <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70 mb-3">Algorithm Logic</h3>
    <div className="p-4 rounded-xl bg-[#0b101b] border border-white/5 font-mono text-xs overflow-hidden relative shadow-inner group">
        <div className="absolute left-0 top-0 bottom-0 w-8 bg-white/5 text-gray-600 flex flex-col items-center pt-4 select-none border-r border-white/5 text-[10px] font-medium">
            <div>1</div><div>2</div><div>3</div><div>4</div><div>5</div><div>6</div>
        </div>
        <pre className="pl-6 text-gray-400 pointer-events-none group-hover:text-gray-300 transition-colors leading-6">
            {currentAlgorithm.id === 'bubble-sort' && 
`for (i = 0; i < n; i++) {
  for (j = 0; j < n-i-1; j++) {
    if (curr > next) {
      swap(curr, next);
    }
  }
}`}
            {currentAlgorithm.id === 'quick-sort' &&
`partition(low, high) {
  pivot = arr[high];
  if (arr[j] < pivot) {
    swap(arr[i], arr[j]);
  }
  swap(arr[i+1], arr[high]);
}`}
            {currentAlgorithm.id === 'merge-sort' &&
`mergeSort(arr, l, r) {
  mid = (l+r)/2;
  mergeSort(arr, l, mid);
  mergeSort(arr, mid+1, r);
  merge(arr, l, mid, r);
}`}
            {currentAlgorithm.id === 'insertion-sort' &&
`for (i = 1; i < n; i++) {
  key = arr[i];
  j = i - 1;
  while (j >= 0 && arr[j] > key) {
    arr[j + 1] = arr[j];
    j = j - 1;
  }
  arr[j + 1] = key;
}`}
            {currentAlgorithm.id === 'linear-search' &&
`for (i = 0; i < n; i++) {
  if (arr[i] == target) {
    return i;
  }
}
return -1;`}
            {currentAlgorithm.id === 'binary-search' &&
`low = 0, high = n - 1;
while (low <= high) {
  mid = (low + high) / 2;
  if (arr[mid] == target) return mid;
  if (arr[mid] < target) low = mid + 1;
  else high = mid - 1;
}`}
            {currentAlgorithm.id === 'selection-sort' &&
`for (i = 0; i < n-1; i++) {
  min_idx = i;
  for (j = i+1; j < n; j++)
    if (arr[j] < arr[min_idx])
      min_idx = j;
  swap(arr[min_idx], arr[i]);
}`}
            {currentAlgorithm.id === 'heap-sort' &&
`heapSort(arr) {
  buildMaxHeap(arr);
  for (i = n-1; i > 0; i--) {
    swap(arr[0], arr[i]);
    heapify(arr, i, 0);
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
                    <div className="space-y-2 animate-fade-in font-mono text-[10px]">
                        {logs.length === 0 && <div className="text-center py-10 text-muted-foreground italic">No logs yet. Run the algorithm!</div>}
                        {logs.map((log, i) => (
                            <div key={i} className="flex gap-2 text-muted-foreground border-l border-white/5 pl-2 py-0.5 hover:text-cyan-200/80 transition-colors">
                                <span className="text-white/20 select-none">[{logs.length - i}]</span>
                                <div>{log}</div>
                            </div>
                        ))}
                    </div>
                )}

            </div>
        </div>
    )
}

// Wrapper to handle Params and Algo Selection
const AlgoVisualizer = () => {
    const { algoId } = useParams()
    const navigate = useNavigate()
    const { 
        viewMode, 
        setViewMode, 
        currentAlgorithm, 
        isPlaying, 
        setIsPlaying, 
        reset, 
        generateArray,
        selectAlgorithm,
        stats,
        currentLine,
        logs,
        speed,
        setSpeed,
        targetValue
    } = useAlgoStore()

    // Sync URL with Store
    useEffect(() => {
        if (algoId) {
            const foundAlgo = ALGOS.flatMap(c => c.algorithms).find(a => a.id === algoId)
            if (foundAlgo) {
                // Always select and generate new array on route change
                if (currentAlgorithm?.id !== foundAlgo.id) {
                    selectAlgorithm(foundAlgo)
                    generateArray() 
                }
            } else {
                // Invalid ID, redirect to dashboard
                navigate('/')
            }
        }
    }, [algoId])

    if (!currentAlgorithm) return null // Or loading

    return (
        <div className="w-full h-screen bg-background text-foreground flex flex-col overflow-hidden font-sans selection:bg-cyan-500/30">
      {/* Navbar with Glassmorphism */}
      <header className="h-16 border-b border-white/5 bg-[#020617]/80 backdrop-blur-md px-6 flex items-center justify-between z-20 sticky top-0 supports-[backdrop-filter]:bg-[#020617]/60">
        <div className="flex items-center gap-4">
           {/* Logo Area */}
           <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <span className="font-bold text-white text-lg tracking-tighter">AV</span>
           </div>
           
           <div className="hidden md:flex flex-col">
              <span className="font-bold text-sm tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">AlgoVision</span>
              <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">3D Algorithm Visualizer</span>
           </div>
        </div>

        {/* Breadcrumb / Status */}
        <div className="hidden md:flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/5 text-xs text-muted-foreground">
            <span className="hover:text-white transition-colors cursor-pointer" onClick={() => navigate('/')}>Dashboard</span>
            <span className="text-white/20">/</span>
            <span className="text-cyan-400 font-medium">{currentAlgorithm?.name}</span>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-4 mr-4">
                <div className="flex flex-col items-end">
                    <span className="text-[10px] text-muted-foreground uppercase tracking-widest">Comparisons</span>
                    <span className="font-mono text-sm font-bold text-cyan-400">{stats.comparisons}</span>
                </div>
                 <div className="flex flex-col items-end">
                    <span className="text-[10px] text-muted-foreground uppercase tracking-widest">Swaps</span>
                    <span className="font-mono text-sm font-bold text-purple-400">{stats.swaps}</span>
                </div>
            </div>
            <a href="https://github.com/kartikeykumar09" target="_blank" className="p-2 rounded-lg hover:bg-white/10 text-muted-foreground hover:text-white transition-colors">
                <Github size={20} />
            </a>
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-500 ring-2 ring-white/10" />
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Controls */}
        <aside className="w-80 border-r border-white/5 bg-[#020617]/95 flex flex-col z-10 backdrop-blur-xl">
           <div className="p-6 flex-1 flex flex-col min-h-0 overflow-hidden">
              
              <Link to="/" className="flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-white mb-6 transition-colors group">
                 <div className="p-1 rounded bg-white/5 group-hover:bg-white/10 transition-colors">
                    <ChevronLeft size={14} />
                 </div>
                 Back to Algorithms
              </Link>

              {/* Control Panel */}
              <div className="grid grid-cols-2 gap-2 mb-6">
                 <button 
                  onClick={() => generateArray()}
                  className="flex items-center justify-center gap-2 p-2.5 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 text-xs font-medium transition-all active:scale-95"
                 >
                    <RefreshCw size={14} className={cn(isPlaying && "animate-spin")} />
                    New Array
                 </button>
                 
                 <div className="p-1 bg-white/5 rounded-lg flex border border-white/5">
                    <button 
                        onClick={() => setViewMode('2d')}
                        className={cn(
                            "flex-1 flex items-center justify-center gap-1.5 rounded text-[10px] font-bold transition-all",
                            viewMode === '2d' ? "bg-cyan-500 text-white shadow-sm" : "text-muted-foreground hover:text-white"
                        )}
                    >
                        <Layers size={12} /> 2D
                    </button>
                    <button 
                        onClick={() => setViewMode('3d')}
                        className={cn(
                             "flex-1 flex items-center justify-center gap-1.5 rounded text-[10px] font-bold transition-all",
                            viewMode === '3d' ? "bg-cyan-500 text-white shadow-sm" : "text-muted-foreground hover:text-white"
                        )}
                    >
                        <Box size={12} /> 3D
                    </button>
                 </div>
              </div>

              {/* Tabbed Info Area */}
              <TabbedSidebar 
                 currentAlgorithm={currentAlgorithm} 
                 isPlaying={isPlaying}
                 logs={logs}
                 currentLine={currentLine}
                 targetValue={targetValue}
              />
            </div>
          </aside>

          {/* Main Visualization Area */}
          <main className="flex-1 relative bg-[#020617] perspective-1000">
             {/* Overlay Controls */}
             <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 animate-slide-up">
                
                {/* Compact Playback Controls */}
                <div className="flex items-center gap-1 p-1.5 rounded-full bg-[#0b101b]/90 border border-white/10 backdrop-blur-xl shadow-2xl">
                    
                    <button onClick={reset} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 text-muted-foreground hover:text-white transition-colors active:scale-95" title="Reset">
                        <RotateCcw size={14} />
                    </button>
                    
                    <div className="w-px h-4 bg-white/10 mx-1" />

                    <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 text-muted-foreground hover:text-white transition-colors opacity-50 cursor-not-allowed">
                       <ChevronLeft size={16} />
                    </button>

                    <button 
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="w-10 h-10 rounded-full bg-cyan-500 hover:bg-cyan-400 text-white shadow-lg shadow-cyan-500/20 flex items-center justify-center transition-all hover:scale-105 active:scale-95 mx-1"
                    >
                        {isPlaying ? <Pause fill="currentColor" size={18} /> : <Play fill="currentColor" size={18} className="ml-0.5" />}
                    </button>

                    <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 text-muted-foreground hover:text-white transition-colors">
                       <StepForward size={16} />
                    </button>
                    
                    <div className="w-px h-4 bg-white/10 mx-1" />

                     {/* Compact Speed Slider */}
                    <div className="flex items-center gap-2 px-2 group">
                        <span className="text-[10px] items-center font-bold text-muted-foreground uppercase tracking-wider hidden group-hover:flex">Speed</span>
                        <input 
                            type="range" 
                            min="50" 
                            max="1000" 
                            step="50"
                            value={1050 - speed} 
                            onChange={(e) => setSpeed(1050 - parseInt(e.target.value))}
                            className="w-16 h-1 bg-white/20 rounded-full appearance-none cursor-pointer accent-cyan-500 hover:accent-cyan-400 transition-all hover:w-24 hover:bg-white/30"
                        />
                    </div>
                </div>
             </div>

             <Stage className="rounded-none border-0 shadow-none">
                {currentAlgorithm?.id === 'linear-search' && <LinearSearch />}
                {currentAlgorithm?.id === 'binary-search' && <BinarySearch />}
                {currentAlgorithm?.id === 'bubble-sort' && <BubbleSort />}
                {currentAlgorithm?.id === 'quick-sort' && <QuickSort />}
                {currentAlgorithm?.id === 'merge-sort' && <MergeSort />}
                {currentAlgorithm?.id === 'insertion-sort' && <InsertionSort />}
                {currentAlgorithm?.id === 'selection-sort' && <SelectionSort />}
                {currentAlgorithm?.id === 'heap-sort' && <HeapSort />}
             </Stage>
          </main>
      </div>
    </div>
    )
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/:algoId" element={<AlgoVisualizer />} />
    </Routes>
  )
}

export default App
