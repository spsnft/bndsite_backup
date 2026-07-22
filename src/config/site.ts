// src/config/site.ts

export const siteConfig = {
  name: process.env.NEXT_PUBLIC_SITE_NAME || "Demo Store",
  description: "White-label E-commerce Platform",
  url: process.env.NEXT_PUBLIC_APP_URL || "https://tsvetkov.site/420",
  telegramOperator: process.env.NEXT_PUBLIC_TELEGRAM_OPERATOR || "demo_operator",
  apiUrl: process.env.NEXT_PUBLIC_API_URL || "",
  currencySymbol: "฿",
  themeColor: "#193D2E",
  locale: "ru_RU",
};
