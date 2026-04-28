import { useState, useRef, useEffect } from 'react';
import emailjs from '@emailjs/browser';
import { supabase } from '../supabaseClient';

export default function FooterSections({ setActiveCategory }) {
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [status, setStatus] = useState('idle'); // 'idle', 'loading', 'success', 'error'

  const featuresRef = useRef(null);
  const [featuresVisible, setFeaturesVisible] = useState(false);
  const bannerRef = useRef(null);
  const [bannerVisible, setBannerVisible] = useState(false);

  useEffect(() => {
    const bannerObserver = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setBannerVisible(true); },
      { threshold: 0.3 }
    );
    const featuresObserver = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setFeaturesVisible(true); },
      { threshold: 0.3 }
    );

    if (bannerRef.current) bannerObserver.observe(bannerRef.current);
    if (featuresRef.current) featuresObserver.observe(featuresRef.current);

    return () => {
      bannerObserver.disconnect();
      featuresObserver.disconnect();
    };
  }, []);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    setStatus('loading');

    const SERVICE_ID = 'service_oz71l0e';
    const TEMPLATE_ID = 'template_roelkc9'; // Ideally a separate template for newsletter
    const PUBLIC_KEY = 'oxFW32FJ14fnImBKo';

    const templateParams = {
      name: formData.name,
      email: formData.email,
      title: '[Newsletter Subscription]',
      message: `New Subscriber:\nName: ${formData.name}\nEmail: ${formData.email}`
    };

    try {
      if (SERVICE_ID === 'YOUR_SERVICE_ID' || TEMPLATE_ID === 'YOUR_TEMPLATE_ID') {
        setTimeout(() => {
          setStatus('success');
          setFormData({ name: '', email: '' });
        }, 1000);
        return;
      }
      await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY);
      
      // Store in Supabase
      try {
        await supabase.from('subscribers').insert([{ name: formData.name, email: formData.email }]);
      } catch (dbErr) {
        console.error("Supabase insert failed", dbErr);
      }

      setStatus('success');
      setFormData({ name: '', email: '' });
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  return (
    <>
      <section className={`features-banner ${featuresVisible ? 'visible' : ''}`} ref={featuresRef}>
        <div className="feature-item">
          <div className="feature-icon">
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
          </div>
          <div className="feature-text">
            <h4>Free Shipping &amp; Delivery</h4>
            <p>On Orders Over £300*</p>
          </div>
        </div>
        <div className="feature-item">
          <div className="feature-icon">
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="8" r="7"></circle><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline></svg>
          </div>
          <div className="feature-text">
            <h4>100% Satisfaction</h4>
            <p>Premium Firework &amp; Service</p>
          </div>
        </div>
        <div className="feature-item">
          <div className="feature-icon">
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>
          </div>
          <div className="feature-text">
            <h4>Fast Reliable Delivery</h4>
            <p>As little as 1-2 days*</p>
          </div>
        </div>

      </section>

      <section className="pro-display-banner" ref={bannerRef}>
        <video autoPlay loop muted playsInline className="pro-banner-video">
          <source src="/images/banner_video.mp4" type="video/mp4" />
        </video>
        <div className={`pro-content ${bannerVisible ? 'visible' : ''}`}>
          <h2 className="pro-title">WE ARE THE UK'S CHOICE FOR PROFESSIONAL FIREWORK DISPLAYS</h2>
          <div className="pro-text">
            <p>Award-winning, meticulously choreographed spectacles tailored to your exact requirements. From corporate events to nuptial celebrations, our expert pyrotechnicians guarantee a dazzling display your guests will never forget.</p>
          </div>
          <button className="pro-btn" onClick={() => window.location.href = '/more'}>Watch Here</button>
        </div>
      </section>

      <section className="help-footer">
        <div className="help-col help-faqs">
          <h2 className="footer-heading">WE'RE HERE TO HELP</h2>
          <div className="faq-item">
            <h3>How do I buy fireworks online?</h3>
            <p>Buying fireworks from Stag Fireworks is straightforward. Browse our range, add to basket, and checkout over our dedicated form. We will contact you to organise collection from our store ensuring safety and personal care.</p>
          </div>
          <div className="faq-item">
            <h3>Do you offer delivery?</h3>
            <p style={{ marginBottom: '0.8rem' }}>Yes, we do offer delivery! We use specialized and fully compliant explosive transport couriers to ensure your fireworks arrive safely.</p>
            <ul style={{ margin: '0.5rem 0 1rem 1.5rem', color: 'var(--text-muted)' }}>
              <li style={{ marginBottom: '0.3rem' }}><strong>Free delivery</strong> on orders £300 or more.</li>
              <li style={{ marginBottom: '0.3rem' }}><strong>Free delivery</strong> within Rotherham & Sheffield (*minimum order required).</li>
              <li style={{ marginBottom: '0.3rem' }}><strong>Same day delivery</strong> available (Subject to availability).</li>
              <li style={{ marginBottom: '0.3rem' }}><strong>Areas covered:</strong> Rotherham, Worksop, Sheffield, Barnsley, Wakefield, and Doncaster.</li>
            </ul>
            <p style={{ fontSize: '0.9rem', borderTop: '1px solid #333', paddingTop: '0.5rem' }}><em>T&C: We require a minimum deposit for pre-orders, which are non-refundable. All standard industry regulations and competitor comparative terms apply.</em></p>
          </div>
          <div className="faq-item">
            <h3>What about orders less than £300?</h3>
            <p>For small purchases, please call or email us and we will get back to you, and we will accommodate you as best as we can.</p>
          </div>
        </div>

        <div className="help-col help-images">
          <div
            className="img-card"
            style={{ background: 'url(/images/brands/vivid.jpg) center/contain no-repeat #000', cursor: 'pointer' }}
            onClick={() => {
              if (setActiveCategory) setActiveCategory('VIVID');
              document.querySelector('.products-wrapper')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            <div className="img-card-label">EXPLORE VIVID</div>
          </div>
          <div
            className="img-card"
            style={{ background: 'url(/images/special_offers_card.png) center/cover no-repeat', cursor: 'pointer' }}
            onClick={() => document.querySelector('.sale-carousel-section')?.scrollIntoView({ behavior: 'smooth' })}
          >
            <div className="img-card-label">SPECIAL OFFERS</div>
          </div>
        </div>

        <div className="help-col help-newsletter">
          <h2 className="footer-heading align-center">SIGN UP FOR UPDATES</h2>
          <p className="newsletter-desc align-center">Subscribe to our newsletter to stay up to date with our latest news and special offers</p>

          <form className="newsletter-form" onSubmit={handleSubscribe}>
            <input
              type="text"
              placeholder="Name"
              required
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
            />
            <input
              type="email"
              placeholder="Email"
              required
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
            />
            <label className="checkbox-label">
              <input type="checkbox" required /> I accept the terms and conditions
            </label>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
              <button className="subscribe-btn" type="submit" disabled={status === 'loading'}>
                {status === 'loading' ? 'Subscribing...' : 'Subscribe ➔'}
              </button>
            </div>
            {status === 'success' && <p className="success-msg">Subscribed!</p>}
            {status === 'error' && <p className="error-msg">Failed to subscribe.</p>}
          </form>
        </div>
      </section>

      <section className="store-info-footer">
        <div className="store-info-container">
          <div className="store-info-content">
            <h2 className="footer-heading align-center" style={{ color: 'var(--accent-magenta)' }}>STAG FIREWORKS - NOW OPEN</h2>

            <div className="store-details-grid">
              <div className="store-detail-box">
                <h3>Our Showroom</h3>
                <p style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'white', lineHeight: '1.6' }}>Stag Roundabout<br />156 Wickersley Road<br />Rotherham<br />S60 3PT</p>
                <div style={{ marginTop: '1rem' }}>
                  <a href="https://maps.google.com/?q=Stag+Fireworks+156+Wickersley+Road+Rotherham+S60+3PT" target="_blank" rel="noreferrer" className="pro-btn" style={{ padding: '0.6rem 1.2rem', fontSize: '0.8rem' }}>Get Directions</a>
                </div>
              </div>

              <div className="store-detail-box">
                <h3>Opening Hours</h3>
                <p className="highlight-text">OPEN 7 DAYS A WEEK</p>
                <p style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'white' }}>10:00 AM - 11:45 PM</p>
                <div style={{ marginTop: '1.5rem' }}>
                  <h3>Contact Us</h3>
                  <p className="highlight-text" style={{ color: 'var(--accent-cyan)' }}>07901 940400</p>
                </div>
              </div>

              <div className="store-detail-box">
                <h3>Huge Selection</h3>
                <ul className="selection-list">
                  <li>Rockets</li>
                  <li>Cakes & Barrages</li>
                  <li>Selection Boxes</li>
                  <li>Smoke Bombs</li>
                  <li>Sparklers</li>
                </ul>
              </div>

              <div className="store-detail-box">
                <h3>How To Order</h3>
                <p>Browse our extensive collection online! Once you've added your desired fireworks to your cart, submit your reservation through our secure form. We will contact you immediately to process payment over the phone and arrange a collection time from our store.</p>
                <div className="social-links" style={{ marginTop: '1.5rem' }}>
                  <p style={{ marginBottom: '0.8rem', color: 'var(--text-muted)', fontWeight: 'bold', textAlign: 'center' }}>Follow Us On Socials:</p>
                  <div style={{ display: 'flex', gap: '1rem', marginTop: '0.8rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <a href="https://instagram.com/stagfireworks1" target="_blank" rel="noreferrer" title="Instagram" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '56px', height: '56px', borderRadius: '50%', background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)', color: 'white', textDecoration: 'none', boxShadow: '0 4px 15px rgba(225, 48, 108, 0.4)' }}>
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                    </a>
                    <a href="https://facebook.com/p/STAG-Fireworks-100075841641042/" target="_blank" rel="noreferrer" title="Facebook" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '56px', height: '56px', borderRadius: '50%', background: '#1877F2', color: 'white', textDecoration: 'none', boxShadow: '0 4px 15px rgba(24, 119, 242, 0.4)' }}>
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"></path></svg>
                    </a>
                    <a href="https://tiktok.com/@stagfireworks5" target="_blank" rel="noreferrer" title="TikTok" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '56px', height: '56px', borderRadius: '50%', background: '#000', color: 'white', border: '2px solid #333', textDecoration: 'none', boxShadow: '0 4px 15px rgba(255, 255, 255, 0.1)' }}>
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"></path></svg>
                    </a>
                    <a href="https://snapchat.com/add/stagfirework" target="_blank" rel="noreferrer" title="Snapchat" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '56px', height: '56px', borderRadius: '50%', background: '#FFFC00', color: 'black', textDecoration: 'none', boxShadow: '0 4px 15px rgba(255, 252, 0, 0.4)' }}>
                      <svg width="30" height="30" viewBox="0 0 24 24" fill="currentColor"><path d="M12.08 2.01C10.74 2.01 9 2.45 8.1 4.51c-.69 1.6-.29 3.8.84 5.38.07.1.18.23.23.36-.6.3-1.68.79-2.28.32-.43-.34-.5-1.12-1.02-1.15s-1.06.63-1.14 1-.03 1.15.54 1.72c1.23 1.25 3.32 1.48 4.7.75.14-.07.29-.16.51-.23a4.17 4.17 0 0 0 .7.83c-.94.75-2.23 1.11-3.69 1.45-1.39.32-3.11.72-4.08 1.94-.48.62-.48 1.51-.01 2.22.46.68 1.25 1.1 2.15 1.13.25.01.55-.02.87-.07.41-.07.82-.2 1.22-.39.81-.39 1.43-1.02 1.43-1.02s.1.09.28.27c1.07 1.09 2.19 1.34 2.59 1.39.29.04.57.06.84.06s.55-.02.84-.06c.41-.05 1.52-.3 2.59-1.39.18-.18.28-.27.28-.27s.62.63 1.43 1.02c.4.19.81.33 1.22.39.42.06.84.07 1.2.03.96-.03 1.8-.5 2.25-1.22.42-.69.41-1.57-.08-2.18-.97-1.22-2.69-1.62-4.08-1.94-1.46-.34-2.75-.7-3.69-1.45.24-.26.48-.54.7-.83.21.07.37.16.51.23 1.38.73 3.47.5 4.7-.75.57-.57.62-1.34.54-1.72-.08-.37-.62-.97-1.14-1s-.59.81-1.02 1.15c-.6.47-1.68-.02-2.28-.32.06-.13.16-.26.23-.36 1.13-1.58 1.53-3.78.84-5.38C15.16 2.45 13.42 2.01 12.08 2.01z"></path></svg>
                    </a>
                    <a href="/QR_Code_StagFireworks.png" target="_blank" rel="noreferrer" title="QR Code" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '56px', height: '56px', borderRadius: '12px', background: 'white', textDecoration: 'none', boxShadow: '0 4px 15px rgba(255, 255, 255, 0.2)', overflow: 'hidden' }}>
                      <img src="/QR_Code_StagFireworks.png" alt="QR Code" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
