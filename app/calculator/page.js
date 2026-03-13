'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import styles from './calculator.module.css';

export default function CalculatorPage() {
  const router = useRouter();

  // State
  const [presets, setPresets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedAppliances, setSelectedAppliances] = useState([]);
  const [location, setLocation] = useState('');
  const [locationData, setLocationData] = useState(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [customAppliance, setCustomAppliance] = useState({ name: '', watt: '', hours: '', qty: '1' });
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState('');

  // Fetch presets
  useEffect(() => {
    fetch('/api/appliances')
      .then(res => res.json())
      .then(data => {
        setPresets(data.appliances || []);
        setCategories(['All', ...(data.categories || [])]);
      })
      .catch(err => console.error('Failed to load appliances:', err));
  }, []);

  // Add preset appliance
  const addAppliance = useCallback((preset) => {
    const existing = selectedAppliances.find(a => a.id === preset.id);
    if (existing) {
      setSelectedAppliances(prev =>
        prev.map(a => a.id === preset.id ? { ...a, qty: a.qty + 1 } : a)
      );
    } else {
      setSelectedAppliances(prev => [...prev, {
        id: preset.id,
        name: preset.name,
        watt: preset.watt,
        icon: preset.icon,
        hours: 8,
        qty: 1,
      }]);
    }
  }, [selectedAppliances]);

  // Add custom appliance
  const addCustomAppliance = useCallback(() => {
    const { name, watt, hours, qty } = customAppliance;
    if (!name || !watt || !hours) {
      setError('Please fill in all custom appliance fields');
      return;
    }
    const id = `custom-${Date.now()}`;
    setSelectedAppliances(prev => [...prev, {
      id,
      name,
      watt: Number(watt),
      icon: '🔌',
      hours: Number(hours),
      qty: Number(qty) || 1,
    }]);
    setCustomAppliance({ name: '', watt: '', hours: '', qty: '1' });
    setShowCustomForm(false);
    setError('');
  }, [customAppliance]);

  // Remove appliance
  const removeAppliance = useCallback((id) => {
    setSelectedAppliances(prev => prev.filter(a => a.id !== id));
  }, []);

  // Update appliance field
  const updateAppliance = useCallback((id, field, value) => {
    setSelectedAppliances(prev =>
      prev.map(a => a.id === id ? { ...a, [field]: Math.max(field === 'qty' ? 1 : 0.5, Number(value) || 0) } : a)
    );
  }, []);

  // Calculate energy
  const totalEnergy = selectedAppliances.reduce((sum, a) => sum + (a.watt * a.hours * a.qty) / 1000, 0);
  const totalLoad = selectedAppliances.reduce((sum, a) => sum + a.watt * a.qty, 0);

  // Detect location
  const detectLocation = useCallback(async () => {
    setIsDetecting(true);
    try {
      const res = await fetch('https://ipapi.co/json/');
      const data = await res.json();
      const city = data.city || 'Lagos';
      setLocation(city);
      setLocationData({ city: data.city, country: data.country_name, region: data.region });
    } catch {
      setLocation('Lagos');
      setLocationData({ city: 'Lagos', country: 'Nigeria', region: '' });
    }
    setIsDetecting(false);
  }, []);

  // Calculate
  const handleCalculate = useCallback(async () => {
    if (selectedAppliances.length === 0) {
      setError('Please add at least one appliance');
      return;
    }
    if (!location) {
      setError('Please enter or detect your location');
      return;
    }
    setError('');
    setIsCalculating(true);

    try {
      const res = await fetch('/api/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          location,
          appliances: selectedAppliances.map(a => ({
            name: a.name,
            watt: a.watt,
            hours: a.hours,
            qty: a.qty,
          })),
        }),
      });
      const data = await res.json();

      if (data.success) {
        // Store results and navigate
        sessionStorage.setItem('solarwise_results', JSON.stringify(data));
        router.push('/results');
      } else {
        setError(data.error || 'Calculation failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    }
    setIsCalculating(false);
  }, [selectedAppliances, location, router]);

  // Filter presets
  const filteredPresets = presets.filter(p => {
    const categoryMatch = activeCategory === 'All' || p.category === activeCategory;
    const searchMatch = !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return categoryMatch && searchMatch;
  });

  return (
    <div className="page">
      <div className="container">
        {/* Header */}
        <div className="section-header">
          <span className="section-header__tag">Solar Calculator</span>
          <h1 className="section-header__title">Size Your Solar System</h1>
          <p className="section-header__subtitle">
            Add your appliances, set your location, and get instant solar system designs
          </p>
        </div>

        <div className={styles.calculatorLayout}>
          {/* ── Left: Appliance Selection ── */}
          <div className={styles.leftPanel}>
            {/* Location */}
            <div className={`card ${styles.locationCard}`} id="location-section">
              <h3 className={styles.cardTitle}>
                <span>📍</span> Your Location
              </h3>
              <div className={styles.locationRow}>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Enter city (e.g. Lagos, Nairobi, Cairo)"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  id="location-input"
                />
                <button
                  className="btn btn--secondary btn--sm"
                  onClick={detectLocation}
                  disabled={isDetecting}
                  id="detect-location-btn"
                >
                  {isDetecting ? '⏳ Detecting...' : '🌐 Auto-detect'}
                </button>
              </div>
              {locationData && (
                <p className={styles.locationInfo}>
                  📍 {locationData.city}{locationData.country ? `, ${locationData.country}` : ''}
                </p>
              )}
            </div>

            {/* Category Filters */}
            <div className={`card ${styles.presetsCard}`} id="presets-section">
              <div className={styles.presetsHeader}>
                <h3 className={styles.cardTitle}>
                  <span>🔌</span> Select Appliances
                </h3>
                <button
                  className="btn btn--secondary btn--sm"
                  onClick={() => setShowCustomForm(!showCustomForm)}
                  id="add-custom-btn"
                >
                  {showCustomForm ? '✕ Cancel' : '+ Custom'}
                </button>
              </div>

              {/* Custom Appliance Form */}
              {showCustomForm && (
                <div className={styles.customForm} id="custom-appliance-form">
                  <div className={styles.customGrid}>
                    <input
                      type="text"
                      className="form-input form-input--sm"
                      placeholder="Appliance name"
                      value={customAppliance.name}
                      onChange={(e) => setCustomAppliance(prev => ({ ...prev, name: e.target.value }))}
                      id="custom-name-input"
                    />
                    <input
                      type="number"
                      className="form-input form-input--sm"
                      placeholder="Watts"
                      value={customAppliance.watt}
                      onChange={(e) => setCustomAppliance(prev => ({ ...prev, watt: e.target.value }))}
                      id="custom-watt-input"
                    />
                    <input
                      type="number"
                      className="form-input form-input--sm"
                      placeholder="Hours/day"
                      value={customAppliance.hours}
                      onChange={(e) => setCustomAppliance(prev => ({ ...prev, hours: e.target.value }))}
                      id="custom-hours-input"
                    />
                    <input
                      type="number"
                      className="form-input form-input--sm"
                      placeholder="Qty"
                      value={customAppliance.qty}
                      onChange={(e) => setCustomAppliance(prev => ({ ...prev, qty: e.target.value }))}
                      id="custom-qty-input"
                    />
                  </div>
                  <button className="btn btn--primary btn--sm" onClick={addCustomAppliance} id="save-custom-btn">
                    Add Custom Appliance
                  </button>
                </div>
              )}

              {/* Search */}
              <input
                type="text"
                className={`form-input form-input--sm ${styles.searchInput}`}
                placeholder="🔍 Search appliances..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                id="search-appliances"
              />

              {/* Category Pills */}
              <div className={styles.categoryPills} id="category-filters">
                {categories.map(cat => (
                  <button
                    key={cat}
                    className={`${styles.pill} ${activeCategory === cat ? styles.pillActive : ''}`}
                    onClick={() => setActiveCategory(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Preset Grid */}
              <div className={styles.presetGrid} id="preset-grid">
                {filteredPresets.map(preset => (
                  <button
                    key={preset.id}
                    className={`${styles.presetCard} ${selectedAppliances.some(a => a.id === preset.id) ? styles.presetSelected : ''}`}
                    onClick={() => addAppliance(preset)}
                    id={`preset-${preset.id}`}
                  >
                    <span className={styles.presetIcon}>{preset.icon}</span>
                    <span className={styles.presetName}>{preset.name}</span>
                    <span className={styles.presetWatt}>{preset.watt}W</span>
                    {selectedAppliances.some(a => a.id === preset.id) && (
                      <span className={styles.presetCheck}>✓</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ── Right: Selected & Summary ── */}
          <div className={styles.rightPanel}>
            {/* Energy Summary */}
            <div className={`card card--accent ${styles.summaryCard}`} id="energy-summary">
              <h3 className={styles.cardTitle}>⚡ Energy Summary</h3>
              <div className={styles.summaryStats}>
                <div className={styles.summaryStat}>
                  <span className={styles.summaryValue}>{totalEnergy.toFixed(2)}</span>
                  <span className={styles.summaryLabel}>kWh/day</span>
                </div>
                <div className={styles.summaryStat}>
                  <span className={styles.summaryValue}>{(totalLoad / 1000).toFixed(2)}</span>
                  <span className={styles.summaryLabel}>kW Peak Load</span>
                </div>
                <div className={styles.summaryStat}>
                  <span className={styles.summaryValue}>{selectedAppliances.length}</span>
                  <span className={styles.summaryLabel}>Appliances</span>
                </div>
              </div>
            </div>

            {/* Selected Appliances Table */}
            <div className={`card ${styles.selectedCard}`} id="selected-appliances">
              <h3 className={styles.cardTitle}>🏠 Your Appliances</h3>
              {selectedAppliances.length === 0 ? (
                <div className={styles.emptyState}>
                  <p>No appliances added yet</p>
                  <p className={styles.emptyHint}>← Select appliances from the left panel</p>
                </div>
              ) : (
                <div className={styles.applianceList}>
                  {selectedAppliances.map(a => (
                    <div key={a.id} className={styles.applianceRow} id={`selected-${a.id}`}>
                      <div className={styles.applianceInfo}>
                        <span className={styles.applianceIcon}>{a.icon}</span>
                        <div>
                          <span className={styles.applianceName}>{a.name}</span>
                          <span className={styles.applianceWatt}>{a.watt}W</span>
                        </div>
                      </div>
                      <div className={styles.applianceControls}>
                        <div className={styles.controlGroup}>
                          <label className={styles.controlLabel}>Qty</label>
                          <input
                            type="number"
                            min="1"
                            value={a.qty}
                            onChange={(e) => updateAppliance(a.id, 'qty', e.target.value)}
                            className={`form-input form-input--sm ${styles.controlInput}`}
                          />
                        </div>
                        <div className={styles.controlGroup}>
                          <label className={styles.controlLabel}>Hrs/day</label>
                          <input
                            type="number"
                            min="0.5"
                            step="0.5"
                            value={a.hours}
                            onChange={(e) => updateAppliance(a.id, 'hours', e.target.value)}
                            className={`form-input form-input--sm ${styles.controlInput}`}
                          />
                        </div>
                        <div className={styles.controlGroup}>
                          <span className={styles.controlLabel}>Energy</span>
                          <span className={styles.energyValue}>{((a.watt * a.hours * a.qty) / 1000).toFixed(2)} kWh</span>
                        </div>
                        <button
                          className="btn btn--danger btn--icon btn--sm"
                          onClick={() => removeAppliance(a.id)}
                          title="Remove"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Error */}
            {error && (
              <div className={styles.errorMsg} id="error-message">
                ⚠️ {error}
              </div>
            )}

            {/* Calculate Button */}
            <button
              className={`btn btn--primary btn--lg ${styles.calculateBtn}`}
              onClick={handleCalculate}
              disabled={isCalculating || selectedAppliances.length === 0}
              id="calculate-btn"
            >
              {isCalculating ? (
                <>
                  <span className="spinner"></span>
                  Calculating...
                </>
              ) : (
                <>
                  ⚡ Calculate Solar System
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
