import { useEffect, useRef } from 'react'
import { useAlgoStore } from '@/store/useAlgoStore'
import { GraphComponent } from './GraphComponent'
import { generateGraphData } from '@/utils/graphUtils'

export const Dijkstra = () => {
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
            createWeightedGraph()
        }
    }, [generationId])
    
    const createWeightedGraph = () => {
        addLog("Generating random weighted graph for Dijkstra...")
        const nodeCount = Math.floor(Math.random() * 5) + 6 // 6 to 10
        // Use true for weighted graph
        const { nodes, edges } = generateGraphData(nodeCount, true) 
        setTree(nodes, edges, nodes[0].id)
    }

    const runDijkstra = async () => {
        if (processingRef.current) return
        processingRef.current = true
        
        // Reset colors
        const resetNodes = treeNodes.map(n => ({ ...n, color: '#06b6d4' }))
        const resetEdges = treeEdges.map(e => ({ ...e, color: '#475569' }))
        setTree(resetNodes, resetEdges, resetNodes[0]?.id || null)
        await new Promise(r => setTimeout(r, 500))
        
        const startNode = resetNodes[0]
        const endNode = resetNodes [resetNodes.length - 1]
        
        addLog(`Finding shortest path from node ${startNode.value} to node ${endNode.value}...`)
        setCustomDescription(`Dijkstra: Finding Shortest Path`)
        
        // Dijkstra's Algorithm
        const distances = new Map<string, number>()
        const previous = new Map<string, string | null>()
        const unvisited = new Set<string>()
        
        // Initialize
        resetNodes.forEach(node => {
            distances.set(node.id, Infinity)
            previous.set(node.id, null)
            unvisited.add(node.id)
        })
        distances.set(startNode.id, 0)
        
        let currentNodes = [...resetNodes]
        let currentEdges = [...resetEdges]
        
        // Highlight start and end
        const startIndex = currentNodes.findIndex(n => n.id === startNode.id)
        const endIndex = currentNodes.findIndex(n => n.id === endNode.id)
        currentNodes[startIndex] = { ...currentNodes[startIndex], color: '#10b981' } // Green start
        currentNodes[endIndex] = { ...currentNodes[endIndex], color: '#ef4444' } // Red end
        setTree([...currentNodes], currentEdges, startNode.id)
        await new Promise(r => setTimeout(r, speed))
        
        while (unvisited.size > 0) {
            // Find min distance unvisited node
            let minDist = Infinity
            let minNodeId: string | null = null
            
            for (const nodeId of unvisited) {
                const dist = distances.get(nodeId)!
                if (dist < minDist) {
                    minDist = dist
                    minNodeId = nodeId
                }
            }
            
            if (minNodeId === null || minDist === Infinity) break
            
            const currentId = minNodeId
            unvisited.delete(currentId)
            
            const currentIndex = currentNodes.findIndex(n => n.id === currentId)
            const current = currentNodes[currentIndex]
            
            // Highlight current node
            if (currentId !== startNode.id && currentId !== endNode.id) {
                current.color = '#eab308' // Yellow - exploring
            }
            addLog(`Exploring node ${current.value} (distance: ${minDist})`)
            setTargetValue(current.value)
            setTree([...currentNodes], currentEdges, startNode.id)
            await new Promise(r => setTimeout(r, speed))
            
            // Get neighbors
            const neighborEdges = currentEdges.filter(e => 
                (e.source === currentId || e.target === currentId)
            )
            
            for (const edge of neighborEdges) {
                const neighborId = edge.source === currentId ? edge.target : edge.source
                
                if (!unvisited.has(neighborId)) continue
                
                const edgeWeight = edge.weight || 1
                const altDistance = distances.get(currentId)! + edgeWeight
                
                // Highlight edge being considered
                const edgeIndex = currentEdges.findIndex(e => e.id === edge.id)
                currentEdges[edgeIndex] = { ...edge, color: '#a855f7' } // Purple - considering
                setTree([...currentNodes], [...currentEdges], startNode.id)
                await new Promise(r => setTimeout(r, speed * 0.5))
                
                if (altDistance < distances.get(neighborId)!) {
                    distances.set(neighborId, altDistance)
                    previous.set(neighborId, currentId)
                    
                    addLog(`Updated distance to node ${currentNodes.find(n => n.id === neighborId)!.value}: ${altDistance}`)
                    currentEdges[edgeIndex] = { ...edge, color: '#22c55e' } // Green - better path
                } else {
                    currentEdges[edgeIndex] = { ...edge, color: '#475569' } // Gray - not better
                }
                
                setTree([...currentNodes], [...currentEdges], startNode.id)
                await new Promise(r => setTimeout(r, speed * 0.3))
            }
            
            // Mark as visited
            if (currentId !== startNode.id && currentId !== endNode.id) {
                current.color = '#06b6d4' // Cyan - visited
            }
            setTree([...currentNodes], currentEdges, startNode.id)
        }
        
        // Reconstruct path
        addLog("Reconstructing shortest path...")
        const path: string[] = []
        let curr: string | null | undefined = endNode.id
        
        while (curr) {
            path.unshift(curr)
            curr = previous.get(curr)
        }
        
        // Highlight shortest path
        for (let i = 0; i < path.length - 1; i++) {
            const sourceId = path[i]
            const targetId = path[i + 1]
            
            const pathEdge = currentEdges.find(e => 
                (e.source === sourceId && e.target === targetId) ||
                (e.source === targetId && e.target === sourceId)
            )
            
            if (pathEdge) {
                const edgeIndex = currentEdges.findIndex(e => e.id === pathEdge.id)
                currentEdges[edgeIndex] = { ...pathEdge, color: '#fbbf24' } // Yellow - final path
            }
        }
        
        setTree([...currentNodes], [...currentEdges], startNode.id)
        
        const finalDistance = distances.get(endNode.id)!
        addLog(`Shortest path distance: ${finalDistance === Infinity ? 'No path found' : finalDistance}`)
        setCustomDescription(finalDistance === Infinity ? 'No path found' : `Shortest Path: ${finalDistance}`)
        
        setIsPlaying(false)
        processingRef.current = false
    }

    useEffect(() => {
        if (isPlaying) runDijkstra()
    }, [isPlaying])

    const position: [number, number, number] = viewMode === '2d' ? [0, 0, 0] : [0, 0, 0]

    return <GraphComponent nodes={treeNodes} edges={treeEdges} position={position} />
}
