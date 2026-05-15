import './globals.css';
import SiteFooter from './components/SiteFooter';
import SiteHeader from './components/SiteHeader';

export const metadata = {
  title: 'SolarWise - Smart Solar System Sizing Platform',
  description: 'Calculate your solar system size, compare Off-Grid, Hybrid, and Budget designs, and connect with installers. The smartest way to go solar.',
  keywords: 'solar calculator, solar system sizing, solar panels, battery sizing, inverter, off-grid, hybrid solar, solar installer',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
