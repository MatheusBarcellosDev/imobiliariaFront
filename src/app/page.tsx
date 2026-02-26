import HeroSection from "@/components/HeroSection";
import FeaturedProperties from "@/components/FeaturedProperties";
import AboutSection from "@/components/AboutSection";
import Neighborhoods from "@/components/Neighborhoods";
import { getProperties } from "@/lib/api";

export default async function Home() {
  const properties = await getProperties();

  return (
    <>
      <HeroSection />
      <FeaturedProperties initialProperties={properties} />
      <AboutSection />
      <Neighborhoods />
    </>
  );
}
