const T = { lookup: 'entityset_nep_lookup' };
async function q(sql, params) { return await entityManager.query(sql, params || []); }
function ok(data) { result.data = Object.assign({ success: true }, data || {}); result.statusCode = 200; return complete(); }
function bad(message) { result.data = { success: false, message: message }; result.statusCode = 500; return complete(); }

try {
  const rows = await q('SELECT category, key, text, "isTaxCountry" FROM ' + T.lookup);
  function byCat(cat) { return rows.filter(function (r) { return r.category === cat; }).map(function (r) { return { key: r.key, text: r.text }; }); }
  const countries = byCat('country');
  const taxCountries = rows.filter(function (r) { return r.category === 'country' && r.isTaxCountry; }).map(function (r) { return { key: r.key, text: r.text }; });
  return ok({
    countries: { ITEMS: countries },
    taxCountries: { ITEMS: taxCountries },
    currencies: { ITEMS: byCat('currency') },
    paymentTerms: { ITEMS: byCat('payTerm') },
    attachmentTypes: { ITEMS: byCat('attachType') },
    contactTitles: { ITEMS: byCat('contactTitle') },
    documentTypes: { ITEMS: byCat('docType') }
  });
} catch (err) { return bad(err.message); }
