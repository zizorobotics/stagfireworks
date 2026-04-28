import React from 'react';

export default function PromoPage() {
  return (
    <div style={{ backgroundColor: '#050505', minHeight: '100vh', color: 'white', paddingBottom: '4rem' }}>
      <style>{`
        @keyframes fadeInSlide {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-section {
          animation: fadeInSlide 0.8s ease-out forwards;
          opacity: 0;
        }
        .anim-delay-1 { animation-delay: 0.1s; }
        .anim-delay-2 { animation-delay: 0.3s; }
        .anim-delay-3 { animation-delay: 0.5s; }
      `}</style>

      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #0a0a0a 0%, #150f1a 100%)', padding: '8rem 2rem 4rem 2rem', textAlign: 'center', borderBottom: '1px solid #333' }}>
        <h1 className="animate-section" style={{ color: 'var(--accent-magenta)', fontSize: '3rem', margin: '0' }}>STAG FIREWORKS PROMOS</h1>
        <p className="animate-section" style={{ color: 'var(--text-muted)', fontSize: '1.2rem', marginTop: '1rem', maxWidth: '800px', margin: '1rem auto 0 auto' }}>
          Discover the power of Vivid Pyrotechnics and take a visual tour of our extensive Rotherham showroom.
        </p>
        <div className="animate-section" style={{ marginTop: '2rem' }}>
          <button className="pro-btn" onClick={() => window.location.href = '/'} style={{ background: 'transparent', border: '1px solid #555' }}>← Return to Store</button>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '3rem auto', display: 'flex', flexDirection: 'column', gap: '3rem', padding: '0 1.5rem' }}>

        {/* Section 1: Vivid Pyrotechnics (promo2.mp4) */}
        <div className="animate-section anim-delay-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem', background: '#111218', padding: '3rem', borderRadius: '16px', borderLeft: '4px solid var(--accent-magenta)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <h2 style={{ fontSize: '2rem', color: 'white', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              Vivid Pyrotechnics
            </h2>
            <p style={{ color: '#ccc', lineHeight: '1.8', marginBottom: '1.5rem' }}>
              Vivid Pyrotechnics is one of the UK’s leading fireworks brands, renowned for bold colours, precision timing, and cutting-edge design. Founded in 2017, they constantly push creative boundaries in every display they orchestrate.
              <br /><br />
              <strong style={{ color: 'var(--accent-magenta)' }}>🏆 BEST BRAND WINNER – 2022</strong><br />
              <strong style={{ color: 'var(--accent-cyan)' }}>INNOVATION AWARD – 2021, 2022, 2023</strong><br />
              <strong style={{ color: '#ffd700' }}>BEST COMPOUND, F3 CAKE & ROCKET PACK – 2023</strong>
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <video src="/videos/promo2.mp4" autoPlay loop muted playsInline controls style={{ width: '100%', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}></video>
          </div>
        </div>

        {/* Section 2: Showroom Tour (promo1.mp4) */}
        <div className="animate-section anim-delay-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem', background: '#181216', padding: '3rem', borderRadius: '16px', borderLeft: '4px solid var(--accent-cyan)', direction: 'rtl' }}>
          <div style={{ direction: 'ltr', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <h2 style={{ fontSize: '2rem', color: 'white', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span>📍</span> Rotherham Showroom Tour
            </h2>
            <p style={{ color: '#ccc', lineHeight: '1.8' }}>
              Welcome to our massive Stag Fireworks showroom located right here in the heart of <strong>Rotherham</strong>. We carry the widest physical selection of premium compounds, rockets, and barrages ready to pick up today.
              <br /><br />
              Come visit us in-store to explore the products firsthand and get expert advice from our professional pyrotechnicians on building the ultimate custom display for your upcoming event!
            </p>
          </div>
          <div style={{ direction: 'ltr', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <video src="/videos/promo1.mp4" autoPlay loop muted playsInline controls style={{ width: '100%', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}></video>
          </div>
        </div>

        {/* Section 3: Extra Promos (promo3.mp4 & promo4.mp4) */}
        <div className="animate-section anim-delay-3" style={{ background: '#111218', padding: '3rem', borderRadius: '16px', borderLeft: '4px solid #ffd700' }}>
          <h2 style={{ fontSize: '2rem', color: 'white', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            More Sparks in Action
          </h2>
          <p style={{ color: '#ccc', lineHeight: '1.8', marginBottom: '2rem' }}>
            Check out some of our other latest promotional showcases featuring raw, jaw-dropping pyro in action.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            <video src="/videos/promo3.mp4" autoPlay loop muted playsInline controls style={{ width: '100%', borderRadius: '12px', boxSizing: 'border-box', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}></video>
            <video src="/videos/promo4.mp4" autoPlay loop muted playsInline controls style={{ width: '100%', borderRadius: '12px', boxSizing: 'border-box', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}></video>
          </div>
        </div>

      </div>
    </div>
  );
}
