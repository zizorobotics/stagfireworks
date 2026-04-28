import { useEffect, useRef, useState } from 'react';

export default function FireworkAnimation() {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  const descRef = useRef(null);
  const [images, setImages] = useState([]);

  const totalFrames = 198;
  const startFrame = 0; // Starting from the very beginning naturally!

  // Preload images
  useEffect(() => {
    const loadedImages = [];
    let loadedCount = 0;

    // We strictly preload the entire sequence
    for (let i = startFrame; i < totalFrames; i++) {
      const img = new Image();
      img.src = `/animation/compressed_webp/Pre-comp 1_${i.toString().padStart(5, '0')}.webp`;

      const onload = () => {
        loadedCount++;
        if (loadedCount === (totalFrames - startFrame)) {
          setImages(loadedImages);
        }
      };

      img.onload = onload;
      img.onerror = onload;
      // Insert perfectly into the sparse array so the indices match perfectly
      loadedImages[i] = img;
    }
  }, []);

  // Pure Scroll-Driven Explosion (88 to 183)
  useEffect(() => {
    // Wait until they are loaded
    if (!images[startFrame]) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // Scale canvas to the first valid native frame dimension
    const baseImg = images[startFrame];
    if (baseImg && baseImg.width > 0) {
      canvas.width = baseImg.width;
      canvas.height = baseImg.height;
    }

    let targetScrollY = window.scrollY;
    let currentScrollY = window.scrollY;
    let animationFrameId;

    const renderLoop = () => {
      // Lerp interpolation maths (0.08 dictates the "softness" of the drag)
      currentScrollY += (targetScrollY - currentScrollY) * 0.08;

      // Easing/Maths
      const mapRange = (value, inMin, inMax, outMin, outMax) => {
        if (value <= inMin) return outMin;
        if (value >= inMax) return outMax;
        return outMin + ((value - inMin) / (inMax - inMin)) * (outMax - outMin);
      };
      const easeOutQuart = (x) => 1 - Math.pow(1 - x, 4);

      // We hold the hero safely locked strictly for the first 130vh of sliding
      const lockedDistance = window.innerHeight * 1.3;

      // Calculate dual-phase virtual framing to allow independent sliding playbacks organically
      let virtualFrame = 0;
      if (currentScrollY <= lockedDistance) {
        // From 0 to 130vh, we map exclusively straight to Frame 170 natively (where text pops)
        virtualFrame = mapRange(currentScrollY, 0, lockedDistance, 0, 170);
      } else {
        // Automatically play out the remaining explosion frames smoothly while the view freely slides up!
        virtualFrame = mapRange(currentScrollY, lockedDistance, lockedDistance + (window.innerHeight * 0.6), 170, totalFrames - 1);
      }

      const scrollFrameIndex = Math.min(totalFrames - 1, Math.max(0, Math.floor(virtualFrame)));

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (images[scrollFrameIndex] && images[scrollFrameIndex].width > 0) {
        ctx.drawImage(images[scrollFrameIndex], 0, 0, canvas.width, canvas.height);
      }

      // Animation calculations

      if (descRef.current) {
        // Opacity and slide mapped to frame 145-165
        const p = mapRange(virtualFrame, 145, 165, 0, 1);
        descRef.current.style.opacity = p;
        descRef.current.style.transform = `translate3d(0, ${(1 - easeOutQuart(p)) * 150}px, 0)`;
      }

      // Dim the fireworks canvas elegantly to boost text clarity
      if (canvasRef.current) {
        const isMobile = window.innerWidth <= 768;
        
        if (isMobile) {
          // Mobile: Start dimming 40 frames earlier (125) and go much dimmer (15% opacity)
          const dimProgress = mapRange(virtualFrame, 125, 170, 0, 1);
          canvasRef.current.style.opacity = 1 - (dimProgress * 0.85);
        } else {
          // Desktop: Original dimming (165-170, down to 50% opacity)
          const dimProgress = mapRange(virtualFrame, 165, 170, 0, 1);
          canvasRef.current.style.opacity = 1 - (dimProgress * 0.5);
        }
      }

      // Opacity Fade Logic when scrolling out of view
      if (containerRef.current) {
        const fadeStart = lockedDistance + (window.innerHeight * 0.5);
        const fadeEnd = lockedDistance + window.innerHeight;

        if (currentScrollY <= fadeStart) {
          containerRef.current.style.opacity = 1;
        } else if (currentScrollY >= fadeEnd) {
          containerRef.current.style.opacity = 0;
        } else {
          containerRef.current.style.opacity = 1 - ((currentScrollY - fadeStart) / (fadeEnd - fadeStart));
        }
      }

      animationFrameId = requestAnimationFrame(renderLoop);
    };

    const handleScroll = () => {
      targetScrollY = window.scrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // Trigger the initial layout loop bounds
    renderLoop();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(animationFrameId);
    };
  }, [images]);

  return (
    <>
      <div className="hero-content">
        <p className="hero-desc" ref={descRef}>
          Explore our premium range of fireworks.<br />
          Hover on fireworks, and watch them explode live.
        </p>
      </div>
      <div className="firework-animation-container" ref={containerRef}>
        <canvas ref={canvasRef} />
      </div>
    </>
  );
}
