import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export default function Testimonials() {
  const [reviews, setReviews] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Fallback reviews in case database fetch fails or table is empty
  const fallbackReviews = [
    { customer_name: 'Mark D.', rating: 5, review_text: 'Absolutely incredible fireworks. The Vivid range blew my mind. Much better than the supermarket rubbish I used to buy!' },
    { customer_name: 'Sarah J.', rating: 5, review_text: 'Fast delivery, really helpful staff. I asked for low-noise fireworks for my dogs and they pointed me to exactly what I needed. Everything worked perfectly.' },
    { customer_name: 'James T.', rating: 5, review_text: 'The Big Boss compound was the highlight of our Bonfire Night. Unbelievable hang time and colors. Will be ordering again for New Years!' },
    { customer_name: 'Liam W.', rating: 5, review_text: 'Best fireworks in South Yorkshire by far. Stag Fireworks never disappoints, their prices are unbeatable for the quality you get.' }
  ];

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .eq('is_published', true)
      .order('created_at', { ascending: false });

    if (!error && data && data.length > 0) {
      setReviews(data);
    } else {
      setReviews(fallbackReviews);
    }
  };

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
          <p style={{ fontWeight: 'bold', color: 'var(--accent-cyan)' }}>
            - {currentReview.customer_name}
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
