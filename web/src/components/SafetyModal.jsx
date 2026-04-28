import React, { useEffect, useState } from 'react';

export default function SafetyModal({ isOpen, onClose, onConfirm }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => setIsVisible(true), 10);
      document.body.style.overflow = 'hidden';
    } else {
      setIsVisible(false);
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className={`modal-overlay ${isVisible ? 'open' : ''}`} onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '700px', width: '90%', maxHeight: '90vh', overflowY: 'auto' }}>
        <button className="modal-close" onClick={onClose}>&times;</button>
        
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ color: 'var(--accent-magenta)', fontSize: '2rem', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Safety & Legal Guidelines</h2>
          <p style={{ color: 'var(--text-muted)' }}>Important UK regulations and safety protocols for handling fireworks.</p>
        </div>

        <div style={{ display: 'grid', gap: '1.5rem' }}>
          
          <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1.5rem', borderRadius: '12px', border: '1px solid #333' }}>
            <h3 style={{ color: 'var(--accent-cyan)', marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>🕒</span> 1. The 11 PM Legal Curfew
            </h3>
            <p style={{ color: '#ccc', lineHeight: '1.5', fontSize: '0.95rem' }}>
              UK Law states you must not set off fireworks between <strong>11 PM and 7 AM</strong>. The only explicit legal exceptions are:
              <br/><br/>
              • <strong>Bonfire Night (Nov 5th):</strong> Extended to Midnight.<br/>
              • <strong>New Year's Eve, Diwali, Chinese New Year:</strong> Extended to 1 AM.
            </p>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1.5rem', borderRadius: '12px', border: '1px solid #333' }}>
            <h3 style={{ color: 'var(--accent-cyan)', marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>📏</span> 2. Safety Distances & Classification
            </h3>
            <p style={{ color: '#ccc', lineHeight: '1.5', fontSize: '0.95rem' }}>
              Please strictly adhere to the safety categorization printed on your fireworks:
              <br/><br/>
              • <strong>Category F2 (Garden Fireworks):</strong> Minimum safe spectator distance of <strong>8 meters</strong>.<br/>
              • <strong>Category F3 (Display Fireworks):</strong> Minimum safe spectator distance of <strong>25 meters</strong>.
            </p>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1.5rem', borderRadius: '12px', border: '1px solid #333' }}>
            <h3 style={{ color: 'var(--accent-cyan)', marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>🔞</span> 3. Age Restrictions
            </h3>
            <p style={{ color: '#ccc', lineHeight: '1.5', fontSize: '0.95rem' }}>
              You must be <strong>over 18 years old</strong> to buy adult fireworks in the UK. It is a strict illegal offense for anyone under 18 to possess fireworks in public places.
            </p>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1.5rem', borderRadius: '12px', border: '1px solid #333' }}>
            <h3 style={{ color: 'var(--accent-cyan)', marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>⚠️</span> 4. The Misfire Protocol
            </h3>
            <p style={{ color: '#ccc', lineHeight: '1.5', fontSize: '0.95rem' }}>
              If a firework fails to go off or only partially ignites, <strong>never return to it immediately</strong>. You must wait a minimum of 20 minutes before approaching, then safely douse it entirely in a bucket of cold water.
            </p>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1.5rem', borderRadius: '12px', border: '1px solid #333' }}>
            <h3 style={{ color: 'var(--accent-cyan)', marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>🎇</span> 5. Sparkler Warnings
            </h3>
            <p style={{ color: '#ccc', lineHeight: '1.5', fontSize: '0.95rem' }}>
              Sparklers get extremely hot (up to 15x the boiling point of water). <strong>Never give a sparkler to a child under the age of 5.</strong> Always ensure you have a large bucket of cold water on standby and plunge used sparklers directly into it.
            </p>
          </div>

        </div>
        
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <button className="submit-btn" onClick={() => { if(onConfirm) onConfirm(); else onClose(); }} style={{ padding: '0.8rem 3rem' }}>I Understand</button>
        </div>
      </div>
    </div>
  );
}
