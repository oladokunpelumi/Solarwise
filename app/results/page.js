'use client';

import { useState, useEffect } from 'react';
import styles from './results.module.css';

export default function ResultsPage() {
  const [results, setResults] = useState(null);
  const [selectedSystem, setSelectedSystem] = useState(null);
  const [leadForm, setLeadForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [leadSubmitted, setLeadSubmitted] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const stored = sessionStorage.getItem('solarwise_results');
    if (stored) {
      const data = JSON.parse(stored);
      setResults(data);
      setSelectedSystem(data.systems?.[0] || null);
    }
  }, []);

  const handleLeadSubmit = async (e) => {
    e.preventDefault();
    if (!leadForm.name || !leadForm.phone) {
      setError('Name and phone number are required');
      return;
    }
    setError('');
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...leadForm,
          location: results?.location?.city || '',
          systemType: selectedSystem?.type || 'offgrid',
        }),
      });
      const data = await res.json();
      if (data.success) {
        setLeadSubmitted(true);
      } else {
        setError(data.error || 'Submission failed');
      }
    } catch {
      setError('Network error. Please try again.');
    }
    setIsSubmitting(false);
  };

  if (!results) {
    return (
      <div className="page">
        <div className="container" style={{ textAlign: 'center', paddingTop: '8rem' }}>
          <h2 style={{ marginBottom: '1rem' }}>No results yet</h2>
          <p style={{ color: 'var(--color-text-secondary)', marginBottom: '2rem' }}>
            Run a calculation first to see your solar system designs.
          </p>
          <a href="/calculator" className="btn btn--primary btn--lg" id="go-calculator">
            Go to Calculator →
          </a>
        </div>
      </div>
    );
  }

  const systemColors = {
    offgrid: { badge: 'badge--gold', color: 'var(--color-solar-gold)', gradient: 'linear-gradient(135deg, rgba(251,191,36,0.12), rgba(245,158,11,0.05))' },
    hybrid: { badge: 'badge--blue', color: 'var(--color-solar-blue)', gradient: 'linear-gradient(135deg, rgba(59,130,246,0.12), rgba(59,130,246,0.05))' },
    budget: { badge: 'badge--green', color: 'var(--color-solar-green)', gradient: 'linear-gradient(135deg, rgba(34,197,94,0.12), rgba(34,197,94,0.05))' },
  };

  return (
    <div className="page">
      <div className="container">
        {/* Header */}
        <div className="section-header animate-in">
          <span className="section-header__tag">Your Solar Design</span>
          <h1 className="section-header__title">System Results</h1>
          <p className="section-header__subtitle">
            Based on your appliances in {results.location?.city || 'your location'}
          </p>
        </div>

        {/* ── Energy Summary Cards ── */}
        <div className={styles.energySummary} id="energy-summary-section">
          <div className={`card card--glass ${styles.statBlock} animate-in animate-in--delay-1`}>
            <div className={styles.statIcon}>⚡</div>
            <div className="stat-card__value">{results.dailyEnergy}</div>
            <div className="stat-card__label">kWh/day</div>
            <div className={styles.statSubtext}>Total Daily Energy</div>
          </div>
          <div className={`card card--glass ${styles.statBlock} animate-in animate-in--delay-2`}>
            <div className={styles.statIcon}>🔌</div>
            <div className="stat-card__value">{(results.peakLoad / 1000).toFixed(2)}</div>
            <div className="stat-card__label">kW</div>
            <div className={styles.statSubtext}>Peak Load</div>
          </div>
          <div className={`card card--glass ${styles.statBlock} animate-in animate-in--delay-3`}>
            <div className={styles.statIcon}>☀️</div>
            <div className="stat-card__value">{results.sunHours}</div>
            <div className="stat-card__label">hours</div>
            <div className={styles.statSubtext}>Peak Sun Hours</div>
          </div>
          <div className={`card card--glass ${styles.statBlock} animate-in animate-in--delay-4`}>
            <div className={styles.statIcon}>🏠</div>
            <div className="stat-card__value">{results.appliances?.length || 0}</div>
            <div className="stat-card__label">items</div>
            <div className={styles.statSubtext}>Appliances</div>
          </div>
        </div>

        {/* ── System Design Cards ── */}
        <section className={styles.systemsSection} id="systems-section">
          <h2 className={styles.sectionTitle}>Recommended Systems</h2>
          <div className={styles.systemCards}>
            {results.systems.map((sys, i) => {
              const colors = systemColors[sys.type] || systemColors.offgrid;
              const isSelected = selectedSystem?.type === sys.type;
              return (
                <div
                  key={sys.type}
                  className={`card ${styles.systemCard} ${isSelected ? styles.systemCardSelected : ''} animate-in animate-in--delay-${i + 1}`}
                  style={{ background: colors.gradient, borderColor: isSelected ? colors.color : undefined }}
                  onClick={() => setSelectedSystem(sys)}
                  id={`system-card-${sys.type}`}
                >
                  {sys.type === 'offgrid' && <div className={styles.recommended}>⭐ Recommended</div>}
                  <div className={styles.systemHeader}>
                    <span className={`badge ${colors.badge}`}>{sys.type.toUpperCase()}</span>
                    <h3 className={styles.systemTitle}>{sys.label}</h3>
                    <p className={styles.systemDesc}>{sys.description}</p>
                  </div>
                  <div className={styles.systemSpecs}>
                    <div className={styles.specRow}>
                      <span className={styles.specIcon}>🔆</span>
                      <span className={styles.specLabel}>Solar Panels</span>
                      <span className={styles.specValue} style={{ color: colors.color }}>{sys.panelCount} × {sys.panelWatt}W</span>
                    </div>
                    <div className={styles.specDivider}></div>
                    <div className={styles.specRow}>
                      <span className={styles.specIcon}>🔋</span>
                      <span className={styles.specLabel}>Batteries</span>
                      <span className={styles.specValue} style={{ color: colors.color }}>{sys.batteryCount} × {sys.batterySpec}</span>
                    </div>
                    <div className={styles.specDivider}></div>
                    <div className={styles.specRow}>
                      <span className={styles.specIcon}>⚡</span>
                      <span className={styles.specLabel}>Inverter</span>
                      <span className={styles.specValue} style={{ color: colors.color }}>{sys.inverterKVA} kVA</span>
                    </div>
                    <div className={styles.specDivider}></div>
                    <div className={styles.specRow}>
                      <span className={styles.specIcon}>🎛️</span>
                      <span className={styles.specLabel}>Charge Controller</span>
                      <span className={styles.specValue} style={{ color: colors.color }}>{sys.chargeController}A</span>
                    </div>
                    <div className={styles.specDivider}></div>
                    <div className={styles.specRow}>
                      <span className={styles.specIcon}>🕐</span>
                      <span className={styles.specLabel}>Autonomy</span>
                      <span className={styles.specValue} style={{ color: colors.color }}>{sys.autonomyDays} days</span>
                    </div>
                  </div>
                  <div className={styles.systemTotal}>
                    <span>Total Panel Power</span>
                    <strong>{(sys.totalPanelPower / 1000).toFixed(1)} kW</strong>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── Comparison Table ── */}
        <section className={styles.comparisonSection} id="comparison-section">
          <h2 className={styles.sectionTitle}>Side-by-Side Comparison</h2>
          <div className={`card ${styles.comparisonCard}`}>
            <div className={styles.compTable}>
              <div className={styles.compHeader}>
                <div className={styles.compLabel}></div>
                {results.systems.map(s => (
                  <div key={s.type} className={styles.compColHeader}>
                    <span className={`badge ${systemColors[s.type]?.badge || 'badge--gold'}`}>{s.label}</span>
                  </div>
                ))}
              </div>
              {[
                { label: 'Panels', key: 'panelCount', suffix: '' },
                { label: 'Panel Power', key: 'totalPanelPower', suffix: 'W', divider: 1 },
                { label: 'Batteries', key: 'batteryCount', suffix: '' },
                { label: 'Battery Capacity', key: 'batteryCapacityKWh', suffix: ' kWh' },
                { label: 'Inverter', key: 'inverterKVA', suffix: ' kVA' },
                { label: 'Controller', key: 'chargeController', suffix: 'A' },
                { label: 'Autonomy', key: 'autonomyDays', suffix: ' days' },
              ].map(row => (
                <div key={row.label} className={styles.compRow}>
                  <div className={styles.compLabel}>{row.label}</div>
                  {results.systems.map(s => (
                    <div key={s.type} className={styles.compCell}>
                      {s[row.key]}{row.suffix}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Appliance Breakdown ── */}
        <section className={styles.breakdownSection} id="breakdown-section">
          <h2 className={styles.sectionTitle}>Appliance Breakdown</h2>
          <div className={`card ${styles.breakdownCard}`}>
            <div className={styles.breakdownTable}>
              <div className={`${styles.breakdownRow} ${styles.breakdownHeader}`}>
                <span>Appliance</span>
                <span>Wattage</span>
                <span>Hours/day</span>
                <span>Qty</span>
                <span>Energy (kWh)</span>
              </div>
              {results.appliances.map((a, i) => (
                <div key={i} className={styles.breakdownRow}>
                  <span className={styles.breakdownName}>{a.name}</span>
                  <span>{a.watt}W</span>
                  <span>{a.hours}h</span>
                  <span>×{a.qty}</span>
                  <span className={styles.breakdownEnergy}>{a.energy} kWh</span>
                </div>
              ))}
              <div className={`${styles.breakdownRow} ${styles.breakdownTotal}`}>
                <span>Total</span>
                <span></span>
                <span></span>
                <span></span>
                <span className={styles.breakdownEnergy}>{results.dailyEnergy} kWh</span>
              </div>
            </div>
          </div>
        </section>

        {/* ── Lead Form ── */}
        <section className={styles.leadSection} id="lead-section">
          <h2 className={styles.sectionTitle}>Connect With an Installer</h2>
          <p className={styles.leadSubtitle}>Get a quote from certified solar installers in your area</p>
          <div className={`card card--accent ${styles.leadCard}`}>
            {leadSubmitted ? (
              <div className={styles.leadSuccess} id="lead-success">
                <div className={styles.leadSuccessIcon}>✅</div>
                <h3>Request Submitted!</h3>
                <p>A certified solar installer will contact you shortly.</p>
                <a href="/calculator" className="btn btn--secondary" id="new-calculation-btn">
                  Start New Calculation
                </a>
              </div>
            ) : (
              <form onSubmit={handleLeadSubmit} className={styles.leadForm} id="lead-form">
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Full Name *</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Your name"
                      value={leadForm.name}
                      onChange={(e) => setLeadForm(p => ({ ...p, name: e.target.value }))}
                      id="lead-name"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone Number *</label>
                    <input
                      type="tel"
                      className="form-input"
                      placeholder="+234..."
                      value={leadForm.phone}
                      onChange={(e) => setLeadForm(p => ({ ...p, phone: e.target.value }))}
                      id="lead-phone"
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-input"
                    placeholder="you@example.com"
                    value={leadForm.email}
                    onChange={(e) => setLeadForm(p => ({ ...p, email: e.target.value }))}
                    id="lead-email"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Additional Message</label>
                  <textarea
                    className="form-input"
                    rows="3"
                    placeholder="Any specific requirements or questions..."
                    value={leadForm.message}
                    onChange={(e) => setLeadForm(p => ({ ...p, message: e.target.value }))}
                    id="lead-message"
                  ></textarea>
                </div>
                {error && <div className={styles.formError}>⚠️ {error}</div>}
                <button
                  type="submit"
                  className="btn btn--primary btn--lg"
                  disabled={isSubmitting}
                  id="submit-lead-btn"
                  style={{ width: '100%' }}
                >
                  {isSubmitting ? 'Submitting...' : '📧 Request Installer Quote'}
                </button>
              </form>
            )}
          </div>
        </section>

        {/* ── Action Buttons ── */}
        <div className={styles.actions} id="actions-section">
          <a href="/calculator" className="btn btn--secondary btn--lg" id="recalculate-btn">
            ← Recalculate
          </a>
          <button
            className="btn btn--primary btn--lg"
            onClick={() => window.print()}
            id="print-btn"
          >
            🖨️ Print Results
          </button>
        </div>
      </div>
    </div>
  );
}
