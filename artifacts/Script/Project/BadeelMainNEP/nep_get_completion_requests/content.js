const T = { cr: 'entityset_nep_completion_request' };
async function q(sql, params) { return await entityManager.query(sql, params || []); }
function input() { const b = (typeof req !== 'undefined' && req && req.body) ? req.body : {}; const qy = (typeof req !== 'undefined' && req && req.query) ? req.query : {}; return Object.assign({}, qy, b); }
function ok(data) { result.data = Object.assign({ success: true }, data || {}); result.statusCode = 200; return complete(); }
function bad(message) { result.data = { success: false, message: message }; result.statusCode = 500; return complete(); }

try {
  const inp = input();
  const where = [], params = [];
  if (inp.status) { params.push(inp.status); where.push('status = $' + params.length); }
  if (inp.poNumber) { params.push(inp.poNumber); where.push('"poNumber" = $' + params.length); }
  if (inp.vendor) { params.push(inp.vendor); where.push('vendor = $' + params.length); }
  const whereSql = where.length ? (' WHERE ' + where.join(' AND ')) : '';
  const rows = await q('SELECT "requestNo", "poNumber", vendor, "lineSummary", "submittedOn", "reviewedOn", reviewer, status, "statusState", comments, rejection, "cocNo", lines, attachments FROM ' + T.cr + whereSql + ' ORDER BY "createdAt" DESC', params);
  return ok({ ITEMS: rows });
} catch (err) { return bad(err.message); }
