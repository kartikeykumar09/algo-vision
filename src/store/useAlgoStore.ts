
import { create } from 'zustand'
import type { Algorithm } from '@/data/algorithms'

// Helper for random IDs
export const generateId = () => Math.random().toString(36).substr(2, 9)

export type ArrayItem = {
    id: string
    value: number
    color?: string
}

interface AlgoState {
    // Navigation State
    view: 'dashboard' | 'visualizer'
    viewMode: '2d' | '3d'
    currentAlgorithm: Algorithm | null

    // Visualization State
    array: ArrayItem[]
    comparing: number[] // indices
    swapping: number[] // indices
    sortedIndices: number[] // indices
    isPlaying: boolean
    isSorted: boolean
    speed: number

    // Stats
    stats: {
        comparisons: number
        swaps: number
        operations: number
    }

    // Code Visualization
    currentLine: number | null

    // Logs
    logs: string[]

    // Searching State
    targetValue: number | null
    foundIndex: number | null
    setTargetValue: (val: number | null) => void
    setFoundIndex: (index: number | null) => void

    // Tree State
    treeNodes: TreeNode[]
    treeEdges: TreeEdge[]
    rootId: string | null
    setTree: (nodes: TreeNode[], edges: TreeEdge[], rootId: string | null) => void
    resetTree: () => void

    // Shared
    generationId: number
    setCustomDescription: (desc: string | null) => void
    customDescription: string | null

    // Actions
    setView: (view: 'dashboard' | 'visualizer') => void
    setViewMode: (mode: '2d' | '3d') => void
    selectAlgorithm: (algo: Algorithm | null) => void

    generateArray: (size?: number) => void
    setArray: (array: ArrayItem[]) => void
    setComparing: (indices: number[]) => void
    setSwapping: (indices: number[]) => void
    setSortedIndices: (indices: number[] | ((prev: number[]) => number[])) => void
    setIsPlaying: (playing: boolean) => void
    reset: () => void

    // New Actions
    incrementComparisons: () => void
    incrementSwaps: () => void
    incrementOperations: () => void
    setCurrentLine: (line: number | null) => void
    addLog: (message: string) => void
    setSpeed: (speed: number) => void
}

export type TreeNode = {
    id: string
    value: number
    x: number
    y: number
    z: number // For 3D but we might stick to 2D plane in 3D
    color?: string
    // Binary Tree specific helpers (not strictly state, but helpful)
    leftId?: string | null
    rightId?: string | null
    height?: number // For AVL
}

export type TreeEdge = {
    id: string
    source: string
    target: string
    color?: string
    weight?: number
}

export const useAlgoStore = create<AlgoState>((set) => ({
    // Initial State
    view: 'dashboard',
    viewMode: '2d',
    currentAlgorithm: null,

    array: [],
    comparing: [],
    swapping: [],
    sortedIndices: [],
    isPlaying: false,
    isSorted: false,
    speed: 500,

    // Search Init
    targetValue: null,
    foundIndex: null,

    // Tree Init
    treeNodes: [],
    treeEdges: [],
    rootId: null,

    // Shared
    generationId: 0,
    customDescription: null,

    stats: {
        comparisons: 0,
        swaps: 0,
        operations: 0
    },

    currentLine: null,
    logs: [],

    // Actions
    setView: (view) => set({ view }),
    setViewMode: (mode) => set({ viewMode: mode }),
    setSpeed: (speed) => set({ speed }),
    selectAlgorithm: (algo) => set({
        currentAlgorithm: algo,
        view: algo ? 'visualizer' : 'dashboard',
        customDescription: null // Reset on algo change
    }),

    setTargetValue: (val) => set({ targetValue: val }),
    setFoundIndex: (idx) => set({ foundIndex: idx }),
    setCustomDescription: (desc) => set({ customDescription: desc }),

    setTree: (nodes, edges, rootId) => set({ treeNodes: nodes, treeEdges: edges, rootId }),
    resetTree: () => set({ treeNodes: [], treeEdges: [], rootId: null }),

    generateArray: (size = 10) => {
        const newArray = Array.from({ length: size }, () => ({
            id: generateId(),
            value: Math.floor(Math.random() * 15) + 3 // Height 3 to 18
        }))
        set((state) => ({
            array: newArray,
            comparing: [],
            swapping: [],
            sortedIndices: [],
            isSorted: false,
            isPlaying: false,
            stats: { comparisons: 0, swaps: 0, operations: 0 },
            currentLine: null,
            logs: [],
            targetValue: null, // Reset Search
            foundIndex: null,
            // Reset Tree but trigger regeneration via ID
            treeNodes: [],
            treeEdges: [],
            rootId: null,
            generationId: state.generationId + 1,
            customDescription: null
        }))
    },

    setArray: (array) => set({ array }),
    setComparing: (comparing) => set({ comparing }),
    setSwapping: (swapping) => set({ swapping }),
    setSortedIndices: (update) => set((state) => ({
        sortedIndices: typeof update === 'function' ? update(state.sortedIndices) : update
    })),
    setIsPlaying: (isPlaying) => set({ isPlaying }),

    reset: () => set(() => {
        // Keep array, reset status
        return {
            comparing: [],
            swapping: [],
            sortedIndices: [],
            isSorted: false,
            isPlaying: false,
            stats: { comparisons: 0, swaps: 0, operations: 0 },
            currentLine: null,
            logs: [],
            targetValue: null,
            foundIndex: null,
            // Tree
            treeNodes: [],
            treeEdges: [],
            rootId: null
        }
    }),

    incrementComparisons: () => set((state) => ({
        stats: { ...state.stats, comparisons: state.stats.comparisons + 1, operations: state.stats.operations + 1 }
    })),
    incrementSwaps: () => set((state) => ({
        stats: { ...state.stats, swaps: state.stats.swaps + 1, operations: state.stats.operations + 1 }
    })),
    incrementOperations: () => set((state) => ({
        stats: { ...state.stats, operations: state.stats.operations + 1 }
    })),
    setCurrentLine: (line) => set({ currentLine: line }),
    addLog: (message) => set((state) => ({ logs: [message, ...state.logs].slice(0, 50) })) // Keep recent 50 logs
}))
