export const initialNotifications = [
  {
    id: 'a1000000-0000-0000-0000-000000000001',
    title: 'Advisory on Mandatory Two-Factor Authentication (2FA) for E-Way Bill and E-Invoice Portals',
    slug: 'mandatory-2fa-eway-bill-einvoice',
    summary: 'National Informatics Centre (NIC) mandates 2-Factor Authentication for all taxpayers with aggregate annual turnover above INR 20 Crores.',
    content: `The National Informatics Centre (NIC) and Goods & Services Tax Network (GSTN) have issued a directive implementing mandatory Two-Factor Authentication (2FA) for logging into E-Way Bill and E-Invoice systems for all registered businesses with an aggregate annual turnover exceeding INR 20 Crores.

Taxpayers must link a verified mobile number to receive OTPs or register with an authenticator app (e.g., Sandes or standard TOTP app). Failure to set up 2FA will restrict portal access.

VFINCON Recommendation:
We advise all clients falling within this turnover bracket to update their registered contact details immediately and ensure seamless generation of statutory consignment and invoice documents.`,
    category: 'GST',
    published_at: new Date(Date.now() - 3 * 86400000).toISOString(),
    expires_at: null,
    source_name: 'GST e-Invoice System Portal (NIC)',
    source_url: 'https://einvoice1.gst.gov.in',
    attachment_url: '',
    status: 'published',
    created_at: new Date(Date.now() - 3 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 3 * 86400000).toISOString(),
  },
  {
    id: 'a1000000-0000-0000-0000-000000000002',
    title: 'MCA Advisory on Filing Form DIR-3 KYC and Web KYC for Directors for FY 2025-26',
    slug: 'mca-advisory-filing-form-dir-3-kyc-fy26',
    summary: 'Ministry of Corporate Affairs reminds all DIN holders to complete mandatory annual Director KYC to prevent deactivation of Director Identification Numbers.',
    content: `Under Rule 12A of the Companies (Appointment and Qualification of Directors) Rules, 2014, every individual holding a Director Identification Number (DIN) as on 31st March must file Form DIR-3 KYC (or DIR-3 KYC WEB for unchanged details).

Key Considerations:
1. If details (mobile, email, address) remain identical to the previous submission, directors can submit the web-based verification OTP form.
2. In case of changes in personal details or passport information, an e-form with digital signature (DSC) certification by a practicing CA/CS/CMA is required.
3. Deactivated DINs incur a late filing statutory penalty of INR 5,000 per DIN.

VFINCON Recommendation:
All corporate entities are advised to review the active status of their board members well ahead of the statutory due date.`,
    category: 'MCA/ROC',
    published_at: new Date(Date.now() - 7 * 86400000).toISOString(),
    expires_at: null,
    source_name: 'Ministry of Corporate Affairs (MCA)',
    source_url: 'https://www.mca.gov.in',
    attachment_url: '',
    status: 'published',
    created_at: new Date(Date.now() - 7 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 7 * 86400000).toISOString(),
  },
  {
    id: 'a1000000-0000-0000-0000-000000000003',
    title: 'CBDT Circular: Clarifications on Timelines for Filing Updated Income Tax Returns (ITR-U)',
    slug: 'cbdt-circular-updated-returns-itr-u-timelines',
    summary: 'Central Board of Direct Taxes releases guidance on eligible assessment years and additional tax payments for filing updated returns under Section 139(8A).',
    content: `The Central Board of Direct Taxes (CBDT) has issued a consolidated operational circular on Section 139(8A) of the Income-tax Act, 1961 (ITR-U).

Summary of Provisions:
- Taxpayers who omitted income, declared incorrect heads of income, or need to reduce carried-forward losses may furnish an updated return within 24 months from the end of the relevant assessment year.
- Additional tax payable is 25% of aggregate tax and interest if filed within 12 months, and 50% if filed between 12 and 24 months.
- ITR-U cannot be submitted to claim a refund, enhance an existing refund, or declare a loss return.

VFINCON Note:
This advisory highlights reconciliation requirements between AIS/TIS and filed returns. Reach out to our direct tax advisory desk for voluntary compliance checks.`,
    category: 'Income Tax',
    published_at: new Date(Date.now() - 12 * 86400000).toISOString(),
    expires_at: null,
    source_name: 'Income Tax Department, Ministry of Finance',
    source_url: 'https://www.incometax.gov.in',
    attachment_url: '',
    status: 'published',
    created_at: new Date(Date.now() - 12 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 12 * 86400000).toISOString(),
  },
  {
    id: 'a1000000-0000-0000-0000-000000000004',
    title: 'Standard Operating Procedure for Annual MSME Form I Disclosures to ROC',
    slug: 'sop-annual-msme-form-1-disclosures-roc',
    summary: 'Guidance on biannual filing of MSME Form I reporting outstanding payments to micro and small enterprises beyond 45 days.',
    content: `Specified companies having outstanding payments to Micro and Small Enterprises exceeding forty-five days are required to submit half-yearly return Form MSME I to the Registrar of Companies (ROC).

Key Compliance Details:
- Due date for April to September period: 31st October.
- Due date for October to March period: 30th April.
- Details required: Name of supplier, PAN, amount due, date from which amount is outstanding, and specific reasons for delay.`,
    category: 'Compliance',
    published_at: new Date(Date.now() - 18 * 86400000).toISOString(),
    expires_at: null,
    source_name: 'Ministry of Corporate Affairs',
    source_url: 'https://www.mca.gov.in',
    attachment_url: '',
    status: 'published',
    created_at: new Date(Date.now() - 18 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 18 * 86400000).toISOString(),
  },
]

export const initialBlogPosts = [
  {
    id: 'b1000000-0000-0000-0000-000000000001',
    title: 'MSME 45-Day Payment Rule (Section 43B(h)): What Business Owners and CFOs Must Ensure',
    slug: 'msme-45-day-payment-rule-section-43b-h',
    excerpt: 'A detailed operational guide to navigating Section 43B(h) of the Income Tax Act. Learn how overdue payments to micro and small enterprises impact taxable profits.',
    content: `The enforcement of Section 43B(h) of the Income-tax Act, 1961 marks one of the most critical structural shifts in working capital and vendor management for Indian businesses.

### Understanding the Statutory Core

Under Section 43B(h), any sum payable by an assessee to a Micro or Small enterprise beyond the time limit specified in Section 15 of the Micro, Small and Medium Enterprises Development (MSMED) Act, 2006 shall be allowed as a deduction only in the previous year in which such sum is actually paid.

Unlike other clauses of Section 43B, payments under clause (h) cannot be claimed on accrual basis if paid before the due date of filing the return of income under Section 139(1) unless paid within the MSMED time limit.

### Key Statutory Timelines

1. **Where written agreement exists**: Payment must be completed within the agreed period, which cannot exceed **45 days** from the day of acceptance or deemed acceptance of goods or services.
2. **Where no written agreement exists**: Payment must be completed within **15 days** from the date of delivery/acceptance.

### Which Entities Are Covered?

- **Covered**: Micro and Small Enterprises registered under the Udyam registration portal.
- **Excluded**: Medium enterprises (Turnover > INR 50 Cr or Investment in Plant & Machinery > INR 10 Cr).
- **Excluded**: Traders and wholesale distributors (even if registered under Udyam for priority sector lending purposes, per Ministry clarification).

### Practical Checklist for Businesses

1. **Vendor Classification Audit**: Request active Udyam certificates from all active vendors and verify their status as Micro, Small, or Medium.
2. **Payment Tracking System**: Implement alerts in your ERP or accounting software 10 days before the 45-day threshold.
3. **Dispute Documentation**: If goods or services are defective, record formal objections in writing within 15 days of delivery to stop the statutory countdown until resolved.

At VFINCON, our corporate tax division assists businesses in conducting comprehensive vendor categorization and year-end compliance reviews to eliminate unexpected tax additions.`,
    featured_image: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=1200&q=80',
    category: 'Taxation & Compliance',
    tags: ['Income Tax', 'Section 43B(h)', 'MSME', 'Corporate Tax'],
    author_name: 'Vidmahi Fin Consultants Advisory Desk',
    status: 'published',
    published_at: new Date(Date.now() - 5 * 86400000).toISOString(),
    created_at: new Date(Date.now() - 5 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 5 * 86400000).toISOString(),
  },
  {
    id: 'b1000000-0000-0000-0000-000000000002',
    title: 'Choosing Between Private Limited, LLP, and OPC for Startups in 2026',
    slug: 'choosing-pvt-ltd-llp-opc-for-startups',
    excerpt: 'A strategic comparison of corporate business structures in India covering legal liability, compliance overhead, tax rates, and investor readiness.',
    content: `Selecting the optimal business structure is one of the most foundational decisions for entrepreneurs launching in India. Each structure balances distinct legal protection, tax implications, and regulatory compliance.

### 1. Private Limited Company (Pvt Ltd)

A Private Limited Company remains the gold standard for ventures aiming for institutional funding, venture capital backing, or significant scale.

- **Separate Legal Entity**: Strict separation of founder assets and corporate liabilities.
- **Investor Preference**: Equity shares and convertible instruments can be issued smoothly.
- **Annual Compliances**: Requires statutory audit by an independent Chartered Accountant, ROC filings (AOC-4, MGT-7), regular board meetings, and maintenance of statutory registers.
- **Tax Rate**: 22% base corporate tax rate (plus applicable surcharge & cess under Section 115BAA).

### 2. Limited Liability Partnership (LLP)

An LLP provides the hybrid benefit of limited liability combined with the operational flexibility of a partnership.

- **Lower Regulatory Friction**: Audit is only mandatory if turnover exceeds INR 40 Lakhs or capital contribution exceeds INR 25 Lakhs.
- **Profit Distribution**: Profits distributed to partners are exempt from tax in their hands under Section 10(2A).
- **Tax Rate**: Flat 30% tax rate plus surcharge/cess. No Dividend Distribution Tax equivalent.
- **Best Suited For**: Professional service firms, consultancies, bootstrapped software agencies, and family-held operating businesses.

### 3. One Person Company (OPC)

For solo founders seeking corporate status without needing a co-founder initially, the OPC structure offers full legal identity with single-member shareholding.

### Summary Comparison Table

- **Pvt Ltd**: Min 2 members, statutory audit mandatory, equity funding enabled, 22% base tax.
- **LLP**: Min 2 partners, audit based on turnover, partnership equity, 30% base tax with tax-free profit share.
- **OPC**: 1 member, statutory audit mandatory, conversion to Pvt Ltd possible as scale rises.

VFINCON guides founders through structure evaluation, DSC issuance, name reservation on SPICe+, and end-to-end incorporation within days.`,
    featured_image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
    category: 'Business Registration',
    tags: ['Pvt Ltd', 'LLP', 'Company Formation', 'Startup Advisory'],
    author_name: 'VFINCON Corporate Desk',
    status: 'published',
    published_at: new Date(Date.now() - 10 * 86400000).toISOString(),
    created_at: new Date(Date.now() - 10 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 10 * 86400000).toISOString(),
  },
  {
    id: 'b1000000-0000-0000-0000-000000000003',
    title: 'Statutory Audit vs Internal Audit: Purpose, Scope, and Value for Mid-Market Enterprises',
    slug: 'statutory-audit-vs-internal-audit-differences',
    excerpt: 'Why growing enterprises need both external statutory assurance and internal operational audit controls to protect margins and governance.',
    content: `As companies scale from early-stage businesses to multi-crore enterprises, their financial control systems face heightened scrutiny from directors, banks, and tax authorities.

### Statutory Audit: The External Truth Test

A Statutory Audit is a mandatory audit required by law (Companies Act, 2013). Its central purpose is to give an independent opinion to shareholders and regulatory authorities on whether the financial statements exhibit a "True and Fair View" of the company's financial health.

- **Primary Audience**: Shareholders, Banks, MCA, Tax Authorities.
- **Auditor**: Independent Chartered Accountant holding a valid Certificate of Practice.
- **Reporting**: Follows prescribed Auditing Standards (SAs) issued by ICAI.

### Internal Audit: The Operational Navigator

In contrast, an Internal Audit is a forward-looking management tool. It evaluates internal control frameworks, corporate governance, operational workflows, and fraud vulnerability.

- **Primary Audience**: Board of Directors, Audit Committee, and Managing Leadership.
- **Focus**: Risk mitigation, cost reduction, process efficiency, and preventing leakage.

### Bridging the Gap: The VFINCON Approach

At VFINCON, we provide structured assurance assistance that balances regulatory rigor with real operational value, ensuring businesses remain audit-ready throughout the fiscal year.`,
    featured_image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1200&q=80',
    category: 'Audit & Assurance',
    tags: ['Audit', 'Statutory Audit', 'Internal Controls', 'Corporate Governance'],
    author_name: 'VFINCON Assurance Team',
    status: 'published',
    published_at: new Date(Date.now() - 16 * 86400000).toISOString(),
    created_at: new Date(Date.now() - 16 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 16 * 86400000).toISOString(),
  },
]

export const initialComments = [
  {
    id: 'c1000000-0000-0000-0000-000000000001',
    post_id: 'b1000000-0000-0000-0000-000000000001',
    author_name: 'Rajesh Singhania',
    content: 'Extremely timely analysis of Section 43B(h). Could you clarify if the 45-day calculation starts from invoice date or delivery of goods?',
    status: 'approved',
    created_at: new Date(Date.now() - 4 * 86400000).toISOString(),
  },
  {
    id: 'c1000000-0000-0000-0000-000000000002',
    post_id: 'b1000000-0000-0000-0000-000000000001',
    author_name: 'Anita Verma (CFO, NeoFabrics)',
    content: 'Very clear distinction between Micro/Small vs Medium enterprises. We incorporated your vendor certificate verification checklist into our ERP.',
    status: 'approved',
    created_at: new Date(Date.now() - 3 * 86400000).toISOString(),
  },
  {
    id: 'c1000000-0000-0000-0000-000000000003',
    post_id: 'b1000000-0000-0000-0000-000000000001',
    author_name: 'Deepak Gupta',
    content: 'Does Section 43B(h) also apply to payments made for capital assets, or solely revenue expenditure?',
    status: 'pending',
    created_at: new Date(Date.now() - 1 * 86400000).toISOString(),
  },
  {
    id: 'c1000000-0000-0000-0000-000000000004',
    post_id: 'b1000000-0000-0000-0000-000000000002',
    author_name: 'Kunal Roy',
    content: 'Comprehensive comparison between Pvt Ltd and LLP. The tax rate note on dividend distribution really helped our team decide.',
    status: 'approved',
    created_at: new Date(Date.now() - 8 * 86400000).toISOString(),
  },
]

