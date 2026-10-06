import Hero from "../components/home/Hero";
import CategoriesSection from "../components/home/CategoriesSection";
import FeaturedProducts from "../components/home/FeaturedProducts";
import WhyNabta from "../components/home/WhyNabta";
import HomeGardenBanner from "../components/home/HomeGardenBanner";
import BlogSection from "../components/home/BlogSection";
import CTASection from "../components/home/CTASection";

import { useDocumentTitle } from '../hooks/useDocumentTitle';

export default function HomePage() {
  useDocumentTitle(
    '',
    'نَبْتة — متجرك المتخصص في الزراعة المنزلية: شتول، بذور، تربة، أسمدة، وأدوات.'
  );
    return (
      <>
        <Hero />
        <CategoriesSection />
        <FeaturedProducts />
        <WhyNabta />
        <HomeGardenBanner />
        <BlogSection />
        <CTASection />
      </>
    );


}


