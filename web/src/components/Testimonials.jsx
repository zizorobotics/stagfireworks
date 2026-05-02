import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export default function Testimonials() {
  const [reviews, setReviews] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // We strictly use the provided Google reviews for absolute realism
  const fallbackReviews = [
    { customer_name: 'RazzleD', rating: 5, review_text: 'Great selection of fireworks. They made me a unique selection pack taking into mind my budget ...We loved their little package was very enjoyable and fun for all of us. Would highly recommend Stag fireworks' },
    { customer_name: 'Shak', rating: 5, review_text: 'Just bought fireworks from this shop. Great service and a wide range of fireworks for decent prices. Deffo coming back here for bonfire night' },
    { customer_name: 'James Barber', rating: 5, review_text: 'I went in with a set price and the guys running the shop could not be more helpful, i explained what i was looking for and he made me a bespoke selection that ...' },
    { customer_name: 'Sahil Khaliq (SK1405)', rating: 5, review_text: 'Incredible selection of fireworks and great service. Close by and easy to find as well.' },
    { customer_name: 'Josh Otley', rating: 5, review_text: 'Great little firework shop, loads of choice, something to suit all budgets. Owners are very good and friendly.' }
  ];

  useEffect(() => {
    setReviews(fallbackReviews);
  }, []);

  useEffect(() => {
    if (reviews.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % reviews.length);
    }, 6000); // Rotate every 6 seconds
    return () => clearInterval(interval);
  }, [reviews]);

  if (reviews.length === 0) return null;

  const currentReview = reviews[currentIndex];

  return (
    <section style={{ padding: '4rem 1rem', background: 'var(--panel-bg)', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
      <h2 style={{ fontSize: '2rem', marginBottom: '2rem', color: 'var(--text-main)', background: 'linear-gradient(90deg, #ffd700, #ffb3d9)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
        What Our Customers Say
      </h2>
      
      <div style={{ maxWidth: '800px', margin: '0 auto', position: 'relative', minHeight: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div 
          key={currentIndex} 
          style={{ 
            animation: 'fadeIn 0.5s ease-in-out',
            padding: '0 2rem'
          }}
        >
          <div style={{ color: '#ffd700', fontSize: '1.5rem', marginBottom: '1rem', letterSpacing: '2px' }}>
            {'★'.repeat(currentReview.rating)}
          </div>
          <p style={{ fontSize: '1.2rem', fontStyle: 'italic', lineHeight: '1.6', marginBottom: '1rem', color: 'var(--text-main)' }}>
            "{currentReview.review_text}"
          </p>
          <p style={{ fontWeight: 'bold', color: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            {currentReview.customer_name} 
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 'normal', display: 'flex', alignItems: 'center', gap: '4px' }}>
              • Review from <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg> Google
            </span>
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '2rem' }}>
        {reviews.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            style={{
              width: '10px', height: '10px', borderRadius: '50%', border: 'none', cursor: 'pointer',
              background: idx === currentIndex ? 'var(--accent-magenta)' : 'var(--border-color)',
              transition: 'background 0.3s'
            }}
          />
        ))}
      </div>
      
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}
