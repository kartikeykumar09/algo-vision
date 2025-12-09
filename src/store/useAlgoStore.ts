import { create } from 'zustand'
import type { Algorithm } from '@/data/algorithms'

// Simple ID generator if uuid is too heavy/not installed
const generateId = () => Math.random().toString(36).substr(2, 9)

export interface ArrayItem {
    id: string
    value: number
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
}

export const useAlgoStore = create<AlgoState>((set) => ({
    // Initial State
    view: 'dashboard',
    viewMode: '3d',
    currentAlgorithm: null,

    array: [],
    comparing: [],
    swapping: [],
    sortedIndices: [],
    isPlaying: false,
    isSorted: false,
    speed: 500,

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
    selectAlgorithm: (algo) => set({
        currentAlgorithm: algo,
        view: algo ? 'visualizer' : 'dashboard' // Auto switch
    }),

    generateArray: (size = 10) => {
        const newArray = Array.from({ length: size }, () => ({
            id: generateId(),
            value: Math.floor(Math.random() * 15) + 3 // Height 3 to 18
        }))
        set({
            array: newArray,
            comparing: [],
            swapping: [],
            sortedIndices: [],
            isSorted: false,
            isPlaying: false,
            stats: { comparisons: 0, swaps: 0, operations: 0 },
            currentLine: null,
            logs: []
        })
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
            logs: []
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
