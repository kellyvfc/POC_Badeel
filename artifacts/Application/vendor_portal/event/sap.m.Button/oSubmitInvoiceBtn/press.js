var poNumber = oCreatePOSelect.getSelectedKey();
if (!poNumber) { sap.m.MessageToast.show("Please select a purchase order."); return; }
var invoiceId = oCInvNumberInput.getValue().trim() || ("INV-2026-" + String(1000 + Math.floor(Math.random() * 8999)).slice(-4));
var payload = {
  invoiceId: invoiceId,
  poNumber: poNumber,
  invoiceDate: oCInvDateInput.getValue(),
  dueDate: oCDueDateInput.getValue(),
  paymentTerms: oCPaymentTermsInput.getValue(),
  status: "Submitted",
  lineItems: [{
    Description: oCLineDescInput.getValue(),
    Quantity: oCQtyInput.getValue(),
    UnitPrice: oCUnitPriceInput.getValue(),
    TaxPercent: oCTaxPercentInput.getValue()
  }],
  attachments: []
};
jQuery.ajax({
  url: "/api/serverscript/vendor-portal-api/invoices",
  method: "POST",
  contentType: "application/json",
  data: JSON.stringify(payload),
  success: function() {
    sap.m.MessageToast.show("Invoice " + invoiceId + ("Submitted" === "Draft" ? " saved as draft." : " submitted for approval."));
    oCInvNumberInput.setValue("");
    oCLineDescInput.setValue("");
  },
  error: function(xhr) { sap.m.MessageToast.show((xhr.responseJSON && xhr.responseJSON.error) || "Failed to save invoice."); }
});