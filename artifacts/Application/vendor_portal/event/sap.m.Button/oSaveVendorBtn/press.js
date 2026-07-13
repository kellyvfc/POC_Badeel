var payload = modeloVendorDetailForm.getData();
var vendorId = oVendorDetailPage.data("currentVendorId");
jQuery.ajax({
  url: "/api/serverscript/vendor-portal-api/vendors/" + vendorId,
  method: "PUT",
  contentType: "application/json",
  data: JSON.stringify(payload),
  success: function() { sap.m.MessageToast.show("Vendor saved."); },
  error: function() { sap.m.MessageToast.show("Save failed."); }
});