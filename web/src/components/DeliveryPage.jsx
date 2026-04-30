import React from 'react';

export default function DeliveryPage() {
  return (
    <div style={{ padding: '6rem 2rem 4rem', maxWidth: '800px', margin: '0 auto', color: 'var(--text-main)', minHeight: '100vh' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem', textAlign: 'center', background: 'linear-gradient(90deg, var(--accent-magenta), var(--accent-cyan))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
        Delivery & Returns
      </h1>
      
      <div style={{ background: 'var(--panel-bg)', padding: '2rem', borderRadius: '16px', border: '1px solid var(--border-color)', marginBottom: '2rem' }}>
        <h2 style={{ color: 'var(--accent-cyan)', marginBottom: '1rem' }}>Delivery Information</h2>
        <p style={{ marginBottom: '1rem', lineHeight: '1.6' }}>
          We pride ourselves on providing a safe, reliable, and legally compliant delivery service. Because fireworks are classified as hazardous/explosive goods (Hazard Type 4), they cannot be transported by standard mail or generic courier networks.
        </p>
        <ul style={{ listStyleType: 'disc', paddingLeft: '2rem', marginBottom: '1rem', lineHeight: '1.6' }}>
          <li>We use our own <strong>in-house specialized couriers</strong> who are fully licensed and compliant with ADR explosive transport regulations.</li>
          <li><strong>Free Delivery:</strong> Available on all orders over £300*.</li>
          <li><strong>Local Delivery:</strong> Free delivery within Rotherham & Sheffield (minimum order applies).</li>
          <li><strong>Coverage Areas:</strong> Rotherham, Worksop, Sheffield, Barnsley, Wakefield, and Doncaster.</li>
          <li><strong>Same Day Delivery:</strong> Available subject to availability and distance. Please contact us directly if you require urgent delivery.</li>
        </ul>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          *For orders outside our primary coverage zones or under £300, please contact us to arrange bespoke delivery pricing or in-store collection.
        </p>
      </div>

      <div style={{ background: 'var(--panel-bg)', padding: '2rem', borderRadius: '16px', border: '1px solid rgba(255, 0, 80, 0.3)' }}>
        <h2 style={{ color: 'var(--accent-magenta)', marginBottom: '1rem' }}>Returns & Refund Policy</h2>
        <p style={{ marginBottom: '1rem', lineHeight: '1.6' }}>
          Due to the nature of our products and strict UK explosive regulations, <strong>we do not offer refunds or accept returns</strong> once fireworks have left our premises.
        </p>
        <p style={{ marginBottom: '1rem', lineHeight: '1.6' }}>
          Once a firework is handed over to a customer, we cannot guarantee how it has been stored (e.g., exposure to damp or fluctuating temperatures), which compromises its safety and performance. As a licensed retailer, we cannot legally resell returned pyrotechnics. 
        </p>
        <ul style={{ listStyleType: 'disc', paddingLeft: '2rem', marginBottom: '1rem', lineHeight: '1.6' }}>
          <li>All sales are final upon dispatch or collection.</li>
          <li>Pre-order deposits are strictly non-refundable.</li>
          <li>In the highly unlikely event of a manufacturing fault or "dud", please safely dispose of the item as per the instructions on the label, and contact us with photographic/video evidence. We will review such instances on a case-by-case basis to ensure your satisfaction.</li>
        </ul>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          This policy is standard across all reputable UK pyrotechnic retailers and guarantees that every product you receive from Stag Fireworks is factory-fresh, safely stored, and uncompromised.
        </p>
      </div>
    </div>
  );
}
