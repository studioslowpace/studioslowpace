
import { supabase } from '../lib/supabase';

const LOGS_TABLE = 'reading_record';

/**
 * 從 Supabase 取得指定使用者的閱讀記錄
 * @param {string} targetUserId - 目標玩家的 user_id
 */
export async function fetchUserReadingLogs(targetUserId) {
  if (!targetUserId) return [];
  
  const { data, error } = await supabase
    .from(LOGS_TABLE)
    .select('*')
    .eq('user_id', targetUserId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('抓取閱讀記錄失敗:', error.message);
    return [];
  }
  return data || [];
}

/**
 * 新增一筆閱讀記錄到 Supabase
 * @param {string} userId - 當前登入者的 user_id
 * @param {Object} logData - 包含 book_title, author, current_page, total_pages, quote, review
 */
export async function addReadingLog(userId, logData) {
  if (!userId) return { success: false, error: '未登入使用者' };

  const { data, error } = await supabase
    .from(LOGS_TABLE)
    .insert({
      user_id: userId,
      book_title: logData.book_title,
      author: logData.author || '佚名',
      current_page: logData.current_page || 0,
      total_pages: logData.total_pages || 1,
      quote: logData.quote || '',
      review: logData.review || ''
    })
    .select()
    .single();

  if (error) {
    console.error('新增閱讀記錄失敗:', error.message);
    return { success: false, error: error.message };
  }
  return { success: true, data };
}

/**
 * 渲染「個人」的閱讀記錄清單
 */
export async function renderMyLogs(userId, logListContainer, detailContent, detailModal) {
  if (!logListContainer) return;
  logListContainer.innerHTML = '<div style="color:#94a3b8; text-align:center; padding:15px;">載入記錄中...</div>';

  const myLogs = await fetchUserReadingLogs(userId);

  if (myLogs.length === 0) {
    logListContainer.innerHTML = '<div style="color:#64748b; font-size:12px; text-align:center; padding:15px;">目前尚無閱讀記錄</div>';
    return;
  }

  let html = '';
  myLogs.forEach((item) => {
    html += `
      <div class="log-item-card" data-id="${item.id}" style="background:var(--bg-main); border:1px solid var(--border-color); padding:10px 12px; border-radius:8px; cursor:pointer; margin-bottom:6px;">
        <div style="display:flex; flex-wrap:wrap; align-items:baseline; gap:8px;">
          <span style="font-weight:bold; color:var(--accent-color); font-size:14px;">《${item.book_title}》</span>
          <span style="font-size:12px; color:#cbd5e1;">作者：${item.author}</span>
        </div>
      </div>
    `;
  });
  logListContainer.innerHTML = html;

  // 點擊紀錄查看詳情
  logListContainer.querySelectorAll('.log-item-card').forEach(card => {
    card.addEventListener('click', (e) => {
      const logId = e.currentTarget.dataset.id;
      const log = myLogs.find(l => l.id === logId);
      if (log && detailContent) {
        const dateStr = new Date(log.created_at).toLocaleDateString();
        detailContent.innerHTML = `
          <p style="font-size:14px;"><strong>書名：</strong>《${log.book_title}》</p>
          <p style="font-size:13px;"><strong>作者：</strong>${log.author}</p>
          <p style="font-size:13px;"><strong>閱讀進度：</strong>第 ${log.current_page} / ${log.total_pages} 頁</p>
          <p style="font-size:13px;"><strong>書摘：</strong><br><span style="color:#38bdf8;">“ ${log.quote || '無'} ”</span></p>
          <p style="font-size:13px;"><strong>讀後感：</strong><br>${log.review || '無心得'}</p>
          <p style="font-size:11px; color:#64748b; text-align:right;">記錄日期：${dateStr}</p>
        `;
        if (detailModal) detailModal.style.display = 'flex';
      }
    });
  });
}

/**
 * 彈窗查看「其他書友 (Peer)」的專屬閱讀記錄
 */
export async function openPeerLogs(peerUserId, peerName, peerRole, peerModalTitle, peerContentBox, peerModal) {
  if (peerModalTitle) peerModalTitle.textContent = `📖 ${peerName} (${peerRole}) 的閱讀記錄`;
  if (peerContentBox) {
    peerContentBox.innerHTML = '<div style="color:#94a3b8; text-align:center; padding:20px;">載入記錄中...</div>';
  }
  if (peerModal) peerModal.style.display = 'flex';

  const peerLogs = await fetchUserReadingLogs(peerUserId);

  if (peerContentBox) {
    if (!peerLogs || peerLogs.length === 0) {
      peerContentBox.innerHTML = '<div style="color:#94a3b8; text-align:center; padding:20px;">這位書友目前還沒有新增閱讀記錄。</div>';
      return;
    }

    let html = '';
    peerLogs.forEach((item) => {
      html += `
        <div style="background:var(--bg-main); border:1px solid var(--border-color); padding:8px; border-radius:6px; margin-bottom:6px;">
          <div style="font-weight:bold; color:var(--accent-color);">《${item.book_title}》 / ${item.author}</div>
          <div style="font-size:11px; color:#cbd5e1; margin-top:2px;">進度：第 ${item.current_page}/${item.total_pages} 頁</div>
          ${item.quote ? `<div style="font-size:11px; color:#38bdf8; margin-top:4px;">“ ${item.quote} ”</div>` : ''}
        </div>
      `;
    });
    peerContentBox.innerHTML = html;
  }
}