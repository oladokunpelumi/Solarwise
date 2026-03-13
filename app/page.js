import styles from './home.module.css';

export default function HomePage() {
  return (
    <div className="page">
      {/* ── Hero Section ── */}
      <section className={styles.hero} id="hero-section">
        <div className="container">
          <div className={styles.heroContent}>
            <div className={styles.heroBadge}>
              <span className="badge badge--gold">⚡ Smart Solar Sizing</span>
            </div>
            <h1 className={styles.heroTitle}>
              Design Your Perfect<br />
              <span className={styles.heroHighlight}>Solar System</span>
            </h1>
            <p className={styles.heroSubtitle}>
              Input your appliances, get instant solar system designs tailored to your needs.
              Compare Off-Grid, Hybrid, and Budget options — all in seconds.
            </p>
            <div className={styles.heroCtas}>
              <a href="/calculator" className="btn btn--primary btn--lg" id="hero-cta-primary">
                Start Calculating
                <span>→</span>
              </a>
              <a href="#how-it-works" className="btn btn--secondary btn--lg" id="hero-cta-secondary">
                How It Works
              </a>
            </div>
            <div className={styles.heroStats}>
              <div className={styles.heroStat}>
                <span className={styles.heroStatValue}>55+</span>
                <span className={styles.heroStatLabel}>Cities Covered</span>
              </div>
              <div className={styles.heroStatDivider}></div>
              <div className={styles.heroStat}>
                <span className={styles.heroStatValue}>30+</span>
                <span className={styles.heroStatLabel}>Appliance Presets</span>
              </div>
              <div className={styles.heroStatDivider}></div>
              <div className={styles.heroStat}>
                <span className={styles.heroStatValue}>3</span>
                <span className={styles.heroStatLabel}>System Designs</span>
              </div>
            </div>
          </div>
          <div className={styles.heroVisual}>
            <div className={styles.solarOrb}>
              <div className={styles.solarOrbInner}>☀️</div>
              <div className={styles.solarRing}></div>
              <div className={styles.solarRing2}></div>
            </div>
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className={styles.howItWorks} id="how-it-works">
        <div className="container">
          <div className="section-header">
            <span className="section-header__tag">How It Works</span>
            <h2 className="section-header__title">Three Simple Steps</h2>
            <p className="section-header__subtitle">
              From appliances to solar design in under a minute
            </p>
          </div>
          <div className={styles.steps}>
            <div className={`card ${styles.step} animate-in animate-in--delay-1`} id="step-1">
              <div className={styles.stepNumber}>01</div>
              <div className={styles.stepIcon}>🔌</div>
              <h3 className={styles.stepTitle}>Add Your Appliances</h3>
              <p className={styles.stepDesc}>
                Select from 30+ preset appliances or add custom devices. Set quantity and daily usage hours.
              </p>
            </div>
            <div className={`card ${styles.step} animate-in animate-in--delay-2`} id="step-2">
              <div className={styles.stepNumber}>02</div>
              <div className={styles.stepIcon}>📍</div>
              <h3 className={styles.stepTitle}>Set Your Location</h3>
              <p className={styles.stepDesc}>
                We detect your location automatically and look up solar irradiation data for accurate sizing.
              </p>
            </div>
            <div className={`card ${styles.step} animate-in animate-in--delay-3`} id="step-3">
              <div className={styles.stepNumber}>03</div>
              <div className={styles.stepIcon}>⚡</div>
              <h3 className={styles.stepTitle}>Get Your Design</h3>
              <p className={styles.stepDesc}>
                Receive three custom system designs: Off-Grid, Hybrid, and Budget — with full component specs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className={styles.features} id="features-section">
        <div className="container">
          <div className="section-header">
            <span className="section-header__tag">Features</span>
            <h2 className="section-header__title">Everything You Need</h2>
            <p className="section-header__subtitle">
              A comprehensive solar sizing tool built for homeowners, businesses, and installers
            </p>
          </div>
          <div className={styles.featureGrid}>
            <div className={`card card--glass ${styles.featureCard}`} id="feature-1">
              <div className={styles.featureIcon}>🧮</div>
              <h3>Precise Calculations</h3>
              <p>8-step engineering calculation covering panels, batteries, inverters, and charge controllers.</p>
            </div>
            <div className={`card card--glass ${styles.featureCard}`} id="feature-2">
              <div className={styles.featureIcon}>🌍</div>
              <h3>Global Coverage</h3>
              <p>Solar irradiation data for 55+ cities across Africa, Asia, Americas, Europe, and the Middle East.</p>
            </div>
            <div className={`card card--glass ${styles.featureCard}`} id="feature-3">
              <div className={styles.featureIcon}>📊</div>
              <h3>System Comparison</h3>
              <p>Compare Off-Grid, Hybrid, and Budget designs side-by-side to find your best fit.</p>
            </div>
            <div className={`card card--glass ${styles.featureCard}`} id="feature-4">
              <div className={styles.featureIcon}>🔧</div>
              <h3>Installer Connect</h3>
              <p>Submit your requirements and connect with certified solar installers in your area.</p>
            </div>
            <div className={`card card--glass ${styles.featureCard}`} id="feature-5">
              <div className={styles.featureIcon}>📱</div>
              <h3>Mobile Friendly</h3>
              <p>Fully responsive design that works beautifully on phones, tablets, and desktops.</p>
            </div>
            <div className={`card card--glass ${styles.featureCard}`} id="feature-6">
              <div className={styles.featureIcon}>⚡</div>
              <h3>Instant Results</h3>
              <p>Get complete solar system specifications in seconds — no waiting, no sign-up required.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA Section ── */}
      <section className={styles.ctaSection} id="cta-section">
        <div className="container">
          <div className={`card card--accent ${styles.ctaCard}`}>
            <h2 className={styles.ctaTitle}>Ready to Go Solar?</h2>
            <p className={styles.ctaSubtitle}>
              Join thousands who have used SolarWise to design their perfect solar system.
            </p>
            <a href="/calculator" className="btn btn--primary btn--lg" id="cta-button">
              Start Your Free Calculation →
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
