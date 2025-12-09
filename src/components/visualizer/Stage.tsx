import { useRef, useEffect } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { OrbitControls, Environment, Grid, PerspectiveCamera } from '@react-three/drei'
import { Suspense } from 'react'
import { cn } from '@/lib/utils'
import { useAlgoStore } from '@/store/useAlgoStore'

interface StageProps {
  children?: React.ReactNode
  className?: string
}

// Separate component to handle Camera Logic inside Canvas
const CameraController = () => {
    const { viewMode } = useAlgoStore()
    const orbitRef = useRef<any>(null)
    const { camera } = useThree()
    
    useEffect(() => {
        if (!orbitRef.current) return
        
        if (viewMode === '2d') {
            orbitRef.current.reset()
            orbitRef.current.enableRotate = false
            
            // "Pseudo-2D" using flat perspective
            // Move camera far back and reduce FOV to flatten the image
            camera.position.set(0, 5, 40)
            camera.lookAt(0, 5, 0)
            
            // Adjust orbit target to center of visualization
            orbitRef.current.target.set(0, 5, 0)
        } else {
            orbitRef.current.enableRotate = true
            
            // Standard 3D view
            camera.position.set(0, 10, 25)
            
            // Look a bit lower for 3D goodness
            orbitRef.current.target.set(0, 0, 0)
        }
        orbitRef.current.update()
    }, [viewMode, camera])

    return (
        <>
            <PerspectiveCamera 
                makeDefault 
                fov={viewMode === '2d' ? 25 : 45} // Lower FOV for 2D to reduce distortion
                position={[0, 10, 25]} 
            />
            <OrbitControls 
                ref={orbitRef}
                makeDefault 
                minDistance={5} 
                maxDistance={100}
                dampingFactor={0.05}
                enableRotate={viewMode === '3d'}
            />
        </>
    )
}

export const Stage = ({ children, className }: StageProps) => {
  const { viewMode } = useAlgoStore()

  return (
    <div className={cn("w-full h-full relative bg-background rounded-xl overflow-hidden border border-border/50 shadow-2xl", className)}>
      <Canvas shadows dpr={[1, 2]}>
        {/* Reduce fog in 2D mode to prevent darkness */}
        <fog attach="fog" args={['#020617', 10, viewMode === '2d' ? 200 : 50]} />
        <color attach="background" args={['#020617']} />
        
        <CameraController />
        
        <ambientLight intensity={viewMode === '2d' ? 1.5 : 0.4} />
        
        <spotLight 
          position={[10, 20, 10]} 
          angle={0.25} 
          penumbra={1} 
          intensity={1} 
          castShadow 
        />

        {/* Extra frontal light for 2D clarity */}
        {viewMode === '2d' && (
             <directionalLight position={[0, 10, 20]} intensity={2} />
        )}
        
        {/* Modern Grid Floor - Only visible in 3D */}
        {viewMode === '3d' && (
            <Grid 
            position={[0, -0.01, 0]} 
            args={[40, 40]} 
            cellColor="#1e293b" 
            sectionColor="#334155" 
            cellThickness={0.5}
            sectionThickness={1}
            fadeDistance={40}
            infiniteGrid
            />
        )}
        
        <Suspense fallback={null}>
            <Environment preset="night" />
            {children}
        </Suspense>
      </Canvas>
      
      <div className="absolute bottom-6 right-6 text-xs font-mono text-muted-foreground/50 pointer-events-none select-none tracking-widest uppercase">
        AlgoVision Environment v1.0
      </div>
    </div>
  )
}
