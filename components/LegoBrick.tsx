
import React, { useMemo } from 'react';
import { useCursor } from '@react-three/drei';
import { BRICK_METADATA, BRICK_UNIT, BRICK_HEIGHT } from '../constants';
import { BrickType } from '../types';

interface LegoBrickProps {
  type: BrickType;
  color: string;
  position: [number, number, number];
  rotation: number;
  onClick: (e: any) => void;
  onPointerOver?: (e: any) => void;
  onPointerOut?: (e: any) => void;
  opacity?: number;
  wireframe?: boolean;
}

const LegoBrick: React.FC<LegoBrickProps> = ({ 
  type, 
  color, 
  position, 
  rotation, 
  onClick, 
  onPointerOver, 
  onPointerOut,
  opacity = 1,
  wireframe = false
}) => {
  const meta = BRICK_METADATA[type];
  const [hovered, setHovered] = React.useState(false);
  useCursor(hovered);

  // Stud generation
  const studs = useMemo(() => {
    const list = [];
    for (let w = 0; w < meta.width; w++) {
      for (let d = 0; d < meta.depth; d++) {
        // Center the studs on the brick
        const x = (w - (meta.width - 1) / 2) * BRICK_UNIT;
        const z = (d - (meta.depth - 1) / 2) * BRICK_UNIT;
        list.push([x, BRICK_HEIGHT / 2 + 0.1, z]);
      }
    }
    return list;
  }, [meta]);

  return (
    <group 
      position={position} 
      rotation={[0, rotation, 0]} 
      onClick={(e) => { e.stopPropagation(); onClick(e); }}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); onPointerOver?.(e); }}
      onPointerOut={() => { setHovered(false); onPointerOut?.(); }}
    >
      {/* Main Block */}
      <mesh>
        <boxGeometry args={[meta.width * BRICK_UNIT - 0.05, BRICK_HEIGHT - 0.05, meta.depth * BRICK_UNIT - 0.05]} />
        <meshStandardMaterial 
          color={color} 
          transparent={opacity < 1} 
          opacity={opacity} 
          wireframe={wireframe}
          roughness={0.2}
          metalness={0.1}
        />
      </mesh>

      {/* Studs */}
      {studs.map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]}>
          <cylinderGeometry args={[0.3, 0.3, 0.2, 16]} />
          <meshStandardMaterial 
            color={color} 
            transparent={opacity < 1} 
            opacity={opacity} 
            wireframe={wireframe}
            roughness={0.2}
          />
        </mesh>
      ))}
    </group>
  );
};

export default LegoBrick;
