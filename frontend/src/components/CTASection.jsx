import { ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function CTASection() {
  const navigate = useNavigate()
  return <section className="cta-section"><div className="container cta-inner"><div><span className="eyebrow light">Talk to our team</span><h2>How can we help with your business?</h2><p>Contact Vidmahi Fin Consultants by phone, email, WhatsApp or enquiry form.</p></div><button className="button light-button" onClick={() => navigate('/contact')}>Contact us <ArrowRight size={17} /></button></div></section>
}
