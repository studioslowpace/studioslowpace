export async function POST({ request }) {
  try {
    const { toEmail, toName, taskTitle, heroName, heroContact } = await request.json();

    if (!toEmail || !taskTitle) {
      return new Response(JSON.stringify({ success: false, error: "缺少必要參數 (toEmail 或 taskTitle)" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // 呼叫 Resend 發信 API
    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "re_bZzVTVy8_7Q42tT9J59Hs53sZrPxZmRzV", // 👈 請把這裡換成你從 Resend 複製的 API Key
      },
      body: JSON.stringify({
        from: "鄰里萬事屋 <noreply@studioslowpace.com>", // 測試時可先用 Resend 官方驗證網域
        to: [toEmail],
        subject: `【萬事屋通知】你的任務「${taskTitle}」已被接單！`,
        text: `哈囉 ${toName || "鄰里人"}：\n\n太棒了！你的任務「${taskTitle}」剛剛有鄰里英雄 ${heroName}（聯絡方式：${heroContact}）接單囉！\n\n請盡快與他聯繫並完成後續互動！\n\n- 鄰里萬事屋團隊`,
      }),
    });

    const result = await resendResponse.json();

    if (resendResponse.ok) {
      return new Response(JSON.stringify({ success: true }), {
        headers: { "Content-Type": "application/json" },
      });
    } else {
      console.error("Resend 發信失敗:", result);
      return new Response(JSON.stringify({ success: false, error: result.message || "發信失敗" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  } catch (err) {
    console.error("API 執行發生例外錯誤:", err.message);
    return new Response(JSON.stringify({ success: false, error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}