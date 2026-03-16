import { HalalLogoIcon } from "~/components/HalalLogoIcon";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="footer" className="bg-green-950 px-4 py-12 text-green-100">
      <div className="mx-auto max-w-6xl text-center">
        <div className="mb-4 flex items-center justify-center gap-2">
          <HalalLogoIcon className="size-8 text-green-400" />
          <span className="text-xl font-bold">Halal Check</span>
        </div>
        <p className="text-sm text-green-100/60">
          &copy; {currentYear} Halal Check. Sistem verifikasi kehalalan produk
          berbasis AI.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
