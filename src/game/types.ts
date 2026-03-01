// 棋盘配置
export const BOARD_SIZE = 8;
export const CELL_SIZE = 80;
export const PADDING = 35;

// 玩家类型
export const enum Player {
  Empty = 0,
  Black = 1, // 黑棋
  White = 2, // 白棋
}

// 坐标
export interface Position {
  x: number;
  y: number;
}

// 游戏状态
export const enum GameStatus {
  Playing,
  BlackWin,
  WhiteWin,
  Draw,
}

// 方向向量（8个方向）
export const DIRECTIONS: Position[] = [
  { x: -1, y: -1 }, { x: 0, y: -1 }, { x: 1, y: -1 },
  { x: -1, y: 0 },                   { x: 1, y: 0 },
  { x: -1, y: 1 },  { x: 0, y: 1 },  { x: 1, y: 1 },
];

// 位置权重表（经典策略）
// 角最重要，靠近角的位置最差
export const POSITION_WEIGHTS: number[][] = [
  [100, -20,  10,   5,   5,  10, -20, 100],
  [-20, -50,  -2,  -2,  -2,  -2, -50, -20],
  [ 10,  -2,   1,   1,   1,   1,  -2,  10],
  [  5,  -2,   1,   0,   0,   1,  -2,   5],
  [  5,  -2,   1,   0,   0,   1,  -2,   5],
  [ 10,  -2,   1,   1,   1,   1,  -2,  10],
  [-20, -50,  -2,  -2,  -2,  -2, -50, -20],
  [100, -20,  10,   5,   5,  10, -20, 100],
];
