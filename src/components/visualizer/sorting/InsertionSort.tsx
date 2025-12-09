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

export const InsertionSort = () => {
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

    const insertionSort = async () => {
        if (processingRef.current) return
        processingRef.current = true

        const arr = [...array]
        const n = arr.length

        addLog("Starting Insertion Sort...")

        for (let i = 1; i < n; i++) {
            if (!useAlgoStore.getState().isPlaying) {
                processingRef.current = false
                return
            }

            setCurrentLine(1) // Outer Loop
            let key = arr[i]
            let j = i - 1

            addLog(`Selecting key: ${key.value} at index ${i}`)

            // Mark key as being compared initially (or a separate state if we wanted "key" highlight)
            setComparing([i, j]) 
            await delay(speed)

            setCurrentLine(2) // Inner Loop Condition
            while (j >= 0 && arr[j].value > key.value) {
                 if (!useAlgoStore.getState().isPlaying) {
                    processingRef.current = false
                    return
                }
                
                incrementComparisons()
                setCurrentLine(3) // Comparison true

                // Visualize the shift (swap visualization for better UX)
                setComparing([j, j + 1])
                setSwapping([j, j + 1])
                
                // Swap logic in array for visualization
                // In insertion sort, it's typically a shift, but we can visualize it as bubbling down the key
                let temp = arr[j + 1]
                arr[j + 1] = arr[j]
                arr[j] = temp
                
                incrementSwaps()
                incrementOperations()
                addLog(`Moving ${arr[j+1].value} to position ${j+1}`)
                
                setArray([...arr])
                await delay(speed)
                
                setSwapping([])
                j = j - 1
            }
            
            arr[j + 1] = key
            setArray([...arr])
            
            // Mark up to i as sorted
             // In insertion sort, the subarray 0..i is locally sorted
            const newSorted = []
            for(let k=0; k<=i; k++) newSorted.push(k)
            setSortedIndices(newSorted)
            
            await delay(speed)
        }

        addLog("Array Sorted!")
        // Final sorted state
        const allSorted = arr.map((_, i) => i)
        setSortedIndices(allSorted)
        setComparing([])
        setSwapping([])
        setIsPlaying(false)
        setCurrentLine(null)
        processingRef.current = false
    }

    useEffect(() => {
        if (isPlaying) {
            insertionSort()
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
