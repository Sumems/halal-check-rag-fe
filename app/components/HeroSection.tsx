import { Link } from "react-router";
import GridMotion from "~/components/GridMotion";
import RotatingText from "~/components/RotatingText";
import { Button } from "~/components/ui/button";
import { FaRobot } from "react-icons/fa6";
import { 
  Utensils, 
  CupSoda, 
  Sparkles, 
  CheckCircle2, 
  ShieldCheck, 
  Leaf, 
  Globe 
} from "lucide-react";
import HalalIndonesiaLogo from "../assets/Halal_Indonesia.svg";

const halalLogo = (
  <div className="absolute inset-0 bg-white flex items-center justify-center p-6">
    <img
      src={HalalIndonesiaLogo}
      alt="Halal Indonesia"
      className="h-full w-auto object-contain select-none"
    />
  </div>
);

// Wrapper untuk memberikan gaya visual yang konsisten pada icon
const createIconCard = (IconComponent: any, colorClass: string = "text-green-600 dark:text-green-400") => (
  <div className="absolute inset-0 bg-white flex items-center justify-center p-6">
    <IconComponent className={`w-[70%] h-[70%] object-contain ${colorClass}`} />
  </div>
);

// 28 items untuk GridMotion (4 baris x 7 kolom)
const gridItems = [
  // Baris 1
  halalLogo,
  "HALAL",
  createIconCard(Utensils),
  "Aman",
  createIconCard(Sparkles, "text-pink-500 dark:text-pink-400"),
  "Minuman",
  createIconCard(CupSoda),
  // Baris 2
  "Sertifikasi",
  createIconCard(Leaf, "text-emerald-500"),
  "Produk",
  halalLogo,
  "Cek",
  createIconCard(ShieldCheck),
  // Baris 3
  "Indonesia",
  createIconCard(Utensils),
  "Halal",
  halalLogo,
  "Makanan",
  createIconCard(CupSoda),
  // Baris 4
  "Agentic AI",
  createIconCard(Sparkles, "text-pink-500 dark:text-pink-400"),
  "Kosmetik",
  createIconCard(Globe),
  "✓",
  createIconCard(ShieldCheck),
  halalLogo,
];

export function HeroSection() {
  return (
    <section className="relative h-screen overflow-hidden">
      {/* GridMotion Background */}
      <div className="absolute inset-0 z-0">
        <GridMotion
          items={gridItems}
          gradientColor="#166534"
        />
      </div>

      {/* Light mode overlay */}
      <div
        className="absolute inset-0 z-10 dark:hidden"
        style={{
          background: 'linear-gradient(to bottom, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.65) 50%, rgba(255,255,255,0.85) 80%, rgba(255,255,255,1) 97%, rgba(255,255,255,1) 100%)',
        }}
      />
      {/* Dark mode overlay */}
      <div
        className="absolute inset-0 z-10 hidden dark:block"
        style={{
          background: 'linear-gradient(to bottom, rgba(3,47,18,0.8) 0%, rgba(20,83,45,0.65) 50%, rgba(20,83,45,0.85) 80%, rgba(20,83,45,1) 97%, rgba(20,83,45,1) 100%)',
        }}
      />

      {/* Hero Content */}
      <div className="relative z-20 flex flex-col items-center justify-center h-full px-4 text-center">
        {/* Title */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-green-950 dark:text-white mb-4 tracking-tight">
          Cek Produk{" "}
          <span className="text-green-600 dark:text-green-400">Halal</span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg md:text-xl text-green-800/80 dark:text-green-100/80 max-w-2xl mb-8">
          Chatbot berbasis Agentic AI untuk membantu Anda memverifikasi status
          kehalalan produk{" "}
          <RotatingText
            texts={["makanan", "minuman", "kosmetik"]}
            rotationInterval={2000}
            staggerDuration={0.05}
            splitBy="characters"
            mainClassName="inline-flex text-green-700 dark:text-green-300 font-semibold"
            elementLevelClassName="inline-block"
          />
          {" "}di Indonesia
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button 
            asChild
            size="lg" 
            className="bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-400 text-white dark:text-white px-8 py-6 text-lg rounded-xl shadow-lg shadow-green-600/30 dark:shadow-green-500/30 transition-colors"
          >
            <Link to="/chat">
              <FaRobot className="mr-2" />
              Mulai Cek Halal
            </Link>
          </Button>
          <Button 
            asChild
            size="lg" 
            className={[
              "border backdrop-blur-sm px-8 py-6 text-lg rounded-xl transition-all",
              "border-green-600/50 bg-green-50 text-green-950 hover:bg-green-100",
              "dark:border-green-400/50 dark:bg-white/10 dark:text-green-100 dark:hover:bg-white dark:hover:text-green-950",
            ].join(" ")}
          >
            <a href="#fitur">Pelajari Lebih Lanjut</a>
          </Button>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 animate-bounce">
        <div className="w-6 h-10 rounded-full border-2 border-green-600/50 dark:border-green-400/50 flex justify-center pt-2">
          <div className="w-1.5 h-3 bg-green-600 dark:bg-green-400 rounded-full" />
        </div>
      </div>
    </section>
  );
}
