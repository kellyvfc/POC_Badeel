var invoiceId = modeloInvoiceDetailModel.getData().invoiceId;
jQuery.ajax({
  url: "/api/serverscript/vendor-portal-api/invoices/" + invoiceId + "/decision",
  method: "POST",
  contentType: "application/json",
  data: JSON.stringify({ action: "approve" }),
  success: function(resp) {
    sap.m.MessageToast.show("Invoice approved.");
    oApproveBtn.setVisible(false);
    oRejectBtn.setVisible(false);
    if (resp && resp.data) { oInvoiceStatusText.setText(resp.data.status); }
  },
  error: function() { sap.m.MessageToast.show("Action failed."); }
});