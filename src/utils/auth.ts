import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://blqlrxqckiuvgevmakbu.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_qFXwpuGChVdRwjc9K7prVQ_PgYmlnpG';
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export const TABLE_NAME = 'slowpace_members';

// 取得當前登入者與其客舍會員資料
export async function getCurrentMember() {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session || !session.user) return null;

  const authUser = session.user;
  const { data: profile } = await supabase
    .from(TABLE_NAME)
    .select('*')
    .eq('user_id', authUser.id)
    .single();

  return { authUser, profile };
}

/**
 * 共用登出與訪客清理函式（可在全站任何頁面呼叫）
 */
export async function logoutAndCleanGuest() {
  const guestId = sessionStorage.getItem('space_guest_id');

  // 如果是訪客身分，從 Supabase 的 slowpace_members 刪除該筆暫存資料
  if (guestId) {
    try {
      const { error } = await supabase
        .from(TABLE_NAME)
        .delete()
        .eq('user_id', guestId);
      
      if (error) {
        console.error("刪除訪客資料失敗:", error.message);
      }
    } catch (err) {
      console.error("刪除訪客資料發生異常:", err);
    }
  }

  // 清除本地儲存
  sessionStorage.clear();
  localStorage.removeItem('verified_chat_contact');
  localStorage.removeItem('verified_chat_name');
  
  // 登出 Supabase 官方會員身分 (若是正式會員)
  await supabase.auth.signOut();
  
  // 重新整理或跳轉回登入頁面
  window.location.href = '/login';
}