import { ThemeProvider } from './contexts/ThemeContext';
import Header from './components/Header';
import Hero from './components/Hero';
import Services from './components/Services';
import Ecosystem from './components/Ecosystem';
import WhyChooseUs from './components/WhyChooseUs';
import SocialProof from './components/SocialProof';
import TheProblem from './components/TheProblem';
import CTA from './components/CTA';
import Footer from './components/Footer';
import type { ReactNode } from 'react';
import CmsSite from './cms/CmsSite';
import { useSiteConfig } from './cms/tenant';

function Screen({ title, message, children }: { title: string; message?: string; children?: ReactNode }) {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-6 text-center" aria-busy={!message}>
      {message && (
        <div>
          <h1 className="text-3xl md:text-4xl font-black">{title}</h1>
          <p className="mt-3 text-zinc-400">{message}</p>
          {children && <div className="mt-8">{children}</div>}
        </div>
      )}
    </div>
  );
}

/** The original, hard-coded landing page. Only used when no CMS is configured (see README). */
function StaticSite() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-black text-white transition-colors duration-300">
        <Header />
        <main>
          <Hero />
          <Services />
          <Ecosystem />
          <WhyChooseUs />
          <SocialProof />
          <TheProblem />
          <CTA />
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  );
}

function App() {
  const site = useSiteConfig();

  switch (site.status) {
    case 'ready':
      return <CmsSite config={site.config} />;
    case 'loading':
      return <Screen title="Loading" />;
    case 'unknown_domain':
      return <Screen title="Website not found" message={`There is no website at ${site.hostname}. Check the address and try again.`} />;
    case 'error':
      return (
        <Screen title="We couldn't load this website" message="Please check your connection and try again.">
          <button
            type="button"
            onClick={site.retry}
            className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-semibold rounded-lg btn-glow"
          >
            Try again
          </button>
        </Screen>
      );
    default:
      return <StaticSite />;
  }
}

export default App;
