import { Binary, GitGraph, Layers, Network, Shuffle, Trees } from "lucide-react"

export type AlgorithmId = string
export type CategoryId = string

export interface LearningContent {
    introduction: string
    complexityAnalysis: string
    codeExplanation: string
    realWorldUses: string[]
    interviewNotes: {
        stability: string
        inPlace: string
        bestCase: string
        worstCase: string
        keyTakeaway: string
    }
}

export interface Algorithm {
    id: AlgorithmId
    name: string
    description: string
    complexity: string // Time complexity
    status: 'ready' | 'coming-soon'
    learning?: LearningContent
}

export interface Category {
    id: CategoryId
    name: string
    icon: any
    description: string
    gradient: string
    algorithms: Algorithm[]
}

export const ALGOS: Category[] = [
    {
        id: 'sorting',
        name: 'Sorting Algorithms',
        icon: Shuffle,
        description: 'Visualizing how data updates and moves into order.',
        gradient: 'from-orange-500 to-red-500',
        algorithms: [
            {
                id: 'bubble-sort',
                name: 'Bubble Sort',
                description: 'Simple adjacent swapping.',
                complexity: 'O(n²)',
                status: 'ready',
                learning: {
                    introduction: "Bubble Sort works by repeatedly stepping through the list, comparing adjacent elements and swapping them if they are in the wrong order. The pass through the list is repeated until the list is sorted.",
                    complexityAnalysis: "Nested loops result in O(n²) comparisons. In the worst case (reverse order), we also perform O(n²) swaps. This makes it impractical for large datasets.",
                    codeExplanation: "The outer loop tracks the number of sorted elements at the end. The inner loop performs the 'bubbling' comparisons and swaps.",
                    realWorldUses: [
                        "Educational tool (easy to understand).",
                        "Computer graphics (detecting small errors in polygon sorting).",
                        "Simple checks for 'mostly sorted' data (O(n) check)."
                    ],
                    interviewNotes: {
                        stability: "Stable (does not swap equal elements).",
                        inPlace: "Yes (only requires O(1) auxiliary space).",
                        bestCase: "O(n) - When array is already sorted (with optimized flag).",
                        worstCase: "O(n²) - When array is reverse sorted.",
                        keyTakeaway: "Easiest to implement, but rarely used in production due to O(n²) performance. Replaced by QuickSort/MergeSort."
                    }
                }
            },
            { id: 'quick-sort', name: 'Quick Sort', description: 'Divide and conquer partitioning.', complexity: 'O(n log n)', status: 'coming-soon' },
            { id: 'merge-sort', name: 'Merge Sort', description: 'Recursive splitting and merging.', complexity: 'O(n log n)', status: 'coming-soon' },
            { id: 'insertion-sort', name: 'Insertion Sort', description: 'Building sorted array item by item.', complexity: 'O(n²)', status: 'coming-soon' },
            { id: 'selection-sort', name: 'Selection Sort', description: 'Finding minimums repeatedly.', complexity: 'O(n²)', status: 'coming-soon' },
            { id: 'heap-sort', name: 'Heap Sort', description: 'Using a binary heap to sort.', complexity: 'O(n log n)', status: 'coming-soon' },
        ]
    },
    {
        id: 'searching',
        name: 'Searching Algorithms',
        icon: Binary,
        description: 'Finding specific elements within data structures.',
        gradient: 'from-blue-500 to-cyan-500',
        algorithms: [
            { id: 'linear-search', name: 'Linear Search', description: 'Sequential checking.', complexity: 'O(n)', status: 'coming-soon' },
            { id: 'binary-search', name: 'Binary Search', description: 'Divide and conquer on sorted data.', complexity: 'O(log n)', status: 'coming-soon' },
        ]
    },
    {
        id: 'trees',
        name: 'Tree Data Structures',
        icon: Trees,
        description: 'Hierarchical node-based structures.',
        gradient: 'from-green-500 to-emerald-500',
        algorithms: [
            { id: 'bst', name: 'Binary Search Tree', description: 'Ordered node placement.', complexity: 'O(log n)', status: 'coming-soon' },
            { id: 'avl', name: 'AVL Tree', description: 'Self-balancing BST.', complexity: 'O(log n)', status: 'coming-soon' },
            { id: 'traversals', name: 'Tree Traversals', description: 'BFS and DFS for trees.', complexity: 'O(n)', status: 'coming-soon' },
        ]
    },
    {
        id: 'graphs',
        name: 'Graph Algorithms',
        icon: Network,
        description: 'Nodes and edges modeling relationships.',
        gradient: 'from-purple-500 to-pink-500',
        algorithms: [
            { id: 'bfs', name: 'Breadth-First Search', description: 'Level-by-level exploration.', complexity: 'O(V+E)', status: 'coming-soon' },
            { id: 'dfs', name: 'Depth-First Search', description: 'Deep branch exploration.', complexity: 'O(V+E)', status: 'coming-soon' },
            { id: 'dijkstra', name: 'Dijkstra', description: 'Shortest path finding.', complexity: 'O(E log V)', status: 'coming-soon' },
        ]
    },
    {
        id: 'linked-lists',
        name: 'Linked Lists',
        icon: GitGraph,
        description: 'Linear collections of connected nodes.',
        gradient: 'from-yellow-500 to-amber-500',
        algorithms: [
            { id: 'singly', name: 'Singly Linked List', description: 'One-way traversal.', complexity: 'O(1)', status: 'coming-soon' },
            { id: 'doubly', name: 'Doubly Linked List', description: 'Two-way traversal.', complexity: 'O(1)', status: 'coming-soon' },
            { id: 'reversal', name: 'List Reversal', description: 'Inverting connections.', complexity: 'O(n)', status: 'coming-soon' },
        ]
    },
    {
        id: 'dp',
        name: 'Dynamic Programming',
        icon: Layers,
        description: 'Breaking problems into subproblems.',
        gradient: 'from-indigo-500 to-violet-500',
        algorithms: [
            { id: 'fibonacci', name: 'Fibonacci', description: 'Memoization vs Tabulation.', complexity: 'O(n)', status: 'coming-soon' },
            { id: 'knapsack', name: '0/1 Knapsack', description: 'Optimization problem.', complexity: 'O(nW)', status: 'coming-soon' },
        ]
    }
]
