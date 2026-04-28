import React, { useState } from 'react';
import ProductCard from './ProductCard';

export default function SmartBudgeter({ products, onAdd, wishlistItems, onToggleWishlist }) {
  const [budget, setBudget] = useState('');
  const [preferences, setPreferences] = useState({
    noise: '', // 'low', 'high'
    shots: '', // 'high'
    brand: ''  // e.g. 'Vivid'
  });
  const [suggestedBundle, setSuggestedBundle] = useState([]);
  const [history, setHistory] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleGenerate = () => {
    setErrorMsg('');
    const targetBudget = parseFloat(budget);
    if (isNaN(targetBudget) || targetBudget <= 0) {
      setErrorMsg('Please enter a valid budget.');
      return;
    }

    setIsGenerating(true);

    setTimeout(() => {
      // Smart Greedy Algorithm
      // 1. Filter products based on preferences
      let pool = [...products].filter(p => p.price && typeof p.price !== 'NaN');

      const getBrandInfo = (p) => {
        if (p.specs?.brand) return { name: p.specs.brand };
        const textToSearch = (p.name + ' ' + (p.description || '')).toLowerCase();
        if (textToSearch.includes('vivid')) return { name: 'Vivid' };
        if (textToSearch.includes('brothers') || textToSearch.includes('brother')) return { name: 'Brothers' };
        if (textToSearch.includes('celtic')) return { name: 'Celtic' };
        if (textToSearch.includes('gemstone') || textToSearch.includes('gem stone')) return { name: 'Gemstone' };
        if (textToSearch.includes('hallmark')) return { name: 'Hallmark' };
        if (textToSearch.includes('klasek')) return { name: 'Klasek' };
        if (textToSearch.includes('black panther')) return { name: 'Black Panther' };
        if (textToSearch.includes('cosmic') || textToSearch.includes('cosmicfirework')) return { name: 'Cosmic' };
        if (textToSearch.includes('riakeo')) return { name: 'Riakeo' };
        if (textToSearch.includes('big star')) return { name: 'Big Star' };
        if (textToSearch.includes('astra')) return { name: 'Astra' };
        return { name: 'Unknown' };
      };

      if (preferences.brand) {
        pool = pool.filter(p => getBrandInfo(p).name.toLowerCase() === preferences.brand.toLowerCase());
      }

      if (preferences.noise === 'low') {
        pool = pool.filter(p => {
          const n = parseFloat(p.specs?.noise?.replace(/[^\d.]/g, ''));
          return !n || n < 8; // Arbitrary low noise threshold
        });
      } else if (preferences.noise === 'high') {
        pool = pool.filter(p => {
          const n = parseFloat(p.specs?.noise?.replace(/[^\d.]/g, ''));
          return n && n >= 8;
        });
      }

      let bestSelection = [];
      let bestSelectionIds = '';

      for (let attempt = 0; attempt < 10; attempt++) {
        let poolCopy = [...pool];

        // Always shuffle first to inject base randomness
        poolCopy.sort(() => 0.5 - Math.random());

        if (preferences.shots === 'high') {
          poolCopy.sort((a, b) => {
            const aS = parseFloat(a.specs?.shots?.replace(/[^\d.]/g, '')) || 0;
            const bS = parseFloat(b.specs?.shots?.replace(/[^\d.]/g, '')) || 0;
            // Add 20% random jitter to the weights to produce different combos
            return (bS * (0.8 + Math.random() * 0.4)) - (aS * (0.8 + Math.random() * 0.4));
          });
        } else if (preferences.shots === 'powder') {
          poolCopy.sort((a, b) => {
            const aP = parseFloat(String(a.specs?.weight || '').replace(/[^\d.]/g, '')) || 0;
            const bP = parseFloat(String(b.specs?.weight || '').replace(/[^\d.]/g, '')) || 0;
            return (bP * (0.8 + Math.random() * 0.4)) - (aP * (0.8 + Math.random() * 0.4));
          });
        }

        // Greedy knapsack
        let currentTotal = 0;
        let selection = [];
        for (let i = 0; i < poolCopy.length; i++) {
          const itemPrice = parseFloat(poolCopy[i].price);
          if (currentTotal + itemPrice <= targetBudget) {
            selection.push(poolCopy[i]);
            currentTotal += itemPrice;
          }
          if (targetBudget - currentTotal < 5) break; // Close enough to budget
        }

        const selectionIds = selection.map(p => p.id).sort().join(',');
        bestSelection = selection;
        bestSelectionIds = selectionIds;

        if (selection.length > 0 && !history.slice(-4).includes(selectionIds)) {
          break; // Found a unique combination
        }
      }

      if (bestSelection.length > 0) {
        setSuggestedBundle(bestSelection);
        setHistory(prev => [...prev, bestSelectionIds]);
      } else {
        setErrorMsg("Budget might be too low, or no products match your exact preferences.");
        setSuggestedBundle([]);
      }
      setIsGenerating(false);
    }, 800);
  };

  const handleAddBundleToCart = () => {
    suggestedBundle.forEach(item => {
      onAdd(item);
    });
    alert('Bundle successfully added to your cart!');
  };

  return (
    <section className="smart-budgeter-section" style={{
      margin: '4rem auto',
      maxWidth: '1200px',
      padding: '2rem',
      background: 'rgba(11, 11, 15, 0.8)',
      border: '1px solid var(--border-color)',
      borderRadius: '16px',
      boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5)'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', background: 'linear-gradient(90deg, var(--accent-magenta), var(--accent-cyan))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          PACKAGE BUILDER
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>
          Tell us your budget and preferences. The builder will create the ultimate display for you.
        </p>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', justifyContent: 'center', padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px' }}>
        <div style={{ flex: '1 1 200px', minWidth: '200px' }}>
          <label style={{ display: 'block', color: 'var(--accent-cyan)', marginBottom: '0.5rem', fontWeight: 'bold' }}>Your Budget (£)</label>
          <input
            type="number"
            placeholder="e.g. 500"
            value={budget}
            onChange={e => setBudget(e.target.value)}
            style={{ width: '100%', padding: '0.8rem', background: 'rgba(0,0,0,0.5)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'white', fontSize: '1.1rem' }}
          />
        </div>

        <div style={{ flex: '1 1 200px', minWidth: '200px' }}>
          <label style={{ display: 'block', color: 'var(--text-muted)', marginBottom: '0.5rem', fontWeight: 'bold' }}>Preferred Noise</label>
          <select
            value={preferences.noise}
            onChange={e => setPreferences({ ...preferences, noise: e.target.value })}
            style={{ width: '100%', padding: '0.8rem', background: 'rgba(0,0,0,0.5)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'white' }}
          >
            <option value="">Any Noise Level</option>
            <option value="low">Low Noise (Pet Friendly)</option>
            <option value="high">Loud / Maximum Impact</option>
          </select>
        </div>

        <div style={{ flex: '1 1 200px', minWidth: '200px' }}>
          <label style={{ display: 'block', color: 'var(--text-muted)', marginBottom: '0.5rem', fontWeight: 'bold' }}>Focus On</label>
          <select
            value={preferences.shots}
            onChange={e => setPreferences({ ...preferences, shots: e.target.value })}
            style={{ width: '100%', padding: '0.8rem', background: 'rgba(0,0,0,0.5)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'white' }}
          >
            <option value="">Balanced Display</option>
            <option value="high">Maximum Shots</option>
            <option value="powder">Maximum Powder (NEC)</option>
          </select>
        </div>

        <div style={{ flex: '1 1 200px', minWidth: '200px' }}>
          <label style={{ display: 'block', color: 'var(--text-muted)', marginBottom: '0.5rem', fontWeight: 'bold' }}>Preferred Brand</label>
          <select
            value={preferences.brand}
            onChange={e => setPreferences({ ...preferences, brand: e.target.value })}
            style={{ width: '100%', padding: '0.8rem', background: 'rgba(0,0,0,0.5)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'white' }}
          >
            <option value="">Any Brand</option>
            <option value="Vivid">Vivid Pyrotechnics</option>
            <option value="Brother">Brothers</option>
            <option value="Celtic">Celtic</option>
          </select>
        </div>

        <div style={{ flex: '1 1 100%', display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            style={{
              padding: '1rem 3rem',
              fontSize: '1.2rem',
              background: 'linear-gradient(45deg, var(--accent-magenta), var(--accent-cyan))',
              color: 'white',
              border: 'none',
              borderRadius: '30px',
              cursor: 'pointer',
              fontWeight: '900',
              letterSpacing: '1px',
              textTransform: 'uppercase',
              boxShadow: '0 0 20px rgba(255, 20, 147, 0.4)',
              transition: 'transform 0.2s'
            }}
          >
            {isGenerating ? 'Calculating Best Value...' : 'Generate My Perfect Display'}
          </button>
        </div>
      </div>

      {errorMsg && <p style={{ color: '#ff4444', textAlign: 'center', marginTop: '1rem' }}>{errorMsg}</p>}

      {suggestedBundle.length > 0 && (
        <div style={{ marginTop: '3rem', borderTop: '1px solid var(--border-color)', paddingTop: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h3 style={{ color: 'white', fontSize: '1.8rem', margin: 0 }}>Your Curated Display:</h3>
              <p style={{ color: 'var(--accent-cyan)', fontSize: '1.2rem', margin: '0.5rem 0 0' }}>
                Total Items: {suggestedBundle.length}
              </p>
            </div>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <button
                onClick={handleGenerate}
                style={{ padding: '0.8rem 1.5rem', background: 'transparent', border: '2px solid var(--text-muted)', color: 'var(--text-muted)', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 2v6h-6"></path><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path><path d="M3 2v6h6"></path><path d="M21 12a9 9 0 1 0-9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"></path></svg>
                Refresh Selection
              </button>
              <button
                onClick={handleAddBundleToCart}
                style={{ padding: '0.8rem 1.5rem', background: 'transparent', border: '2px solid var(--accent-cyan)', color: 'white', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                Add Entire Bundle To Cart
              </button>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {suggestedBundle.map(product => (
              <ProductCard
                key={product.id + Math.random()} // allow duplicates technically, but keys distinct
                product={product}
                onAdd={onAdd}
                isWishlisted={wishlistItems.some(item => item.id === product.id)}
                onToggleWishlist={onToggleWishlist}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
