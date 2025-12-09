import { useEffect, useRef } from 'react'
import { useAlgoStore } from '@/store/useAlgoStore'
import { Bar } from '../sorting/Bar'

const getBarColor = (
    index: number, 
    currentIndex: number | null, 
    foundIndex: number | null
) => {
    if (foundIndex === index) return '#22c55e' // Green if found
    if (currentIndex === index) return '#eab308' // Yellow if currently checking
    return '#64748b' // Default Gray/Blue
}

export const LinearSearch = () => {
    const { 
        array, 
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
        setComparing // Reusing for "current index" visualization
    } = useAlgoStore()

    const processingRef = useRef(false)

    // Initial Setup: Pick a target if none exists
    useEffect(() => {
        if (array.length > 0 && targetValue === null) {
            // Pick a random value that EXISTS in the array (to ensure success for demo)
            // or maybe sometimes one that doesn't? Let's aim for success 80% time
            const shouldFind = Math.random() > 0.2
            let target
            if (shouldFind) {
                const randomItem = array[Math.floor(Math.random() * array.length)]
                target = randomItem.value
            } else {
                target = Math.floor(Math.random() * 20) + 20 // Value definitely not in range (3-18)
            }
            setTargetValue(target)
            addLog(`Goal: Find value ${target}`)
        }
    }, [array])

    const runLinearSearch = async () => {
        if (processingRef.current || targetValue === null) return
        processingRef.current = true
        
        addLog(`Starting Linear Search for ${targetValue}...`)

        for (let i = 0; i < array.length; i++) {
             if (!useAlgoStore.getState().isPlaying) {
                processingRef.current = false
                return
            }

            setCurrentLine(1) // Loop start
            setComparing([i]) // Visualize current index
            addLog(`Checking index ${i} (Value: ${array[i].value})`)
            
            await new Promise(r => setTimeout(r, speed))

            incrementComparisons()
            incrementOperations()
            setCurrentLine(2) // Check match

            if (array[i].value === targetValue) {
                setFoundIndex(i)
                addLog(`Found target ${targetValue} at index ${i}!`)
                setCurrentLine(3) // Return
                setIsPlaying(false)
                processingRef.current = false
                return
            }
            
            // Not found, continue
            setCurrentLine(4) // Continue loop
            await new Promise(r => setTimeout(r, speed * 0.5))
        }

        addLog(`Target ${targetValue} not found in array.`)
        setIsPlaying(false)
        processingRef.current = false
        setComparing([])
    }

    useEffect(() => {
        if (isPlaying && foundIndex === null) {
            runLinearSearch()
        } else {
            processingRef.current = false
        }
    }, [isPlaying])

    return (
        <group position={[0, -2, 0]}>
             {/* Show Target Text in 3D Space */}
             {targetValue !== null && (
                 // We can't use DOM text easily here without Html, but logs handle it.
                 // Maybe specific visual indicator?
                 null
             )}

            {array.map((item, index) => (
                <Bar
                    key={item.id}
                    item={item}
                    index={index}
                    total={array.length}
                    color={getBarColor(index, useAlgoStore.getState().comparing[0] ?? null, foundIndex)}
                />
            ))}
        </group>
    )
}
