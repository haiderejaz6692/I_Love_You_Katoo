import { useCallback, useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Environment, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

interface PetalProps {
  position: [number, number, number];
  rotation: [number, number, number];
  scale: number;
  color: string;
  index: number;
  isBloom: boolean;
}

const Petal = ({ position, rotation, scale, color, index, isBloom }: PetalProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const baseRotation = useRef(rotation);
  
  useFrame((state) => {
    if (!meshRef.current) return;
    
    // Breathing animation
    const breathe = Math.sin(state.clock.elapsedTime * 0.5 + index * 0.3) * 0.02;
    meshRef.current.scale.setScalar(scale + breathe);
    
    // Bloom effect
    const openRotation = baseRotation.current[0] - 0.35;
    const targetRotation = isBloom ? openRotation : baseRotation.current[0];
    meshRef.current.rotation.x = THREE.MathUtils.lerp(
      meshRef.current.rotation.x,
      targetRotation,
      0.07
    );
  });

  const petalGeometry = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.bezierCurveTo(0.3, 0.2, 0.5, 0.5, 0.4, 1);
    shape.bezierCurveTo(0.2, 1.3, -0.2, 1.3, -0.4, 1);
    shape.bezierCurveTo(-0.5, 0.5, -0.3, 0.2, 0, 0);
    
    const extrudeSettings = {
      depth: 0.02,
      bevelEnabled: true,
      bevelThickness: 0.01,
      bevelSize: 0.02,
      bevelSegments: 3,
    };
    
    return new THREE.ExtrudeGeometry(shape, extrudeSettings);
  }, []);

  return (
    <mesh
      ref={meshRef}
      geometry={petalGeometry}
      position={position}
      rotation={rotation}
      scale={scale}
    >
      <meshStandardMaterial
        color={color}
        roughness={0.4}
        metalness={0.1}
        side={THREE.DoubleSide}
        emissive={color}
        emissiveIntensity={0.1}
      />
    </mesh>
  );
};

interface RoseProps {
  isBloom: boolean;
  onHover: (hovering: boolean) => void;
}

const Rose = ({ isBloom, onHover }: RoseProps) => {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const targetRotation = useRef({ x: 0, y: 0 });

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    
    // Slow rotation
    groupRef.current.rotation.y += delta * 0.2;
    
    // Mouse follow effect
    if (hovered) {
      const mouseX = (state.mouse.x * Math.PI) / 8;
      const mouseY = (state.mouse.y * Math.PI) / 8;
      targetRotation.current.x = mouseY;
      targetRotation.current.y = mouseX;
    } else {
      targetRotation.current.x = 0;
      targetRotation.current.y = 0;
    }
    
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      targetRotation.current.x,
      0.05
    );
  });

  const handlePointerEnter = () => {
    setHovered(true);
    onHover(true);
  };

  const handlePointerLeave = () => {
    setHovered(false);
    onHover(false);
  };

  // Generate petals in layers
  const petals = useMemo(() => {
    const result: Array<{
      position: [number, number, number];
      rotation: [number, number, number];
      scale: number;
      color: string;
    }> = [];
    
    // Inner layer
    for (let i = 0; i < 5; i++) {
      const angle = (i / 5) * Math.PI * 2;
      result.push({
        position: [
          Math.sin(angle) * 0.15,
          0.3,
          Math.cos(angle) * 0.15,
        ],
        rotation: [
          -0.6 + Math.random() * 0.2,
          angle,
          0.2,
        ],
        scale: 0.35,
        color: '#9e1b32',
      });
    }
    
    // Middle layer
    for (let i = 0; i < 7; i++) {
      const angle = (i / 7) * Math.PI * 2 + 0.3;
      result.push({
        position: [
          Math.sin(angle) * 0.35,
          0.15,
          Math.cos(angle) * 0.35,
        ],
        rotation: [
          -0.8 + Math.random() * 0.2,
          angle,
          0.1,
        ],
        scale: 0.5,
        color: '#c1121f',
      });
    }
    
    // Outer layer
    for (let i = 0; i < 9; i++) {
      const angle = (i / 9) * Math.PI * 2 + 0.5;
      result.push({
        position: [
          Math.sin(angle) * 0.55,
          0,
          Math.cos(angle) * 0.55,
        ],
        rotation: [
          -1.0 + Math.random() * 0.2,
          angle,
          0,
        ],
        scale: 0.65,
        color: '#e63946',
      });
    }
    
    // Outermost layer
    for (let i = 0; i < 11; i++) {
      const angle = (i / 11) * Math.PI * 2;
      result.push({
        position: [
          Math.sin(angle) * 0.75,
          -0.15,
          Math.cos(angle) * 0.75,
        ],
        rotation: [
          -1.3 + Math.random() * 0.2,
          angle,
          -0.1,
        ],
        scale: 0.75,
        color: '#ffb6c1',
      });
    }
    
    return result;
  }, []);

  return (
    <Float
      speed={2}
      rotationIntensity={0.2}
      floatIntensity={0.5}
    >
      <group
        ref={groupRef}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
      >
        {/* Center of rose */}
        <mesh position={[0, 0.35, 0]}>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial color="#7a0d1e" roughness={0.6} />
        </mesh>
        
        {/* Petals */}
        {petals.map((petal, i) => (
          <Petal
            key={i}
            index={i}
            position={petal.position}
            rotation={petal.rotation}
            scale={petal.scale}
            color={petal.color}
            isBloom={isBloom}
          />
        ))}
        
        {/* Stem */}
        <mesh position={[0, -0.8, 0]} rotation={[0, 0, 0.05]}>
          <cylinderGeometry args={[0.04, 0.05, 1.2, 8]} />
          <meshStandardMaterial color="#2d5a27" roughness={0.7} />
        </mesh>
        
        {/* Leaves */}
        <mesh position={[0.15, -0.5, 0]} rotation={[0, 0.5, 0.5]}>
          <coneGeometry args={[0.15, 0.4, 4]} />
          <meshStandardMaterial color="#4CAF50" roughness={0.6} />
        </mesh>
        <mesh position={[-0.15, -0.7, 0]} rotation={[0, -0.5, -0.5]}>
          <coneGeometry args={[0.12, 0.35, 4]} />
          <meshStandardMaterial color="#3d8b40" roughness={0.6} />
        </mesh>
      </group>
    </Float>
  );
};

interface Rose3DProps {
  className?: string;
}

const Rose3D = ({ className = '' }: Rose3DProps) => {
  const [isBloom, setIsBloom] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const handleToggleBloom = useCallback(() => {
    setIsBloom((prev) => !prev);
  }, []);

  return (
    <div 
      className={`relative ${className}`}
      data-interactive
      onPointerDown={handleToggleBloom}
    >
      {/* Glow effect behind rose */}
      <div 
        className={`absolute inset-0 rounded-full transition-all duration-500 ${
          isHovering ? 'opacity-80 scale-110' : 'opacity-50'
        }`}
        style={{
          background: 'radial-gradient(circle, hsl(351, 100%, 75%, 0.4) 0%, transparent 60%)',
          filter: 'blur(30px)',
        }}
      />
      
      <Canvas
        camera={{ position: [0, 0.5, 3], fov: 45 }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
        <pointLight position={[-5, 5, 0]} intensity={0.5} color="#ffb6c1" />
        <pointLight position={[0, -2, 5]} intensity={0.3} color="#fadadd" />
        
        <Rose isBloom={isBloom} onHover={setIsHovering} />
        
        <ContactShadows
          position={[0, -1.4, 0]}
          opacity={0.4}
          scale={3}
          blur={2}
          far={4}
        />
        
        <Environment preset="sunset" />
      </Canvas>
      
      {/* Click hint */}
      <div className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 text-rose-deep/60 text-sm font-sans animate-pulse">
        Click to bloom
      </div>
    </div>
  );
};

export default Rose3D;
