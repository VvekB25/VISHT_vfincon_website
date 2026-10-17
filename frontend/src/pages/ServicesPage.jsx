import { useNavigate } from 'react-router-dom'
import { ArrowRight, Check } from 'lucide-react'
import { categories, services } from '../data'
import { CTASection } from './HomePage'

export default function ServicesPage() {
  const navigate = useNavigate()

  return (
    <main>
      <section className="page-intro">
        <div className="container">
          <span className="eyebrow">What we can help with</span>
          <h1>Services built around your responsibilities</h1>
          <p>
            Reliable support for the accounting, tax, registration and compliance work that keeps
            your business moving.
          </p>
        </div>
      </section>

      <section className="section services-page">
        <div className="container">
          {categories.map(([label, slug]) => {
            const service = services.find((item) => item.slug === slug)
            const idx = categories.findIndex((item) => item[1] === slug) + 1
            return (
              <div className="service-category" key={slug}>
                <div className="category-heading">
                  <div>
                    <span className="eyebrow">{String(idx).padStart(2, '0')}</span>
                    <h2>{label}</h2>
                  </div>
                  <p>{service?.description}</p>
                </div>

                <div className="service-detail-grid">
                  {service?.items.map((item) => (
                    <div className="detail-item" key={item}>
                      <span>
                        <Check size={16} />
                      </span>
                      <div>
                        <h3>{item}</h3>
                        <p>Get practical guidance and assistance tailored to your business requirement.</p>
                      </div>
                      <button
                        onClick={() => navigate('/contact')}
                        aria-label={`Get assistance with ${item}`}
                      >
                        <ArrowRight size={17} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </section>

      <CTASection />
    </main>
  )
}

