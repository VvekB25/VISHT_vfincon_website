import { Link } from 'react-router-dom'
import { brand } from '../config/brand'

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="footer-brand-col">
          <Link to="/" className="brand footer-brand" aria-label={`${brand.fullName} homepage`}>
            <img
              src={brand.logoPath}
              alt={brand.fullName}
              className="brand-logo-img footer-logo-img"
            />
            <div>
              <strong>{brand.fullName}</strong>
              <small>{brand.shortName} • Professional Advisory</small>
            </div>
          </Link>
          <p className="footer-intro">{brand.descriptor}</p>
        </div>

        <div>
          <h3>Quick Links</h3>
          {[
            ['Home', '/'],
            ['Services', '/services'],
            ['About Us', '/about'],
            ['Notifications', '/notifications'],
            ['Blog & Insights', '/blog'],
            ['Contact', '/contact'],
          ].map(([label, path]) => (
            <Link className="footer-link" key={path} to={path}>
              {label}
            </Link>
          ))}
        </div>

        <div>
          <h3>Practice Areas</h3>
          {[
            ['Business & Entity Registration', '/services'],
            ['Tax Registrations', '/services'],
            ['Licenses & Government Registrations', '/services'],
            ['Accounting & Audit Support', '/services'],
            ['Regulatory Filing & Compliance', '/services'],
          ].map(([item, path]) => (
            <Link className="footer-link" key={item} to={path}>
              {item}
            </Link>
          ))}
        </div>

        <div>
          <h3>Contact</h3>
          <a href={brand.phoneLink} className="footer-contact-link">
            {brand.phone}
          </a>
          <a href={brand.emailLink} className="footer-contact-link">
            {brand.email}
          </a>
          <span className="footer-address">{brand.address}</span>
          <div className="footer-direct-actions">
            <a
              href={brand.whatsappLink}
              target="_blank"
              rel="noreferrer"
              className="footer-wa-link"
            >
              WhatsApp Support
            </a>
            <Link to="/admin/login" className="footer-admin-link">
              Admin Portal
            </Link>
          </div>
        </div>
      </div>

      <div className="container footer-bottom">
        <span>© 2026 {brand.fullName} ({brand.shortName}). All rights reserved.</span>
        <span>
          <span>{brand.address}</span>
        </span>
      </div>
    </footer>
  )
}
