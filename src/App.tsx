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

function App() {
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

export default App;