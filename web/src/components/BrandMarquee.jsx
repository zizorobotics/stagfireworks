import React from 'react';
import './BrandMarquee.css';

const brands = [
  { file: 'astra fireworks bensstar fireworks british bulldog fire star (sidebar better for this).jpg', name: 'Astra' },
  { file: 'big star.jpg', name: 'Big Star' },
  { file: 'blackpanther.jpeg', name: 'Black Panther' },
  { file: 'brothers.jpg', name: 'Brothers' },
  { file: 'celtic.jpeg', name: 'Celtic' },
  { file: 'cosmicfirework.jpg', name: 'Cosmic' },
  { file: 'gemstonefireworks.jpg', name: 'Gemstone' },
  { file: 'hallmarkfirework.jpg', name: 'Hallmark' },
  { file: 'klasekpyrotechnic.jpeg', name: 'Klasek' },
  { file: 'riakeofireworks.jpg', name: 'Riakeo' },
  { file: 'vivid.jpg', name: 'Vivid' }
];

export default function BrandMarquee({ setActiveCategory }) {
  return (
    <section className="brand-marquee-section">
      <h2 className="section-title">PREMIUM BRANDS IN STOCK</h2>
      <div className="brand-marquee-container">
        <div className="brand-marquee-track">
          {[...brands, ...brands, ...brands].map((brand, i) => (
            <div 
              key={i} 
              className="brand-item"
              style={{ cursor: 'pointer' }}
              onClick={() => {
                if (setActiveCategory) {
                  setActiveCategory('Brand_' + brand.name);
                  document.querySelector('.products-wrapper')?.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            >
              <div className="brand-inner">
                <div className="brand-front">
                  <img src={`/images/brands/${brand.file}`} alt={`${brand.name} logo`} />
                </div>
                <div className="brand-back">
                  <img src={`/images/brands/${brand.file}`} alt={`${brand.name} logo`} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
