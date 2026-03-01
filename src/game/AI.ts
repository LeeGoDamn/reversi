import { BOARD_SIZE, Player, Position, POSITION_WEIGHTS } from './types';
import { GameLogic } from './GameLogic';

// 搜索深度
const SEARCH_DEPTH = 7;

// 游戏阶段阈值
const EARLY_GAME = 20;
const MID_GAME = 50;

export class AI {
  private board: Player[][];
  private aiColor: Player;

  constructor(board: Player[][], aiColor: Player) {
    this.board = board;
    this.aiColor = aiColor;
  }

  updateBoard(board: Player[][]): void {
    this.board = board;
  }

  getBestMove(): Position | null {
    const validMoves = GameLogic.getValidMoves(this.board, this.aiColor);
    if (validMoves.length === 0) return null;
    if (validMoves.length === 1) return validMoves[0];

    // 排序：优先搜索高价值位置
    const sortedMoves = this.sortMoves(validMoves);

    let bestScore = -Infinity;
    let bestMove = sortedMoves[0];
    const opponent = this.aiColor === Player.Black ? Player.White : Player.Black;

    for (const move of sortedMoves) {
      const newBoard = GameLogic.makeMove(this.board, move.x, move.y, this.aiColor);
      const score = this.minimax(newBoard, SEARCH_DEPTH - 1, -Infinity, Infinity, false, opponent);
      
      if (score > bestScore) {
        bestScore = score;
        bestMove = move;
      }
    }

    return bestMove;
  }

  private sortMoves(moves: Position[]): Position[] {
    return [...moves].sort((a, b) => {
      return POSITION_WEIGHTS[a.x][a.y] - POSITION_WEIGHTS[b.x][b.y];
    }).reverse();
  }

  private minimax(
    board: Player[][],
    depth: number,
    alpha: number,
    beta: number,
    isMaximizing: boolean,
    currentPlayer: Player
  ): number {
    // 终止条件
    if (depth === 0 || GameLogic.isGameOver(board)) {
      return this.evaluateBoard(board);
    }

    const validMoves = GameLogic.getValidMoves(board, currentPlayer);
    const opponent = currentPlayer === Player.Black ? Player.White : Player.Black;

    // 如果当前玩家没有有效移动，跳过
    if (validMoves.length === 0) {
      if (GameLogic.getValidMoves(board, opponent).length === 0) {
        // 双方都无法移动，游戏结束
        return this.evaluateBoard(board);
      }
      return this.minimax(board, depth - 1, alpha, beta, !isMaximizing, opponent);
    }

    const sortedMoves = this.sortMoves(validMoves);

    if (isMaximizing) {
      let maxScore = -Infinity;
      
      for (const move of sortedMoves) {
        const newBoard = GameLogic.makeMove(board, move.x, move.y, currentPlayer);
        const score = this.minimax(newBoard, depth - 1, alpha, beta, false, opponent);
        
        maxScore = Math.max(maxScore, score);
        alpha = Math.max(alpha, score);
        
        if (beta <= alpha) break;
      }
      
      return maxScore;
    } else {
      let minScore = Infinity;
      
      for (const move of sortedMoves) {
        const newBoard = GameLogic.makeMove(board, move.x, move.y, currentPlayer);
        const score = this.minimax(newBoard, depth - 1, alpha, beta, true, opponent);
        
        minScore = Math.min(minScore, score);
        beta = Math.min(beta, score);
        
        if (beta <= alpha) break;
      }
      
      return minScore;
    }
  }

  private evaluateBoard(board: Player[][]): number {
    const pieces = GameLogic.countPieces(board);
    const totalPieces = pieces.black + pieces.white;
    
    // 游戏结束：直接计算胜负
    if (GameLogic.isGameOver(board)) {
      const diff = this.aiColor === Player.Black 
        ? pieces.black - pieces.white 
        : pieces.white - pieces.black;
      return diff * 10000;
    }

    let score = 0;
    const opponent = this.aiColor === Player.Black ? Player.White : Player.Black;

    // 1. 位置权重
    for (let x = 0; x < BOARD_SIZE; x++) {
      for (let y = 0; y < BOARD_SIZE; y++) {
        if (board[x][y] === this.aiColor) {
          score += POSITION_WEIGHTS[x][y];
        } else if (board[x][y] === opponent) {
          score -= POSITION_WEIGHTS[x][y];
        }
      }
    }

    // 2. 移动性（可选步数）
    const myMoves = GameLogic.getValidMoves(board, this.aiColor).length;
    const oppMoves = GameLogic.getValidMoves(board, opponent).length;
    score += (myMoves - oppMoves) * 5;

    // 3. 角位控制
    const corners = [[0, 0], [0, 7], [7, 0], [7, 7]];
    for (const [x, y] of corners) {
      if (board[x][y] === this.aiColor) score += 50;
      else if (board[x][y] === opponent) score -= 50;
    }

    // 4. 稳定棋子（边缘）
    score += this.countStableDiscs(board, this.aiColor) * 10;
    score -= this.countStableDiscs(board, opponent) * 10;

    // 5. 游戏阶段调整
    if (totalPieces < EARLY_GAME) {
      // 早期：重视移动性和位置
      score += (myMoves - oppMoves) * 10;
    } else if (totalPieces > MID_GAME) {
      // 后期：重视棋子数量
      const pieceDiff = this.aiColor === Player.Black 
        ? pieces.black - pieces.white 
        : pieces.white - pieces.black;
      score += pieceDiff * 20;
    }

    return score;
  }

  // 计算稳定棋子（简化版：边缘棋子）
  private countStableDiscs(board: Player[][], player: Player): number {
    let count = 0;
    
    // 检查四条边
    for (let i = 0; i < BOARD_SIZE; i++) {
      // 上边
      if (board[i][0] === player) count++;
      // 下边
      if (board[i][BOARD_SIZE - 1] === player) count++;
      // 左边
      if (board[0][i] === player) count++;
      // 右边
      if (board[BOARD_SIZE - 1][i] === player) count++;
    }
    
    return count;
  }
}
