import { Text } from '@react-three/drei'
import * as THREE from 'three'

interface DPCellProps {
    value: number | string | null
    x: number
    y: number
    color?: string
}

const DPCell = ({ value, x, y, color = '#334155' }: DPCellProps) => {
    return (
        <group position={[x, y, 0]}>
            <mesh>
                 <boxGeometry args={[0.9, 0.9, 0.2]} />
                 <meshStandardMaterial color={color} roughness={0.3} metalness={0.6} />
                 {/* Wireframe border */}
                 <lineSegments>
                    <edgesGeometry args={[new THREE.BoxGeometry(0.9, 0.9, 0.2)]} />
                    <lineBasicMaterial color="black" opacity={0.5} transparent />
                 </lineSegments>
            </mesh>
            <Text
                position={[0, 0, 0.11]}
                fontSize={0.35}
                color="white"
                anchorX="center"
                anchorY="middle"
            >
                {value !== null ? value : ''}
            </Text>
        </group>
    )
}

interface DPGridProps {
    data: (number | string | null)[][] 
    activeCell?: { r: number, c: number } | null
    compareCells?: { r: number, c: number }[]
    labels?: { rowLabels?: string[], colLabels?: string[] }
}

export const DPGrid = ({ data, activeCell, compareCells = [], labels }: DPGridProps) => {
    const rows = data.length
    const cols = data[0]?.length || 0
    const spacing = 1.05
    
    // Center the grid
    const totalWidth = cols * spacing
    const totalHeight = rows * spacing
    
    const startX = -totalWidth / 2 + spacing / 2
    const startY = totalHeight / 2 - spacing / 2

    return (
        <group>
            {data.map((row, r) => 
                row.map((val, c) => {
                    const isActive = activeCell?.r === r && activeCell?.c === c
                    const isCompare = compareCells.some(cell => cell.r === r && cell.c === c)
                    
                    let color = '#1e293b' // Dark Slate (Empty/Default)
                    
                    if (isActive) color = '#eab308' // Yellow (Active)
                    else if (isCompare) color = '#0ea5e9' // Blue (Comparing/Reference)
                    else if (val !== null && val !== '') color = '#22c55e' // Green (Filled)
                    
                    return (
                         <DPCell 
                            key={`${r}-${c}`}
                            value={val}
                            x={startX + c * spacing}
                            y={startY - r * spacing}
                            color={color}
                         />
                    )
                })
            )}

            {/* Column Headers */}
            {labels?.colLabels?.map((l, i) => (
                 <Text 
                    key={`col-${i}`} 
                    position={[startX + i * spacing, startY + 0.8, 0]} 
                    fontSize={0.25} 
                    color="#94a3b8"
                 >
                    {l}
                 </Text>
            ))}

            {/* Row Headers */}
            {labels?.rowLabels?.map((l, i) => (
                 <Text 
                    key={`row-${i}`} 
                    position={[startX - 0.8, startY - i * spacing, 0]} 
                    fontSize={0.25} 
                    color="#94a3b8" 
                    anchorX="right"
                 >
                    {l}
                 </Text>
            ))}
        </group>
    )
}
