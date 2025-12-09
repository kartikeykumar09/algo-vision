import { useEffect, useRef, useState } from 'react'
import { useAlgoStore } from '@/store/useAlgoStore'
import { DPGrid } from './DPGrid'

export const Knapsack = () => {
    const { isPlaying, setIsPlaying, speed, addLog, generationId } = useAlgoStore()
    const [dpData, setDpData] = useState<(number | null)[][]>([])
    const [activeCell, setActiveCell] = useState<{r: number, c: number} | null>(null)
    const [compareCells, setCompareCells] = useState<{r: number, c: number}[]>([])
    
    // Problem parameters
    // Capacity W = 6 for demo
    const W = 6
    const [items, setItems] = useState<{wt: number, val: number}[]>([])
    
    const processingRef = useRef(false)

    useEffect(() => {
        // Init items (Randomize)
        const count = 3 + Math.floor(Math.random() * 2) // 3 or 4 items
        const newItems = Array.from({ length: count }, () => ({
            wt: 1 + Math.floor(Math.random() * 4), // 1-4 (ensure they fit in W=6 occasionally)
            val: 2 + Math.floor(Math.random() * 8)  // 2-9
        }))
        setItems(newItems)
        
        // Init Grid
        const rows = newItems.length + 1
        const cols = W + 1
        const grid = Array.from({ length: rows }, () => Array(cols).fill(null))
        
        // Fill base cases? 
        // We usually fill 0th row and col with 0 visually during algo or start.
        // Let's pre-fill 0s for row 0 and col 0?
        for(let r=0; r<rows; r++) grid[r][0] = 0
        for(let c=0; c<cols; c++) grid[0][c] = 0

        setDpData(grid)
        setActiveCell(null)
        setCompareCells([])
        processingRef.current = false
    }, [generationId])

    useEffect(() => {
        if (isPlaying && !processingRef.current) {
            runKnapsack()
        }
    }, [isPlaying])

    const wait = (ms: number) => new Promise(r => setTimeout(r, ms))

    const runKnapsack = async () => {
        processingRef.current = true
        addLog(`Starting 0/1 Knapsack for Capacity W=${W}`)
        
        const n = items.length
        // Clone current grid
        let grid = dpData.map(row => [...row])
        
        // Re-ensure base cases
        for(let r=0; r<=n; r++) grid[r][0] = 0
        for(let c=0; c<=W; c++) grid[0][c] = 0
        setDpData([...grid])
        
        // Loop
        for (let i = 1; i <= n; i++) {
            const { wt, val } = items[i-1]
            addLog(`Item ${i}: Weight=${wt}, Value=${val}`)
            
            for (let w = 1; w <= W; w++) {
                if (!useAlgoStore.getState().isPlaying) {
                     processingRef.current = false
                     return
                }

                setActiveCell({r: i, c: w})
                
                // Option 1: Exclude item -> dp[i-1][w]
                const excludeVal = grid[i-1][w] as number
                
                // Option 2: Include item -> val + dp[i-1][w-wt]
                let includeVal = -1
                
                let highlight = [{r: i-1, c: w}] // Exclude dependency
                
                if (wt <= w) {
                    includeVal = val + (grid[i-1][w-wt] as number)
                    highlight.push({r: i-1, c: w-wt}) // Include dependency
                    
                    setCompareCells(highlight)
                    addLog(`  Cap ${w}: Excl(${excludeVal}) vs Incl(${val} + ${grid[i-1][w-wt]} = ${includeVal})`)
                } else {
                    setCompareCells(highlight)
                    addLog(`  Cap ${w}: Item too heavy (${wt} > ${w}). Skipping.`)
                }
                
                await wait(speed)
                
                const maxVal = Math.max(excludeVal, includeVal)
                grid[i][w] = maxVal
                setDpData(grid.map(row => [...row])) // Update UI
                
                await wait(speed)
            }
        }
        
        setActiveCell(null)
        setCompareCells([])
        addLog(`Knapsack Complete. Max Value: ${grid[n][W]}`)
        setIsPlaying(false)
        processingRef.current = false
    }

    return (
        <group>
             <DPGrid 
                data={dpData} 
                activeCell={activeCell} 
                compareCells={compareCells}
                labels={{
                    colLabels: Array.from({length: W+1}, (_, i) => i.toString()), // 0..W
                    rowLabels: ["0", ...items.map(it => `Itm(w:${it.wt}, v:${it.val})`)]
                }}
             />
        </group>
    )
}
