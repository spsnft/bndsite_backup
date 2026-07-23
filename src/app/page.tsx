export default async function Page() {
  const API_URL = "https://script.google.com/macros/s/AKfycbw6Z-7mNkg4RneG_ZuXBllnUiDlQgKjC4CWjJSTtnFQJlR6WfMIPT4WWGlk8aOIKM1Jgw/exec";
  
  let rawText = "";
  let errorText = "";
  
  try {
    const res = await fetch(API_URL, { next: { revalidate: 0 } });
    rawText = await res.text();
  } catch (e: any) {
    errorText = e.message;
  }
  
  let parsed: any = null;
  try {
    parsed = JSON.parse(rawText);
  } catch (e: any) {
    errorText += " | JSON parse error: " + e.message;
  }
  
  return (
    <main className="min-h-screen bg-brand-primary text-brand-light p-8">
      <h1 className="text-xl font-bold mb-4">Диагностика API</h1>
      
      <div className="bg-white/10 p-4 rounded-xl mb-4">
        <p className="font-bold">Статус:</p>
        <p>{errorText ? `❌ Ошибка: ${errorText}` : "✅ Ответ получен"}</p>
      </div>
      
      <div className="bg-white/10 p-4 rounded-xl mb-4">
        <p className="font-bold">Количество товаров в JSON:</p>
        <p>{parsed?.products ? parsed.products.length : "products — отсутствует"}</p>
      </div>
      
      <div className="bg-white/10 p-4 rounded-xl mb-4">
        <p className="font-bold">Сырой ответ API (первые 500 символов):</p>
        <pre className="text-xs mt-2 break-all whitespace-pre-wrap">{rawText.slice(0, 500)}</pre>
      </div>
    </main>
  );
}
