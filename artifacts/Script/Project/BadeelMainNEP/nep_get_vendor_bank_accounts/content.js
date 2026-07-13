const T = { bank: 'entityset_nep_vendor_bank' };
async function q(sql, params) { return await entityManager.query(sql, params || []); }
function input() { const b = (typeof req !== 'undefined' && req && req.body) ? req.body : {}; const qy = (typeof req !== 'undefined' && req && req.query) ? req.query : {}; return Object.assign({}, qy, b); }
function ok(data) { result.data = Object.assign({ success: true }, data || {}); result.statusCode = 200; return complete(); }
function bad(message) { result.data = { success: false, message: message }; result.statusCode = 500; return complete(); }

try {
  const inp = input();
  const vendorCompany = inp.vendorCompany || 'Atlas Engineering Ltd.';
  const rows = await q('SELECT "vendorCompany", "bankName", account, swift, currency FROM ' + T.bank + ' WHERE "vendorCompany" = $1', [vendorCompany]);
  return ok({ ITEMS: rows });
} catch (err) { return bad(err.message); }
