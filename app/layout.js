import './globals.css';

export const metadata = {
  title: 'SolarWise — Smart Solar System Sizing Platform',
  description: 'Calculate your solar system size, compare Off-Grid, Hybrid, and Budget designs, and connect with installers. The smartest way to go solar.',
  keywords: 'solar calculator, solar system sizing, solar panels, battery sizing, inverter, off-grid, hybrid solar, solar installer',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {/* ── Navbar ── */}
        <nav className="navbar" id="main-nav">
          <div className="navbar__inner">
            <a href="/" className="navbar__logo" id="logo-link">
              <span className="navbar__logo-icon">☀️</span>
              SolarWise
            </a>
            <ul className="navbar__links" id="nav-links">
              <li><a href="/" className="navbar__link" id="nav-home">Home</a></li>
              <li><a href="/calculator" className="navbar__link" id="nav-calculator">Calculator</a></li>
              <li><a href="/calculator" className="navbar__cta" id="nav-cta">Get Started</a></li>
            </ul>
            <button className="navbar__toggle" id="nav-toggle" aria-label="Toggle navigation" onClick={null}>
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </nav>

        {/* ── Main Content ── */}
        <main>{children}</main>

        {/* ── Footer ── */}
        <footer className="footer" id="main-footer">
          <div className="container">
            <div className="footer__inner">
              <div className="footer__brand">
                <h3>☀️ SolarWise</h3>
                <p>The smartest way to design your solar power system. Calculate, compare, and connect with certified installers.</p>
              </div>
              <div className="footer__column">
                <h4>Product</h4>
                <ul>
                  <li><a href="/calculator">Calculator</a></li>
                  <li><a href="#">How It Works</a></li>
                  <li><a href="#">Pricing</a></li>
                </ul>
              </div>
              <div className="footer__column">
                <h4>Company</h4>
                <ul>
                  <li><a href="#">About</a></li>
                  <li><a href="#">Contact</a></li>
                  <li><a href="#">Privacy</a></li>
                </ul>
              </div>
            </div>
            <div className="footer__bottom">
              <p>© 2026 SolarWise. Powering smart solar decisions.</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
