const T = { vendor: 'entityset_nep_vendor', invoice: 'entityset_nep_invoice', compReq: 'entityset_nep_completion_request', coc: 'entityset_nep_certificate_of_completion' };
async function q(sql, params) { return await entityManager.query(sql, params || []); }
function ok(data) { result.data = Object.assign({ success: true }, data || {}); result.statusCode = 200; return complete(); }
function bad(message) { result.data = { success: false, message: message }; result.statusCode = 500; return complete(); }
async function countWhere(table, col, val) {
  const r = await q('SELECT COUNT(*)::int AS n FROM ' + table + ' WHERE "' + col + '" = $1', [val]);
  return r[0].n;
}
async function countAll(table) {
  const r = await q('SELECT COUNT(*)::int AS n FROM ' + table);
  return r[0].n;
}

try {
  const vendorsInvited = await countAll(T.vendor);
  const pendingRegistration = await countWhere(T.vendor, 'status', 'Pending Registration');
  const registeredVendors = await countWhere(T.vendor, 'status', 'Registered');
  const invoicesPendingReview = await countWhere(T.invoice, 'status', 'Submitted');
  const draftInvoices = await countWhere(T.invoice, 'status', 'Draft');
  const submittedInvoices = await countWhere(T.invoice, 'status', 'Submitted');
  const invoicesUnderApproval = await countWhere(T.invoice, 'status', 'Under Review');
  const paidInvoices = await countWhere(T.invoice, 'status', 'Paid');
  const approvedInvoices = await countWhere(T.invoice, 'status', 'Approved');
  const admCompReqAwaiting = await countWhere(T.compReq, 'status', 'Submitted');
  const approvedCoCs = await countWhere(T.coc, 'status', 'Approved');

  return ok({
    SUMMARY: {
      vendorsInvited: vendorsInvited,
      pendingRegistration: pendingRegistration,
      registeredVendors: registeredVendors,
      invoicesPendingReview: invoicesPendingReview,
      draftInvoices: draftInvoices,
      submittedInvoices: submittedInvoices,
      approvedInvoices: approvedInvoices,
      openPurchaseOrders: 3,
      compReqAwaiting: admCompReqAwaiting,
      approvedCoCs: approvedCoCs,
      invoicesUnderApproval: invoicesUnderApproval,
      paidInvoices: paidInvoices,
      admCompReqAwaiting: admCompReqAwaiting
    }
  });
} catch (err) { return bad(err.message); }
