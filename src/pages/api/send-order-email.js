function escapeHtml(str) {
  return String(str ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function POST({ request }) {
  try {
    const {
      orderId,
      customerName,
      customerEmail,
      customerPhone,
      deliveryMethod,
      address,
      paymentMethod,
      items,
      totalPrice,
    } = await request.json();

    if (!customerEmail || !Array.isArray(items) || items.length === 0) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "缺少必要訂單參數 (customerEmail 或 items)",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const RESEND_API_KEY = import.meta.env.RESEND_API_KEY;
    const STORE_ADMIN_EMAIL = import.meta.env.STORE_ADMIN_EMAIL;

    if (!RESEND_API_KEY) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "伺服器未設定 Resend API Key",
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const recipients = [customerEmail, STORE_ADMIN_EMAIL].filter(Boolean);
    const shortId = orderId ? String(orderId).slice(0, 8) : "N/A";
    const formattedTotal = Number(totalPrice || 0).toFixed(2);
    const safeName = escapeHtml(customerName || "顧客");
    const safePhone = escapeHtml(customerPhone || "-");
    const safeEmail = escapeHtml(customerEmail);
    const safeDelivery = escapeHtml(deliveryMethod || "-");
    const safeAddress = escapeHtml(
      address || "店內自取 (留貨兩星期，開店期間憑單自取)"
    );
    const safePayment = escapeHtml(paymentMethod || "-");

    const itemsText = items
      .map((item) => {
        const curr = item.currency || "HK$";
        const qty = Number(item.quantity || 1);
        const unitPrice = Number(item.price || 0);
        const subtotal = (unitPrice * qty).toFixed(2);
        return `- ${item.title} × ${qty} — ${curr}${subtotal}`;
      })
      .join("\n");

    const itemsRowsHtml = items
      .map((item) => {
        const curr = escapeHtml(item.currency || "HK$");
        const qty = Number(item.quantity || 1);
        const unitPrice = Number(item.price || 0);
        const subtotal = (unitPrice * qty).toFixed(2);
        return `
          <tr>
            <td style="padding: 10px 8px; border-bottom: 1px solid #f0ece4; color: #2c2a27; font-size: 14px;">
              ${escapeHtml(item.title)}
            </td>
            <td style="padding: 10px 8px; border-bottom: 1px solid #f0ece4; color: #6e6960; font-size: 14px; text-align: center;">
              × ${qty}
            </td>
            <td style="padding: 10px 8px; border-bottom: 1px solid #f0ece4; color: #2c2a27; font-size: 14px; text-align: right; white-space: nowrap;">
              ${curr}${subtotal}
            </td>
          </tr>
        `;
      })
      .join("");

    const emailText = [
      `哈囉 ${customerName || "顧客"}：`,
      "",
      "感謝您的訂購！我們已收到您的訂單，以下為帳單與訂單詳細資訊：",
      "",
      "----------------------------------------",
      "【訂單摘要】",
      `訂單編號：#${shortId}`,
      `顧客姓名：${customerName || "-"}`,
      `聯絡電話：${customerPhone || "-"}`,
      `顧客電郵：${customerEmail}`,
      `取貨／送貨方式：${deliveryMethod || "-"}`,
      `收件資訊：${address || "店內自取 (留貨兩星期，開店期間憑單自取)"}`,
      `付款方式：${paymentMethod || "-"}`,
      `應付總額：HK$${formattedTotal}`,
      "",
      "【訂購明細】",
      itemsText,
      "----------------------------------------",
      "",
      "若有任何疑問，歡迎直接回覆此信件與我們聯絡。",
    ].join("\n");

    const emailHtml = `
      <!DOCTYPE html>
      <html lang="zh-Hant">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>訂單確認帳單 #${escapeHtml(shortId)}</title>
      </head>
      <body style="margin: 0; padding: 24px 12px; background-color: #f6f4ef; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans TC', sans-serif; color: #2c2a27;">
        <div style="max-width: 580px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e7e2d8; border-radius: 6px; overflow: hidden;">
          <!-- 頁首 -->
          <div style="padding: 24px 28px; border-bottom: 1px solid #efeae0; background-color: #fcfbf8;">
            <div style="font-size: 12px; letter-spacing: 1.5px; color: #9c7a44; text-transform: uppercase; margin-bottom: 6px;">
              ORDER CONFIRMATION
            </div>
            <h1 style="margin: 0; font-size: 20px; font-weight: 500; color: #2c2a27;">
              訂單確認與帳單明細
            </h1>
            <p style="margin: 6px 0 0; font-size: 13px; color: #7a746b;">
              訂單編號：#${escapeHtml(shortId)}
            </p>
          </div>

          <!-- 問候與訂單資訊 -->
          <div style="padding: 24px 28px;">
            <p style="margin: 0 0 12px; font-size: 14px; line-height: 1.7; color: #2c2a27;">
              哈囉 ${safeName}：
            </p>
            <p style="margin: 0 0 22px; font-size: 14px; line-height: 1.7; color: #5c574f;">
              感謝您的訂購！我們已收到您的訂單，以下為本次交易的帳單與取貨／付款資訊：
            </p>

            <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px; background-color: #faf8f4; border-radius: 4px;">
              <tr>
                <td style="padding: 8px 12px; font-size: 13px; color: #7a746b; width: 105px;">顧客姓名</td>
                <td style="padding: 8px 12px; font-size: 13px; color: #2c2a27;">${safeName}</td>
              </tr>
              <tr>
                <td style="padding: 8px 12px; font-size: 13px; color: #7a746b;">聯絡電話</td>
                <td style="padding: 8px 12px; font-size: 13px; color: #2c2a27;">${safePhone}</td>
              </tr>
              <tr>
                <td style="padding: 8px 12px; font-size: 13px; color: #7a746b;">電子郵件</td>
                <td style="padding: 8px 12px; font-size: 13px; color: #2c2a27;">${safeEmail}</td>
              </tr>
              <tr>
                <td style="padding: 8px 12px; font-size: 13px; color: #7a746b;">取貨／送貨</td>
                <td style="padding: 8px 12px; font-size: 13px; color: #2c2a27;">${safeDelivery}</td>
              </tr>
              <tr>
                <td style="padding: 8px 12px; font-size: 13px; color: #7a746b;">收件資訊</td>
                <td style="padding: 8px 12px; font-size: 13px; color: #2c2a27;">${safeAddress}</td>
              </tr>
              <tr>
                <td style="padding: 8px 12px; font-size: 13px; color: #7a746b;">付款方式</td>
                <td style="padding: 8px 12px; font-size: 13px; color: #2c2a27;">${safePayment}</td>
              </tr>
            </table>

            <!-- 訂購明細 -->
            <div style="font-size: 13px; font-weight: 600; color: #2c2a27; margin-bottom: 8px;">
              訂購明細
            </div>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 16px;">
              <thead>
                <tr>
                  <th style="padding: 8px; border-bottom: 1px solid #e2ddd3; text-align: left; font-size: 12px; font-weight: 500; color: #857f75;">商品</th>
                  <th style="padding: 8px; border-bottom: 1px solid #e2ddd3; text-align: center; font-size: 12px; font-weight: 500; color: #857f75;">數量</th>
                  <th style="padding: 8px; border-bottom: 1px solid #e2ddd3; text-align: right; font-size: 12px; font-weight: 500; color: #857f75;">小計</th>
                </tr>
              </thead>
              <tbody>
                ${itemsRowsHtml}
              </tbody>
            </table>

            <!-- 總計 -->
            <div style="display: flex; justify-content: space-between; align-items: baseline; padding: 14px 8px 4px; border-top: 1px solid #e2ddd3;">
              <span style="font-size: 14px; color: #5c574f;">應付總額</span>
              <span style="font-size: 18px; font-weight: 600; color: #9c7a44;">HK$${formattedTotal}</span>
            </div>
          </div>

          <!-- 頁尾 -->
          <div style="padding: 18px 28px; background-color: #fcfbf8; border-top: 1px solid #efeae0; font-size: 12px; line-height: 1.6; color: #857f75;">
            若對訂單、取貨安排或郵寄細節有任何疑問，歡迎直接回覆此信件與我們聯絡。
          </div>
        </div>
      </body>
      </html>
    `;

    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "空間客舍訂單通知 <noreply@studioslowpace.com>",
        to: recipients,
        subject: `【訂單確認】帳單明細 #${shortId}`,
        text: emailText,
        html: emailHtml,
      }),
    });

    const result = await resendResponse.json();

    if (resendResponse.ok) {
      return new Response(JSON.stringify({ success: true, data: result }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } else {
      console.error("Resend 訂單發信失敗:", result);
      return new Response(
        JSON.stringify({
          success: false,
          error: result.message || "發信失敗",
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  } catch (err) {
    console.error("訂單寄信 API 發生例外錯誤:", err?.message || err);
    return new Response(
      JSON.stringify({
        success: false,
        error: err?.message || String(err),
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}