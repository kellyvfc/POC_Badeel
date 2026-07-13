var resp = xhr.responseJSON;
var rows = (resp && resp.data !== undefined) ? resp.data : resp;
modeloInvoicesAdminTable.setData(rows || []);
oInvoicesAdminTable.bindItems({ path: "/", template: liIAdminTable });