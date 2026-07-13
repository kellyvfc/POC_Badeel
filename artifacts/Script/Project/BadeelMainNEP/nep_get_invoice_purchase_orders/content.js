const T = { po: 'entityset_nep_purchase_order', coc: 'entityset_nep_certificate_of_completion' };
async function q(sql, params) { return await entityManager.query(sql, params || []); }
function ok(data) { result.data = Object.assign({ success: true }, data || {}); result.statusCode = 200; return complete(); }
function bad(message) { result.data = { success: false, message: message }; result.statusCode = 500; return complete(); }
function fmtEUR(n) { return '€' + Number(n || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }

try {
  const pos = await q('SELECT "poNumber", entity, description, "contractRef", currency, "advancePaid", billing, tax, lines FROM ' + T.po);
  const cocs = await q('SELECT "poNumber", status FROM ' + T.coc + " WHERE status = 'Approved'");
  const approvedPoNumbers = {};
  const cocCountByPo = {};
  cocs.forEach(function (c) {
    approvedPoNumbers[c.poNumber] = true;
    cocCountByPo[c.poNumber] = (cocCountByPo[c.poNumber] || 0) + 1;
  });
  const eligible = pos.filter(function (p) { return approvedPoNumbers[p.poNumber]; }).map(function (p) {
    const lines = p.lines || [];
    const remaining = lines.reduce(function (s, l) { return s + (l.orderedQty - l.acceptedQty) * l.price; }, 0);
    const value = lines.reduce(function (s, l) { return s + l.orderedQty * l.price; }, 0);
    return {
      poNumber: p.poNumber, entity: p.entity, description: p.description,
      poValue: fmtEUR(value), remaining: fmtEUR(remaining), contractRef: p.contractRef,
      currency: p.currency, advancePaid: Number(p.advancePaid), billing: p.billing, tax: p.tax,
      cocCount: (cocCountByPo[p.poNumber] || 0) + ' approved CoC(s)'
    };
  });
  return ok({ ITEMS: eligible });
} catch (err) { return bad(err.message); }
