export type NurtureStep = {
  id: string;
  delayDays: number;
  subject: Record<string, string>;
  getHtml: (params: { locale: string; credits: number; studioUrl: string; pricingUrl: string }) => string;
};

const BRAND_COLOR = "#3b82f6";

function wrapEmail(content: string, studioUrl: string): string {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif">
<div style="max-width:560px;margin:0 auto;padding:40px 24px">
  <div style="text-align:center;margin-bottom:32px">
    <span style="color:#fff;font-size:20px;font-weight:bold">BUNSHIN</span>
    <span style="color:${BRAND_COLOR};font-size:20px;font-weight:bold">3D</span>
  </div>
  ${content}
  <div style="margin-top:40px;padding-top:24px;border-top:1px solid rgba(255,255,255,0.06);text-align:center">
    <p style="color:#666;font-size:12px;margin:0">Bunshin 3D - AI 3D Model Generator</p>
    <p style="color:#444;font-size:11px;margin:8px 0 0">
      <a href="${studioUrl.replace('/studio', '/terms')}" style="color:#444;text-decoration:underline">Unsubscribe</a>
    </p>
  </div>
</div>
</body>
</html>`;
}

export const NURTURE_SEQUENCE: NurtureStep[] = [
  {
    id: "welcome",
    delayDays: 0,
    subject: {
      en: "Your free 3D credits are ready",
      fr: "Vos crédits 3D gratuits sont prêts",
      es: "Tus créditos 3D gratuitos están listos",
      de: "Ihre kostenlosen 3D-Credits sind bereit",
      ja: "無料3Dクレジットの準備ができました",
      zh: "您的免费3D积分已就绪",
    },
    getHtml: ({ studioUrl }) => wrapEmail(`
      <h1 style="color:#fff;font-size:24px;margin:0 0 16px;font-weight:bold">Welcome to Bunshin 3D</h1>
      <p style="color:#999;font-size:15px;line-height:1.6;margin:0 0 24px">
        Your free credits are loaded and ready to use. Here's how to get the best results:
      </p>
      <div style="background:#111;border:1px solid rgba(255,255,255,0.06);border-radius:12px;padding:20px;margin:0 0 24px">
        <p style="color:#ccc;font-size:14px;margin:0 0 12px"><strong style="color:#fff">Tip 1:</strong> Use high-contrast images with clear subjects</p>
        <p style="color:#ccc;font-size:14px;margin:0 0 12px"><strong style="color:#fff">Tip 2:</strong> Photos with solid or transparent backgrounds work best</p>
        <p style="color:#ccc;font-size:14px;margin:0"><strong style="color:#fff">Tip 3:</strong> Logos as PNG with transparent background produce the cleanest 3D models</p>
      </div>
      <div style="text-align:center">
        <a href="${studioUrl}" style="display:inline-block;background:#fff;color:#0a0a0a;padding:12px 32px;border-radius:8px;text-decoration:none;font-weight:600;font-size:15px">Open Studio</a>
      </div>
    `, studioUrl),
  },
  {
    id: "use-cases",
    delayDays: 2,
    subject: {
      en: "5 things you can do with your 3D models",
      fr: "5 choses à faire avec vos modèles 3D",
      es: "5 cosas que puedes hacer con tus modelos 3D",
      de: "5 Dinge, die Sie mit Ihren 3D-Modellen machen können",
      ja: "3Dモデルでできる5つのこと",
      zh: "您的3D模型可以做的5件事",
    },
    getHtml: ({ studioUrl }) => wrapEmail(`
      <h1 style="color:#fff;font-size:24px;margin:0 0 16px;font-weight:bold">What can you create?</h1>
      <p style="color:#999;font-size:15px;line-height:1.6;margin:0 0 24px">
        Bunshin 3D users are building amazing things. Here are the top use cases:
      </p>
      <div style="background:#111;border:1px solid rgba(255,255,255,0.06);border-radius:12px;padding:20px;margin:0 0 24px">
        <p style="color:#ccc;font-size:14px;margin:0 0 14px"><strong style="color:${BRAND_COLOR}">1.</strong> <strong style="color:#fff">3D Print custom figurines</strong> - from photos of pets, characters, or objects</p>
        <p style="color:#ccc;font-size:14px;margin:0 0 14px"><strong style="color:${BRAND_COLOR}">2.</strong> <strong style="color:#fff">Create game assets</strong> - import GLB/FBX into Unity or Unreal Engine</p>
        <p style="color:#ccc;font-size:14px;margin:0 0 14px"><strong style="color:${BRAND_COLOR}">3.</strong> <strong style="color:#fff">Brand signage</strong> - turn your logo into a 3D-printable desk piece</p>
        <p style="color:#ccc;font-size:14px;margin:0 0 14px"><strong style="color:${BRAND_COLOR}">4.</strong> <strong style="color:#fff">Product visualization</strong> - create 3D models from product photos for e-commerce</p>
        <p style="color:#ccc;font-size:14px;margin:0"><strong style="color:${BRAND_COLOR}">5.</strong> <strong style="color:#fff">Kids' art in 3D</strong> - turn your child's drawing into a real 3D-printed toy</p>
      </div>
      <div style="text-align:center">
        <a href="${studioUrl}" style="display:inline-block;background:#fff;color:#0a0a0a;padding:12px 32px;border-radius:8px;text-decoration:none;font-weight:600;font-size:15px">Try It Now</a>
      </div>
    `, studioUrl),
  },
  {
    id: "credits-reminder",
    delayDays: 5,
    subject: {
      en: "Your credits are running low - special offer inside",
      fr: "Vos crédits s'épuisent - offre spéciale à l'intérieur",
      es: "Tus créditos se agotan - oferta especial dentro",
      de: "Ihre Credits gehen zur Neige - Sonderangebot",
      ja: "クレジット残りわずか - 特別オファー",
      zh: "积分即将用完 - 内含特别优惠",
    },
    getHtml: ({ pricingUrl, credits }) => wrapEmail(`
      <h1 style="color:#fff;font-size:24px;margin:0 0 16px;font-weight:bold">Don't stop creating</h1>
      <p style="color:#999;font-size:15px;line-height:1.6;margin:0 0 24px">
        You have <strong style="color:#fff">${credits} credit${credits !== 1 ? "s" : ""}</strong> remaining. Top up to keep generating 3D models without interruption.
      </p>
      <div style="background:#111;border:1px solid rgba(255,255,255,0.06);border-radius:12px;padding:20px;margin:0 0 24px;text-align:center">
        <p style="color:#fff;font-size:18px;font-weight:bold;margin:0 0 8px">Credit packs from $3.99</p>
        <p style="color:#999;font-size:14px;margin:0 0 4px">No subscription • Credits never expire</p>
        <p style="color:#999;font-size:14px;margin:0">Full commercial rights on all models</p>
      </div>
      <div style="text-align:center">
        <a href="${pricingUrl}" style="display:inline-block;background:#fff;color:#0a0a0a;padding:12px 32px;border-radius:8px;text-decoration:none;font-weight:600;font-size:15px">View Pricing</a>
      </div>
    `, pricingUrl),
  },
];

// Post-purchase upsell sequence (separate from nurture)
export const POST_PURCHASE_SEQUENCE: NurtureStep[] = [
  {
    id: "upsell-creator",
    delayDays: 3,
    subject: {
      en: "Save 35% per credit with the Creator pack",
      fr: "Economisez 35% par credit avec le pack Createur",
      es: "Ahorra 35% por credito con el pack Creador",
      de: "Sparen Sie 35% pro Credit mit dem Kreator-Paket",
      ja: "Creatorパックでクレジット単価35%オフ",
      zh: "Creator套餐每积分节省35%",
    },
    getHtml: ({ pricingUrl }) => wrapEmail(`
      <h1 style="color:#fff;font-size:24px;margin:0 0 16px;font-weight:bold">Get more for less</h1>
      <p style="color:#999;font-size:15px;line-height:1.6;margin:0 0 24px">
        You recently purchased the Discovery pack. Did you know the Creator pack gives you <strong style="color:#fff">50 credits for $12.99</strong> - that's <strong style="color:#10b981">35% less per credit</strong>?
      </p>
      <div style="background:#111;border:1px solid rgba(255,255,255,0.06);border-radius:12px;padding:20px;margin:0 0 24px">
        <div style="display:flex;justify-content:space-between;margin-bottom:12px">
          <span style="color:#999;font-size:14px">Discovery</span>
          <span style="color:#fff;font-size:14px">$0.40/credit</span>
        </div>
        <div style="display:flex;justify-content:space-between">
          <span style="color:#3b82f6;font-size:14px;font-weight:bold">Creator</span>
          <span style="color:#10b981;font-size:14px;font-weight:bold">$0.26/credit (-35%)</span>
        </div>
      </div>
      <div style="text-align:center">
        <a href="${pricingUrl}" style="display:inline-block;background:#fff;color:#0a0a0a;padding:12px 32px;border-radius:8px;text-decoration:none;font-weight:600;font-size:15px">Upgrade Now</a>
      </div>
    `, pricingUrl),
  },
];

// Credit-low alert (triggered by cron check, not by delay)
export const CREDIT_LOW_EMAIL: NurtureStep = {
  id: "credit-low",
  delayDays: 0,
  subject: {
    en: "You have 1 credit left",
    fr: "Il vous reste 1 credit",
    es: "Te queda 1 credito",
    de: "Sie haben noch 1 Credit",
    ja: "残り1クレジットです",
    zh: "您还剩1积分",
  },
  getHtml: ({ pricingUrl, credits }) => wrapEmail(`
    <h1 style="color:#fff;font-size:24px;margin:0 0 16px;font-weight:bold">Don't run out of credits</h1>
    <p style="color:#999;font-size:15px;line-height:1.6;margin:0 0 24px">
      You have <strong style="color:#fff">${credits} credit${credits !== 1 ? "s" : ""}</strong> remaining. Top up to keep creating without interruption.
    </p>
    <div style="text-align:center">
      <a href="${pricingUrl}" style="display:inline-block;background:#fff;color:#0a0a0a;padding:12px 32px;border-radius:8px;text-decoration:none;font-weight:600;font-size:15px">Get More Credits</a>
    </div>
  `, pricingUrl),
};
