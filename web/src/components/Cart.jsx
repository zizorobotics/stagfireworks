export default function Cart({ items, isOpen, onClose, onUpdateQuantity, onCheckout }) {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      <div className={`cart-overlay ${isOpen ? 'open' : ''}`} onClick={onClose}></div>
      <div className={`cart-sidebar ${isOpen ? 'open' : ''}`}>
        <div className="cart-header">
          <h2>Your Cart ({totalItems})</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>
        
        <div className="cart-items">
          {items.length === 0 ? (
            <p style={{ color: 'var(--text-muted)' }}>Your cart is empty.</p>
          ) : (
            items.map(item => (
              <div key={item.id} className="cart-item">
                <img src={item.image} alt={item.name} className="cart-item-img" />
                <div className="cart-item-info">
                  <div className="cart-item-title">{item.name}</div>
                  <div className="quantity-controls">
                    <button className="qty-btn" onClick={() => onUpdateQuantity(item.id, -1)}>-</button>
                    <span>{item.quantity}</span>
                    <button className="qty-btn" onClick={() => onUpdateQuantity(item.id, 1)}>+</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="cart-footer">
            <button className="checkout-btn" onClick={onCheckout}>
              Checkout to Store
            </button>
          </div>
        )}
      </div>
    </>
  );
}
