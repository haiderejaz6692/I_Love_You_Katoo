import RoseCursor from '@/components/RoseCursor';
import FloatingPetals from '@/components/FloatingPetals';
import HeroSection from '@/components/HeroSection';
import ValentineQuestion from '@/components/ValentineQuestion';
import GenderSelection from '@/components/GenderSelection';
import RoseMessage from '@/components/RoseMessage';
import RoseGarden from '@/components/RoseGarden';
import Footer from '@/components/Footer';
import { useReducedMotion } from 'framer-motion';
import SparkleField from '@/components/SparkleField';

const Index = () => {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="min-h-screen bg-background cursor-none overflow-x-hidden">
      {/* Custom Rose Cursor */}
      <RoseCursor />
      
      {/* Floating Petals Background */}
      {!prefersReducedMotion && <FloatingPetals count={25} />}
      {!prefersReducedMotion && <SparkleField density="rich" />}
      
      {/* Main Content */}
      <main>
        {/* Hero Section with 3D Rose */}
        <HeroSection />

        {/* Valentine Question */}
        <ValentineQuestion />
        
        {/* Gender Selection Section */}
        <GenderSelection />
        
        {/* Romantic Message with Typewriter */}
        <RoseMessage />
        
        {/* Interactive Rose Garden */}
        <RoseGarden />
        
        {/* Footer */}
        <Footer />
      </main>
    </div>
  );
};

export default Index;
