import { getProducts } from "@/lib/product"
import LandingClient from "@/components/LandingClient"

export const revalidate = 60;

export default async function Page() {
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
