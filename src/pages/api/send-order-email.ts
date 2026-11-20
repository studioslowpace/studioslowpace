import type { APIRoute } from "astro";

interface OrderItem {
  title: string;
  quantity: number;
  price: number;
  currency?: string;
}

export const POST: APIRoute = async ({ request }) => {
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

    const itemsText = items
      .map((item: OrderItem) => {
        const curr = item.currency || "HK$";
        const qty = Number(item.quantity || 1);
        const unitPrice = Number(item.price || 0);
        const subtotal = (unitPrice * qty).toFixed(2);
        return `- ${item.title} × ${qty} — ${curr}${subtotal}`;
      })
      .join("\n");

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

    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "書店訂單通知 <noreply@studioslowpace.com>",
        to: recipients,
        subject: `【訂單確認】帳單明細 #${shortId}`,
        text: emailText,
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
  } catch (err: any) {
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
};