import type { ComponentProps } from "react";
import halalLogo from "~/assets/halal-logo.svg";

type HalalLogoIconProps = Omit<ComponentProps<"img">, "src" | "alt">;

export function HalalLogoIcon({ className, ...props }: HalalLogoIconProps) {
  return (
    <img
      src={halalLogo}
      alt=""
      aria-hidden="true"
      className={className}
      {...props}
    />
  );
}

export default HalalLogoIcon;
