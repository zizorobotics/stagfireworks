import React from 'react';

export default function Wishlist({ isOpen, items, onClose, onAdd, onRemove }) {
  return (
    <div className={`cart-overlay ${isOpen ? 'open' : ''}`} onClick={onClose}>
      <div className={`cart-sidebar ${isOpen ? 'open' : ''}`} onClick={e => e.stopPropagation()}>
        <div className="cart-header">
          <h2>Your Wishlist</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>
        <div className="cart-items">
          {items.length === 0 ? (
            <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Your wishlist is empty.</p>
          ) : (
            items.map(item => (
              <div key={item.id} className="cart-item">
                <img src={item.image} alt={item.name} className="cart-item-img" />
                <div className="cart-item-info">
                  <h4 className="cart-item-title" style={{ color: 'white' }}>{item.name}</h4>
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                    <button 
                      className="add-btn" 
                      style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem', flex: 1 }} 
                      onClick={() => onAdd(item)}
                    >
                      Add to Cart
                    </button>
                    <button 
                      className="qty-btn" 
                      style={{ width: 'auto', padding: '0 0.8rem', fontSize: '0.75rem', background: 'rgba(255,0,0,0.2)', color: '#ff6b6b' }} 
                      onClick={() => onRemove(item.id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
