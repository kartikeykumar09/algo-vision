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
            {
                id: 'linear-search',
                name: 'Linear Search',
                description: 'Sequential checking.',
                complexity: 'O(n)',
                status: 'ready',
                learning: {
                    introduction: "Linear Search is the simplest searching algorithm that searches for an element in a list in sequential order. It starts at one end and goes through each element of the list until the desired element is found, otherwise the search continues till the end of the data set.",
                    complexityAnalysis: "Time Complexity: O(n) - In the worst case, we check every element. Space Complexity: O(1) - No extra space needed.",
                    codeExplanation: "Iterate from index 0 to n-1. If arr[i] matches the target value, return i. If the loop completes without finding the target, return -1.",
                    realWorldUses: [
                        "Searching in small or unsorted datasets.",
                        "When specific data structure is not known (works on any list).",
                        "Debugging verify contents of a collection manually."
                    ],
                    interviewNotes: {
                        stability: "N/A (Searching algorithm)",
                        inPlace: "Yes",
                        bestCase: "O(1) - Element found at first position.",
                        worstCase: "O(n) - Element found at last position or not present.",
                        keyTakeaway: "Simple but inefficient for large datasets. Doesn't require sorted data."
                    }
                }
            },
            {
                id: 'binary-search',
                name: 'Binary Search',
                description: 'Divide and conquer on sorted data.',
                complexity: 'O(log n)',
                status: 'ready',
                learning: {
                    introduction: "Binary Search is a search algorithm that finds the position of a target value within a sorted array. Binary search compares the target value to the middle element of the array. If they are not equal, the half in which the target cannot lie is eliminated and the search continues on the remaining half.",
                    complexityAnalysis: "Time Complexity: O(log n) - The search space is halved in every step. Space Complexity: O(1) iterative, O(log n) recursive stack.",
                    codeExplanation: "Set low=0, high=n-1. While low <= high: mid = (low+high)/2. If arr[mid] == target, return mid. If arr[mid] < target, low = mid + 1. Else high = mid - 1.",
                    realWorldUses: [
                        "Searching in databases (indexes are sorted/B-Trees).",
                        "Library implementation of search (e.g., standard library sets/maps).",
                        "Debugging (Git bisect uses binary search logic to find bug commit)."
                    ],
                    interviewNotes: {
                        stability: "N/A",
                        inPlace: "Yes",
                        bestCase: "O(1) - Element found at middle immediately.",
                        worstCase: "O(log n) - Element not found or at leaf level.",
                        keyTakeaway: "Lightning fast searching but STRICTLY requires sorted data. 30 steps to find item in 1 billion record array."
                    }
                }
            },
        ]
    },
    {
        id: 'trees',
        name: 'Tree Data Structures',
        icon: Trees,
        description: 'Hierarchical node-based structures.',
        gradient: 'from-green-500 to-emerald-500',
        algorithms: [
            {
                id: 'bst',
                name: 'Binary Search Tree',
                description: 'Ordered node placement.',
                complexity: 'O(log n)',
                status: 'ready',
                learning: {
                    introduction: "A Binary Search Tree (BST) is a binary tree data structure which has the following properties: The left subtree of a node contains only nodes with keys lesser than the node's key. The right subtree of a node contains only nodes with keys greater than the node's key. The left and right subtree each must also be a binary search tree.",
                    complexityAnalysis: "Time Complexity: O(log n) for Search, Insert, Delete on average. O(n) in worst case (skewed tree). Space Complexity: O(n).",
                    codeExplanation: "Insert(val): if root is null, create new node. Else if val < root.val, recurse left. Else recurse right.",
                    realWorldUses: [
                        "Implementing multilevel indexing in databases.",
                        "Dynamic sorting lists.",
                        "Evaluation of expressions (Expression Tree)."
                    ],
                    interviewNotes: {
                        stability: "N/A",
                        inPlace: "No",
                        bestCase: "O(log n) - Balanced Tree.",
                        worstCase: "O(n) - Degenerate (Linked List) Tree.",
                        keyTakeaway: "Great for ordered data and range queries. Performance degrades if not balanced (AVL/Red-Black fix this)."
                    }
                }
            },
            {
                id: 'avl',
                name: 'AVL Tree',
                description: 'Self-balancing BST.',
                complexity: 'O(log n)',
                status: 'ready',
                learning: {
                    introduction: "AVL tree is a self-balancing Binary Search Tree (BST) where the difference between heights of left and right subtrees cannot be more than one for all nodes. If the property is violated after an operation, rotations are performed to regain balance.",
                    complexityAnalysis: "Time Complexity: O(log n) for all operations (Search, Insert, Delete). guaranteed. Space Complexity: O(n).",
                    codeExplanation: "After insert/delete, check Balance Factor (Height(Left) - Height(Right)). If |BF| > 1, perform rotations (LL, RR, LR, RL) to balance.",
                    realWorldUses: [
                        "Databases where frequent lookups are required (guaranteed O(log n)).",
                        "Memory management subsystems.",
                        "Sets and Dictionaries in standard libraries."
                    ],
                    interviewNotes: {
                        stability: "N/A",
                        inPlace: "No",
                        bestCase: "O(log n)",
                        worstCase: "O(log n) - Strictly balanced.",
                        keyTakeaway: "First self-balancing BST invented. Guarantees logarithmic bounds but requires overhead of storing height and performing rotations."
                    }
                }
            },
            {
                id: 'traversals',
                name: 'Tree Traversals',
                description: 'BFS and DFS for trees.',
                complexity: 'O(n)',
                status: 'ready',
                learning: {
                    introduction: "Tree traversal is the process of visiting each node in the tree structure exactly once. The most common traversals are Inorder (Left-Root-Right), Preorder (Root-Left-Right), and Postorder (Left-Right-Root).",
                    complexityAnalysis: "Time Complexity: O(n) - We visit every node once. Space Complexity: O(h) - Stack depth where h is height of tree.",
                    codeExplanation: "Inorder: Traverse Left, Visit Root, Traverse Right. Preorder: Visit Root, Traverse Left, Traverse Right. Postorder: Traverse Left, Traverse Right, Visit Root.",
                    realWorldUses: [
                        "Inorder: Get sorted list from BST.",
                        "Preorder: Copying a tree structure.",
                        "Postorder: Deleting a tree (delete children before parent)."
                    ],
                    interviewNotes: {
                        stability: "N/A",
                        inPlace: "No (Stack space)",
                        bestCase: "O(n)",
                        worstCase: "O(n)",
                        keyTakeaway: "Inorder gives sorted data in BST. Preorder is good for structure replication. Postorder is good for cleanup."
                    }
                }
            },
        ]
    },
    {
        id: 'graphs',
        name: 'Graph Algorithms',
        icon: Network,
        description: 'Nodes and edges modeling relationships.',
        gradient: 'from-purple-500 to-pink-500',
        algorithms: [
            {
                id: 'bfs',
                name: 'Breadth-First Search',
                description: 'Level-by-level exploration.',
                complexity: 'O(V+E)',
                status: 'ready',
                learning: {
                    introduction: "Breadth-First Search (BFS) is a graph traversal algorithm that explores all the neighbor nodes at the present depth prior to moving on to the nodes at the next depth level.",
                    complexityAnalysis: "Time: O(V + E) where V is vertices and E is edges. Space: O(V) for the queue.",
                    codeExplanation: "Use a queue. Enqueue start node. While queue not empty, dequeue node, visit it, and enqueue all unvisited neighbors.",
                    realWorldUses: ["Shortest Path in unweighted graphs", "Peer-to-peer networks", "Social Networking (friends of friends)"],
                    interviewNotes: { stability: "N/A", inPlace: "No", bestCase: "O(1)", worstCase: "O(V+E)", keyTakeaway: "Best for finding shortest path in unweighted graphs." }
                }
            },
            {
                id: 'dfs',
                name: 'Depth-First Search',
                description: 'Deep branch exploration.',
                complexity: 'O(V+E)',
                status: 'ready',
                learning: {
                    introduction: "Depth-First Search (DFS) is an algorithm for traversing or searching tree or graph data structures. The algorithm starts at the root node and explores as far as possible along each branch before backtracking.",
                    complexityAnalysis: "Time: O(V + E). Space: O(V) for recursion stack.",
                    codeExplanation: "Recursive: Visit node, mark as visited. For each unvisited neighbor, recursively call DFS.",
                    realWorldUses: ["Topological Sorting", "Solving mazes", "Cycle detection"],
                    interviewNotes: { stability: "N/A", inPlace: "No", bestCase: "O(1)", worstCase: "O(V+E)", keyTakeaway: "Useful for pathfinding where solution is far from root, or for complete exploration." }
                }
            },
            {
                id: 'dijkstra',
                name: 'Dijkstra',
                description: 'Shortest path finding.',
                complexity: 'O(E log V)',
                status: 'ready',
                learning: {
                    introduction: "Dijkstra's algorithm is an algorithm for finding the shortest paths between nodes in a graph. It works by visiting nodes in the graph starting with the object's starting node.",
                    complexityAnalysis: "Time: O(E log V) with Priority Queue. Space: O(V).",
                    codeExplanation: "Init distances to infinity, start to 0. Use Min-Heap. Extract min distance node, relax edges to neighbors. Repeat.",
                    realWorldUses: ["GPS Navigation", "Network Routing Protocols (OSPF)", "flight connections"],
                    interviewNotes: { stability: "N/A", inPlace: "No", bestCase: "O(E)", worstCase: "O(E log V)", keyTakeaway: "Standard for shortest path in weighted graphs with non-negative weights." }
                }
            },
        ]
    },
    {
        id: 'linked-lists',
        name: 'Linked Lists',
        icon: GitGraph,
        description: 'Linear collections of connected nodes.',
        gradient: 'from-yellow-500 to-amber-500',
        algorithms: [
            {
                id: 'singly',
                name: 'Singly Linked List',
                description: 'One-way traversal.',
                complexity: 'O(1)',
                status: 'ready',
                learning: {
                    introduction: "A Singly Linked List is a linear data structure where distinct nodes are connected by a reference (or pointer) to the next node. The last node points to specific 'null' value.",
                    complexityAnalysis: "Access: O(n), Search: O(n), Insertion: O(1) (at head), Deletion: O(1) (at head).",
                    codeExplanation: "Node class has 'val' and 'next'. To traverse: curr = head; while(curr) { curr = curr.next }.",
                    realWorldUses: ["Implementation of stacks/queues", "Adjacency lists for graphs", "Undo functionality (history)"],
                    interviewNotes: { stability: "N/A", inPlace: "Yes", bestCase: "O(1)", worstCase: "O(n)", keyTakeaway: "Dynamic size, efficient insertion/deletion at start, but slow access." }
                }
            },
            {
                id: 'doubly',
                name: 'Doubly Linked List',
                description: 'Two-way traversal.',
                complexity: 'O(1)',
                status: 'ready',
                learning: {
                    introduction: "A Doubly Linked List node contains a pointer to both the next and the previous node, allowing traversal in specific both directions.",
                    complexityAnalysis: "Access: O(n), Search: O(n), Insertion/Deletion: O(1) (given the node).",
                    codeExplanation: "Node has 'val', 'next', 'prev'. Update both pointers when inserting/deleting.",
                    realWorldUses: ["Browser cache (LRU)", "Music playlist (next/prev)", "Text editor navigation"],
                    interviewNotes: { stability: "N/A", inPlace: "Yes", bestCase: "O(1)", worstCase: "O(n)", keyTakeaway: "More interaction flexibility than Singly LL at cost of extra memory for prev pointer." }
                }
            },
            {
                id: 'reversal',
                name: 'List Reversal',
                description: 'Inverting connections.',
                complexity: 'O(n)',
                status: 'ready',
                learning: {
                    introduction: "Reversing a Linked List involves changing the direction of pointers so that the last node becomes the head and the first node becomes the last.",
                    complexityAnalysis: "Time: O(n). Space: O(1) iterative, O(n) recursive.",
                    codeExplanation: "Iterative: prev = null, curr = head. Loop: temp = curr.next; curr.next = prev; prev = curr; curr = temp. Return prev.",
                    realWorldUses: ["Reversing data streams", "Undo operations", "Base for palindrome check"],
                    interviewNotes: { stability: "N/A", inPlace: "Yes", bestCase: "O(n)", worstCase: "O(n)", keyTakeaway: "Classic interview problem. Master the 3-pointer iterative approach." }
                }
            },
        ]
    },
    {
        id: 'dp',
        name: 'Dynamic Programming',
        icon: Layers,
        description: 'Breaking problems into subproblems.',
        gradient: 'from-indigo-500 to-violet-500',
        algorithms: [
            {
                id: 'fibonacci',
                name: 'Fibonacci',
                description: 'Memoization vs Tabulation.',
                complexity: 'O(n)',
                status: 'ready',
                learning: {
                    introduction: "The Fibonacci sequence is a set of numbers where each number is the sum of the two preceding ones, usually starting with 0 and 1. Dynamic Programming optimizes this by storing results of subproblems.",
                    complexityAnalysis: "Time: O(n) - We calculate each number once. Space: O(n) for the table (can be optimized to O(1) space).",
                    codeExplanation: "dp[0] = 0; dp[1] = 1;\nfor (i = 2; i <= n; i++) {\n  dp[i] = dp[i-1] + dp[i-2];\n}",
                    realWorldUses: ["Financial modeling", "Search algorithms (Fibonacci search)", "Nature patterns (population growth)"],
                    interviewNotes: { stability: "N/A", inPlace: "N/A", bestCase: "O(n)", worstCase: "O(n)", keyTakeaway: "Classic example of moving from Recursion (O(2^n)) to DP (O(n))." }
                }
            },
            {
                id: 'knapsack',
                name: '0/1 Knapsack',
                description: 'Optimization problem.',
                complexity: 'O(nW)',
                status: 'ready',
                learning: {
                    introduction: "Given a set of items, each with a weight and a value, determine the number of each item to include in a collection so that the total weight is less than or equal to a given limit and the total value is as large as possible.",
                    complexityAnalysis: "Time: O(n*W) where n is number of items and W is capacity. Space: O(n*W) 2D table.",
                    codeExplanation: "if (wt[i] <= w) {\n  dp[i][w] = max(val[i] + dp[i-1][w-wt], dp[i-1][w]);\n} else {\n  dp[i][w] = dp[i-1][w];\n}",
                    realWorldUses: ["Resource allocation", "Budget management", "Cargo loading"],
                    interviewNotes: { stability: "N/A", inPlace: "N/A", bestCase: "O(nW)", worstCase: "O(nW)", keyTakeaway: "Understand the recurrence relation: Include item vs Exclude item." }
                }
            },
        ]
    }
]
