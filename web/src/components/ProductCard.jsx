import { useState, useRef } from 'react';

export default function ProductCard({ product, onAdd, isWishlisted, onToggleWishlist, onViewDetails }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const iframeRef = useRef(null);

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

  const toggleMute = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (iframeRef.current) {
      const command = isMuted ? 'unMute' : 'mute';
      iframeRef.current.contentWindow.postMessage(JSON.stringify({
        event: 'command',
        func: command,
        args: []
      }), '*');
      setIsMuted(!isMuted);
    }
  };

  return (
    <div
      className="product-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsMuted(true);
      }}
      onTouchStart={() => setIsHovered(!isHovered)}
    >
      <div className="product-media" onClick={() => onViewDetails(product)} style={{ cursor: 'pointer', position: 'relative' }}>
        {(() => {
          const brandInfo = getBrandInfo(product);
          if (!brandInfo) return null;
          return (
            <div style={{
              position: 'absolute',
              top: '12px',
              left: '12px',
              width: '45px',
              height: '45px',
              borderRadius: '50%',
              overflow: 'hidden',
              background: '#000',
              zIndex: 20,
              ...brandInfo.style
            }}>
              <img src={brandInfo.image} alt={brandInfo.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          );
        })()}
        {product.image ? (
          <img 
            src={product.image} 
            alt={product.name} 
            className="product-img" 
          />
        ) : (
          <div className="product-img" style={{ background: '#0a0a0c', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', opacity: 0.5 }}>Awaiting Image</span>
          </div>
        )}

        {/* Youtube Iframe Overlay on hover */}
        {(product.linked_video || product.videoId) && isHovered && (
          <div className="product-video-overlay">
            <iframe
              ref={iframeRef}
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${product.videoId}?autoplay=1&mute=1&loop=1&playlist=${product.videoId}&controls=0&modestbranding=1&showinfo=0&enablejsapi=1`}
              title={product.name}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ pointerEvents: 'none' }}
            ></iframe>
            <button
              className="mute-btn"
              onClick={toggleMute}
              title={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? '🔇' : '🔊'}
            </button>
          </div>
        )}

        {!product.linked_video && (
          <span className="unlinked-badge">Unlinked Video</span>
        )}
      </div>

      <div className="product-info">
        <h3 className="product-title" onClick={() => onViewDetails(product)} style={{ cursor: 'pointer' }}>{product.name}</h3>
        {product.specs ? (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem', marginBottom: '1rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{color:'var(--accent-magenta)', fontWeight: 'bold'}}>Shots:</span> {product.specs.shots || '-'}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{color:'var(--accent-cyan)', fontWeight: 'bold'}}>Noise:</span> {(product.specs.noise && product.specs.noise.toString() !== '-' && !product.specs.noise.toString().includes('/')) ? `${product.specs.noise}/5` : (product.specs.noise || '-')}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{color:'var(--accent-magenta)', fontWeight: 'bold'}}>Time:</span> {product.specs.duration || '-'}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{color:'var(--accent-cyan)', fontWeight: 'bold'}}>Tube:</span> {product.specs.tube || '-'}
            </div>
          </div>
        ) : (
          <p className="product-desc">{product.description}</p>
        )}
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={() => onToggleWishlist(product)}
            style={{
              background: 'transparent',
              border: '1px solid var(--border-color)',
              color: isWishlisted ? 'var(--accent-magenta)' : 'white',
              borderRadius: '8px',
              padding: '0 1rem',
              cursor: 'pointer',
              fontSize: '1.2rem',
              transition: 'all 0.2s'
            }}
            title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
          >
            {isWishlisted ? '♥' : '♡'}
          </button>
          <button className="add-btn" onClick={() => onAdd(product)} style={{ flex: 1 }}>
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
