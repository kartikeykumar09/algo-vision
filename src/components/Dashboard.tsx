import { ArrowRight, Lock, Sparkles } from "lucide-react"
import { ALGOS, type Algorithm } from "../data/algorithms"
import { cn } from "@/lib/utils"

interface DashboardProps {
  onSelect: (algo: Algorithm) => void
}

export const Dashboard = ({ onSelect }: DashboardProps) => {
  return (
    <div className="flex-1 overflow-y-auto bg-gradient-to-b from-[#020617] to-[#0f172a] p-8 pb-32">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Hero Header */}
        <div className="text-center space-y-4 py-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-medium uppercase tracking-wider mb-4 animate-fade-in">
            <Sparkles size={12} />
            Interactive 3D Engineering
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight bg-gradient-to-r from-white via-gray-200 to-gray-500 bg-clip-text text-transparent">
            Master Algorithms in <span className="bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent">3D Space</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Select a category below to explore data structures and algorithms with immersive, real-time visualizations.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="space-y-16">
          {ALGOS.map((category) => (
            <section key={category.id} className="space-y-6">
              <div className="flex items-center gap-4">
                <div className={cn("p-3 rounded-2xl bg-gradient-to-br shadow-lg", category.gradient)}>
                   <category.icon className="text-white" size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-foreground">{category.name}</h2>
                  <p className="text-sm text-muted-foreground">{category.description}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {category.algorithms.map((algo) => (
                  <button
                    key={algo.id}
                    onClick={() => algo.status === 'ready' && onSelect(algo)}
                    disabled={algo.status !== 'ready'}
                    className={cn(
                      "group relative flex flex-col p-6 rounded-2xl border transition-all duration-300 text-left overflow-hidden",
                      algo.status === 'ready' 
                        ? "bg-card/40 hover:bg-card/60 border-white/5 hover:border-cyan-500/50 hover:shadow-[0_0_30px_rgba(6,182,212,0.15)] cursor-pointer" 
                        : "bg-card/20 border-white/5 opacity-60 cursor-not-allowed"
                    )}
                  >
                    {/* Hover Gradient Background */}
                    <div className={cn("absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-300", category.gradient, algo.status === 'ready' ? "group-hover:opacity-5" : "")} />
                    
                    <div className="flex justify-between items-start mb-4">
                      <div className="space-y-1">
                        <h3 className="text-lg font-semibold text-foreground group-hover:text-cyan-400 transition-colors">
                          {algo.name}
                        </h3>
                        <span className="text-[10px] font-mono text-muted-foreground px-2 py-0.5 rounded-full bg-white/5 border border-white/5">
                          {algo.complexity}
                        </span>
                      </div>
                      {algo.status === 'ready' ? (
                        <div className="w-8 h-8 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-400 opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all">
                          <ArrowRight size={16} />
                        </div>
                      ) : (
                        <Lock size={16} className="text-muted-foreground/50" />
                      )}
                    </div>
                    
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {algo.description}
                    </p>

                    {algo.status !== 'ready' && (
                      <div className="absolute bottom-4 right-4 text-[10px] font-medium text-muted-foreground/50 uppercase tracking-widest">
                        Coming Soon
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  )
}
