
import React, { useState, useCallback, useRef } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, Grid, Plane } from '@react-three/drei';
import * as THREE from 'three';
import LegoBrick from './LegoBrick';
import { BrickData, BrickType } from '../types';
import { BRICK_METADATA, BRICK_HEIGHT, BRICK_UNIT } from '../constants';

interface EditorProps {
  bricks: BrickData[];
  onAddBrick: (brick: Omit<BrickData, 'id'>) => void;
  onRemoveBrick: (id: string) => void;
  onUpdateBrick: (id: string, updates: Partial<BrickData>) => void;
  selectedColor: string;
  selectedType: BrickType;
  tool: 'add' | 'remove' | 'paint';
}

const Scene: React.FC<EditorProps> = ({ 
  bricks, 
  onAddBrick, 
  onRemoveBrick, 
  onUpdateBrick, 
  selectedColor, 
  selectedType, 
  tool 
}) => {
  const [ghostPos, setGhostPos] = useState<[number, number, number] | null>(null);
  const [ghostRot, setGhostRot] = useState(0);

  const snapToGrid = (val: number, step: number = BRICK_UNIT) => Math.round(val / step) * step;

  const handlePointerMove = (e: any) => {
    if (tool !== 'add') {
      setGhostPos(null);
      return;
    }
    
    // We want to snap the ghost to the surface or floor
    const point = e.point;
    const meta = BRICK_METADATA[selectedType];
    
    // Offset based on rotation if needed
    const isRotated = Math.abs(Math.sin(ghostRot)) > 0.5;
    const w = isRotated ? meta.depth : meta.width;
    const d = isRotated ? meta.width : meta.depth;

    const x = snapToGrid(point.x, BRICK_UNIT);
    const z = snapToGrid(point.z, BRICK_UNIT);
    
    // Y snap: either 0 or stacked on top of bricks
    // For simplicity, we just use the point's y and snap to BRICK_HEIGHT
    let y = snapToGrid(point.y, BRICK_HEIGHT);
    if (y < BRICK_HEIGHT / 2) y = BRICK_HEIGHT / 2;

    setGhostPos([x, y, z]);
  };

  const handleClick = (e: any) => {
    if (tool === 'add' && ghostPos) {
      onAddBrick({
        position: ghostPos,
        type: selectedType,
        color: selectedColor,
        rotation: ghostRot
      });
    }
  };

  const handleBrickClick = (id: string, e: any) => {
    e.stopPropagation();
    if (tool === 'remove') {
      onRemoveBrick(id);
    } else if (tool === 'paint') {
      onUpdateBrick(id, { color: selectedColor });
    }
  };

  // Rotation with 'R' key
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'r') {
        setGhostRot(prev => (prev + Math.PI / 2) % (Math.PI * 2));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <ambientLight intensity={0.6} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, 10, -10]} intensity={0.5} />
      
      <OrbitControls makeDefault />

      {/* Bricks */}
      {bricks.map((brick) => (
        <LegoBrick 
          key={brick.id}
          {...brick}
          onClick={(e) => handleBrickClick(brick.id, e)}
        />
      ))}

      {/* Ghost Preview */}
      {tool === 'add' && ghostPos && (
        <LegoBrick 
          type={selectedType}
          color={selectedColor}
          position={ghostPos}
          rotation={ghostRot}
          opacity={0.5}
          wireframe
          onClick={() => {}}
        />
      )}

      {/* Interaction Plane */}
      <Plane 
        args={[100, 100]} 
        rotation={[-Math.PI / 2, 0, 0]} 
        position={[0, 0, 0]}
        onPointerMove={handlePointerMove}
        onClick={handleClick}
        visible={false}
      />

      <Grid 
        args={[50, 50]} 
        sectionSize={5} 
        sectionThickness={1.5} 
        mainThickness={1} 
        cellColor="#9ca3af" 
        sectionColor="#4b5563"
        fadeDistance={50}
        infiniteGrid
      />
    </>
  );
};

const Editor: React.FC<EditorProps> = (props) => {
  return (
    <div className="w-full h-full bg-slate-100">
      <Canvas shadows camera={{ position: [10, 10, 10], fov: 45 }}>
        <Scene {...props} />
      </Canvas>
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/80 backdrop-blur px-4 py-2 rounded-full shadow-lg pointer-events-none text-sm font-medium text-slate-600">
        Press <span className="px-1.5 py-0.5 bg-slate-200 rounded text-slate-800">R</span> to rotate brick
      </div>
    </div>
  );
};

export default Editor;
