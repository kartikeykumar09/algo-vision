import { useEffect, useRef } from 'react'
import { useAlgoStore, type TreeNode, type TreeEdge, generateId } from '@/store/useAlgoStore'
import { TreeComponent } from './TreeComponent'

export const TreeTraversals = () => {
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
        setCustomDescription
    } = useAlgoStore()

    const processingRef = useRef(false)
    const initializedRef = useRef(false)
    const lastGenIdRef = useRef(generationId)
    const nodesRef = useRef<TreeNode[]>([])
    const edgesRef = useRef<TreeEdge[]>([])
    const rootIdRef = useRef<string | null>(null)
    
    // We create a fixed tree for demo
    useEffect(() => {
        if (!initializedRef.current || lastGenIdRef.current !== generationId) {
            initializedRef.current = true
            lastGenIdRef.current = generationId
            createStaticTree()
        }
    }, [generationId])
    
    const createStaticTree = () => {
        // Create a nice balanced tree: 1, 2, 3, 4, 5, 6, 7
        // Struture:
        //      4
        //    2   6
        //   1 3 5 7
        const vals = Array.from({length: 7}, () => Math.floor(Math.random() * 90) + 10).sort((a,b) => a-b)
        // Balanced Tree indices:
        //      3
        //    1   5
        //   0 2 4 6
        // Map sorted vals to balanced structure
        const n4 = { id: generateId(), value: vals[3], x: 0, y: 0, z: 0, leftId: null, rightId: null, color: '#06b6d4' } as any
        const n2 = { id: generateId(), value: vals[1], x: 0, y: 0, z: 0, leftId: null, rightId: null, color: '#06b6d4' } as any
        const n6 = { id: generateId(), value: vals[5], x: 0, y: 0, z: 0, leftId: null, rightId: null, color: '#06b6d4' } as any
        const n1 = { id: generateId(), value: vals[0], x: 0, y: 0, z: 0, leftId: null, rightId: null, color: '#06b6d4' } as any
        const n3 = { id: generateId(), value: vals[2], x: 0, y: 0, z: 0, leftId: null, rightId: null, color: '#06b6d4' } as any
        const n5 = { id: generateId(), value: vals[4], x: 0, y: 0, z: 0, leftId: null, rightId: null, color: '#06b6d4' } as any
        const n7 = { id: generateId(), value: vals[6], x: 0, y: 0, z: 0, leftId: null, rightId: null, color: '#06b6d4' } as any

        n4.leftId = n2.id; n4.rightId = n6.id
        n2.leftId = n1.id; n2.rightId = n3.id
        n6.leftId = n5.id; n6.rightId = n7.id

        const allNodes = [n4, n2, n6, n1, n3, n5, n7]
        const allEdges = [
            { id: generateId(), source: n4.id, target: n2.id },
            { id: generateId(), source: n4.id, target: n6.id },
            { id: generateId(), source: n2.id, target: n1.id },
            { id: generateId(), source: n2.id, target: n3.id },
            { id: generateId(), source: n6.id, target: n5.id },
            { id: generateId(), source: n6.id, target: n7.id },
        ]

        // Layout
        // Manual simple layout since we know structure
        const layout = (id: string, x: number, y: number, w: number) => {
            const node = allNodes.find(n => n.id === id)!
            node.x = x
            node.y = y
            if (node.leftId) layout(node.leftId, x - w, y - 1.5, w/2)
            if (node.rightId) layout(node.rightId, x + w, y - 1.5, w/2)
        }
        layout(n4.id, 0, 0, 4)

        nodesRef.current = allNodes as TreeNode[]
        edgesRef.current = allEdges
        rootIdRef.current = n4.id
        
        setTree(allNodes, allEdges, n4.id)
    }

    const traverse = async () => {
        if (processingRef.current) return
        processingRef.current = true
        
        // Reset colors
        const resetNodes = nodesRef.current.map(n => ({ ...n, color: '#06b6d4' }))
        setTree(resetNodes, edgesRef.current, rootIdRef.current)
        await new Promise(r => setTimeout(r, 500))

        addLog("Starting Inorder Traversal (Left, Root, Right)...")
        setCustomDescription("Performing In-Order Traversal")
        // We'll just do Inorder for now as default, or random?
        // Let's do Inorder. Ideally UI selects which one.
        // Assuming Inorder since snippet says "Tree Traversals" generally.
        // We can cycle them or pick one? Let's do Inorder.
        
        const visit = async (id: string | null | undefined) => {
            if (!id) return
            
            const node = resetNodes.find(n => n.id === id)!
            
            // Go Left
            await visit(node.leftId)
            
            // Visit Root
            node.color = '#eab308' // Visiting
            setTree([...resetNodes], edgesRef.current, rootIdRef.current)
            addLog(`Visiting ${node.value}`)
            await new Promise(r => setTimeout(r, speed))
            
            node.color = '#22c55e' // Visited
            setTree([...resetNodes], edgesRef.current, rootIdRef.current)
            
            // Go Right
            await visit(node.rightId)
        }
        
        await visit(rootIdRef.current)
        
        addLog("Traversal Complete.")
        setIsPlaying(false)
        processingRef.current = false
        setCustomDescription(null)
    }

    useEffect(() => {
        if (isPlaying) traverse()
    }, [isPlaying])

    const position: [number, number, number] = viewMode === '2d' ? [0, 8, 0] : [0, 2, 0]

    return <TreeComponent nodes={treeNodes} edges={treeEdges} position={position} />
}
