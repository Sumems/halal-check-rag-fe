import { useEffect, useRef } from 'react';
import type { FC, ReactNode } from 'react';
import { gsap } from 'gsap';

interface GridMotionProps {
  items?: (string | ReactNode)[];
  gradientColor?: string;
}

const GridMotion: FC<GridMotionProps> = ({ items = [], gradientColor = 'black' }) => {
  const gridRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);

  const totalItems = 28;
  const defaultItems = Array.from({ length: totalItems }, (_, index) => `Item ${index + 1}`);
  const combinedItems = items.length > 0 ? items.slice(0, totalItems) : defaultItems;

  // Duplicate items lebih banyak (4x) untuk memastikan layar penuh dan seamless loop
  const getRowItems = (rowIndex: number) => {
    const original = [];
    for (let i = 0; i < 7; i++) {
      original.push(combinedItems[rowIndex * 7 + i]);
    }
    // Duplicate 4x: [set1, set2, set3, set4]
    // set1 & set2 terlihat di layar, set3 & set4 untuk buffer marquee
    return [...original, ...original, ...original, ...original];
  };

  useEffect(() => {
    gsap.ticker.lagSmoothing(0);

    rowRefs.current.forEach((row, index) => {
      if (row) {
        const direction = index % 2 === 0 ? -1 : 1;
        const setWidth = row.scrollWidth / 4;
        const duration = 30;

        if (direction === -1) {
          // GERAK KE KIRI (Row Ganjil)
          gsap.set(row, { x: 0 });
          gsap.to(row, {
            x: -setWidth,
            duration: duration,
            ease: 'linear',
            repeat: -1,
          });
        } else {
          // GERAK KE KANAN (Row Genap)
          gsap.set(row, { x: -setWidth });
          gsap.to(row, {
            x: 0,
            duration: duration,
            ease: 'linear',
            repeat: -1,
          });
        }
      }
    });

    return () => {
      rowRefs.current.forEach((row) => {
        if (row) {
          gsap.killTweensOf(row);
        }
      });
    };
    // Re-run effect jika items berubah/window resize
  }, []);

  return (
    <div ref={gridRef} className="h-full w-full overflow-hidden">
      <section
        className="w-full h-screen overflow-hidden relative flex items-center justify-center"
        style={{
          background: `radial-gradient(circle, ${gradientColor} 0%, transparent 100%)`
        }}
      >
        <div className="absolute inset-0 pointer-events-none z-[4] bg-[length:250px]"></div>
        <div className="gap-3 md:gap-4 flex-none relative w-[300vw] h-[130vh] md:w-[200vw] md:h-[150vh] grid grid-rows-4 grid-cols-1 rotate-[-15deg] origin-center z-[2]">
          {Array.from({ length: 4 }, (_, rowIndex) => (
            <div
              key={rowIndex}
              className="flex gap-3 md:gap-4"
              style={{ willChange: 'transform' }}
              ref={el => {
                if (el) rowRefs.current[rowIndex] = el;
              }}
            >
              {getRowItems(rowIndex).map((content, itemIndex) => (
                <div key={itemIndex} className="flex-shrink-0 w-[calc(300vw/8)] md:w-[calc(200vw/10)]">
                 {/* Width item disesuaikan agar tidak terlalu lebar/sempit */}
                  <div className="w-full h-full overflow-hidden rounded-[10px] bg-green-800 dark:bg-white flex items-center justify-center text-white dark:text-green-800 text-[1.5rem]">
                    {typeof content === 'string' && content.startsWith('http') ? (
                      <div
                        className="w-full h-full bg-cover bg-center absolute top-0 left-0"
                        style={{ backgroundImage: `url(${content})` }}
                      ></div>
                    ) : (
                      <div className="p-4 text-center z-[1]">{content}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className="relative w-full h-full top-0 left-0 pointer-events-none"></div>
      </section>
    </div>
  );
};

export default GridMotion;
