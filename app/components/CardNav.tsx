import React, { useLayoutEffect, useRef, useState } from 'react';
import { Link } from 'react-router';
import { gsap } from 'gsap';
import { GoArrowUpRight } from 'react-icons/go';

// ---- Types ----

type CardNavLink = {
  label: string;
  href: string;
  ariaLabel: string;
};

export type CardNavItem = {
  label: string;
  bgColor: string;
  textColor: string;
  links: CardNavLink[];
};

export type CardNavPillItem = {
  label: string;
  href: string;
  ariaLabel?: string;
};

export interface CardNavProps {
  /** URL gambar atau ReactNode untuk logo */
  logo: string | React.ReactNode;
  logoAlt?: string;
  items: CardNavItem[];
  className?: string;
  ease?: string;
  baseColor?: string;
  menuColor?: string;
  buttonBgColor?: string;
  buttonTextColor?: string;
  /** Label tombol CTA */
  ctaLabel?: string;
  /** URL tujuan tombol CTA */
  ctaLink?: string;
  /** Elemen tambahan di sisi kanan top bar */
  extraActions?: React.ReactNode;
  /** Item navigasi pill (tampil di desktop saja) */
  pillItems?: CardNavPillItem[];
  /** Warna background container pill */
  pillBaseColor?: string;
  /** Warna background tiap pill */
  pillColor?: string;
  /** Warna teks pada pill */
  pillTextColor?: string;
  /** Warna teks saat hover pada pill */
  hoveredPillTextColor?: string;
  /** Href aktif untuk pill active indicator */
  activePillHref?: string;
}

// ---- Component ----

const CardNav: React.FC<CardNavProps> = ({
  logo,
  logoAlt = 'Logo',
  items,
  className = '',
  ease = 'power3.out',
  baseColor = '#fff',
  menuColor,
  buttonBgColor,
  buttonTextColor,
  ctaLabel = 'Get Started',
  ctaLink,
  extraActions,
  pillItems,
  pillBaseColor,
  pillColor,
  pillTextColor,
  hoveredPillTextColor,
  activePillHref,
}) => {
  const [isHamburgerOpen, setIsHamburgerOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const navRef = useRef<HTMLDivElement | null>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  // Pill animation refs
  const pillCircleRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const pillTlRefs = useRef<Array<gsap.core.Timeline | null>>([]);
  const pillActiveTweenRefs = useRef<Array<gsap.core.Tween | null>>([]);

  const hasPillItems = Boolean(pillItems && pillItems.length > 0);
  const resolvedPillBaseColor = pillBaseColor || baseColor;

  // ---- Card expand/collapse ----

  const calculateHeight = () => {
    const navEl = navRef.current;
    if (!navEl) return 260;

    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    if (isMobile) {
      const contentEl = navEl.querySelector('.card-nav-content') as HTMLElement;
      if (contentEl) {
        const wasVisible = contentEl.style.visibility;
        const wasPointerEvents = contentEl.style.pointerEvents;
        const wasPosition = contentEl.style.position;
        const wasHeight = contentEl.style.height;

        contentEl.style.visibility = 'visible';
        contentEl.style.pointerEvents = 'auto';
        contentEl.style.position = 'static';
        contentEl.style.height = 'auto';

        contentEl.offsetHeight;

        const topBar = 60;
        const padding = 16;
        const contentHeight = contentEl.scrollHeight;

        contentEl.style.visibility = wasVisible;
        contentEl.style.pointerEvents = wasPointerEvents;
        contentEl.style.position = wasPosition;
        contentEl.style.height = wasHeight;

        return topBar + contentHeight + padding;
      }
    }
    return 260;
  };

  const createTimeline = () => {
    const navEl = navRef.current;
    if (!navEl) return null;

    gsap.set(navEl, { height: 60, overflow: 'hidden' });
    gsap.set(cardsRef.current, { y: 50, opacity: 0 });

    const tl = gsap.timeline({ paused: true });

    tl.to(navEl, {
      height: calculateHeight,
      duration: 0.4,
      ease,
    });

    tl.to(
      cardsRef.current,
      { y: 0, opacity: 1, duration: 0.4, ease, stagger: 0.08 },
      '-=0.1',
    );

    return tl;
  };

  useLayoutEffect(() => {
    const tl = createTimeline();
    tlRef.current = tl;

    return () => {
      tl?.kill();
      tlRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ease, items]);

  useLayoutEffect(() => {
    const handleResize = () => {
      if (!tlRef.current) return;

      if (isExpanded) {
        const newHeight = calculateHeight();
        gsap.set(navRef.current, { height: newHeight });

        tlRef.current.kill();
        const newTl = createTimeline();
        if (newTl) {
          newTl.progress(1);
          tlRef.current = newTl;
        }
      } else {
        tlRef.current.kill();
        const newTl = createTimeline();
        if (newTl) {
          tlRef.current = newTl;
        }
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isExpanded]);

  // ---- Pill hover animations ----

  useLayoutEffect(() => {
    if (!hasPillItems) return;

    const layoutPills = () => {
      pillCircleRefs.current.forEach((circle, index) => {
        if (!circle?.parentElement) return;

        const pill = circle.parentElement as HTMLElement;
        const rect = pill.getBoundingClientRect();
        const { width: w, height: h } = rect;
        const R = ((w * w) / 4 + h * h) / (2 * h);
        const D = Math.ceil(2 * R) + 2;
        const delta =
          Math.ceil(R - Math.sqrt(Math.max(0, R * R - (w * w) / 4))) + 1;
        const originY = D - delta;

        circle.style.width = `${D}px`;
        circle.style.height = `${D}px`;
        circle.style.bottom = `-${delta}px`;

        gsap.set(circle, {
          xPercent: -50,
          scale: 0,
          transformOrigin: `50% ${originY}px`,
        });

        const label = pill.querySelector<HTMLElement>('.pill-label');
        const hoverLabel = pill.querySelector<HTMLElement>('.pill-label-hover');

        if (label) gsap.set(label, { y: 0 });
        if (hoverLabel) gsap.set(hoverLabel, { y: h + 12, opacity: 0 });

        pillTlRefs.current[index]?.kill();
        const tl = gsap.timeline({ paused: true });

        tl.to(
          circle,
          { scale: 1.2, xPercent: -50, duration: 2, ease, overwrite: 'auto' },
          0,
        );

        if (label) {
          tl.to(
            label,
            { y: -(h + 8), duration: 2, ease, overwrite: 'auto' },
            0,
          );
        }

        if (hoverLabel) {
          gsap.set(hoverLabel, { y: Math.ceil(h + 100), opacity: 0 });
          tl.to(
            hoverLabel,
            { y: 0, opacity: 1, duration: 2, ease, overwrite: 'auto' },
            0,
          );
        }

        pillTlRefs.current[index] = tl;
      });
    };

    layoutPills();
    window.addEventListener('resize', layoutPills);
    if (document.fonts) {
      document.fonts.ready.then(layoutPills).catch(() => {});
    }

    return () => window.removeEventListener('resize', layoutPills);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pillItems, ease]);

  const handlePillEnter = (i: number) => {
    const tl = pillTlRefs.current[i];
    if (!tl) return;
    pillActiveTweenRefs.current[i]?.kill();
    pillActiveTweenRefs.current[i] = tl.tweenTo(tl.duration(), {
      duration: 0.3,
      ease,
      overwrite: 'auto',
    });
  };

  const handlePillLeave = (i: number) => {
    const tl = pillTlRefs.current[i];
    if (!tl) return;
    pillActiveTweenRefs.current[i]?.kill();
    pillActiveTweenRefs.current[i] = tl.tweenTo(0, {
      duration: 0.2,
      ease,
      overwrite: 'auto',
    });
  };

  // ---- Common helpers ----

  const toggleMenu = () => {
    const tl = tlRef.current;
    if (!tl) return;
    if (!isExpanded) {
      setIsHamburgerOpen(true);
      setIsExpanded(true);
      tl.play(0);
    } else {
      setIsHamburgerOpen(false);
      tl.eventCallback('onReverseComplete', () => setIsExpanded(false));
      tl.reverse();
    }
  };

  const setCardRef = (i: number) => (el: HTMLDivElement | null) => {
    if (el) cardsRef.current[i] = el;
  };

  const isInternalLink = (href: string) =>
    href.startsWith('/') || href.startsWith('#');

  const renderLogo = () => {
    if (typeof logo === 'string') {
      return <img src={logo} alt={logoAlt} className="logo h-[28px]" />;
    }
    return logo;
  };

  // ---- Pill item rendering ----

  const renderPillItem = (item: CardNavPillItem, index: number) => {
    const isActive = activePillHref === item.href;

    const style: React.CSSProperties = {
      background: pillColor,
      color: pillTextColor,
      paddingLeft: '18px',
      paddingRight: '18px',
    };

    const content = (
      <>
        <span
          className="absolute left-1/2 bottom-0 rounded-full z-[1] block pointer-events-none"
          style={{ background: resolvedPillBaseColor, willChange: 'transform' }}
          ref={(el) => {
            pillCircleRefs.current[index] = el;
          }}
          aria-hidden="true"
        />
        <span className="relative inline-block leading-[1] z-[2]">
          <span
            className="pill-label relative z-[2] inline-block leading-[1]"
            style={{ willChange: 'transform' }}
          >
            {item.label}
          </span>
          <span
            className="pill-label-hover absolute left-0 top-0 z-[3] inline-block"
            style={{
              color: hoveredPillTextColor,
              willChange: 'transform, opacity',
            }}
            aria-hidden="true"
          >
            {item.label}
          </span>
        </span>
        {isActive && (
          <span
            className="absolute left-1/2 -bottom-[6px] -translate-x-1/2 w-3 h-3 rounded-full z-[4]"
            style={{ background: resolvedPillBaseColor }}
            aria-hidden="true"
          />
        )}
      </>
    );

    const pillClasses =
      'relative overflow-hidden inline-flex items-center justify-center h-full no-underline rounded-full font-semibold text-[14px] leading-[0] uppercase tracking-[0.2px] whitespace-nowrap cursor-pointer';

    const sharedProps = {
      role: 'menuitem' as const,
      className: pillClasses,
      style,
      'aria-label': item.ariaLabel || item.label,
      onMouseEnter: () => handlePillEnter(index),
      onMouseLeave: () => handlePillLeave(index),
    };

    return (
      <li key={item.href} role="none" className="flex h-full">
        {isInternalLink(item.href) ? (
          <Link to={item.href} {...sharedProps}>
            {content}
          </Link>
        ) : (
          <a href={item.href} {...sharedProps}>
            {content}
          </a>
        )}
      </li>
    );
  };

  // ---- Render ----

  return (
    <div
      className={`card-nav-container fixed left-1/2 -translate-x-1/2 w-[90%] max-w-[800px] z-[99] top-[1.2em] md:top-[2em] ${className}`}
    >
      <nav
        ref={navRef}
        className={`card-nav ${isExpanded ? 'open' : ''} block h-[60px] p-0 rounded-xl shadow-md relative overflow-hidden will-change-[height]`}
        style={{ backgroundColor: baseColor }}
      >
        <div className="card-nav-top absolute inset-x-0 top-0 h-[60px] flex items-center justify-between p-2 px-[1.1rem] z-[2]">
          {/* Logo (kiri) */}
          <div
            className={`logo-container flex items-center ${
              hasPillItems
                ? ''
                : 'md:absolute md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2'
            }`}
          >
            {renderLogo()}
          </div>

          {/* Pill Navigation (desktop only, tengah) */}
          {hasPillItems && (
            <div className="hidden md:flex flex-1 items-center justify-center">
              <div
                className="relative flex items-center rounded-full"
                style={{
                  height: '36px',
                  background: resolvedPillBaseColor,
                }}
              >
                <ul
                  role="menubar"
                  className="list-none flex items-stretch m-0 p-[3px] h-full"
                  style={{ gap: '12px' }}
                >
                  {pillItems?.map((item, i) => renderPillItem(item, i))}
                </ul>
              </div>
            </div>
          )}

          {/* Kanan: extra actions + CTA (opsional) + hamburger */}
          <div className="flex items-center gap-3">
            {extraActions}
            {ctaLink && (
              <Link
                to={ctaLink}
                className="card-nav-cta-button hidden md:inline-flex border-0 rounded-[calc(0.75rem-0.2rem)] px-4 items-center h-full font-medium cursor-pointer transition-colors duration-300 no-underline"
                style={{
                  backgroundColor: buttonBgColor,
                  color: buttonTextColor,
                }}
              >
                {ctaLabel}
              </Link>
            )}
            <div
              className={`hamburger-menu ${isHamburgerOpen ? 'open' : ''} group h-full md:hidden flex flex-col items-center justify-center cursor-pointer gap-[6px]`}
              onClick={toggleMenu}
              role="button"
              aria-label={isExpanded ? 'Tutup menu' : 'Buka menu'}
              tabIndex={0}
              style={{ color: menuColor || '#000' }}
            >
              <div
                className={`hamburger-line w-[30px] h-[2px] bg-current transition-[transform,opacity,margin] duration-300 ease-linear [transform-origin:50%_50%] ${
                  isHamburgerOpen ? 'translate-y-[4px] rotate-45' : ''
                } group-hover:opacity-75`}
              />
              <div
                className={`hamburger-line w-[30px] h-[2px] bg-current transition-[transform,opacity,margin] duration-300 ease-linear [transform-origin:50%_50%] ${
                  isHamburgerOpen ? '-translate-y-[4px] -rotate-45' : ''
                } group-hover:opacity-75`}
              />
            </div>
          </div>
        </div>

        <div
          className={`card-nav-content absolute left-0 right-0 top-[60px] bottom-0 p-2 flex flex-col items-stretch gap-2 justify-start z-[1] ${
            isExpanded
              ? 'visible pointer-events-auto'
              : 'invisible pointer-events-none'
          } md:flex-row md:items-end md:gap-[12px]`}
          aria-hidden={!isExpanded}
        >
          {(items || []).slice(0, 3).map((item, idx) => (
            <div
              key={`${item.label}-${idx}`}
              className="nav-card select-none relative flex flex-col gap-2 p-[12px_16px] rounded-[calc(0.75rem-0.2rem)] min-w-0 flex-[1_1_auto] h-auto min-h-[60px] md:h-full md:min-h-0 md:flex-[1_1_0%]"
              ref={setCardRef(idx)}
              style={{ backgroundColor: item.bgColor, color: item.textColor }}
            >
              <div className="nav-card-label font-normal tracking-[-0.5px] text-[18px] md:text-[22px]">
                {item.label}
              </div>
              <div className="nav-card-links mt-auto flex flex-col gap-[2px]">
                {item.links?.map((lnk, i) => {
                  const linkContent = (
                    <>
                      <GoArrowUpRight
                        className="nav-card-link-icon shrink-0"
                        aria-hidden="true"
                      />
                      {lnk.label}
                    </>
                  );

                  if (isInternalLink(lnk.href)) {
                    return (
                      <Link
                        key={`${lnk.label}-${i}`}
                        className="nav-card-link inline-flex items-center gap-[6px] no-underline cursor-pointer transition-opacity duration-300 hover:opacity-75 text-[15px] md:text-[16px]"
                        to={lnk.href}
                        aria-label={lnk.ariaLabel}
                        style={{ color: 'inherit' }}
                      >
                        {linkContent}
                      </Link>
                    );
                  }

                  return (
                    <a
                      key={`${lnk.label}-${i}`}
                      className="nav-card-link inline-flex items-center gap-[6px] no-underline cursor-pointer transition-opacity duration-300 hover:opacity-75 text-[15px] md:text-[16px]"
                      href={lnk.href}
                      aria-label={lnk.ariaLabel}
                      style={{ color: 'inherit' }}
                    >
                      {linkContent}
                    </a>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default CardNav;
