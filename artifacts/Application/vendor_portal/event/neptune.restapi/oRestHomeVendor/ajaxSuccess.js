var resp = xhr.responseJSON;
var data = (resp && resp.data !== undefined) ? resp.data : resp;
var k = data.kpis || {};
oKpiDraftValue.setText(String(k.draftCount != null ? k.draftCount : 0));
oKpiSubmittedValue.setText(String(k.submittedCount != null ? k.submittedCount : 0));
oKpiApprovedValue.setText(String(k.approvedCount != null ? k.approvedCount : 0));
oKpiOpenPOValue.setText(String(k.openPOCount != null ? k.openPOCount : 0));
modeloRecentInvoicesTable.setData(data.recentInvoices || []);
oRecentInvoicesTable.bindItems({ path: "/", template: liRecentInvoices });