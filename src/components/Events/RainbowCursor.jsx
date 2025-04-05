// SprinkleCursor.jsx
import React, { useEffect, useRef } from "react";

const SprinkleCursor = () => {
  const containerRef = useRef(null);
  
  const colors = ["#FF6B6B", "#FFD93D", "#6BCB77", "#4D96FF", "#FF6EC7"];

  useEffect(() => {
    const createSprinkles = (x, y) => {
      const numParticles = Math.floor(Math.random() * 3) + 3;
      for (let i = 0; i < numParticles; i++) {
        const particle = document.createElement("div");

        const offsetX = (Math.random() - 0.5) * 40;
        const offsetY = (Math.random() - 0.5) * 40;
        const size = Math.random() * 3 + 2;
        const color = colors[Math.floor(Math.random() * colors.length)];

        particle.style.position = "absolute";
        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.background = color;
        particle.style.borderRadius = "50%";
        particle.style.pointerEvents = "none";
        particle.style.transform = "translate(-50%, -50%)";
        particle.style.opacity = "1";
        particle.style.transition = "all 0.5s ease-out";

        containerRef.current.appendChild(particle);

        particle.getBoundingClientRect();

        particle.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(1.5)`;
        particle.style.opacity = "0";

        setTimeout(() => {
          particle.remove();
        }, 600);
      }
    };

    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      createSprinkles(clientX, clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        overflow: "hidden",
        zIndex: 100,
      }}
    />
  );
};

export default SprinkleCursor;
