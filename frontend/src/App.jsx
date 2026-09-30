import { useEffect, useState } from 'react'
import { ArrowRight, Check, Menu, MessageCircle, Phone, X } from 'lucide-react'
import { categories, firm, processSteps, services, trustItems, values } from './data'

const navigate = (path) => {
  window.history.pushState({}, '', path)
  window.dispatchEvent(new PopStateEvent('popstate'))
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function SectionHeading({ eyebrow, title, copy, align = 'left' }) {
  return <div className={`section-heading ${align}`}>
    <span className="eyebrow">{eyebrow}</span>
    <h2>{title}</h2>
    {copy && <p>{copy}</p>}
  </div>
}

function Navbar() {
  const [open, setOpen] = useState(false)
  const links = [['Home', '/'], ['Services', '/services'], ['About Us', '/about'], ['Contact', '/contact']]
  return <header className="site-header">
    <div className="container nav-wrap">
      <button className="brand" onClick={() => navigate('/')} aria-label="Go to homepage">
        <span className="brand-mark">V</span><span><strong>VFINCON</strong><small>Professional Services</small></span>
      </button>
      <button className="menu-toggle" onClick={() => setOpen(!open)} aria-label={open ? 'Close menu' : 'Open menu'}>{open ? <X size={21} /> : <Menu size={21} />}</button>
      <nav className={open ? 'main-nav open' : 'main-nav'} aria-label="Main navigation">
        {links.map(([label, path]) => <button key={path} className={window.location.pathname === path ? 'active' : ''} onClick={() => { navigate(path); setOpen(false) }}>{label}</button>)}
        <button className="nav-cta" onClick={() => { navigate('/contact'); setOpen(false) }}>Book a Consultation <ArrowRight size={15} /></button>
      </nav>
    </div>
  </header>
}

function Footer() {
  return <footer className="site-footer"><div className="container footer-grid">
    <div><button className="brand footer-brand" onClick={() => navigate('/')}><span className="brand-mark">V</span><span><strong>VFINCON</strong><small>Professional Services</small></span></button><p className="footer-intro">{firm.descriptor}</p></div>
    <div><h3>Quick Links</h3>{[['Home', '/'], ['Services', '/services'], ['About Us', '/about'], ['Contact', '/contact']].map(([label, path]) => <button className="footer-link" key={path} onClick={() => navigate(path)}>{label}</button>)}</div>
    <div><h3>Services</h3>{['Accounting', 'Taxation', 'Audit', 'Registrations', 'Compliance'].map(item => <button className="footer-link" key={item} onClick={() => navigate('/services')}>{item}</button>)}</div>
    <div><h3>Contact</h3><a href={`tel:${firm.phone}`}>{firm.phone}</a><a href={`mailto:${firm.email}`}>{firm.email}</a><span>{firm.address}</span></div>
  </div><div className="container footer-bottom"><span>© 2026 {firm.name}. All rights reserved.</span><span><button>Privacy Policy</button><button>Terms & Conditions</button></span></div></footer>
}

function Hero() {
  return <section className="hero"><div className="container hero-grid"><div className="hero-copy"><span className="eyebrow">A steady partner for your business</span><h1>Professional Accounting, Tax & <em>Corporate Compliance</em> Services</h1><p>Helping businesses stay compliant, organized and financially prepared with reliable accounting, taxation, audit and corporate services.</p><div className="hero-actions"><button className="button primary" onClick={() => navigate('/contact')}>Book a Consultation <ArrowRight size={17} /></button><button className="button secondary" onClick={() => navigate('/services')}>Explore Services</button></div><div className="hero-note"><span className="note-dot"></span>Serving Indian businesses with clarity and care</div></div><HeroVisual /></div></section>
}

function HeroVisual() {
  return <div className="hero-visual" aria-label="Illustration of an organized financial report"><div className="visual-rule"></div><div className="report-sheet"><div className="sheet-top"><span className="sheet-logo">V</span><span><i></i><i></i></span><span className="sheet-status">FY 2026</span></div><div className="sheet-heading"><span></span><span></span></div><div className="sheet-metric"><div><small>Net position</small><strong>₹ 8,42,600</strong></div><div className="metric-up">+12.8%</div></div><div className="bars"><span style={{ height: '35%' }}></span><span style={{ height: '54%' }}></span><span style={{ height: '46%' }}></span><span style={{ height: '72%' }}></span><span style={{ height: '66%' }}></span><span style={{ height: '88%' }}></span><span style={{ height: '79%' }}></span></div><div className="sheet-lines"><i></i><i></i><i></i></div></div><div className="seal"><Check size={21} /><span>IN ORDER</span></div><div className="visual-caption"><span>Business<br /><strong>in good hands.</strong></span><ArrowRight size={17} /></div></div>
}

function TrustBar() { return <section className="trust-bar"><div className="container trust-grid">{trustItems.map(([label, Icon]) => <div className="trust-item" key={label}><Icon size={19} /><span>{label}</span></div>)}</div></section> }

function ServiceCard({ service, detailed = false }) { const Icon = service.icon; return <article className={`service-card ${detailed ? 'detailed' : ''}`}><div className="card-icon"><Icon size={22} /></div><h3>{service.title}</h3><p>{service.description}</p>{detailed && <ul>{service.items.map(item => <li key={item}><Check size={15} />{item}</li>)}</ul>}<button className="text-link" onClick={() => navigate('/contact')}>{detailed ? 'Get Assistance' : 'Learn More'} <ArrowRight size={15} /></button></article> }

function CTASection() { return <section className="cta-section"><div className="container cta-inner"><div><span className="eyebrow light">Let’s make the next step simple</span><h2>Need help with your business compliance?</h2><p>Talk to our team about your accounting, tax or corporate requirements.</p></div><button className="button light-button" onClick={() => navigate('/contact')}>Book a Consultation <ArrowRight size={17} /></button></div></section> }

function Home() { return <><main><Hero /><TrustBar /><section className="section"><div className="container"><SectionHeading eyebrow="Our services" title="Practical support for every stage of business" copy="From keeping your books in order to completing recurring filings, we bring structure to the work behind your business." /><div className="service-grid">{services.map(service => <ServiceCard key={service.slug} service={service} />)}</div></div></section><section className="section soft-section"><div className="container split-section"><div><SectionHeading eyebrow="Why choose us" title="Clear advice. Careful execution." copy="Professional services should feel understandable and dependable. Our approach is built around the details that help business owners move forward with confidence." /><div className="value-list">{values.slice(0, 4).map(([title, copy]) => <div className="value-item" key={title}><span className="check-circle"><Check size={15} /></span><div><h3>{title}</h3><p>{copy}</p></div></div>)}</div></div><div className="quote-panel"><span className="quote-mark">“</span><p>Good compliance is quiet, consistent and easy to verify.</p><span className="quote-rule"></span><small>A considered approach to professional services</small></div></div></section><section className="section process-section"><div className="container"><SectionHeading align="center" eyebrow="How we work" title="A straightforward process" copy="You always know what is happening, what we need and what comes next." /><div className="process-grid">{processSteps.map(([number, title, copy]) => <div className="process-step" key={number}><span>{number}</span><h3>{title}</h3><p>{copy}</p></div>)}</div></div></section><CTASection /></main></> }

function PageIntro({ eyebrow, title, copy }) { return <section className="page-intro"><div className="container"><span className="eyebrow">{eyebrow}</span><h1>{title}</h1><p>{copy}</p></div></section> }

function ServicesPage() { return <main><PageIntro eyebrow="What we can help with" title="Services built around your responsibilities" copy="Reliable support for the accounting, tax, registration and compliance work that keeps your business moving." /><section className="section services-page"><div className="container">{categories.map(([label, slug]) => { const service = services.find(item => item.slug === slug); return <div className="service-category" key={slug}><div className="category-heading"><div><span className="eyebrow">{String(categories.findIndex(item => item[1] === slug) + 1).padStart(2, '0')}</span><h2>{label}</h2></div><p>{service.description}</p></div><div className="service-detail-grid">{service.items.map(item => <div className="detail-item" key={item}><span><Check size={16} /></span><div><h3>{item}</h3><p>Get practical guidance and assistance tailored to your business requirement.</p></div><button onClick={() => navigate('/contact')} aria-label={`Get assistance with ${item}`}><ArrowRight size={17} /></button></div>)}</div></div> })}</div></section><CTASection /></main> }

function AboutPage() { return <main><PageIntro eyebrow="About the firm" title="Professional support, with a personal point of view" copy="[FIRM NAME] helps businesses stay organized and compliant through dependable accounting, tax and corporate services." /><section className="section"><div className="container about-grid"><div><SectionHeading eyebrow="Our approach" title="Make complex work easier to manage" copy="We believe professional advice should be clear, timely and grounded in the realities of running a business. We take time to understand the requirement, explain the path ahead and keep the process organized from start to finish." /><p className="about-copy">Whether you are setting up a new venture or managing recurring compliance, our role is to give you a steady, responsive partner for the work that matters.</p></div><div className="profile-panel"><div className="profile-initial">[F]</div><span className="eyebrow">The firm</span><h3>[FIRM NAME]</h3><p>Led by [FOUNDER / PROFESSIONAL NAME], [QUALIFICATION].</p><dl><div><dt>Experience</dt><dd>[YEARS OF EXPERIENCE]</dd></div><div><dt>Location</dt><dd>[OFFICE LOCATION]</dd></div></dl></div></div></section><section className="section soft-section"><div className="container"><SectionHeading eyebrow="Our values" title="The standards we bring to the work" /><div className="values-grid">{values.map(([title, copy], index) => <div className="value-card" key={title}><span>0{index + 1}</span><h3>{title}</h3><p>{copy}</p></div>)}</div></div></section><CTASection /></main> }

function ContactForm() { const [submitted, setSubmitted] = useState(false); return <form className="contact-form" onSubmit={event => { event.preventDefault(); setSubmitted(true) }}>{submitted && <div className="form-success"><Check size={17} /> Thank you. We will be in touch shortly.</div>}<div className="form-row"><label>Name<input required type="text" placeholder="Your full name" /></label><label>Phone number<input required type="tel" placeholder="+91 00000 00000" /></label></div><div className="form-row"><label>Email<input required type="email" placeholder="you@company.com" /></label><label>Business name<input type="text" placeholder="Your business name" /></label></div><label>Service required<select defaultValue=""><option value="" disabled>Select a service</option>{services.map(service => <option key={service.slug}>{service.title}</option>)}</select></label><label>Message<textarea rows="5" placeholder="Tell us briefly how we can help"></textarea></label><button className="button primary" type="submit">Submit Enquiry <ArrowRight size={17} /></button></form> }

function ContactPage() { return <main><PageIntro eyebrow="Get in touch" title="Let’s discuss what your business needs" copy="Share a few details and our team will get back to you with the right next step." /><section className="section contact-section"><div className="container contact-grid"><div className="contact-details"><SectionHeading eyebrow="Contact details" title="A conversation is a good place to start." copy="Use the form to send an enquiry, or reach us directly through the details below." /><div className="contact-list"><a href={`tel:${firm.phone}`}><span><Phone size={18} /></span><div><small>Phone</small><strong>{firm.phone}</strong></div></a><a href={`mailto:${firm.email}`}><span>@</span><div><small>Email</small><strong>{firm.email}</strong></div></a><div><span>⌖</span><div><small>Office</small><strong>{firm.address}</strong></div></div><div><span>◷</span><div><small>Business hours</small><strong>{firm.hours}</strong></div></div></div><a className="whatsapp" href="https://wa.me/910000000000" target="_blank" rel="noreferrer"><MessageCircle size={18} /> Chat on WhatsApp</a></div><ContactForm /></div></section></main> }

function App() {
  const [, refresh] = useState(0)
  useEffect(() => {
    const handler = () => refresh(value => value + 1)
    window.addEventListener('popstate', handler)
    return () => window.removeEventListener('popstate', handler)
  }, [])
  const path = window.location.pathname
  const page = path === '/services' ? <ServicesPage /> : path === '/about' ? <AboutPage /> : path === '/contact' ? <ContactPage /> : <Home />
  return <><Navbar />{page}<Footer /></>
}

export default App
