import { brand } from '../config/brand'
import { values } from '../data'
import { CTASection } from './HomePage'

function SectionHeading({ eyebrow, title, copy }) {
  return (
    <div className="section-heading">
      <span className="eyebrow">{eyebrow}</span>
      <h2>{title}</h2>
      {copy && <p>{copy}</p>}
    </div>
  )
}

export default function AboutPage() {
  return (
    <main>
      <section className="page-intro">
        <div className="container">
          <span className="eyebrow">About the firm</span>
          <h1>Professional support, with a personal point of view</h1>
          <p>
            {brand.fullName} helps businesses stay organized and compliant through dependable
            accounting, taxation, statutory audit, and corporate consultancy services.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container about-grid">
          <div>
            <SectionHeading
              eyebrow="Our approach"
              title="Make complex work easier to manage"
              copy="We believe professional advice should be clear, timely and grounded in the realities of running a business. We take time to understand the requirement, explain the path ahead and keep the process organized from start to finish."
            />
            <p className="about-copy">
              Whether you are incorporating a new enterprise or managing recurring statutory compliances,
              our role is to give you a steady, responsive partner for the financial and regulatory work
              that matters to your growth.
            </p>
          </div>

          <div className="profile-panel">
            <div className="profile-logo-wrap">
              <img src={brand.logoPath} alt={brand.fullName} className="profile-logo-img" />
            </div>
            <span className="eyebrow">Company Profile</span>
            <h3>{brand.fullName}</h3>
            <p className="profile-descriptor">{brand.descriptor}</p>
            <dl>
              <div>
                <dt>Brand Name</dt>
                <dd>{brand.shortName}</dd>
              </div>
              <div>
                <dt>Office Location</dt>
                <dd style={{ maxWidth: '280px', textAlign: 'right' }}>{brand.address}</dd>
              </div>
              <div>
                <dt>Business Hours</dt>
                <dd>{brand.hours}</dd>
              </div>
              <div>
                <dt>Direct Contact</dt>
                <dd>
                  <a href={brand.phoneLink} style={{ color: 'var(--navy)' }}>{brand.phone}</a>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      <section className="section soft-section">
        <div className="container">
          <SectionHeading eyebrow="Our values" title="The standards we bring to the work" />
          <div className="values-grid">
            {values.map(([title, copy], index) => (
              <div className="value-card" key={title}>
                <span>0{index + 1}</span>
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
