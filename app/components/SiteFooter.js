import Link from 'next/link';
import SolarIcon from './SolarIcon';

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <Link href="/" className="brand">
            <span className="brand__mark">
              <SolarIcon name="sun" size={22} />
            </span>
            <span>SolarWise</span>
          </Link>
          <p>
            Practical solar sizing for homes, small businesses, and installers. Calculate,
            compare, and move toward a quote with clearer numbers.
          </p>
        </div>
        <div className="footer-col">
          <h2>Product</h2>
          <Link href="/calculator">Calculator</Link>
          <Link href="/#how-it-works">How it works</Link>
          <Link href="/#features">Features</Link>
        </div>
        <div className="footer-col">
          <h2>Outputs</h2>
          <Link href="/results">Results</Link>
          <Link href="/calculator">Installer quote</Link>
          <Link href="/calculator">System sizing</Link>
        </div>
        <div className="footer-col">
          <h2>Coverage</h2>
          <span>Lagos</span>
          <span>Accra</span>
          <span>Nairobi</span>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>(c) 2026 SolarWise</span>
        <span>Built for practical solar decisions.</span>
      </div>
    </footer>
  );
}
