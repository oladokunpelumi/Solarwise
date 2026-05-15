'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import SolarIcon from '../components/SolarIcon';
import styles from './calculator.module.css';

const DEFAULT_HOURS = {
  Cooling: 8,
  Kitchen: 4,
  Lighting: 6,
  Entertainment: 5,
  Computing: 8,
  Laundry: 1,
  Water: 2,
};

function clampNumber(value, min, max) {
  const next = Number(value);
  if (!Number.isFinite(next)) return min;
  return Math.min(max, Math.max(min, next));
}

export default function CalculatorPage() {
  const router = useRouter();
  const [presets, setPresets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedAppliances, setSelectedAppliances] = useState([]);
  const [location, setLocation] = useState('');
  const [locationData, setLocationData] = useState(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [customAppliance, setCustomAppliance] = useState({
    name: '',
    watt: '',
    hours: '',
    qty: '1',
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/appliances')
      .then((res) => res.json())
      .then((data) => {
        setPresets(data.appliances || []);
        setCategories(['All', ...(data.categories || [])]);
      })
      .catch(() => setError('Appliance presets could not be loaded. Refresh and try again.'));
  }, []);

  const addAppliance = useCallback((preset) => {
    setSelectedAppliances((prev) => {
      const existing = prev.find((item) => item.id === preset.id);
      if (existing) {
        return prev.map((item) => (
          item.id === preset.id ? { ...item, qty: item.qty + 1 } : item
        ));
      }

      return [
        ...prev,
        {
          id: preset.id,
          name: preset.name,
          watt: preset.watt,
          iconKey: preset.iconKey || 'plug',
          hours: DEFAULT_HOURS[preset.category] || 4,
          qty: 1,
        },
      ];
    });
    setError('');
  }, []);

  const addCustomAppliance = useCallback(() => {
    const name = customAppliance.name.trim();
    const watt = Number(customAppliance.watt);
    const hours = Number(customAppliance.hours);
    const qty = Number(customAppliance.qty) || 1;

    if (!name || !Number.isFinite(watt) || !Number.isFinite(hours)) {
      setError('Add a name, wattage, and daily hours for the custom appliance.');
      return;
    }

    if (watt <= 0 || hours <= 0 || hours > 24 || qty <= 0) {
      setError('Custom appliance values must be positive. Hours cannot exceed 24 per day.');
      return;
    }

    setSelectedAppliances((prev) => [
      ...prev,
      {
        id: `custom-${Date.now()}`,
        name,
        watt,
        iconKey: 'plug',
        hours: clampNumber(hours, 0.5, 24),
        qty: clampNumber(qty, 1, 99),
      },
    ]);
    setCustomAppliance({ name: '', watt: '', hours: '', qty: '1' });
    setShowCustomForm(false);
    setError('');
  }, [customAppliance]);

  const removeAppliance = useCallback((id) => {
    setSelectedAppliances((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const setApplianceField = useCallback((id, field, value) => {
    const min = field === 'qty' ? 1 : 0.5;
    const max = field === 'qty' ? 99 : 24;

    setSelectedAppliances((prev) => prev.map((item) => (
      item.id === id ? { ...item, [field]: clampNumber(value, min, max) } : item
    )));
  }, []);

  const stepApplianceField = useCallback((id, field, delta) => {
    setSelectedAppliances((prev) => prev.map((item) => {
      if (item.id !== id) return item;
      const min = field === 'qty' ? 1 : 0.5;
      const max = field === 'qty' ? 99 : 24;
      return { ...item, [field]: clampNumber(item[field] + delta, min, max) };
    }));
  }, []);

  const totalEnergy = useMemo(() => (
    selectedAppliances.reduce((sum, item) => sum + (item.watt * item.hours * item.qty) / 1000, 0)
  ), [selectedAppliances]);

  const totalLoad = useMemo(() => (
    selectedAppliances.reduce((sum, item) => sum + item.watt * item.qty, 0)
  ), [selectedAppliances]);

  const detectLocation = useCallback(async () => {
    setIsDetecting(true);
    setError('');
    try {
      const res = await fetch('https://ipapi.co/json/');
      const data = await res.json();
      const city = data.city || 'Lagos';
      setLocation(city);
      setLocationData({
        city,
        country: data.country_name || 'Nigeria',
        region: data.region || '',
      });
    } catch {
      setLocation('Lagos');
      setLocationData({ city: 'Lagos', country: 'Nigeria', region: '' });
      setError('Auto-detect was unavailable, so Lagos was used as a safe fallback.');
    } finally {
      setIsDetecting(false);
    }
  }, []);

  const handleCalculate = useCallback(async () => {
    const cleanLocation = location.trim();

    if (selectedAppliances.length === 0) {
      setError('Add at least one appliance before calculating.');
      return;
    }

    if (!cleanLocation) {
      setError('Enter or auto-detect a city before calculating.');
      return;
    }

    setError('');
    setIsCalculating(true);

    try {
      const res = await fetch('/api/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          location: cleanLocation,
          appliances: selectedAppliances.map((item) => ({
            name: item.name,
            watt: item.watt,
            hours: item.hours,
            qty: item.qty,
          })),
        }),
      });
      const data = await res.json();

      if (data.success) {
        sessionStorage.setItem('solarwise_results', JSON.stringify(data));
        router.push('/results');
      } else {
        setError(data.error || 'Calculation failed. Check your inputs and try again.');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setIsCalculating(false);
    }
  }, [location, router, selectedAppliances]);

  const filteredPresets = useMemo(() => presets.filter((preset) => {
    const categoryMatch = activeCategory === 'All' || preset.category === activeCategory;
    const searchMatch = !searchQuery || preset.name.toLowerCase().includes(searchQuery.toLowerCase());
    return categoryMatch && searchMatch;
  }), [activeCategory, presets, searchQuery]);

  return (
    <div className="page">
      <div className="container">
        <header className={styles.pageHead}>
          <p>Solar Calculator - Step 1 of 1</p>
          <h1>
            Size your <em>solar system.</em>
          </h1>
          <span>
            Add appliances, set a city, and get three complete solar designs in under a
            minute.
          </span>
        </header>

        <div className={styles.calculatorLayout}>
          <div className={styles.main}>
            <section className={`panel ${styles.panel}`}>
              <div className={styles.panelHead}>
                <h2 className={styles.panelTitle}>
                  <span className={styles.panelIcon}>
                    <SolarIcon name="mapPin" size={18} />
                  </span>
                  Your location
                </h2>
              </div>
              <div className={styles.locationRow}>
                <label className={styles.inputWrap}>
                  <span className="form-label">City</span>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Lagos, Nairobi, Cairo"
                    value={location}
                    onChange={(event) => {
                      setLocation(event.target.value);
                      setLocationData(null);
                    }}
                  />
                </label>
                <button
                  className="btn btn--secondary"
                  type="button"
                  onClick={detectLocation}
                  disabled={isDetecting}
                >
                  {isDetecting ? <span className="spinner" /> : <SolarIcon name="globe" size={16} />}
                  {isDetecting ? 'Detecting' : 'Auto-detect'}
                </button>
              </div>
              {locationData && (
                <p className="status-note">
                  {locationData.city}
                  {locationData.country ? `, ${locationData.country}` : ''} confirmed
                </p>
              )}
            </section>

            <section className={`panel ${styles.panel}`}>
              <div className={styles.panelHead}>
                <h2 className={styles.panelTitle}>
                  <span className={styles.panelIcon}>
                    <SolarIcon name="monitor" size={18} />
                  </span>
                  Select appliances
                </h2>
                <button
                  className="btn btn--secondary btn--sm"
                  type="button"
                  onClick={() => {
                    setShowCustomForm((value) => !value);
                    setError('');
                  }}
                >
                  {showCustomForm ? <SolarIcon name="x" size={14} /> : <SolarIcon name="plus" size={14} />}
                  {showCustomForm ? 'Cancel' : 'Custom'}
                </button>
              </div>

              {showCustomForm && (
                <div className={styles.customForm}>
                  <div className={styles.customGrid}>
                    <label className="form-group">
                      <span className="form-label">Name</span>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="Appliance name"
                        value={customAppliance.name}
                        onChange={(event) => setCustomAppliance((prev) => ({ ...prev, name: event.target.value }))}
                      />
                    </label>
                    <label className="form-group">
                      <span className="form-label">Watts</span>
                      <input
                        type="number"
                        min="1"
                        className="form-input"
                        placeholder="120"
                        value={customAppliance.watt}
                        onChange={(event) => setCustomAppliance((prev) => ({ ...prev, watt: event.target.value }))}
                      />
                    </label>
                    <label className="form-group">
                      <span className="form-label">Hours/day</span>
                      <input
                        type="number"
                        min="0.5"
                        max="24"
                        step="0.5"
                        className="form-input"
                        placeholder="4"
                        value={customAppliance.hours}
                        onChange={(event) => setCustomAppliance((prev) => ({ ...prev, hours: event.target.value }))}
                      />
                    </label>
                    <label className="form-group">
                      <span className="form-label">Qty</span>
                      <input
                        type="number"
                        min="1"
                        className="form-input"
                        placeholder="1"
                        value={customAppliance.qty}
                        onChange={(event) => setCustomAppliance((prev) => ({ ...prev, qty: event.target.value }))}
                      />
                    </label>
                  </div>
                  <button className="btn btn--primary btn--sm" type="button" onClick={addCustomAppliance}>
                    Add custom appliance
                  </button>
                </div>
              )}

              <label className={styles.searchWrap}>
                <SolarIcon name="search" size={16} />
                <span className={styles.visuallyHidden}>Search appliances</span>
                <input
                  type="text"
                  placeholder="Search appliances..."
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                />
              </label>

              <div className={styles.categoryPills} aria-label="Appliance categories">
                {categories.map((category) => (
                  <button
                    key={category}
                    type="button"
                    className={`${styles.pill} ${activeCategory === category ? styles.pillActive : ''}`}
                    onClick={() => setActiveCategory(category)}
                    aria-pressed={activeCategory === category}
                  >
                    {category}
                  </button>
                ))}
              </div>

              <div className={styles.presetGrid}>
                {filteredPresets.length === 0 ? (
                  <div className={styles.emptyState}>
                    <SolarIcon name="search" size={28} />
                    <p>No appliances match that search.</p>
                  </div>
                ) : (
                  filteredPresets.map((preset) => {
                    const selected = selectedAppliances.some((item) => item.id === preset.id);
                    return (
                      <button
                        key={preset.id}
                        type="button"
                        className={`${styles.presetCard} ${selected ? styles.presetSelected : ''}`}
                        onClick={() => addAppliance(preset)}
                        aria-pressed={selected}
                      >
                        <span className={styles.presetIcon}>
                          <SolarIcon name={preset.iconKey} size={24} />
                        </span>
                        <span className={styles.presetName}>{preset.name}</span>
                        <span className={styles.presetWatt}>{preset.watt} W</span>
                        {selected && (
                          <span className={styles.selectedDot}>
                            <SolarIcon name="check" size={12} />
                          </span>
                        )}
                      </button>
                    );
                  })
                )}
              </div>
            </section>
          </div>

          <aside className={styles.sidebar}>
            <section className={`panel ${styles.panel}`}>
              <div className={styles.panelHead}>
                <h2 className={styles.panelTitle}>
                  <span className={styles.panelIcon}>
                    <SolarIcon name="zap" size={18} />
                  </span>
                  Energy summary
                </h2>
              </div>
              <div className={styles.summary}>
                <div>
                  <strong>{totalEnergy.toFixed(2)}</strong>
                  <span>kWh/day</span>
                </div>
                <div>
                  <strong>{(totalLoad / 1000).toFixed(2)}</strong>
                  <span>kW peak</span>
                </div>
                <div>
                  <strong>{selectedAppliances.length}</strong>
                  <span>Appliances</span>
                </div>
              </div>
            </section>

            <section className={`panel ${styles.panel}`}>
              <div className={styles.panelHead}>
                <h2 className={styles.panelTitle}>
                  <span className={styles.panelIcon}>
                    <SolarIcon name="house" size={18} />
                  </span>
                  Your appliances
                </h2>
              </div>

              {selectedAppliances.length === 0 ? (
                <div className={styles.emptyState}>
                  <SolarIcon name="panel" size={32} />
                  <p>No appliances yet.</p>
                  <span>Select appliances from the catalog to build your load profile.</span>
                </div>
              ) : (
                <div className={styles.applianceList}>
                  {selectedAppliances.map((item) => (
                    <div key={item.id} className={styles.applianceRow}>
                      <div className={styles.applianceInfo}>
                        <span className={styles.applianceIcon}>
                          <SolarIcon name={item.iconKey} size={18} />
                        </span>
                        <div>
                          <strong>{item.name}</strong>
                          <span>{item.watt} W</span>
                        </div>
                      </div>

                      <div className={styles.steppers}>
                        <div className={styles.stepper}>
                          <span>Qty</span>
                          <button type="button" onClick={() => stepApplianceField(item.id, 'qty', -1)} aria-label={`Decrease ${item.name} quantity`}>
                            -
                          </button>
                          <input
                            type="number"
                            min="1"
                            value={item.qty}
                            onChange={(event) => setApplianceField(item.id, 'qty', event.target.value)}
                            aria-label={`${item.name} quantity`}
                          />
                          <button type="button" onClick={() => stepApplianceField(item.id, 'qty', 1)} aria-label={`Increase ${item.name} quantity`}>
                            +
                          </button>
                        </div>
                        <div className={styles.stepper}>
                          <span>Hrs</span>
                          <button type="button" onClick={() => stepApplianceField(item.id, 'hours', -0.5)} aria-label={`Decrease ${item.name} hours`}>
                            -
                          </button>
                          <input
                            type="number"
                            min="0.5"
                            max="24"
                            step="0.5"
                            value={item.hours}
                            onChange={(event) => setApplianceField(item.id, 'hours', event.target.value)}
                            aria-label={`${item.name} hours per day`}
                          />
                          <button type="button" onClick={() => stepApplianceField(item.id, 'hours', 0.5)} aria-label={`Increase ${item.name} hours`}>
                            +
                          </button>
                        </div>
                      </div>

                      <div className={styles.rowEnergy}>
                        {((item.watt * item.hours * item.qty) / 1000).toFixed(2)} kWh
                      </div>
                      <button
                        className="btn btn--danger btn--icon"
                        type="button"
                        onClick={() => removeAppliance(item.id)}
                        aria-label={`Remove ${item.name}`}
                      >
                        <SolarIcon name="x" size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {error && (
                <div className="error-box">
                  <SolarIcon name="error" size={18} />
                  <span>{error}</span>
                </div>
              )}

              <button
                className={`btn btn--primary btn--lg ${styles.calculateBtn}`}
                type="button"
                onClick={handleCalculate}
                disabled={isCalculating || selectedAppliances.length === 0}
              >
                {isCalculating ? (
                  <>
                    <span className="spinner" />
                    Calculating
                  </>
                ) : (
                  <>
                    Calculate solar system
                    <SolarIcon name="arrowRight" size={16} />
                  </>
                )}
              </button>
              <p className={styles.hint}>Free estimate. No sign-up required.</p>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}
