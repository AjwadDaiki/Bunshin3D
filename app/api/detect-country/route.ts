import { NextRequest, NextResponse } from "next/server";
import { getApiTranslations } from "@/lib/api-i18n";
import { isSupportedCurrency, DEFAULT_CURRENCY } from "@/lib/config/pricing";

export async function GET(request: NextRequest) {
  const t = await getApiTranslations(request, "Api.Country");

  try {
    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded
      ? forwarded.split(",")[0]
      : request.headers.get("x-real-ip") || "unknown";

    // In local dev, use ipapi without IP to auto-detect from outgoing connection
    const isLocal = ip === "::1" || ip === "127.0.0.1" || ip === "unknown";
    const testIp = isLocal ? null : ip;

    const geoUrl = testIp ? `https://ipapi.co/${testIp}/json/` : `https://ipapi.co/json/`;
    const geoResponse = await fetch(geoUrl, {
      headers: {
        "User-Agent": "Bunshin3D/1.0",
      },
    });

    if (!geoResponse.ok) {
      return NextResponse.json({
        country: "FR",
        currency: "EUR",
        detected: false,
      });
    }

    const geoData = await geoResponse.json();

    const country = geoData.country_code || "US";
    const rawCurrency = geoData.currency || "USD";
    const currency = isSupportedCurrency(rawCurrency) ? rawCurrency : DEFAULT_CURRENCY;

    return NextResponse.json({
      country,
      currency,
      detected: true,
      ip: testIp || "auto",
    });
  } catch (error: any) {
    console.error(t("errors.detectFailed"), error);
    return NextResponse.json({
      country: "US",
      currency: "USD",
      detected: false,
    });
  }
}
