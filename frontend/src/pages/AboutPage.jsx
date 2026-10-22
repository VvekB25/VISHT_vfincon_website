import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { brand } from '../config/brand'

export default function AboutPage() {
  return <main>
    <section className="page-intro"><div className="container"><span className="eyebrow">About us</span><h1>{brand.fullName}</h1><p>{brand.fullName} (VFINCON) provides business registration, tax, licensing, accounting and compliance services.</p></div></section>
    <section className="section"><div className="container about-grid">
      <div className="about-copy-block"><span className="eyebrow">Our work</span><h2>Business and compliance support</h2><p>We assist businesses with entity and tax registrations, licenses, certifications, accounting and audit support, recurring filings, and digital signature certificates.</p><p>Our service categories describe the areas of support available. Contact us to discuss the specific requirement and next steps.</p><Link className="button primary" to="/services">View services <ArrowRight size={16} /></Link></div>
      <div className="profile-panel"><div className="profile-logo-wrap"><img src={brand.logoPath} alt={brand.fullName} className="profile-logo-img" /></div><span className="eyebrow">Company details</span><h3>{brand.fullName}</h3><p>{brand.descriptor}</p><dl><div><dt>Brand</dt><dd>{brand.shortName}</dd></div><div><dt>Office</dt><dd>{brand.address}</dd></div><div><dt>Phone</dt><dd><a href={brand.phoneLink}>{brand.phone}</a></dd></div><div><dt>Email</dt><dd><a href={brand.emailLink}>{brand.email}</a></dd></div></dl></div>
    </div></section>
  </main>
}
