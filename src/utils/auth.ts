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