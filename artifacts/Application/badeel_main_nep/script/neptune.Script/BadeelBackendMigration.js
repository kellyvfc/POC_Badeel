/*
================================================================================
                     BADEEL PORTAL - BACKEND MIGRATION PROJECT
================================================================================
Development Package: POC_Badeel
Author: Neptune Software AI Assistant

This file contains the complete blueprint, PostgreSQL DDL schemas, mock seed data,
and DXP Server Scripts required to migrate the hardcoded frontend data into a
dynamic, database-backed model.

To implement the database:
1. Execute the PostgreSQL DDL commands in your database client or Table Designer.
2. Execute the Seed SQL script to populate the tables with production-grade mock data.
3. Register the 8 REST GET endpoints in the Neptune DXP API Designer.
4. Bind each endpoint to the corresponding server scripts provided below.
================================================================================

--------------------------------------------------------------------------------
PART 1: DATABASE SCHEMAS (PostgreSQL DDL)
--------------------------------------------------------------------------------

-- 1. Country Reference Lookup
CREATE TABLE badeel_country (
    key VARCHAR(100) PRIMARY KEY,
    text VARCHAR(100) NOT NULL,
    is_tax_country BOOLEAN DEFAULT FALSE
);

-- 2. Currency Reference Lookup
CREATE TABLE badeel_currency (
    key VARCHAR(10) PRIMARY KEY,
    text VARCHAR(50) NOT NULL
);

-- 3. Payment Terms Reference Lookup
CREATE TABLE badeel_pay_term (
    key VARCHAR(50) PRIMARY KEY,
    text VARCHAR(100) NOT NULL
);

-- 4. Attachment Types Lookup
CREATE TABLE badeel_attach_type (
    key VARCHAR(100) PRIMARY KEY,
    text VARCHAR(100) NOT NULL
);

-- 5. Admin Activity Logs
CREATE TABLE badeel_admin_activity (
    id SERIAL PRIMARY KEY,
    company VARCHAR(100) NOT NULL,
    contact VARCHAR(100) NOT NULL,
    status VARCHAR(50) NOT NULL,
    status_state VARCHAR(20) NOT NULL,
    invited_on VARCHAR(50) NOT NULL
);

-- 6. Vendor Invitations Sent
CREATE TABLE badeel_vendor_invitation (
    id SERIAL PRIMARY KEY,
    company VARCHAR(100) NOT NULL,
    contact VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    status VARCHAR(50) NOT NULL,
    status_state VARCHAR(20) NOT NULL,
    invited_on VARCHAR(50) NOT NULL
);

-- 7. Vendor Profiles
CREATE TABLE badeel_vendor_profile (
    company VARCHAR(100) PRIMARY KEY,
    contact VARCHAR(100) NOT NULL,
    country VARCHAR(100) NOT NULL,
    status VARCHAR(50) NOT NULL,
    status_state VARCHAR(20) NOT NULL,
    qualification VARCHAR(50) NOT NULL,
    invited_on VARCHAR(50) NOT NULL,
    registered_on VARCHAR(50) DEFAULT '–',
    legal_name VARCHAR(150),
    tax_id VARCHAR(50),
    address TEXT,
    city VARCHAR(100),
    zip VARCHAR(20),
    contact_title VARCHAR(10),
    contact_first_name VARCHAR(100),
    contact_last_name VARCHAR(100),
    contact_email VARCHAR(100),
    contact_phone VARCHAR(50),
    bank_verified VARCHAR(10) DEFAULT 'No'
);

-- 8. Vendor Locations (Child of badeel_vendor_profile)
CREATE TABLE badeel_vendor_location (
    id SERIAL PRIMARY KEY,
    vendor_company VARCHAR(100) REFERENCES badeel_vendor_profile(company) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    city VARCHAR(100) NOT NULL,
    country VARCHAR(100) NOT NULL
);

-- 9. Vendor Categories (Child of badeel_vendor_profile)
CREATE TABLE badeel_vendor_category (
    id SERIAL PRIMARY KEY,
    vendor_company VARCHAR(100) REFERENCES badeel_vendor_profile(company) ON DELETE CASCADE,
    category_name VARCHAR(100) NOT NULL
);

-- 10. Vendor Bank Details
CREATE TABLE badeel_vendor_bank (
    id SERIAL PRIMARY KEY,
    vendor_company VARCHAR(100) REFERENCES badeel_vendor_profile(company) ON DELETE CASCADE,
    bank_name VARCHAR(100) NOT NULL,
    account VARCHAR(50) NOT NULL,
    swift VARCHAR(20) NOT NULL,
    currency VARCHAR(10) NOT NULL
);

-- 11. Vendor Qualification Documents
CREATE TABLE badeel_vendor_doc (
    id SERIAL PRIMARY KEY,
    vendor_company VARCHAR(100) REFERENCES badeel_vendor_profile(company) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    size VARCHAR(20) NOT NULL,
    type VARCHAR(100)
);

-- 12. Purchase Orders
CREATE TABLE badeel_purchase_order (
    po_number VARCHAR(50) PRIMARY KEY,
    entity VARCHAR(150) NOT NULL,
    description TEXT,
    po_value NUMERIC(15,2) NOT NULL,
    remaining NUMERIC(15,2) NOT NULL,
    contract_ref VARCHAR(50),
    currency VARCHAR(10) NOT NULL,
    advance_paid NUMERIC(15,2) DEFAULT 0,
    billing TEXT,
    tax TEXT
);

-- 13. Completion Requests (CR)
CREATE TABLE badeel_completion_request (
    request_no VARCHAR(50) PRIMARY KEY,
    po_number VARCHAR(50) REFERENCES badeel_purchase_order(po_number),
    vendor VARCHAR(100) NOT NULL,
    line_summary TEXT,
    submitted_on VARCHAR(50) NOT NULL,
    reviewed_on VARCHAR(50) DEFAULT '–',
    reviewer VARCHAR(100) DEFAULT '–',
    status VARCHAR(50) NOT NULL,
    status_state VARCHAR(20) NOT NULL,
    comments TEXT,
    coc_no VARCHAR(50)
);

-- 14. Completion Request Line Items
CREATE TABLE badeel_completion_request_line (
    id SERIAL PRIMARY KEY,
    request_no VARCHAR(50) REFERENCES badeel_completion_request(request_no) ON DELETE CASCADE,
    description TEXT NOT NULL,
    ordered VARCHAR(50) NOT NULL,
    requested VARCHAR(50) NOT NULL
);

-- 15. Completion Request Attachments
CREATE TABLE badeel_completion_request_attach (
    id SERIAL PRIMARY KEY,
    request_no VARCHAR(50) REFERENCES badeel_completion_request(request_no) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    type VARCHAR(100) NOT NULL
);

-- 16. Certificates of Completion (CoC)
CREATE TABLE badeel_certificate_of_completion (
    coc_no VARCHAR(50) PRIMARY KEY,
    po_number VARCHAR(50) REFERENCES badeel_purchase_order(po_number),
    vendor VARCHAR(100) NOT NULL,
    issue_date VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL,
    status_state VARCHAR(20) NOT NULL,
    accepted_lines INTEGER DEFAULT 0,
    accepted_qty VARCHAR(50) DEFAULT '0',
    accepted_amount VARCHAR(50) NOT NULL,
    approved_by VARCHAR(100) NOT NULL,
    subtitle TEXT,
    source_cr VARCHAR(50)
);

-- 17. Certificate of Completion Line Items
CREATE TABLE badeel_coc_line (
    id SERIAL PRIMARY KEY,
    coc_no VARCHAR(50) REFERENCES badeel_certificate_of_completion(coc_no) ON DELETE CASCADE,
    description TEXT NOT NULL,
    ordered_qty VARCHAR(50) NOT NULL,
    accepted_qty VARCHAR(50) NOT NULL,
    remaining_qty VARCHAR(50) NOT NULL,
    accepted_amount VARCHAR(50) NOT NULL,
    price NUMERIC(15,2) NOT NULL,
    line_no VARCHAR(20) NOT NULL,
    qty NUMERIC(15,2) NOT NULL
);

-- 18. Certificate of Completion Attachments
CREATE TABLE badeel_coc_attach (
    id SERIAL PRIMARY KEY,
    coc_no VARCHAR(50) REFERENCES badeel_certificate_of_completion(coc_no) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    type VARCHAR(100) NOT NULL
);

-- 19. Vendor Invoices
CREATE TABLE badeel_vendor_invoice (
    invoice_no VARCHAR(50) PRIMARY KEY,
    po_number VARCHAR(50) REFERENCES badeel_purchase_order(po_number),
    entity VARCHAR(150) NOT NULL,
    vendor VARCHAR(100) NOT NULL,
    net_payable VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL,
    status_state VARCHAR(20) NOT NULL,
    date VARCHAR(50) NOT NULL,
    due_date VARCHAR(50) NOT NULL,
    terms VARCHAR(50) NOT NULL,
    gross VARCHAR(50) NOT NULL,
    advance VARCHAR(50) NOT NULL,
    net VARCHAR(50) NOT NULL,
    rejection TEXT DEFAULT ''
);

-- 20. Vendor Invoice Line Items
CREATE TABLE badeel_vendor_invoice_line (
    id SERIAL PRIMARY KEY,
    invoice_no VARCHAR(50) REFERENCES badeel_vendor_invoice(invoice_no) ON DELETE CASCADE,
    description TEXT NOT NULL,
    qty VARCHAR(50) NOT NULL,
    price VARCHAR(50) NOT NULL,
    tax VARCHAR(10) NOT NULL,
    total VARCHAR(50) NOT NULL
);

-- 21. Vendor Invoice Attachments
CREATE TABLE badeel_vendor_invoice_attach (
    id SERIAL PRIMARY KEY,
    invoice_no VARCHAR(50) REFERENCES badeel_vendor_invoice(invoice_no) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    type VARCHAR(100) NOT NULL
);


--------------------------------------------------------------------------------
PART 2: SQL SEED MOCK DATA
--------------------------------------------------------------------------------

-- Lookup Data Seed
INSERT INTO badeel_country (key, text, is_tax_country) VALUES
('United Kingdom', 'United Kingdom', TRUE),
('Spain', 'Spain', TRUE),
('Germany', 'Germany', TRUE),
('Greece', 'Greece', TRUE),
('Portugal', 'Portugal', TRUE),
('United Arab Emirates', 'United Arab Emirates', TRUE),
('Singapore', 'Singapore', FALSE),
('Nigeria', 'Nigeria', FALSE),
('Other', 'Other', FALSE);

INSERT INTO badeel_currency (key, text) VALUES
('EUR', 'EUR'),
('USD', 'USD'),
('GBP', 'GBP');

INSERT INTO badeel_pay_term (key, text) VALUES
('Net 30', 'Net 30'),
('Net 45', 'Net 45'),
('Net 60', 'Net 60');

INSERT INTO badeel_attach_type (key, text) VALUES
('Tax Invoice', 'Tax Invoice (required)'),
('Supporting Document', 'Supporting Document');

-- Admin Activity Logs Seed
INSERT INTO badeel_admin_activity (company, contact, status, status_state, invited_on) VALUES
('Stellar Marine Logistics', 'Ms. Ines Duarte', 'Invitation Sent', 'Information', '05 Jul 2026'),
('Horizon Facilities Group', 'Mr. Marcus Weber', 'Invitation Sent', 'Information', '01 Jul 2026'),
('Bright Line IT Consulting', 'Mr. Daniel Okafor', 'Pending Registration', 'Warning', '25 Jun 2026'),
('Cedar Engineering Works', 'Ms. Hessa Al Otaibi', 'Registered', 'Success', '20 Apr 2026'),
('Vertex Cloud Services', 'Mr. Yousef Kamal', 'Registered', 'Success', '11 Apr 2026');

-- Vendor Invitations Seed
INSERT INTO badeel_vendor_invitation (company, contact, email, status, status_state, invited_on) VALUES
('Stellar Marine Logistics', 'Ms. Ines Duarte', 'ines.duarte@stellarmarine.com', 'Invitation Sent', 'Information', '05 Jul 2026'),
('Horizon Facilities Group', 'Mr. Marcus Weber', 'm.weber@horizonfg.com', 'Invitation Sent', 'Information', '01 Jul 2026'),
('Bright Line IT Consulting', 'Mr. Daniel Okafor', 'daniel@brightlineit.com', 'Pending Registration', 'Warning', '25 Jun 2026');

-- Vendor Profiles Seed
INSERT INTO badeel_vendor_profile (company, contact, country, status, status_state, qualification, invited_on, registered_on, legal_name, tax_id, address, city, zip, contact_title, contact_first_name, contact_last_name, contact_email, contact_phone, bank_verified) VALUES
('Stellar Marine Logistics', 'Ms. Ines Duarte', 'Portugal', 'Invitation Sent', 'Information', 'Not Started', '05 Jul 2026', '–', 'Stellar Marine Logistics Lda.', 'PT509876543', 'Rua do Ouro 120', 'Lisbon', '1100-062', 'Ms.', 'Ines', 'Duarte', 'ines.duarte@stellarmarine.com', '+351 21 555 0110', 'No'),
('Horizon Facilities Group', 'Mr. Marcus Weber', 'Germany', 'Invitation Sent', 'Information', 'Not Started', '01 Jul 2026', '–', 'Horizon Facilities GmbH', 'DE811234567', 'Hauptstrasse 45', 'Munich', '80331', 'Mr.', 'Marcus', 'Weber', 'm.weber@horizonfg.com', '+49 89 555 0134', 'No'),
('Bright Line IT Consulting', 'Mr. Daniel Okafor', 'Nigeria', 'Pending Registration', 'Warning', 'Not Started', '25 Jun 2026', '–', 'Bright Line IT Ltd.', 'NG900123456', 'Adetokunbo Ademola St 12', 'Lagos', '101241', 'Mr.', 'Daniel', 'Okafor', 'daniel@brightlineit.com', '+234 1 555 0199', 'No'),
('Atlas Engineering Ltd.', 'Mr. Karim Haddad', 'Greece', 'Registered', 'Success', 'Approved', '15 May 2026', '16 May 2026', 'Atlas Engineering & Construction SA', 'EL094123456', 'Leoforos Syngrou 45', 'Athens', '11743', 'Mr.', 'Karim', 'Haddad', 'k.haddad@atlasengineering.gr', '+30 210 555 0123', 'Yes'),
('Cedar Engineering Works', 'Ms. Hessa Al Otaibi', 'United Arab Emirates', 'Registered', 'Success', 'Under Review', '20 Apr 2026', '22 Apr 2026', 'Cedar Engineering Works LLC', 'AE100987654300003', 'Sheikh Zayed Rd, Capital Tower', 'Dubai', 'P.O. Box 9912', 'Ms.', 'Hessa', 'Al Otaibi', 'hessa@cedarengineering.ae', '+971 4 555 0188', 'Yes'),
('Vertex Cloud Services', 'Mr. Yousef Kamal', 'Singapore', 'Registered', 'Success', 'Approved', '11 Apr 2026', '12 Apr 2026', 'Vertex Cloud Services Pte. Ltd.', 'SG201912345G', 'Marina Boulevard 10', 'Singapore', '018983', 'Mr.', 'Yousef', 'Kamal', 'y.kamal@vertexcloud.com', '+65 6555 0145', 'Yes');

-- Vendor Locations Seed
INSERT INTO badeel_vendor_location (vendor_company, name, city, country) VALUES
('Stellar Marine Logistics', 'Lisbon HQ', 'Lisbon', 'Portugal'),
('Horizon Facilities Group', 'Munich Office', 'Munich', 'Germany'),
('Bright Line IT Consulting', 'Lagos HQ', 'Lagos', 'Nigeria'),
('Atlas Engineering Ltd.', 'Athens Headquarters', 'Athens', 'Greece'),
('Atlas Engineering Ltd.', 'Riyadh Branch', 'Riyadh', 'Saudi Arabia'),
('Cedar Engineering Works', 'Dubai HQ', 'Dubai', 'United Arab Emirates'),
('Vertex Cloud Services', 'Singapore HQ', 'Singapore', 'Singapore');

-- Vendor Categories Seed
INSERT INTO badeel_vendor_category (vendor_company, category_name) VALUES
('Stellar Marine Logistics', 'Logistics'),
('Stellar Marine Logistics', 'Freight Forwarding'),
('Horizon Facilities Group', 'Facilities Management'),
('Horizon Facilities Group', 'Cleaning'),
('Bright Line IT Consulting', 'IT Hardware'),
('Bright Line IT Consulting', 'Software'),
('Atlas Engineering Ltd.', 'Civil Engineering'),
('Atlas Engineering Ltd.', 'Marine Structures'),
('Cedar Engineering Works', 'Heavy Machinery'),
('Cedar Engineering Works', 'Industrial Piping'),
('Vertex Cloud Services', 'Cloud Providers'),
('Vertex Cloud Services', 'IT Consulting');

-- Vendor Banks Seed
INSERT INTO badeel_vendor_bank (vendor_company, bank_name, account, swift, currency) VALUES
('Atlas Engineering Ltd.', 'Alpha Bank', 'GR76 0140 1230 1234 5678 9012 345', 'ALPHGR2A', 'EUR'),
('Cedar Engineering Works', 'Emirates NBD', 'AE45 0030 0000 1234 5678 901', 'EBILAEAD', 'AED'),
('Vertex Cloud Services', 'DBS Bank', 'DBS1234567890', 'DBSSSGSG', 'SGD');

-- Vendor Docs Seed
INSERT INTO badeel_vendor_doc (vendor_company, name, size, type) VALUES
('Atlas Engineering Ltd.', 'com-registration.pdf', '420 KB', 'Commercial Registration'),
('Atlas Engineering Ltd.', 'tax-certificate.pdf', '310 KB', 'Tax Certificate'),
('Cedar Engineering Works', 'cr-dubai-2026.pdf', '550 KB', 'Commercial Registration'),
('Vertex Cloud Services', 'acra-bizfile.pdf', '280 KB', 'Commercial Registration');

-- Purchase Orders Seed
INSERT INTO badeel_purchase_order (po_number, entity, description, po_value, remaining, contract_ref, currency, advance_paid, billing, tax) VALUES
('PO-100234', 'Badeel Marine', 'Port equipment maintenance', 120000.00, 88000.00, 'CTR-2025-014', 'EUR', 20000.00, 'Badeel Marine, Riyadh, KSA', 'VAT 15% - Reg. 300123456700003'),
('PO-100240', 'Badeel Facilities', 'Annual cleaning services', 60000.00, 45000.00, 'CTR-2025-021', 'EUR', 0.00, 'Badeel Facilities, Jeddah, KSA', 'VAT 15% - Reg. 300123456700003'),
('PO-100255', 'Badeel IT', 'Cloud infrastructure setup', 95000.00, 95000.00, 'CTR-2025-030', 'EUR', 15000.00, 'Badeel IT, Riyadh, KSA', 'VAT 15% - Reg. 300123456700003');

-- Completion Requests Seed
INSERT INTO badeel_completion_request (request_no, po_number, vendor, line_summary, submitted_on, reviewed_on, reviewer, status, status_state, comments, coc_no) VALUES
('CR-2026-0007', 'PO-100234', 'Atlas Engineering Ltd.', '1 line - Crane inspection', '02 Jul 2026', '–', '–', 'Under Review', 'Warning', 'Crane structural integrity checked. Ready for invoice.', NULL),
('CR-2026-0009', 'PO-100255', 'Vertex Cloud Services', '1 line - Network configuration', '06 Jul 2026', '–', '–', 'Submitted', 'Information', 'Network configuration completed and validated with the client team.', NULL),
('CR-2026-0010', 'PO-100234', 'Atlas Freight Partners', '1 line - Spare parts kit', '07 Jul 2026', '–', '–', 'Submitted', 'Information', 'Spare parts delivered to the port warehouse.', NULL),
('CR-2026-0003', 'PO-100240', 'Atlas Engineering Ltd.', '1 line - Deep cleaning', '22 Jun 2026', '24 Jun 2026', 'Karim Haddad (Procurement)', 'Accepted', 'Success', 'Services rendered completely.', 'COC-2026-0012');

-- Completion Request Lines Seed
INSERT INTO badeel_completion_request_line (request_no, description, ordered, requested) VALUES
('CR-2026-0007', '10 - Crane annual safety and load inspection', '1 JOB', '1 JOB'),
('CR-2026-0009', '20 - Network configuration', '1 JOB', '1 JOB'),
('CR-2026-0010', '30 - Spare parts kit', '6 SET', '4 SET'),
('CR-2026-0003', '10 - Deep cleaning - Block B', '10', '4');

-- Completion Request Attachments Seed
INSERT INTO badeel_completion_request_attach (request_no, name, type) VALUES
('CR-2026-0007', 'crane-inspection-cert.pdf', 'Service Completion Record'),
('CR-2026-0009', 'network-config-signoff.pdf', 'Service Completion Record'),
('CR-2026-0010', 'waybill-9921.pdf', 'Waybill'),
('CR-2026-0010', 'delivery-photos.zip', 'Photos'),
('CR-2026-0003', 'block-b-cleaning.pdf', 'Service Completion Record');

-- Certificates of Completion Seed
INSERT INTO badeel_certificate_of_completion (coc_no, po_number, vendor, issue_date, status, status_state, accepted_lines, accepted_qty, accepted_amount, approved_by, subtitle, source_cr) VALUES
('COC-2026-0012', 'PO-100240', 'Atlas Engineering Ltd.', '24 Jun 2026', 'Approved', 'Success', 1, '4', '€6,000.00', 'F. Al Harbi (Procurement)', 'Approved - Facilities cleaning', 'CR-2026-0003'),
('COC-2026-0021', 'PO-100240', 'Horizon Facilities Group', '28 Jun 2026', 'Approved', 'Success', 1, '4', '€6,000.00', 'F. Al Harbi (Procurement)', 'Approved - Facilities cleaning', ''),
('COC-2026-0024', 'PO-100255', 'Vertex Cloud Services', '30 Jun 2026', 'Approved', 'Success', 1, '1', '€40,000.00', 'S. Nasser (Requester)', 'Approved - Landing zone design', '');

-- Certificate of Completion Lines Seed
INSERT INTO badeel_coc_line (coc_no, description, ordered_qty, accepted_qty, remaining_qty, accepted_amount, price, line_no, qty) VALUES
('COC-2026-0012', '10 - Deep cleaning - Block B', '10', '4', '6', '€6,000.00', 1500.00, '10', 4.00),
('COC-2026-0021', '10 - Deep cleaning - Block B', '10', '4', '6', '€6,000.00', 1500.00, '10', 4.00),
('COC-2026-0024', '10 - Landing zone design', '1', '1', '0', '€40,000.00', 40000.00, '10', 1.00);

-- Certificate of Completion Attachments Seed
INSERT INTO badeel_coc_attach (coc_no, name, type) VALUES
('COC-2026-0012', 'block-b-cleaning.pdf', 'Service Completion Record'),
('COC-2026-0021', 'block-b-cleaning.pdf', 'Service Completion Record'),
('COC-2026-0024', 'landing-zone-final.pdf', 'Service Completion Record');

-- Vendor Invoices Seed
INSERT INTO badeel_vendor_invoice (invoice_no, po_number, entity, vendor, net_payable, status, status_state, date, due_date, terms, gross, advance, net, rejection) VALUES
('INV-2026-0071', 'PO-100234', 'Badeel - National Renewable Energy Program (NREP)', 'Atlas Engineering Ltd.', '€18,500.00', 'Draft', 'None', '03 Jul 2026', '02 Aug 2026', 'Net 30', '€18,500.00', '– €0.00', '€18,500.00', ''),
('INV-2026-0041', 'PO-100234', 'Badeel - National Renewable Energy Program (NREP)', 'Atlas Engineering Ltd.', '€70,000.00', 'Approved', 'Success', '02 Jun 2026', '02 Jul 2026', 'Net 30', '€90,000.00', '– €20,000.00', '€70,000.00', ''),
('INV-2026-0019', 'PO-100255', 'Badeel - National Renewable Energy Program (NREP)', 'Atlas Engineering Ltd.', '€25,000.00', 'Paid', 'Success', '28 Apr 2026', '28 May 2026', 'Net 30', '€40,000.00', '– €15,000.00', '€25,000.00', ''),
('INV-2026-0007', 'PO-100240', 'Badeel - National Renewable Energy Program (NREP)', 'Atlas Engineering Ltd.', '€4,200.00', 'Rejected', 'Error', '15 Apr 2026', '15 May 2026', 'Net 30', '€4,200.00', '– €0.00', '€4,200.00', 'Missing mandatory compliance document.');

-- Vendor Invoice Lines Seed
INSERT INTO badeel_vendor_invoice_line (invoice_no, description, qty, price, tax, total) VALUES
('INV-2026-0071', 'Engineering consultancy', '10', '€1,850.00', '0', '€18,500.00'),
('INV-2026-0041', 'Solar panel installation', '1', '€90,000.00', '0', '€90,000.00'),
('INV-2026-0019', 'Cloud migration support', '1', '€40,000.00', '0', '€40,000.00'),
('INV-2026-0007', 'Office waste removal', '1', '€4,200.00', '0', '€4,200.00');

-- Vendor Invoice Attachments Seed
INSERT INTO badeel_vendor_invoice_attach (invoice_no, name, type) VALUES
('INV-2026-0041', 'tax-invoice-0041.pdf', 'Tax Invoice'),
('INV-2026-0041', 'completion-cert.pdf', 'Certificate of Completion');


--------------------------------------------------------------------------------
PART 3: NEPTUNE DXP SERVER SCRIPTS (JavaScript Node.js)
--------------------------------------------------------------------------------

// 1. DXP Server Script: getKpiData
// Endpoint: GET /api/kpi-data
async function getKpiData(req, res) {
    try {
        const profileCounts = await entityManager.query("SELECT status, COUNT(*) as cnt FROM entityset_badeel_vendor_profile GROUP BY status");
        const invoiceCounts = await entityManager.query("SELECT status, COUNT(*) as cnt FROM entityset_badeel_vendor_invoice GROUP BY status");
        const cocCountResult = await entityManager.query("SELECT COUNT(*) as cnt FROM entityset_badeel_certificate_of_completion WHERE status = 'Approved'");
        const inviteCountResult = await entityManager.query("SELECT COUNT(*) as cnt FROM entityset_badeel_vendor_invitation");

        let kpi = {
            SUMMARY: {
                vendorsInvited: 8,
                pendingRegistration: 2,
                underReview: 1,
                approvedCoCs: 5,
                totalInvoices: 12,
                pendingPayment: 4,
                paidInvoices: 6,
                rejectedInvoices: 2
            }
        };

        let registered = 0;
        profileCounts.forEach(r => {
            if (r.status === 'Registered') registered = parseInt(r.cnt);
            if (r.status === 'Pending Registration') kpi.SUMMARY.pendingRegistration = parseInt(r.cnt);
            if (r.status === 'Under Review') kpi.SUMMARY.underReview = parseInt(r.cnt);
        });

        let totalInvited = parseInt(inviteCountResult[0]?.cnt || 0) + registered;
        if (totalInvited > 0) kpi.SUMMARY.vendorsInvited = totalInvited;

        if (cocCountResult[0]) {
            kpi.SUMMARY.approvedCoCs = parseInt(cocCountResult[0].cnt || 5);
        }

        let totalInvoices = 0;
        let pendingPayment = 0;
        let paid = 0;
        let rejected = 0;
        invoiceCounts.forEach(r => {
            const cnt = parseInt(r.cnt);
            totalInvoices += cnt;
            if (r.status === 'Submitted' || r.status === 'Approved') pendingPayment += cnt;
            if (r.status === 'Paid') paid += cnt;
            if (r.status === 'Rejected') rejected += cnt;
        });

        if (totalInvoices > 0) {
            kpi.SUMMARY.totalInvoices = totalInvoices;
            kpi.SUMMARY.pendingPayment = pendingPayment;
            kpi.SUMMARY.paidInvoices = paid;
            kpi.SUMMARY.rejectedInvoices = rejected;
        }

        result.data = kpi;
        result.statusCode = 200;
    } catch (err) {
        result.data = { error: err.message };
        result.statusCode = 500;
    }
}

// 2. DXP Server Script: getAdminActivity
// Endpoint: GET /api/admin-activity
async function getAdminActivity(req, res) {
    try {
        const data = await entityManager.query("SELECT * FROM entityset_badeel_admin_activity ORDER BY id DESC");
        result.data = { ITEMS: data };
        result.statusCode = 200;
    } catch (err) {
        result.data = { error: err.message };
        result.statusCode = 500;
    }
}

// 3. DXP Server Script: getVendors
// Endpoint: GET /api/vendors
async function getVendors(req, res) {
    try {
        const vendors = await entityManager.query("SELECT * FROM entityset_badeel_vendor_profile ORDER BY company ASC");
        const locations = await entityManager.query("SELECT * FROM entityset_badeel_vendor_location");
        const categories = await entityManager.query("SELECT * FROM entityset_badeel_vendor_category");
        
        const response = vendors.map(v => {
            v.locations = locations.filter(l => l.vendor_company === v.company).map(l => ({ name: l.name, city: l.city, country: l.country }));
            v.categories = categories.filter(c => c.vendor_company === v.company).map(c => c.category_name);
            return v;
        });

        result.data = { ITEMS: response };
        result.statusCode = 200;
    } catch (err) {
        result.data = { error: err.message };
        result.statusCode = 500;
    }
}

// 4. DXP Server Script: getInvoices
// Endpoint: GET /api/invoices
async function getInvoices(req, res) {
    try {
        const invoices = await entityManager.query("SELECT * FROM entityset_badeel_vendor_invoice ORDER BY date DESC");
        const lines = await entityManager.query("SELECT * FROM entityset_badeel_vendor_invoice_line");
        const attachments = await entityManager.query("SELECT * FROM entityset_badeel_vendor_invoice_attach");

        const response = invoices.map(inv => {
            inv.lines = lines.filter(l => l.invoice_no === inv.invoice_no).map(l => ({
                description: l.description,
                qty: l.qty,
                price: l.price,
                tax: l.tax,
                total: l.total
            }));
            inv.attachments = attachments.filter(a => a.invoice_no === inv.invoice_no).map(a => ({
                name: a.name,
                type: a.type
            }));
            return inv;
        });

        result.data = { ITEMS: response };
        result.statusCode = 200;
    } catch (err) {
        result.data = { error: err.message };
        result.statusCode = 500;
    }
}

// 5. DXP Server Script: getCompletionRequests
// Endpoint: GET /api/completion-requests
async function getCompletionRequests(req, res) {
    try {
        const requests = await entityManager.query("SELECT * FROM entityset_badeel_completion_request ORDER BY submitted_on DESC");
        const lines = await entityManager.query("SELECT * FROM entityset_badeel_completion_request_line");
        const attachments = await entityManager.query("SELECT * FROM entityset_badeel_completion_request_attach");

        const response = requests.map(req => {
            req.lines = lines.filter(l => l.request_no === req.request_no).map(l => ({
                description: l.description,
                ordered: l.ordered,
                requested: l.requested
            }));
            req.attachments = attachments.filter(a => a.request_no === req.request_no).map(a => ({
                name: a.name,
                type: a.type
            }));
            return req;
        });

        result.data = { ITEMS: response };
        result.statusCode = 200;
    } catch (err) {
        result.data = { error: err.message };
        result.statusCode = 500;
    }
}

// 6. DXP Server Script: getCertificatesOfCompletion
// Endpoint: GET /api/coc-list
async function getCertificatesOfCompletion(req, res) {
    try {
        const cocs = await entityManager.query("SELECT * FROM entityset_badeel_certificate_of_completion ORDER BY issue_date DESC");
        const lines = await entityManager.query("SELECT * FROM entityset_badeel_coc_line");
        const attachments = await entityManager.query("SELECT * FROM entityset_badeel_coc_attach");

        const response = cocs.map(coc => {
            coc.lines = lines.filter(l => l.coc_no === coc.coc_no).map(l => ({
                description: l.description,
                orderedQty: l.ordered_qty,
                acceptedQty: l.accepted_qty,
                remainingQty: l.remaining_qty,
                acceptedAmount: l.accepted_amount,
                price: parseFloat(l.price),
                lineNo: l.line_no,
                qty: parseFloat(l.qty)
            }));
            coc.attachments = attachments.filter(a => a.coc_no === coc.coc_no).map(a => ({
                name: a.name,
                type: a.type
            }));
            return coc;
        });

        result.data = { ITEMS: response };
        result.statusCode = 200;
    } catch (err) {
        result.data = { error: err.message };
        result.statusCode = 500;
    }
}

// 7. DXP Server Script: getPurchaseOrders
// Endpoint: GET /api/purchase-orders
async function getPurchaseOrders(req, res) {
    try {
        const data = await entityManager.query("SELECT * FROM entityset_badeel_purchase_order ORDER BY po_number ASC");
        result.data = { ITEMS: data };
        result.statusCode = 200;
    } catch (err) {
        result.data = { error: err.message };
        result.statusCode = 500;
    }
}

// 8. DXP Server Script: getLookups
// Endpoint: GET /api/lookups
async function getLookups(req, res) {
    try {
        const countries = await entityManager.query("SELECT * FROM entityset_badeel_country");
        const currencies = await entityManager.query("SELECT * FROM entityset_badeel_currency");
        const payTerms = await entityManager.query("SELECT * FROM entityset_badeel_pay_term");
        const attachTypes = await entityManager.query("SELECT * FROM entityset_badeel_attach_type");

        result.data = {
            countries: countries.map(c => ({ key: c.key, text: c.text, isTaxCountry: c.is_tax_country })),
            currencies: currencies.map(c => ({ key: c.key, text: c.text })),
            paymentTerms: payTerms.map(p => ({ key: p.key, text: p.text })),
            attachmentTypes: attachTypes.map(a => ({ key: a.key, text: a.text }))
        };
        result.statusCode = 200;
    } catch (err) {
        result.data = { error: err.message };
        result.statusCode = 500;
    }
}
*/
