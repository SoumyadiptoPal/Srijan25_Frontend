import React, { useState, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

function Carousel({ roomType }) {
  const [carouselStart, setCarouselStart] = useState(0);
  const [touchPosition, setTouchPosition] = useState(null);
  const container = useRef<HTMLDivElement | null>(null);

  const previousItem = () => {
    if (carouselStart >= 0)
      window.innerWidth >= 600
        ? setCarouselStart(-29 * (roomType.images.length - 1))
        : setCarouselStart(-50 * roomType.images.length);
    setCarouselStart((prev) => {
      return window.innerWidth >= 600 ? prev + 29 : prev + 50;
    });
  };

  const nextItem = () => {
    if (
      window.innerWidth >= 600 &&
      carouselStart <= (roomType.images.length - 2) * -25
    )
      setCarouselStart(0);
    else if (
      window.innerWidth < 600 &&
      carouselStart <= (roomType.images.length - 1) * -50
    )
      setCarouselStart(0);
    else
      setCarouselStart((prev) => {
        return window?.innerWidth >= 600 ? prev - 29 : prev - 50;
      });
  };

  const handleTouchStart = (e) => {
    setTouchPosition(e.touches[0].clientX);
  };

  const handleTouchMove = (e) => {
    const touchDown = touchPosition;
    if (touchDown === null) return;

    const currentTouch = e.touches[0].clientX;
    const diff = touchDown - currentTouch;

    if (diff > 5) {
      nextItem();
    } else if (diff < -5) {
      previousItem();
    }

    setTouchPosition(null);
  };

  const getLeft = (ind) =>
    window?.innerWidth >= 600
      ? carouselStart - 7 + 29 * (ind + 1)
      : carouselStart - 45 + 50 * (ind + 1);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(
        {
          isDesktop: "(min-width: 640px)",
          isMobile: "(max-width: 639px)",
          reduceMotion: "(prefers-reduced-motion: reduce)",
        },
        (context) => {
          let { isDesktop, reduceMotion } = context.conditions;

          gsap.set(".scrollAnimatedText", {
            y: 75,
            opacity: 0,
          });

          gsap.to(".scrollAnimatedText", {
            y: 0,
            yPercent: -50,
            opacity: 1,
            duration: reduceMotion ? 0 : 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: container.current,
              start: isDesktop ? "top 45%" : "top 80%",
            },
          });

          gsap.set(".scrollAnimatedImage", {
            y: 75,
            xPercent: -50,
            opacity: 0,
          });

          gsap.to(".scrollAnimatedImage", {
            y: 0,
            yPercent: -50,
            xPercent: -50,
            opacity: 1,
            duration: reduceMotion ? 0 : 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: container.current,
              start: isDesktop ? "top 45%" : "top 80%",
            },
          });
        },
      );
    },
    {
      scope: container,
    },
  );

  return (
    <div
      ref={container}
      className="w-full relative border-greyBorder border-t grid grid-cols-1 sm:grid-cols-5 grid-rows-3 sm:grid-rows-1 h-[85vh] sm:h-[80vh] overflow-x-hidden"
    >
      <div className="relative bg-background z-[100] h-full border-greyBorder border-b sm:border-b-transparent sm:border-r sm:-mr-[1px] row-span-1">
        <div className="sm:hidden absolute left-[50%] -translate-x-[50%] h-full border-greyBorder border-l border-r w-5/7"></div>
        <h2 className="scrollAnimatedText absolute text-2xl sm:text-xl xl:text-3xl text-center top-[50%] left-[50%] -translate-[50%]">
          {roomType.name}
        </h2>
        <div className="absolute top-[65%] left-[50%] -translate-x-[50%] flex gap-x-3">
          <button className={`text-7xl font-bold`} onClick={previousItem}>
            &lsaquo;
          </button>
          <button onClick={nextItem} className={`text-7xl font-bold`}>
            &rsaquo;
          </button>
        </div>
        <img
          src="heading-outline.svg"
          alt="Outline for header"
          width="auto"
          height="auto"
          loading="lazy"
          className="px-2 scrollAnimatedImage absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%]"
        />
      </div>
      <div className="border-greyBorder sm:border-r sm:border-l col-span-3 grid grid-cols-2 row-span-2">
        <div className="border-greyBorder border-r"></div>
        <div></div>
      </div>
      <div
        className="absolute h-full w-screen overflow-x-hidden"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
      >
        <div className="sm:hidden absolute left-[50%] -translate-x-[50%] h-full border-greyBorder border-l border-r w-5/7"></div>
        {roomType.images.map((src, ind) => {
          const left = getLeft(ind);
          return (
            <div
              key={ind}
              className={`h-3/5 text-left text-nowrap absolute transition-all duration-1000 top-[50%] -translate-y-[20%] xl:-translate-y-[55%] p-2 ${carouselStart === ind * -50 ? "" : "opacity-0 pointer-events-none sm:pointer-events-auto sm:opacity-100"}`}
              style={{ left: `${left}%` }}
            >
              <div className="flex flex-col items-center gap-y-2 w-[87.5vw] sm:w-[25vw] aspect-square h-auto">
                <div className="bg-gradient-to-b from-red via-lavender to-white p-0.5 h-full">
                  <img
                    loading="lazy"
                    src={`/accommodation/${src}`}
                    alt={roomType.name}
                    height="auto"
                    width="auto"
                    className="object-cover aspect-square h-full bg-background p-1.5"
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="bg-background z-[100] h-full border-greyBorder sm:border-l -ml-[1px]"></div>
    </div>
  );
}

export default Carousel;
