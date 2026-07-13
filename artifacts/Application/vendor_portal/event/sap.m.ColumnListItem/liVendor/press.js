var ctx = oEvent.getSource().getBindingContext();
var data = JSON.parse(JSON.stringify(ctx.getObject()));
modeloVendorDetailForm.setData(data);
oVendorDetailPage.data("currentVendorId", data.vendorId);
oVendorCategoriesText.setText((data.categories || []).join(", ") || "None");
oVendorLocationsText.setText((data.shipToLocations || []).map(function(l){ return l.Name + " (" + l.City + ", " + l.Country + ")"; }).join("; ") || "None");
oNavContainer.to(oVendorDetailPage);
oVendorDetailForm.setModel(modeloVendorDetailForm);