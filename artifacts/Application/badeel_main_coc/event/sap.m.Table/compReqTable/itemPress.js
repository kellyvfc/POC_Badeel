let oItem = oEvent.getParameter('listItem') || oEvent.getSource();
if (!oItem) return;
let ctx = oItem.getBindingContext('CompReqList');
if (!ctx) return;
openCompReqDetail(ctx.getObject());