
export type BrickType = '1x1' | '1x2' | '2x2' | '2x4' | '1x4' | '2x8';

export interface BrickData {
  id: string;
  position: [number, number, number];
  type: BrickType;
  color: string;
  rotation: number; // Y-axis rotation in radians (0, PI/2, PI, 3PI/2)
}

export interface BrickTypeMeta {
  width: number;
  depth: number;
  height: number;
}

export interface AppState {
  bricks: BrickData[];
  selectedColor: string;
  selectedType: BrickType;
  tool: 'add' | 'remove' | 'paint';
  isAiGenerating: boolean;
}
