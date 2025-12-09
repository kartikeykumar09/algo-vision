import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { easing } from 'maath'
import { Text } from '@react-three/drei'
import type { ArrayItem } from '@/store/useAlgoStore'
import { Group, MeshStandardMaterial } from 'three'

interface BarProps {
  item: ArrayItem
  index: number
  total: number
  color: string
}

export const Bar = ({ item, index, total, color }: BarProps) => {
  const groupRef = useRef<Group>(null)
  const materialRef = useRef<MeshStandardMaterial>(null)
  
  // Calculate Target Position
  // Center the array in the scene
  const spacing = 1.2
  const xOffset = (index - (total - 1) / 2) * spacing
  
  useFrame((_, delta) => {
    if (!groupRef.current || !materialRef.current) return

    // Animate Position (slide effect)
    // y is usually height/2 so the base acts as floor. 
    // But since boxGeometry draws from center, we move y up by height/2
    const targetY = item.value / 2
    
    easing.damp3(groupRef.current.position, [xOffset, targetY, 0], 0.25, delta)
    
    // Animate Color
    easing.dampC(materialRef.current.color, color, 0.15, delta)
  })

  return (
    <group ref={groupRef}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[0.8, item.value, 0.8]} />
        <meshStandardMaterial ref={materialRef} color={color} roughness={0.2} metalness={0.8} />
      </mesh>
      
      {/* Label Value */}
      <Text
        position={[0, item.value / 2 + 0.5, 0]}
        fontSize={0.4}
        color="#e2e8f0"
        anchorY="bottom"
      >
        {item.value}
      </Text>
    </group>
  )
}
