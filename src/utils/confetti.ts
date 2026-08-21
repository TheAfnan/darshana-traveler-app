export function triggerConfetti(options?: { count?: number; originY?: number }) {
  const count = options?.count || 40;
  const colors = ['#059669', '#10B981', '#34D399', '#EA580C', '#F59E0B'];

  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.top = '0';
  container.style.left = '0';
  container.style.width = '100vw';
  container.style.height = '100vh';
  container.style.pointerEvents = 'none';
  container.style.zIndex = '9999';
  container.style.overflow = 'hidden';
  document.body.appendChild(container);

  for (let i = 0; i < count; i++) {
    const particle = document.createElement('div');
    const size = Math.random() * 8 + 6;
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    particle.style.position = 'absolute';
    particle.style.width = `${size}px`;
    particle.style.height = `${size * 0.8}px`;
    particle.style.backgroundColor = color;
    particle.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
    particle.style.left = `${Math.random() * 100}vw`;
    particle.style.top = `${(options?.originY || 0.6) * 100}vh`;
    particle.style.opacity = '1';
    particle.style.transform = `rotate(${Math.random() * 360}deg)`;
    particle.style.transition = `all ${Math.random() * 1.5 + 1}s cubic-bezier(0.25, 1, 0.5, 1)`;

    container.appendChild(particle);

    requestAnimationFrame(() => {
      const angle = (Math.random() - 0.5) * 120;
      const distance = Math.random() * 300 + 100;
      particle.style.transform = `translate(${angle}px, -${distance}px) rotate(${Math.random() * 720}deg) scale(0)`;
      particle.style.opacity = '0';
    });
  }

  setTimeout(() => {
    container.remove();
  }, 2500);
}
