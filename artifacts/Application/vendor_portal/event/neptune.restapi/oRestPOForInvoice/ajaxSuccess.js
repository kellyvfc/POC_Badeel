var resp = xhr.responseJSON;
var rows = (resp && resp.data !== undefined) ? resp.data : resp;
modeloCreatePOSelect.setData(rows || []);
window.vpPOs = rows || [];
oCreatePOSelect.bindItems({ path: "/", template: itemPO });