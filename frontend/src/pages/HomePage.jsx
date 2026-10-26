import { ArrowRight, Building2, Check, FileCheck2, Landmark, Phone, ReceiptIndianRupee } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { brand } from '../config/brand'
import ServiceGrid from '../components/ServiceGrid'
import CTASection from '../components/CTASection'
import ComplianceClock from '../components/ComplianceClock'

function SectionHeading({ eyebrow, title, copy, align = 'left' }) {
  return <div className={`section-heading ${align}`}><span className="eyebrow">{eyebrow}</span><h2>{title}</h2>{copy && <p>{copy}</p>}</div>
}

function Hero() {
  const navigate = useNavigate()
  return <section className="hero">
    <div className="container hero-grid">
      <div className="hero-copy">
        <span className="eyebrow">{brand.combinedIntro}</span>
        <h1>Clear support for <em>business, tax</em> and compliance.</h1>
        <p>Practical assistance with registrations, accounting, audit support and recurring filings for businesses .</p>
        <div className="hero-actions">
          <button className="button primary" onClick={() => navigate('/contact')}>Enquire now <ArrowRight size={17} /></button>
          <button className="button secondary" onClick={() => navigate('/services')}>View services</button>
        </div>
        <a className="hero-phone" href={brand.phoneLink}><Phone size={15} /> {brand.phone}</a>
      </div>
      <div className="hero-visual hero-service-visual" aria-hidden="true">
        <div className="hero-visual-card"><img src={brand.logoPath} alt="" /><span>Business support</span><strong>Practical guidance through registrations and compliance.</strong>
          <div className="hero-visual-icons"><Building2 /><ReceiptIndianRupee /><Landmark /><FileCheck2 /></div>
          <div className="hero-visual-note"><Check size={16} /> Clear steps. Direct support.</div>
        </div>
      </div>
    </div>
  </section>
}

export default function HomePage() {
  return <main>
    <Hero />
    <ComplianceClock />
    <section className="section home-services-section"><div className="container">
      <SectionHeading eyebrow="Services" title="Support across seven service areas" copy="Find the registrations, filings and professional support relevant to your business." />
      <ServiceGrid preview />
      <div className="services-all-link"><Link className="button secondary" to="/services">See all services <ArrowRight size={16} /></Link></div>
    </div></section>
    <section className="section soft-section home-about-section"><div className="container home-about-grid">
      <div><SectionHeading eyebrow="About us" title="Vidmahi Fin Consultants" copy="We support businesses with accounting, tax registrations, government licenses and regulatory filing requirements." /><Link className="text-link" to="/about">About the firm <ArrowRight size={15} /></Link></div>
      <div className="home-contact-card"><span className="eyebrow">Get in touch</span><h3>Speak with our team about your requirement.</h3><a href={brand.phoneLink}>{brand.phone}</a><a href={brand.emailLink}>{brand.email}</a><Link to="/contact">Contact details and enquiry form <ArrowRight size={15} /></Link></div>
    </div></section>
    <CTASection />
  </main>
}
