import { useEffect, useRef } from 'react'
import { useAlgoStore } from '@/store/useAlgoStore'
import { GraphComponent } from './GraphComponent'
import { generateGraphData } from '@/utils/graphUtils'

export const BFS = () => {
    const { 
        isPlaying, 
        setIsPlaying,
        addLog,
        speed,
        setTree,
        treeNodes,
        treeEdges,
        viewMode,
        generationId,
        setCustomDescription,
        setTargetValue
    } = useAlgoStore()

    const processingRef = useRef(false)
    const initializedRef = useRef(false)
    const lastGenIdRef = useRef(generationId)
    
    useEffect(() => {
        if (!initializedRef.current || lastGenIdRef.current !== generationId) {
            initializedRef.current = true
            lastGenIdRef.current = generationId
            createGraph()
        }
    }, [generationId])
    
    const createGraph = () => {
        addLog("Generating random graph for BFS...")
        const nodeCount = Math.floor(Math.random() * 5) + 8 // 8 to 12
        const { nodes, edges } = generateGraphData(nodeCount)
        setTree(nodes, edges, nodes[0].id)
    }

    const runBFS = async () => {
        if (processingRef.current) return
        processingRef.current = true
        
        // Reset colors
        const resetNodes = treeNodes.map(n => ({ ...n, color: '#06b6d4' }))
        const resetEdges = treeEdges.map(e => ({ ...e, color: '#475569' }))
        setTree(resetNodes, resetEdges, resetNodes[0]?.id || null)
        await new Promise(r => setTimeout(r, 500))
        
        addLog("Starting Breadth-First Search from node 0...")
        setCustomDescription("BFS Traversal in Progress")
        
        // BFS Algorithm
        const visited = new Set<string>()
        const queue: string[] = [resetNodes[0].id]
        visited.add(resetNodes[0].id)
        
        let currentNodes = [...resetNodes]
        let currentEdges = [...resetEdges]
        
        while (queue.length > 0) {
            const currentId = queue.shift()!
            const currentIndex = currentNodes.findIndex(n => n.id === currentId)
            const current = currentNodes[currentIndex]
            
            // Highlight current node being explored
            current.color = '#eab308' // Yellow - exploring
            addLog(`Visiting node ${current.value}`)
            setTargetValue(current.value)
            setTree([...currentNodes], currentEdges, resetNodes[0].id)
            await new Promise(r => setTimeout(r, speed))
            
            // Mark as visited
            current.color = '#22c55e' // Green - visited
            setTree([...currentNodes], currentEdges, resetNodes[0].id)
            await new Promise(r => setTimeout(r, speed * 0.5))
            
            // Find all neighbors
            const neighbors = currentEdges
                .filter(e => e.source === currentId || e.target === currentId)
                .map(e => {
                    const targetId = e.source === currentId ? e.target : e.source
                    return { edge: e, nodeId: targetId }
                })
            
            // Enqueue unvisited neighbors
            for (const { edge, nodeId } of neighbors) {
                if (!visited.has(nodeId)) {
                    visited.add(nodeId)
                    queue.push(nodeId)
                    
                    // Highlight edge
                    const edgeIndex = currentEdges.findIndex(e => e.id === edge.id)
                    currentEdges[edgeIndex] = { ...edge, color: '#22c55e' }
                    
                    // Highlight neighbor as queued
                    const neighborIndex = currentNodes.findIndex(n => n.id === nodeId)
                    currentNodes[neighborIndex] = { ...currentNodes[neighborIndex], color: '#a855f7' } // Purple - queued
                    
                    addLog(`Enqueued node ${currentNodes[neighborIndex].value}`)
                    setTree([...currentNodes], [...currentEdges], resetNodes[0].id)
                    await new Promise(r => setTimeout(r, speed * 0.3))
                }
            }
        }
        
        addLog("BFS Traversal Complete!")
        setCustomDescription("BFS Complete")
        setIsPlaying(false)
        processingRef.current = false
    }

    useEffect(() => {
        if (isPlaying) runBFS()
    }, [isPlaying])

    const position: [number, number, number] = viewMode === '2d' ? [0, 0, 0] : [0, 0, 0]

    return <GraphComponent nodes={treeNodes} edges={treeEdges} position={position} />
}
