// nep_seed_data — one-time idempotent seed for badeel_main_nep backend tables.
// Populates: nep_lookup, nep_vendor_invitation, nep_vendor, nep_vendor_bank,
// nep_vendor_document, nep_purchase_order, nep_invoice, nep_completion_request,
// nep_certificate_of_completion. Mirrors the hardcoded mock data literally
// present in the badeel_main_nep app's GlobalFunctions script.

function nowMs() { return Date.now(); }
function currentUser() { try { if (typeof req !== 'undefined' && req && req.user) return req.user.username || req.user.email || req.user.id || 'nep_seed'; } catch (e) {} return 'nep_seed'; }
async function q(sql, params) { return await entityManager.query(sql, params || []); }

async function isEmpty(table) {
  const r = await q('SELECT COUNT(*)::int AS n FROM ' + table);
  return r[0].n === 0;
}

async function insertRows(table, cols, jsonCols, rows) {
  const ts = nowMs(), u = currentUser();
  let inserted = 0;
  for (const row of rows) {
    const allCols = cols.concat(['createdAt', 'updatedAt', 'createdBy', 'updatedBy']);
    const vals = cols.map(function (c) {
      const v = row[c];
      if (jsonCols.indexOf(c) > -1) return v === undefined || v === null ? null : JSON.stringify(v);
      return v === undefined ? null : v;
    });
    const allVals = vals.concat([ts, ts, u, u]);
    const colList = allCols.map(function (c) { return '"' + c + '"'; }).join(',');
    const ph = allVals.map(function (_, i) {
      const c = allCols[i];
      return jsonCols.indexOf(c) > -1 ? ('$' + (i + 1) + '::json') : ('$' + (i + 1));
    }).join(',');
    await q('INSERT INTO ' + table + ' (' + colList + ') VALUES (' + ph + ')', allVals);
    inserted++;
  }
  return inserted;
}

const EUR = '€';
const DASH = '–';
const MID = '·';

try {
  const summary = {};

  // ---------------- nep_lookup ----------------
  if (await isEmpty('entityset_nep_lookup')) {
    const rows = [];
    [['United Kingdom', true], ['Spain', true], ['Germany', true], ['Greece', true], ['Portugal', true], ['United Arab Emirates', true], ['Singapore', false], ['Nigeria', false], ['Other', false]]
      .forEach(function (c) { rows.push({ category: 'country', key: c[0], text: c[0], isTaxCountry: c[1] }); });
    ['EUR', 'USD', 'GBP'].forEach(function (c) { rows.push({ category: 'currency', key: c, text: c, isTaxCountry: null }); });
    ['Net 30', 'Net 45', 'Net 60'].forEach(function (c) { rows.push({ category: 'payTerm', key: c, text: c, isTaxCountry: null }); });
    rows.push({ category: 'attachType', key: 'Tax Invoice', text: 'Tax Invoice (required)', isTaxCountry: null });
    rows.push({ category: 'attachType', key: 'Supporting Document', text: 'Supporting Document', isTaxCountry: null });
    ['Mr.', 'Ms.', 'Mrs.', 'Dr.'].forEach(function (c) { rows.push({ category: 'contactTitle', key: c, text: c, isTaxCountry: null }); });
    rows.push({ category: 'docType', key: 'Delivery Note', text: 'Delivery Note', isTaxCountry: null });
    rows.push({ category: 'docType', key: 'Service Completion Record', text: 'Service Completion Record', isTaxCountry: null });
    rows.push({ category: 'docType', key: 'Waybill', text: 'Waybill', isTaxCountry: null });
    rows.push({ category: 'docType', key: 'Photos', text: 'Photos', isTaxCountry: null });
    rows.push({ category: 'docType', key: 'Other', text: 'Other supporting documentation', isTaxCountry: null });
    summary.nep_lookup = await insertRows('entityset_nep_lookup', ['category', 'key', 'text', 'isTaxCountry'], [], rows);
  } else { summary.nep_lookup = 'skipped (not empty)'; }

  // ---------------- nep_vendor_invitation ----------------
  if (await isEmpty('entityset_nep_vendor_invitation')) {
    const rows = [
      { company: 'Stellar Marine Logistics', contact: 'Ms. Ines Duarte', email: 'ines.duarte@stellarmarine.com', status: 'Invitation Sent', statusState: 'Information', invitedOn: '05 Jul 2026' },
      { company: 'Horizon Facilities Group', contact: 'Mr. Marcus Weber', email: 'm.weber@horizonfg.com', status: 'Invitation Sent', statusState: 'Information', invitedOn: '01 Jul 2026' },
      { company: 'Bright Line IT Consulting', contact: 'Mr. Daniel Okafor', email: 'daniel@brightlineit.com', status: 'Pending Registration', statusState: 'Warning', invitedOn: '25 Jun 2026' },
      { company: 'NovaTech Digital Solutions', contact: 'Mr. Rahul Menon', email: 'rahul.menon@novatech.io', status: 'Pending Registration', statusState: 'Warning', invitedOn: '18 Jun 2026' },
      { company: 'Meridian Supply Chain Co.', contact: 'Ms. Elena Papadopoulos', email: 'elena.p@meridiansc.com', status: 'Registered', statusState: 'Success', invitedOn: '04 May 2026' },
      { company: 'Atlas Freight Partners', contact: 'Mr. Omar Siddiqui', email: 'omar@atlasfreight.com', status: 'Registered', statusState: 'Success', invitedOn: '28 Apr 2026' },
      { company: 'Cedar Engineering Works', contact: 'Ms. Hessa Al Otaibi', email: 'hessa@cedarengineering.ae', status: 'Registered', statusState: 'Success', invitedOn: '20 Apr 2026' },
      { company: 'Vertex Cloud Services', contact: 'Mr. Yousef Kamal', email: 'y.kamal@vertexcloud.com', status: 'Registered', statusState: 'Success', invitedOn: '11 Apr 2026' }
    ];
    summary.nep_vendor_invitation = await insertRows('entityset_nep_vendor_invitation', ['company', 'contact', 'email', 'status', 'statusState', 'invitedOn'], [], rows);
  } else { summary.nep_vendor_invitation = 'skipped (not empty)'; }

  // ---------------- nep_vendor ----------------
  if (await isEmpty('entityset_nep_vendor')) {
    const rows = [
      { company: 'Stellar Marine Logistics', contact: 'Ms. Ines Duarte', country: 'Portugal', status: 'Invitation Sent', statusState: 'Information', qualification: 'Not Started', invitedOn: '05 Jul 2026', registeredOn: DASH, legalName: 'Stellar Marine Logistics Lda.', taxId: 'PT509876543', address: 'Rua do Ouro 120', city: 'Lisbon', zip: '1100-062', contactTitle: 'Ms.', contactFirstName: 'Ines', contactLastName: 'Duarte', contactEmail: 'ines.duarte@stellarmarine.com', contactPhone: '+351 21 555 0110', bankVerified: 'No', categories: ['Logistics', 'Freight Forwarding'], locations: [{ name: 'Lisbon HQ', city: 'Lisbon', country: 'Portugal' }] },
      { company: 'Horizon Facilities Group', contact: 'Mr. Marcus Weber', country: 'Germany', status: 'Invitation Sent', statusState: 'Information', qualification: 'Not Started', invitedOn: '01 Jul 2026', registeredOn: DASH, legalName: 'Horizon Facilities GmbH', taxId: 'DE811234567', address: 'Hauptstrasse 45', city: 'Munich', zip: '80331', contactTitle: 'Mr.', contactFirstName: 'Marcus', contactLastName: 'Weber', contactEmail: 'm.weber@horizonfg.com', contactPhone: '+49 89 555 0134', bankVerified: 'No', categories: ['Facilities Management', 'Cleaning'], locations: [{ name: 'Munich Office', city: 'Munich', country: 'Germany' }] },
      { company: 'Bright Line IT Consulting', contact: 'Mr. Daniel Okafor', country: 'Nigeria', status: 'Pending Registration', statusState: 'Warning', qualification: 'In Progress', invitedOn: '25 Jun 2026', registeredOn: DASH, legalName: 'Bright Line IT Consulting Ltd.', taxId: 'NG12345678', address: '14 Adeola Odeku St', city: 'Lagos', zip: '101241', contactTitle: 'Mr.', contactFirstName: 'Daniel', contactLastName: 'Okafor', contactEmail: 'daniel@brightlineit.com', contactPhone: '+234 1 555 0190', bankVerified: 'No', categories: ['IT Consulting', 'Software'], locations: [{ name: 'Lagos HQ', city: 'Lagos', country: 'Nigeria' }] },
      { company: 'Meridian Supply Chain Co.', contact: 'Ms. Elena Papadopoulos', country: 'Greece', status: 'Registered', statusState: 'Success', qualification: 'Approved', invitedOn: '04 May 2026', registeredOn: '12 May 2026', legalName: 'Meridian Supply Chain S.A.', taxId: 'EL998877665', address: 'Leof. Kifisias 200', city: 'Athens', zip: '11525', contactTitle: 'Ms.', contactFirstName: 'Elena', contactLastName: 'Papadopoulos', contactEmail: 'elena.p@meridiansc.com', contactPhone: '+30 21 555 0155', bankVerified: 'Yes', categories: ['Supply Chain', 'Warehousing', 'Distribution'], locations: [{ name: 'Athens DC', city: 'Athens', country: 'Greece' }, { name: 'Thessaloniki Hub', city: 'Thessaloniki', country: 'Greece' }] },
      { company: 'Atlas Freight Partners', contact: 'Mr. Omar Siddiqui', country: 'United Arab Emirates', status: 'Registered', statusState: 'Success', qualification: 'Approved', invitedOn: '28 Apr 2026', registeredOn: '03 May 2026', legalName: 'Atlas Freight Partners FZE', taxId: 'AE100234567800003', address: 'Jebel Ali Free Zone', city: 'Dubai', zip: '17000', contactTitle: 'Mr.', contactFirstName: 'Omar', contactLastName: 'Siddiqui', contactEmail: 'omar@atlasfreight.com', contactPhone: '+971 4 555 0178', bankVerified: 'Yes', categories: ['Freight', 'Customs Clearance'], locations: [{ name: 'Dubai HQ', city: 'Dubai', country: 'United Arab Emirates' }] },
      { company: 'Atlas Engineering Ltd.', contact: 'Ms. Sofia Marin', country: 'Spain', status: 'Registered', statusState: 'Success', qualification: 'Approved', invitedOn: '20 Apr 2026', registeredOn: '26 Apr 2026', legalName: 'Atlas Engineering Ltd.', taxId: 'ESB12345674', address: 'Calle Mayor 45', city: 'Madrid', zip: '28013', contactTitle: 'Ms.', contactFirstName: 'Sofia', contactLastName: 'Marin', contactEmail: 'sofia.marin@atlaseng.com', contactPhone: '+34 91 555 0147', bankVerified: 'Yes', categories: ['Engineering', 'Construction', 'Renewable Energy'], locations: [{ name: 'Madrid HQ', city: 'Madrid', country: 'Spain' }] }
    ];
    summary.nep_vendor = await insertRows('entityset_nep_vendor',
      ['company', 'contact', 'country', 'status', 'statusState', 'qualification', 'invitedOn', 'registeredOn', 'legalName', 'taxId', 'address', 'city', 'zip', 'contactTitle', 'contactFirstName', 'contactLastName', 'contactEmail', 'contactPhone', 'bankVerified', 'categories', 'locations'],
      ['categories', 'locations'], rows);
  } else { summary.nep_vendor = 'skipped (not empty)'; }

  // ---------------- nep_vendor_bank ----------------
  if (await isEmpty('entityset_nep_vendor_bank')) {
    const rows = [
      { vendorCompany: 'Atlas Engineering Ltd.', bankName: 'Banco Santander', account: 'ES91 2100 0418 4502 0005 1332', swift: 'BSCHESMM', currency: 'EUR' }
    ];
    summary.nep_vendor_bank = await insertRows('entityset_nep_vendor_bank', ['vendorCompany', 'bankName', 'account', 'swift', 'currency'], [], rows);
  } else { summary.nep_vendor_bank = 'skipped (not empty)'; }

  // ---------------- nep_vendor_document ----------------
  if (await isEmpty('entityset_nep_vendor_document')) {
    const rows = [
      { vendorCompany: 'Atlas Engineering Ltd.', name: 'com-registration.pdf', size: '420 KB', type: 'Commercial Registration' },
      { vendorCompany: 'Atlas Engineering Ltd.', name: 'tax-certificate.pdf', size: '310 KB', type: 'Tax Certificate' },
      { vendorCompany: 'Cedar Engineering Works', name: 'cr-dubai-2026.pdf', size: '550 KB', type: 'Commercial Registration' },
      { vendorCompany: 'Vertex Cloud Services', name: 'acra-bizfile.pdf', size: '280 KB', type: 'Commercial Registration' }
    ];
    summary.nep_vendor_document = await insertRows('entityset_nep_vendor_document', ['vendorCompany', 'name', 'size', 'type'], [], rows);
  } else { summary.nep_vendor_document = 'skipped (not empty)'; }

  // ---------------- nep_purchase_order ----------------
  if (await isEmpty('entityset_nep_purchase_order')) {
    const rows = [
      { poNumber: 'PO-100234', entity: 'Badeel Marine', description: 'Port equipment maintenance', contractRef: 'CTR-2025-014', currency: 'EUR', advancePaid: 20000, billing: 'Badeel Marine, Riyadh, KSA', tax: 'VAT 15% - Reg. 300123456700003', lines: [
        { lineNo: '10', description: 'Crane inspection & servicing', unit: 'EA', orderedQty: 4, acceptedQty: 2, price: 12000 },
        { lineNo: '20', description: 'Conveyor belt overhaul', unit: 'EA', orderedQty: 2, acceptedQty: 0, price: 18000 },
        { lineNo: '30', description: 'Spare parts kit', unit: 'SET', orderedQty: 6, acceptedQty: 0, price: 3000 }
      ] },
      { poNumber: 'PO-100240', entity: 'Badeel Facilities', description: 'Annual cleaning services', contractRef: 'CTR-2025-021', currency: 'EUR', advancePaid: 0, billing: 'Badeel Facilities, Jeddah, KSA', tax: 'VAT 15% - Reg. 300123456700003', lines: [
        { lineNo: '10', description: 'Deep cleaning - Block A', unit: 'JOB', orderedQty: 12, acceptedQty: 6, price: 2500 },
        { lineNo: '20', description: 'Window cleaning - Towers', unit: 'JOB', orderedQty: 8, acceptedQty: 3, price: 1500 }
      ] },
      { poNumber: 'PO-100255', entity: 'Badeel IT', description: 'Cloud infrastructure setup', contractRef: 'CTR-2025-030', currency: 'EUR', advancePaid: 15000, billing: 'Badeel IT, Riyadh, KSA', tax: 'VAT 15% - Reg. 300123456700003', lines: [
        { lineNo: '10', description: 'Landing zone design', unit: 'JOB', orderedQty: 1, acceptedQty: 0, price: 40000 },
        { lineNo: '20', description: 'Network configuration', unit: 'JOB', orderedQty: 1, acceptedQty: 0, price: 30000 },
        { lineNo: '30', description: 'Managed support (months)', unit: 'MO', orderedQty: 12, acceptedQty: 0, price: 2083.33 }
      ] }
    ];
    summary.nep_purchase_order = await insertRows('entityset_nep_purchase_order', ['poNumber', 'entity', 'description', 'contractRef', 'currency', 'advancePaid', 'billing', 'tax', 'lines'], ['lines'], rows);
  } else { summary.nep_purchase_order = 'skipped (not empty)'; }

  // ---------------- nep_invoice ----------------
  if (await isEmpty('entityset_nep_invoice')) {
    const rows = [
      { invoiceNo: 'INV-2026-0071', poNumber: 'PO-100234', entity: 'Badeel - National Renewable Energy Program (NREP)', vendor: 'Atlas Engineering Ltd.', netPayable: EUR + '18,500.00', status: 'Draft', statusState: 'None', date: '03 Jul 2026', dueDate: '02 Aug 2026', terms: 'Net 30', gross: EUR + '18,500.00', advance: DASH + ' ' + EUR + '0.00', net: EUR + '18,500.00', rejection: '', lines: [{ description: 'Engineering consultancy', qty: '10', price: EUR + '1,850.00', tax: '0', total: EUR + '18,500.00' }], attachments: [] },
      { invoiceNo: 'INV-2026-0041', poNumber: 'PO-100234', entity: 'Badeel - National Renewable Energy Program (NREP)', vendor: 'Atlas Engineering Ltd.', netPayable: EUR + '70,000.00', status: 'Approved', statusState: 'Success', date: '02 Jun 2026', dueDate: '02 Jul 2026', terms: 'Net 30', gross: EUR + '90,000.00', advance: DASH + ' ' + EUR + '20,000.00', net: EUR + '70,000.00', rejection: '', lines: [{ description: 'Solar panel installation', qty: '1', price: EUR + '90,000.00', tax: '0', total: EUR + '90,000.00' }], attachments: [{ name: 'tax-invoice-0041.pdf', type: 'Tax Invoice' }, { name: 'completion-cert.pdf', type: 'Certificate of Completion' }] },
      { invoiceNo: 'INV-2026-0035', poNumber: 'PO-100240', entity: 'Badeel Facilities', vendor: 'Atlas Engineering Ltd.', netPayable: EUR + '12,300.00', status: 'Submitted', statusState: 'Information', date: '20 May 2026', dueDate: '19 Jun 2026', terms: 'Net 30', gross: EUR + '12,300.00', advance: DASH + ' ' + EUR + '0.00', net: EUR + '12,300.00', rejection: '', lines: [{ description: 'Cleaning services', qty: '3', price: EUR + '4,100.00', tax: '0', total: EUR + '12,300.00' }], attachments: [{ name: 'tax-invoice-0035.pdf', type: 'Tax Invoice' }] },
      { invoiceNo: 'INV-2026-0028', poNumber: 'PO-100255', entity: 'Badeel IT', vendor: 'Atlas Engineering Ltd.', netPayable: EUR + '8,900.00', status: 'Under Review', statusState: 'Warning', date: '11 May 2026', dueDate: '10 Jun 2026', terms: 'Net 45', gross: EUR + '8,900.00', advance: DASH + ' ' + EUR + '0.00', net: EUR + '8,900.00', rejection: '', lines: [{ description: 'Cloud setup', qty: '1', price: EUR + '8,900.00', tax: '0', total: EUR + '8,900.00' }], attachments: [] },
      { invoiceNo: 'INV-2026-0019', poNumber: 'PO-100255', entity: 'Badeel IT', vendor: 'Atlas Engineering Ltd.', netPayable: EUR + '25,000.00', status: 'Paid', statusState: 'Success', date: '28 Apr 2026', dueDate: '28 May 2026', terms: 'Net 30', gross: EUR + '25,000.00', advance: DASH + ' ' + EUR + '0.00', net: EUR + '25,000.00', rejection: '', lines: [{ description: 'Software licenses', qty: '50', price: EUR + '500.00', tax: '0', total: EUR + '25,000.00' }], attachments: [{ name: 'tax-invoice-0019.pdf', type: 'Tax Invoice' }] },
      { invoiceNo: 'INV-2026-0007', poNumber: 'PO-100240', entity: 'Badeel Facilities', vendor: 'Atlas Engineering Ltd.', netPayable: EUR + '4,200.00', status: 'Rejected', statusState: 'Error', date: '15 Apr 2026', dueDate: '15 May 2026', terms: 'Net 30', gross: EUR + '4,200.00', advance: DASH + ' ' + EUR + '0.00', net: EUR + '4,200.00', rejection: 'Missing certificate of completion. Please attach and resubmit.', lines: [{ description: 'Ad-hoc maintenance', qty: '2', price: EUR + '2,100.00', tax: '0', total: EUR + '4,200.00' }], attachments: [] }
    ];
    summary.nep_invoice = await insertRows('entityset_nep_invoice', ['invoiceNo', 'poNumber', 'entity', 'vendor', 'netPayable', 'status', 'statusState', 'date', 'dueDate', 'terms', 'gross', 'advance', 'net', 'rejection', 'lines', 'attachments'], ['lines', 'attachments'], rows);
  } else { summary.nep_invoice = 'skipped (not empty)'; }

  // ---------------- nep_completion_request ----------------
  if (await isEmpty('entityset_nep_completion_request')) {
    const rows = [
      { requestNo: 'CR-2026-0007', poNumber: 'PO-100234', vendor: 'Atlas Engineering Ltd.', lineSummary: '1 line - Crane inspection', submittedOn: '02 Jul 2026', reviewedOn: DASH, reviewer: DASH, status: 'Under Review', statusState: 'Warning', comments: 'Crane servicing completed on site. Signed acceptance from the operations supervisor is attached.', rejection: null, cocNo: null, lines: [{ description: '10 - Crane inspection & servicing', ordered: '4 EA', requested: '2 EA' }], attachments: [{ name: 'crane-inspection-report.pdf', type: 'Service Completion Record' }, { name: 'site-photos.zip', type: 'Photos' }] },
      { requestNo: 'CR-2026-0005', poNumber: 'PO-100240', vendor: 'Atlas Engineering Ltd.', lineSummary: '2 lines - Cleaning', submittedOn: '20 Jun 2026', reviewedOn: '24 Jun 2026', reviewer: 'F. Al Harbi (Procurement)', status: 'Accepted', statusState: 'Success', comments: 'Deep cleaning of Block A and window cleaning of the towers completed as scheduled.', rejection: null, cocNo: null, lines: [{ description: '10 - Deep cleaning - Block A', ordered: '12 JOB', requested: '6 JOB' }, { description: '20 - Window cleaning - Towers', ordered: '8 JOB', requested: '3 JOB' }], attachments: [{ name: 'delivery-note-block-a.pdf', type: 'Delivery Note' }, { name: 'service-record-towers.pdf', type: 'Service Completion Record' }] },
      { requestNo: 'CR-2026-0004', poNumber: 'PO-100234', vendor: 'Atlas Engineering Ltd.', lineSummary: '1 line - Crane inspection', submittedOn: '15 May 2026', reviewedOn: '18 May 2026', reviewer: 'S. Nasser (Requester)', status: 'Accepted', statusState: 'Success', comments: 'First batch of crane inspections completed.', rejection: null, cocNo: null, lines: [{ description: '10 - Crane inspection & servicing', ordered: '4 EA', requested: '2 EA' }], attachments: [{ name: 'crane-batch1.pdf', type: 'Service Completion Record' }] },
      { requestNo: 'CR-2026-0002', poNumber: 'PO-100255', vendor: 'Atlas Engineering Ltd.', lineSummary: '1 line - Landing zone', submittedOn: '10 May 2026', reviewedOn: '13 May 2026', reviewer: 'S. Nasser (Requester)', status: 'Rejected', statusState: 'Error', comments: 'Landing zone design draft submitted for acceptance.', rejection: 'Landing zone design not yet signed off by the architecture board. Please resubmit after formal sign-off.', cocNo: null, lines: [{ description: '10 - Landing zone design', ordered: '1 JOB', requested: '1 JOB' }], attachments: [{ name: 'landing-zone-design.pdf', type: 'Other' }] },
      { requestNo: 'CR-2026-0009', poNumber: 'PO-100255', vendor: 'Vertex Cloud Services', lineSummary: '1 line - Network configuration', submittedOn: '06 Jul 2026', reviewedOn: DASH, reviewer: DASH, status: 'Submitted', statusState: 'Information', comments: 'Network configuration completed and validated with the client team.', rejection: null, cocNo: null, lines: [{ description: '20 - Network configuration', ordered: '1 JOB', requested: '1 JOB' }], attachments: [{ name: 'network-config-signoff.pdf', type: 'Service Completion Record' }] },
      { requestNo: 'CR-2026-0010', poNumber: 'PO-100234', vendor: 'Atlas Freight Partners', lineSummary: '1 line - Spare parts kit', submittedOn: '07 Jul 2026', reviewedOn: DASH, reviewer: DASH, status: 'Submitted', statusState: 'Information', comments: 'Spare parts delivered to the port warehouse.', rejection: null, cocNo: null, lines: [{ description: '30 - Spare parts kit', ordered: '6 SET', requested: '4 SET' }], attachments: [{ name: 'waybill-9921.pdf', type: 'Waybill' }, { name: 'delivery-photos.zip', type: 'Photos' }] }
    ];
    summary.nep_completion_request = await insertRows('entityset_nep_completion_request', ['requestNo', 'poNumber', 'vendor', 'lineSummary', 'submittedOn', 'reviewedOn', 'reviewer', 'status', 'statusState', 'comments', 'rejection', 'cocNo', 'lines', 'attachments'], ['lines', 'attachments'], rows);
  } else { summary.nep_completion_request = 'skipped (not empty)'; }

  // ---------------- nep_certificate_of_completion ----------------
  if (await isEmpty('entityset_nep_certificate_of_completion')) {
    const rows = [
      { cocNo: 'COC-2026-0012', poNumber: 'PO-100240', vendor: 'Atlas Engineering Ltd.', issueDate: '24 Jun 2026', status: 'Approved', statusState: 'Success', acceptedLines: '2', acceptedQty: '9', acceptedAmount: EUR + '19,500.00', approvedBy: 'F. Al Harbi (Procurement)', subtitle: 'Approved ' + MID + ' Annual cleaning services', sourceCR: null, lines: [{ description: '10 - Deep cleaning - Block A', orderedQty: '12', acceptedQty: '6', remainingQty: '6', acceptedAmount: EUR + '15,000.00', price: 2500, lineNo: '10', qty: 6 }, { description: '20 - Window cleaning - Towers', orderedQty: '8', acceptedQty: '3', remainingQty: '5', acceptedAmount: EUR + '4,500.00', price: 1500, lineNo: '20', qty: 3 }], attachments: [{ name: 'delivery-note-block-a.pdf', type: 'Delivery Note' }, { name: 'service-record-towers.pdf', type: 'Service Completion Record' }] },
      { cocNo: 'COC-2026-0009', poNumber: 'PO-100234', vendor: 'Atlas Engineering Ltd.', issueDate: '18 May 2026', status: 'Approved', statusState: 'Success', acceptedLines: '1', acceptedQty: '2', acceptedAmount: EUR + '24,000.00', approvedBy: 'S. Nasser (Requester)', subtitle: 'Approved ' + MID + ' Port equipment maintenance', sourceCR: null, lines: [{ description: '10 - Crane inspection & servicing', orderedQty: '4', acceptedQty: '2', remainingQty: '2', acceptedAmount: EUR + '24,000.00', price: 12000, lineNo: '10', qty: 2 }], attachments: [{ name: 'crane-inspection-report.pdf', type: 'Service Completion Record' }, { name: 'site-photos.zip', type: 'Photos' }] },
      { cocNo: 'COC-2026-0015', poNumber: 'PO-100234', vendor: 'Atlas Engineering Ltd.', issueDate: '05 Jul 2026', status: 'Pending Approval', statusState: 'Warning', acceptedLines: '1', acceptedQty: '2', acceptedAmount: EUR + '24,000.00', approvedBy: 'Awaiting Procurement', subtitle: 'Pending approval ' + MID + ' Port equipment maintenance', sourceCR: null, lines: [{ description: '10 - Crane inspection & servicing', orderedQty: '4', acceptedQty: '2', remainingQty: '0', acceptedAmount: EUR + '24,000.00', price: 12000, lineNo: '10', qty: 2 }], attachments: [{ name: 'crane-inspection-2.pdf', type: 'Service Completion Record' }] },
      { cocNo: 'COC-2026-0021', poNumber: 'PO-100240', vendor: 'Horizon Facilities Group', issueDate: '28 Jun 2026', status: 'Approved', statusState: 'Success', acceptedLines: '1', acceptedQty: '4', acceptedAmount: EUR + '6,000.00', approvedBy: 'F. Al Harbi (Procurement)', subtitle: 'Approved - Facilities cleaning', sourceCR: '', lines: [{ description: '10 - Deep cleaning - Block B', orderedQty: '10', acceptedQty: '4', remainingQty: '6', acceptedAmount: EUR + '6,000.00', price: 1500, lineNo: '10', qty: 4 }], attachments: [{ name: 'block-b-cleaning.pdf', type: 'Service Completion Record' }] },
      { cocNo: 'COC-2026-0024', poNumber: 'PO-100255', vendor: 'Vertex Cloud Services', issueDate: '30 Jun 2026', status: 'Approved', statusState: 'Success', acceptedLines: '1', acceptedQty: '1', acceptedAmount: EUR + '40,000.00', approvedBy: 'S. Nasser (Requester)', subtitle: 'Approved - Landing zone design', sourceCR: '', lines: [{ description: '10 - Landing zone design', orderedQty: '1', acceptedQty: '1', remainingQty: '0', acceptedAmount: EUR + '40,000.00', price: 40000, lineNo: '10', qty: 1 }], attachments: [{ name: 'landing-zone-final.pdf', type: 'Service Completion Record' }] }
    ];
    summary.nep_certificate_of_completion = await insertRows('entityset_nep_certificate_of_completion', ['cocNo', 'poNumber', 'vendor', 'issueDate', 'status', 'statusState', 'acceptedLines', 'acceptedQty', 'acceptedAmount', 'approvedBy', 'subtitle', 'sourceCR', 'lines', 'attachments'], ['lines', 'attachments'], rows);
  } else { summary.nep_certificate_of_completion = 'skipped (not empty)'; }

  result.data = { success: true, inserted: summary };
  result.statusCode = 200;
  return complete();
} catch (err) {
  result.data = { success: false, message: err.message, stack: err.stack };
  result.statusCode = 500;
  return complete();
}
