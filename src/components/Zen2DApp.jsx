import React, { useEffect, useState } from 'react';
import * as Tone from 'tone';

export default function Zen2DApp() {
  const [isAudioActive, setIsAudioActive] = useState(false);
  const [roomNumber, setRoomNumber] = useState(98);
  const [onlineCount, setOnlineCount] = useState(5);
  const [moktakCount, setMoktakCount] = useState(0);
  const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);
  const [isPeopleModalOpen, setIsPeopleModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('靜心閱讀，細品慢活 🍵');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  // 輕量音訊控制 (Tone.js)
  const toggleAudio = async () => {
    await Tone.start();
    const newState = !isAudioActive;
    setIsAudioActive(newState);
    showToast(newState ? '環境音與沉浸音效已開啟 🌿' : '音訊已暫停');
  };

  const handleMoktakClick = () => {
    const synth = new Tone.Synth({
      oscillator: { type: 'sine' },
      envelope: { attack: 0.001, decay: 0.15, sustain: 0, release: 0.1 }
    }).toDestination();
    synth.triggerAttackRelease('C5', '8n');
    setMoktakCount((prev) => prev + 1);
    showToast(`敲擊木魚 🪵 (${moktakCount + 1})`);
  };

  const handleChantInvite = () => {
    const metalSynth = new Tone.MetalSynth({
      frequency: 220,
      envelope: { attack: 0.001, decay: 1.8, release: 1.5 },
      harmonicity: 5.1,
      modulationIndex: 32,
      resonance: 4000,
      octaves: 1.5
    }).toDestination();
    metalSynth.triggerAttackRelease('A2', '2n');
    showToast('敲響清淨頌缽 🔔 靜心聆聽');
  };

  return (
    <main className="relative w-full h-screen overflow-hidden select-none font-serif bg-[#eeece3] text-[#4d5144] flex flex-col justify-between p-6 md:p-10">
      
      {/* 背景裝飾與微風浮動光影 */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-center opacity-40">
        <div className="w-[600px] h-[600px] bg-[#dfd8c2] rounded-full blur-3xl animate-pulse" />
      </div>

      {/* 頂部導覽列 */}
      <header className="relative z-20 flex items-center justify-between w-full max-w-5xl mx-auto">
        <div className="flex items-center gap-3 bg-[#eeece3]/90 backdrop-blur-md px-5 py-2.5 rounded-full border border-[#d6d2c4] shadow-sm">
          <a href="/" className="p-1.5 hover:bg-[#ded9c7] rounded-full transition" title="返回主站">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" /></svg>
          </a>
          <button onClick={() => setIsRoomModalOpen(true)} className="flex items-center gap-1.5 font-medium text-sm hover:opacity-80 transition">
            <span>靜舍</span>
            <span className="bg-[#dfd8c2] px-2.5 py-0.5 rounded-full text-xs font-semibold">伺服器 {roomNumber}</span>
          </button>
          <button onClick={() => setIsPeopleModalOpen(true)} className="flex items-center gap-1.5 text-xs text-[#64664f] bg-[#e3ded0] px-3 py-1 rounded-full hover:bg-[#d8d2c2] transition">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
            <span>{onlineCount}/100 人共讀中</span>
          </button>
        </div>

        <div className="bg-[#eeece3]/90 backdrop-blur-md p-2 rounded-full border border-[#d6d2c4] shadow-sm">
          <button onClick={toggleAudio} className={`p-2.5 rounded-full transition ${isAudioActive ? 'bg-[#4d5144] text-[#eeece3]' : 'hover:bg-[#ded9c7]'}`} title="聲音開關">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.757 3.63 8.25 4.51 8.25H6.75z" /></svg>
          </button>
        </div>
      </header>

      {/* 中央主視覺與心境區塊 */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center my-auto px-4">
        <button onClick={handleChantInvite} className="group bg-[#5c4033] text-[#eeece3] px-6 py-2.5 rounded-full text-sm font-medium shadow-md hover:bg-[#4a3328] transition flex items-center gap-2 mb-8 transform hover:-translate-y-0.5 duration-200">
          <span>🔔 敲響頌缽 靜心聆聽</span>
        </button>

        <div className="max-w-md mx-auto space-y-3">
          <h1 className="text-2xl md:text-3xl font-normal tracking-wide text-[#3a3d32]">「 靜舍 · 共讀空間 」</h1>
          <p className="text-sm text-[#737666] leading-relaxed">
            在這裡，我們不急著翻頁。<br />與各地同行者靜靜坐著，點一盞心燈，讀一本書。
          </p>
        </div>

        {toastMessage && (
          <div className="mt-6 bg-[#4d5144]/90 text-[#eeece3] text-xs px-4 py-1.5 rounded-full shadow-sm animate-fade-in">
            {toastMessage}
          </div>
        )}
      </div>

      {/* 底部互動工具塢 */}
      <footer className="relative z-20 flex flex-col items-center gap-3 w-full">
        <nav className="flex items-center gap-2 bg-[#eeece3]/90 backdrop-blur-md p-2 rounded-2xl border border-[#d6d2c4] shadow-lg">
          <button onClick={() => showToast('雙手合十，向線上夥伴致意 🙏')} className="flex items-center gap-2 px-4 py-2.5 rounded-xl hover:bg-[#ded9c7] transition text-sm font-medium">
            <span>🙏</span><span>合十問候</span>
          </button>
          <div className="w-[1px] h-6 bg-[#d6d2c4]" />
          <button onClick={handleMoktakClick} className="flex items-center gap-2 px-4 py-2.5 rounded-xl hover:bg-[#ded9c7] transition text-sm font-medium">
            <span>🪵</span><span>敲敲木魚</span><span className="text-xs bg-[#dfd8c2] px-2 py-0.5 rounded font-mono">{moktakCount}</span>
          </button>
          <div className="w-[1px] h-6 bg-[#d6d2c4]" />
          <button onClick={() => showToast('開啟今日共讀筆記卡片 📖')} className="flex items-center gap-2 px-4 py-2.5 rounded-xl hover:bg-[#ded9c7] transition text-sm font-medium">
            <span>📖</span><span>共讀隨筆</span>
          </button>
        </nav>
      </footer>

      {/* 伺服器選擇 Modal */}
      {isRoomModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
          <div className="bg-[#eeece3] border border-[#d6d2c4] rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">選擇共讀伺服器</h3>
              <button onClick={() => setIsRoomModalOpen(false)} className="p-1 hover:bg-[#ded9c7] rounded-full">✕</button>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 98].map((num) => (
                <button key={num} onClick={() => { setRoomNumber(num); setIsRoomModalOpen(false); showToast(`已切換至 靜舍伺服器 ${num}`); }} className={`py-2.5 rounded-xl text-sm font-medium transition border ${roomNumber === num ? 'bg-[#4d5144] text-[#eeece3] border-[#4d5144]' : 'bg-[#e3ded0] hover:bg-[#d8d2c2] border-transparent'}`}>
                  {num}號房
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 訪客列表 Modal */}
      {isPeopleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
          <div className="bg-[#eeece3] border border-[#d6d2c4] rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">當前共讀夥伴 ({onlineCount})</h3>
              <button onClick={() => setIsPeopleModalOpen(false)} className="p-1 hover:bg-[#ded9c7] rounded-full">✕</button>
            </div>
            <ul className="space-y-2 text-sm">
              {['✨ 靜謐微風', '🍵 溫熱茶水', '🌿 青翠松葉', '☁️ 緩慢雲朵', '📖 閱讀中的旅人'].map((name, i) => (
                <li key={i} className="flex items-center justify-between p-2.5 rounded-xl bg-[#e3ded0]/60">
                  <span>{name}</span><span className="text-xs text-[#838677]">正在靜心閱讀</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </main>
  );
}