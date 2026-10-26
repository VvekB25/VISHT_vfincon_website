import { useEffect, useMemo, useState } from 'react'
import { ArrowRight, CalendarDays, ChevronDown, ChevronUp, Clock3 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { complianceClockSettings } from '../data/complianceDeadlines'
import { formatComplianceDate, getComplianceCountdown, getComplianceOccurrences, getNextIndiaMidnightDelay } from '../data/complianceCalendar'

export default function ComplianceClock() {
  const [now, setNow] = useState(() => new Date())
  const [showAll, setShowAll] = useState(false)
  const deadlines = useMemo(() => getComplianceOccurrences(now), [now])

  useEffect(() => {
    const timer = window.setTimeout(() => setNow(new Date()), getNextIndiaMidnightDelay(now))
    return () => window.clearTimeout(timer)
  }, [now])

  const visibleDeadlines = showAll ? deadlines : deadlines.slice(0, complianceClockSettings.visibleCount)

  return (
    <section className="section compliance-clock-section" aria-labelledby="compliance-clock-heading">
      <div className="container compliance-clock-container">
        <div className="compliance-clock-heading">
          <div>
            <span className="eyebrow">Indicative recurring schedule · {complianceClockSettings.timeZoneLabel}</span>
            <h2 id="compliance-clock-heading">Compliance Clock</h2>
            <p>Upcoming compliance deadlines</p>
          </div>
          <Link className="text-link compliance-contact-link" to="/contact">Get filing assistance <ArrowRight size={15} /></Link>
        </div>

        <div className="compliance-deadline-list" aria-live="polite">
          {visibleDeadlines.length ? visibleDeadlines.map((item) => (
            <article className={`compliance-deadline ${item.status}`} key={`${item.id}-${item.dueDate}`}>
              <div className="compliance-due-date"><CalendarDays size={15} /><time dateTime={item.dueDate}>{formatComplianceDate(item.dueDate)}</time></div>
              <div className="compliance-detail"><h3>{item.title}</h3><p>{item.description}</p><span className="compliance-period">{item.periodLabel} · {item.period}</span></div>
              <span className="compliance-countdown" aria-label={`${getComplianceCountdown(item.daysRemaining)} in India Standard Time`}><Clock3 size={14} />{getComplianceCountdown(item.daysRemaining)}</span>
              <div className="compliance-sources">{(item.sources || [item.source]).map((source) => <a key={source.url} href={source.url} target="_blank" rel="noreferrer">{source.label}</a>)}</div>
            </article>
          )) : <p className="compliance-empty">No recurring dates fall within the current planning window.</p>}
        </div>

        {deadlines.length > complianceClockSettings.visibleCount && <button className="service-expand compliance-expand" type="button" aria-expanded={showAll} onClick={() => setShowAll(!showAll)}>{showAll ? 'Show fewer dates' : 'View all deadlines'} {showAll ? <ChevronUp size={15} /> : <ChevronDown size={15} />}</button>}
        <p className="compliance-disclaimer">Indicative dates only. Applicability, filing periods, extensions and taxpayer categories vary; confirm each due date with the linked official portal. This calendar does not track individual filings or replace professional advice.</p>
      </div>
    </section>
  )
}
