import { useState } from 'react';
import SafetyModal from './SafetyModal';
import emailjs from '@emailjs/browser';
import { supabase } from '../supabaseClient';

export default function CheckoutModal({ isOpen, onClose, cartItems, onComplete }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null); // 'collection', 'delivery', or null
  const [errorMsg, setErrorMsg] = useState('');
  const [showSafety, setShowSafety] = useState(false);
  const [orderType, setOrderType] = useState('collection'); // 'collection' | 'delivery'
  const [isSummaryExpanded, setIsSummaryExpanded] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowSafety(true);
  };

  const confirmAndSend = async () => {
    setShowSafety(false);
    setLoading(true);
    setErrorMsg('');

    const SERVICE_ID = 'service_oz71l0e';
    const TEMPLATE_ID = 'template_roelkc9';
    const PUBLIC_KEY = 'oxFW32FJ14fnImBKo';

    const itemsSummary = cartItems.map(item => `${item.quantity}x ${item.name}`).join('\n');

    const templateParams = {
      name: formData.name,
      email: formData.email,
      title: `[New Fireworks Order - ${orderType === 'collection' ? 'STORE COLLECTION' : 'DELIVERY'}]`,
      theme: orderType === 'collection' ? 'white' : 'black',
      order_type: orderType === 'collection' ? 'STORE COLLECTION' : 'DELIVERY',
      order_color: orderType === 'collection' ? '#eab308' : '#0ea5e9', // Gold for Collection, Cyan for Delivery
      message: `A new ${orderType === 'collection' ? 'STORE COLLECTION' : 'DELIVERY'} order has been placed!\n\nPhone: ${formData.phone}\nNotes: ${formData.notes || 'None'}\n\nORDER SUMMARY:\n${itemsSummary}`
    };

    try {
      await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY);

      // Store lead/customer data in Supabase seamlessly
      try {
        await supabase.from('customers').insert([{ 
          name: formData.name, 
          email: formData.email, 
          phone: formData.phone 
        }]);
      } catch (dbErr) {
        console.error("Supabase customer insert failed", dbErr);
      }

      setSuccess(orderType);
      
      setTimeout(() => {
        onComplete();
        setSuccess(null);
        setFormData({ name: '', email: '', phone: '', notes: '' });
        window.location.href = '/more';
      }, 3500);
    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to send order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <div className={`modal-overlay ${isOpen && !showSafety ? 'open' : ''}`}>
      <div className="modal-content" style={success === 'collection' ? { width: '95%', maxWidth: '600px' } : {}}>
        {success === 'collection' ? (
          <div style={{ textAlign: 'center', padding: '1rem 0' }}>
            <h2 style={{ color: 'var(--accent-magenta)', marginBottom: '0.5rem', fontSize: '2rem' }}>Collection Reserved Successfully!</h2>
            <p style={{ color: 'white', fontWeight: 'bold', fontSize: '1.1rem' }}>FREE ON SITE PARKING • Open all year round</p>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Please call: <strong style={{ color: 'var(--accent-cyan)'}}>07901 940 400</strong> upon arrival</p>
            
            <div style={{ width: '100%', height: '300px', borderRadius: '12px', overflow: 'hidden', border: '2px solid var(--border-color)', marginBottom: '1.5rem' }}>
              <iframe 
                src="https://maps.google.com/maps?width=100%25&amp;height=600&amp;hl=en&amp;q=Stag%20Fireworks,%20156%20Wickersley%20Road,%20Rotherham,%20S60%203PT+(Stag%20Fireworks)&amp;t=&amp;z=16&amp;ie=UTF8&amp;iwloc=B&amp;output=embed" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen="" 
                loading="lazy">
              </iframe>
            </div>
            
            <button onClick={() => { setSuccess(null); onComplete(); setFormData({ name: '', email: '', phone: '', notes: '' }); }} className="pro-btn" style={{ width: '100%' }}>Return to Shop</button>
          </div>
        ) : success === 'delivery' ? (
          <div style={{ textAlign: 'center', padding: '2rem 0' }}>
            <h2 style={{ color: 'var(--accent-cyan)' }}>Order Sent Successfully!</h2>
            <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>We will contact you shortly to confirm your delivery schedule.</p>
          </div>
        ) : (
          <>
            <h2 style={{ marginBottom: '1rem', color: 'var(--accent-magenta)' }}>Checkout Options</h2>
            
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
              <div 
                style={{ flex: 1, padding: '1rem', borderRadius: '8px', border: `2px solid ${orderType === 'collection' ? 'var(--accent-magenta)' : 'var(--border-color)'}`, cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s', background: orderType === 'collection' ? 'rgba(255, 20, 147, 0.1)' : 'transparent' }}
                onClick={() => setOrderType('collection')}
              >
                <h3 style={{ color: orderType === 'collection' ? 'white' : 'var(--text-muted)' }}>Store Collection</h3>
              </div>
              <div 
                style={{ flex: 1, padding: '1rem', borderRadius: '8px', border: `2px solid ${orderType === 'delivery' ? 'var(--accent-cyan)' : 'var(--border-color)'}`, cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s', background: orderType === 'delivery' ? 'rgba(0, 240, 255, 0.1)' : 'transparent' }}
                onClick={() => setOrderType('delivery')}
              >
                <h3 style={{ color: orderType === 'delivery' ? 'white' : 'var(--text-muted)' }}>Delivery Service</h3>
              </div>
            </div>

            {orderType === 'delivery' && (
              <div style={{ marginBottom: '1.5rem', padding: '0.8rem', background: 'rgba(0,0,0,0.4)', borderRadius: '8px', borderLeft: '3px solid var(--accent-cyan)' }}>
                <p style={{ fontSize: '0.85rem', color: '#ccc', margin: 0 }}>
                  <strong style={{ color: 'white' }}>T&Cs:</strong> Free delivery on orders £300+ in eligible zones. Same day delivery subject to availability and distance.
                </p>
              </div>
            )}
            {orderType === 'collection' && (
              <div style={{ marginBottom: '1.5rem', padding: '0.8rem', background: 'rgba(0,0,0,0.4)', borderRadius: '8px', borderLeft: '3px solid var(--accent-magenta)' }}>
                 <p style={{ fontSize: '0.85rem', color: '#ccc', margin: 0 }}>
                  <strong style={{ color: 'white' }}>Information:</strong> Submit your details to reserve your items. You will pay upon collection at the store.
                </p>
              </div>
            )}
            
            {errorMsg && <div style={{ color: 'red', marginBottom: '1rem' }}>{errorMsg}</div>}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Full Name</label>
                <input required type="text" name="name" value={formData.name} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input required type="email" name="email" value={formData.email} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input required type="tel" name="phone" value={formData.phone} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Additional Notes (Optional)</label>
                <textarea rows="3" name="notes" value={formData.notes} onChange={handleChange}></textarea>
              </div>

              {cartItems && cartItems.length > 0 && (
                <div style={{ marginTop: '1.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
                  <div 
                    onClick={() => setIsSummaryExpanded(!isSummaryExpanded)}
                    style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: isSummaryExpanded ? '1rem' : '0' }}
                  >
                    <h4 style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                      Order Summary ({cartItems.length} Items)
                    </h4>
                    <span style={{ color: 'var(--text-muted)', transform: isSummaryExpanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }}>▼</span>
                  </div>
                  
                  {isSummaryExpanded && (
                    <div className="order-summary-scroll" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '180px', paddingBottom: '1rem', paddingRight: '0.5rem' }}>
                      {cartItems.map((item, idx) => (
                        <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(255,255,255,0.02)', padding: '0.6rem', borderRadius: '6px' }}>
                          {item.image ? (
                            <img src={item.image} alt={item.name} style={{ width: '35px', height: '35px', objectFit: 'cover', borderRadius: '4px' }} />
                          ) : (
                            <div style={{ width: '35px', height: '35px', background: '#222', borderRadius: '4px' }} />
                          )}
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <p style={{ margin: 0, fontSize: '0.85rem', color: '#ddd', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</p>
                            <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--accent-cyan)' }}>Qty: {item.quantity}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column' }}>
                <div style={{ padding: '0.8rem', background: 'rgba(255, 20, 147, 0.05)', borderRadius: '8px', border: '1px solid rgba(255, 20, 147, 0.3)', marginBottom: '1rem', textAlign: 'center' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--accent-magenta)' }}>
                    £200 Minimum Non-Refundable Deposit required on Pre-Orders
                  </span>
                </div>
                
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button type="button" onClick={onClose} className="submit-btn" style={{ background: 'transparent', border: '1px solid var(--border-color)', marginTop: 0 }}>
                    Cancel
                  </button>
                  <button type="submit" className="submit-btn" disabled={loading} style={{ margin: 0, flex: 2, background: orderType === 'collection' ? 'linear-gradient(90deg, #ff1493, #8a2be2)' : 'linear-gradient(90deg, #00f0ff, #0051ff)' }}>
                    {loading ? 'Processing...' : `Confirm ${orderType === 'collection' ? 'Collection' : 'Delivery'}`}
                  </button>
                </div>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
    
    <SafetyModal 
      isOpen={showSafety} 
      onClose={() => setShowSafety(false)} 
      onConfirm={confirmAndSend} 
    />
    </>
  );
}
