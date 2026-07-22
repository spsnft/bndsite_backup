import { siteConfig } from "@/config/site"

export async function getProducts() {
  try {
    const SCRIPT_URL = siteConfig.apiUrl;

    // Если URL еще не задан в .env.local, отдаем пустой массив без падения приложения
    if (!SCRIPT_URL) {
      console.warn("⚠️ API URL не настроен в siteConfig.apiUrl / .env.local");
      return { products: [], stories: [], descriptions: [] };
    }

    const response = await fetch(SCRIPT_URL, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      next: { revalidate: 60 } 
    });

    if (!response.ok) throw new Error("Ошибка сети");

    const data = await response.json();
    
    const items = data.products || [];
    const stories = data.stories || [];
    const descriptions = data.descriptions || [];

    const formattedProducts = items.map((item: any, index: number) => ({
      ...item,
      // Безопасный ID без использования Math.random() для защиты от Hydration Mismatch
      id: String(item.id || `product-${index}`),
      name: String(item.name || "Unnamed Product"),
      category: String(item.category || "").toLowerCase().trim(),
      subcategory: String(item.subcategory || "").toLowerCase().trim(),
      
      image: (item.photo && item.photo.startsWith('http')) 
        ? item.photo 
        : '/images/placeholder.webp',

      description: String(item.description || ""),
      farm: String(item.farm || "Organic Demo Farm"),
      taste: String(item.taste || "Sweet, Earthy"),
      terpenes: String(item.terpenes || "Myrcene, Limonene"),

      prices: {
        1: Number(item.price_1g) || 0,
        5: Number(item.price_5g) || 0,
        10: Number(item.price_10g) || 0,
        20: Number(item.price_20g) || 0
      },
      price: Number(item.price_1g) || Number(item.price) || 0
    }));

    return { 
      products: formattedProducts, 
      stories: stories, 
      descriptions: descriptions 
    };
  } catch (error) {
    console.error("❌ Ошибка загрузки каталога:", error);
    return { products: [], stories: [], descriptions: [] };
  }
}
