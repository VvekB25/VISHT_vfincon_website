import { useState } from 'react'
import { ArrowRight, Check, ChevronDown, ChevronUp } from 'lucide-react'
import { Link } from 'react-router-dom'
import { services } from '../data'

function ServiceCard({ service, index, preview }) {
  const [expanded, setExpanded] = useState(false)
  const Icon = service.icon
  const limit = preview ? 2 : 3
  const visibleItems = expanded ? service.items : service.items.slice(0, limit)
  const canExpand = service.items.length > limit

  return <article className="service-category-card">
    <div className="service-category-top"><span className="service-number">{String(index + 1).padStart(2, '0')}</span><span className="card-icon"><Icon size={20} /></span></div>
    <h2>{service.title}</h2><p className="service-category-description">{service.description}</p>
    <ul className="category-service-list">{visibleItems.map((item) => <li key={item}><Check size={15} aria-hidden="true" />{item}</li>)}</ul>
    {canExpand && <button className="service-expand" type="button" aria-expanded={expanded} onClick={() => setExpanded(!expanded)}>{expanded ? 'Show less' : 'View all services'} {expanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}</button>}
    {preview && <Link className="text-link" to="/services">Explore services <ArrowRight size={15} /></Link>}
  </article>
}

export default function ServiceGrid({ preview = false }) {
  return <div className={`service-category-grid${preview ? ' preview-grid' : ''}`}>{services.map((service, index) => <ServiceCard key={service.slug} service={service} index={index} preview={preview} />)}</div>
}
