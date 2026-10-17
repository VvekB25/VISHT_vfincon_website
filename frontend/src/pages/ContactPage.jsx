import { useState } from 'react'
import { ArrowRight, Check, Mail, MapPin, MessageCircle, Phone } from 'lucide-react'
import { brand } from '../config/brand'
import { services } from '../data'

function ContactForm() {
  const [submitted, setSubmitted] = useState(false)

  return (
    <form
      className="contact-form"
      onSubmit={(event) => {
        event.preventDefault()
        setSubmitted(true)
      }}
    >
      {submitted && (
        <div className="form-success">
          <Check size={17} /> Thank you. The {brand.fullName} team will be in touch shortly.
        </div>
      )}
      <div className="form-row">
        <label>
          Name
          <input required type="text" placeholder="Your full name" />
        </label>
        <label>
          Phone number
          <input required type="tel" placeholder="+91 9035387198" />
        </label>
      </div>
      <div className="form-row">
        <label>
          Email
          <input required type="email" placeholder="you@company.com" />
        </label>
        <label>
          Business name
          <input type="text" placeholder="Your enterprise name" />
        </label>
      </div>
      <label>
        Service required
        <select defaultValue="">
          <option value="" disabled>
            Select a service
          </option>
          {services.map((service) => (
            <option key={service.slug}>{service.title}</option>
          ))}
        </select>
      </label>
      <label>
        Message
        <textarea rows="5" placeholder="Tell us briefly how we can assist your business"></textarea>
      </label>
      <button className="button primary" type="submit">
        Submit Enquiry <ArrowRight size={17} />
      </button>
    </form>
  )
}

export default function ContactPage() {
  return (
    <main>
      <section className="page-intro">
        <div className="container">
          <span className="eyebrow">{brand.fullName}</span>
          <h1>Get in touch with our team</h1>
          <p>
            Share your accounting, tax, or corporate advisory requirement and our professional team
            will guide you through the next steps.
          </p>
        </div>
      </section>

      <section className="section contact-section">
        <div className="container contact-grid">
          <div className="contact-details">
            <div className="section-heading">
              <span className="eyebrow">Official Contact</span>
              <h2>A conversation is a good place to start.</h2>
              <p>Reach us directly through our office channels or submit an online enquiry.</p>
            </div>
            <div className="contact-list">
              <a href={brand.phoneLink}>
                <span>
                  <Phone size={18} />
                </span>
                <div>
                  <small>Official Phone</small>
                  <strong>{brand.phone}</strong>
                </div>
              </a>
              <a href={brand.emailLink}>
                <span>
                  <Mail size={18} />
                </span>
                <div>
                  <small>Official Email</small>
                  <strong>{brand.email}</strong>
                </div>
              </a>
              <div>
                <span>
                  <MapPin size={18} />
                </span>
                <div>
                  <small>Bengaluru Office</small>
                  <strong style={{ fontSize: '12px', lineHeight: '1.4' }}>{brand.address}</strong>
                </div>
              </div>
              <div>
                <span>◷</span>
                <div>
                  <small>Business Hours</small>
                  <strong>{brand.hours}</strong>
                </div>
              </div>
            </div>
            <a
              className="whatsapp"
              href={brand.whatsappLink}
              target="_blank"
              rel="noreferrer"
            >
              <MessageCircle size={18} /> Chat on WhatsApp ({brand.phone})
            </a>
          </div>
          <ContactForm />
        </div>
      </section>
    </main>
  )
}
