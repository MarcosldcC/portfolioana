import { Navigation } from "@/components/navigation";
import { HeroSection } from "@/components/hero-section";
import { AboutSection } from "@/components/about-section";
import { ServicesSection } from "@/components/services-section";
import { PortfolioSection } from "@/components/portfolio-section";
import { ContactSection } from "@/components/contact-section";
import { Footer } from "@/components/footer";
import { getSiteContent } from "./actions/site-editor";
import { AnalyticsTracker } from "@/components/analytics-tracker";

export const dynamic = 'force-dynamic'; // Ensure fresh data on each request

export default async function Home() {
  const data = await getSiteContent() || {};

  return (
    <main>
      <AnalyticsTracker />
      <Navigation />
      <HeroSection content={data.hero} />
      <AboutSection content={data.about} />
      <ServicesSection content={data.services} />
      <PortfolioSection content={data.portfolio} />
      <ContactSection />
      <Footer content={data.social} />
    </main>
  );
}
