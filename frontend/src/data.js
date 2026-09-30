import {
  BadgeIndianRupee,
  BookOpenCheck,
  Building2,
  ClipboardCheck,
  FileCheck2,
  Landmark,
  ReceiptIndianRupee,
  ShieldCheck,
} from 'lucide-react'

export const firm = {
  name: '[FIRM NAME]',
  descriptor: 'Accounting | Tax | Audit | Corporate Compliance',
  phone: '+91 00000 00000',
  email: 'hello@example.com',
  address: '[OFFICE LOCATION], India',
  hours: 'Mon - Sat, 10:00 AM - 6:00 PM',
}

export const services = [
  {
    title: 'Accounting & Bookkeeping',
    slug: 'accounting',
    icon: BookOpenCheck,
    description: 'Organized books, timely reporting and practical accounting support for confident business decisions.',
    items: ['Bookkeeping', 'Financial accounting', 'Financial statements', 'Payroll / accounting support'],
  },
  {
    title: 'Audit & Assurance',
    slug: 'audit',
    icon: ClipboardCheck,
    description: 'Structured audit assistance and assurance support that helps businesses meet their reporting responsibilities.',
    items: ['Statutory Audit', 'Internal Audit', 'Tax Audit', 'Audit Assistance'],
  },
  {
    title: 'Taxation & GST',
    slug: 'taxation',
    icon: ReceiptIndianRupee,
    description: 'Clear, dependable support for income tax, GST, TDS and ongoing tax compliance requirements.',
    items: ['Income Tax Return Filing', 'GST Registration', 'GST Return Filing', 'TDS Compliance', 'Tax Compliance & Advisory'],
  },
  {
    title: 'Business Registration',
    slug: 'registration',
    icon: Building2,
    description: 'A guided start for new ventures, from choosing a structure to completing essential registrations.',
    items: ['Private Limited Company Registration', 'LLP Registration', 'Partnership Registration', 'Proprietorship', 'MSME / Udyam Registration', 'Startup Registration'],
  },
  {
    title: 'Corporate Compliance',
    slug: 'compliance',
    icon: ShieldCheck,
    description: 'Keep recurring company and LLP obligations visible, organized and completed on schedule.',
    items: ['MCA / ROC Annual Compliance', 'Annual Returns', 'Director Compliance', 'Company / LLP Compliance', 'Other statutory filings'],
  },
  {
    title: 'Licensing & Registrations',
    slug: 'licensing',
    icon: BadgeIndianRupee,
    description: 'Practical assistance with the registrations and licences your business needs to operate properly.',
    items: ['FSSAI', 'Shops & Establishment', 'Professional Tax', 'Import Export Code', 'Digital Signature Certificate', 'Other Business Licences'],
  },
]

export const values = [
  ['Reliable & Professional', 'Clear communication and careful work at every stage.'],
  ['Timely Compliance', 'A practical view of due dates, documents and follow-through.'],
  ['Business-Focused Approach', 'Advice shaped around your business context and priorities.'],
  ['Transparent Process', 'Straightforward scope, next steps and updates.'],
  ['Personalized Support', 'A responsive point of contact for your ongoing requirements.'],
]

export const processSteps = [
  ['01', 'Understand Your Requirement', 'We listen first and clarify the outcome you need.'],
  ['02', 'Document Collection', 'We share a clear checklist and organize the information.'],
  ['03', 'Processing & Compliance', 'Our team works through the relevant filings or deliverables.'],
  ['04', 'Completion & Support', 'You receive the completed work and guidance on what comes next.'],
]

export const categories = [
  ['Accounting & Bookkeeping', 'accounting'],
  ['Audit & Assurance', 'audit'],
  ['Taxation & GST', 'taxation'],
  ['Business Registration', 'registration'],
  ['Corporate Compliance', 'compliance'],
  ['Licensing & Registrations', 'licensing'],
]

export const trustItems = [
  ['Accounting & Bookkeeping', BookOpenCheck],
  ['Tax & GST', ReceiptIndianRupee],
  ['Audit & Assurance', ClipboardCheck],
  ['Business Registration', Building2],
  ['Corporate Compliance', Landmark],
]
