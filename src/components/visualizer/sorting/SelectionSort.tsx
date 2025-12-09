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

export const SelectionSort = () => {
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

    const selectionSort = async () => {
        if (processingRef.current) return
        processingRef.current = true

        const arr = [...array]
        const n = arr.length

        addLog("Starting Selection Sort...")

        for (let i = 0; i < n - 1; i++) {
             if (!useAlgoStore.getState().isPlaying) {
                processingRef.current = false
                return
            }
            
            setCurrentLine(1) // Outer Loop
            let minIdx = i
            
            // Highlight current position and current min
            setComparing([i, minIdx]) 
            addLog(`Setting minimum index to ${i}`)
            await delay(speed)

            setCurrentLine(2) // Inner Loop
            for (let j = i + 1; j < n; j++) {
                if (!useAlgoStore.getState().isPlaying) {
                    processingRef.current = false
                    return
                }

                setComparing([minIdx, j])
                incrementComparisons()
                setCurrentLine(3) // Compare

                if (arr[j].value < arr[minIdx].value) {
                    minIdx = j
                    addLog(`Found new minimum: ${arr[j].value} at index ${j}`)
                    setComparing([i, minIdx]) // Highlight new min against current pos
                    await delay(speed)
                } else {
                     await delay(speed / 2) // Faster scan
                }
            }

            if (minIdx !== i) {
                setCurrentLine(4) // Swap
                setSwapping([i, minIdx])
                
                // Perform Swap
                let temp = arr[i]
                arr[i] = arr[minIdx]
                arr[minIdx] = temp
                
                incrementSwaps()
                incrementOperations()
                addLog(`Swapped ${arr[i].value} with ${arr[minIdx].value}`)
                
                setArray([...arr])
                await delay(speed)
                setSwapping([])
            }

            // Mark i as sorted
            const newSorted = [...sortedIndices, i]
            setSortedIndices(newSorted)
        }

        // Mark last element as sorted and finish
        addLog("Array Sorted!")
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
            selectionSort()
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
