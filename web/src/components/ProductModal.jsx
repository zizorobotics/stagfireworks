import React, { useState, useEffect } from 'react';

export default function ProductModal({ product, isOpen, onClose, onAdd }) {
  const [activeTab, setActiveTab] = useState('description');

  const getBrandInfo = (p) => {
    if (p.specs?.brand) {
      const explicitBrand = p.specs.brand.toLowerCase();
      if (explicitBrand === 'vivid') return { name: 'Vivid', image: '/images/brands/vivid.jpg', style: { border: '2px solid #b700ff', boxShadow: '0 0 15px #b700ff' } };
      if (explicitBrand === 'brothers') return { name: 'Brothers', image: '/images/brands/brothers.jpg', style: { border: '1px solid rgba(255,255,255,0.2)' } };
      if (explicitBrand === 'celtic') return { name: 'Celtic', image: '/images/brands/celtic.jpeg', style: { border: '1px solid rgba(255,255,255,0.2)' } };
      if (explicitBrand === 'gemstone') return { name: 'Gemstone', image: '/images/brands/gemstonefireworks.jpg', style: { border: '1px solid rgba(255,255,255,0.2)' } };
      if (explicitBrand === 'hallmark') return { name: 'Hallmark', image: '/images/brands/hallmarkfirework.jpg', style: { border: '1px solid rgba(255,255,255,0.2)' } };
      if (explicitBrand === 'klasek') return { name: 'Klasek', image: '/images/brands/klasekpyrotechnic.jpeg', style: { border: '1px solid rgba(255,255,255,0.2)' } };
      if (explicitBrand === 'black panther') return { name: 'Black Panther', image: '/images/brands/blackpanther.jpeg', style: { border: '1px solid rgba(255,255,255,0.2)' } };
      if (explicitBrand === 'cosmic') return { name: 'Cosmic', image: '/images/brands/cosmicfirework.jpg', style: { border: '1px solid rgba(255,255,255,0.2)' } };
      if (explicitBrand === 'riakeo') return { name: 'Riakeo', image: '/images/brands/riakeofireworks.jpg', style: { border: '1px solid rgba(255,255,255,0.2)' } };
      if (explicitBrand === 'big star') return { name: 'Big Star', image: '/images/brands/big star.jpg', style: { border: '1px solid rgba(255,255,255,0.2)' } };
      if (explicitBrand === 'astra') return { name: 'Astra', image: '/images/brands/astra fireworks bensstar fireworks british bulldog fire star (sidebar better for this).jpg', style: { border: '1px solid rgba(255,255,255,0.2)' } };
    }

    const textToSearch = (p.name + ' ' + (p.description || '')).toLowerCase();
    if (textToSearch.includes('vivid')) return { name: 'Vivid', image: '/images/brands/vivid.jpg', style: { border: '2px solid #b700ff', boxShadow: '0 0 15px #b700ff' } };
    if (textToSearch.includes('brothers') || textToSearch.includes('brother')) return { name: 'Brothers', image: '/images/brands/brothers.jpg', style: { border: '1px solid rgba(255,255,255,0.2)' } };
    if (textToSearch.includes('celtic')) return { name: 'Celtic', image: '/images/brands/celtic.jpeg', style: { border: '1px solid rgba(255,255,255,0.2)' } };
    if (textToSearch.includes('gemstone') || textToSearch.includes('gem stone')) return { name: 'Gemstone', image: '/images/brands/gemstonefireworks.jpg', style: { border: '1px solid rgba(255,255,255,0.2)' } };
    if (textToSearch.includes('hallmark')) return { name: 'Hallmark', image: '/images/brands/hallmarkfirework.jpg', style: { border: '1px solid rgba(255,255,255,0.2)' } };
    if (textToSearch.includes('klasek')) return { name: 'Klasek', image: '/images/brands/klasekpyrotechnic.jpeg', style: { border: '1px solid rgba(255,255,255,0.2)' } };
    if (textToSearch.includes('black panther')) return { name: 'Black Panther', image: '/images/brands/blackpanther.jpeg', style: { border: '1px solid rgba(255,255,255,0.2)' } };
    if (textToSearch.includes('cosmic') || textToSearch.includes('cosmicfirework')) return { name: 'Cosmic', image: '/images/brands/cosmicfirework.jpg', style: { border: '1px solid rgba(255,255,255,0.2)' } };
    if (textToSearch.includes('riakeo')) return { name: 'Riakeo', image: '/images/brands/riakeofireworks.jpg', style: { border: '1px solid rgba(255,255,255,0.2)' } };
    if (textToSearch.includes('big star')) return { name: 'Big Star', image: '/images/brands/big star.jpg', style: { border: '1px solid rgba(255,255,255,0.2)' } };
    if (textToSearch.includes('astra')) return { name: 'Astra', image: '/images/brands/astra fireworks bensstar fireworks british bulldog fire star (sidebar better for this).jpg', style: { border: '1px solid rgba(255,255,255,0.2)' } };
    return null;
  };

  useEffect(() => {
    if (isOpen) {
      setActiveTab('description');
    }
  }, [isOpen]);

  if (!isOpen || !product) return null;

  return (
    <div className={`modal-overlay ${isOpen ? 'open' : ''}`} onClick={onClose} style={{ zIndex: 100000 }}>
      <div className="modal-content" style={{ maxWidth: '800px', width: '90%', display: 'flex', flexDirection: 'column', padding: '2rem' }} onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} style={{ position: 'absolute', top: '15px', right: '15px', background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: '2rem', cursor: 'pointer', zIndex: 10 }}>×</button>
        
        {product.linked_video ? (
          <div className="modal-media-container" style={{ width: '100%', aspectRatio: '16/9', background: '#000', borderRadius: '8px', overflow: 'hidden', marginBottom: '1.5rem' }}>
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${product.videoId}?autoplay=1&controls=1&modestbranding=0&showinfo=1`}
              title={product.name}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        ) : (
          <div className="modal-media-container" style={{ width: '100%', aspectRatio: '16/9', background: '#111', borderRadius: '8px', overflow: 'hidden', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {product.image ? (
              <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            ) : (
              <span style={{ color: 'var(--text-muted)', opacity: 0.5 }}>No Image Available</span>
            )}
          </div>
        )}
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
          <div 
            className="desc-scroll"
            style={{ 
              flex: 1, 
              paddingRight: '1rem',
              maxHeight: '15vh',
              overflowY: 'auto',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              WebkitMaskImage: 'linear-gradient(to bottom, black 75%, transparent 100%)',
              maskImage: 'linear-gradient(to bottom, black 75%, transparent 100%)'
            }}
          >
            <h2 style={{ fontSize: '2rem', color: 'var(--text-color)', margin: 0, paddingBottom: '2rem', wordBreak: 'break-word', overflowWrap: 'break-word' }}>{product.name}</h2>
          </div>
          {(() => {
            const brandInfo = getBrandInfo(product);
            if (!brandInfo) return null;
            return (
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                overflow: 'hidden',
                background: '#000',
                flexShrink: 0,
                ...brandInfo.style
              }}>
                <img src={brandInfo.image} alt={brandInfo.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            );
          })()}
        </div>
        
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
          <span style={{ fontSize: '0.9rem', color: 'var(--accent-cyan)', background: 'rgba(0, 255, 255, 0.1)', padding: '0.2rem 0.6rem', borderRadius: '4px', textTransform: 'uppercase', letterSpacing: '1px' }}>{product.category}</span>
        </div>

        <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid var(--border-color)', marginBottom: '1.5rem' }}>
          <button 
            onClick={() => setActiveTab('description')}
            style={{ 
              background: 'transparent', border: 'none', padding: '0.5rem 0', 
              color: activeTab === 'description' ? 'var(--accent-cyan)' : 'var(--text-muted)',
              borderBottom: activeTab === 'description' ? '2px solid var(--accent-cyan)' : '2px solid transparent',
              cursor: 'pointer', fontSize: '1rem', fontWeight: 'bold'
            }}
          >
            Description
          </button>
          
          {product.specs && (
            <button 
              onClick={() => setActiveTab('specs')}
              style={{ 
                background: 'transparent', border: 'none', padding: '0.5rem 0', 
                color: activeTab === 'specs' ? 'var(--accent-cyan)' : 'var(--text-muted)',
                borderBottom: activeTab === 'specs' ? '2px solid var(--accent-cyan)' : '2px solid transparent',
                cursor: 'pointer', fontSize: '1rem', fontWeight: 'bold'
              }}
            >
              Product Specifications
            </button>
          )}
        </div>

        <div style={{ position: 'relative', overflow: 'hidden', minHeight: '130px', marginBottom: '2rem' }}>
          <div style={{
            transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s',
            transform: activeTab === 'description' ? 'translateX(0)' : 'translateX(-100%)',
            opacity: activeTab === 'description' ? 1 : 0,
            position: activeTab === 'description' ? 'relative' : 'absolute',
            top: 0, left: 0, width: '100%'
          }}>
            <style>
              {`
                .desc-scroll::-webkit-scrollbar {
                  display: none;
                }
              `}
            </style>
            <div 
              className="desc-scroll"
              style={{ 
                maxHeight: '25vh', 
                overflowY: 'auto', 
                scrollbarWidth: 'none', 
                msOverflowStyle: 'none',
                WebkitMaskImage: 'linear-gradient(to bottom, black 75%, transparent 100%)',
                maskImage: 'linear-gradient(to bottom, black 75%, transparent 100%)'
              }}
            >
              <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: '1.6', margin: 0, paddingBottom: '3rem' }}>
                {product.description}
              </p>
            </div>
          </div>

          {product.specs && (
             <div style={{
              transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s',
              transform: activeTab === 'specs' ? 'translateX(0)' : 'translateX(100%)',
              opacity: activeTab === 'specs' ? 1 : 0,
              position: activeTab === 'specs' ? 'relative' : 'absolute',
              top: 0, left: 0, width: '100%'
            }}>
              <div 
                className="desc-scroll"
                style={{ 
                  maxHeight: '25vh', 
                  overflowY: 'auto', 
                  scrollbarWidth: 'none', 
                  msOverflowStyle: 'none',
                  WebkitMaskImage: 'linear-gradient(to bottom, black 75%, transparent 100%)',
                  maskImage: 'linear-gradient(to bottom, black 75%, transparent 100%)',
                  paddingBottom: '3rem'
                }}
              >
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '1rem', wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Distance:</span>
                    <span style={{ color: 'var(--accent-cyan)', fontWeight:'bold' }}>{product.specs.distance}</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Shots:</span>
                    <span style={{ color: 'var(--accent-cyan)', fontWeight:'bold' }}>{product.specs.shots}</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Duration:</span>
                    <span style={{ color: 'var(--accent-cyan)', fontWeight:'bold' }}>{product.specs.duration}</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Noise Level:</span>
                    <span style={{ color: 'var(--accent-cyan)', fontWeight:'bold' }}>{product.specs.noise}</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Height:</span>
                    <span style={{ color: 'var(--accent-cyan)', fontWeight:'bold' }}>{product.specs.height}</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Firing Pattern:</span>
                    <span style={{ color: 'var(--accent-cyan)', fontWeight:'bold' }}>{product.specs.pattern}</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Tube Size:</span>
                    <span style={{ color: 'var(--accent-cyan)', fontWeight:'bold' }}>{product.specs.tube}</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Hazard Class:</span>
                    <span style={{ color: 'var(--accent-cyan)', fontWeight:'bold' }}>{product.specs.hazard}</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem', gridColumn: 'span 2' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Powder Weight:</span>
                    <span style={{ color: 'var(--accent-cyan)', fontWeight:'bold' }}>{product.specs.weight}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <button 
          onClick={() => {
            onAdd(product);
            onClose();
          }} 
          className="submit-btn" 
          style={{ width: '100%', margin: 0, padding: '1rem', fontSize: '1.2rem', background: 'linear-gradient(90deg, var(--accent-magenta), var(--accent-cyan))' }}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}
