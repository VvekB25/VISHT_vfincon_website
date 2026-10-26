// Recurring statutory dates only. Confirm eligibility, extensions and return
// periods on the linked government portal before acting on a deadline.
export const complianceDeadlines = [
  {
    id: 'advance-tax-instalments',
    title: 'Advance tax instalment',
    description: 'Pay the applicable instalment based on estimated tax liability.',
    period: 'For taxpayers liable to pay advance tax; presumptive schemes differ',
    recurrence: { type: 'quarterly', dates: [
      { month: 6, day: 15, period: 'First instalment' },
      { month: 9, day: 15, period: 'Second instalment' },
      { month: 12, day: 15, period: 'Third instalment' },
      { month: 3, day: 15, period: 'Final instalment' },
    ] },
    source: { label: 'Income Tax Department', url: 'https://www.incometax.gov.in/iec/foportal/help/all-topics/e-filing-services/ITR1-FAQ?mobile-app=1' },
  },
  {
    id: 'tds-deposit',
    title: 'TDS / TCS monthly deposit',
    description: 'Deposit tax deducted or collected during the previous month.',
    period: 'Monthly; general rule, exceptions apply',
    recurrence: { type: 'monthly', day: 7, exceptions: [{ month: 4, day: 30, periodMonth: 3 }] },
    source: { label: 'Income Tax Department', url: 'https://www.incometax.gov.in/iec/foportal/help/all-topics/e-filing-services/tax-payments' },
  },
  {
    id: 'gstr-1-monthly',
    title: 'GST GSTR-1 (monthly filers)',
    description: 'Report outward supplies for the previous tax month.',
    period: 'Monthly filers; QRMP dates differ',
    recurrence: { type: 'monthly', day: 11 },
    source: { label: 'GST Portal', url: 'https://tutorial.gst.gov.in/userguide/returns/GSTR_1.htm' },
  },
  {
    id: 'epf-esi-contribution',
    title: 'EPF & ESI contributions',
    description: 'Remit statutory contributions for the previous wage month, where applicable.',
    period: 'Monthly; covered establishments',
    recurrence: { type: 'monthly', day: 15 },
    sources: [
      { label: 'EPFO', url: 'https://www.epfindia.gov.in/site_en/For_Employers.php' },
      { label: 'ESIC Regulations', url: 'https://esic.gov.in/attachments/circularfile/1bec56cc7d380aed62fcd1970f0acb00.pdf' },
    ],
  },
  {
    id: 'gstr-3b-monthly',
    title: 'GST GSTR-3B (monthly filers)',
    description: 'File the summary return and pay applicable tax for the previous period.',
    period: 'Monthly filers; QRMP dates and state groups differ',
    recurrence: { type: 'monthly', day: 20 },
    source: { label: 'GST Portal', url: 'https://tutorial.gst.gov.in/userguide/returns/GSTR3B.htm' },
  },
  {
    id: 'gstr-1-quarterly',
    title: 'GST GSTR-1 (QRMP filers)',
    description: 'Report outward supplies for the completed quarter.',
    period: 'Quarterly filers; eligible taxpayers',
    recurrence: { type: 'quarterly', dates: [
      { month: 1, day: 13, period: 'October–December' },
      { month: 4, day: 13, period: 'January–March' },
      { month: 7, day: 13, period: 'April–June' },
      { month: 10, day: 13, period: 'July–September' },
    ] },
    source: { label: 'GST Portal', url: 'https://tutorial.gst.gov.in/userguide/returns/GSTR_1.htm' },
  },
  {
    id: 'tds-quarterly-statements',
    title: 'Quarterly TDS / TCS statements',
    description: 'File applicable quarterly statements (including Forms 138, 140 and 143).',
    period: 'Quarterly; forms depend on the deduction or collection',
    recurrence: { type: 'quarterly', dates: [
      { month: 7, day: 31, period: 'April–June' },
      { month: 10, day: 31, period: 'July–September' },
      { month: 1, day: 31, period: 'October–December' },
      { month: 5, day: 31, period: 'January–March' },
    ] },
    sources: [
      { label: 'Form 138', url: 'https://www.incometax.gov.in/iec/foportal/newformpage/forms/form138-um' },
      { label: 'Form 140', url: 'https://www.incometax.gov.in/iec/foportal/newformpage/forms/form140-um' },
      { label: 'Form 143', url: 'https://www.incometax.gov.in/iec/foportal/newformpage/forms/from143-um' },
    ],
  },
]

export const complianceClockSettings = {
  timeZone: 'Asia/Kolkata',
  timeZoneLabel: 'IST',
  visibleCount: 5,
  lookAheadDays: 90,
  lookBackDays: 7,
}
