import {
  BookOpenCheck, Building2, FileCheck2, Landmark, ReceiptIndianRupee, ShieldCheck,
} from 'lucide-react'
import { brand } from './config/brand'

export const firm = { ...brand }

export const services = [
  { title: 'Business & Entity Registration', slug: 'business-registration', icon: Building2, description: 'Set up the right business entity and complete essential registrations.', items: ['Company, LLP & OPC Incorporation', 'Partnership & Trust Registration', 'MSME Registration'] },
  { title: 'Tax Registrations & Identification', slug: 'tax-registrations', icon: ReceiptIndianRupee, description: 'Registration and record updates for key tax identities and obligations.', items: ['GST Registration & Modifications', 'Professional Tax (PT) Registration', 'PAN/TAN Applications & Corrections'] },
  { title: 'Licenses & Government Registrations', slug: 'licenses-registrations', icon: Landmark, description: 'Assistance with government registrations and operating licenses.', items: ['FSSAI License (Food License)', 'BBMP Trade License', 'Shops & Establishment Registration', 'PF & ESI Registration', 'IEC Registration (Import Export Code)'] },
  { title: 'Certifications & Export Documentation', slug: 'certifications-export', icon: FileCheck2, description: 'Support for certification applications and export documentation.', items: ['Trademark Registration', 'RCMC-APEDA Certificate', 'Letter of Undertaking (LUT)', 'Free Sale Certificate', 'NSIC Certificate'] },
  { title: 'Accounting & Audit Support', slug: 'accounting-audit', icon: BookOpenCheck, description: 'Organized books, financial reporting and audit assistance.', items: ['Complete Bookkeeping Services', 'Financial Statements & MIS Reporting', 'Internal & Statutory Audit Assistance'] },
  { title: 'Regulatory Filing & Compliance', slug: 'regulatory-compliance', icon: ShieldCheck, description: 'Recurring tax, payroll and corporate filings managed with care.', items: ['GST Returns (GSTR-1, GSTR-3B & Annual Return)', 'TDS Filing & Reconciliation', 'PF & ESI Monthly Returns', 'PT Monthly & Annual Returns', 'Income Tax Returns (Individuals & Businesses)', 'MCA Related Filings'] },
  { title: 'Digital Signature Certificates (DSC)', slug: 'digital-signatures', icon: FileCheck2, description: 'Digital signature application, renewal and token support.', items: ['Class 3 DSC - Individual & Organizational', 'Paperless Application & Fast Issuance', 'Renewals & Token Management'] },
]

export const categories = services.map(({ title, slug }) => [title, slug])

export const values = [
  ['Reliable & Professional', 'Clear communication and careful work at every stage.'],
  ['Timely Compliance', 'A practical view of due dates, documents and follow-through.'],
  ['Business-Focused Approach', 'Support shaped around your business context and priorities.'],
  ['Transparent Process', 'Straightforward scope, next steps and updates.'],
]

export const processSteps = [
  ['01', 'Understand Your Requirement', 'We listen first and clarify the outcome you need.'],
  ['02', 'Document Collection', 'We share a clear checklist and organize the information.'],
  ['03', 'Processing & Compliance', 'We work through the relevant filings or deliverables.'],
  ['04', 'Completion & Support', 'You receive the completed work and guidance on what comes next.'],
]

export const trustItems = services.slice(0, 5).map(({ title, icon }) => [title, icon])
