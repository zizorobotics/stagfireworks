import React from 'react';

export default function FilterDropdown({ isOpen, filters, setFilters, onClose, availableBrands }) {
  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleClear = () => {
    setFilters({
      minPrice: '', maxPrice: '',
      minNoise: '', maxNoise: '',
      minShots: '', maxShots: '',
      minWeight: '', maxWeight: '',
      brand: ''
    });
  };

  return (
    <div className="filter-dropdown">
      <div className="filter-header">
        <h3>Advanced Filters</h3>
        <button onClick={onClose} className="close-filter">&times;</button>
      </div>
      
      <div className="filter-grid">
        {/* Price */}
        <div className="filter-group">
          <label>Price Range (£)</label>
          <div className="range-inputs">
            <input type="number" name="minPrice" placeholder="Min" value={filters.minPrice} onChange={handleChange} min="0" />
            <span>-</span>
            <input type="number" name="maxPrice" placeholder="Max" value={filters.maxPrice} onChange={handleChange} min="0" />
          </div>
        </div>

        {/* Noise */}
        <div className="filter-group">
          <label>Noise Level (1-10)</label>
          <div className="range-inputs">
            <input type="number" name="minNoise" placeholder="Min" value={filters.minNoise} onChange={handleChange} min="1" max="10" />
            <span>-</span>
            <input type="number" name="maxNoise" placeholder="Max" value={filters.maxNoise} onChange={handleChange} min="1" max="10" />
          </div>
        </div>

        {/* Shots */}
        <div className="filter-group">
          <label>Shots</label>
          <div className="range-inputs">
            <input type="number" name="minShots" placeholder="Min" value={filters.minShots} onChange={handleChange} min="1" />
            <span>-</span>
            <input type="number" name="maxShots" placeholder="Max" value={filters.maxShots} onChange={handleChange} min="1" />
          </div>
        </div>

        {/* Weight */}
        <div className="filter-group">
          <label>Powder Weight (g)</label>
          <div className="range-inputs">
            <input type="number" name="minWeight" placeholder="Min (g)" value={filters.minWeight} onChange={handleChange} min="0" />
            <span>-</span>
            <input type="number" name="maxWeight" placeholder="Max (g)" value={filters.maxWeight} onChange={handleChange} min="0" />
          </div>
        </div>

        {/* Brand */}
        <div className="filter-group">
          <label>Brand</label>
          <select name="brand" value={filters.brand} onChange={handleChange} style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', background: 'rgba(0,0,0,0.5)', border: '1px solid #333', color: 'white', marginTop: '0.3rem' }}>
            <option value="">Any Brand</option>
            {availableBrands.map(b => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="filter-footer">
        <button className="clear-btn" onClick={handleClear}>Clear Filters</button>
        <button className="apply-btn" onClick={onClose}>Apply Details</button>
      </div>
    </div>
  );
}
