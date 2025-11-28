import React, { useRef, useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

const COLORS = {
  trunk: '#8B4513',
  branch: '#8B4513',
  leaf: {
    healthy: '#2E8B57',
    medium: '#9ACD32',
    unhealthy: '#B22222'
  },
  ground: '#228B22',
  sky: '#87CEEB',
  decoration: {
    red: '#FF0000',
    blue: '#0000FF',
    yellow: '#FFFF00',
    orange: '#FFA500',
    purple: '#800080'
  }
};

const Tree = ({ treeState }) => {
  const trunkRef = useRef();
  const branchRefs = useRef([]);
  const leafRefs = useRef([]);
  const decorationRefs = useRef([]);

  // Create branch geometry and material
  const branchGeometry = useMemo(() => {
    const geometry = new THREE.CylinderGeometry(
      treeState.trunk.width * 0.7,
      treeState.trunk.width * 0.5,
      treeState.branches.length,
      8
    );
    geometry.rotateX(Math.PI / 2);
    return geometry;
  }, [treeState.trunk.width, treeState.branches.length]);

  const branchMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: COLORS.branch,
        roughness: 0.8,
        metalness: 0.2,
      }),
    []
  );

  // Create leaf geometry and material
  const leafGeometry = useMemo(() => {
    const geometry = new THREE.SphereGeometry(0.5, 8, 8);
    return geometry;
  }, []);

  const getLeafMaterial = (health) => {
    let color;
    if (health > 0.7) color = COLORS.leaf.healthy;
    else if (health > 0.4) color = COLORS.leaf.medium;
    else color = COLORS.leaf.unhealthy;

    return new THREE.MeshStandardMaterial({
      color,
      roughness: 0.8,
      metalness: 0.2,
      transparent: true,
      opacity: 0.9,
    });
  };

  // Animation
  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    
    // Gentle swaying animation for the tree
    if (trunkRef.current) {
      trunkRef.current.rotation.z = Math.sin(time * 0.3) * 0.05;
    }
    
    // Slight movement for branches
    branchRefs.current.forEach((branch, i) => {
      if (branch) {
        branch.rotation.z = Math.sin(time * 0.2 + i) * 0.1;
        branch.rotation.x = Math.sin(time * 0.15 + i * 0.5) * 0.1;
      }
    });
    
    // Gentle pulsing for leaves
    leafRefs.current.forEach((leaf, i) => {
      if (leaf) {
        leaf.scale.setScalar(1 + Math.sin(time * 0.5 + i) * 0.1);
      }
    });
  });

  // Generate branches
  const branches = useMemo(() => {
    const branchCount = 3 + Math.floor(treeState.branches.health * 5);
    const branches = [];
    
    for (let i = 0; i < branchCount; i++) {
      const angle = (i / branchCount) * Math.PI * 2;
      const height = 0.5 + (i / branchCount) * 1.5;
      const length = treeState.branches.length * (0.5 + Math.random() * 0.5);
      
      branches.push({
        position: [
          Math.sin(angle) * 0.5,
          height,
          Math.cos(angle) * 0.5
        ],
        rotation: [
          Math.PI / 4 + (Math.random() - 0.5) * 0.5,
          angle,
          (Math.random() - 0.5) * 0.5
        ],
        scale: [1, length / 2, 1]
      });
    }
    
    return branches;
  }, [treeState.branches.health, treeState.branches.length]);

  // Generate leaves
  const leaves = useMemo(() => {
    const leafCount = Math.floor(treeState.leaves.count * treeState.leaves.health);
    const leaves = [];
    
    for (let i = 0; i < leafCount; i++) {
      const branch = branches[Math.floor(Math.random() * branches.length)];
      if (!branch) continue;
      
      const t = 0.3 + Math.random() * 0.6; // Position along branch (30% to 90%)
      const angle = Math.random() * Math.PI * 2;
      const radius = 0.1 + Math.random() * 0.3;
      
      leaves.push({
        position: [
          branch.position[0] + Math.sin(angle) * radius,
          branch.position[1] + t * branch.scale[1] * 2,
          branch.position[2] + Math.cos(angle) * radius
        ],
        scale: 0.5 + Math.random() * 1.5,
        health: treeState.leaves.health * (0.8 + Math.random() * 0.4)
      });
    }
    
    return leaves;
  }, [branches, treeState.leaves.count, treeState.leaves.health]);

  // Generate decorations
  const decorations = useMemo(() => {
    if (!treeState.decorations || treeState.decorations.count === 0) return [];
    
    const decorationCount = treeState.decorations.count;
    const decorations = [];
    const decorationColors = Object.values(COLORS.decoration);
    
    for (let i = 0; i < decorationCount; i++) {
      const branch = branches[Math.floor(Math.random() * branches.length)];
      if (!branch) continue;
      
      const t = 0.3 + Math.random() * 0.6; // Position along branch
      const angle = Math.random() * Math.PI * 2;
      const radius = 0.2 + Math.random() * 0.3;
      
      decorations.push({
        position: [
          branch.position[0] + Math.sin(angle) * radius,
          branch.position[1] + t * branch.scale[1] * 2,
          branch.position[2] + Math.cos(angle) * radius
        ],
        color: decorationColors[Math.floor(Math.random() * decorationColors.length)],
        scale: 0.1 + Math.random() * 0.2
      });
    }
    
    return decorations;
  }, [branches, treeState.decorations]);

  return (
    <group>
      {/* Trunk */}
      <mesh
        ref={trunkRef}
        position={[0, 0, 0]}
        castShadow
        receiveShadow
      >
        <cylinderGeometry
          args={[
            treeState.trunk.width,
            treeState.trunk.width * 1.2,
            2,
            8
          ]}
        />
        <meshStandardMaterial
          color={COLORS.trunk}
          roughness={0.8}
          metalness={0.2}
        />
      </mesh>

      {/* Branches */}
      {branches.map((branch, i) => (
        <mesh
          key={`branch-${i}`}
          ref={el => (branchRefs.current[i] = el)}
          position={branch.position}
          rotation={branch.rotation}
          scale={branch.scale}
          castShadow
        >
          <primitive object={branchGeometry.clone()} attach="geometry" />
          <primitive object={branchMaterial} attach="material" />
        </mesh>
      ))}

      {/* Leaves */}
      {leaves.map((leaf, i) => (
        <mesh
          key={`leaf-${i}`}
          ref={el => (leafRefs.current[i] = el)}
          position={leaf.position}
          scale={leaf.scale}
          castShadow
        >
          <primitive object={leafGeometry.clone()} attach="geometry" />
          <primitive object={getLeafMaterial(leaf.health)} attach="material" />
        </mesh>
      ))}

      {/* Decorations */}
      {decorations.map((decoration, i) => (
        <mesh
          key={`decoration-${i}`}
          ref={el => (decorationRefs.current[i] = el)}
          position={decoration.position}
          scale={decoration.scale}
          castShadow
        >
          <sphereGeometry args={[1, 8, 8]} />
          <meshStandardMaterial
            color={decoration.color}
            roughness={0.5}
            metalness={0.5}
          />
        </mesh>
      ))}

      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]} receiveShadow>
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial color={COLORS.ground} roughness={0.8} />
      </mesh>
    </group>
  );
};

const TreeVisualization = ({ treeState, className = '' }) => {
  return (
    <div className={`w-full h-full ${className}`}>
      <Canvas
        shadows
        camera={{ position: [5, 3, 5], fov: 50 }}
        gl={{ antialias: true }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight
          position={[10, 10, 5]}
          intensity={1}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-camera-far={50}
          shadow-camera-left={-10}
          shadow-camera-right={10}
          shadow-camera-top={10}
          shadow-camera-bottom={-10}
        />
        <pointLight position={[-10, -10, -10]} intensity={0.2} />
        
        <Tree treeState={treeState} />
        
        <OrbitControls
          enableZoom={true}
          enablePan={true}
          enableRotate={true}
          maxPolarAngle={Math.PI / 1.5}
          minDistance={3}
          maxDistance={15}
        />
      </Canvas>
    </div>
  );
};

export default TreeVisualization;
