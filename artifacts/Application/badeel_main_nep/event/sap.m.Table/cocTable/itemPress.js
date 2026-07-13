let oItem = oEvent.getParameter('listItem') || oEvent.getSource();
if (!oItem) return;
let ctx = oItem.getBindingContext('CoCList');
if (!ctx) return;
openCoCDetail(ctx.getObject());