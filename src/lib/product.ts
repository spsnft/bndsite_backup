import { siteConfig } from "@/config/site"

const FALLBACK_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%231A2F30'/%3E%3Ccircle cx='50' cy='42' r='14' fill='%23A88444' opacity='0.4'/%3E%3Cpath d='M30 70 C 35 55, 65 55, 70 70' stroke='%23A88444' stroke-width='4' fill='none' opacity='0.4'/%3E%3C/svg%3E";

export async function getProducts() {
  try {
    const SCRIPT_URL = siteConfig.apiUrl;

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

    const formattedProducts = items.map((item: any, index: number) => {
      let rawImg = item.image || item.photo || item.Image || item.Photo || '';
      let cleanImage = typeof rawImg === 'string' ? rawImg.replace(/^["']|["']$/g, '').trim() : '';

      if (cleanImage.startsWith('http://') || cleanImage.startsWith('https://')) {
        try {
          cleanImage = encodeURI(decodeURI(cleanImage));
        } catch {
          // Игнорируем ошибки при дешифровке
        }
      } else {
        cleanImage = FALLBACK_IMAGE;
      }

      return {
        ...item,
        id: String(item.id || `product-${index}`),
        name: String(item.name || "Unnamed Product"),
        category: String(item.category || "").toLowerCase().trim(),
        subcategory: String(item.subcategory || "").toLowerCase().trim(),
        
        image: cleanImage,

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
      };
    });

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
