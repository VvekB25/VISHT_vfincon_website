import { useState } from 'react'
import { ArrowRight, Check, Mail, MapPin, MessageCircle, Phone } from 'lucide-react'
import { brand } from '../config/brand'
import { services } from '../data'

function ContactForm() {
  const [feedback, setFeedback] = useState('')
  function handleSubmit(event) {
    event.preventDefault()
    const values = new FormData(event.currentTarget)
    const subject = `Website enquiry: ${values.get('service') || 'General enquiry'}`
    const body = [`Name: ${values.get('name')}`, `Phone: ${values.get('phone')}`, `Email: ${values.get('email')}`, `Business: ${values.get('business') || 'Not provided'}`, `Service: ${values.get('service') || 'Not specified'}`, '', String(values.get('message') || '')].join('\n')
    window.location.href = `${brand.emailLink}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    setFeedback('Your email app should open with this enquiry ready to send. If it does not, email us directly using the address shown here.')
  }

  return <form className="contact-form" onSubmit={handleSubmit}>
    {feedback && <div className="form-success" role="status"><Check size={17} /> {feedback}</div>}
    <div className="form-row">
      <label>Name<input required name="name" type="text" autoComplete="name" placeholder="Your full name" /></label>
      <label>Phone number<input required name="phone" type="tel" autoComplete="tel" placeholder={brand.phone} /></label>
    </div>
    <div className="form-row">
      <label>Email<input required name="email" type="email" autoComplete="email" placeholder="you@company.com" /></label>
      <label>Business name<input name="business" type="text" autoComplete="organization" placeholder="Your business name" /></label>
    </div>
    <label>Service required<select name="service" defaultValue=""><option value="">Select a service</option>{services.map((service) => <optgroup key={service.slug} label={service.title}>{service.items.map((item) => <option key={item} value={item}>{item}</option>)}</optgroup>)}</select></label>
    <label>Message<textarea name="message" rows="5" placeholder="Tell us briefly how we can assist your business" /></label>
    <button className="button primary" type="submit">Prepare email enquiry <ArrowRight size={17} /></button>
  </form>
}

export default function ContactPage() {
  return <main>
    <section className="page-intro"><div className="container"><span className="eyebrow">{brand.fullName}</span><h1>Get in touch with our team</h1><p>Contact us about your accounting, tax, registration or compliance requirement.</p></div></section>
    <section className="section contact-section"><div className="container contact-grid">
      <div className="contact-details"><div className="section-heading"><span className="eyebrow">Official Contact</span><h2>A conversation is a good place to start.</h2><p>Reach us directly through our office channels or prepare an enquiry by email.</p></div>
        <div className="contact-list">
          <a href={brand.phoneLink}><span><Phone size={18} /></span><div><small>Phone</small><strong>{brand.phone}</strong></div></a>
          <a href={brand.emailLink}><span><Mail size={18} /></span><div><small>Email</small><strong>{brand.email}</strong></div></a>
          <div><span><MapPin size={18} /></span><div><small>Bengaluru Office</small><strong>{brand.address}</strong></div></div>
        </div>
        <a className="whatsapp" href={brand.whatsappLink} target="_blank" rel="noreferrer"><MessageCircle size={18} /> Chat on WhatsApp ({brand.phone})</a>
      </div>
      <ContactForm />
    </div></section>
  </main>
}
