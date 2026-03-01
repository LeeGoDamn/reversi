import './style.css';
import { Game } from './game/Game';

const app = document.getElementById('app')!;
app.innerHTML = `
  <div class="min-h-screen bg-gradient-to-br from-slate-800 via-emerald-900 to-slate-900 flex flex-col items-center justify-center gap-4 p-4">
    <h1 class="text-4xl md:text-5xl font-bold text-emerald-400 drop-shadow-lg">⚪ 黑白棋 ⚫</h1>
    
    <div id="score" class="text-2xl font-bold text-white bg-slate-700/50 px-6 py-2 rounded-lg">⚫ 2 : 2 ⚪</div>
    
    <div id="status" class="text-center text-slate-900 text-xl font-bold min-h-12 bg-amber-200 px-8 py-3 rounded-xl shadow-lg border-2 border-amber-400">选择先后手</div>
    
    <canvas id="gameCanvas" width="520" height="520" class="bg-emerald-600 border-4 border-emerald-800 rounded-xl shadow-2xl"></canvas>
    
    <div class="flex flex-wrap gap-4 justify-center">
      <button id="blackBtn" class="px-8 py-3 bg-slate-800 text-white font-bold rounded-xl hover:bg-slate-700 transition-all shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 border-2 border-slate-600">⚫ 执黑先手</button>
      <button id="whiteBtn" class="px-8 py-3 bg-slate-100 text-slate-800 font-bold rounded-xl hover:bg-white transition-all shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 border-2 border-slate-300">⚪ 执白后手</button>
      <button id="resetBtn" class="px-8 py-3 bg-blue-500 text-white font-bold rounded-xl hover:bg-blue-600 transition-all shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 hidden">🔄 新游戏</button>
      <button id="undoBtn" class="px-8 py-3 bg-emerald-500 text-white font-bold rounded-xl hover:bg-emerald-600 transition-all shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 hidden">↩️ 悔棋</button>
    </div>
    
    <div class="text-slate-300 text-sm mt-2 bg-slate-700/50 px-4 py-2 rounded-lg max-w-md text-center">
      AI 使用 Minimax + Alpha-Beta 剪枝算法（搜索深度 7）<br>
      <span class="text-slate-400">黄色圆点表示可落子位置</span>
    </div>
  </div>
`;

new Game();
