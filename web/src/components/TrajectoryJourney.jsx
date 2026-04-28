import { useEffect, useRef } from 'react';

export default function TrajectoryJourney({ setActiveCategory }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    const nodes = document.querySelectorAll('.traj-node, .trajectory-line');
    nodes.forEach(n => observer.observe(n));

    return () => observer.disconnect();
  }, []);

  return (
    <section className="trajectory-section" ref={containerRef}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h2 className="section-title" style={{ color: '#fff', fontSize: '2.5rem' }}>FIND WHAT YOU NEED</h2>
        <p style={{ color: 'var(--text-muted)' }}>Follow our trajectory to find exactly what you need.</p>
      </div>

      <div className="trajectory-container">
        {/* Magic Glowing SVG Arc */}
        <svg className="trajectory-line" viewBox="0 0 1000 1000" preserveAspectRatio="none">
          <path
            className="arc-path"
            d="M 200,50 C 500,50 850,150 850,350 S 150,550 150,650 S 850,850 850,950"
            fill="none"
            stroke="url(#gradient)"
            strokeWidth="4"
            strokeDasharray="20 20"
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="var(--accent-magenta)" />
              <stop offset="50%" stopColor="var(--accent-cyan)" />
              <stop offset="100%" stopColor="#fff" />
            </linearGradient>
          </defs>
        </svg>

        {/* Node 1 */}
        <div className="traj-node node-1" style={{ '--delay': '0s' }}>
          <div className="traj-card">
            <img src="/images/labels/specialocassion.png" alt="Diwali Occasion Icon" className="traj-icon" />
            <h3>CELEBRATE IN STYLE</h3>
            <p>Add vibrancy to your special occasions. We carry an extensively curated collection explicitly designed to bring cultural festivities like Diwali alive.</p>
            <button
              className="pro-btn"
              onClick={() => {
                if (setActiveCategory) setActiveCategory('Diwali');
                document.querySelector('.products-wrapper')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Shop Diwali Selection
            </button>
          </div>
        </div>

        {/* Node 2 */}
        <div className="traj-node node-2" style={{ '--delay': '0.3s' }}>
          <div className="traj-card">
            <img src="/images/labels/download (1).png" alt="Best Sellers Icon" className="traj-icon" />
            <h3>EXPLORE BEST SELLERS</h3>
            <p>Skip the guesswork and explore our highly curated selection of the most popular, show-stopping fireworks that our customers absolutely adore, year after year.</p>
            <button
              className="pro-btn"
              onClick={() => {
                if (setActiveCategory) setActiveCategory('BEST SELLERS');
                document.querySelector('.products-wrapper')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Shop Best Sellers
            </button>
          </div>
        </div>

        {/* Node 3 */}
        <div className="traj-node node-3" style={{ '--delay': '0.6s' }}>
          <div className="traj-card">
            <img src="/images/labels/Magical_wand_casting_202604201445.jpeg" alt="Low Noise Icon" className="traj-icon" />
            <h3>LOW NOISE FIREWORKS</h3>
            <p>Fireworks don't have to be noisy. For those who don't like big bangs, but enjoy the elegance and magic that they create, we have a selection of low noise or quiet options.</p>
            <button
              className="pro-btn"
              onClick={() => {
                if (setActiveCategory) setActiveCategory('Low Noise');
                document.querySelector('.products-wrapper')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              View Low Noise Range
            </button>
          </div>
        </div>

        {/* Node 4 */}
        <div className="traj-node node-4" style={{ '--delay': '0.9s' }}>
          <div className="traj-card">
            <img src="/images/labels/reviews.png" alt="Reviews Icon" className="traj-icon" />
            <h3>4.6 STAR REVIEWS</h3>
            <p>You only have to look at our reviews to see how we like to treat our customers and how great our products are.</p>
            <button className="pro-btn" onClick={() => window.open('https://share.google/8BR2VKgVXz4WAOMiu', '_blank', 'noopener,noreferrer')}>VIEW OUR REVIEWS</button>
          </div>
        </div>

      </div>
    </section>
  );
}
