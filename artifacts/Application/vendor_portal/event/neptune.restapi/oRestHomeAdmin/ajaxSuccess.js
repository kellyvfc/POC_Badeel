var resp = xhr.responseJSON;
var data = (resp && resp.data !== undefined) ? resp.data : resp;
var k = data.kpis || {};
oKpiVendorCountValue.setText(String(k.vendorCount != null ? k.vendorCount : 0));
oKpiPendingValue.setText(String(k.pendingCount != null ? k.pendingCount : 0));
oKpiRegisteredValue.setText(String(k.registeredCount != null ? k.registeredCount : 0));
oKpiActionableValue.setText(String(k.actionableInvoices != null ? k.actionableInvoices : 0));
modeloRecentVendorsTable.setData(data.recentVendors || []);
oRecentVendorsTable.bindItems({ path: "/", template: liRecentVendors });