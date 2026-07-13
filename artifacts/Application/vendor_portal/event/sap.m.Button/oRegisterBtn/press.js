var categories = oRegCategoriesInput.getValue().split(",").map(function(s){ return s.trim(); }).filter(Boolean);
var payload = {
  email: oRegEmailInput.getValue().trim(),
  companyName: oRegCompanyInput.getValue().trim(),
  contactFirstName: oRegFirstInput.getValue().trim(),
  contactLastName: oRegLastInput.getValue().trim(),
  address: oRegAddressInput.getValue().trim(),
  city: oRegCityInput.getValue().trim(),
  country: oRegCountryInput.getValue().trim(),
  taxId: oRegTaxInput.getValue().trim(),
  categories: categories,
  shipToLocations: []
};
if (!payload.companyName || !payload.contactFirstName || !payload.contactLastName) {
  sap.m.MessageToast.show("Please complete all required fields.");
  return;
}
jQuery.ajax({
  url: "/api/serverscript/vendor-portal-api/vendors/register",
  method: "POST",
  contentType: "application/json",
  data: JSON.stringify(payload),
  success: function() { oNavContainer.to(oRegConfirmPage); },
  error: function(xhr) { sap.m.MessageToast.show((xhr.responseJSON && xhr.responseJSON.error) || "Registration failed."); }
});