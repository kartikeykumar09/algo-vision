import { useEffect, useRef } from 'react'
import { useAlgoStore } from '@/store/useAlgoStore'
import { Bar } from './Bar'

export const BubbleSort = () => {
  const { 
    array, 
    generateArray, 
    comparing, 
    swapping, 
    sortedIndices, 
    setComparing, 
    setSwapping, 
    setSortedIndices, 
    setArray, 
    speed, 
    isPlaying, 
    setIsPlaying,
    incrementComparisons,
    incrementSwaps,
    setCurrentLine,
    addLog
  } = useAlgoStore()
  
  const processingRef = useRef(false)

  useEffect(() => {
    if (array.length === 0) generateArray(10)
  }, [])

  const runBubbleSort = async () => {
    if (processingRef.current) return
    processingRef.current = true

    const n = array.length
    // We work on a copy of indices to reference current positions
    // Actually we need to read from store state because user might reset
    
    let arr = [...useAlgoStore.getState().array]
    
    // Bubble Sort
    for (let i = 0; i < n - 1; i++) {
        for (let j = 0; j < n - i - 1; j++) {
            // Check if still playing (user might have reset)
            if (!useAlgoStore.getState().isPlaying) {
                processingRef.current = false
                return
            }

            // Highlight Comparing
            setComparing([j, j + 1])
            setSwapping([])
            incrementComparisons()
            setCurrentLine(3)
            addLog(`Comparing value ${arr[j].value} and ${arr[j+1].value}`)
            await new Promise(r => setTimeout(r, speed))

            // Check if need to swap
            if (arr[j].value > arr[j + 1].value) {
                // Highlight Swapping
                setSwapping([j, j + 1])
                incrementSwaps()
                setCurrentLine(4)
                addLog(`Swapping ${arr[j].value} with ${arr[j+1].value}`)
                await new Promise(r => setTimeout(r, speed))
                
                // Perform Swap in local copy AND store
                const temp = arr[j]
                arr[j] = arr[j + 1]
                arr[j + 1] = temp
                
                setArray([...arr]) // Triggers animation
                await new Promise(r => setTimeout(r, speed))
            }
        }
        
        // Mark as sorted
        if (!useAlgoStore.getState().isPlaying) {
             processingRef.current = false
             return
        }
        setSortedIndices(prev => [...prev, n - i - 1])
    }
    // Last one is also sorted
    setSortedIndices(prev => [...prev, 0])
    setComparing([])
    setSwapping([])
    setIsPlaying(false)
    processingRef.current = false
  }

  // Trigger sort when isPlaying becomes true
  useEffect(() => {
    if (isPlaying && !processingRef.current) {
        runBubbleSort()
    }
  }, [isPlaying])

  // Helpers for determining color
  const getBarColor = (index: number) => {
    if (sortedIndices.includes(index)) return '#22c55e' // Success Green
    if (swapping.includes(index)) return '#ef4444' // Destructive Red
    if (comparing.includes(index)) return '#eab308' // Warning Yellow
    return '#06b6d4' // Primary Cyan
  }

  return (
    <group position={[0, -2, 0]}>
      {array.map((item, index) => (
        <Bar 
          key={item.id} 
          item={item} 
          index={index} 
          total={array.length} 
          color={getBarColor(index)} 
        />
      ))}
    </group>
  )
}
