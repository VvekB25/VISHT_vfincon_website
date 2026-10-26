import ServiceGrid from '../components/ServiceGrid'
import CTASection from '../components/CTASection'

export default function ServicesPage() {
  return (
    <main>
      <section className="page-intro">
        <div className="container">
          <span className="eyebrow">How we can help</span>
          <h1>Services for your business requirements</h1>
          <p>Explore registration, tax, accounting and compliance support from VIDMAHI Fin Consultants.</p>
        </div>
      </section>
      <section className="section services-page">
        <div className="container"><ServiceGrid /></div>
      </section>
      <CTASection />
    </main>
  )
}
