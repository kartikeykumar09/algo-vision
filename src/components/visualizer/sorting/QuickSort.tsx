import { useEffect, useRef } from 'react'
import { useAlgoStore } from '@/store/useAlgoStore'
import { Bar } from './Bar'

export const QuickSort = () => {
  const { 
    array, 
    setArray, 
    comparing,
    swapping,
    setComparing, 
    setSwapping, 
    sortedIndices,
    setSortedIndices, 
    isSorted, 
    isPlaying, 
    setIsPlaying,
    incrementComparisons,
    incrementSwaps,
    setCurrentLine,
    addLog,
    speed
  } = useAlgoStore()
  
  const processingRef = useRef(false)

  // Quick Sort Implementation
  const runQuickSort = async () => {
    processingRef.current = true
    let arr = [...array]

    const partition = async (low: number, high: number) => {
        if (!processingRef.current) return -1;

        let pivot = arr[high].value;
        addLog(`Partitioning: Pivot selected at index ${high} (Value: ${pivot})`)
        setCurrentLine(1) // pivot selection
        
        let i = (low - 1);

        for (let j = low; j <= high - 1; j++) {
            if (!processingRef.current) return -1;
            
            // Compare arr[j] with pivot
            setComparing([j, high])
            setSwapping([])
            incrementComparisons()
            setCurrentLine(3) // if (arr[j] < pivot)
            addLog(`Comparing value ${arr[j].value} with pivot ${pivot}`)
            await new Promise(r => setTimeout(r, speed))

            if (arr[j].value < pivot) {
                i++;
                
                if (i !== j) {
                    // Swap arr[i] and arr[j]
                    setSwapping([i, j])
                    incrementSwaps()
                    setCurrentLine(4) // swap(i, j)
                    addLog(`Swapping ${arr[i].value} and ${arr[j].value}`) // Smaller element to left
                    await new Promise(r => setTimeout(r, speed))

                    let temp = arr[i]
                    arr[i] = arr[j]
                    arr[j] = temp
                    setArray([...arr])
                }
            }
        }

        if (!processingRef.current) return -1;

        // Swap arr[i + 1] and arr[high] (pivot)
        setSwapping([i + 1, high])
        incrementSwaps()
        setCurrentLine(6) // swap pivot to correct place
        addLog(`Placing pivot ${pivot} at correct index ${i + 1}`)
        await new Promise(r => setTimeout(r, speed))

        let temp = arr[i + 1]
        arr[i + 1] = arr[high]
        arr[high] = temp
        setArray([...arr])
        
        return i + 1;
    }

    const quickSortRecursive = async (low: number, high: number) => {
        if (!processingRef.current) return;
        
        if (low < high) {
            let pi = await partition(low, high);
            if (pi === -1) return; // Interrupted

            // Mark pivot as sorted (temporarily or structurally) - though strictly only pivot is sorted here
             setSortedIndices(prev => [...prev, pi])

            await quickSortRecursive(low, pi - 1);
            await quickSortRecursive(pi + 1, high);
        } else if (low === high) {
             setSortedIndices(prev => [...prev, low])
        }
    }

    await quickSortRecursive(0, arr.length - 1)
    
    // Final cleanup
    if (processingRef.current) {
        setSortedIndices(array.map((_, i) => i)) // All sorted
        setIsPlaying(false)
        setComparing([])
        setSwapping([])
        setCurrentLine(null)
        addLog("Quick Sort Completed.")
    }
  }

  useEffect(() => {
    if (isPlaying && !isSorted) {
      runQuickSort()
    } else {
      processingRef.current = false
    }

    return () => {
      processingRef.current = false
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
