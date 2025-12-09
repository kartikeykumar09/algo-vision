import { useEffect, useRef } from 'react'
import { useAlgoStore } from '@/store/useAlgoStore'
import { GraphComponent } from './GraphComponent'
import { generateGraphData } from '@/utils/graphUtils'

export const DFS = () => {
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
        addLog("Generating random graph for DFS...")
        const nodeCount = Math.floor(Math.random() * 5) + 8 // 8 to 12
        const { nodes, edges } = generateGraphData(nodeCount)
        setTree(nodes, edges, nodes[0].id)
    }

    const runDFS = async () => {
        if (processingRef.current) return
        processingRef.current = true
        
        // Reset colors
        const resetNodes = treeNodes.map(n => ({ ...n, color: '#06b6d4' }))
        const resetEdges = treeEdges.map(e => ({ ...e, color: '#475569' }))
        setTree(resetNodes, resetEdges, resetNodes[0]?.id || null)
        await new Promise(r => setTimeout(r, 500))
        
        addLog("Starting Depth-First Search from node 0...")
        setCustomDescription("DFS Traversal in Progress")
        
        const visited = new Set<string>()
        let currentNodes = [...resetNodes]
        let currentEdges = [...resetEdges]
        
        const dfsHelper = async (nodeId: string): Promise<void> => {
            if (visited.has(nodeId)) return
            
            visited.add(nodeId)
            const currentIndex = currentNodes.findIndex(n => n.id === nodeId)
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
                .filter(e => e.source === nodeId || e.target === nodeId)
                .map(e => {
                    const targetId = e.source === nodeId ? e.target : e.source
                    return { edge: e, nodeId: targetId }
                })
            
            // Recursively visit unvisited neighbors
            for (const { edge, nodeId: neighborId } of neighbors) {
                if (!visited.has(neighborId)) {
                    // Highlight edge
                    const edgeIndex = currentEdges.findIndex(e => e.id === edge.id)
                    currentEdges[edgeIndex] = { ...edge, color: '#22c55e' }
                    setTree([...currentNodes], [...currentEdges], resetNodes[0].id)
                    await new Promise(r => setTimeout(r, speed * 0.3))
                    
                    await dfsHelper(neighborId)
                }
            }
        }
        
        await dfsHelper(resetNodes[0].id)
        
        addLog("DFS Traversal Complete!")
        setCustomDescription("DFS Complete")
        setIsPlaying(false)
        processingRef.current = false
    }

    useEffect(() => {
        if (isPlaying) runDFS()
    }, [isPlaying])

    const position: [number, number, number] = viewMode === '2d' ? [0, 0, 0] : [0, 0, 0]

    return <GraphComponent nodes={treeNodes} edges={treeEdges} position={position} />
}
