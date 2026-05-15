'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import SolarIcon from '../components/SolarIcon';
import styles from './results.module.css';

const systemTone = {
  offgrid: { label: 'Recommended independence', tone: 'warning' },
  hybrid: { label: 'Grid-assisted backup', tone: 'info' },
  budget: { label: 'Essential starter', tone: 'success' },
};

const countryCodes = [
  { value: '+234', label: 'NG +234' },
  { value: '+233', label: 'GH +233' },
  { value: '+254', label: 'KE +254' },
  { value: '+27', label: 'ZA +27' },
  { value: '+1', label: 'US +1' },
  { value: '+44', label: 'UK +44' },
];

function normalizePhone(countryCode, phone) {
  const trimmed = phone.trim();
  if (trimmed.startsWith('+')) {
    return `+${trimmed.replace(/\D/g, '')}`;
  }
  const digits = trimmed.replace(/\D/g, '').replace(/^0+/, '');
  return `${countryCode}${digits}`;
}

function formatValue(system, row) {
  const value = system[row.key];
  if (row.key === 'totalPanelPower') return `${(value / 1000).toFixed(1)} kW`;
  return `${value}${row.suffix || ''}`;
}

export default function ResultsPage() {
  const [results, setResults] = useState(null);
  const [selectedSystem, setSelectedSystem] = useState(null);
  const [leadForm, setLeadForm] = useState({
    name: '',
    email: '',
    countryCode: '+234',
    phone: '',
    message: '',
    company: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [leadSubmitted, setLeadSubmitted] = useState(false);
  const [leadSuccessMessage, setLeadSuccessMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem('solarwise_results');
      if (stored) {
        const data = JSON.parse(stored);
        setResults(data);
        setSelectedSystem(data.systems?.[0] || null);
      }
    } catch {
      setError('Saved results could not be loaded. Run a new calculation to refresh them.');
    }
  }, []);

  const comparisonRows = useMemo(() => ([
    { label: 'Solar panels', key: 'panelCount', suffix: '' },
    { label: 'Panel power', key: 'totalPanelPower' },
    { label: 'Batteries', key: 'batteryCount', suffix: '' },
    { label: 'Battery capacity', key: 'batteryCapacityKWh', suffix: ' kWh' },
    { label: 'Inverter', key: 'inverterKVA', suffix: ' kVA' },
    { label: 'Controller', key: 'chargeController', suffix: ' A' },
    { label: 'Autonomy', key: 'autonomyDays', suffix: ' days' },
  ]), []);

  const handleLeadSubmit = async (event) => {
    event.preventDefault();

    const normalizedPhone = normalizePhone(leadForm.countryCode, leadForm.phone);
    const digits = normalizedPhone.replace(/\D/g, '');

    if (!leadForm.name.trim()) {
      setError('Enter your full name before requesting a quote.');
      return;
    }

    if (digits.length < 7) {
      setError('Enter a valid phone number with country code.');
      return;
    }

    setError('');
    setLeadSuccessMessage('');
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: leadForm.name.trim(),
          email: leadForm.email.trim(),
          phone: normalizedPhone,
          message: leadForm.message.trim(),
          company: leadForm.company.trim(),
          location: results?.location || null,
          systemType: selectedSystem?.type || 'unknown',
          selectedSystem,
          summary: {
            dailyEnergy: results?.dailyEnergy,
            peakLoad: results?.peakLoad,
            sunHours: results?.sunHours,
            applianceCount: results?.appliances?.length || 0,
          },
          appliances: results?.appliances || [],
        }),
      });
      const data = await res.json();
      if (data.success) {
        setLeadSuccessMessage(data.message || 'Your installer quote request was emailed successfully.');
        setLeadSubmitted(true);
      } else {
        setError(data.error || 'Submission failed. Please try again.');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!results) {
    return (
      <div className="page">
        <div className={`container ${styles.emptyPage}`}>
          <div className={`panel ${styles.emptyPanel}`}>
            <SolarIcon name="calculator" size={40} />
            <h1>No results yet</h1>
            <p>Run a calculation first to see solar system designs and installer quote options.</p>
            {error && (
              <div className="error-box">
                <SolarIcon name="error" size={18} />
                <span>{error}</span>
              </div>
            )}
            <Link href="/calculator" className="btn btn--primary btn--lg">
              Go to calculator
              <SolarIcon name="arrowRight" size={16} />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="container">
        <header className={styles.pageHead}>
          <p>Your solar design</p>
          <h1>
            System <em>results.</em>
          </h1>
          <span>
            Based on your appliances in {results.location?.city || 'your selected city'} with
            {` ${results.sunHours}`} peak sun hours.
          </span>
        </header>

        <section className={styles.energySummary} aria-label="Energy summary">
          <div className={`panel ${styles.statBlock}`}>
            <SolarIcon name="zap" size={22} />
            <strong>{results.dailyEnergy}</strong>
            <span>kWh/day</span>
            <p>Total daily energy</p>
          </div>
          <div className={`panel ${styles.statBlock}`}>
            <SolarIcon name="plug" size={22} />
            <strong>{(results.peakLoad / 1000).toFixed(2)}</strong>
            <span>kW</span>
            <p>Peak load</p>
          </div>
          <div className={`panel ${styles.statBlock}`}>
            <SolarIcon name="sun" size={22} />
            <strong>{results.sunHours}</strong>
            <span>hours</span>
            <p>Peak sun hours</p>
          </div>
          <div className={`panel ${styles.statBlock}`}>
            <SolarIcon name="house" size={22} />
            <strong>{results.appliances?.length || 0}</strong>
            <span>items</span>
            <p>Appliances</p>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHead}>
            <h2>Recommended systems</h2>
            <p>Select a system to attach it to the installer quote request.</p>
          </div>
          <div className={styles.systemCards}>
            {results.systems.map((system) => {
              const tone = systemTone[system.type] || systemTone.hybrid;
              const selected = selectedSystem?.type === system.type;
              return (
                <button
                  key={system.type}
                  type="button"
                  className={`${styles.systemCard} ${selected ? styles.systemCardSelected : ''}`}
                  data-tone={tone.tone}
                  onClick={() => setSelectedSystem(system)}
                >
                  <div className={styles.systemKicker}>
                    <SolarIcon name={system.type === 'offgrid' ? 'success' : 'activity'} size={15} />
                    {tone.label}
                  </div>
                  <h3>{system.label}</h3>
                  <p>{system.description}</p>
                  <div className={styles.systemSpecs}>
                    <div>
                      <SolarIcon name="solarPanel" size={17} />
                      <span>Solar panels</span>
                      <strong>{system.panelCount} x {system.panelWatt} W</strong>
                    </div>
                    <div>
                      <SolarIcon name="battery" size={17} />
                      <span>Batteries</span>
                      <strong>{system.batteryCount} x {system.batterySpec}</strong>
                    </div>
                    <div>
                      <SolarIcon name="zap" size={17} />
                      <span>Inverter</span>
                      <strong>{system.inverterKVA} kVA</strong>
                    </div>
                    <div>
                      <SolarIcon name="panel" size={17} />
                      <span>Controller</span>
                      <strong>{system.chargeController} A</strong>
                    </div>
                  </div>
                  <div className={styles.systemTotal}>
                    <span>Total panel power</span>
                    <strong>{(system.totalPanelPower / 1000).toFixed(1)} kW</strong>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHead}>
            <h2>Side-by-side comparison</h2>
            <p>Compare the component requirements before talking to an installer.</p>
          </div>
          <div className={`panel ${styles.tablePanel}`}>
            <div className={styles.comparisonTable}>
              <div className={styles.tableHeader}>
                <span>Spec</span>
                {results.systems.map((system) => (
                  <strong key={system.type}>{system.label}</strong>
                ))}
              </div>
              {comparisonRows.map((row) => (
                <div className={styles.tableRow} key={row.label}>
                  <span>{row.label}</span>
                  {results.systems.map((system) => (
                    <strong key={system.type}>{formatValue(system, row)}</strong>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHead}>
            <h2>Appliance breakdown</h2>
            <p>Trace the estimate back to the loads you entered.</p>
          </div>
          <div className={`panel ${styles.tablePanel}`}>
            <div className={styles.breakdownTable}>
              <div className={styles.breakdownHeader}>
                <span>Appliance</span>
                <span>Wattage</span>
                <span>Hours/day</span>
                <span>Qty</span>
                <span>Energy</span>
              </div>
              {results.appliances.map((appliance, index) => (
                <div className={styles.breakdownRow} key={`${appliance.name}-${index}`}>
                  <strong>{appliance.name}</strong>
                  <span>{appliance.watt} W</span>
                  <span>{appliance.hours} h</span>
                  <span>x{appliance.qty}</span>
                  <strong>{appliance.energy} kWh</strong>
                </div>
              ))}
              <div className={styles.breakdownTotal}>
                <strong>Total</strong>
                <span />
                <span />
                <span />
                <strong>{results.dailyEnergy} kWh</strong>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.leadSection}>
          <div className={styles.sectionHead}>
            <h2>Connect with an installer</h2>
            <p>
              Send the selected design and contact details so an installer can start with
              the sizing context.
            </p>
          </div>
          <div className={`panel ${styles.leadPanel}`}>
            {leadSubmitted ? (
              <div className={styles.leadSuccess}>
                <SolarIcon name="success" size={42} />
                <h3>Request submitted</h3>
                <p>{leadSuccessMessage || 'A certified solar installer can now follow up with your selected design.'}</p>
                <Link href="/calculator" className="btn btn--secondary">
                  Start a new calculation
                </Link>
              </div>
            ) : (
              <form className={styles.leadForm} onSubmit={handleLeadSubmit}>
                <label className={styles.honeypot} aria-hidden="true">
                  Company
                  <input
                    type="text"
                    tabIndex="-1"
                    autoComplete="off"
                    value={leadForm.company}
                    onChange={(event) => setLeadForm((prev) => ({ ...prev, company: event.target.value }))}
                  />
                </label>
                <div className="form-row">
                  <label className="form-group">
                    <span className="form-label">
                      Full name <span className="required-mark">Required</span>
                    </span>
                    <input
                      type="text"
                      className="form-input"
                      autoComplete="name"
                      placeholder="Your name"
                      value={leadForm.name}
                      onChange={(event) => setLeadForm((prev) => ({ ...prev, name: event.target.value }))}
                    />
                  </label>
                  <label className="form-group">
                    <span className="form-label">
                      Phone number <span className="required-mark">Required</span>
                    </span>
                    <div className={styles.phoneRow}>
                      <select
                        className="form-select"
                        value={leadForm.countryCode}
                        onChange={(event) => setLeadForm((prev) => ({ ...prev, countryCode: event.target.value }))}
                        aria-label="Country code"
                      >
                        {countryCodes.map((code) => (
                          <option key={code.value} value={code.value}>{code.label}</option>
                        ))}
                      </select>
                      <input
                        type="tel"
                        className="form-input"
                        autoComplete="tel"
                        placeholder="801 234 5678"
                        value={leadForm.phone}
                        onChange={(event) => setLeadForm((prev) => ({ ...prev, phone: event.target.value }))}
                      />
                    </div>
                  </label>
                </div>
                <label className="form-group">
                  <span className="form-label">Email</span>
                  <input
                    type="email"
                    className="form-input"
                    autoComplete="email"
                    placeholder="you@example.com"
                    value={leadForm.email}
                    onChange={(event) => setLeadForm((prev) => ({ ...prev, email: event.target.value }))}
                  />
                </label>
                <label className="form-group">
                  <span className="form-label">Project notes</span>
                  <textarea
                    className="form-input"
                    rows="4"
                    placeholder="Timeline, budget, roof constraints, or backup needs"
                    value={leadForm.message}
                    onChange={(event) => setLeadForm((prev) => ({ ...prev, message: event.target.value }))}
                  />
                </label>
                {error && (
                  <div className="error-box">
                    <SolarIcon name="error" size={18} />
                    <span>{error}</span>
                  </div>
                )}
                <button className="btn btn--primary btn--lg" type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <span className="spinner" />
                      Submitting
                    </>
                  ) : (
                    <>
                      Request installer quote
                      <SolarIcon name="send" size={16} />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </section>

        <div className={styles.actions}>
          <Link href="/calculator" className="btn btn--secondary btn--lg">
            <SolarIcon name="arrowLeft" size={16} />
            Recalculate
          </Link>
          <button className="btn btn--secondary btn--lg" type="button" onClick={() => window.print()}>
            <SolarIcon name="printer" size={16} />
            Print results
          </button>
        </div>
      </div>
    </div>
  );
}
