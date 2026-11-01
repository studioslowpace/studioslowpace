export async function POST({ request }) {
  try {
    const { toEmail, toName, taskTitle, heroName, heroContact } = await request.json();

    if (!toEmail || !taskTitle) {
      return new Response(JSON.stringify({ error: "缺少必要參數" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // MailChannels 官方免費發信 API 酬載
    const mailChannelsPayload = {
      personalizations: [
        {
          to: [{ email: toEmail, name: toName || "任務發起人" }],
        },
      ],
      // ⚠️ 請記得把這裡換成你在 Cloudflare 有管轄的真實網域信箱
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
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(mailChannelsPayload),
    });

    if (mailResponse.ok) {
      return new Response(JSON.stringify({ success: true }), {
        headers: { "Content-Type": "application/json" },
      });
    } else {
      const errorText = await mailResponse.text();
      return new Response(JSON.stringify({ success: false, error: errorText }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  } catch (err) {
    return new Response(JSON.stringify({ success: false, error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}