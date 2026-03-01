import './style.css';
import { Game } from './game/Game';

const app = document.getElementById('app')!;
app.innerHTML = `
  <div class="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 flex flex-col items-center justify-center gap-5 p-6">
    <div class="flex items-center gap-4">
      <h1 class="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent drop-shadow-lg">黑白棋</h1>
      <button id="menuBtn" class="p-2 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 transition-colors border border-gray-700" title="菜单">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
        </svg>
      </button>
    </div>
    
    <div id="score" class="text-2xl font-bold text-gray-100 bg-gray-800/80 px-8 py-3 rounded-2xl shadow-xl border border-gray-700">⚫ 2 : 2 ⚪</div>
    
    <div id="status" class="text-center text-gray-900 text-lg font-bold min-h-12 bg-gradient-to-r from-amber-100 to-amber-200 px-8 py-3 rounded-2xl shadow-lg border-2 border-amber-400">⚫ 轮到你了</div>
    
    <canvas id="gameCanvas" width="710" height="710" class="rounded-2xl shadow-2xl border-4 border-gray-700"></canvas>
    
    <div class="flex flex-wrap gap-4 justify-center mt-2">
      <button id="resetBtn" class="px-8 py-3 bg-gradient-to-br from-blue-500 to-blue-700 text-white font-bold rounded-2xl hover:from-blue-400 hover:to-blue-600 transition-all shadow-lg hover:shadow-xl hover:scale-105 active:scale-95">🔄 新游戏</button>
      <button id="undoBtn" class="px-8 py-3 bg-gradient-to-br from-emerald-500 to-teal-600 text-white font-bold rounded-2xl hover:from-emerald-400 hover:to-teal-500 transition-all shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100">↩️ 悔棋</button>
    </div>
    
    <div class="text-gray-400 text-sm mt-1 bg-gray-800/60 px-5 py-2 rounded-xl max-w-md text-center">
      AI 使用 Minimax + Alpha-Beta 剪枝（深度 7）
      <span class="text-amber-400 ml-2">● 可落子位置</span>
    </div>

    <!-- 菜单弹窗 -->
    <div id="menuModal" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 hidden">
      <div class="bg-gray-800 rounded-2xl p-6 shadow-2xl border border-gray-700 max-w-sm w-full mx-4">
        <h3 class="text-xl font-bold text-white mb-4 text-center">⚙️ 游戏设置</h3>
        <div class="space-y-3">
          <button id="switchColorBtn" class="w-full px-6 py-3 bg-gradient-to-br from-purple-500 to-indigo-600 text-white font-bold rounded-xl hover:from-purple-400 hover:to-indigo-500 transition-all">
            🔄 切换执子
          </button>
          <button id="closeMenuBtn" class="w-full px-6 py-3 bg-gray-700 text-gray-300 font-bold rounded-xl hover:bg-gray-600 transition-all">
            关闭
          </button>
        </div>
      </div>
    </div>

    <!-- 确认弹窗 -->
    <div id="confirmModal" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 hidden">
      <div class="bg-gray-800 rounded-2xl p-6 shadow-2xl border border-gray-700 max-w-sm w-full mx-4">
        <h3 class="text-xl font-bold text-white mb-2 text-center">确认新游戏？</h3>
        <p class="text-gray-400 text-center mb-4">当前棋局将被重置</p>
        <div class="flex gap-3">
          <button id="cancelNewGameBtn" class="flex-1 px-6 py-3 bg-gray-700 text-gray-300 font-bold rounded-xl hover:bg-gray-600 transition-all">取消</button>
          <button id="confirmNewGameBtn" class="flex-1 px-6 py-3 bg-gradient-to-br from-red-500 to-rose-600 text-white font-bold rounded-xl hover:from-red-400 hover:to-rose-500 transition-all">确认</button>
        </div>
      </div>
    </div>
  </div>
`;

new Game();
