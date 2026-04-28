import { useState } from 'react';
import emailjs from '@emailjs/browser';

export default function ContactModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    
    const SERVICE_ID = 'service_oz71l0e';
    const TEMPLATE_ID = 'template_roelkc9';
    const PUBLIC_KEY = 'oxFW32FJ14fnImBKo';

    const templateParams = {
      name: formData.name,
      email: formData.email,
      title: '[New Contact Inquiry]',
      message: `Phone: ${formData.phone}\n\nMessage:\n${formData.message}`
    };

    try {
      await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY);

      setSuccess(true);
      setTimeout(() => {
        onClose();
        setSuccess(false);
        setFormData({ name: '', email: '', phone: '', message: '' });
      }, 2000);
    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`modal-overlay ${isOpen ? 'open' : ''}`}>
      <div className="modal-content" style={{ maxWidth: '1000px', width: '95%', padding: '3rem' }}>
        <button className="modal-close" onClick={onClose}>&times;</button>
        
        {success ? (
          <div style={{ textAlign: 'center', padding: '4rem 0' }}>
            <h2 style={{ color: 'var(--accent-cyan)', fontSize: '2rem' }}>Message Sent successfully!</h2>
            <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>We will be in touch with you shortly.</p>
          </div>
        ) : (
          <div>
            <h2 style={{ marginBottom: '2rem', color: 'var(--text-color)', fontSize: '2.5rem', fontWeight: 800 }}>Contact Us</h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '4rem' }}>
              
              {/* Left Column: Form */}
              <div>
                {errorMsg && <div style={{ color: 'red', marginBottom: '1rem' }}>{errorMsg}</div>}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                  <div className="form-group">
                    <label>Name <span style={{ color: 'var(--accent-magenta)' }}>*</span></label>
                    <input required type="text" name="name" value={formData.name} onChange={handleChange} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid #333', padding: '0.8rem', borderRadius: '4px', color: 'white', width: '100%' }} />
                  </div>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem' }}>
                    <div className="form-group">
                      <label>Email <span style={{ color: 'var(--accent-magenta)' }}>*</span></label>
                      <input required type="email" name="email" value={formData.email} onChange={handleChange} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid #333', padding: '0.8rem', borderRadius: '4px', color: 'white', width: '100%' }} />
                    </div>
                    <div className="form-group">
                      <label>Phone Number</label>
                      <input type="tel" name="phone" value={formData.phone} onChange={handleChange} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid #333', padding: '0.8rem', borderRadius: '4px', color: 'white', width: '100%' }} />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>What's on your mind? <span style={{ color: 'var(--accent-magenta)' }}>*</span></label>
                    <textarea required rows="5" name="message" value={formData.message} onChange={handleChange} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid #333', padding: '0.8rem', borderRadius: '4px', color: 'white', width: '100%', resize: 'vertical' }}></textarea>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                    <button type="button" onClick={onClose} className="submit-btn" style={{ background: 'transparent', border: '1px solid #555', color: '#ccc', flex: 1, padding: '1rem' }}>
                      Cancel
                    </button>
                    <button type="submit" className="submit-btn" disabled={loading} style={{ margin: 0, flex: 2, padding: '1rem' }}>
                      {loading ? 'Sending...' : 'Send Message'}
                    </button>
                  </div>
                </form>
              </div>

              {/* Right Column: Information */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', color: '#ccc', fontSize: '0.95rem', lineHeight: '1.6' }}>
                
                <div>
                  <p style={{ color: '#888', marginBottom: '0.5rem' }}>Our current opening times are:</p>
                  <p style={{ margin: 0, fontWeight: 600, color: 'white' }}>Monday to Sunday - 10:00 AM to 11:45 PM</p>
                  <p style={{ margin: 0, marginTop: '0.3rem', color: 'var(--accent-cyan)', fontSize: '0.85rem' }}>Open 7 Days a Week!</p>
                </div>

                <div style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.03)', borderLeft: '3px solid var(--accent-magenta)', borderRadius: '0 8px 8px 0' }}>
                  <p style={{ margin: 0 }}>
                    If you have a specific firework in mind, please give us a direct call to reserve it ahead of time. This tremendously helps us ensure your order is fully prepped and waiting exclusively for you at the showroom prior to your arrival. For general questions, drop us a message!
                  </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                  <div>
                    <h4 style={{ color: 'white', marginBottom: '0.8rem', fontSize: '1rem' }}>Company Info</h4>
                    <p style={{ margin: 0 }}>
                      Stag Fireworks<br/>
                      Stag Roundabout<br/>
                      156 Wickersley Road<br/>
                      Rotherham, S60 3PT
                    </p>
                  </div>

                  <div>
                    <h4 style={{ color: 'white', marginBottom: '0.8rem', fontSize: '1rem' }}>Contact Info</h4>
                    <a href="tel:07901940400" style={{ color: 'var(--accent-cyan)', textDecoration: 'none', fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>
                      07901 940400
                    </a>
                  </div>
                </div>

              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  );
}
