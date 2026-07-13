var resp = xhr.responseJSON;
var rows = (resp && resp.data !== undefined) ? resp.data : resp;
modeloVendorTable.setData(rows || []);
modeloRecentInvitesTable.setData((rows || []).filter(function(v){ return v.status === "Invitation Sent" || v.status === "Pending Registration"; }));
oVendorTable.bindItems({ path: "/", template: liVendor });
oRecentInvitesTable.bindItems({ path: "/", template: liRecentInvite });