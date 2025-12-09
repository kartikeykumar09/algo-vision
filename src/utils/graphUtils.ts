import { type TreeNode, generateId } from '@/store/useAlgoStore'

export const generateGraphData = (nodeCount: number, weighted: boolean = false) => {
    const nodes: TreeNode[] = []

    // Circular Layout
    // This is cleaner for small graphs and guarantees no node overlap
    const radius = 3
    const angleStep = (2 * Math.PI) / nodeCount

    // Assign nodes to circle positions
    for (let i = 0; i < nodeCount; i++) {
        const angle = i * angleStep - Math.PI / 2 // Start from top (-90 deg)
        nodes.push({
            id: generateId(),
            value: i,
            x: radius * Math.cos(angle),
            y: radius * Math.sin(angle), // Centered vertically
            z: 0,
            color: '#06b6d4'
        })
    }

    // Edges
    const edges: any[] = []
    const edgeSet = new Set<string>()

    // ensure connectivity (spanning tree)
    // Connect node i to a random existing node 0..i-1
    // But to make it look more "graph-like" and less "tree-like" linearly,
    // we can try to connect to nearest neighbors, but random is fine for connectivity.
    // Let's stick to the random parent for connectivity first.
    for (let i = 1; i < nodeCount; i++) {
        // Prefer closer nodes to avoid long cross-graph edges? 
        // Simple heuristic: pick a random node from 0..i-1, but prefer one that is physically close?
        // For now, random existing node is robust for connectivity.

        // Let's pick 2 candidates from visited set and pick whichever is closer?
        // Or simpler: just random for now, since visual clutter is mainly node overlap.
        const target = Math.floor(Math.random() * i)

        const sourceId = nodes[i].id
        const targetId = nodes[target].id

        const weight = weighted ? Math.floor(Math.random() * 9) + 1 : undefined

        edges.push({ id: generateId(), source: sourceId, target: targetId, weight })
        edgeSet.add(`${sourceId}-${targetId}`)
        edgeSet.add(`${targetId}-${sourceId}`)
    }

    // Add extra edges
    const extraEdges = Math.floor(nodeCount * 0.5) // ~50% more edges
    let attempts = 0
    let added = 0
    while (added < extraEdges && attempts < 50) {
        attempts++
        const u = Math.floor(Math.random() * nodeCount)
        const v = Math.floor(Math.random() * nodeCount)

        if (u === v) continue

        const uId = nodes[u].id
        const vId = nodes[v].id

        // Check distance to avoid super long messy lines
        const distSq = Math.pow(nodes[u].x - nodes[v].x, 2) + Math.pow(nodes[u].y - nodes[v].y, 2)
        if (distSq > 16) continue // Limit max edge length roughly

        if (!edgeSet.has(`${uId}-${vId}`)) {
            const weight = weighted ? Math.floor(Math.random() * 9) + 1 : undefined
            edges.push({ id: generateId(), source: uId, target: vId, weight })
            edgeSet.add(`${uId}-${vId}`)
            edgeSet.add(`${vId}-${uId}`)
            added++
        }
    }

    return { nodes, edges }
}
