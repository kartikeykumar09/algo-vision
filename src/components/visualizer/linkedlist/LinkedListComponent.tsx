import { Text, Sphere } from '@react-three/drei'
import * as THREE from 'three'
import type { TreeNode, TreeEdge } from '@/store/useAlgoStore'

// A dedicated arrow component
const Arrow = ({ start, end, color = '#475569', offset = 0 }: { start: THREE.Vector3, end: THREE.Vector3, color?: string, offset?: number }) => {
    const direction = new THREE.Vector3().subVectors(end, start).normalize()
    const length = start.distanceTo(end)
    
    // Calculate perpendicular offset vector
    // Standard up is (0,1,0). Right = Dir x Up.
    const up = new THREE.Vector3(0, 1, 0)
    const right = new THREE.Vector3().crossVectors(direction, up).normalize()
    const offsetVec = right.multiplyScalar(offset)
    
    const adjustedStart = start.clone().add(offsetVec)

    // Node radius is 0.35. We want the arrow to start outside source and end outside target.
    const padding = 0.45
    const visibleLength = length - (2 * padding)
    
    if (visibleLength <= 0) return null


    
    // Orientation
    const quaternion = new THREE.Quaternion()
    // We need quaternion to rotate (0,1,0) to direction
    // Wait, cylinder is Y-aligned?
    // Cone is Y-aligned.
    // So we align Y axis to 'direction'.
    quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction)

    const arrowHeadHeight = 0.3
    const arrowBodyHeight = visibleLength - arrowHeadHeight

    return (
        <group position={adjustedStart.clone().add(direction.clone().multiplyScalar(padding))}>
             <group position={[0, 0, 0]} quaternion={quaternion}>
                 <mesh position={[0, arrowBodyHeight / 2, 0]}>
                     <cylinderGeometry args={[0.03, 0.03, arrowBodyHeight, 8]} />
                     <meshStandardMaterial color={color} />
                 </mesh>
                 <mesh position={[0, arrowBodyHeight + arrowHeadHeight / 2, 0]}>
                     <coneGeometry args={[0.08, arrowHeadHeight, 16]} />
                     <meshStandardMaterial color={color} />
                 </mesh>
             </group>
        </group>
    )
}

export const LinkedListComponent = ({ nodes, edges }: { nodes: TreeNode[], edges: TreeEdge[] }) => {
    return (
        <group>
             {/* Nodes */}
             {nodes.map(node => (
                 <group key={node.id} position={[node.x, node.y, node.z]}>
                    <Sphere args={[0.35, 32, 32]}>
                        <meshStandardMaterial color={node.color || '#06b6d4'} roughness={0.3} metalness={0.8} />
                    </Sphere>
                    <Text
                        position={[0, 0, 0.4]}
                        fontSize={0.25}
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

             {/* Edges (Arrows) */}
             {edges.map(edge => {
                const source = nodes.find(n => n.id === edge.source)
                const target = nodes.find(n => n.id === edge.target)
                if (!source || !target) return null
                
                // Keep visually separate if bidirectional
                const isBidirectional = edges.some(e => e.source === edge.target && e.target === edge.source)
                const offset = isBidirectional ? 0.15 : 0 
                
                return (
                    <Arrow 
                        key={edge.id}
                        start={new THREE.Vector3(source.x, source.y, source.z)}
                        end={new THREE.Vector3(target.x, target.y, target.z)}
                        color={edge.color || '#64748b'}
                        offset={offset}
                    />
                )
             })}
        </group>
    )
}
