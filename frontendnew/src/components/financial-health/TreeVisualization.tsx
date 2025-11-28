import React, { useRef, useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

interface TreeState {
  trunk: {
    width: number;
    health: number;
  };
  branches: {
    length: number;
    health: number;
  };
  leaves: {
    count: number;
    color: string;
    health: number;
  };
  decorations: {
    has_flowers: boolean;
    has_fruits: boolean;
    is_growing: boolean;
    is_wilting: boolean;
    is_shaking?: boolean;
  };
  score: number;
  last_updated: string;
}

const COLORS = {
  trunk: '#8B4513',
  branch: '#8B4513',
  leaf: {
    green: '#2E8B57',
    'light-green': '#90EE90',
    yellow: '#FFD700',
    red: '#FF6347',
  },
  flower: '#FF69B4',
  fruit: '#FF4500',
};

const Tree: React.FC<{ treeState: TreeState }> = ({ treeState }) => {
  const trunkRef = useRef<THREE.Mesh>(null);
  const branchGroupRef = useRef<THREE.Group>(null);
  const leavesGroupRef = useRef<THREE.Group>(null);
  const flowerGroupRef = useRef<THREE.Group>(null);
  const fruitGroupRef = useRef<THREE.Group>(null);

  const { camera } = useThree();

  // Set up camera position based on tree size
  useEffect(() => {
    camera.position.set(0, 0, 5);
    camera.lookAt(0, 0, 0);
  }, [camera]);

  // Animation loop
  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    
    // Gentle swaying animation
    if (branchGroupRef.current) {
      const swayAmount = 0.1;
      branchGroupRef.current.rotation.z = Math.sin(time * 0.5) * swayAmount * 0.1;
    }

    // Shaking animation when expenses surge
    if (treeState.decorations.is_shaking && branchGroupRef.current) {
      const shakeIntensity = 0.05;
      branchGroupRef.current.rotation.x = (Math.random() - 0.5) * shakeIntensity;
      branchGroupRef.current.rotation.y = (Math.random() - 0.5) * shakeIntensity;
    }

    // Growing animation
    if (treeState.decorations.is_growing && trunkRef.current) {
      const growFactor = 1 + Math.sin(time * 2) * 0.01;
      trunkRef.current.scale.y = growFactor;
    }
  });

  // Generate branches
  const branches = useMemo(() => {
    const count = 8;
    const branchLength = treeState.branches.length / 100;
    
    return Array.from({ length: count }).map((_, i) => {
      const angle = (i / count) * Math.PI * 2;
      const height = 0.5 + (i % 2) * 0.3; // Alternate heights for branches
      
      return {
        position: [
          Math.sin(angle) * 0.3,
          height,
          Math.cos(angle) * 0.3,
        ],
        rotation: [
          Math.PI / 4 + (Math.random() - 0.5) * 0.2,
          angle,
          (Math.random() - 0.5) * 0.5,
        ],
        length: branchLength * (0.8 + Math.random() * 0.4), // Some variation
      };
    });
  }, [treeState.branches.length]);

  // Generate leaves
  const leaves = useMemo(() => {
    const count = treeState.leaves.count;
    const leafPositions: [number, number, number][] = [];
    
    // Distribute leaves around branches
    branches.forEach((branch: any) => {
      const branchLength = branch.length * 2;
      const leavesOnBranch = Math.ceil(count / branches.length);
      
      for (let i = 0; i < leavesOnBranch; i++) {
        const t = i / leavesOnBranch;
        const angle = Math.random() * Math.PI * 2;
        const radius = 0.1 + Math.random() * 0.2;
        
        leafPositions.push([
          branch.position[0] + Math.sin(angle) * radius,
          branch.position[1] + t * branchLength,
          branch.position[2] + Math.cos(angle) * radius,
        ]);
      }
    });
    
    return leafPositions.slice(0, count); // Ensure we don't exceed the count
  }, [treeState.leaves.count, branches]);

  // Generate flowers and fruits
  const { flowers, fruits } = useMemo(() => {
    const flowerPositions: [number, number, number][] = [];
    const fruitPositions: [number, number, number][] = [];
    
    if (treeState.decorations.has_flowers) {
      // Place flowers at the ends of some branches
      branches.slice(0, Math.floor(branches.length / 2)).forEach((branch: any) => {
        flowerPositions.push([
          branch.position[0] + Math.sin(branch.rotation[1]) * 0.1,
          branch.position[1] + branch.length * 0.9,
          branch.position[2] + Math.cos(branch.rotation[1]) * 0.1,
        ]);
      });
    }
    
    if (treeState.decorations.has_fruits) {
      // Place fruits on remaining branches
      branches.slice(Math.floor(branches.length / 2)).forEach((branch: any) => {
        fruitPositions.push([
          branch.position[0] + Math.sin(branch.rotation[1]) * 0.1,
          branch.position[1] + branch.length * 0.7,
          branch.position[2] + Math.cos(branch.rotation[1]) * 0.1,
        ]);
      });
    }
    
    return { flowers: flowerPositions, fruits: fruitPositions };
  }, [
    treeState.decorations.has_flowers,
    treeState.decorations.has_fruits,
    branches,
  ]);

  // Get leaf color based on health
  const leafColor = useMemo(() => {
    return COLORS.leaf[treeState.leaves.color as keyof typeof COLORS.leaf] || COLORS.leaf.green;
  }, [treeState.leaves.color]);

  return (
    <group>
      {/* Trunk */}
      <mesh ref={trunkRef} position={[0, 0, 0]} castShadow>
        <cylinderGeometry 
          args={[
            treeState.trunk.width / 100, // radius top
            treeState.trunk.width / 100, // radius bottom
            1, // height
            8, // radial segments
          ]} 
        />
        <meshStandardMaterial 
          color={COLORS.trunk} 
          roughness={0.8}
          metalness={0.2}
        />
      </mesh>

      {/* Branches */}
      <group ref={branchGroupRef}>
        {branches.map((branch: any, i) => (
          <mesh
            key={`branch-${i}`}
            position={branch.position}
            rotation={branch.rotation}
            castShadow
          >
            <cylinderGeometry 
              args={[
                0.02, // radius top
                0.04, // radius bottom
                branch.length, // height
                6, // radial segments
              ]} 
            />
            <meshStandardMaterial 
              color={COLORS.branch} 
              roughness={0.8}
              metalness={0.2}
            />
          </mesh>
        ))}
      </group>

      {/* Leaves */}
      <group ref={leavesGroupRef}>
        {leaves.map((position, i) => (
          <mesh
            key={`leaf-${i}`}
            position={position as [number, number, number]}
            scale={0.1 + Math.random() * 0.1}
            rotation={[
              Math.random() * Math.PI * 2,
              Math.random() * Math.PI * 2,
              Math.random() * Math.PI * 2,
            ]}
            castShadow
          >
            <sphereGeometry args={[0.2, 4, 4]} />
            <meshStandardMaterial 
              color={leafColor} 
              roughness={0.7}
              metalness={0.1}
              transparent
              opacity={treeState.decorations.is_wilting ? 0.7 : 0.9}
            />
          </mesh>
        ))}
      </group>

      {/* Flowers */}
      <group ref={flowerGroupRef}>
        {flowers.map((position, i) => (
          <mesh
            key={`flower-${i}`}
            position={position}
            scale={0.05}
            rotation={[0, 0, 0]}
          >
            <sphereGeometry args={[0.2, 8, 8]} />
            <meshStandardMaterial 
              color={COLORS.flower} 
              emissive="#FF1493"
              emissiveIntensity={0.3}
              roughness={0.3}
              metalness={0.7}
            />
          </mesh>
        ))}
      </group>

      {/* Fruits */}
      <group ref={fruitGroupRef}>
        {fruits.map((position, i) => (
          <mesh
            key={`fruit-${i}`}
            position={position}
            scale={0.06}
            rotation={[0, 0, 0]}
          >
            <sphereGeometry args={[0.2, 8, 8]} />
            <meshStandardMaterial 
              color={COLORS.fruit} 
              roughness={0.4}
              metalness={0.3}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
};

interface TreeVisualizationProps {
  treeState: TreeState;
  className?: string;
}

const TreeVisualization: React.FC<TreeVisualizationProps> = ({ 
  treeState, 
  className = '' 
}) => {
  return (
    <div className={`w-full h-96 bg-gradient-to-b from-blue-50 to-white rounded-lg overflow-hidden ${className}`}>
      <Canvas shadows camera={{ position: [0, 0, 5], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <directionalLight 
          position={[10, 10, 5]} 
          intensity={1} 
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <pointLight position={[10, 10, 10]} intensity={0.5} />
        
        <Tree treeState={treeState} />
        
        <OrbitControls 
          enableZoom={true}
          enablePan={false}
          maxPolarAngle={Math.PI / 1.5}
          minPolarAngle={Math.PI / 3}
          maxDistance={10}
          minDistance={3}
        />
        
        {/* Ground plane */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
          <planeGeometry args={[10, 10]} />
          <shadowMaterial opacity={0.2} />
        </mesh>
      </Canvas>
    </div>
  );
};

export default TreeVisualization;
