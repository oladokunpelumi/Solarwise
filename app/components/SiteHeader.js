'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import SolarIcon from './SolarIcon';

export default function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/#how-it-works', label: 'How it works' },
    { href: '/calculator', label: 'Calculator' },
  ];

  return (
    <header className="site-header">
      <nav className="site-nav" aria-label="Main navigation">
        <Link href="/" className="brand" onClick={() => setOpen(false)}>
          <span className="brand__mark">
            <SolarIcon name="sun" size={22} />
          </span>
          <span>SolarWise</span>
        </Link>

        <button
          className="nav-toggle"
          type="button"
          aria-label="Toggle navigation"
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <SolarIcon name="x" size={20} /> : <SolarIcon name="menu" size={20} />}
        </button>

        <div className={`nav-links ${open ? 'nav-links--open' : ''}`}>
          {navItems.map((item) => {
            const pathPart = item.href.split('#')[0];
            const active = item.href.includes('#')
              ? pathname === pathPart
              : item.href === '/'
                ? pathname === '/'
                : pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-link ${active ? 'nav-link--active' : ''}`}
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            );
          })}
          <Link href="/calculator" className="nav-cta" onClick={() => setOpen(false)}>
            Start calculating
          </Link>
        </div>
      </nav>
    </header>
  );
}
