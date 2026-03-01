import './style.css';
import { Game } from './game/Game';

const app = document.getElementById('app')!;
app.innerHTML = `
  <div class="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 flex flex-col items-center justify-center gap-5 p-6">
    <h1 class="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent drop-shadow-lg">黑白棋</h1>
    
    <div id="score" class="text-2xl font-bold text-gray-100 bg-gray-800/80 px-8 py-3 rounded-2xl shadow-xl border border-gray-700">⚫ 2 : 2 ⚪</div>
    
    <div id="status" class="text-center text-gray-900 text-lg font-bold min-h-12 bg-gradient-to-r from-amber-100 to-amber-200 px-8 py-3 rounded-2xl shadow-lg border-2 border-amber-400">选择先后手</div>
    
    <canvas id="gameCanvas" width="710" height="710" class="rounded-2xl shadow-2xl border-4 border-gray-700"></canvas>
    
    <div class="flex flex-wrap gap-4 justify-center mt-2">
      <button id="blackBtn" class="px-8 py-3 bg-gradient-to-br from-gray-700 to-gray-900 text-white font-bold rounded-2xl hover:from-gray-600 hover:to-gray-800 transition-all shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 border-2 border-gray-600">⚫ 执黑先手</button>
      <button id="whiteBtn" class="px-8 py-3 bg-gradient-to-br from-gray-100 to-gray-300 text-gray-800 font-bold rounded-2xl hover:from-white hover:to-gray-200 transition-all shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 border-2 border-gray-400">⚪ 执白后手</button>
      <button id="resetBtn" class="px-8 py-3 bg-gradient-to-br from-blue-500 to-blue-700 text-white font-bold rounded-2xl hover:from-blue-400 hover:to-blue-600 transition-all shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 hidden">🔄 新游戏</button>
      <button id="undoBtn" class="px-8 py-3 bg-gradient-to-br from-emerald-500 to-teal-600 text-white font-bold rounded-2xl hover:from-emerald-400 hover:to-teal-500 transition-all shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 hidden">↩️ 悔棋</button>
    </div>
    
    <div class="text-gray-400 text-sm mt-1 bg-gray-800/60 px-5 py-2 rounded-xl max-w-md text-center">
      AI 使用 Minimax + Alpha-Beta 剪枝（深度 7）
      <span class="text-amber-400 ml-2">● 可落子位置</span>
    </div>
  </div>
`;

new Game();
