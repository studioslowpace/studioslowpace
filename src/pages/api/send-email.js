export async function POST({ request }) {
  try {
    const { toEmail, toName, taskTitle, heroName, heroContact } = await request.json();

    if (!toEmail || !taskTitle) {
      return new Response(JSON.stringify({ success: false, error: "缺少必要參數 (toEmail 或 taskTitle)" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const mailChannelsPayload = {
      personalizations: [
        {
          to: [{ email: toEmail, name: toName || "任務發起人" }],
        },
      ],
      // ⚠️ 確保這裡的網域是 studioslowpace.com
      from: { email: "noreply@studioslowpace.com", name: "鄰里萬事屋" },
      subject: `【萬事屋通知】你的任務「${taskTitle}」已被接單！`,
      content: [
        {
          type: "text/plain",
          value: `哈囉 ${toName || "鄰里人"}：\n\n太棒了！你的任務「${taskTitle}」剛剛有鄰里英雄 ${heroName}（聯絡方式：${heroContact}）接單囉！\n\n請盡快與他聯繫並完成後續互動！\n\n- 鄰里萬事屋團隊`,
        },
      ],
    };

    const mailResponse = await fetch("https://api.mailchannels.net/tx/v1/send", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Accept": "application/json",
        "User-Agent": "Cloudflare-Worker-MailChannels-Client"
      },
      body: JSON.stringify(mailChannelsPayload),
    });

    if (mailResponse.ok) {
      return new Response(JSON.stringify({ success: true }), {
        headers: { "Content-Type": "application/json" },
      });
    } else {
      // 💡 抓取 MailChannels 回傳的真實錯誤文字
      const errorText = await mailResponse.text();
      console.error("MailChannels 拒絕發信:", errorText);
      return new Response(JSON.stringify({ success: false, error: `MailChannels 錯誤: ${errorText}` }), {
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