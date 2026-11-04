import React, { useState } from 'react';
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
    <div style={{ backgroundColor: '#eeece3', color: '#4d5144', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '24px', fontFamily: 'serif', position: 'relative', overflow: 'hidden' }}>
      
      {/* 頂部導覽列 */}
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'between', width: '100%', maxWidth: '960px', margin: '0 auto', zIndex: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(238, 236, 227, 0.9)', backdropFilter: 'blur(8px)', padding: '10px 20px', borderRadius: '9999px', border: '1px solid #d6d2c4', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
          <a href="/" style={{ padding: '6px', borderRadius: '50%', textDecoration: 'none', color: inherit }} title="返回主站">
            <svg style={{ width: '20px', height: '20px' }} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" /></svg>
          </a>
          <button onClick={() => setIsRoomModalOpen(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', fontWeight: '500', color: '#4d5144' }}>
            <span>靜舍</span>
            <span style={{ background: '#dfd8c2', padding: '2px 10px', borderRadius: '9999px', fontSize: '12px', fontWeight: '600' }}>伺服器 {roomNumber}</span>
          </button>
          <button onClick={() => setIsPeopleModalOpen(true)} style={{ background: '#e3ded0', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#64664f', padding: '4px 12px', borderRadius: '9999px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#059669' }}></span>
            <span>{onlineCount}/100 人共讀中</span>
          </button>
        </div>

        <div style={{ background: 'rgba(238, 236, 227, 0.9)', backdropFilter: 'blur(8px)', padding: '8px', borderRadius: '50%', border: '1px solid #d6d2c4' }}>
          <button onClick={toggleAudio} style={{ background: isAudioActive ? '#4d5144' : 'transparent', color: isAudioActive ? '#eeece3' : '#4d5144', border: 'none', cursor: 'pointer', padding: '10px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }} title="聲音開關">
            <svg style={{ width: '16px', height: '16px' }} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.757 3.63 8.25 4.51 8.25H6.75z" /></svg>
          </button>
        </div>
      </header>

      {/* 中央主視覺與心境區塊 */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', margin: 'auto 0', padding: '20px' }}>
        <button onClick={handleChantInvite} style={{ backgroundColor: '#5c4033', color: '#eeece3', padding: '10px 24px', borderRadius: '9999px', fontSize: '14px', fontWeight: '500', border: 'none', cursor: 'pointer', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', marginBottom: '32px' }}>
          🔔 敲響頌缽 靜心聆聽
        </button>

        <div style={{ maxWidth: '400px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 'normal', letterSpacing: '1px', color: '#3a3d32', marginBottom: '12px' }}>「 靜舍 · 共讀空間 」</h1>
          <p style={{ fontSize: '14px', color: '#737666', lineHeight: '1.6', margin: 0 }}>
            在這裡，我們不急著翻頁。<br />與各地同行者靜靜坐著，點一盞心燈，讀一本書。
          </p>
        </div>

        {toastMessage && (
          <div style={{ marginTop: '24px', backgroundColor: 'rgba(77, 81, 68, 0.9)', color: '#eeece3', fontSize: '12px', padding: '6px 16px', borderRadius: '9999px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            {toastMessage}
          </div>
        )}
      </div>

      {/* 底部互動工具塢 */}
      <footer style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', paddingBottom: '20px', zIndex: 20 }}>
        <nav style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(238, 236, 227, 0.9)', backdropFilter: 'blur(8px)', padding: '8px', borderRadius: '16px', border: '1px solid #d6d2c4', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}>
          <button onClick={() => showToast('雙手合十，向線上夥伴致意 🙏')} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', borderRadius: '12px', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '14px', fontWeight: '500', color: '#4d5144' }}>
            <span>🙏</span><span>合十問候</span>
          </button>
          <div style={{ width: '1px', height: '24px', backgroundColor: '#d6d2c4' }} />
          <button onClick={handleMoktakClick} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', borderRadius: '12px', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '14px', fontWeight: '500', color: '#4d5144' }}>
            <span>🪵</span><span>敲敲木魚</span><span style={{ fontSize: '12px', backgroundColor: '#dfd8c2', padding: '2px 8px', borderRadius: '4px', fontFamily: 'monospace' }}>{moktakCount}</span>
          </button>
          <div style={{ width: '1px', height: '24px', backgroundColor: '#d6d2c4' }} />
          <button onClick={() => showToast('開啟今日共讀筆記卡片 📖')} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', borderRadius: '12px', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '14px', fontWeight: '500', color: '#4d5144' }}>
            <span>📖</span><span>共讀隨筆</span>
          </button>
        </nav>
      </footer>

      {/* 伺服器選擇 Modal */}
      {isRoomModalOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(4px)', padding: '16px' }}>
          <div style={{ backgroundColor: '#eeece3', border: '1px solid #d6d2c4', borderRadius: '16px', padding: '24px', width: '100%', maxWidth: '400px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '500', margin: 0 }}>選擇共讀伺服器</h3>
              <button onClick={() => setIsRoomModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px', padding: '4px' }}>✕</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, minmax(0, 1fr))', gap: '8px' }}>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 98].map((num) => (
                <button key={num} onClick={() => { setRoomNumber(num); setIsRoomModalOpen(false); showToast(`已切換至 靜舍伺服器 ${num}`); }} style={{ padding: '10px 0', borderRadius: '12px', fontSize: '14px', fontWeight: '500', cursor: 'pointer', border: '1px solid transparent', backgroundColor: roomNumber === num ? '#4d5144' : '#e3ded0', color: roomNumber === num ? '#eeece3' : '#4d5144' }}>
                  {num}號房
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 訪客列表 Modal */}
      {isPeopleModalOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(4px)', padding: '16px' }}>
          <div style={{ backgroundColor: '#eeece3', border: '1px solid #d6d2c4', borderRadius: '16px', padding: '24px', width: '100%', maxWidth: '360px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '500', margin: 0 }}>當前共讀夥伴 ({onlineCount})</h3>
              <button onClick={() => setIsPeopleModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px', padding: '4px' }}>✕</button>
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14px' }}>
              {['✨ 靜謐微風', '🍵 溫熱茶水', '🌿 青翠松葉', '☁️ 緩慢雲朵', '📖 閱讀中的旅人'].map((name, i) => (
                <li key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', borderRadius: '12px', backgroundColor: 'rgba(227, 222, 208, 0.6)' }}>
                  <span>{name}</span><span style={{ fontSize: '12px', color: '#838677' }}>正在靜心閱讀</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}