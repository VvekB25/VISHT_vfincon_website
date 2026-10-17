import { useNavigate } from 'react-router-dom'
import { ArrowRight, Check } from 'lucide-react'
import { processSteps, services, trustItems, values } from '../data'

function SectionHeading({ eyebrow, title, copy, align = 'left' }) {
  return (
    <div className={`section-heading ${align}`}>
      <span className="eyebrow">{eyebrow}</span>
      <h2>{title}</h2>
      {copy && <p>{copy}</p>}
    </div>
  )
}

import { brand } from '../config/brand'

function HeroVisual() {
  return (
    <div className="hero-visual" aria-label="Illustration of an organized financial report">
      <div className="visual-rule"></div>
      <div className="report-sheet">
        <div className="sheet-top">
          <span className="sheet-logo-wrap">
            <img src={brand.faviconPath} alt="Vidmahi Fin Consultants" className="sheet-logo-img" />
          </span>
          <span>
            <i></i>
            <i></i>
          </span>
          <span className="sheet-status">FY 2026</span>
        </div>
        <div className="sheet-heading">
          <span></span>
          <span></span>
        </div>
        <div className="sheet-metric">
          <div>
            <small>Net position</small>
            <strong>₹ 8,42,600</strong>
          </div>
          <div className="metric-up">+12.8%</div>
        </div>
        <div className="bars">
          <span style={{ height: '35%' }}></span>
          <span style={{ height: '54%' }}></span>
          <span style={{ height: '46%' }}></span>
          <span style={{ height: '72%' }}></span>
          <span style={{ height: '66%' }}></span>
          <span style={{ height: '88%' }}></span>
          <span style={{ height: '79%' }}></span>
        </div>
        <div className="sheet-lines">
          <i></i>
          <i></i>
          <i></i>
        </div>
      </div>
      <div className="seal">
        <Check size={21} />
        <span>IN ORDER</span>
      </div>
      <div className="visual-caption">
        <span>
          Business
          <br />
          <strong>in good hands.</strong>
        </span>
        <ArrowRight size={17} />
      </div>
    </div>
  )
}

function Hero() {
  const navigate = useNavigate()
  return (
    <section className="hero">
      <div className="container hero-grid">
        <div className="hero-copy">
          <span className="eyebrow">{brand.combinedIntro}</span>
          <h1>
            Professional Accounting, Tax & <em>Corporate Compliance</em> Services
          </h1>
          <p>
            Helping enterprises stay compliant, organized and financially prepared with reliable
            accounting, taxation, audit and corporate governance services in Bengaluru and nationwide.
          </p>
          <div className="hero-actions">
            <button className="button primary" onClick={() => navigate('/contact')}>
              Book a Consultation <ArrowRight size={17} />
            </button>
            <button className="button secondary" onClick={() => navigate('/services')}>
              Explore Services
            </button>
          </div>
          <div className="hero-note">
            <span className="note-dot"></span>Serving businesses with clarity, precision and care
          </div>
        </div>
        <HeroVisual />
      </div>
    </section>
  )
}

function TrustBar() {
  return (
    <section className="trust-bar">
      <div className="container trust-grid">
        {trustItems.map(([label, Icon]) => (
          <div className="trust-item" key={label}>
            <Icon size={19} />
            <span>{label}</span>
          </div>
        ))}
      </div>
    </section>
  )
}

function ServiceCard({ service, detailed = false }) {
  const navigate = useNavigate()
  const Icon = service.icon
  return (
    <article className={`service-card ${detailed ? 'detailed' : ''}`}>
      <div className="card-icon">
        <Icon size={22} />
      </div>
      <h3>{service.title}</h3>
      <p>{service.description}</p>
      {detailed && (
        <ul>
          {service.items.map((item) => (
            <li key={item}>
              <Check size={15} />
              {item}
            </li>
          ))}
        </ul>
      )}
      <button className="text-link" onClick={() => navigate('/contact')}>
        {detailed ? 'Get Assistance' : 'Learn More'} <ArrowRight size={15} />
      </button>
    </article>
  )
}

export function CTASection() {
  const navigate = useNavigate()
  return (
    <section className="cta-section">
      <div className="container cta-inner">
        <div>
          <span className="eyebrow light">Let’s make the next step simple</span>
          <h2>Need help with your business compliance?</h2>
          <p>Talk to our team about your accounting, tax or corporate requirements.</p>
        </div>
        <button className="button light-button" onClick={() => navigate('/contact')}>
          Book a Consultation <ArrowRight size={17} />
        </button>
      </div>
    </section>
  )
}

export default function HomePage() {
  return (
    <main>
      <Hero />
      <TrustBar />

      <section className="section">
        <div className="container">
          <SectionHeading
            eyebrow="Our services"
            title="Practical support for every stage of business"
            copy="From keeping your books in order to completing recurring filings, we bring structure to the work behind your business."
          />
          <div className="service-grid">
            {services.map((service) => (
              <ServiceCard key={service.slug} service={service} />
            ))}
          </div>
        </div>
      </section>

      <section className="section soft-section">
        <div className="container split-section">
          <div>
            <SectionHeading
              eyebrow="Why choose us"
              title="Clear advice. Careful execution."
              copy="Professional services should feel understandable and dependable. Our approach is built around the details that help business owners move forward with confidence."
            />
            <div className="value-list">
              {values.slice(0, 4).map(([title, copy]) => (
                <div className="value-item" key={title}>
                  <span className="check-circle">
                    <Check size={15} />
                  </span>
                  <div>
                    <h3>{title}</h3>
                    <p>{copy}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="quote-panel">
            <span className="quote-mark">“</span>
            <p>Good compliance is quiet, consistent and easy to verify.</p>
            <span className="quote-rule"></span>
            <small>A considered approach to professional services</small>
          </div>
        </div>
      </section>

      <section className="section process-section">
        <div className="container">
          <SectionHeading
            align="center"
            eyebrow="How we work"
            title="A straightforward process"
            copy="You always know what is happening, what we need and what comes next."
          />
          <div className="process-grid">
            {processSteps.map(([number, title, copy]) => (
              <div className="process-step" key={number}>
                <span>{number}</span>
                <h3>{title}</h3>
                <p>{copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTASection />
    </main>
  )
}

