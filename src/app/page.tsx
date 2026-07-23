import LandingClient from "@/components/LandingClient"

export const dynamic = 'force-dynamic';

export default function Page() {
  return (
    <main>
      <LandingClient 
        initialProducts={[]} 
        initialDescriptions={[]} 
      />
    </main>
  );
}
