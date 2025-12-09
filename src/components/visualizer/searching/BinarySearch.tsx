import { useEffect, useRef } from 'react'
import { useAlgoStore } from '@/store/useAlgoStore'
import { Bar } from '../sorting/Bar'

// Helper to determine bar color based on Bin Search State
// indices: [low, mid, high]
const getBarColor = (
    index: number, 
    indices: number[], 
    foundIndex: number | null
) => {
    if (foundIndex === index) return '#22c55e' // Green (Found)

    const [low, mid, high] = indices
    
    // If indices are empty/undefined, show default
    if (indices.length === 0) return '#64748b'

    if (index === mid) return '#eab308' // Yellow (Mid - Comparing)
    
    // Active Range
    if (index >= low && index <= high) {
        return '#3b82f6' // Blue (Active Search Space)
    }

    return '#1e293b' // Dark Blue/Gray (Eliminated Space)
}

export const BinarySearch = () => {
    const { 
        array, 
        setArray,
        isPlaying, 
        setIsPlaying,
        incrementComparisons,
        incrementOperations,
        addLog,
        setCurrentLine,
        speed,
        // Search specific
        targetValue,
        setTargetValue,
        foundIndex,
        setFoundIndex,
        comparing,
        setComparing
    } = useAlgoStore()

    const processingRef = useRef(false)

    // 1. Ensure Array is Sorted & Pick Target
    useEffect(() => {
        if (array.length > 0) {
            // Check if sorted, if not, sort it and update store
            // We use a simple check or just force sort
            // Note: Use value for sort
            const isArrSorted = array.every((v, i, a) => !i || a[i-1].value <= v.value)
            
            if (!isArrSorted) {
                const sorted = [...array].sort((a, b) => a.value - b.value)
                setArray(sorted)
                addLog("Array sorted automatically for Binary Search.")
                return // Let the effect re-run with sorted array
            }
            
            if (targetValue === null) {
                const shouldFind = Math.random() > 0.1
                let target
                if (shouldFind) {
                    const randomItem = array[Math.floor(Math.random() * array.length)]
                    target = randomItem.value
                } else {
                    target = Math.floor(Math.random() * 20) + 20
                }
                setTargetValue(target)
                addLog(`Goal: Find value ${target}`)
            }
        }
    }, [array])

    const runBinarySearch = async () => {
        if (processingRef.current || targetValue === null) return
        processingRef.current = true
        
        addLog(`Starting Binary Search for ${targetValue}...`)
        
        // Using local variables for logic, updating store for visual
        let low = 0
        let high = array.length - 1

        setCurrentLine(1) // Init vars
        
        while (low <= high) {
             if (!useAlgoStore.getState().isPlaying) {
                processingRef.current = false
                return
            }

            let mid = Math.floor((low + high) / 2)
            
            // Visualize State: [low, mid, high]
            setComparing([low, mid, high]) 
            setCurrentLine(2) // Loop Condition & Mid calc
            
            addLog(`Range: [${low}, ${high}] | Mid: ${mid} (Val: ${array[mid].value})`)
            await new Promise(r => setTimeout(r, speed))

            incrementComparisons()
            setCurrentLine(3) // Compare Match
            
            if (array[mid].value === targetValue) {
                setFoundIndex(mid)
                addLog(`Found target ${targetValue} at index ${mid}!`)
                setIsPlaying(false)
                processingRef.current = false
                return
            }

            setCurrentLine(4) // Compare Less/More
            incrementOperations()

            if (array[mid].value < targetValue) {
                addLog(`${array[mid].value} < ${targetValue}, ignoring left half.`)
                low = mid + 1
            } else {
                 addLog(`${array[mid].value} > ${targetValue}, ignoring right half.`)
                high = mid - 1
            }
            
            await new Promise(r => setTimeout(r, speed))
        }

        addLog(`Target ${targetValue} not found.`)
        setIsPlaying(false)
        processingRef.current = false
        setComparing([])
    }

    useEffect(() => {
        if (isPlaying && foundIndex === null) {
            runBinarySearch()
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
                    color={getBarColor(index, comparing, foundIndex)}
                />
            ))}
        </group>
    )
}
