import { useEffect, useRef } from 'react'
import { useAlgoStore, type TreeNode, type TreeEdge, generateId } from '@/store/useAlgoStore'
import { TreeComponent } from './TreeComponent'

const getHeight = (node: any | undefined): number => node?.height || 0

// Internal Node Class for Logic
class Node {
    id: string
    value: number
    left: Node | null = null
    right: Node | null = null
    height: number = 1
    x: number = 0
    y: number = 0
    color: string = '#06b6d4'

    constructor(val: number) {
        this.id = generateId()
        this.value = val
    }
}

export const AVLTree = () => {
    const { 
        isPlaying, 
        setIsPlaying,
        addLog,
        // setCurrentLine, // Unused for now
        speed,
        setTree,
        treeNodes,
        treeEdges,
        // rootId, // Unused
        viewMode,
        setTargetValue,
        generationId,
        setCustomDescription
    } = useAlgoStore()

    const processingRef = useRef(false)
    const initializedRef = useRef(false)
    const lastGenIdRef = useRef(generationId)
    const rootRef = useRef<Node | null>(null)

    // Sync Helper
    const syncToStore = (root: Node | null) => {
        const nodes: TreeNode[] = []
        const edges: TreeEdge[] = []
        
        if (!root) {
            setTree([], [], null)
            return
        }

        // Calculate Layout
        const layout = (node: Node, level: number, x: number, width: number) => {
            node.x = x
            node.y = -level * 1.5
            
            const flatNode: TreeNode = {
                 id: node.id,
                 value: node.value,
                 x: node.x,
                 y: node.y,
                 z: 0,
                 color: node.color,
                 height: node.height
            }
            nodes.push(flatNode)

            if (node.left) {
                edges.push({ id: generateId(), source: node.id, target: node.left.id })
                layout(node.left, level + 1, x - width / 2, width / 2)
            }
            if (node.right) {
                edges.push({ id: generateId(), source: node.id, target: node.right.id })
                layout(node.right, level + 1, x + width / 2, width / 2)
            }
        }
        
        layout(root, 0, 0, 8)
        setTree(nodes, edges, root.id)
    }

    // Rotations
    const rightRotate = async (y: Node) => {
        addLog(`Performing Right Rotation on ${y.value}`)
        const x = y.left!
        const T2 = x.right
        
        // Rotate
        x.right = y
        y.left = T2
        
        // Update Heights
        y.height = Math.max(getHeight(y.left), getHeight(y.right)) + 1
        x.height = Math.max(getHeight(x.left), getHeight(x.right)) + 1
        
        // Animate
        syncToStore(rootRef.current)
        await new Promise(r => setTimeout(r, speed))
        
        return x
    }

    const leftRotate = async (x: Node) => {
        addLog(`Performing Left Rotation on ${x.value}`)
        const y = x.right!
        const T2 = y.left
        
        // Rotate
        y.left = x
        x.right = T2
        
        // Update Heights
        x.height = Math.max(getHeight(x.left), getHeight(x.right)) + 1
        y.height = Math.max(getHeight(y.left), getHeight(y.right)) + 1
        
        syncToStore(rootRef.current)
        await new Promise(r => setTimeout(r, speed))

        return y
    }
    
    const getNodeHeight = (n: Node | null) => n ? n.height : 0
    const getBalanceFactor = (n: Node | null) => n ? getNodeHeight(n.left) - getNodeHeight(n.right) : 0

    const insert = async (node: Node | null, value: number): Promise<Node> => {
        // 1. BST Insert
        if (!node) {
            const newNode = new Node(value)
            addLog(`Inserted ${value}`)
            return newNode
        }
        
        // Highlight compare
        node.color = '#eab308'
        syncToStore(rootRef.current)
        await new Promise(r => setTimeout(r, speed * 0.5))
        node.color = '#06b6d4'

        if (value < node.value) {
            node.left = await insert(node.left, value)
        } else if (value > node.value) {
            node.right = await insert(node.right, value)
        } else {
            return node // No duplicates
        }
        
        // 2. Update Height
        node.height = 1 + Math.max(getNodeHeight(node.left), getNodeHeight(node.right))
        
        // 3. Balance Factor
        const balance = getBalanceFactor(node)
        
        // 4. Rotations
        // Left Left Case
        if (balance > 1 && value < (node.left?.value || 0)) {
            return rightRotate(node)
        }
        // Right Right Case
        if (balance < -1 && value > (node.right?.value || 0)) {
            return leftRotate(node)
        }
        // Left Right Case
        if (balance > 1 && value > (node.left?.value || 0)) {
            node.left = await leftRotate(node.left!)
            return rightRotate(node)
        }
        // Right Left Case
        if (balance < -1 && value < (node.right?.value || 0)) {
            node.right = await rightRotate(node.right!)
            return leftRotate(node)
        }
        
        return node
    }
    
    // Silent Rotations for Init
    const rightRotateSilent = (y: Node) => {
        const x = y.left!
        const T2 = x.right
        x.right = y
        y.left = T2
        y.height = Math.max(getHeight(y.left), getHeight(y.right)) + 1
        x.height = Math.max(getHeight(x.left), getHeight(x.right)) + 1
        return x
    }

    const leftRotateSilent = (x: Node) => {
        const y = x.right!
        const T2 = y.left
        y.left = x
        x.right = T2
        x.height = Math.max(getHeight(x.left), getHeight(x.right)) + 1
        y.height = Math.max(getHeight(y.left), getHeight(y.right)) + 1
        return y
    }

    const insertSilent = (node: Node | null, value: number): Node => {
        if (!node) return new Node(value)
        
        if (value < node.value) node.left = insertSilent(node.left, value)
        else if (value > node.value) node.right = insertSilent(node.right, value)
        else return node
        
        node.height = 1 + Math.max(getHeight(node.left), getHeight(node.right))
        const balance = getBalanceFactor(node)
        
        if (balance > 1 && value < (node.left?.value || 0)) return rightRotateSilent(node)
        if (balance < -1 && value > (node.right?.value || 0)) return leftRotateSilent(node)
        if (balance > 1 && value > (node.left?.value || 0)) {
            node.left = leftRotateSilent(node.left!)
            return rightRotateSilent(node)
        }
        if (balance < -1 && value < (node.right?.value || 0)) {
            node.right = rightRotateSilent(node.right!)
            return leftRotateSilent(node)
        }
        return node
    }
    
    const initRandomTree = async () => {
        addLog("Initializing Random AVL Tree...")
        rootRef.current = null
        
        const count = 5 + Math.floor(Math.random() * 3) // 5 to 7 nodes
        const values = Array.from({ length: count }, () => Math.floor(Math.random() * 90) + 10)
        
        for (const val of values) {
            rootRef.current = insertSilent(rootRef.current, val)
        }
        
        syncToStore(rootRef.current)
        initializedRef.current = true
    }

    useEffect(() => {
        if (!initializedRef.current || lastGenIdRef.current !== generationId) {
            initRandomTree()
            lastGenIdRef.current = generationId
        }
    }, [generationId])

    const resetColors = (node: Node | null) => {
        if (!node) return
        node.color = '#06b6d4'
        resetColors(node.left)
        resetColors(node.right)
    }

    const runDemo = async () => {
        if (processingRef.current) return
        processingRef.current = true
        
        // Reset colors from previous run
        if (rootRef.current) {
            resetColors(rootRef.current)
            syncToStore(rootRef.current) // Sync immediately to clear old greens
            await new Promise(r => setTimeout(r, 200)) // Short pause
        }
        
        // If tree is empty or small, insert first to build it up
        if (treeNodes.length < 5) {
             const val = Math.floor(Math.random() * 90) + 10
             setTargetValue(val)
             setCustomDescription(`Inserting ${val} to build tree`)
             addLog(`Inserting ${val}...`)
             
             rootRef.current = await insert(rootRef.current, val)
             
             // Highlight inserted node
             const highlightInserted = (node: Node | null, t: number) => {
                if (!node) return
                if (node.value === t) node.color = '#22c55e'
                else if (t < node.value) highlightInserted(node.left, t)
                else highlightInserted(node.right, t)
             }
             highlightInserted(rootRef.current, val)
             
             syncToStore(rootRef.current)
             
             setIsPlaying(false)
             processingRef.current = false
             // setCustomDescription(null) // Keep the last action description
             return
        }

        // Randomly choose Search or Insert
        const shouldSearch = Math.random() > 0.4
        
        if (shouldSearch) {
            // Search Logic
            const shouldFind = Math.random() > 0.3
            let val: number
            if (shouldFind && treeNodes.length > 0) {
                 val = treeNodes[Math.floor(Math.random() * treeNodes.length)].value
            } else {
                 val = Math.floor(Math.random() * 90) + 10
            }
            
            setTargetValue(val)
            setCustomDescription(`Searching for ${val}`)
            addLog(`Searching for ${val}...`)
            
            let curr = rootRef.current

            // 1. Convert current tree to flat nodes for reference
            // helper to get current flat nodes without updating store yet
            const getFlatNodes = (root: Node | null): [TreeNode[], TreeEdge[]] => {
                const nodes: TreeNode[] = []
                const edges: TreeEdge[] = []
                if (!root) return [[], []]
                const layout = (node: Node, level: number, x: number, width: number) => {
                    nodes.push({ id: node.id, value: node.value, x: x, y: -level * 1.5, z: 0, color: node.color, height: node.height })
                    if (node.left) {
                        edges.push({ id: generateId(), source: node.id, target: node.left.id })
                        layout(node.left, level + 1, x - width / 2, width / 2)
                    }
                    if (node.right) {
                        edges.push({ id: generateId(), source: node.id, target: node.right.id })
                        layout(node.right, level + 1, x + width / 2, width / 2)
                    }
                }
                layout(root, 0, 0, 8)
                return [nodes, edges]
            }

            // Create Ghost Node
            const searchNodeId = generateId()
            const searchNode: TreeNode = { 
                id: searchNodeId, 
                value: val, 
                x: 0, y: 2, z: 0, 
                color: '#ef4444', // Red
                height: 1
            } as any

            // Initial render of ghost
            let [currentFlatNodes, currentFlatEdges] = getFlatNodes(rootRef.current)
            setTree([...currentFlatNodes, searchNode], currentFlatEdges, rootRef.current?.id || null)
            await new Promise(r => setTimeout(r, speed))
            
            while (curr) {
                 // Update Ghost Position
                 searchNode.x = curr.x
                 searchNode.y = curr.y + 0.5 // slightly above/offset
                 
                 // Highlight Current
                 curr.color = '#eab308' 
                 
                 // Sync with Ghost
                 const [flatNodes, flatEdges] = getFlatNodes(rootRef.current)
                 
                 setTree([...flatNodes, searchNode], flatEdges, rootRef.current?.id || null)
                 await new Promise(r => setTimeout(r, speed))
                 
                 if (curr.value === val) {
                     addLog(`Found ${val}!`)
                     curr.color = '#22c55e' // Green
                     setCustomDescription(`Found ${val}`)
                     
                     // Remove Ghost, show Green
                     const [finalNodes, finalEdges] = getFlatNodes(rootRef.current)
                     setTree(finalNodes, finalEdges, rootRef.current?.id || null)
                     
                     await new Promise(r => setTimeout(r, speed * 2))
                     // Keep Green!
                     break
                 } else if (val < curr.value) {
                     addLog(`${val} < ${curr.value}, going Left`)
                     curr.color = '#06b6d4' // Reset
                     curr = curr.left
                 } else {
                     addLog(`${val} > ${curr.value}, going Right`)
                     curr.color = '#06b6d4'
                     curr = curr.right
                 }
                 
                 if (!curr) {
                     addLog(`Value ${val} not found in tree.`)
                     setCustomDescription(`${val} not found`)
                     // Remove Ghost
                     const [finalNodes, finalEdges] = getFlatNodes(rootRef.current)
                     setTree(finalNodes, finalEdges, rootRef.current?.id || null)
                 }
            }
            
        } else {
            // Insert Logic
            const val = Math.floor(Math.random() * 90) + 10
            setTargetValue(val)
            setCustomDescription(`Inserting ${val}`)
            addLog(`Inserting ${val}...`)
            
            rootRef.current = await insert(rootRef.current, val)
            
            // Final Visualization of Result: Find and Green the new node
             const highlightInserted = (node: Node | null, t: number) => {
                if (!node) return
                if (node.value === t) node.color = '#22c55e'
                else if (t < node.value) highlightInserted(node.left, t)
                else highlightInserted(node.right, t)
             }
             highlightInserted(rootRef.current, val)

            addLog(`Insertion of ${val} complete.`)
            setCustomDescription(`Inserted ${val}`)
            syncToStore(rootRef.current)
            
            await new Promise(r => setTimeout(r, speed))
        }
        
        setIsPlaying(false)
        processingRef.current = false
        // setCustomDescription(null) // Keep description
    }

    useEffect(() => {
        if (isPlaying) runDemo()
    }, [isPlaying])

    const position: [number, number, number] = viewMode === '2d' ? [0, 8, 0] : [0, 2, 0]

    return <TreeComponent nodes={treeNodes} edges={treeEdges} position={position} />
}
