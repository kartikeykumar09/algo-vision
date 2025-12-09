import { useEffect, useRef } from 'react'
import { useAlgoStore } from '@/store/useAlgoStore'
import { Bar } from './Bar'

export const MergeSort = () => {
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

  // Merge Sort Implementation
  const runMergeSort = async () => {
    processingRef.current = true
    let arr = [...array]

    const merge = async (left: number, mid: number, right: number) => {
        if (!processingRef.current) return;
        
        let n1 = mid - left + 1;
        let n2 = right - mid;
        
        // Deep copy items to preserve their ID/Value state for logic comparison
        let L = []
        let R = []
        
        for (let i = 0; i < n1; i++) L.push({...arr[left + i]});
        for (let j = 0; j < n2; j++) R.push({...arr[mid + 1 + j]});
        
        let i = 0, j = 0;
        let k = left;
        
        while (i < n1 && j < n2) {
            if (!processingRef.current) return;

            // Visualize comparison
            setComparing([left + i, mid + 1 + j])
            
            incrementComparisons()
            setCurrentLine(3)
            
            // Wait for speed delay
            await new Promise(r => setTimeout(r, speed))

            let itemToPlaceId;
            if (L[i].value <= R[j].value) {
                itemToPlaceId = L[i].id;
                i++;
            } else {
                itemToPlaceId = R[j].id;
                j++;
                incrementSwaps()
            }
            
            // Find current location of the specific item we want to place at 'k'
            // We search by ID to guarantee we find the exact visual element
            // Note: arr is the LIVE state showing current positions
            const currentIdx = arr.findIndex(item => item && item.id === itemToPlaceId);
            
            if (currentIdx !== -1 && currentIdx !== k) {
                // Visualize selection/move
                setSwapping([k, currentIdx])
                setCurrentLine(4)
                
                // SWAP operation (not overwrite) to preserve all objects and IDs
                let temp = arr[k];
                arr[k] = arr[currentIdx];
                arr[currentIdx] = temp;
                
                setArray([...arr]) // Update Reac state
                await new Promise(r => setTimeout(r, speed))
            }
            
            k++;
            setComparing([])
            setSwapping([])
        }
        
        // Handle remaining elements in L
        while (i < n1) {
            if (!processingRef.current) return;
            
            let itemToPlaceId = L[i].id;
            const currentIdx = arr.findIndex(item => item && item.id === itemToPlaceId);
            
            if (currentIdx !== -1 && currentIdx !== k) {
                setSwapping([k, currentIdx])
                
                let temp = arr[k];
                arr[k] = arr[currentIdx];
                arr[currentIdx] = temp;

                setArray([...arr])
                await new Promise(r => setTimeout(r, speed))
            }
            i++;
            k++;
            setSwapping([])
        }
        
        // Handle remaining elements in R
        while (j < n2) {
            if (!processingRef.current) return;
            
            let itemToPlaceId = R[j].id;
            const currentIdx = arr.findIndex(item => item && item.id === itemToPlaceId);
            
            if (currentIdx !== -1 && currentIdx !== k) {
                setSwapping([k, currentIdx])
                
                let temp = arr[k];
                arr[k] = arr[currentIdx];
                arr[currentIdx] = temp;
                
                setArray([...arr])
                await new Promise(r => setTimeout(r, speed))
            }
            j++;
            k++;
            setSwapping([])
        }
    }

    const mergeSortRecursive = async (left: number, right: number) => {
        if (!processingRef.current) return;
        
        if (left < right) {
            let mid = Math.floor(left + (right - left) / 2);
            
            setCurrentLine(1) // Divide
            await mergeSortRecursive(left, mid);
            await mergeSortRecursive(mid + 1, right);
            
            setCurrentLine(2) // Merge
            await merge(left, mid, right);
        }
    }

    await mergeSortRecursive(0, arr.length - 1)
    
    // Final cleanup
    if (processingRef.current) {
        setSortedIndices(array.map((_, i) => i))
        setIsPlaying(false)
        setComparing([])
        setSwapping([])
        setCurrentLine(null)
        addLog("Merge Sort Completed.")
    }
    processingRef.current = false;
  }

  useEffect(() => {
    if (isPlaying && !isSorted) {
      runMergeSort()
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
    if (swapping.includes(index)) return '#ef4444' // Destructive Red (Overwriting)
    if (comparing.includes(index)) return '#eab308' // Warning Yellow (Comparing)
    return '#a855f7' // Primary Purple (Merge Sort distinct color)
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
