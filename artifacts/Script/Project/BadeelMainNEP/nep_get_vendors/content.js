const T = { vendor: 'entityset_nep_vendor' };
async function q(sql, params) { return await entityManager.query(sql, params || []); }
function ok(data) { result.data = Object.assign({ success: true }, data || {}); result.statusCode = 200; return complete(); }
function bad(message) { result.data = { success: false, message: message }; result.statusCode = 500; return complete(); }

try {
  const rows = await q('SELECT company, contact, country, status, "statusState", qualification, "invitedOn", "registeredOn", "legalName", "taxId", address, city, zip, "contactTitle", "contactFirstName", "contactLastName", "contactEmail", "contactPhone", "bankVerified", categories, locations FROM ' + T.vendor + ' ORDER BY company ASC');
  return ok({ ITEMS: rows });
} catch (err) { return bad(err.message); }
