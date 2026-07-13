var resp = xhr.responseJSON;
var rows = (resp && resp.data !== undefined) ? resp.data : resp;
modeloInvoicesVendorTable.setData(rows || []);
oInvoicesVendorTable.bindItems({ path: "/", template: liIVendorTable });