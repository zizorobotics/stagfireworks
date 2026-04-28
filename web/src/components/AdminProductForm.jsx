import { useState } from 'react';
import { supabase } from '../supabaseClient';

export default function AdminProductForm({ product, onClose, onRefresh }) {
  const isNew = !product;
  
  const [formData, setFormData] = useState({
    id: product?.id || `new_${Date.now()}`,
    name: product?.name || '',
    category: product?.category || 'Compounds & Barrages',
    description: product?.description || '',
    videoUrl: product?.videoUrl || '',
    videoId: product?.videoId || '',
    image: product?.image || '',
    price: product?.price || (typeof product?.specs === 'string' ? JSON.parse(product.specs).price : product?.specs?.price) || '',
  });

  const parsedSpecs = typeof product?.specs === 'string' ? JSON.parse(product.specs) : (product?.specs || {});

  const [specs, setSpecs] = useState({
    distance: parsedSpecs.distance || '8 Metres',
    shots: parsedSpecs.shots || '',
    duration: parsedSpecs.duration || '',
    noise: parsedSpecs.noise || '3',
    height: parsedSpecs.height || '',
    pattern: parsedSpecs.pattern || 'Straight',
    tube: parsedSpecs.tube || '',
    hazard: parsedSpecs.hazard || '1.4G',
    weight: parsedSpecs.weight || '',
    brand: parsedSpecs.brand || '',
    specialty: parsedSpecs.specialty || 'None',
    specialties: parsedSpecs.specialties || (parsedSpecs.specialty && parsedSpecs.specialty !== 'None' ? [parsedSpecs.specialty] : []),
    events: parsedSpecs.events || [],
  });

  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    let finalImageUrl = formData.image;

    // Handle Image Upload if a file was selected
    if (imageFile) {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('images')
        .upload(fileName, imageFile);

      if (uploadError) {
        alert("Error uploading image: " + uploadError.message);
        setLoading(false);
        return;
      }
      
      const { data: { publicUrl } } = supabase.storage.from('images').getPublicUrl(fileName);
      finalImageUrl = publicUrl;
    }

    const payload = {
      ...formData,
      image: finalImageUrl,
      specs: { ...specs, price: formData.price },
      linked_video: !!formData.videoId
    };
    
    // Remove price from the root payload since the Supabase schema doesn't have a top-level price column
    delete payload.price;

    let error;
    if (isNew) {
      const res = await supabase.from('products').insert([payload]);
      error = res.error;
    } else {
      const res = await supabase.from('products').update(payload).eq('id', payload.id);
      error = res.error;
    }

    setLoading(false);
    if (error) {
      alert("Error saving: " + error.message);
    } else {
      onRefresh();
      onClose();
    }
  };

  return (
    <div className="modal-overlay open" style={{ zIndex: 10000 }}>
      <div className="modal-content" style={{ maxWidth: '800px', width: '90%', maxHeight: '90vh', overflowY: 'auto', background: '#1a1a1a', border: '1px solid #333' }}>
        <h2 style={{ color: 'var(--accent-cyan)', marginBottom: '1.5rem' }}>
          {isNew ? 'Add New Firework' : 'Edit Firework'}
        </h2>

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label>Product Name</label>
              <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            </div>
            <div className="form-group">
              <label>Category</label>
              <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} style={{ width: '100%', padding: '0.8rem', background: '#222', border: '1px solid #444', color: 'white', borderRadius: '4px' }}>
                <option value="Compounds & Barrages">Compounds & Barrages</option>
                <option value="Rockets">Rockets</option>
                <option value="Low Noise">Low Noise</option>
                <option value="Fountains & Mines">Fountains & Mines</option>
                <option value="Sparklers & Handheld">Sparklers & Handheld</option>
                <option value="Selection Boxes">Selection Boxes</option>
              </select>
            </div>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label>Explicit Guide Price (£)</label>
              <input type="number" step="0.01" value={formData.price} onChange={e => setFormData({...formData, price: parseFloat(e.target.value)})} />
            </div>
            <div className="form-group">
              <label>Explicit Brand (Overrides smart parsing)</label>
              <select value={specs.brand} onChange={e => setSpecs({...specs, brand: e.target.value})} style={{ width: '100%', padding: '0.8rem', background: '#222', border: '1px solid #444', color: 'white', borderRadius: '4px' }}>
                <option value="">None / Auto Detect</option>
                <option value="Vivid">Vivid</option>
                <option value="Brothers">Brothers</option>
                <option value="Celtic">Celtic</option>
                <option value="Gemstone">Gemstone</option>
                <option value="Hallmark">Hallmark</option>
                <option value="Klasek">Klasek</option>
                <option value="Black Panther">Black Panther</option>
                <option value="Cosmic">Cosmic</option>
                <option value="Riakeo">Riakeo</option>
                <option value="Big Star">Big Star</option>
                <option value="Astra">Astra</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea rows="4" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label>YouTube ID (e.g. uX0KyyD8z6w)</label>
              <input type="text" value={formData.videoId} onChange={e => setFormData({...formData, videoId: e.target.value})} />
            </div>
            <div className="form-group">
              <label>Upload Branding Image</label>
              <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files[0])} style={{ padding: '0.6rem' }} />
              {formData.image && !imageFile && <small style={{display: 'block', color: 'var(--accent-magenta)', marginTop: '4px'}}>Current Image Set (Upload overrides)</small>}
            </div>
          </div>

          <div style={{ marginTop: '1rem', borderTop: '1px solid #333', paddingTop: '1rem' }}>
            <h3 style={{ marginBottom: '1rem', color: 'gray' }}>Specifications</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <div className="form-group"><label>Shots</label><input type="text" value={specs.shots} onChange={e => setSpecs({...specs, shots: e.target.value})} /></div>
              <div className="form-group"><label>Duration</label><input type="text" value={specs.duration} onChange={e => setSpecs({...specs, duration: e.target.value})} /></div>
              <div className="form-group"><label>Noise Level (1-5)</label><input type="text" value={specs.noise} onChange={e => setSpecs({...specs, noise: e.target.value})} /></div>
              <div className="form-group"><label>Distance</label><input type="text" value={specs.distance} onChange={e => setSpecs({...specs, distance: e.target.value})} /></div>
              <div className="form-group"><label>Tube Size</label><input type="text" value={specs.tube} onChange={e => setSpecs({...specs, tube: e.target.value})} /></div>
              <div className="form-group"><label>Hazard Class</label><input type="text" value={specs.hazard} onChange={e => setSpecs({...specs, hazard: e.target.value})} /></div>
              <div className="form-group"><label>Powder Weight</label><input type="text" value={specs.weight} onChange={e => setSpecs({...specs, weight: e.target.value})} /></div>
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label>Specialty Labels</label>
                <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                  {['Best Seller', 'On Sale'].map(spec => (
                    <label key={spec} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                      <input 
                        type="checkbox" 
                        checked={specs.specialties?.includes(spec)}
                        onChange={(e) => {
                          const current = specs.specialties || [];
                          if (e.target.checked) setSpecs({...specs, specialties: [...current, spec]});
                          else setSpecs({...specs, specialties: current.filter(s => s !== spec)});
                        }}
                      />
                      <span style={{ color: 'white' }}>{spec}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div style={{ marginTop: '1rem', borderTop: '1px solid #333', paddingTop: '1rem' }}>
            <h3 style={{ marginBottom: '1rem', color: 'var(--accent-cyan)' }}>Thematic Event Targeting</h3>
            <p style={{ color: 'gray', fontSize: '0.9rem', marginBottom: '1rem' }}>Select which special events this firework should explicitly appear under. (Prevents relying solely on description keywords)</p>
            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
              {['Valentines', 'Bespoke Bundles', 'Garden Fireworks', 'Pet Friendly', 'Display Packs', 'Weddings', 'Pro Displays', 'Birthdays', 'Hen & Stag Dos', 'Baby Showers', 'Gender Reveals', 'Engagements', 'Diwali', 'Halloween', 'Christmas', 'Funerals', 'Eid', 'Parties'].map(evt => (
                <label key={evt} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input 
                    type="checkbox" 
                    checked={specs.events?.includes(evt)}
                    onChange={(e) => {
                      const newEvents = e.target.checked 
                        ? [...(specs.events || []), evt]
                        : (specs.events || []).filter(e => e !== evt);
                      setSpecs({...specs, events: newEvents});
                    }}
                    style={{ width: '20px', height: '20px' }}
                  />
                  {evt}
                </label>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button type="button" onClick={onClose} className="submit-btn" style={{ background: 'transparent', border: '1px solid #555' }}>Cancel</button>
            <button type="submit" disabled={loading} className="submit-btn">{loading ? 'Saving...' : 'Save Firework'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
