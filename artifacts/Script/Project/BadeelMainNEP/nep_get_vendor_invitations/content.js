const T = { invitation: 'entityset_nep_vendor_invitation' };
async function q(sql, params) { return await entityManager.query(sql, params || []); }
function input() { const b = (typeof req !== 'undefined' && req && req.body) ? req.body : {}; const qy = (typeof req !== 'undefined' && req && req.query) ? req.query : {}; return Object.assign({}, qy, b); }
function ok(data) { result.data = Object.assign({ success: true }, data || {}); result.statusCode = 200; return complete(); }
function bad(message) { result.data = { success: false, message: message }; result.statusCode = 500; return complete(); }

try {
  const inp = input();
  let limit = parseInt(inp.limit, 10);
  if (!Number.isFinite(limit) || limit <= 0 || limit > 200) limit = 200;
  const rows = await q('SELECT "company", "contact", "email", "status", "statusState", "invitedOn" FROM ' + T.invitation + ' ORDER BY "createdAt" ASC LIMIT ' + limit);
  return ok({ ITEMS: rows });
} catch (err) { return bad(err.message); }
