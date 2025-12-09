import { useEffect, useRef } from 'react'
import { useAlgoStore, type TreeNode, type TreeEdge } from '@/store/useAlgoStore'
import { TreeComponent } from './TreeComponent'
import { generateId } from '@/store/useAlgoStore'

// Helper for Layout
const calculatePositions = (root: TreeNode | null, nodesArr: TreeNode[], level: number = 0, x: number = 0, width: number = 8) => {
    if (!root) return

    root.x = x
    root.y = -level * 1.5 // Each level down is 1.5 units
    root.z = 0

    const left = nodesArr.find(n => n.id === root.leftId)
    const right = nodesArr.find(n => n.id === root.rightId)
    
    // Simple recursive layout
    // Width reduces as we go deeper
    const nextWidth = width / 2

    if (left) calculatePositions(left, nodesArr, level + 1, x - nextWidth, nextWidth)
    if (right) calculatePositions(right, nodesArr, level + 1, x + nextWidth, nextWidth)
}


export const BST = () => {
    const { 
        isPlaying, 
        setIsPlaying,
        addLog,
        setCurrentLine,
        speed,
        setTree,
        treeNodes,
        treeEdges,
        rootId,
        viewMode,
        setTargetValue,
        generationId,
        setCustomDescription
    } = useAlgoStore()

    const processingRef = useRef(false)
    const initializedRef = useRef(false)
    const lastGenIdRef = useRef(generationId)
    
    // Internal Tree Structure for logic (since store is flat state)
    // We rebuild it or maintain it. 
    // Easier: Maintain logic vars, sync to store for render.

    // On Mount & Gen Change: Create a Random Tree
    useEffect(() => {
        if (!initializedRef.current || lastGenIdRef.current !== generationId) {
            initializedRef.current = true
            lastGenIdRef.current = generationId
            createRandomTree()
        }
    }, [generationId])
    
    const createRandomTree = async () => {
        addLog("Generating random Binary Search Tree...")
        const values = Array.from({ length: 8 }, () => Math.floor(Math.random() * 90) + 10)
        
        let nodes: TreeNode[] = []
        let edges: TreeEdge[] = []
        let root: TreeNode | null = null

        // Simple Insert Logic (Non-animated for init)
        const insert = (val: number) => {
            const newNode: TreeNode = { id: generateId(), value: val, x: 0, y: 0, z: 0, leftId: null, rightId: null }
            nodes.push(newNode)
            
            if (!root) {
                root = newNode
                return
            }
            
            let curr = root
            while (true) {
                if (val < curr.value) {
                    if (!curr.leftId) {
                        curr.leftId = newNode.id
                        edges.push({ id: generateId(), source: curr.id, target: newNode.id })
                        break
                    }
                    curr = nodes.find(n => n.id === curr.leftId)!
                } else {
                     if (!curr.rightId) {
                        curr.rightId = newNode.id
                         edges.push({ id: generateId(), source: curr.id, target: newNode.id })
                        break
                    }
                   curr = nodes.find(n => n.id === curr.rightId)!
                }
            }
        }

        values.forEach(v => insert(v))
        
        // Layout
        calculatePositions(root, nodes)
        setTree(nodes, edges, root ? root['id'] : null)
    }


    
    // For this demo: "Play" will Insert OR Search (50/50)
    // Actually, user asked for SEARCH specifically. Let's prioritize Search if tree is big enough.
    const runDemo = async () => {
        if (processingRef.current) return
        processingRef.current = true
        
        // Reset colors from previous run
        const resetNodes = treeNodes.map(n => ({ ...n, color: '#06b6d4' }))
        setTree(resetNodes, treeEdges, rootId)
        await new Promise(r => setTimeout(r, 200))

        // If tree is empty or small, insert first
        if (treeNodes.length < 5) {
             const val = Math.floor(Math.random() * 90) + 10
             setTargetValue(val)
             setCustomDescription(`Inserting ${val} to build tree`)
             addLog(`Inserting value for setup: ${val}`)
             
             await insertValueLogic(val)
             
             // Highlight inserted node (it stays green from insertValueLogic)
             setCustomDescription(`Inserted ${val}`)
             
             setIsPlaying(false)
             processingRef.current = false
             // setCustomDescription(null)
             return
        }
        
        // Randomly choose Search or Insert
        const shouldSearch = Math.random() > 0.4
        
        if (shouldSearch) {
             // Search Demo
            const shouldFind = Math.random() > 0.3 // 70% chance to search for existing
            let val: number
            if (shouldFind && treeNodes.length > 0) {
                val = treeNodes[Math.floor(Math.random() * treeNodes.length)].value
            } else {
                 val = Math.floor(Math.random() * 90) + 10
            }
            
            setTargetValue(val)
            setCustomDescription(`Searching for ${val}`)
            addLog(`Searching for value: ${val}`)
            
            let currId = rootId
            
            // Better: use a local clone like insertValueLogic does.
            let currentNodes = JSON.parse(JSON.stringify(resetNodes)) as TreeNode[] // Use resetNodes as base
            
            // Create Ghost Search Node
            const searchNode: TreeNode = { 
                id: generateId(), 
                value: val, 
                x: 0, y: 2, z: 0, 
                leftId: null, rightId: null, 
                color: '#ef4444' // Red
            }
            // Temporarily add it to list
            let nodesWithGhost = [...currentNodes, searchNode]
            setTree(nodesWithGhost, treeEdges, rootId)
            await new Promise(r => setTimeout(r, speed))

            while (currId) {
                const currIndex = currentNodes.findIndex(n => n.id === currId)
                if (currIndex === -1) break
                const curr = currentNodes[currIndex]
                
                // update search node position to compare
                searchNode.x = curr.x
                searchNode.y = curr.y + 0.5
                nodesWithGhost = [...currentNodes, searchNode]
                
                addLog(`Checking node ${curr.value}...`)
                
                // Highlight checking
                curr.color = '#eab308' 
                setTree(nodesWithGhost, treeEdges, rootId)
                await new Promise(r => setTimeout(r, speed))
    
                if (curr.value === val) {
                    addLog(`Found ${val}!`)
                    curr.color = '#22c55e'
                    // Remove Ghost
                    setTree([...currentNodes], treeEdges, rootId)
                    
                    setCustomDescription(`Found ${val}`)
                    await new Promise(r => setTimeout(r, speed * 2))
                    break
                } else if (val < curr.value) {
                    addLog(`${val} < ${curr.value}, going Left`)
                    curr.color = '#06b6d4'
                    currId = curr.leftId || null
                } else {
                     addLog(`${val} > ${curr.value}, going Right`)
                    curr.color = '#06b6d4'
                    currId = curr.rightId || null
                }
                 
                 if (!currId) {
                     addLog(`Value ${val} not found in tree.`)
                     setCustomDescription(`${val} not found`)
                     // Remove ghost
                     setTree([...currentNodes], treeEdges, rootId)
                     // Restore color
                     curr.color = '#06b6d4'
                 }
            }
        } else {
             // Insert Demo
             const val = Math.floor(Math.random() * 90) + 10
             setTargetValue(val)
             setCustomDescription(`Inserting ${val}`)
             addLog(`Inserting ${val}...`)
             
             await insertValueLogic(val)
             
             setCustomDescription(`Inserted ${val}`)
        }
        
        setIsPlaying(false)
        processingRef.current = false
        // setCustomDescription(null)
    }
    
    // Abstracted Insert Logic
    const insertValueLogic = async (val: number) => {
        // Clone current state deep enough
        let newNodes = JSON.parse(JSON.stringify(treeNodes)) as TreeNode[]
        let newEdges = JSON.parse(JSON.stringify(treeEdges)) as TreeEdge[]
        
        const newNode: TreeNode = { 
            id: generateId(), 
            value: val, 
            x: 0, y: 2, z: 0, // Start top
            leftId: null, rightId: null,
            color: '#eab308' // Yellow active
        }
        newNodes.push(newNode)
        setTree([...newNodes], [...newEdges], rootId)
        
        let currId = rootId

        if (!currId) {
            // New Root
             newNode.color = '#06b6d4'
             // Recalculate layout
             newNode.x = 0; newNode.y = 0;
             setTree([newNode], [], newNode.id)
             return
        }

        setCurrentLine(1) // Start Insert
        await new Promise(r => setTimeout(r, speed))

        // Traversal Loop
        while (currId) {
            const curr = newNodes.find(n => n.id === currId)!
             // addLog(`Comparing ${val} with ${curr.value}`)
            
            // Highlight current
            curr.color = '#ef4444' // Red comparing
            newNode.x = curr.x
            newNode.y = curr.y + 0.5 // Visualize "considering"
            setTree([...newNodes], [...newEdges], rootId)
            await new Promise(r => setTimeout(r, speed))

            if (val < curr.value) {
                // addLog(`Value ${val} < ${curr.value}, going Left`)
                setCurrentLine(2)
                
                 if (!curr.leftId) {
                    // addLog("Found empty spot! Inserting Left.")
                    curr.leftId = newNode.id
                    newEdges.push({ id: generateId(), source: curr.id, target: newNode.id })
                    
                    // Finalize Color
                    curr.color = '#06b6d4'
                    newNode.color = '#22c55e' // Green inserted
                    newNode.y = curr.y - 1.5 // Temp position before full layout
                    setTree([...newNodes], [...newEdges], rootId)
                    await new Promise(r => setTimeout(r, speed))
                    break
                 }
                
                curr.color = '#06b6d4' // Reset color
                currId = curr.leftId
            } else {
                // addLog(`Value ${val} >= ${curr.value}, going Right`)
                setCurrentLine(3)

                 if (!curr.rightId) {
                    // addLog("Found empty spot! Inserting Right.")
                    curr.rightId = newNode.id
                    newEdges.push({ id: generateId(), source: curr.id, target: newNode.id })
                    
                    // Finalize Color
                    curr.color = '#06b6d4'
                    newNode.color = '#22c55e'
                    newNode.y = curr.y - 1.5
                    setTree([...newNodes], [...newEdges], rootId)
                    await new Promise(r => setTimeout(r, speed))
                    break
                 }

                curr.color = '#06b6d4'
                currId = curr.rightId
            }
        }
        
        // Final Clean up & Layout
        newNode.color = '#06b6d4'
        const rootNode = newNodes.find(n => n.id === rootId)
        calculatePositions(rootNode || null, newNodes)
        setTree(newNodes, newEdges, rootId)
    }


    useEffect(() => {
        if (isPlaying) {
            runDemo()
        }
    }, [isPlaying])

    // Adjust position based on view mode
    // 2D: Camera looks at (0,5,0). Tree grows down. So Root at (0,8,0) puts root high.
    // 3D: Root at (0,2,0) or (0,4,0) is fine.
    const position: [number, number, number] = viewMode === '2d' ? [0, 8, 0] : [0, 2, 0]

    return <TreeComponent nodes={treeNodes} edges={treeEdges} position={position} />
}
