import { NextResponse } from "next/server";

// API pour détecter le pays de l'utilisateur via IP
export async function GET(request: Request) {
  try {
    // Récupérer l'IP de l'utilisateur
    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0] : request.headers.get("x-real-ip") || "unknown";

    // En développement local, utiliser une IP publique pour tester
    const testIp = ip === "::1" || ip === "127.0.0.1" || ip === "unknown" ? "8.8.8.8" : ip;

    // Appel à ipapi.co pour la géolocalisation (gratuit jusqu'à 1000 req/jour)
    const geoResponse = await fetch(`https://ipapi.co/${testIp}/json/`, {
      headers: {
        "User-Agent": "Bunshin3D/1.0",
      },
    });

    if (!geoResponse.ok) {
      // Fallback : retourner France par défaut
      return NextResponse.json({
        country: "FR",
        currency: "EUR",
        detected: false,
      });
    }

    const geoData = await geoResponse.json();

    // Mapper le code pays vers la devise
    const currencyMap: { [key: string]: string } = {
      US: "USD",
      GB: "GBP",
      JP: "JPY",
      CN: "CNY",
      FR: "EUR",
      DE: "EUR",
      ES: "EUR",
      IT: "EUR",
      NL: "EUR",
      BE: "EUR",
      AT: "EUR",
      PT: "EUR",
      // Ajouter d'autres pays au besoin
    };

    const country = geoData.country_code || "FR";
    const currency = currencyMap[country] || "EUR";

    return NextResponse.json({
      country,
      currency,
      detected: true,
      ip: testIp,
    });
  } catch (error: any) {
    console.error("Country detection error:", error);
    // Fallback
    return NextResponse.json({
      country: "FR",
      currency: "EUR",
      detected: false,
    });
  }
}
