import { useEffect, useRef } from 'react'
import { useAlgoStore, type TreeNode, type TreeEdge } from '@/store/useAlgoStore'
import { LinkedListComponent } from './LinkedListComponent'

export const ListReversal = () => {
    const { 
        setTree, 
        treeNodes, 
        treeEdges, 
        generationId,
        addLog,
        isPlaying,
        setIsPlaying,
        speed
    } = useAlgoStore()

    const processingRef = useRef(false)
    const listRef = useRef<number[]>([])

    useEffect(() => {
        createList()
    }, [generationId])

    useEffect(() => {
        if (isPlaying && !processingRef.current) {
            runReversal()
        }
    }, [isPlaying])

    const createList = () => {
        const count = 4 + Math.floor(Math.random() * 3) // 4 to 6
        const values = Array.from({ length: count }, () => Math.floor(Math.random() * 50))
        listRef.current = values
        
        // Initial edges: 0->1, 1->2...
        const edges: TreeEdge[] = []
        for(let i=0; i<count-1; i++) {
            edges.push({ id: `edge-${i}`, source: `node-${i}`, target: `node-${i+1}`, color: '#475569' })
        }
        
        draw(values, edges, -1, -1)
        addLog("Created list for reversal.")
    }

    const draw = (values: number[], edges: TreeEdge[], currIdx: number, prevIdx: number) => {
        const nodes: TreeNode[] = []
        const spacing = 1.8
        const startX = -((values.length - 1) * spacing) / 2

        values.forEach((val, i) => {
            let color = '#06b6d4'
            if (i === currIdx) color = '#eab308' // Current
            if (i === prevIdx) color = '#22c55e' // Prev (processed)
            
            nodes.push({
                id: `node-${i}`,
                value: val,
                x: startX + i * spacing,
                y: 0,
                z: 0,
                color
            })
        })
        
        setTree(nodes, edges, 'node-0')
    }

    const runReversal = async () => {
        processingRef.current = true
        addLog("Starting Iterative Reversal...")
        
        const count = listRef.current.length
        
        // We will maintain the 'edges' state manually
        // Initial state: i -> i+1
        let currentEdges: TreeEdge[] = []
        for(let i=0; i<count-1; i++) {
            currentEdges.push({ id: `edge-${i}`, source: `node-${i}`, target: `node-${i+1}`, color: '#475569' })
        }

        let prev = -1 // null
        let curr = 0

        while (curr < count) {
            // Visualize Step
            draw(listRef.current, currentEdges, curr, prev)
            addLog(`Processing Node ${listRef.current[curr]}...`)
            await new Promise(r => setTimeout(r, speed * 1.5))

            // Logic: next = curr.next (visually i+1)
            // curr.next = prev
            const next = curr + 1 
            
            // Modify edges: Remove edge starting from curr
            currentEdges = currentEdges.filter(e => e.source !== `node-${curr}`)
            
            // Add edge curr -> prev (if prev exists)
            if (prev !== -1) {
                currentEdges.push({ 
                    id: `edge-rev-${curr}`, 
                    source: `node-${curr}`, 
                    target: `node-${prev}`, 
                    color: '#eab308' // Highlight change
                })
            }
            
            // Update Visual with new edge
            draw(listRef.current, currentEdges, curr, prev)
            await new Promise(r => setTimeout(r, speed))

            // Shift pointers
            prev = curr
            curr = next
        }
        
        addLog("Reversal Complete. Head is now the last node.")
        draw(listRef.current, currentEdges, -1, prev) // End state
        setIsPlaying(false)
        processingRef.current = false
    }

    return (
         <LinkedListComponent nodes={treeNodes} edges={treeEdges} />
    )
}
