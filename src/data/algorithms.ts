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
            {
                id: 'quick-sort',
                name: 'Quick Sort',
                description: 'Divide and conquer partitioning.',
                complexity: 'O(n log n)',
                status: 'ready',
                learning: {
                    introduction: "Quick Sort is a highly efficient sorting algorithm and is based on partitioning of array of data into smaller arrays. A large array is partitioned into two arrays one of which holds values smaller than the specified value, say pivot, based on which the partition is made and another array holds values greater than the pivot value.",
                    complexityAnalysis: "On average, it takes O(n log n) time. In the worst case (when the array is already sorted and the pivot is always the smallest or largest element), it takes O(n²). However, with random pivoting, the worst case is extremely rare.",
                    codeExplanation: "We select a 'pivot' element. We traverse the array: elements smaller than the pivot go to the left, larger to the right. We then recursively apply this to the sub-arrays.",
                    realWorldUses: [
                        "Sorting large datasets efficiently.",
                        "Used in many standard libraries (e.g., C++ std::sort, Java Arrays.sort for primitives).",
                        "Systems where average-case performance matters more than worst-case."
                    ],
                    interviewNotes: {
                        stability: "Unstable (swapping logic disrupts relative order).",
                        inPlace: "Yes (only requires O(log n) stack space for recursion).",
                        bestCase: "O(n log n) - When pivot partitions array into equal halves.",
                        worstCase: "O(n²) - When pivot is always the smallest/largest element.",
                        keyTakeaway: "Most widely used general-purpose sorting algorithm due to good locality of reference and cache performance."
                    }
                }
            },
            {
                id: 'merge-sort',
                name: 'Merge Sort',
                description: 'Recursive splitting and merging.',
                complexity: 'O(n log n)',
                status: 'ready',
                learning: {
                    introduction: "Merge Sort is a Divide and Conquer algorithm. It divides the input array into two halves, calls itself for the two halves, and then merges the two sorted halves. It requires extra space for the merging process but guarantees O(n log n) performance.",
                    complexityAnalysis: "It always divides the array into two halves and takes linear time to merge two halves. Thus, T(n) = 2T(n/2) + Θ(n), which solves to Θ(n log n) in all 3 cases (worst, average and best).",
                    codeExplanation: "We recursively divide the array until one element remains. Then, we merge sub-arrays by comparing elements and placing them into a temporary array in sorted order, finally copying back to the original array.",
                    realWorldUses: [
                        "Sorting Linked Lists (does not require random access).",
                        "External Sorting (when data is too large to fit in memory).",
                        "Inversion Count problem."
                    ],
                    interviewNotes: {
                        stability: "Stable (preserves the relative order of equal elements).",
                        inPlace: "No (requires O(n) auxiliary space).",
                        bestCase: "O(n log n)",
                        worstCase: "O(n log n)",
                        keyTakeaway: "Reliable and predictable performance regardless of input. Preferred for Linked Lists and massive datasets."
                    }
                }
            },
            {
                id: 'insertion-sort',
                name: 'Insertion Sort',
                description: 'Building sorted array item by item.',
                complexity: 'O(n²)',
                status: 'ready',
                learning: {
                    introduction: "Insertion Sort builds the final sorted array (or list) one item at a time. It is much less efficient on large lists than more advanced algorithms such as quicksort, heapsort, or merge sort. However, it is simple and efficient for small data sets.",
                    complexityAnalysis: "Time Complexity: O(n²) in worse/average case, but O(n) in best case (already sorted). Space Complexity: O(1) as it sorts in-place.",
                    codeExplanation: "Iterate from arr[1] to arr[n]. Compare the current element (key) to its predecessor. If the key element is smaller than its predecessor, compare it to the elements before. Move the greater elements one position up to make space for the swapped element.",
                    realWorldUses: [
                        "Sorting small arrays (often used as the base case for Quick Sort/Merge Sort).",
                        "Sorting data is that is continuously being received (online sorting).",
                        "When the array is already substantially sorted."
                    ],
                    interviewNotes: {
                        stability: "Stable (does not change the relative order of elements with equal keys).",
                        inPlace: "Yes (requires only a constant amount O(1) of additional memory space).",
                        bestCase: "O(n) - When array is already sorted.",
                        worstCase: "O(n²) - When array is sorted in reverse order.",
                        keyTakeaway: "Efficient for small or nearly sorted datasets. Adaptive nature makes it useful in hybrid sorting algorithms."
                    }
                }
            },
            {
                id: 'selection-sort',
                name: 'Selection Sort',
                description: 'Finding minimums repeatedly.',
                complexity: 'O(n²)',
                status: 'ready',
                learning: {
                    introduction: "Selection Sort algorithm sorts an array by repeatedly finding the minimum element (considering ascending order) from unsorted part and putting it at the beginning. The algorithm maintains two subarrays in a given array: the subarray which is already sorted, and remaining subarray which is unsorted.",
                    complexityAnalysis: "Time Complexity: O(n²) as there are two nested loops. Space Complexity: O(1) auxiliary space.",
                    codeExplanation: "Repeat (n-1) times: Find the minimum element in the unsorted sub-array. Swap the found minimum element with the first element of the unsorted sub-array. Move the boundary of sorted sub-array one element to the right.",
                    realWorldUses: [
                        "When memory is extremely constrained (it makes the minimum possible number of swaps, O(n)).",
                        "Flash memory (where writes are expensive - Selection sort minimizes writes/swaps)."
                    ],
                    interviewNotes: {
                        stability: "Unstable (standard implementation swaps non-adjacent elements).",
                        inPlace: "Yes (requires O(1) extra space).",
                        bestCase: "O(n²)",
                        worstCase: "O(n²)",
                        keyTakeaway: "Not efficient for large lists. Primary advantage is that it performs the minimum number of swaps (O(n)) among all sorting algorithms."
                    }
                }
            },
            {
                id: 'heap-sort',
                name: 'Heap Sort',
                description: 'Using a binary heap to sort.',
                complexity: 'O(n log n)',
                status: 'ready',
                learning: {
                    introduction: "Heap Sort is a comparison-based sorting technique based on Binary Heap data structure. It is similar to selection sort where we first find the maximum element and place the maximum element at the end. We repeat the same process for the remaining elements.",
                    complexityAnalysis: "Time Complexity: O(n log n) - Building the heap takes O(n), and extracting n elements takes O(n log n). Space Complexity: O(1) implementation is possible.",
                    codeExplanation: "Build a max heap from the input data. At this point, the largest item is stored at the root of the heap. Replace it with the last item of the heap followed by reducing the size of heap by 1. finally, heapify the root of the tree.",
                    realWorldUses: [
                        "Systems with critical memory constraints (unlike Merge Sort, it's O(1) space).",
                        "Real-time systems where O(n log n) worst-case guarantee is required (typically safer than Quick Sort's potential O(n²))."
                    ],
                    interviewNotes: {
                        stability: "Unstable (swapping elements within the heap disrupts order).",
                        inPlace: "Yes (O(1) extra space).",
                        bestCase: "O(n log n)",
                        worstCase: "O(n log n)",
                        keyTakeaway: "Excellent worst-case performance guarantees and memory efficiency, but typically slower than Quick Sort in practice due to poor cache locality."
                    }
                }
            },
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
