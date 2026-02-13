import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

const FROM_EMAIL = process.env.EMAIL_FROM || "Bunshin 3D <noreply@bunshin3d.com>";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://bunshin3d.com";

type PaymentConfirmationParams = {
  email: string;
  locale: string;
  credits: number;
  packId: string;
  amount: number;
  currency: string;
};

const packNames: Record<string, Record<string, string>> = {
  discovery: { en: "Discovery", fr: "Découverte", es: "Descubrimiento", de: "Entdeckung", ja: "ディスカバリー", zh: "探索" },
  creator: { en: "Creator", fr: "Créateur", es: "Creador", de: "Kreator", ja: "クリエイター", zh: "创作者" },
  studio: { en: "Studio", fr: "Studio", es: "Estudio", de: "Studio", ja: "スタジオ", zh: "工作室" },
};

const translations: Record<string, {
  subject: string;
  greeting: string;
  thankYou: string;
  summary: string;
  pack: string;
  credits: string;
  amount: string;
  creditsReady: string;
  cta: string;
  footer: string;
  team: string;
}> = {
  en: {
    subject: "Payment Confirmed - {credits} Credits Added",
    greeting: "Hi,",
    thankYou: "Thank you for your purchase! Your payment has been processed successfully.",
    summary: "Order Summary",
    pack: "Pack",
    credits: "Credits",
    amount: "Amount Paid",
    creditsReady: "Your {credits} credits are now available in your account and ready to use.",
    cta: "Go to Studio",
    footer: "This email was sent by Bunshin 3D. If you did not make this purchase, please contact us immediately.",
    team: "The Bunshin 3D Team",
  },
  fr: {
    subject: "Paiement confirmé - {credits} crédits ajoutés",
    greeting: "Bonjour,",
    thankYou: "Merci pour votre achat ! Votre paiement a été traité avec succès.",
    summary: "Récapitulatif de commande",
    pack: "Pack",
    credits: "Crédits",
    amount: "Montant payé",
    creditsReady: "Vos {credits} crédits sont maintenant disponibles sur votre compte et prêts à être utilisés.",
    cta: "Aller au Studio",
    footer: "Cet email a été envoyé par Bunshin 3D. Si vous n'avez pas effectué cet achat, veuillez nous contacter immédiatement.",
    team: "L'équipe Bunshin 3D",
  },
  es: {
    subject: "Pago confirmado - {credits} créditos añadidos",
    greeting: "Hola,",
    thankYou: "¡Gracias por tu compra! Tu pago se ha procesado con éxito.",
    summary: "Resumen del pedido",
    pack: "Pack",
    credits: "Créditos",
    amount: "Importe pagado",
    creditsReady: "Tus {credits} créditos ya están disponibles en tu cuenta y listos para usar.",
    cta: "Ir al Estudio",
    footer: "Este correo fue enviado por Bunshin 3D. Si no realizaste esta compra, contáctanos inmediatamente.",
    team: "El equipo de Bunshin 3D",
  },
  de: {
    subject: "Zahlung bestätigt - {credits} Credits hinzugefügt",
    greeting: "Hallo,",
    thankYou: "Vielen Dank für Ihren Einkauf! Ihre Zahlung wurde erfolgreich verarbeitet.",
    summary: "Bestellübersicht",
    pack: "Paket",
    credits: "Credits",
    amount: "Bezahlter Betrag",
    creditsReady: "Ihre {credits} Credits sind jetzt in Ihrem Konto verfügbar und einsatzbereit.",
    cta: "Zum Studio",
    footer: "Diese E-Mail wurde von Bunshin 3D gesendet. Wenn Sie diesen Kauf nicht getätigt haben, kontaktieren Sie uns bitte umgehend.",
    team: "Das Bunshin 3D Team",
  },
  ja: {
    subject: "お支払い確認 - {credits}クレジット追加",
    greeting: "こんにちは、",
    thankYou: "ご購入ありがとうございます！お支払いは正常に処理されました。",
    summary: "注文概要",
    pack: "パック",
    credits: "クレジット",
    amount: "お支払い金額",
    creditsReady: "{credits}クレジットがアカウントに追加され、ご利用いただけます。",
    cta: "スタジオへ",
    footer: "このメールはBunshin 3Dから送信されました。この購入に覚えがない場合は、すぐにお問い合わせください。",
    team: "Bunshin 3D チーム",
  },
  zh: {
    subject: "付款确认 - 已添加{credits}积分",
    greeting: "您好，",
    thankYou: "感谢您的购买！您的付款已成功处理。",
    summary: "订单摘要",
    pack: "套餐",
    credits: "积分",
    amount: "支付金额",
    creditsReady: "您的{credits}积分已添加到账户，可以立即使用。",
    cta: "前往工作室",
    footer: "此邮件由Bunshin 3D发送。如果您未进行此购买，请立即与我们联系。",
    team: "Bunshin 3D 团队",
  },
};

function formatCurrency(amount: number, currency: string, locale: string): string {
  const localeMap: Record<string, string> = {
    en: "en-US", fr: "fr-FR", es: "es-ES", de: "de-DE", ja: "ja-JP", zh: "zh-CN",
  };
  return new Intl.NumberFormat(localeMap[locale] || "en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: currency === "JPY" ? 0 : 2,
  }).format(amount);
}

function replaceVars(str: string, vars: Record<string, string | number>): string {
  let result = str;
  for (const [key, value] of Object.entries(vars)) {
    result = result.replace(`{${key}}`, String(value));
  }
  return result;
}

function buildEmailHtml(params: PaymentConfirmationParams): string {
  const t = translations[params.locale] || translations.en;
  const pack = packNames[params.packId]?.[params.locale] || packNames[params.packId]?.en || params.packId;
  const formattedAmount = formatCurrency(params.amount, params.currency, params.locale);
  const studioUrl = `${APP_URL}/${params.locale}/studio`;

  return `<!DOCTYPE html>
<html lang="${params.locale}">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:40px 20px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#111;border:1px solid rgba(255,255,255,0.06);border-radius:12px;overflow:hidden;">
        <!-- Header -->
        <tr><td style="padding:32px 40px 24px;text-align:center;border-bottom:1px solid rgba(255,255,255,0.06);">
          <div style="font-size:24px;font-weight:700;color:#fff;letter-spacing:1px;">BUNSHIN<span style="color:#3b82f6;">3D</span></div>
        </td></tr>
        <!-- Body -->
        <tr><td style="padding:32px 40px;">
          <p style="color:#a1a1aa;font-size:15px;margin:0 0 8px;">${t.greeting}</p>
          <p style="color:#e4e4e7;font-size:15px;line-height:1.6;margin:0 0 24px;">${t.thankYou}</p>
          <!-- Order Summary -->
          <div style="background:#191919;border:1px solid rgba(255,255,255,0.06);border-radius:8px;padding:20px;margin:0 0 24px;">
            <p style="color:#fff;font-size:14px;font-weight:600;margin:0 0 16px;text-transform:uppercase;letter-spacing:0.5px;">${t.summary}</p>
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="color:#a1a1aa;font-size:14px;padding:6px 0;">${t.pack}</td>
                <td style="color:#e4e4e7;font-size:14px;padding:6px 0;text-align:right;font-weight:500;">${pack}</td>
              </tr>
              <tr>
                <td style="color:#a1a1aa;font-size:14px;padding:6px 0;">${t.credits}</td>
                <td style="color:#3b82f6;font-size:14px;padding:6px 0;text-align:right;font-weight:600;">${params.credits}</td>
              </tr>
              <tr>
                <td style="color:#a1a1aa;font-size:14px;padding:6px 0;border-top:1px solid rgba(255,255,255,0.06);padding-top:12px;">${t.amount}</td>
                <td style="color:#fff;font-size:16px;padding:6px 0;text-align:right;font-weight:700;border-top:1px solid rgba(255,255,255,0.06);padding-top:12px;">${formattedAmount}</td>
              </tr>
            </table>
          </div>
          <p style="color:#e4e4e7;font-size:15px;line-height:1.6;margin:0 0 28px;">${replaceVars(t.creditsReady, { credits: params.credits })}</p>
          <!-- CTA Button -->
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr><td align="center">
              <a href="${studioUrl}" style="display:inline-block;background:#fff;color:#0a0a0a;font-size:15px;font-weight:600;padding:12px 32px;border-radius:8px;text-decoration:none;">${t.cta}</a>
            </td></tr>
          </table>
        </td></tr>
        <!-- Footer -->
        <tr><td style="padding:24px 40px 32px;border-top:1px solid rgba(255,255,255,0.06);">
          <p style="color:#71717a;font-size:13px;line-height:1.5;margin:0 0 12px;">${t.footer}</p>
          <p style="color:#52525b;font-size:12px;margin:0;">${t.team}</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export async function sendPaymentConfirmationEmail(params: PaymentConfirmationParams): Promise<void> {
  if (!resend) {
    console.warn("[Email] RESEND_API_KEY not set, skipping email");
    return;
  }

  const t = translations[params.locale] || translations.en;
  const subject = replaceVars(t.subject, { credits: params.credits });

  const { error } = await resend.emails.send({
    from: FROM_EMAIL,
    to: params.email,
    subject,
    html: buildEmailHtml(params),
  });

  if (error) {
    throw new Error(`Resend error: ${error.message}`);
  }
}
