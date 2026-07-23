import { getProducts } from "@/lib/product"

export default async function Page() {
  const data = await getProducts();
  
  return (
    <main className="min-h-screen bg-brand-primary text-brand-light p-8">
      <h1 className="text-2xl font-bold mb-4">Товаров загружено: {data.products.length}</h1>
      <div className="grid gap-4">
        {data.products.map((p: any) => (
          <div key={p.id} className="bg-white/10 p-4 rounded-xl">
            <p className="font-bold">{p.name}</p>
            <p className="text-sm opacity-60">{p.type} | {p.subcategory} | {p.price}฿</p>
          </div>
        ))}
      </div>
    </main>
  );
}
