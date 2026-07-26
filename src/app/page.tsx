import LandingClient from "@/components/LandingClient"
import { getProducts } from "@/lib/product"

export const revalidate = 60;

export default async function Page() {
  const { products, descriptions, categories } = await getProducts();

  return (
    <main>
      <LandingClient 
        initialProducts={products} 
        initialDescriptions={descriptions}
        categories={categories}
      />
    </main>
  );
}
