
import { BrickType, BrickTypeMeta } from './types';

export const BRICK_METADATA: Record<BrickType, BrickTypeMeta> = {
  '1x1': { width: 1, depth: 1, height: 1.2 },
  '1x2': { width: 2, depth: 1, height: 1.2 },
  '1x4': { width: 4, depth: 1, height: 1.2 },
  '2x2': { width: 2, depth: 2, height: 1.2 },
  '2x4': { width: 4, depth: 2, height: 1.2 },
  '2x8': { width: 8, depth: 2, height: 1.2 },
};

export const COLORS = [
  '#E63946', // Red
  '#F1FAEE', // Off-white
  '#A8DADC', // Light Blue
  '#457B9D', // Blue
  '#1D3557', // Dark Blue
  '#FFB703', // Yellow
  '#FB8500', // Orange
  '#38b000', // Green
  '#2d6a4f', // Forest Green
  '#000000', // Black
  '#8d99ae', // Grey
  '#6d597a', // Purple
];

export const GRID_SIZE = 20;
export const BRICK_UNIT = 1; // 1 unit = standard stud spacing
export const BRICK_HEIGHT = 1.2; // Bricks are taller than wide usually
