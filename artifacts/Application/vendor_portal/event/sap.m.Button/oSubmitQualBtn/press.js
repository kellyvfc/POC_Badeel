var payload = modeloQualForm.getData();
payload.vendorId = "V1004";
payload.submit = true;
jQuery.ajax({
  url: "/api/serverscript/vendor-portal-api/vendors/V1004/qualification",
  method: "POST",
  contentType: "application/json",
  data: JSON.stringify(payload),
  success: function(resp) {
    sap.m.MessageToast.show('Submitted for review.');
    if (resp && resp.data) { modeloQualForm.setData(resp.data); }
  },
  error: function() { sap.m.MessageToast.show("Save failed."); }
});