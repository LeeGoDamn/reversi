import './style.css';
import { Game } from './game/Game';

const app = document.getElementById('app')!;
app.innerHTML = `
  <div class="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-zinc-900 flex flex-col items-center justify-center gap-4 p-4">
    <div class="flex items-center gap-3">
      <h1 class="text-3xl md:text-4xl font-bold text-white tracking-wide">黑白棋</h1>
      <button id="menuBtn" class="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors border border-white/20" title="菜单">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
        </svg>
      </button>
    </div>
    
    <div id="score" class="text-xl font-bold bg-white/10 backdrop-blur-sm px-6 py-2 rounded-full border border-white/20">⚫ 2 : 2 ⚪</div>
    
    <div id="status" class="text-center text-base font-medium min-h-10 bg-emerald-600/90 px-6 py-2 rounded-full shadow-lg">⚫ 轮到你了</div>
    
    <div class="relative">
      <canvas id="gameCanvas" width="710" height="710" class="rounded-3xl shadow-2xl"></canvas>
      <div class="absolute inset-0 rounded-3xl pointer-events-none border-4 border-white/10"></div>
    </div>
    
    <div class="flex gap-3">
      <button id="resetBtn" class="px-6 py-2.5 bg-white/20 hover:bg-white/30 text-white font-medium rounded-full transition-all border border-white/30 hover:border-white/50 shadow-lg">🔄 新游戏</button>
      <button id="undoBtn" class="px-6 py-2.5 bg-white/20 hover:bg-white/30 text-white font-medium rounded-full transition-all border border-white/30 hover:border-white/50 shadow-lg disabled:opacity-30 disabled:cursor-not-allowed">↩️ 悔棋</button>
    </div>
    
    <div class="text-white/40 text-xs bg-white/5 px-4 py-1.5 rounded-full">
      AI · Minimax + Alpha-Beta · 深度 7
      <span class="text-amber-400 ml-2">● 可落子</span>
    </div>

    <!-- 菜单弹窗 -->
    <div id="menuModal" class="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 hidden">
      <div class="bg-slate-800 rounded-2xl p-5 shadow-2xl border border-white/10 max-w-xs w-full mx-4">
        <h3 class="text-lg font-bold text-white mb-4 text-center">设置</h3>
        <div class="space-y-2">
          <button id="switchColorBtn" class="w-full px-5 py-2.5 bg-violet-600 hover:bg-violet-500 text-white font-medium rounded-xl transition-all">切换执子</button>
          <button id="closeMenuBtn" class="w-full px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white/70 font-medium rounded-xl transition-all">关闭</button>
        </div>
      </div>
    </div>

    <!-- 确认弹窗 -->
    <div id="confirmModal" class="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 hidden">
      <div class="bg-slate-800 rounded-2xl p-5 shadow-2xl border border-white/10 max-w-xs w-full mx-4">
        <h3 class="text-lg font-bold text-white mb-1 text-center">确认新游戏？</h3>
        <p class="text-white/50 text-sm text-center mb-4">当前棋局将被重置</p>
        <div class="flex gap-2">
          <button id="cancelNewGameBtn" class="flex-1 px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white/70 font-medium rounded-xl transition-all">取消</button>
          <button id="confirmNewGameBtn" class="flex-1 px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white font-medium rounded-xl transition-all">确认</button>
        </div>
      </div>
    </div>
  </div>
`;

new Game();
