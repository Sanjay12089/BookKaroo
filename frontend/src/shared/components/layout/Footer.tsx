import { Link } from 'react-router-dom';
import { ROUTES } from '@/shared/constants';
import { Logo } from '@/design/Logo';

const NAV_COLS = [
  {
    heading: 'Explore',
    links: [['Movies', ROUTES.MOVIES], ['Events', ROUTES.EVENTS], ['Sports', ROUTES.SPORTS], ['Plays', ROUTES.PLAYS], ['Activities', ROUTES.ACTIVITIES]],
  },
  {
    heading: 'Company',
    links: [['About Us', '/about'], ['Careers', '/careers'], ['List Your Show', '/list-your-show'], ['Blog', '/blog']],
  },
  {
    heading: 'Support',
    links: [['Help Centre', ROUTES.HELP], ['Refund Policy', '/terms'], ['Cancellation', '/terms'], ['Contact Us', '/about']],
  },
  {
    heading: 'Legal',
    links: [['Terms & Conditions', '/terms'], ['Privacy Policy', '/privacy'], ['FAQ', '/faq'], ['Sitemap', '/sitemap']],
  },
] as const;

export function Footer() {
  return (
    <footer className="bg-nav border-t border-nav-border pt-14 pb-8 mt-20">
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          <div className="col-span-2 lg:col-span-1">
            <Logo size={32} onDark variant="full-horizontal" />
            <p className="mt-3 text-sm text-nav-muted leading-relaxed font-sans">
              Book the moment. Karo it now.
            </p>
            <p className="mt-2 text-xs text-nav-muted font-sans">
              India's premier entertainment booking platform.
            </p>
          </div>
          {NAV_COLS.map((col) => (
            <div key={col.heading}>
              <h4 className="text-[11px] font-semibold text-nav-muted tracking-widest uppercase mb-4 font-sans">
                {col.heading}
              </h4>
              <ul className="space-y-2.5">
                {col.links.map(([label, href]) => (
                  <li key={label}>
                    <Link
                      to={href}
                      className="text-sm text-nav-muted hover:text-white transition-colors font-sans"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-6 border-t border-nav-border text-xs text-nav-muted font-sans">
          <span>© 2026 BookKaroo Pvt Ltd. All rights reserved.</span>
          <span>GST collected is remitted to the department. GSTIN: 24XXXXX0000X1Z5</span>
        </div>
      </div>
    </footer>
  );
}
