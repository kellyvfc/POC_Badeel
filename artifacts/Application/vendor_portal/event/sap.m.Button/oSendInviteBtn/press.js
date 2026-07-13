var name = oInviteNameInput.getValue().trim();
var email = oInviteEmailInput.getValue().trim();
if (!name || !email) {
  sap.m.MessageToast.show("Please enter a name and email.");
  return;
}
jQuery.ajax({
  url: "/api/serverscript/vendor-portal-api/vendors/invite",
  method: "POST",
  contentType: "application/json",
  data: JSON.stringify({ vendors: [{ name: name, email: email }] }),
  success: function(resp) {
    sap.m.MessageToast.show("Invitation sent.");
    oInviteNameInput.setValue("");
    oInviteEmailInput.setValue("");
    var created = (resp && resp.data && resp.data.created) || [];
    var current = modeloRecentInvitesTable.getData() || [];
    modeloRecentInvitesTable.setData(created.concat(current));
  },
  error: function() { sap.m.MessageToast.show("Failed to send invitation."); }
});