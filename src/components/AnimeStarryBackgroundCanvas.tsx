import React, { useEffect, useRef } from 'react';

export const AnimeStarryBackgroundCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Stars
    const starCount = 120;
    const stars = Array.from({ length: starCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height * 0.75,
      radius: Math.random() * 1.5 + 0.5,
      alpha: Math.random(),
      speed: Math.random() * 0.02 + 0.005,
    }));

    // Floating Petals
    const petalCount = 35;
    const petals = Array.from({ length: petalCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 6 + 4,
      speedX: Math.random() * 1.2 + 0.5,
      speedY: Math.random() * 0.8 + 0.3,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.03,
      opacity: Math.random() * 0.7 + 0.3,
    }));

    // Dandelions on hill
    const dandelions = Array.from({ length: 28 }, () => ({
      xPercent: Math.random(),
      yOffset: Math.random() * 60,
      radius: Math.random() * 3 + 2.5,
    }));

    // Clouds
    let cloudOffset = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // 1. Sky Gradient (Twilight Night Sky)
      const skyGradient = ctx.createLinearGradient(0, 0, 0, height * 0.85);
      skyGradient.addColorStop(0, '#09152b');
      skyGradient.addColorStop(0.4, '#142a4a');
      skyGradient.addColorStop(0.75, '#20436d');
      skyGradient.addColorStop(1, '#2c5980');
      ctx.fillStyle = skyGradient;
      ctx.fillRect(0, 0, width, height);

      // 2. Stars
      stars.forEach((star) => {
        star.alpha += star.speed;
        if (star.alpha > 1 || star.alpha < 0.2) {
          star.speed = -star.speed;
        }
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0, Math.min(1, star.alpha))})`;
        ctx.shadowBlur = star.radius > 1 ? 4 : 0;
        ctx.shadowColor = 'rgba(255, 255, 255, 0.8)';
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // 3. Huge Anime Cumulus Clouds (Right side & center)
      cloudOffset += 0.15;
      const cloudX = width * 0.65 + Math.sin(cloudOffset * 0.01) * 15;
      const cloudY = height * 0.45;

      const drawCloudPuff = (
        cx: number,
        cy: number,
        r: number,
        fillColor: string,
        glowColor?: string
      ) => {
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        if (glowColor) {
          ctx.shadowBlur = 20;
          ctx.shadowColor = glowColor;
        }
        ctx.fillStyle = fillColor;
        ctx.fill();
        ctx.shadowBlur = 0;
      };

      // Base cloud shadow puffs
      drawCloudPuff(cloudX - 80, cloudY + 40, 110, 'rgba(30, 58, 92, 0.7)');
      drawCloudPuff(cloudX + 40, cloudY + 20, 130, 'rgba(40, 72, 110, 0.65)');
      drawCloudPuff(cloudX + 120, cloudY + 80, 100, 'rgba(35, 65, 100, 0.6)');

      // Mid cloud layer
      drawCloudPuff(cloudX - 60, cloudY, 95, 'rgba(160, 195, 225, 0.85)');
      drawCloudPuff(cloudX, cloudY - 60, 115, 'rgba(185, 215, 240, 0.9)');
      drawCloudPuff(cloudX + 70, cloudY - 20, 105, 'rgba(170, 205, 235, 0.85)');

      // Top cloud highlights (glowing anime cloud tops)
      drawCloudPuff(cloudX - 20, cloudY - 80, 85, 'rgba(235, 245, 255, 0.95)', 'rgba(255, 255, 255, 0.5)');
      drawCloudPuff(cloudX + 30, cloudY - 50, 75, 'rgba(245, 250, 255, 0.95)', 'rgba(255, 255, 255, 0.6)');

      // Left background cloud
      drawCloudPuff(width * 0.15, height * 0.3, 110, 'rgba(140, 175, 210, 0.4)');
      drawCloudPuff(width * 0.1, height * 0.25, 80, 'rgba(200, 225, 245, 0.5)');

      // 4. Grassy Hill
      const hillYStart = height * 0.68;
      ctx.beginPath();
      ctx.moveTo(0, height * 0.85);
      ctx.bezierCurveTo(
        width * 0.35,
        hillYStart - 40,
        width * 0.7,
        hillYStart + 30,
        width,
        hillYStart - 10
      );
      ctx.lineTo(width, height);
      ctx.lineTo(0, height);
      ctx.closePath();

      const hillGradient = ctx.createLinearGradient(0, hillYStart - 40, 0, height);
      hillGradient.addColorStop(0, '#367245');
      hillGradient.addColorStop(0.3, '#2a5c36');
      hillGradient.addColorStop(1, '#1b3e24');
      ctx.fillStyle = hillGradient;
      ctx.fill();

      // Front hill layer accent
      ctx.beginPath();
      ctx.moveTo(0, height * 0.82);
      ctx.bezierCurveTo(
        width * 0.25,
        height * 0.75,
        width * 0.6,
        height * 0.88,
        width,
        height * 0.78
      );
      ctx.lineTo(width, height);
      ctx.lineTo(0, height);
      ctx.closePath();
      ctx.fillStyle = '#21492b';
      ctx.fill();

      // 5. White Glowing Dandelions
      dandelions.forEach((d) => {
        const dx = d.xPercent * width;
        const dy = height * 0.78 + d.yOffset;
        if (dy < height) {
          // Stem
          ctx.beginPath();
          ctx.moveTo(dx, dy);
          ctx.lineTo(dx - 2, dy + 12);
          ctx.strokeStyle = '#3e7549';
          ctx.lineWidth = 1.5;
          ctx.stroke();

          // Flower Head
          ctx.beginPath();
          ctx.arc(dx, dy, d.radius, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
          ctx.shadowBlur = 8;
          ctx.shadowColor = 'rgba(255, 255, 255, 0.9)';
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      });

      // 6. Floating White Petals (Wind-blown)
      petals.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;
        p.rotation += p.rotationSpeed;

        if (p.x > width + 20) p.x = -20;
        if (p.y > height + 20) p.y = -20;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);

        ctx.beginPath();
        ctx.ellipse(0, 0, p.size, p.size * 0.45, 0, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
        ctx.shadowBlur = 4;
        ctx.shadowColor = 'rgba(255, 255, 255, 0.6)';
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none"
    />
  );
};
