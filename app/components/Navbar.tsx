import CardNav from "~/components/CardNav";
import type { CardNavItem, CardNavPillItem } from "~/components/CardNav";
import { Button } from "~/components/ui/button";
import { FaMoon, FaSun } from "react-icons/fa6";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { HalalLogoIcon } from "~/components/HalalLogoIcon";
import { useTheme } from "~/lib/theme";

/** Item navigasi untuk menu card (hamburger expand) */
const CARD_NAV_ITEMS: CardNavItem[] = [
  {
    label: "Layanan",
    bgColor: "#16a34a",
    textColor: "#ffffff",
    links: [
      {
        label: "Cek Kehalalan",
        href: "/chat",
        ariaLabel: "Cek kehalalan produk",
      },
      {
        label: "AI Chatbot",
        href: "/chat",
        ariaLabel: "Tanya jawab dengan AI chatbot",
      },
    ],
  },
  {
    label: "Informasi",
    bgColor: "#166534",
    textColor: "#ffffff",
    links: [
      {
        label: "Sertifikasi BPJPH",
        href: "#fitur",
        ariaLabel: "Info sertifikasi BPJPH",
      },
      {
        label: "Panduan Halal",
        href: "#fitur",
        ariaLabel: "Panduan cek halal",
      },
    ],
  },
  {
    label: "Tentang",
    bgColor: "#052e16",
    textColor: "#bbf7d0",
    links: [
      {
        label: "Tentang Kami",
        href: "/tentang",
        ariaLabel: "Tentang Halal Check",
      },
      { label: "Kontak", href: "/tentang#footer", ariaLabel: "Hubungi kami" },
    ],
  },
];

/** Item navigasi cepat pill (desktop only, di dalam top bar CardNav) */
const PILL_NAV_ITEMS: CardNavPillItem[] = [
  { label: "Beranda", href: "/", ariaLabel: "Kembali ke beranda" },
  { label: "Layanan", href: "/chat", ariaLabel: "Cek kehalalan produk" },
  { label: "Tentang", href: "/tentang", ariaLabel: "Tentang kami" },
];

export interface NavbarProps {
  /** Tampilkan pill navigation di top bar (desktop only) */
  showPillNav?: boolean;
  /** Halaman aktif saat ini (untuk pill active state) */
  activeHref?: string;
}

export function Navbar({ showPillNav = true, activeHref }: NavbarProps) {
  const { theme, toggleTheme } = useTheme();

  const navBaseColor = theme === "dark" ? "#052e16" : "#ffffff";
  const navMenuColor = theme === "dark" ? "#bbf7d0" : "#14532d";

  const pillBaseColor = theme === "dark" ? "#052e16" : "#ffffff";
  const pillColor = theme === "dark" ? "#166534" : "#16a34a";
  const pillTextColor = theme === "dark" ? "#bbf7d0" : "#ffffff";
  const hoveredPillTextColor = theme === "dark" ? "#bbf7d0" : "#14532d";

  const themeToggle = (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={toggleTheme}
          className="cursor-pointer text-green-700 hover:bg-green-100 dark:text-green-300 dark:hover:bg-green-900"
          aria-label={
            theme === "dark"
              ? "Beralih ke mode terang"
              : "Beralih ke mode gelap"
          }
        >
          {theme === "dark" ? (
            <FaSun className="size-4" />
          ) : (
            <FaMoon className="size-4" />
          )}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{theme === "dark" ? "Mode terang" : "Mode gelap"}</p>
      </TooltipContent>
    </Tooltip>
  );

  const logo = (
    <div className="flex items-center gap-2">
      <HalalLogoIcon className="size-6 text-green-600 dark:text-green-400" />
      <span className="text-sm font-bold text-green-900 dark:text-green-100">
        Halal Check
      </span>
    </div>
  );

  return (
    <CardNav
      logo={logo}
      items={CARD_NAV_ITEMS}
      baseColor={navBaseColor}
      menuColor={navMenuColor}
      extraActions={themeToggle}
      pillItems={showPillNav ? PILL_NAV_ITEMS : undefined}
      pillBaseColor={pillBaseColor}
      pillColor={pillColor}
      pillTextColor={pillTextColor}
      hoveredPillTextColor={hoveredPillTextColor}
      activePillHref={activeHref}
    />
  );
}

export default Navbar;
