import { Text, Sphere, Line } from '@react-three/drei'
import type { TreeNode, TreeEdge } from '@/store/useAlgoStore'

export const TreeComponent = ({ nodes, edges, position = [0, 2, 0] }: { nodes: TreeNode[], edges: TreeEdge[], position?: [number, number, number] }) => {
    return (
        <group position={position}> {/* Shift up so root is visible */}
             {/* Render Edges */}
             {edges.map(edge => {
                const source = nodes.find(n => n.id === edge.source)
                const target = nodes.find(n => n.id === edge.target)
                if (!source || !target) return null
                
                return (
                    <Line
                        key={edge.id}
                        points={[
                            [source.x, source.y, source.z],
                            [target.x, target.y, target.z]
                        ]}
                        color={edge.color || '#475569'}
                        lineWidth={2}
                    />
                )
             })}

             {/* Render Nodes */}
             {nodes.map(node => (
                 <group key={node.id} position={[node.x, node.y, node.z]}>
                    <Sphere args={[0.4, 32, 32]}>
                        <meshStandardMaterial color={node.color || '#06b6d4'} roughness={0.3} metalness={0.8} />
                    </Sphere>
                    <Text
                        position={[0, 0, 0.45]}
                        fontSize={0.3}
                        color="white"
                        anchorX="center"
                        anchorY="middle"
                        outlineWidth={0.02}
                        outlineColor="black"
                    >
                        {node.value}
                    </Text>
                 </group>
             ))}
        </group>
    )
}
