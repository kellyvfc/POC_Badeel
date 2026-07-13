var resp = xhr.responseJSON;
var rows = (resp && resp.data !== undefined) ? resp.data : resp;
var mine = (rows || []).filter(function(v){ return v.vendorId === "V1004"; })[0];
modeloQualForm.setData(mine || {});
oQualForm.setModel(modeloQualForm);