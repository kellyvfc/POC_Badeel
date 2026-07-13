var key = oEvent.getParameter("item").getKey();
var isAdmin = key === "admin";
oHomeAdminSection.setVisible(isAdmin);
oHomeVendorSection.setVisible(!isAdmin);
oNavItemVendors.setVisible(isAdmin);
oNavItemInvite.setVisible(isAdmin);
oNavItemQualification.setVisible(!isAdmin);
oNavItemCreateInvoice.setVisible(!isAdmin);
if (typeof oInvoicesAdminTable !== "undefined") { oInvoicesAdminTable.setVisible(isAdmin); }
if (typeof oInvoicesVendorTable !== "undefined") { oInvoicesVendorTable.setVisible(!isAdmin); }