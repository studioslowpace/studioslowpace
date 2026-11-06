import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://blqlrxqckiuvgevmakbu.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_qFXwpuGChVdRwjc9K7prVQ_PgYmlnpG';
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export const TABLE_NAME = 'slowsplace_member';

// 檢查當前是否有登入的 User
export async function getCurrentUser() {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return null;

  const authUser = session.user;
  // 順便撈出 slowsplace_member 裡的對應詳細資料（稱號、權限、閱讀記錄等）
  const { data: profile } = await supabase
    .from(TABLE_NAME)
    .select('*')
    .eq('user_id', authUser.id)
    .single();

  return { authUser, profile };
}