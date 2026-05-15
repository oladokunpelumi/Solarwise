import Link from 'next/link';
import SolarIcon from './components/SolarIcon';
import styles from './home.module.css';

const featureCards = [
  {
    icon: 'success',
    title: 'Eight calculation steps, run for you.',
    body: 'Daily load, peak load, irradiation lookup, derating, panel sizing, battery sizing, inverter sizing, and controller sizing in one flow.',
    className: styles.featureLead,
  },
  {
    icon: 'globe',
    title: 'Solar data for 55+ cities.',
    body: 'Location-specific peak sun hours replace broad continental assumptions.',
  },
  {
    icon: 'zap',
    title: 'Fast enough for first conversations.',
    body: 'No sign-up wall before sizing, comparing, or printing your first estimate.',
  },
  {
    icon: 'chart',
    title: 'Three designs side by side.',
    body: 'Compare full independence, grid-assisted backup, and essential starter systems.',
  },
  {
    icon: 'smartphone',
    title: 'Built for phone-first use.',
    body: 'Panels, inputs, summaries, and actions hold their shape across small screens.',
  },
];

const steps = [
  {
    label: '01 - Inventory',
    title: 'Add your appliances.',
    body: 'Pick from presets or add a custom device, then set quantity and daily usage.',
  },
  {
    label: '02 - Location',
    title: 'Set your city.',
    body: 'Auto-detect or type a city so the sizing engine can use local sun-hour data.',
  },
  {
    label: '03 - Output',
    title: 'Compare designs.',
    body: 'Review panels, batteries, inverter, controller, load, and autonomy in one result set.',
  },
];

export default function HomePage() {
  return (
    <div className="page">
      <section className={styles.hero}>
        <div className={`container ${styles.heroInner}`}>
          <div className={styles.heroCopy}>
            <div className={styles.heroBadge}>
              <span aria-hidden="true" />
              Smart solar sizing
            </div>
            <h1 className={styles.heroTitle}>
              Solar systems,
              <br />
              sized in <em>seconds.</em>
            </h1>
            <p className={styles.heroBody}>
              Input your appliances. Get exact panels, batteries, inverter, and controller
              specs. Compare off-grid, hybrid, and budget designs without waiting for a
              salesperson.
            </p>
            <div className={styles.heroActions}>
              <Link href="/calculator" className="btn btn--primary btn--lg">
                Calculate yours
                <SolarIcon name="arrowRight" size={16} />
              </Link>
              <a href="#how-it-works" className="btn btn--secondary btn--lg">
                See how it works
              </a>
            </div>
          </div>

          <aside className={`panel ${styles.heroPanel}`} aria-label="Example solar sizing output">
            <div className={styles.panelKicker}>Example - 3-bedroom flat, Lagos</div>
            <div className={styles.metricRow}>
              <span>Daily energy</span>
              <strong>
                26.86 <small>kWh</small>
              </strong>
            </div>
            <div className={styles.metricRow}>
              <span>Recommended array</span>
              <strong>
                7.7 <small>kW</small>
              </strong>
            </div>
            <div className={styles.metricRow}>
              <span>Battery autonomy</span>
              <strong>
                1.5 <small>days</small>
              </strong>
            </div>
            <div className={styles.metricRow}>
              <span>Result paths</span>
              <strong>
                3 <small>designs</small>
              </strong>
            </div>
          </aside>
        </div>
      </section>

      <section className={styles.section} id="features">
        <div className="container">
          <div className={styles.sectionHead}>
            <p className={styles.sectionEyebrow}>What is inside</p>
            <h2 className={styles.sectionTitle}>
              Built for engineers.
              <br />
              Designed for <em>first-timers.</em>
            </h2>
            <p className={styles.sectionSub}>
              Every calculation a working solar engineer would run, packaged for someone
              shopping for their first system or qualifying a lead.
            </p>
          </div>

          <div className={styles.bento}>
            {featureCards.map((card) => (
              <article key={card.title} className={`panel ${styles.featureCard} ${card.className || ''}`}>
                <div className={styles.iconCell}>
                  <SolarIcon name={card.icon} size={20} />
                </div>
                <h3>{card.title}</h3>
                <p>{card.body}</p>
                {card.className && (
                  <div className={styles.calcPreview} aria-label="Calculation preview">
                    {[
                      ['01 - Daily load', '26.86 kWh'],
                      ['02 - Peak load', '3.36 kW'],
                      ['03 - Irradiation', '4.5 h/day'],
                      ['04 - Panel array', '14 x 550 W'],
                      ['05 - Battery bank', '20 x 12 V'],
                      ['06 - Inverter', '5 kVA'],
                      ['07 - Controller', '161 A'],
                    ].map(([label, value]) => (
                      <div key={label}>
                        <span>{label}</span>
                        <strong>{value}</strong>
                      </div>
                    ))}
                  </div>
                )}
              </article>
            ))}
            <article className={`panel panel--ink ${styles.installerCard}`}>
              <div className={styles.iconCellDark}>
                <SolarIcon name="user" size={20} />
              </div>
              <div>
                <h3>Connect the finished spec to an installer quote.</h3>
                <p>
                  Capture the selected system type, city, phone number, and project notes so
                  the conversation starts with actual sizing data.
                </p>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className={styles.section} id="how-it-works">
        <div className="container">
          <div className={styles.sectionHead}>
            <p className={styles.sectionEyebrow}>How it works</p>
            <h2 className={styles.sectionTitle}>
              Three steps.
              <br />
              Under a <em>minute.</em>
            </h2>
          </div>
          <div className={styles.steps}>
            {steps.map((step) => (
              <article key={step.label} className={styles.step}>
                <p>{step.label}</p>
                <h3>{step.title}</h3>
                <span>{step.body}</span>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className="container">
          <div className={`panel panel--ink ${styles.statsBand}`}>
            <div>
              <p className={styles.sectionEyebrow}>By the numbers</p>
              <h2 className={styles.sectionTitle}>
                Sized for the way
                <br />
                power is actually used.
              </h2>
            </div>
            <div className={styles.statsGrid}>
              <div>
                <strong>55+</strong>
                <span>Cities with irradiation data</span>
              </div>
              <div>
                <strong>30+</strong>
                <span>Appliance presets</span>
              </div>
              <div>
                <strong>3</strong>
                <span>Comparable system designs</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.ctaSection}>
        <div className="container">
          <h2>Ready to size yours?</h2>
          <p>Open the calculator, add your appliances, and get a complete first-pass design.</p>
          <Link href="/calculator" className="btn btn--secondary btn--lg">
            Open the calculator
            <SolarIcon name="arrowRight" size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}
