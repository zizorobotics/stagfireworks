import React from 'react';

export default function SafetyPage() {
  return (
    <div style={{ backgroundColor: '#050505', minHeight: '100vh', color: 'white', paddingBottom: '4rem' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #0a0a0a 0%, #150f1a 100%)', padding: '8rem 2rem 4rem 2rem', textAlign: 'center', borderBottom: '1px solid #333' }}>
        <h1 style={{ color: 'var(--accent-magenta)', fontSize: '3rem', margin: '0' }}>STAG FIREWORKS SAFETY HUB</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', marginTop: '1rem', maxWidth: '800px', margin: '1rem auto 0 auto' }}>
          Your safety is our absolute priority. We want you to enjoy our premium displays securely. Familiarize yourself comprehensively with the UK legal parameters and our expert protocols before igniting any purchased fireworks.
        </p>
        <div style={{ marginTop: '2rem' }}>
          <a href="/fireworks_safety_detailed_guide.pdf" download="Stag_Fireworks_Safety_Guide.pdf" target="_blank" rel="noopener noreferrer" className="submit-btn" style={{ padding: '1rem 3rem', display: 'inline-block', textDecoration: 'none' }}>📥 Download Official Safety PDF</a>
          <br/>
          <button className="pro-btn" onClick={() => window.location.href = '/'} style={{ marginTop: '1rem', background: 'transparent', border: '1px solid #555' }}>← Return to Store</button>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '3rem auto', display: 'flex', flexDirection: 'column', gap: '3rem' }}>
        
        {/* Section 1: Video Setup Guide */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem', background: '#111218', padding: '3rem', borderRadius: '16px', borderLeft: '4px solid var(--accent-magenta)' }}>
          <div>
            <h2 style={{ fontSize: '2rem', color: 'white', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span>🛠️</span> Professional Setup Protocol
            </h2>
            <p style={{ color: '#ccc', lineHeight: '1.8', marginBottom: '1.5rem' }}>
              Setting up your fireworks accurately is the most crucial step towards ensuring a safe and spectacular display. Rushing the setup process greatly increases the risk of unpredictable trajectories.
              <br/><br/>
              <strong>1. Choose the Right Location:</strong> Ensure you have a clear, flat surface free of overhanging trees or structural obstacles. 
              <br/><br/>
              <strong>2. Secure the Bases:</strong> For rockets, securely plant your launch tubes deeply into soft earth. Do not stick rockets directly into the ground, as they need to launch freely. For cakes and barrages, stake them firmly into the ground or support them with heavy sandbags on flat surfaces to prevent tipping during rapid fire sequences.
              <br/><br/>
              <strong>3. Uncover the Fuses Safely:</strong> Always peel back the protective orange explosive covers carefully. Never stand directly over a firework while peeling or lighting the fuse. Always extend your arm fully and turn your head away.
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <iframe 
              width="100%" 
              height="315" 
              src="https://www.youtube.com/embed/rV1HlJ4-FzE" 
              title="YouTube video player" 
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
              style={{ borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}
            ></iframe>
          </div>
        </div>

        {/* Section 2: 11PM Curfew */}
        <div style={{ background: '#181216', padding: '3rem', borderRadius: '16px', borderLeft: '4px solid var(--accent-cyan)' }}>
          <h2 style={{ fontSize: '2rem', color: 'white', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span>🕒</span> The 11 PM Legal Curfew Framework
          </h2>
          <p style={{ color: '#ccc', lineHeight: '1.8' }}>
            In the United Kingdom, it is a criminal offense to ignite fireworks between <strong>11:00 PM and 7:00 AM</strong>. This measure ensures community noise levels are properly regulated for the comfort of neighborhood sleeping patterns, domestic pets, and wildlife.
            <br/><br/>
            There are very specific exceptions written into the law allowing extended hours for prominent national dates:
            <br/>
            • <strong>Bonfire Night (November 5th):</strong> The curfew is dynamically extended to Midnight.<br/>
            • <strong>New Year's Eve, Diwali, and Chinese New Year:</strong> The curfew is extended until 1:00 AM the following morning.
            <br/><br/>
            Breaking these curfews can result in a £5,000 fine or imprisonment. Please plan your spectacular displays to conclude safely well before the legal cutoff timings.
          </p>
        </div>

        {/* Section 3: Safety Distances */}
        <div style={{ background: '#0d161a', padding: '3rem', borderRadius: '16px', borderLeft: '4px solid var(--accent-magenta)' }}>
          <h2 style={{ fontSize: '2rem', color: 'white', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span>📏</span> Spectator Distances & Classification
          </h2>
          <p style={{ color: '#ccc', lineHeight: '1.8' }}>
            Fireworks are legally classified upon import into the UK based on the powder weight and explosion radiuses. You must religiously verify the categorization prominently stamped on the explosive packaging.
            <br/><br/>
            • <strong>Category F2 (Garden Fireworks):</strong> These are built for standard domestic use. The absolute minimum legal spectator distance is <strong>8 meters (approx. 26 feet)</strong>. This implies the firework should be placed 8 meters away from the audience, and ideally, there should be an equivalent buffer zone behind the firework.
            <br/><br/>
            • <strong>Category F3 (Display Fireworks):</strong> These products contain significantly higher powder contents producing massive effects. The minimum legal spectator distance here is drastically increased to <strong>25 meters (approx. 82 feet)</strong>. These MUST only be used in large exterior locations such as expansive fields or long country gardens.
          </p>
        </div>

        {/* Section 4: Misfire Protocol */}
        <div style={{ background: '#1a1010', padding: '3rem', borderRadius: '16px', borderLeft: '4px solid red' }}>
          <h2 style={{ fontSize: '2rem', color: 'white', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span>⚠️</span> The Emergency Misfire Protocol
          </h2>
          <p style={{ color: '#ccc', lineHeight: '1.8' }}>
            A "misfire" occurs when a fuse fully burns down, but the primary explosive chamber fails to initiate. This creates a volatile and unpredictable situation.
            <br/><br/>
            <strong>Under no circumstances</strong> should you or anyone else immediately return to inspect or reignite a failed firework. Wait a strict minimum of <strong>20 minutes</strong>. After this cooldown period, approach the firework cautiously strictly from the side (never lean directly over the launch tubes). 
            <br/><br/>
            Once verified inactive, use a thick glove to lift the firework and plunge it entirely into a large bucket of cold water, leaving it submerged for several hours to neutralize the black powder compounds entirely before throwing it in standard waste bins.
          </p>
        </div>

      </div>
    </div>
  );
}
