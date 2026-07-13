const T = { po: 'entityset_nep_purchase_order' };
async function q(sql, params) { return await entityManager.query(sql, params || []); }
function ok(data) { result.data = Object.assign({ success: true }, data || {}); result.statusCode = 200; return complete(); }
function bad(message) { result.data = { success: false, message: message }; result.statusCode = 500; return complete(); }

try {
  const rows = await q('SELECT "poNumber", entity, description, "contractRef", currency, "advancePaid", billing, tax, lines FROM ' + T.po + ' ORDER BY "poNumber" ASC');
  return ok({ ITEMS: rows });
} catch (err) { return bad(err.message); }
