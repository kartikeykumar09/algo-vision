import { Text, Sphere, Line } from '@react-three/drei'
import type { TreeNode, TreeEdge } from '@/store/useAlgoStore'

export const GraphComponent = ({ nodes, edges, position = [0, 0, 0] }: { nodes: TreeNode[], edges: TreeEdge[], position?: [number, number, number] }) => {
    return (
        <group position={position}>
             {/* Render Edges */}
             {edges.map(edge => {
                const source = nodes.find(n => n.id === edge.source)
                const target = nodes.find(n => n.id === edge.target)
                if (!source || !target) return null
                
                const midX = (source.x + target.x) / 2
                const midY = (source.y + target.y) / 2
                const midZ = (source.z + target.z) / 2

                return (
                    <group key={edge.id}>
                        <Line
                            points={[
                                [source.x, source.y, source.z],
                                [target.x, target.y, target.z]
                            ]}
                            color={edge.color || '#475569'}
                            lineWidth={3}
                        />
                        {edge.weight !== undefined && (
                            <Text
                                position={[midX, midY + 0.3, midZ]}
                                fontSize={0.25}
                                color="#fdba74"
                                anchorX="center"
                                anchorY="middle"
                                outlineWidth={0.02}
                                outlineColor="black"
                            >
                                {edge.weight}
                            </Text>
                        )}
                    </group>
                )
             })}

             {/* Render Nodes */}
             {nodes.map(node => (
                 <group key={node.id} position={[node.x, node.y, node.z]}>
                    <Sphere args={[0.35, 32, 32]}>
                        <meshStandardMaterial color={node.color || '#06b6d4'} roughness={0.3} metalness={0.8} />
                    </Sphere>
                    <Text
                        position={[0, 0, 0.4]}
                        fontSize={0.28}
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
