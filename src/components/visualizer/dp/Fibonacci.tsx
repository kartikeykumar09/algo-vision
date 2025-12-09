import { useEffect, useRef, useState } from 'react'
import { useAlgoStore } from '@/store/useAlgoStore'
import { DPGrid } from './DPGrid'

export const Fibonacci = () => {
    const { isPlaying, setIsPlaying, speed, addLog, generationId, setCustomDescription } = useAlgoStore()
    const [dpData, setDpData] = useState<(number | null)[][]>([])
    const [activeCell, setActiveCell] = useState<{r: number, c: number} | null>(null)
    const [compareCells, setCompareCells] = useState<{r: number, c: number}[]>([])
    
    // Randomize N between 8 and 13
    const [N, setN] = useState(10)
    const processingRef = useRef(false)

    useEffect(() => {
        const newN = 8 + Math.floor(Math.random() * 6) // 8 to 13
        setN(newN)
        setCustomDescription(`Compute Fibonacci(${newN})`)

        // Initialize empty grid
        const arr = new Array(newN).fill(null)
        setDpData([arr])
        setActiveCell(null)
        setCompareCells([])
        processingRef.current = false
    }, [generationId])

    useEffect(() => {
        if (isPlaying && !processingRef.current) {
            runFibonacci()
        }
    }, [isPlaying])

    const wait = (ms: number) => new Promise(r => setTimeout(r, ms))

    const runFibonacci = async () => {
        processingRef.current = true
        addLog(`Starting Fibonacci Tabulation for N=${N}`)
        
        // Reset or use current? Let's restart for simplicity
        let arr = new Array(N).fill(null)
        
        // Base case 0
        setActiveCell({r: 0, c: 0})
        arr[0] = 0
        setDpData([[...arr]])
        addLog("Base Case: F(0) = 0")
        await wait(speed * 1.5)
        
        // Base case 1
        setActiveCell({r: 0, c: 1})
        arr[1] = 1
        setDpData([[...arr]])
        addLog("Base Case: F(1) = 1")
        await wait(speed * 1.5)

        for (let i = 2; i < N; i++) {
             // Check if paused/stopped
             if (!useAlgoStore.getState().isPlaying) {
                 processingRef.current = false
                 return
             }
             
             // Highlight dependencies
             setActiveCell({r: 0, c: i})
             setCompareCells([{r: 0, c: i - 1}, {r: 0, c: i - 2}]) // Previous 2
             addLog(`Computing F(${i}) = F(${i-1}) + F(${i-2}) ...`)
             await wait(speed)
             
             const val = (arr[i-1] as number) + (arr[i-2] as number)
             arr[i] = val
             setDpData([[...arr]])
             addLog(`F(${i}) = ${arr[i-1]} + ${arr[i-2]} = ${val}`)
             await wait(speed)
        }
        
        setActiveCell(null)
        setCompareCells([])
        addLog("Fibonacci Sequence Complete.")
        setIsPlaying(false)
        processingRef.current = false
    }

    return (
        <group position={[0, 1, 0]}>
             <DPGrid 
                data={dpData} 
                activeCell={activeCell} 
                compareCells={compareCells} 
                labels={{ 
                    colLabels: Array.from({length: N}, (_, i) => i.toString()),
                    rowLabels: ["F(n)"] 
                }}
             />
        </group>
    )
}
