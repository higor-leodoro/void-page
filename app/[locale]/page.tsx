import { setRequestLocale } from "next-intl/server";
import { PageFrame } from "@/components/chrome/PageFrame";
import { HeroClient } from "./HeroClient";

type Props = { params: Promise<{ locale: string }> };

export default async function Home({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main className="relative h-svh w-full overflow-hidden bg-void text-paper">
      <PageFrame />
      <HeroClient />
    </main>
  );
}
