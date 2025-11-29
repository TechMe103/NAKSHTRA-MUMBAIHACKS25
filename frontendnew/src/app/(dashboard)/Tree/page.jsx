'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, TrendingUp, TrendingDown, Leaf, Flower, Apple } from 'lucide-react';
import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

// Tree component
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
        color: '#8B4513', // trunk/branch color
        roughness: 0.8,
        metalness: 0.2,
      }),
    []
  );

  // Rest of the Tree component implementation...
  // [Previous Tree component implementation here]
  
  return (
    <group>
      {/* Trunk */}
      <mesh ref={trunkRef} position={[0, 0, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[treeState.trunk.width, treeState.trunk.width * 1.2, 2, 8]} />
        <meshStandardMaterial color="#8B4513" roughness={0.8} metalness={0.2} />
      </mesh>
      
      {/* Add branches, leaves, and decorations here */}
      
    </group>
  );
}
// Main Page Component
export default function TreePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [financialData, setFinancialData] = useState({
    score: 75,
    savingsRate: 0.25,
    debtToIncome: 0.35,
    emergencyFund: 6,
    investments: 15000,
    expenses: {
      housing: 1200,
      food: 400,
      transportation: 300,
      entertainment: 200,
      other: 300
    }
  });

  // Mock tree state based on financial data
  const treeState = {
    trunk: {
      width: 0.5,
      height: 2,
      health: financialData.score / 100
    },
    branches: {
      count: 5 + Math.floor(financialData.score / 20),
      length: 1 + (financialData.score / 50),
      health: financialData.score / 100
    },
    leaves: {
      count: 50 + Math.floor(financialData.score * 2),
      health: financialData.score / 100
    },
    decorations: {
      count: Math.floor(financialData.score / 20)
    }
  };

  const getFinancialStatus = (score) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Needs Improvement';
  };

  const getFinancialStatusColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-blue-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
        <Skeleton className="h-96" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-3xl font-bold">Financial Health Dashboard</h1>
          <p className="text-muted-foreground">
            Your financial health at a glance
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Overall Score:</span>
            <span className={`text-2xl font-bold ${getFinancialStatusColor(financialData.score)}`}>
              {financialData.score}
            </span>
            <span className="text-sm text-muted-foreground">
              {getFinancialStatus(financialData.score)}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Savings Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(financialData.savingsRate * 100).toFixed(1)}%
            </div>
            <div className="text-xs text-muted-foreground">
              {financialData.savingsRate >= 0.2 ? (
                <span className="text-green-600 flex items-center">
                  <TrendingUp className="w-4 h-4 mr-1" /> Good
                </span>
              ) : (
                <span className="text-yellow-600 flex items-center">
                  <TrendingDown className="w-4 h-4 mr-1" /> Could be better
                </span>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Emergency Fund</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {financialData.emergencyFund} months
            </div>
            <div className="text-xs text-muted-foreground">
              {financialData.emergencyFund >= 6 ? (
                <span className="text-green-600">
                  <Check className="w-4 h-4 inline mr-1" /> Recommended
                </span>
              ) : (
                <span className="text-yellow-600">
                  <AlertCircle className="w-4 h-4 inline mr-1" /> Consider increasing
                </span>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Investments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${financialData.investments.toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground">
              {financialData.investments >= 10000 ? (
                <span className="text-green-600">
                  <TrendingUp className="w-4 h-4 inline mr-1" /> Great job!
                </span>
              ) : (
                <span className="text-yellow-600">
                  <TrendingDown className="w-4 h-4 inline mr-1" /> Keep investing
                </span>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="h-[600px] relative">
        <CardHeader>
          <CardTitle>Your Financial Health Tree</CardTitle>
          <p className="text-sm text-muted-foreground">
            Your financial health is represented by this tree. As you improve your finances, your tree will grow and flourish.
          </p>
        </CardHeader>
        <CardContent className="h-[calc(100%-120px)]">
          <Canvas camera={{ position: [5, 5, 5], fov: 50 }}>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} />
            <Tree treeState={treeState} />
            <OrbitControls 
              enableZoom={true}
              enablePan={true}
              minDistance={3}
              maxDistance={15}
            />
          </Canvas>
        </CardContent>
      </Card>
    </div>
  );
}