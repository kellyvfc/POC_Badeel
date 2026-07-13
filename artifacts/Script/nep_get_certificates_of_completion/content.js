const T = { coc: 'entityset_nep_certificate_of_completion' };
async function q(sql, params) { return await entityManager.query(sql, params || []); }
function input() { const b = (typeof req !== 'undefined' && req && req.body) ? req.body : {}; const qy = (typeof req !== 'undefined' && req && req.query) ? req.query : {}; return Object.assign({}, qy, b); }
function ok(data) { result.data = Object.assign({ success: true }, data || {}); result.statusCode = 200; return complete(); }
function bad(message) { result.data = { success: false, message: message }; result.statusCode = 500; return complete(); }

try {
  const inp = input();
  const where = [], params = [];
  if (inp.poNumber) { params.push(inp.poNumber); where.push('"poNumber" = $' + params.length); }
  if (inp.vendor) { params.push(inp.vendor); where.push('vendor = $' + params.length); }
  if (!inp.status || inp.status === 'all') {
    // no status filter 
  } else {
    params.push(inp.status); where.push('status = $' + params.length);
  }
  if (!inp.status) { where.push("status = 'Approved'"); }
  const whereSql = where.length ? (' WHERE ' + where.join(' AND ')) : '';
  const rows = await q('SELECT "cocNo", "poNumber", vendor, "issueDate", status, "statusState", "acceptedLines", "acceptedQty", "acceptedAmount", "approvedBy", subtitle, "sourceCR", lines, attachments FROM ' + T.coc + whereSql + ' ORDER BY "createdAt" DESC', params);
  return ok({ ITEMS: rows });
} catch (err) { return bad(err.message); }
