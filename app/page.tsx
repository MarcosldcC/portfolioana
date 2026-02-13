import { Navigation } from "@/components/navigation";
import { HeroSection } from "@/components/hero-section";
import { AboutSection } from "@/components/about-section";
import { ServicesSection } from "@/components/services-section";
import { PortfolioSection } from "@/components/portfolio-section";
import { ContactSection } from "@/components/contact-section";
import { Footer } from "@/components/footer";
import { getSiteContent } from "./actions/site-editor";
import { AnalyticsTracker } from "@/components/analytics-tracker";
import { getProjects } from "./actions/projects";

export const dynamic = 'force-dynamic'; // Ensure fresh data on each request

import { ThemeStyles } from "@/components/theme-styles";
/* ... imports ... */

export default async function Home() {
  const data = await getSiteContent() || {};

  return (
    <main>
      <ThemeStyles theme={data.theme} />
      <AnalyticsTracker />
      <Navigation theme={data.theme?.sections?.hero} />
      <HeroSection content={data.hero} theme={data.theme?.sections?.hero} />
      <AboutSection content={data.about} theme={data.theme?.sections?.about} />
      <ServicesSection content={data.services} theme={data.theme?.sections?.services} />
      <PortfolioSection content={data.portfolio} theme={data.theme?.sections?.portfolio} />
      <ContactSection content={data.contact} theme={data.theme?.sections?.contact} />
      <Footer content={data.social} theme={data.theme?.sections?.contact} />
    </main>
  );
}
