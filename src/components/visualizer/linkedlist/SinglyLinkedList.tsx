import { useEffect, useRef } from 'react'
import { useAlgoStore, type TreeNode, type TreeEdge } from '@/store/useAlgoStore'
import { LinkedListComponent } from './LinkedListComponent'

export const SinglyLinkedList = () => {
    const { 
        setTree, 
        treeNodes, 
        treeEdges, 
        generationId,
        addLog,
        currentAlgorithm,
        speed,
        targetValue,
        setTargetValue,
        isPlaying,
        setIsPlaying
    } = useAlgoStore()

    const processingRef = useRef(false)
    const listRef = useRef<number[]>([]) // Keep track of values for logic

    // Initialize
    useEffect(() => {
        createList()
    }, [generationId, currentAlgorithm?.id])

    // Handling Play/Search
    useEffect(() => {
        if (targetValue !== null && !processingRef.current && isPlaying) {
             // If playing, run search
             // searchNode(targetValue) is triggered by isPlaying
             // But searchNode implementation might rely on targetValue logic
             // Actually, useEffect below handles targetValue change.
             // We need to trigger searchNode when isPlaying becomes true
             searchNode(targetValue)
        }
    }, [isPlaying]) 
    
    // Remove the targetValue dependency effect if we only want explicit Play?
    // LinearSearch runs on isPlaying.
    // Let's keep it simple: isPlaying triggers search.
    
    const createList = () => {
        const count = 5 + Math.floor(Math.random() * 3) // 5-7 nodes
        const values = Array.from({ length: count }, () => Math.floor(Math.random() * 50))
        listRef.current = values
        updateVisualization(values)
        addLog(`Created ${currentAlgorithm?.id === 'doubly' ? 'Doubly' : 'Singly'} Linked List with ${count} nodes.`)
        
        // Auto-set target
        const target = values[Math.floor(Math.random() * values.length)]
        setTargetValue(target)
    }

    const updateVisualization = (values: number[], activeIndex: number = -1, highlightIndices: number[] = []) => {
        const nodes: TreeNode[] = []
        const edges: TreeEdge[] = []
        const isDoubly = currentAlgorithm?.id === 'doubly'
        
        const spacing = 1.8
        const startX = -((values.length - 1) * spacing) / 2

        values.forEach((val, i) => {
            const nodeId = `node-${i}`
            let color = '#06b6d4' // default cyan
            if (i === activeIndex) color = '#eab308' // yellow (current)
            if (highlightIndices.includes(i)) color = '#22c55e' // green (found/done)

            nodes.push({
                id: nodeId,
                value: val,
                x: startX + i * spacing,
                y: 0,
                z: 0,
                color
            })

            if (i < values.length - 1) {
                // Forward edge
                edges.push({
                    id: `edge-${i}`,
                    source: nodeId,
                    target: `node-${i + 1}`,
                    color: '#475569'
                })
                
                // Backward edge for Doubly
                if (isDoubly) {
                    edges.push({
                        id: `edge-back-${i}`,
                        source: `node-${i + 1}`,
                        target: `node-${i}`,
                        color: '#64748b' // slightly different shade
                    })
                }
            }
        })

        setTree(nodes, edges, nodes[0]?.id)
    }



    const searchNode = async (val: number) => {
        if (processingRef.current) return
        processingRef.current = true
        addLog(`Searching for value ${val}...`)

        const values = listRef.current
        
        for (let i = 0; i < values.length; i++) {
            if (!useAlgoStore.getState().isPlaying) {
                 processingRef.current = false
                 return
            }

            // Highlight current
            updateVisualization(values, i, [])
            await new Promise(r => setTimeout(r, speed))

            if (values[i] === val) {
                addLog(`Found ${val} at index ${i}!`)
                updateVisualization(values, -1, [i]) // Highlight green
                setIsPlaying(false)
                processingRef.current = false
                return
            }
        }

        addLog(`${val} not found in the list.`)
        updateVisualization(values, -1, []) // Reset
        setIsPlaying(false)
        processingRef.current = false
    }

    return (
        <LinkedListComponent nodes={treeNodes} edges={treeEdges} />
    )
}
