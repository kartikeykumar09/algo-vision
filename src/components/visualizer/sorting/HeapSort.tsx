import { useRef, useEffect } from 'react'
import { useAlgoStore } from '@/store/useAlgoStore'
import { Bar } from './Bar'

const getBarColor = (
    index: number, 
    comparing: number[], 
    swapping: number[], 
    sortedIndices: number[], 
    theme: string = 'cyan'
) => {
    if (swapping.includes(index)) return '#ef4444' // Red for swap
    if (comparing.includes(index)) return '#eab308' // Yellow for compare
    if (sortedIndices.includes(index)) return '#22c55e' // Green for sorted
    return theme === 'cyan' ? '#06b6d4' : '#8b5cf6' // Default
}

export const HeapSort = () => {
    const { 
        array, 
        comparing, 
        swapping, 
        sortedIndices, 
        isPlaying, 
        setIsPlaying,
        setComparing,
        setSwapping,
        setSortedIndices,
        setArray,
        incrementComparisons,
        incrementSwaps,
        incrementOperations,
        addLog,

        setCurrentLine,
        speed
    } = useAlgoStore()

    const processingRef = useRef(false)

    // Helper for delay with speed control
    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

    const heapify = async (arr: any[], n: number, i: number) => {
         if (!useAlgoStore.getState().isPlaying) return false

        setCurrentLine(4) // Heapify
        let largest = i
        let l = 2 * i + 1
        let r = 2 * i + 2

        // Highlight root and children
       
        if (l < n) {
            setComparing([largest, l])
            incrementComparisons()
            await delay(speed)
             if (arr[l].value > arr[largest].value) {
                largest = l
            }
        }
        
        if (r < n) {
             setComparing([largest, r])
             incrementComparisons()
             await delay(speed)
             if (arr[r].value > arr[largest].value) {
                largest = r
            }
        }

        if (largest !== i) {
            setSwapping([i, largest])
            
            let temp = arr[i]
            arr[i] = arr[largest]
            arr[largest] = temp
            
            incrementSwaps()
            incrementOperations()
            addLog(`Heapify: Swapping index ${i} with ${largest}`)
            
            setArray([...arr])
            await delay(speed)
            setSwapping([])
            
            // Recursively heapify the affected sub-tree
            const res = await heapify(arr, n, largest)
            if (!res && !useAlgoStore.getState().isPlaying) return false
        }
        return true
    }

    const heapSort = async () => {
        if (processingRef.current) return
        processingRef.current = true

        const arr = [...array]
        const n = arr.length

        addLog("Starting Heap Sort...")
        addLog("Building Max Heap...")

        // Build heap (rearrange array)
        setCurrentLine(1) // Build Heap
        for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
            const running = await heapify(arr, n, i)
             if (!running) {
                processingRef.current = false
                return
            }
        }

        addLog("Max Heap built. Extracting elements...")

        // One by one extract an element from heap
        for (let i = n - 1; i > 0; i--) {
             if (!useAlgoStore.getState().isPlaying) {
                processingRef.current = false
                return
            }
            
            setCurrentLine(2) // Extract max
            // Move current root to end
            setSwapping([0, i])
            let temp = arr[0]
            arr[0] = arr[i]
            arr[i] = temp
            
            incrementSwaps()
            incrementOperations()
            addLog(`Extracted max ${arr[i].value}, moved to index ${i}`)
            
            setArray([...arr])
            await delay(speed)
            setSwapping([])

             // Mark i as sorted (from end)
             const newSorted = [...useAlgoStore.getState().sortedIndices, i]
             setSortedIndices(newSorted)

            // call max heapify on the reduced heap
            setCurrentLine(3) // Heapify root
            const running = await heapify(arr, i, 0)
             if (!running) {
                processingRef.current = false
                return
            }
        }
        
        // Mark 0 as sorted finally
        const finalSorted = [...useAlgoStore.getState().sortedIndices, 0]
        setSortedIndices(finalSorted)

        addLog("Array Sorted!")
        setComparing([])
        setSwapping([])
        setIsPlaying(false)
        setCurrentLine(null)
        processingRef.current = false
    }

    useEffect(() => {
        if (isPlaying) {
            heapSort()
        } else {
            processingRef.current = false
        }
    }, [isPlaying])

    return (
        <group position={[0, -2, 0]}>
            {array.map((item, index) => (
                <Bar
                    key={item.id}
                    item={item}
                    index={index}
                    total={array.length}
                    color={getBarColor(index, comparing, swapping, sortedIndices)}
                />
            ))}
        </group>
    )
}
