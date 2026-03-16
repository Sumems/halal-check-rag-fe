import type { Route } from "./+types/tentang";
import { Link } from "react-router";
import { FaArrowRight, FaEnvelope } from "react-icons/fa6";
import {
  SiNodedotjs,
  SiReact,
  SiReactrouter,
  SiTailwindcss,
  SiTypescript,
  SiVite,
  SiDocker,
  SiN8N,
  SiLangchain,
} from "react-icons/si";
import ragasIcon from "~/assets/ragas.svg";
import qdrantIcon from "~/assets/qdrant.svg";
import { Footer } from "~/components/Footer";
import { HalalLogoIcon } from "~/components/HalalLogoIcon";
import LogoLoop, { type LogoItem } from "~/components/LogoLoop";
import { Navbar } from "~/components/Navbar";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Tentang - Halal Check" },
    {
      name: "description",
      content:
        "Halaman tentang Halal Check: profil pembuat project dan teknologi yang digunakan.",
    },
  ];
}

const TECH_STACK_LOGOS: LogoItem[] = [
  {
    node: (
      <span className="inline-flex items-center gap-2 rounded-full border border-green-200 bg-white px-4 py-2 text-sm font-medium text-green-900 dark:border-green-800 dark:bg-green-900 dark:text-green-100">
        <SiReact className="text-base text-sky-500" />
        React
      </span>
    ),
    title: "React",
    ariaLabel: "React",
  },
  {
    node: (
      <span className="inline-flex items-center gap-2 rounded-full border border-green-200 bg-white px-4 py-2 text-sm font-medium text-green-900 dark:border-green-800 dark:bg-green-900 dark:text-green-100">
        <SiReactrouter className="text-base text-rose-500" />
        React Router
      </span>
    ),
    title: "React Router",
    ariaLabel: "React Router",
  },
  {
    node: (
      <span className="inline-flex items-center gap-2 rounded-full border border-green-200 bg-white px-4 py-2 text-sm font-medium text-green-900 dark:border-green-800 dark:bg-green-900 dark:text-green-100">
        <SiTypescript className="text-base text-blue-500" />
        TypeScript
      </span>
    ),
    title: "TypeScript",
    ariaLabel: "TypeScript",
  },
  {
    node: (
      <span className="inline-flex items-center gap-2 rounded-full border border-green-200 bg-white px-4 py-2 text-sm font-medium text-green-900 dark:border-green-800 dark:bg-green-900 dark:text-green-100">
        <SiTailwindcss className="text-base text-cyan-500" />
        Tailwind CSS
      </span>
    ),
    title: "Tailwind CSS",
    ariaLabel: "Tailwind CSS",
  },
  {
    node: (
      <span className="inline-flex items-center gap-2 rounded-full border border-green-200 bg-white px-4 py-2 text-sm font-medium text-green-900 dark:border-green-800 dark:bg-green-900 dark:text-green-100">
        <SiVite className="text-base text-violet-500" />
        Vite
      </span>
    ),
    title: "Vite",
    ariaLabel: "Vite",
  },
  {
    node: (
      <span className="inline-flex items-center gap-2 rounded-full border border-green-200 bg-white px-4 py-2 text-sm font-medium text-green-900 dark:border-green-800 dark:bg-green-900 dark:text-green-100">
        <SiNodedotjs className="text-base text-green-600" />
        Node.js
      </span>
    ),
    title: "Node.js",
    ariaLabel: "Node.js",
  },
  {
    node: (
      <span className="inline-flex items-center gap-2 rounded-full border border-green-200 bg-white px-4 py-2 text-sm font-medium text-green-900 dark:border-green-800 dark:bg-green-900 dark:text-green-100">
        <SiLangchain className="text-base text-emerald-600" />
        LangChain
      </span>
    ),
    title: "LangChain",
    ariaLabel: "LangChain",
  },
  {
    node: (
      <span className="inline-flex items-center gap-2 rounded-full border border-green-200 bg-white px-4 py-2 text-sm font-medium text-green-900 dark:border-green-800 dark:bg-green-900 dark:text-green-100">
        <SiN8N className="text-base text-pink-600" />
        n8n
      </span>
    ),
    title: "n8n",
    ariaLabel: "n8n",
  },
  {
    node: (
      <span className="inline-flex items-center gap-2 rounded-full border border-green-200 bg-white px-4 py-2 text-sm font-medium text-green-900 dark:border-green-800 dark:bg-green-900 dark:text-green-100">
        <img src={qdrantIcon} alt="" className="h-4 w-4 object-contain" />
        Qdrant
      </span>
    ),
    title: "Qdrant",
    ariaLabel: "Qdrant",
  },
  {
    node: (
      <span className="inline-flex items-center gap-2 rounded-full border border-green-200 bg-white px-4 py-2 text-sm font-medium text-green-900 dark:border-green-800 dark:bg-green-900 dark:text-green-100">
        <SiDocker className="text-base text-sky-600" />
        Docker
      </span>
    ),
    title: "Docker",
    ariaLabel: "Docker",
  },
  {
    node: (
      <span className="inline-flex items-center gap-2 rounded-full border border-green-200 bg-white px-4 py-2 text-sm font-medium text-green-900 dark:border-green-800 dark:bg-green-900 dark:text-green-100">
        <img src={ragasIcon} alt="" className="h-4 w-4 object-contain" />
        Ragas
      </span>
    ),
    title: "Ragas",
    ariaLabel: "Ragas",
  },
];

export default function Tentang() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar activeHref="/tentang" />

      <main className="px-4 pb-20 pt-28">
        <section className="mx-auto mb-12 max-w-5xl">
          <div className="rounded-2xl border border-green-200 bg-white p-8 shadow-sm dark:border-green-800 dark:bg-green-950">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 dark:bg-green-900">
              <HalalLogoIcon className="size-8 text-green-600 dark:text-green-400" />
            </div>

            <h1 className="mb-3 text-3xl font-bold text-green-950 md:text-4xl dark:text-green-100">
              Tentang Halal Check
            </h1>

            <p className="mb-8 max-w-3xl text-green-700 dark:text-green-300">
              Halal Check adalah project verifikasi kehalalan produk berbasis AI
              yang dirancang untuk membantu masyarakat Indonesia mendapatkan
              informasi halal secara cepat, jelas, dan mudah dipahami.
            </p>

            <div className="grid gap-4 md:grid-cols-2">
              <article className="rounded-xl border border-green-200 bg-green-50 p-5 dark:border-green-800 dark:bg-green-900/40">
                <h2 className="mb-2 text-lg font-semibold text-green-900 dark:text-green-100">
                  Pembuat Project
                </h2>
                <p className="text-sm text-green-800 dark:text-green-300">
                  Project ini dikembangkan oleh tim pengembang Halal Check
                  sebagai bagian dari inisiatif solusi digital untuk kebutuhan
                  verifikasi halal yang lebih praktis.
                </p>
              </article>

              <article className="rounded-xl border border-green-200 bg-green-50 p-5 dark:border-green-800 dark:bg-green-900/40">
                <h2 className="mb-2 text-lg font-semibold text-green-900 dark:text-green-100">
                  Kontak
                </h2>
                <p className="mb-3 text-sm text-green-800 dark:text-green-300">
                  Untuk kolaborasi atau pertanyaan lebih lanjut, silakan hubungi
                  tim kami melalui email berikut.
                </p>
                <div className="inline-flex items-center gap-2 text-sm font-medium text-green-700 dark:text-green-300">
                  <FaEnvelope className="text-base" />
                  hello@halalcheck.app
                </div>
              </article>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-5xl">
          <div className="rounded-2xl border border-green-200 bg-white p-8 shadow-sm dark:border-green-800 dark:bg-green-950">
            <h2 className="mb-2 text-2xl font-bold text-green-950 dark:text-green-100">
              Tech Stack
            </h2>
            <p className="mb-8 text-green-700 dark:text-green-300">
              Halal Check dibangun dengan modern stack agar performa, skalabilitas,
              dan pengalaman pengguna tetap optimal.
            </p>

            <LogoLoop
              logos={TECH_STACK_LOGOS}
              speed={80}
              gap={18}
              logoHeight={40}
              fadeOut
              fadeOutColor="var(--background)"
              ariaLabel="Daftar teknologi yang digunakan Halal Check"
            />

            <div className="mt-8">
              <Link
                to="/chat"
                className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-green-700 dark:bg-green-500 dark:text-green-950 dark:hover:bg-green-400"
              >
                Coba Halal Check
                <FaArrowRight className="text-xs" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
