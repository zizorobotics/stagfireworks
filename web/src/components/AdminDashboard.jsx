import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import AdminProductForm from './AdminProductForm';
import productsFile from '../data/products.json';

export default function AdminDashboard() {
  const [session, setSession] = useState(null);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  
  const [products, setProducts] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) fetchProducts();
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) fetchProducts();
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProducts = async () => {
    const { data, error } = await supabase.from('products').select('*');
    if (data) {
      setProducts(data.map(p => {
        let parsedSpecs = p.specs;
        if (typeof p.specs === 'string') {
          try { parsedSpecs = JSON.parse(p.specs); } catch (e) {}
        }
        const localEquiv = productsFile.find(localP => localP.id === p.id);
        const resolvedPrice = p.price || parsedSpecs?.price || localEquiv?.price || '';
        return { ...p, specs: parsedSpecs || {}, price: resolvedPrice };
      }));
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    const { error } = await supabase.auth.signInWithPassword({
      email: 'admin@stagfireworks.co.uk',
      password: password,
    });
    if (error) setLoginError('Invalid Administrator Password');
  };

  const handleLogout = () => {
    supabase.auth.signOut();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to permanently delete this product?")) return;
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (!error) {
      setProducts(products.filter(p => p.id !== id));
    } else {
      alert("Error deleting product.");
    }
  };

  if (!session) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0a0a0a' }}>
        <form onSubmit={handleLogin} style={{ background: '#1a1a1a', padding: '3rem', borderRadius: '12px', border: '1px solid #333', textAlign: 'center', width: '90%', maxWidth: '400px' }}>
          <h2 style={{ color: 'var(--accent-magenta)', marginBottom: '1.5rem' }}>System Access</h2>
          {loginError && <p style={{ color: 'red', marginBottom: '1rem' }}>{loginError}</p>}
          <input 
            type="password" 
            placeholder="Enter Master Password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: '100%', padding: '1rem', background: '#0a0a0a', border: '1px solid #333', color: 'white', borderRadius: '6px', marginBottom: '1.5rem' }}
          />
          <button type="submit" className="submit-btn" style={{ width: '100%' }}>Login</button>
        </form>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto', color: 'white' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ color: 'var(--accent-cyan)' }}>Fireworks Database</h1>
        <div>
          <button onClick={() => { setEditingProduct(null); setIsEditing(true); }} className="submit-btn" style={{ marginRight: '1rem', background: 'var(--accent-magenta)' }}>+ Add Firework</button>
          <button onClick={handleLogout} className="submit-btn" style={{ background: 'transparent', border: '1px solid #333' }}>Sign Out</button>
        </div>
      </div>

      <div style={{ overflowX: 'auto', background: '#1a1a1a', borderRadius: '12px', border: '1px solid #333' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: '#222', borderBottom: '1px solid #333' }}>
              <th style={{ padding: '1rem' }}>Name</th>
              <th style={{ padding: '1rem' }}>Category</th>
              <th style={{ padding: '1rem' }}>Guide Price</th>
              <th style={{ padding: '1rem' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id} style={{ borderBottom: '1px solid #333' }}>
                <td style={{ padding: '1rem' }}>{p.name}</td>
                <td style={{ padding: '1rem' }}>{p.category}</td>
                <td style={{ padding: '1rem', color: 'var(--accent-cyan)' }}>£{p.price || '0.00'}</td>
                <td style={{ padding: '1rem' }}>
                  <button onClick={() => { setEditingProduct(p); setIsEditing(true); }} style={{ padding: '0.5rem 1rem', background: '#333', color: 'white', border: 'none', borderRadius: '4px', marginRight: '0.5rem', cursor: 'pointer' }}>Edit</button>
                  <button onClick={() => handleDelete(p.id)} style={{ padding: '0.5rem 1rem', background: 'red', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isEditing && (
        <AdminProductForm 
          product={editingProduct} 
          onClose={() => setIsEditing(false)} 
          onRefresh={fetchProducts} 
        />
      )}
    </div>
  );
}
