import { useEffect, useRef, useState } from 'react';

export default function FireworkAnimation() {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  const descRef = useRef(null);
  const [images, setImages] = useState([]);
  const [loadedCount, setLoadedCount] = useState(0);

  const totalFrames = 198;
  const startFrame = 0; // Starting from the very beginning naturally!

  // Preload images
  useEffect(() => {
    const loadedImages = [];
    let currentCount = 0;

    // We strictly preload the entire sequence
    for (let i = startFrame; i < totalFrames; i++) {
      const img = new Image();
      img.src = `/animation/compressed_webp/Pre-comp 1_${i.toString().padStart(5, '0')}.webp`;

      const onload = () => {
        currentCount++;
        setLoadedCount(currentCount);
        if (currentCount === (totalFrames - startFrame)) {
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
    let lastRenderedFrame = -1;
    let lastCanvasOpacity = -1;
    let lastContainerOpacity = -1;
    let isRunning = true;

    const renderLoop = () => {
      // Lerp interpolation maths (0.08 dictates the "softness" of the drag)
      currentScrollY += (targetScrollY - currentScrollY) * 0.08;

      if (Math.abs(currentScrollY - targetScrollY) < 0.5) {
        currentScrollY = targetScrollY;
      }

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
        virtualFrame = mapRange(currentScrollY, 0, lockedDistance, 0, 170);
      } else {
        virtualFrame = mapRange(currentScrollY, lockedDistance, lockedDistance + (window.innerHeight * 0.6), 170, totalFrames - 1);
      }

      const scrollFrameIndex = Math.min(totalFrames - 1, Math.max(0, Math.floor(virtualFrame)));

      // ONLY redraw if the frame index actually changed! (Massive GPU optimization)
      if (scrollFrameIndex !== lastRenderedFrame) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (images[scrollFrameIndex] && images[scrollFrameIndex].width > 0) {
          ctx.drawImage(images[scrollFrameIndex], 0, 0, canvas.width, canvas.height);
        }
        lastRenderedFrame = scrollFrameIndex;
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
        let newOpacity = 1;
        if (isMobile) {
          const dimProgress = mapRange(virtualFrame, 125, 170, 0, 1);
          newOpacity = 1 - (dimProgress * 0.85);
        } else {
          const dimProgress = mapRange(virtualFrame, 165, 170, 0, 1);
          newOpacity = 1 - (dimProgress * 0.5);
        }
        
        if (Math.abs(newOpacity - lastCanvasOpacity) > 0.01) {
          canvasRef.current.style.opacity = newOpacity;
          lastCanvasOpacity = newOpacity;
        }
      }

      // Opacity Fade Logic when scrolling out of view
      if (containerRef.current) {
        const fadeStart = lockedDistance + (window.innerHeight * 0.5);
        const fadeEnd = lockedDistance + window.innerHeight;

        let newContainerOpacity = 1;
        if (currentScrollY <= fadeStart) {
          newContainerOpacity = 1;
        } else if (currentScrollY >= fadeEnd) {
          newContainerOpacity = 0;
        } else {
          newContainerOpacity = 1 - ((currentScrollY - fadeStart) / (fadeEnd - fadeStart));
        }

        if (Math.abs(newContainerOpacity - lastContainerOpacity) > 0.01) {
          containerRef.current.style.opacity = newContainerOpacity;
          lastContainerOpacity = newContainerOpacity;
        }
      }

      // Stop the loop completely if we've reached the target! (Massive CPU optimization)
      if (currentScrollY === targetScrollY) {
        isRunning = false;
        return;
      }

      animationFrameId = requestAnimationFrame(renderLoop);
    };

    const handleScroll = () => {
      targetScrollY = window.scrollY;
      if (!isRunning) {
        isRunning = true;
        renderLoop();
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // Trigger the initial layout loop bounds
    renderLoop();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(animationFrameId);
    };
  }, [images]);

  const isLoaded = loadedCount === (totalFrames - startFrame);
  const loadingProgress = Math.round((loadedCount / (totalFrames - startFrame)) * 100);

  return (
    <>
      {!isLoaded && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 100,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1.5rem',
          background: 'rgba(11,11,15,0.7)',
          padding: '2rem 3rem',
          borderRadius: '16px',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.05)',
          boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
        }}>
          <h2 style={{ 
            color: 'white', 
            fontFamily: 'Outfit',
            letterSpacing: '3px',
            textTransform: 'uppercase',
            margin: 0,
            fontSize: '1.5rem',
            background: 'linear-gradient(90deg, #fff, #ccc)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Loading Fireworks...
          </h2>
          <div style={{ 
            width: '250px', 
            height: '6px', 
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '10px',
            overflow: 'hidden',
            boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.3)'
          }}>
            <div style={{
              height: '100%',
              width: `${loadingProgress}%`,
              background: 'linear-gradient(90deg, var(--accent-magenta), var(--accent-cyan))',
              transition: 'width 0.1s ease-out',
              borderRadius: '10px',
              boxShadow: '0 0 10px var(--accent-magenta)'
            }} />
          </div>
          <span style={{ 
            color: 'var(--accent-cyan)', 
            fontSize: '1rem', 
            fontWeight: '800',
            fontFamily: 'Outfit',
            letterSpacing: '1px'
          }}>
            {loadingProgress}%
          </span>
        </div>
      )}
      
      <div className="hero-content" style={{ opacity: isLoaded ? 1 : 0, transition: 'opacity 1s ease' }}>
        <p className="hero-desc" ref={descRef}>
          Explore our premium range of fireworks.<br />
          Hover on fireworks, and watch them explode live.
        </p>
      </div>
      <div className="firework-animation-container" ref={containerRef} style={{ opacity: isLoaded ? 1 : 0, transition: 'opacity 1s ease' }}>
        <canvas ref={canvasRef} />
      </div>
    </>
  );
}
