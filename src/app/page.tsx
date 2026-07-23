import { getProducts } from "@/lib/product"
import LandingClient from "@/components/LandingClient"

// Данные обновляются каждые 60 секунд (можно менять)
export const revalidate = 60;

export default async function Page() {
  // Загружаем товары из Google Таблицы через API
  const data = await getProducts();
  
  return (
    <main>
      <LandingClient 
        initialProducts={data.products || []} 
        initialDescriptions={data.descriptions || []} 
      />
    </main>
  );
}
