import type { Route } from "./+types/home";
import { HeroSection } from "~/components/HeroSection";
import { Navbar } from "~/components/Navbar";
import SpotlightCard from "~/components/SpotlightCard";
import { FaCircleCheck, FaRobot, FaMagnifyingGlass } from "react-icons/fa6";
import { Footer } from "~/components/Footer";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Halal Check - Cek Kehalalan Produk dengan AI" },
    {
      name: "description",
      content:
        "Chatbot berbasis Agentic AI untuk membantu Anda memverifikasi status kehalalan produk makanan, minuman, dan kosmetik di Indonesia",
    },
    {
      name: "keywords",
      content:
        "halal, cek halal, BPJPH, sertifikasi halal, produk halal, AI chatbot",
    },
    {
      property: "og:title",
      content: "Halal Check - Cek Kehalalan Produk dengan AI",
    },
    {
      property: "og:description",
      content: "Verifikasi status kehalalan produk dengan teknologi AI",
    },
  ];
}

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Bar */}
      <Navbar activeHref="/" />

      {/* Hero Section */}
      <HeroSection />

      {/* Fitur Unggulan */}
      <section
        id="fitur"
        className="relative z-[1] -mt-1 bg-white px-4 py-20 dark:bg-gradient-to-b dark:from-green-900 dark:to-background"
      >
        <div className="mx-auto max-w-6xl">
          {/* Header Section */}
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold text-green-950 md:text-4xl dark:text-green-100">
              Fitur Unggulan
            </h2>
            <p className="mx-auto max-w-xl text-green-700/70 dark:text-green-400/70">
              Teknologi AI terkini untuk membantu Anda membuat keputusan yang
              tepat
            </p>
          </div>

          {/* Kartu Fitur */}
          <div className="grid gap-6 md:grid-cols-3">
            <SpotlightCard
              className="bg-green-900 border-green-700"
              spotlightColor="rgba(34, 197, 94, 0.25)"
            >
              <div className="text-center">
                <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-green-500/20">
                  <FaMagnifyingGlass className="text-3xl text-green-400" />
                </div>
                <h3 className="mb-3 text-xl font-semibold text-white">
                  Pencarian Cerdas
                </h3>
                <p className="text-green-100/70">
                  Cari produk dengan nama, merek, atau barcode untuk mendapatkan
                  informasi kehalalan instan
                </p>
              </div>
            </SpotlightCard>

            <SpotlightCard
              className="bg-green-900 border-green-700"
              spotlightColor="rgba(34, 197, 94, 0.25)"
            >
              <div className="text-center">
                <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-green-500/20">
                  <FaRobot className="text-3xl text-green-400" />
                </div>
                <h3 className="mb-3 text-xl font-semibold text-white">
                  AI Chatbot
                </h3>
                <p className="text-green-100/70">
                  Tanya jawab interaktif dengan AI yang memahami konteks dan
                  memberikan jawaban akurat
                </p>
              </div>
            </SpotlightCard>

            <SpotlightCard
              className="bg-green-900 border-green-700"
              spotlightColor="rgba(34, 197, 94, 0.25)"
            >
              <div className="text-center">
                <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-green-500/20">
                  <FaCircleCheck className="text-3xl text-green-400" />
                </div>
                <h3 className="mb-3 text-xl font-semibold text-white">
                  Sertifikasi BPJPH
                </h3>
                <p className="text-green-100/70">
                  Data langsung dari sumber resmi BPJPH untuk memastikan
                  validitas sertifikasi halal
                </p>
              </div>
            </SpotlightCard>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
