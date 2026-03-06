import PublicLayout from "@/components/layout/PublicLayout";
import HeroSection from "@/components/home/HeroSection";
import CategoriesSection from "@/components/home/CategoriesSection";
import FeaturedProductsSection from "@/components/home/FeaturedProductsSection";
import TrustBanner from "@/components/home/TrustBanner";

export default function HomePage() {
  return (
    <PublicLayout>
      <HeroSection />
      <CategoriesSection />
      <FeaturedProductsSection />
      <TrustBanner />
    </PublicLayout>
  );
}
