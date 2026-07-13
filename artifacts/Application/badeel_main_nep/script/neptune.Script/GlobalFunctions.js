function initHomeData() {
	// KPIs for both roles
	sap.ui.getCore().setModel(modelKpiData, 'KpiData');
	// KPI figures come from getKpidata (and are recomputed from the live API-backed
	// arrays via recomputeAdminKpis). Start at zero; no hardcoded seed values.
	modelKpiData.setData({
		SUMMARY: {
			vendorsInvited: 0,
			pendingRegistration: 0,
			registeredVendors: 0,
			invoicesPendingReview: 0,
			draftInvoices: 0,
			submittedInvoices: 0,
			approvedInvoices: 0,
			openPurchaseOrders: 0,
			compReqAwaiting: 0,
			approvedCoCs: 0,
			invoicesUnderApproval: 0,
			paidInvoices: 0,
			admCompReqAwaiting: 0
		}
	});

	var adminItems = [
		{ company: 'Stellar Marine Logistics', contact: 'Ms. Ines Duarte', status: 'Invitation Sent', statusState: 'Information', invitedOn: '05 Jul 2026' },
		{ company: 'Horizon Facilities Group', contact: 'Mr. Marcus Weber', status: 'Invitation Sent', statusState: 'Information', invitedOn: '01 Jul 2026' },
		{ company: 'Bright Line IT Consulting', contact: 'Mr. Daniel Okafor', status: 'Pending Registration', statusState: 'Warning', invitedOn: '25 Jun 2026' },
		{ company: 'NovaTech Digital Solutions', contact: 'Mr. Rahul Menon', status: 'Pending Registration', statusState: 'Warning', invitedOn: '18 Jun 2026' },
		{ company: 'Meridian Supply Chain Co.', contact: 'Ms. Elena Papadopoulos', status: 'Registered', statusState: 'Success', invitedOn: '04 May 2026' },
		{ company: 'Atlas Freight Partners', contact: 'Mr. Omar Siddiqui', status: 'Registered', statusState: 'Success', invitedOn: '28 Apr 2026' },
		{ company: 'Cedar Engineering Works', contact: 'Ms. Hessa Al Otaibi', status: 'Registered', statusState: 'Success', invitedOn: '20 Apr 2026' },
		{ company: 'Vertex Cloud Services', contact: 'Mr. Yousef Kamal', status: 'Registered', statusState: 'Success', invitedOn: '11 Apr 2026' }
	];
	modelAdminActivity.setData({ ITEMS: adminItems });

	var invoiceItems = [
		{ invoiceNo: 'INV-2026-0071', poNumber: 'PO-100234', netPayable: '\u20ac18,500.00', status: 'Draft', statusState: 'None', date: '03 Jul 2026' },
		{ invoiceNo: 'INV-2026-0041', poNumber: 'PO-100234', netPayable: '\u20ac70,000.00', status: 'Approved', statusState: 'Success', date: '02 Jun 2026' },
		{ invoiceNo: 'INV-2026-0035', poNumber: 'PO-100240', netPayable: '\u20ac12,300.00', status: 'Submitted', statusState: 'Information', date: '20 May 2026' },
		{ invoiceNo: 'INV-2026-0028', poNumber: 'PO-100255', netPayable: '\u20ac8,900.00', status: 'Under Review', statusState: 'Warning', date: '11 May 2026' },
		{ invoiceNo: 'INV-2026-0019', poNumber: 'PO-100255', netPayable: '\u20ac25,000.00', status: 'Paid', statusState: 'Success', date: '28 Apr 2026' },
		{ invoiceNo: 'INV-2026-0007', poNumber: 'PO-100240', netPayable: '\u20ac4,200.00', status: 'Rejected', statusState: 'Error', date: '15 Apr 2026' }
	];
	modelVendorInvoices.setData({ ITEMS: invoiceItems });

	applyRole('admin');
}

function applyRole(role) {
	if (role === 'vendor') {
		vboxAdmin.setVisible(false);
		vboxVendor.setVisible(true);
		txtWelcomeTitle.setText('Welcome back, Karim Haddad');
		txtWelcomeSub.setText('Here is an overview of your completion requests, CoCs and invoices.');
		btnRoleVendor.addStyleClass('badeel_main_roleBtnActive');
		btnRoleAdmin.removeStyleClass('badeel_main_roleBtnActive');
		// Vendor sidebar menu: Home, Qualification Profile, Completion Requests, CoCs, Create Invoice, Invoice History, Payment Status
		navInviteText.setText('Qualification Profile');
		navInviteIcon.setSrc('sap-icon://document-text');
		navVendorsText.setText('Create Invoice');
		navVendorsIcon.setSrc('sap-icon://add-document');
		navInvoicesText.setText('Invoice History');
		navInvoicesIcon.setSrc('sap-icon://document-text');
		navCompReq.setVisible(true);
		navCoC.setVisible(true);
		navVendors.setVisible(true);
		navVendorsAdmin.setVisible(false);
	} else {
		vboxAdmin.setVisible(true);
		vboxVendor.setVisible(false);
		txtWelcomeTitle.setText('Welcome back, Karim Haddad');
		txtWelcomeSub.setText('Here is an overview of vendor onboarding and invoicing activity.');
		btnRoleAdmin.addStyleClass('badeel_main_roleBtnActive');
		btnRoleVendor.removeStyleClass('badeel_main_roleBtnActive');
		// Admin sidebar menu: Home, Invite Vendors, Vendors, Invoices
		navInviteText.setText('Invite Vendors');
		navInviteIcon.setSrc('sap-icon://add-contact');
		navVendorsText.setText('Vendors');
		navVendorsIcon.setSrc('sap-icon://group');
		navInvoicesText.setText('Invoices');
		navInvoicesIcon.setSrc('sap-icon://money-bills');
		navCompReq.setVisible(true);
		navCoC.setVisible(true);
		navVendors.setVisible(false);
		navVendorsAdmin.setVisible(true);
	}
}

initHomeData();



function setFavicon() {
	var href = '/media/root/POC_BADEEL/favicon.ico';
	var link = document.getElementById('naiaFavicon');
	if (!link) {
		link = document.createElement('link');
		link.id = 'naiaFavicon';
		link.rel = 'icon';
		document.head.appendChild(link);
	}
	link.href = href;
}
setFavicon();



function setActiveNav(activeItem) {
	[navHome, navInvite, navVendorsAdmin, navCompReq, navCoC, navVendors, navInvoices].forEach(function(it){ it.removeStyleClass('badeel_main_navItemActive'); });
	if (activeItem) activeItem.addStyleClass('badeel_main_navItemActive');
}

function wireNavClicks() {
	navHome.attachBrowserEvent('click', function() { showHomeView(); setActiveNav(navHome); });
	navInvite.attachBrowserEvent('click', function() {
		if (navInviteText.getText() === 'Qualification Profile') {
			// Vendor mode
			showQualView();
			setActiveNav(navInvite);
		} else if (navInviteText.getText() === 'Invite Vendors') {
			// Admin mode
			showInviteView();
			setActiveNav(navInvite);
		} else {
			sap.m.MessageToast.show(navInviteText.getText());
		}
	});
	navVendors.attachBrowserEvent('click', function() {
		if (navVendorsText.getText() === 'Create Invoice') {
			// Vendor mode
			showInvoiceView();
			setActiveNav(navVendors);
		} else if (navVendorsText.getText() === 'Vendors') {
			// Admin mode
			showVendorsView();
			setActiveNav(navVendors);
		} else {
			sap.m.MessageToast.show(navVendorsText.getText());
		}
	});
	navInvoices.attachBrowserEvent('click', function() { var adminMode = (navInviteText.getText() === 'Invite Vendors'); showInvListView(adminMode); setActiveNav(navInvoices); });
	navCompReq.attachBrowserEvent('click', function() { showCompReqView(); setActiveNav(navCompReq); });
	navCoC.attachBrowserEvent('click', function() { showCoCView(); setActiveNav(navCoC); });
	navVendorsAdmin.attachBrowserEvent('click', function() { showVendorsView(); setActiveNav(navVendorsAdmin); });
}
wireNavClicks();

// Lookups are loaded from the getLookups API. Keep an empty-shaped object so init
// functions that read window.__lookups.X do not error before the API responds.
window.__lookups = window.__lookups || {
	countries: [],
	taxCountries: [],
	currencies: [],
	paymentTerms: [],
	attachmentTypes: [],
	contactTitles: [],
	documentTypes: []
};




// ============ Qualification Profile ============
function initQualData() {
	// Lookups come from getLookups cached in window.__lookups; populated via applyLookups.
	var L = window.__lookups || {};
	modelQualCountries.setData({ ITEMS: L.countries || [] });
	modelQualTaxCountries.setData({ ITEMS: L.taxCountries || [] });
	modelQualCurrencies.setData({ ITEMS: L.currencies || [] });
	// Bank accounts load from getVendorbankaccounts; documents from getVendordocuments. Start empty.
	modelQualBanks.setData({ ITEMS: [] });
	modelQualDocs.setData({ ITEMS: [] });
	cpCountry.setSelectedKey('Spain');
}

function showQualView() {
	vboxHeader.setVisible(false);
	vboxAdmin.setVisible(false);
	vboxVendor.setVisible(false);
	vboxInvoice.setVisible(false);
	vboxInvList.setVisible(false);
	vboxInvDetail.setVisible(false);
	vboxInvite.setVisible(false);
	vboxVendors.setVisible(false);
	vboxVendorDetail.setVisible(false);
	vboxCompReq.setVisible(false);
	vboxCompReqForm.setVisible(false);
	vboxCoC.setVisible(false);
	vboxCoCDetail.setVisible(false);
	vboxCompReqDetail.setVisible(false);
	vboxQual.setVisible(true);
}

function showHomeView() {
	vboxQual.setVisible(false);
	vboxInvoice.setVisible(false);
	vboxInvList.setVisible(false);
	vboxInvDetail.setVisible(false);
	vboxInvite.setVisible(false);
	vboxVendors.setVisible(false);
	vboxVendorDetail.setVisible(false);
	vboxCompReq.setVisible(false);
	vboxCompReqForm.setVisible(false);
	vboxCoC.setVisible(false);
	vboxCoCDetail.setVisible(false);
	vboxCompReqDetail.setVisible(false);
	vboxHeader.setVisible(true);
	var role = (navInviteText.getText() === 'Invite Vendors') ? 'admin' : 'vendor';
	applyRole(role);
}

function openBankDialog() {
	bankName.setValue('');
	bankAccount.setValue('');
	bankSwift.setValue('');
	bankCurrency.setSelectedKey('EUR');
	bankDialog.open();
}

function saveBankDetails() {
	if (!bankName.getValue() || !bankAccount.getValue()) {
		sap.m.MessageToast.show('Bank Name and IBAN / Account Number are required.');
		return;
	}
	var data = modelQualBanks.getData();
	if (!data.ITEMS) data.ITEMS = [];
	data.ITEMS.push({
		bankName: bankName.getValue(),
		account: bankAccount.getValue(),
		swift: bankSwift.getValue(),
		currency: bankCurrency.getSelectedKey()
	});
	modelQualBanks.setData(data);
	bankDialog.close();
	sap.m.MessageToast.show('Bank details added.');
}

function deleteBankRow(oEvent) {
	var oItem = oEvent.getSource().getParent();
	var ctx = oItem.getBindingContext('QualBanks');
	if (!ctx) return;
	var idx = parseInt(ctx.getPath().split('/').pop(), 10);
	var data = modelQualBanks.getData();
	data.ITEMS.splice(idx, 1);
	modelQualBanks.setData(data);
	sap.m.MessageToast.show('Bank details removed.');
}

function chooseQualFiles() {
	var input = document.createElement('input');
	input.type = 'file';
	input.multiple = true;
	input.onchange = function(e) {
		var files = e.target.files;
		var data = modelQualDocs.getData();
		if (!data.ITEMS) data.ITEMS = [];
		for (var i = 0; i < files.length; i++) {
			var kb = (files[i].size / 1024).toFixed(0);
			data.ITEMS.push({ name: files[i].name, size: kb + ' KB' });
		}
		modelQualDocs.setData(data);
		sap.m.MessageToast.show(files.length + ' file(s) added.');
	};
	input.click();
}

function saveQualDraft() {
	sap.m.MessageToast.show('Qualification profile saved as draft.');
}

function submitQual() {
	if (!cpName.getValue() || !cpAddress.getValue() || !cpCity.getValue() || !cpContactFirstName.getValue() || !cpContactLastName.getValue() || !taxId.getValue()) {
		sap.m.MessageToast.show('Please complete all required fields (*).');
		return;
	}
	qualStatus.setText('Submitted');
	qualStatus.setState('Warning');
	qualStatus.setIcon('sap-icon://pending');
	sap.m.MessageBox.success('Your qualification profile has been submitted for review.', { styleClass: 'badeel_main_msgBox' });
}

initQualData();




// ============ Create Invoice Wizard ============
var invCurrentStep = 1;
var invMaxStep = 6;

function fmtEUR(n) {
	return '\u20ac' + Number(n || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function initInvoiceData() {
	modelInvPOs.setData({ ITEMS: [
		{ poNumber: 'PO-100234', entity: 'Badeel Marine', description: 'Port equipment maintenance', poValue: fmtEUR(120000), remaining: fmtEUR(88000), contractRef: 'CTR-2025-014', currency: 'EUR', advancePaid: 20000, billing: 'Badeel Marine, Riyadh, KSA', tax: 'VAT 15% - Reg. 300123456700003' },
		{ poNumber: 'PO-100240', entity: 'Badeel Facilities', description: 'Annual cleaning services', poValue: fmtEUR(60000), remaining: fmtEUR(45000), contractRef: 'CTR-2025-021', currency: 'EUR', advancePaid: 0, billing: 'Badeel Facilities, Jeddah, KSA', tax: 'VAT 15% - Reg. 300123456700003' },
		{ poNumber: 'PO-100255', entity: 'Badeel IT', description: 'Cloud infrastructure setup', poValue: fmtEUR(95000), remaining: fmtEUR(95000), contractRef: 'CTR-2025-030', currency: 'EUR', advancePaid: 15000, billing: 'Badeel IT, Riyadh, KSA', tax: 'VAT 15% - Reg. 300123456700003' }
	] });
	// Payment terms & attachment types now come from getLookups (window.__lookups).
	modelInvPayTerms.setData({ ITEMS: window.__lookups.paymentTerms });
	// CoC-driven invoicing: the CoC already exists in the system, so it is NOT uploaded again.
	modelInvAttachTypes.setData({ ITEMS: window.__lookups.attachmentTypes });
	modelInvLines.setData({ ITEMS: [] });
	modelInvAttach.setData({ ITEMS: [] });
	sap.ui.getCore().setModel(modelInvForm, 'InvForm');
	modelInvForm.setData({ selectedPO: null, gross: 0, advancePaid: 0, net: 0 });
}

function showInvoiceView() {
	hideAllContentSections();
	vboxInvoice.setVisible(true);
	resetWizard();
}

function rebuildInvoicePOList() {
	// Only Purchase Orders that have at least one APPROVED CoC can be invoiced.
	var cocs = window.__allCoCs || [];
	var poNumbers = {};
	cocs.forEach(function(c){ if (c.status === 'Approved') poNumbers[c.poNumber] = true; });
	var pos = (window.__poCatalog || []).filter(function(p){ return poNumbers[p.poNumber]; }).map(function(p){
		var rem = p.lines.reduce(function(s,l){ return s + (l.orderedQty - l.acceptedQty) * l.price; }, 0);
		var val = p.lines.reduce(function(s,l){ return s + l.orderedQty * l.price; }, 0);
		var cocCount = cocs.filter(function(c){ return c.poNumber === p.poNumber && c.status === 'Approved'; }).length;
		return { poNumber: p.poNumber, entity: p.entity, description: p.description, poValue: fmtEUR(val), remaining: fmtEUR(rem), contractRef: p.contractRef, currency: p.currency, advancePaid: p.advancePaid, billing: p.billing, tax: p.tax, cocCount: cocCount + ' approved CoC(s)' };
	});
	modelInvPOs.setData({ ITEMS: pos });
}

function resetWizard() {
	invCurrentStep = 1;
	rebuildInvoicePOList();
	modelInvLines.setData({ ITEMS: [] });
	modelInvAttach.setData({ ITEMS: [] });
	modelInvCoCOptions.setData({ ITEMS: [] });
	invNumber.setValue('');
	invCoCSelect.setSelectedKey('');
	poTable.removeSelections(true);
	modelInvForm.setData({ selectedPO: null, selectedCoC: null, gross: 0, advancePaid: 0, net: 0 });
	poSummaryStrip.setText('Select a purchase order in step 1 (only POs with approved CoCs are shown).');
	invCoCStrip.setText('Only approved CoCs for the selected PO are shown. Choose one to auto-load its accepted line items.');
	invBillingDetails.setValue('');
	invTaxInfo.setValue('');
	invCurrency.setValue('EUR');
	lineItemsGrossTotal.setText('\u2013');
	goToStep(1);
	// If launched from a specific CoC, preselect its PO
	if (window.__invoiceFromCoC) {
		var coc = window.__invoiceFromCoC;
		window.__invoiceFromCoC = null;
		preselectInvoicePO(coc.poNumber, coc.cocNo);
	}
}

function preselectInvoicePO(poNumber, cocNo) {
	var po = findPO(poNumber);
	if (!po) return;
	applyInvoicePO(po);
	loadInvoiceCoCOptions(poNumber);
	if (cocNo) { invCoCSelect.setSelectedKey(cocNo); applyInvoiceCoC(cocNo); }
	goToStep(2);
}

function loadInvoiceCoCOptions(poNumber) {
	var cocs = (window.__allCoCs || []).filter(function(c){ return c.poNumber === poNumber && c.status === 'Approved'; });
	var opts = cocs.map(function(c){ return { cocNo: c.cocNo, label: c.cocNo + ' \u00b7 ' + c.issueDate + ' \u00b7 ' + c.acceptedAmount }; });
	modelInvCoCOptions.setData({ ITEMS: opts });
	invCoCSelect.setSelectedKey('');
	if (opts.length === 1) { invCoCSelect.setSelectedKey(opts[0].cocNo); applyInvoiceCoC(opts[0].cocNo); }
	else { modelInvLines.setData({ ITEMS: [] }); lineItemsGrossTotal.setText('\u2013'); }
}

function applyInvoiceCoC(cocNo) {
	var coc = (window.__allCoCs || []).filter(function(c){ return c.cocNo === cocNo; })[0];
	if (!coc) return;
	var fd = modelInvForm.getData();
	fd.selectedCoC = coc;
	modelInvForm.setData(fd);
	// Auto-load accepted line items from the CoC (read-only)
	var lines = (coc.lines || []).map(function(l){
		return { description: l.description, qty: String(l.qty || l.acceptedQty), price: fmtEUR(l.price), tax: '15', total: fmtEUR((l.qty || 0) * (l.price || 0) * 1.15) };
	});
	modelInvLines.setData({ ITEMS: lines });
	recalcLineItemsFromCoC();
	invCoCStrip.setText('Invoicing CoC ' + coc.cocNo + ' \u2014 ' + coc.acceptedLines + ' accepted line(s), amount ' + coc.acceptedAmount + '. Line items are fixed by the CoC.');
	invCoCStrip.setType('Success');
}

function recalcLineItemsFromCoC() {
	var data = modelInvLines.getData();
	var gross = 0;
	(data.ITEMS || []).forEach(function(li){
		var t = parseFloat(String(li.total).replace(/[^0-9.]/g,'')) || 0;
		gross += t;
	});
	var fd = modelInvForm.getData();
	fd.gross = gross;
	fd.net = gross - (fd.advancePaid || 0);
	modelInvForm.setData(fd);
	lineItemsGrossTotal.setText(fmtEUR(gross));
}

function goToStep(step) {
	invCurrentStep = step;
	var steps = [invStep1, invStep2, invStep3, invStep4, invStep5, invStep6, invStepDone];
	steps.forEach(function(s){ s.setVisible(false); });
	if (step === 'done') {
		invStepDone.setVisible(true);
		wizardNav.setVisible(false);
	} else {
		steps[step - 1].setVisible(true);
		wizardNav.setVisible(true);
		wizardBackBtn.setVisible(step > 1);
		wizardNextBtn.setText(step === invMaxStep ? 'Submit Invoice' : 'Next');
	}
	updateWizardProgress();
	if (step === 3) recalcLineItemsFromCoC();
	if (step === 4) { recalcLineItemsFromCoC(); updateAdvanceSummary(); }
	if (step === 6) { setTimeout(renderReview, 50); }
}

function updateWizardProgress() {
	var chips = [wizStep1, wizStep2, wizStep3, wizStep4, wizStep5, wizStep6];
	for (var i = 0; i < chips.length; i++) {
		chips[i].removeStyleClass('badeel_main_wizStepActive');
		chips[i].removeStyleClass('badeel_main_wizStepDone');
		var s = (invCurrentStep === 'done') ? 7 : invCurrentStep;
		if (i + 1 < s) chips[i].addStyleClass('badeel_main_wizStepDone');
		else if (i + 1 === s) chips[i].addStyleClass('badeel_main_wizStepActive');
	}
}

function applyInvoicePO(po) {
	var fd = modelInvForm.getData();
	fd.selectedPO = po;
	fd.advancePaid = po.advancePaid || 0;
	modelInvForm.setData(fd);
	poSummaryStrip.setText('Invoicing against ' + po.poNumber + ' \u2014 ' + po.description + '. Remaining: ' + (po.remaining || ''));
	invBillingDetails.setValue(po.billing);
	invTaxInfo.setValue(po.tax);
	invCurrency.setValue(po.currency);
}

function onPOSelect(oEvent) {
	var oItem = oEvent.getParameter('listItem') || oEvent.getSource();
	if (!oItem) return;
	var ctx = oItem.getBindingContext('InvPOs');
	if (!ctx) return;
	var po = ctx.getObject();
	applyInvoicePO(po);
	loadInvoiceCoCOptions(po.poNumber);
}

function onInvoiceCoCChange() {
	var key = invCoCSelect.getSelectedKey();
	if (key) applyInvoiceCoC(key);
}

function addLineItem() {
	var data = modelInvLines.getData();
	if (!data.ITEMS) data.ITEMS = [];
	data.ITEMS.push({ description: '', qty: '1', price: '0', tax: '15', total: fmtEUR(0) });
	modelInvLines.setData(data);
}

function deleteLineItem(oEvent) {
	var oItem = oEvent.getSource().getParent();
	var ctx = oItem.getBindingContext('InvLines');
	if (!ctx) return;
	var idx = parseInt(ctx.getPath().split('/').pop(), 10);
	var data = modelInvLines.getData();
	data.ITEMS.splice(idx, 1);
	modelInvLines.setData(data);
	recalcLineItems();
}

function recalcLineItems() {
	var data = modelInvLines.getData();
	var gross = 0;
	if (data.ITEMS) {
		data.ITEMS.forEach(function(li){
			var q = parseFloat(li.qty) || 0;
			var p = parseFloat(li.price) || 0;
			var t = parseFloat(li.tax) || 0;
			var lineTotal = q * p * (1 + t / 100);
			li.total = fmtEUR(lineTotal);
			gross += lineTotal;
		});
	}
	modelInvLines.setData(data);
	var fd = modelInvForm.getData();
	fd.gross = gross;
	fd.net = gross - (fd.advancePaid || 0);
	modelInvForm.setData(fd);
	lineItemsGrossTotal.setText(fmtEUR(gross));
}

function updateAdvanceSummary() {
	var fd = modelInvForm.getData();
	advGross.setText(fmtEUR(fd.gross));
	advPaid.setText('- ' + fmtEUR(fd.advancePaid));
	advNet.setText(fmtEUR(fd.net));
}

function esc(v) {
	if (v === undefined || v === null) return '\u2013';
	return String(v).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function fmtInvDate() {
	var dateDisp = invDate.getValue() || '\u2013';
	var dv = invDate.getDateValue();
	if (dv) {
		dateDisp = dv.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
	}
	return dateDisp;
}

function renderReview() {
	var fd = modelInvForm.getData();
	var po = fd.selectedPO || {};
	var lines = (modelInvLines.getData().ITEMS || []);
	var atts = (modelInvAttach.getData().ITEMS || []);
	var billedFrom = (typeof cpName !== 'undefined' && cpName.getValue()) ? cpName.getValue() : 'Atlas Engineering Ltd.';
	var dateDisp = fmtInvDate();

	function pair(label, value) {
		return '<div class="badeel_main_revField"><div class="badeel_main_revLabel">' + esc(label) + '</div><div class="badeel_main_revValue">' + esc(value) + '</div></div>';
	}

	var html = '';

	// Purchase Order section
	html += '<div class="badeel_main_revSection">';
	html += '<div class="badeel_main_revSectionTitle">Purchase Order</div>';
	html += '<div class="badeel_main_revGrid">';
	var coc = fd.selectedCoC || {};
	html += pair('PO Number', po.poNumber);
	html += pair('Certificate of Completion', coc.cocNo || '\u2013');
	html += pair('Entity', po.entity);
	html += pair('Invoice Number', invNumber.getValue());
	html += pair('Invoice Date', dateDisp);
	html += pair('Payment Terms', invPaymentTerms.getSelectedKey());
	html += pair('Billed From', billedFrom);
	html += '</div></div>';

	// Accepted Line Items section
	html += '<div class="badeel_main_revSection">';
	html += '<div class="badeel_main_revSectionTitle">Accepted Line Items</div>';
	html += '<table class="badeel_main_revTable"><thead><tr>';
	html += '<th>DESCRIPTION</th><th class="badeel_main_revNum">QTY</th><th class="badeel_main_revNum">UNIT PRICE</th><th class="badeel_main_revNum">TAX %</th><th class="badeel_main_revNum">TOTAL</th>';
	html += '</tr></thead><tbody>';
	if (lines.length === 0) {
		html += '<tr><td colspan="5" class="badeel_main_revEmpty">No line items.</td></tr>';
	} else {
		lines.forEach(function(li){
			html += '<tr>';
			html += '<td>' + esc(li.description || '\u2013') + '</td>';
			html += '<td class="badeel_main_revNum">' + esc(li.qty) + '</td>';
			html += '<td class="badeel_main_revNum">' + esc(li.price) + '</td>';
			html += '<td class="badeel_main_revNum">' + esc(li.tax) + '%</td>';
			html += '<td class="badeel_main_revNum">' + esc(li.total) + '</td>';
			html += '</tr>';
		});
	}
	html += '</tbody></table></div>';

	// Attachments section (styled like Supporting Evidence lists)
	html += '<div class="badeel_main_revSection">';
	html += '<div class="badeel_main_revSectionTitle">Attachments</div>';
	if (atts.length === 0) {
		html += '<div class="badeel_main_revEmptyText">No documents attached.</div>';
	} else {
		html += '<div class="badeel_main_coc_revAttList">';
		atts.forEach(function(a){
			html += '<div class="badeel_main_coc_revAttRow">';
			html += '<span class="badeel_main_coc_revAttIcon"></span>';
			html += '<span class="badeel_main_coc_revAttInfo"><span class="badeel_main_coc_revAttName">' + esc(a.name) + '</span><span class="badeel_main_coc_revAttType">' + esc(a.type) + '</span></span>';
			html += '</div>';
		});
		html += '</div>';
	}
	html += '</div>';

	// Advance offset & final amount
	html += '<div class="badeel_main_revSection">';
	html += '<div class="badeel_main_revSectionTitle">Advance Offset &amp; Final Amount</div>';
	html += '<div class="badeel_main_revSummary">';
	html += '<div class="badeel_main_revSumRow"><span>Gross Invoice Amount</span><span>' + fmtEUR(fd.gross) + '</span></div>';
	html += '<div class="badeel_main_revSumRow"><span>Advance Already Paid</span><span>\u2013 ' + fmtEUR(fd.advancePaid) + '</span></div>';
	html += '<div class="badeel_main_revSumRow badeel_main_revSumTotal"><span>Final Amount Payable</span><span>' + fmtEUR(fd.net) + '</span></div>';
	html += '</div></div>';

	var dom = reviewContent.getDomRef();
	if (dom) { dom.innerHTML = html; return; }
	setTimeout(function() { var d2 = reviewContent.getDomRef(); if (d2) { d2.innerHTML = html; } }, 100);
}

function wizardNext() {
	if (invCurrentStep === 1) {
		if (!modelInvForm.getData().selectedPO) { sap.m.MessageToast.show('Please select a purchase order.'); return; }
	}
	if (invCurrentStep === 2) {
		if (!modelInvForm.getData().selectedCoC) { sap.m.MessageToast.show('Please select an approved CoC.'); return; }
		if (!invNumber.getValue() || !invDate.getValue()) { sap.m.MessageToast.show('Invoice Number and Date are required.'); return; }
	}
	if (invCurrentStep === 3) {
		var lines = modelInvLines.getData().ITEMS || [];
		if (lines.length === 0) { sap.m.MessageToast.show('No accepted line items found for the selected CoC.'); return; }
		recalcLineItemsFromCoC();
	}
	if (invCurrentStep === 5) {
		var atts = modelInvAttach.getData().ITEMS || [];
		var hasTax = atts.some(function(a){ return a.type === 'Tax Invoice'; });
		if (!hasTax) { sap.m.MessageBox.warning('Please upload the Tax Invoice (required) before continuing.', { styleClass: 'badeel_main_msgBox' }); return; }
	}
	if (invCurrentStep === invMaxStep) { submitInvoice(); return; }
	goToStep(invCurrentStep + 1);
}

function wizardBack() {
	if (invCurrentStep > 1) goToStep(invCurrentStep - 1);
}

function chooseInvoiceFile() {
	var input = document.createElement('input');
	input.type = 'file';
	input.onchange = function(e) {
		var files = e.target.files;
		if (!files || !files.length) return;
		var data = modelInvAttach.getData();
		if (!data.ITEMS) data.ITEMS = [];
		data.ITEMS.push({ name: files[0].name, type: attachmentType.getSelectedKey() });
		modelInvAttach.setData(data);
		sap.m.MessageToast.show('File attached.');
	};
	input.click();
}

function submitInvoice() {
	goToStep('done');
}

function saveInvoiceDraft() {
	sap.m.MessageToast.show('Invoice saved as draft.');
}

initInvoiceData();




// ============ Invoices List + Detail ============
var invActiveStatus = 'All';

function initInvoicesData() {
	sap.ui.getCore().setModel(modelInvDetail, 'InvDetail');
	modelInvDetail.setData({});
	// Invoices are loaded from the getInvoices API (see onGetInvoicesSuccess). Start empty.
	window.__allInvoices = [];
	filterInvoices();
}

function filterInvoices() {
	var q = (invSearch.getValue() || '').toLowerCase();
	var all = window.__allInvoices || [];
	var filtered = all.filter(function(inv){
		var matchStatus = (invActiveStatus === 'All') || (inv.status === invActiveStatus);
		var matchSearch = !q || (inv.invoiceNo.toLowerCase().indexOf(q) > -1) || (inv.poNumber.toLowerCase().indexOf(q) > -1) || (inv.vendor.toLowerCase().indexOf(q) > -1);
		return matchStatus && matchSearch;
	});
	modelInvList.setData({ ITEMS: filtered });
	invResultCount.setText(filtered.length + ' invoice' + (filtered.length === 1 ? '' : 's') + ' shown');
}

function setStatusChip(status, btn) {
	invActiveStatus = status;
	[chipAll, chipDraft, chipSubmitted, chipUnderReview, chipApproved, chipPaid, chipRejected].forEach(function(c){ c.removeStyleClass('badeel_main_chipActive'); });
	btn.addStyleClass('badeel_main_chipActive');
	filterInvoices();
}

function showInvListView(adminMode) {
	window.__invAdminMode = !!adminMode;
	colILVendor.setVisible(!!adminMode);
	if (adminMode) {
		invListTitle.setText('Invoices');
		invListSubtitle.setText('Review and manage invoices submitted by all vendors.');
		btnHeaderCreateInvoice.setVisible(false);
	} else {
		invListTitle.setText('Invoices');
		invListSubtitle.setText('Track the status of your submitted invoices.');
		btnHeaderCreateInvoice.setVisible(true);
	}
	vboxHeader.setVisible(false);
	vboxAdmin.setVisible(false);
	vboxVendor.setVisible(false);
	vboxQual.setVisible(false);
	vboxInvoice.setVisible(false);
	vboxInvDetail.setVisible(false);
	vboxInvite.setVisible(false);
	vboxVendors.setVisible(false);
	vboxVendorDetail.setVisible(false);
	vboxCompReq.setVisible(false);
	vboxCompReqForm.setVisible(false);
	vboxCoC.setVisible(false);
	vboxCoCDetail.setVisible(false);
	vboxCompReqDetail.setVisible(false);
	vboxInvList.setVisible(true);
	filterInvoices();
}

function openInvoiceDetail(inv) {
	modelInvDetail.setData(inv);
	invTitle2.setText(inv.invoiceNo);
	invSubtitle2.setText(inv.netPayable + ' \u00b7 ' + inv.status);
	invAvatar.setInitials(inv.invoiceNo.slice(-2));
	breadcrumbInvoice.setText(inv.invoiceNo);
	invStatusBadge.setText(inv.status);
	invStatusBadge.setState(inv.statusState);
	invStatusBadge.removeStyleClass('badeel_main_qualStatusBadge');
	invStatusBadge.addStyleClass('badeel_main_statusPill');
	var cocNo = inv.cocNo || '';
	if (!cocNo) {
		var mcocs = (window.__allCoCs || []).filter(function(c){ return c.poNumber === inv.poNumber && c.status === 'Approved'; });
		if (mcocs.length) { cocNo = mcocs[0].cocNo; }
	}
	factCoC.setText(cocNo || '\u2013');
	window.__invDetailPO = inv.poNumber;
	window.__invDetailCoC = cocNo || '';
	if (inv.rejection) {
		rejectionStrip.setText(inv.rejection);
		rejectionStrip.setVisible(true);
	} else {
		rejectionStrip.setVisible(false);
	}
	modelInvDetailLines.setData({ ITEMS: inv.lines || [] });
	modelInvDetailAttach.setData({ ITEMS: inv.attachments || [] });
	invDetailTabs.setSelectedKey('overview');
	var isAdmin = !!window.__invAdminMode;
	factVendorBox.setVisible(isAdmin);
	var showActions = isAdmin && (inv.status === 'Submitted');
	invActions.setVisible(showActions);
	btnApproveInv.setVisible(showActions);
	btnRejectInv.setVisible(showActions);
	vboxHeader.setVisible(false);
	vboxAdmin.setVisible(false);
	vboxVendor.setVisible(false);
	vboxQual.setVisible(false);
	vboxInvoice.setVisible(false);
	vboxInvList.setVisible(false);
	vboxInvite.setVisible(false);
	vboxVendors.setVisible(false);
	vboxVendorDetail.setVisible(false);
	vboxCompReq.setVisible(false);
	vboxCompReqForm.setVisible(false);
	vboxCoC.setVisible(false);
	vboxCoCDetail.setVisible(false);
	vboxCompReqDetail.setVisible(false);
	vboxInvDetail.setVisible(true);
}

function onInvoiceRowSelect(oEvent) {
	var oItem = oEvent.getParameter('listItem') || oEvent.getSource();
	if (!oItem) return;
	var ctx = oItem.getBindingContext('InvList');
	if (!ctx) return;
	openInvoiceDetail(ctx.getObject());
}

initInvoicesData();




// ============ KPI tile -> Invoices navigation ============
function openInvoicesFiltered(status) {
	showInvListView();
	setActiveNav(navInvoices);
	var chipMap = { 'All': chipAll, 'Draft': chipDraft, 'Submitted': chipSubmitted, 'Under Review': chipUnderReview, 'Approved': chipApproved, 'Paid': chipPaid, 'Rejected': chipRejected };
	var btn = chipMap[status] || chipAll;
	setStatusChip(status, btn);
}




// ============ Attachment item delete handlers ============
function deleteQualDoc(oEvent) {
	var ctx = oEvent.getSource().getBindingContext('QualDocs');
	if (!ctx) return;
	var idx = parseInt(ctx.getPath().split('/').pop(), 10);
	var data = modelQualDocs.getData();
	data.ITEMS.splice(idx, 1);
	modelQualDocs.setData(data);
}

function deleteInvAttach(oEvent) {
	var ctx = oEvent.getSource().getBindingContext('InvAttach');
	if (!ctx) return;
	var idx = parseInt(ctx.getPath().split('/').pop(), 10);
	var data = modelInvAttach.getData();
	data.ITEMS.splice(idx, 1);
	modelInvAttach.setData(data);
}




// ============ Invite Vendors (Admin) ============
function initInviteData() {
	// InviteRows holds the blank entry row for the invite form (user input, no API).
	modelInviteRows.setData({ ITEMS: [{ company: '', contact: '', email: '' }] });
	// Recent invitations are loaded from getVendorinvitations. Start empty.
	modelRecentInvites.setData({ ITEMS: [] });
}

function showInviteView() {
	vboxHeader.setVisible(false);
	vboxAdmin.setVisible(false);
	vboxVendor.setVisible(false);
	vboxQual.setVisible(false);
	vboxInvoice.setVisible(false);
	vboxInvList.setVisible(false);
	vboxInvDetail.setVisible(false);
	vboxVendors.setVisible(false);
	vboxVendorDetail.setVisible(false);
	vboxCompReq.setVisible(false);
	vboxCompReqForm.setVisible(false);
	vboxCoC.setVisible(false);
	vboxCoCDetail.setVisible(false);
	vboxCompReqDetail.setVisible(false);
	vboxInvite.setVisible(true);
	invtSuccessStrip.setVisible(false);
}

function addVendorRow() {
	var data = modelInviteRows.getData();
	if (!data.ITEMS) data.ITEMS = [];
	data.ITEMS.push({ company: '', contact: '', email: '' });
	modelInviteRows.setData(data);
}

function removeVendorRow(oEvent) {
	var ctx = oEvent.getSource().getBindingContext('InviteRows');
	if (!ctx) return;
	var idx = parseInt(ctx.getPath().split('/').pop(), 10);
	var data = modelInviteRows.getData();
	if (data.ITEMS.length <= 1) { sap.m.MessageToast.show('At least one vendor row is required.'); return; }
	data.ITEMS.splice(idx, 1);
	modelInviteRows.setData(data);
}

function clearInviteForm() {
	modelInviteRows.setData({ ITEMS: [{ company: '', contact: '', email: '' }] });
	invtSuccessStrip.setVisible(false);
}

function sendInvitations() {
	var rows = modelInviteRows.getData().ITEMS || [];
	var valid = rows.filter(function(r){ return r.company && r.contact && r.email; });
	if (valid.length === 0) { sap.m.MessageToast.show('Please fill in Company, Contact and Email for at least one vendor.'); return; }
	var recent = modelRecentInvites.getData();
	if (!recent.ITEMS) recent.ITEMS = [];
	var today = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
	valid.forEach(function(r){
		recent.ITEMS.unshift({ company: r.company, contact: r.contact, email: r.email, status: 'Invitation Sent', statusState: 'Information', invitedOn: today });
	});
	modelRecentInvites.setData(recent);
	invtSuccessStrip.setText(valid.length + ' invitation' + (valid.length === 1 ? '' : 's') + ' sent successfully. Each vendor will receive a unique registration link.');
	invtSuccessStrip.setVisible(true);
	modelInviteRows.setData({ ITEMS: [{ company: '', contact: '', email: '' }] });
}

function openEmailPreview() {
	emailPreviewDialog.open();
}

initInviteData();




// ============ Vendors List + Detail (Admin) ============
var vndActiveStatus = 'All';

function initVendorsData() {
	sap.ui.getCore().setModel(modelVendorDetail, 'VendorDetail');
	modelVendorDetail.setData({});
	// Vendors are loaded from the getVendors API (see onGetVendorsSuccess). Start empty.
	window.__allVendors = [];
	filterVendors();
}

function filterVendors() {
	var q = (vndSearch.getValue() || '').toLowerCase();
	var all = window.__allVendors || [];
	var filtered = all.filter(function(v){
		var matchStatus = (vndActiveStatus === 'All') || (v.status === vndActiveStatus);
		var matchSearch = !q || (v.company.toLowerCase().indexOf(q) > -1) || (v.contact.toLowerCase().indexOf(q) > -1);
		return matchStatus && matchSearch;
	});
	modelVendorsList.setData({ ITEMS: filtered });
	vndResultCount.setText(filtered.length + ' vendor' + (filtered.length === 1 ? '' : 's') + ' shown');
}

function setVendorChip(status, btn) {
	vndActiveStatus = status;
	[vchipAll, vchipInvited, vchipPending, vchipRegistered].forEach(function(c){ c.removeStyleClass('badeel_main_chipActive'); });
	btn.addStyleClass('badeel_main_chipActive');
	filterVendors();
}

function showVendorsView() {
	vboxHeader.setVisible(false);
	vboxAdmin.setVisible(false);
	vboxVendor.setVisible(false);
	vboxQual.setVisible(false);
	vboxInvoice.setVisible(false);
	vboxInvList.setVisible(false);
	vboxInvDetail.setVisible(false);
	vboxInvite.setVisible(false);
	vboxVendorDetail.setVisible(false);
	vboxCompReq.setVisible(false);
	vboxCompReqForm.setVisible(false);
	vboxCoC.setVisible(false);
	vboxCoCDetail.setVisible(false);
	vboxCompReqDetail.setVisible(false);
	vboxVendors.setVisible(true);
	filterVendors();
}

function setVendorEditMode(edit) {
	var inputs = [edCompanyName, edTaxId, edAddress, edCity, edVDCountry, edZip, edContactTitle, edContactFirstName, edContactLastName, edContactEmail, edContactPhone];
	inputs.forEach(function(i){ i.setEditable(edit); });
	editProfileBtn.setVisible(!edit);
	cancelProfileBtn.setVisible(edit);
	saveProfileBtn.setVisible(edit);
}

function openVendorDetail(v) {
	modelVendorDetail.setData(JSON.parse(JSON.stringify(v)));
	vendorTitle.setText(v.company);
	vendorSubtitle.setText(v.legalName + ' \u00b7 ' + v.country);
	vendorAvatar.setInitials(v.company.substring(0, 2).toUpperCase());
	breadcrumbCompany.setText(v.company);
	vendorStatusBadge.setText(v.status);
	vendorStatusBadge.setState(v.statusState);
	vendorStatusBadge.removeStyleClass('badeel_main_qualStatusBadge');
	vendorStatusBadge.addStyleClass('badeel_main_statusPill');
	editProfileBtn.removeStyleClass('badeel_main_btnSecondary');
	editProfileBtn.addStyleClass('badeel_main_btnPrimary');
	editProfileBtn.addStyleClass('badeel_main_btnSm');
	qualStatusRow.setText(v.qualification);
	modelVendorLocations.setData({ ITEMS: v.locations || [] });
	renderVendorCategories(v.categories || []);
	setVendorEditMode(false);
	vndDetailTabs.setSelectedKey('overview');
	vboxHeader.setVisible(false);
	vboxAdmin.setVisible(false);
	vboxVendor.setVisible(false);
	vboxQual.setVisible(false);
	vboxInvoice.setVisible(false);
	vboxInvList.setVisible(false);
	vboxInvDetail.setVisible(false);
	vboxInvite.setVisible(false);
	vboxVendors.setVisible(false);
	vboxCompReq.setVisible(false);
	vboxCompReqForm.setVisible(false);
	vboxCoC.setVisible(false);
	vboxCoCDetail.setVisible(false);
	vboxCompReqDetail.setVisible(false);
	vboxVendorDetail.setVisible(true);
}

function renderVendorCategories(cats) {
	if (cats) { window._currentVendorCategories = cats; }
	cats = window._currentVendorCategories || [];
	var dom = categoryTags.getDomRef();
	if (!dom) { setTimeout(function(){ renderVendorCategories(cats); }, 60); return; }
	var html = '';
	cats.forEach(function(c){ html += '<span class="badeel_main_tagPill">' + esc(c) + '</span>'; });
	dom.innerHTML = html || '<span class="badeel_main_revEmptyText">No categories.</span>';
}

function onVendorDetailTabSelect(oEvent) {
	var key = oEvent.getParameter('key');
	if (key === 'business') {
		// Tab content DOM is re-created on switch; re-inject cached category tags
		renderVendorCategories(window._currentVendorCategories || []);
	}
}

function onVendorRowSelect(oEvent) {
	var oItem = oEvent.getParameter('listItem') || oEvent.getSource();
	if (!oItem) return;
	var ctx = oItem.getBindingContext('VendorsList');
	if (!ctx) return;
	openVendorDetail(ctx.getObject());
}

function saveVendorProfile() {
	setVendorEditMode(false);
	sap.m.MessageToast.show('Vendor profile saved.');
}

function cancelVendorEdit() {
	setVendorEditMode(false);
}

initVendorsData();




// ============ Role switch -> reset to Home ============
function switchRole(role) {
	applyRole(role);
	vboxQual.setVisible(false);
	vboxInvoice.setVisible(false);
	vboxInvList.setVisible(false);
	vboxInvDetail.setVisible(false);
	vboxInvite.setVisible(false);
	vboxVendors.setVisible(false);
	vboxVendorDetail.setVisible(false);
	vboxCompReq.setVisible(false);
	vboxCompReqForm.setVisible(false);
	vboxCoC.setVisible(false);
	vboxCoCDetail.setVisible(false);
	vboxCompReqDetail.setVisible(false);
	vboxHeader.setVisible(true);
	setActiveNav(navHome);
}




// ============ Admin invoice approve/reject ============
function updateInvoiceStatus(invoiceNo, status, statusState, rejection) {
	var all = window.__allInvoices || [];
	all.forEach(function(inv){
		if (inv.invoiceNo === invoiceNo) {
			inv.status = status;
			inv.statusState = statusState;
			inv.rejection = rejection || '';
		}
	});
}

function approveInvoice() {
	var inv = modelInvDetail.getData();
	updateInvoiceStatus(inv.invoiceNo, 'Approved', 'Success', '');
	inv.status = 'Approved';
	inv.statusState = 'Success';
	inv.rejection = '';
	modelInvDetail.setData(inv);
	invStatusBadge.setText('Approved');
	invStatusBadge.setState('Success');
	invSubtitle2.setText(inv.netPayable + ' \u00b7 Approved');
	rejectionStrip.setVisible(false);
	invActions.setVisible(false);
	filterInvoices();
	sap.m.MessageBox.success('Invoice ' + inv.invoiceNo + ' has been approved.', { styleClass: 'badeel_main_msgBox' });
}

function rejectInvoice() {
	var inv = modelInvDetail.getData();
	sap.m.MessageBox.confirm('Reject invoice ' + inv.invoiceNo + '?', {
		styleClass: 'badeel_main_msgBox',
		actions: [sap.m.MessageBox.Action.OK, sap.m.MessageBox.Action.CANCEL],
		emphasizedAction: sap.m.MessageBox.Action.OK,
		onClose: function(action) {
			if (action !== sap.m.MessageBox.Action.OK) return;
			var reason = 'Invoice rejected by reviewer. Please review and resubmit.';
			updateInvoiceStatus(inv.invoiceNo, 'Rejected', 'Error', reason);
			inv.status = 'Rejected';
			inv.statusState = 'Error';
			inv.rejection = reason;
			modelInvDetail.setData(inv);
			invStatusBadge.setText('Rejected');
			invStatusBadge.setState('Error');
			invSubtitle2.setText(inv.netPayable + ' \u00b7 Rejected');
			rejectionStrip.setText(reason);
			rejectionStrip.setVisible(true);
			invActions.setVisible(false);
			filterInvoices();
			sap.m.MessageToast.show('Invoice ' + inv.invoiceNo + ' rejected.');
		}
	});
}




// ============ Registration landing ============
function openRegistrationLanding() {
	emailPreviewDialog.close();
	App.to('pageRegLanding');
}

function continueRegistration() {
	var email = invitedEmail.getValue();
	if (!email) {
		sap.m.MessageToast.show('Please enter your invited email address.');
		return;
	}
	initRegForm(email);
	App.to('pageRegForm');
}

// ============ Vendor Registration Form ============
function initRegForm(email) {
	modelRegForm.setData({
		email: email || '',
		companyName: '',
		country: '',
		city: '',
		address: '',
		zip: '',
		contactTitle: '',
		firstName: '',
		lastName: '',
		contactEmail: '',
		phone: '',
		fax: ''
	});
	// Contact titles now come from getLookups (window.__lookups).
	modelRegContactTitles.setData({ ITEMS: window.__lookups.contactTitles });
	modelRegCategories.setData({ ITEMS: [] });
	modelRegLocations.setData({ ITEMS: [{ name: '', city: '', country: '' }] });
	if (!modelQualCountries.getData() || !modelQualCountries.getData().ITEMS) {
		initQualData();
	}
}

function regAddCategory(oEvent) {
	var val = regInpNewCat.getValue();
	if (!val || !val.trim()) { return; }
	var data = modelRegCategories.getData();
	if (!data.ITEMS) { data.ITEMS = []; }
	var exists = data.ITEMS.some(function(c){ return c.name.toLowerCase() === val.trim().toLowerCase(); });
	if (!exists) {
		data.ITEMS.push({ name: val.trim() });
		modelRegCategories.setData(data);
	}
	regInpNewCat.setValue('');
}

function regRemoveCategory(oEvent) {
	var ctx = oEvent.getSource().getBindingContext('RegCategories');
	if (!ctx) { return; }
	var idx = parseInt(ctx.getPath().split('/').pop(), 10);
	var data = modelRegCategories.getData();
	data.ITEMS.splice(idx, 1);
	modelRegCategories.setData(data);
}

function regAddLocation(oEvent) {
	var data = modelRegLocations.getData();
	if (!data.ITEMS) { data.ITEMS = []; }
	data.ITEMS.push({ name: '', city: '', country: '' });
	modelRegLocations.setData(data);
}

function regRemoveLocation(oEvent) {
	var ctx = oEvent.getSource().getBindingContext('RegLocations');
	var idx = -1;
	if (ctx) {
		idx = parseInt(ctx.getPath().split('/').pop(), 10);
	}
	var data = modelRegLocations.getData();
	if (!data || !data.ITEMS) { return; }
	if (isNaN(idx) || idx < 0 || idx >= data.ITEMS.length) { return; }
	data.ITEMS.splice(idx, 1);
	if (data.ITEMS.length === 0) { data.ITEMS.push({ name: '', city: '', country: '' }); }
	modelRegLocations.setData(data);
	modelRegLocations.refresh(true);
}

function regCancel(oEvent) {
	App.to('pageRegLanding');
}

function regSubmit(oEvent) {
	var f = modelRegForm.getData();
	var missing = [];
	if (!f.companyName || !f.companyName.trim()) { missing.push('Company Legal Name'); }
	if (!f.country) { missing.push('Country'); }
	if (!f.city || !f.city.trim()) { missing.push('City'); }
	if (!f.address || !f.address.trim()) { missing.push('Address'); }
	if (!f.firstName || !f.firstName.trim()) { missing.push('First Name'); }
	if (!f.lastName || !f.lastName.trim()) { missing.push('Last Name'); }
	if (missing.length > 0) {
		sap.m.MessageBox.error('Please complete the required fields: ' + missing.join(', '), { styleClass: 'badeel_main_msgBox' });
		return;
	}
	App.to('pageRegDone');
}

function backToPortalHome() {
	App.to('pageHome');
}



function regDoneContinueQual(oEvent) {
	App.to('pageHome');
	switchRole('vendor');
	showQualView();
	setActiveNav(navInvite);
}

function regDoneGoDashboard(oEvent) {
	App.to('pageHome');
	switchRole('vendor');
	showHomeView();
	setActiveNav(navHome);
}




// ============================================================
// ============ Completion Acceptance (CoC) Module ============
// ============================================================

// Master PO catalogue with line items and per-line accepted tracking.
// remainingQty = orderedQty - sum(accepted across CoCs). Drives CompReq, CoC and Invoice.
// Master PO catalogue is loaded from getPurchaseorders (see onGetPurchaseordersSuccess).
// Start empty; drives CompReq, CoC and Invoice once populated by the API.
window.__poCatalog = [];

function cocRemaining(line) { return (line.orderedQty || 0) - (line.acceptedQty || 0); }

function findPO(poNumber) {
	return window.__poCatalog.filter(function(p){ return p.poNumber === poNumber; })[0];
}

function hideAllContentSections() {
	vboxHeader.setVisible(false);
	vboxAdmin.setVisible(false);
	vboxVendor.setVisible(false);
	vboxQual.setVisible(false);
	vboxInvoice.setVisible(false);
	vboxInvList.setVisible(false);
	vboxInvDetail.setVisible(false);
	vboxInvite.setVisible(false);
	vboxVendors.setVisible(false);
	vboxVendorDetail.setVisible(false);
	vboxCompReq.setVisible(false);
	vboxCompReqForm.setVisible(false);
	vboxCoC.setVisible(false);
	vboxCoCDetail.setVisible(false);
	vboxCompReqDetail.setVisible(false);
}

// ---- Completion Requests: seed + list ----
function initCompReqData() {
	sap.ui.getCore().setModel(modelCompReqList, 'CompReqList');
	// Completion Requests are loaded from getCompletionrequests. Start empty.
	window.__allCompReqs = [];
	modelCompReqList.setData({ ITEMS: [], detail: {} });
	window.__crStatusFilter = 'All';
	// Document types now come from getLookups (window.__lookups).
	modelCompReqDocTypes.setData({ ITEMS: window.__lookups.documentTypes });
	modelCompReqLines.setData({ ITEMS: [] });
	modelCompReqAttach.setData({ ITEMS: [] });
	// PO dropdown options (only POs with remaining, open lines)
	var poOpts = window.__poCatalog.map(function(p){
		return { poNumber: p.poNumber, poLabel: p.poNumber + ' - ' + p.description };
	});
	modelCompReqPOs.setData({ ITEMS: poOpts });
}

function showCompReqView() {
	hideAllContentSections();
	if (isAdminMode()) {
		crSubtitle.setText('Review completion requests submitted by all vendors and issue Certificates of Completion.');
		btnNewCompReq.setVisible(false);
		colCRVendor.setVisible(true);
	} else {
		crSubtitle.setText('Request formal acceptance of completed work before invoicing.');
		btnNewCompReq.setVisible(true);
		colCRVendor.setVisible(false);
	}
	filterCompReqs();
	vboxCompReq.setVisible(true);
}

function setCompReqChip(status, btn) {
	window.__crStatusFilter = status;
	[crChipAll, crChipDraft, crChipSubmitted, crChipUnderReview, crChipAccepted, crChipRejected].forEach(function(c){ c.removeStyleClass('badeel_main_chipActive'); });
	if (btn) btn.addStyleClass('badeel_main_chipActive');
	filterCompReqs();
}

function filterCompReqs() {
	var status = window.__crStatusFilter || 'All';
	var q = (crSearch.getValue() || '').toLowerCase();
	var all = window.__allCompReqs || [];
	var filtered = all.filter(function(r){
		var matchStatus = (status === 'All') || (r.status === status);
		var matchSearch = !q || (r.requestNo.toLowerCase().indexOf(q) > -1) || (r.poNumber.toLowerCase().indexOf(q) > -1) || ((r.vendor||'').toLowerCase().indexOf(q) > -1);
		return matchStatus && matchSearch;
	});
	var d = modelCompReqList.getData();
	d.ITEMS = filtered;
	modelCompReqList.setData(d);
	crResultCount.setText(filtered.length + ' request' + (filtered.length === 1 ? '' : 's') + ' shown');
}

function openCompReqDetail(req) {
	var d = modelCompReqList.getData();
	d.detail = req;
	modelCompReqList.setData(d);
	crdTitle.setText(req.requestNo);
	crdSubtitle.setText(req.poNumber + ' \u00b7 ' + req.status);
	crdAvatar.setInitials((req.requestNo || 'CR').slice(-2));
	crdStatusBadge.setText(req.status);
	crdStatusBadge.setState(req.statusState);
	crdFactPO.setText(req.poNumber);
	crdFactVendor.setText(req.vendor || '\u2013');
	crdFactSubmitted.setText(req.submittedOn || '\u2013');
	crdFactReviewed.setText(req.reviewedOn || '\u2013');
	crdFactReviewer.setText(req.reviewer || '\u2013');
	crdComments.setText(req.comments || '\u2013');
	if (req.status === 'Rejected' && req.rejection) { crdRejectStrip.setText(req.rejection); crdRejectStrip.setVisible(true); }
	else { crdRejectStrip.setVisible(false); }
	// Accepted -> green strip with a link to the related Certificate of Completion
	window.__crDetailCoC = null;
	if (req.status === 'Accepted') {
		var coc = null;
		if (req.cocNo) { coc = (window.__allCoCs || []).filter(function(c){ return c.cocNo === req.cocNo; })[0]; }
		if (!coc) { coc = (window.__allCoCs || []).filter(function(c){ return c.poNumber === req.poNumber; })[0]; }
		window.__crDetailCoC = coc;
		if (coc) {
			crdAcceptStrip.setText('Accepted. ');
			crdAcceptLink.setText('View Certificate of Completion ' + coc.cocNo);
			crdAcceptLink.setVisible(true);
		} else {
			crdAcceptStrip.setText('Accepted. This completion request has been formally accepted by Badeel.');
			crdAcceptLink.setVisible(false);
		}
		crdAcceptStrip.setVisible(true);
	} else {
		crdAcceptStrip.setVisible(false);
	}
	modelCompReqDetailLines.setData({ ITEMS: req.lines || [] });
	modelCompReqDetailAttach.setData({ ITEMS: req.attachments || [] });
	var canReview = isAdminMode() && (req.status === 'Submitted' || req.status === 'Under Review');
	crdAdminActions.setVisible(canReview);
	hideAllContentSections();
	vboxCompReqDetail.setVisible(true);
}

function showCompReqForm() {
	hideAllContentSections();
	// reset form
	crfPOSelect.setSelectedKey('');
	crfComments.setValue('');
	modelCompReqLines.setData({ ITEMS: [] });
	modelCompReqAttach.setData({ ITEMS: [] });
	crfPOStrip.setText('Select a purchase order to load its line items.');
	crfPOStrip.setType('Information');
	vboxCompReqForm.setVisible(true);
}

function onCompReqPOChange() {
	var poNo = crfPOSelect.getSelectedKey();
	var po = findPO(poNo);
	if (!po) { modelCompReqLines.setData({ ITEMS: [] }); return; }
	var lines = po.lines.map(function(l){
		var rem = cocRemaining(l);
		return {
			lineNo: l.lineNo,
			description: l.lineNo + ' - ' + l.description,
			unitInfo: 'Unit: ' + l.unit + ' \u00b7 Unit price: ' + fmtEUR(l.price),
			orderedQty: String(l.orderedQty),
			remainingQty: String(rem),
			deliveredQty: rem > 0 ? String(rem) : '0',
			selected: false,
			price: l.price
		};
	});
	modelCompReqLines.setData({ ITEMS: lines });
	crfPOStrip.setText('Requesting acceptance against ' + po.poNumber + ' - ' + po.description + '. Only remaining (un-accepted) quantities can be requested.');
	crfPOStrip.setType('Information');
}

function collectCompReqSelectedLines() {
	var data = modelCompReqLines.getData();
	var sel = (data.ITEMS || []).filter(function(l){ return l.selected; });
	return sel;
}

function uploadCompReqEvidence() {
	var input = document.createElement('input');
	input.type = 'file';
	input.onchange = function() {
		var files = input.files;
		if (!files || !files.length) return;
		var data = modelCompReqAttach.getData();
		if (!data.ITEMS) data.ITEMS = [];
		data.ITEMS.push({ name: files[0].name, type: crfAttachType.getSelectedKey() || 'Other' });
		modelCompReqAttach.setData(data);
		sap.m.MessageToast.show('Evidence attached.');
	};
	input.click();
}

function buildCompReqRecord(poNo, sel, statusInfo) {
	var po = findPO(poNo);
	var lines = sel.map(function(l){ return { description: l.description, ordered: l.orderedQty, requested: l.deliveredQty }; });
	var atts = (modelCompReqAttach.getData().ITEMS || []).slice();
	var summary = sel.length + ' line' + (sel.length === 1 ? '' : 's') + (po ? ' - ' + po.description : '');
	return {
		requestNo: statusInfo.no, poNumber: poNo, vendor: 'Atlas Engineering Ltd.',
		lineSummary: summary, submittedOn: statusInfo.date, reviewedOn: '\u2013', reviewer: '\u2013',
		status: statusInfo.status, statusState: statusInfo.state,
		comments: crfComments.getValue() || '\u2013',
		lines: lines, attachments: atts
	};
}

function saveCompReqDraft() {
	var poNo = crfPOSelect.getSelectedKey();
	if (!poNo) { sap.m.MessageToast.show('Please select a Purchase Order first.'); return; }
	var sel = collectCompReqSelectedLines();
	var rec = buildCompReqRecord(poNo, sel, { no: 'CR-2026-' + String(9000 + Math.floor(Math.random() * 900)).padStart(4, '0'), date: 'Draft', status: 'Draft', state: 'None' });
	window.__allCompReqs.unshift(rec);
	sap.m.MessageToast.show('Completion Request saved as draft.');
	showCompReqView();
	setActiveNav(navCompReq);
}

function submitCompReq() {
	var poNo = crfPOSelect.getSelectedKey();
	if (!poNo) { sap.m.MessageToast.show('Please select a Purchase Order first.'); return; }
	var sel = collectCompReqSelectedLines();
	if (!sel.length) { sap.m.MessageBox.warning('Select at least one completed line item to request acceptance.', { styleClass: 'badeel_main_msgBox' }); return; }
	// Validate delivered qty <= remaining
	var invalid = sel.filter(function(l){ return (parseFloat(l.deliveredQty) || 0) <= 0 || (parseFloat(l.deliveredQty) || 0) > (parseFloat(l.remainingQty) || 0); });
	if (invalid.length) { sap.m.MessageBox.error('Delivered quantity must be greater than 0 and cannot exceed the remaining quantity for each selected line.', { styleClass: 'badeel_main_msgBox' }); return; }
	var today = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
	var rec = buildCompReqRecord(poNo, sel, { no: 'CR-2026-' + String(8000 + Math.floor(Math.random() * 900)).padStart(4, '0'), date: today, status: 'Submitted', state: 'Information' });
	window.__allCompReqs.unshift(rec);
	sap.m.MessageBox.success('Your Completion Request has been submitted for review by Badeel Procurement.', { styleClass: 'badeel_main_msgBox' });
	showCompReqView();
	setActiveNav(navCompReq);
}

// ---- Certificates of Completion (read-only for vendor) ----
function initCoCData() {
	sap.ui.getCore().setModel(modelCoCList, 'CoCList');
	// CoC data is loaded from the getCoclist API (see onGetCoclistSuccess). Start empty
	// until the API responds so the app is fully API-driven.
	window.__allCoCs = [];
	modelCoCList.setData({ ITEMS: [], detail: {} });
	modelCoCDetailLines.setData({ ITEMS: [] });
	modelCoCDetailAttach.setData({ ITEMS: [] });
}

function showCoCView() {
	hideAllContentSections();
	refreshCoCListModel();
	if (isAdminMode()) {
		cocSubtitle.setText('Certificates of Completion issued to all vendors. Issued once a Completion Request is accepted.');
		colCoCVendor.setVisible(true);
	} else {
		cocSubtitle.setText('Certificates of Completion (CoCs) issued by Badeel. Only approved CoCs may be used to create an invoice.');
		colCoCVendor.setVisible(false);
	}
	vboxCoC.setVisible(true);
}

function openCoCDetail(coc) {
	var data = modelCoCList.getData();
	data.detail = coc;
	modelCoCList.setData(data);
	modelCoCDetailLines.setData({ ITEMS: coc.lines || [] });
	modelCoCDetailAttach.setData({ ITEMS: coc.attachments || [] });
	cocAvatar.setInitials((coc.cocNo || '').slice(-2));
	cocDetInvoiceBtn.setVisible(!isAdminMode() && coc.status === 'Approved');
	// Source Completion Request line: "Issued from Completion Request CR-xxxx, reviewed by ..."
	var srcCR = null;
	if (coc.sourceCR) { srcCR = (window.__allCompReqs || []).filter(function(r){ return r.requestNo === coc.sourceCR; })[0]; }
	if (!srcCR) { srcCR = (window.__allCompReqs || []).filter(function(r){ return r.poNumber === coc.poNumber && r.status === 'Accepted'; })[0]; }
	window.__cocDetailSourceCR = srcCR || null;
	if (srcCR) {
		var reviewer = (srcCR.reviewer && srcCR.reviewer !== '\u2013') ? srcCR.reviewer : (coc.approvedBy || '\u2013');
		cocEvidenceSourceLink.setText(srcCR.requestNo);
		cocEvidenceSourceLink.setVisible(true);
		cocEvidenceSourceText.setText('Issued from Completion Request ');
		cocEvidenceSourceText2.setText(', reviewed by ' + reviewer + '.');
		cocEvidenceSourceRow.setVisible(true);
	} else {
		cocEvidenceSourceRow.setVisible(false);
	}
	hideAllContentSections();
	vboxCoCDetail.setVisible(true);
}

function showPaymentStatusView() {
	// Payment Status reuses the invoices list, focused on payment-related states.
	showInvListView(false);
	setStatusChip('Paid', chipPaid);
	invListTitle.setText('Payment Status');
	invListSubtitle.setText('Track payment progress for your submitted and approved invoices.');
	btnHeaderCreateInvoice.setVisible(false);
}

initCompReqData();
initCoCData();

// Derive admin KPI tile counts from the authoritative data arrays so tiles always match the lists.
function recomputeAdminKpis() {
	var vendors = window.__allVendors || [];
	var invoices = window.__allInvoices || [];
	var compReqs = window.__allCompReqs || [];
	function countBy(arr, prop, val) {
		return arr.filter(function(o){ return o[prop] === val; }).length;
	}
	var data = modelKpiData.getData() || {};
	if (!data.SUMMARY) data.SUMMARY = {};
	data.SUMMARY.vendorsInvited = vendors.length;
	data.SUMMARY.pendingRegistration = countBy(vendors, 'status', 'Pending Registration');
	data.SUMMARY.registeredVendors = countBy(vendors, 'status', 'Registered');
	data.SUMMARY.invoicesPendingReview = countBy(invoices, 'status', 'Submitted');
	data.SUMMARY.admCompReqAwaiting = countBy(compReqs, 'status', 'Submitted');
	// Vendor Home tiles (derived from the same lists the vendor sees)
	var cocs = window.__allCoCs || [];
	data.SUMMARY.compReqAwaiting = countBy(compReqs, 'status', 'Submitted');
	data.SUMMARY.approvedCoCs = countBy(cocs, 'status', 'Approved');
	data.SUMMARY.draftInvoices = countBy(invoices, 'status', 'Draft');
	data.SUMMARY.submittedInvoices = countBy(invoices, 'status', 'Submitted');
	data.SUMMARY.invoicesUnderApproval = countBy(invoices, 'status', 'Under Review');
	data.SUMMARY.paidInvoices = countBy(invoices, 'status', 'Paid');
	data.SUMMARY.approvedInvoices = countBy(invoices, 'status', 'Approved');
	modelKpiData.setData(data);
}
recomputeAdminKpis();




// Phase 2 hook: start Create Invoice from an approved CoC (full implementation in invoice rewrite phase)
function startInvoiceFromCoC(coc) {
	if (!coc || coc.status !== 'Approved') { sap.m.MessageToast.show('Only approved CoCs can be invoiced.'); return; }
	window.__invoiceFromCoC = coc;
	showInvoiceView();
	setActiveNav(navVendors);
	sap.m.MessageToast.show('Creating invoice for ' + coc.cocNo + ' (' + coc.poNumber + ').');
}




// ============ Purchase Order Detail (Ordered / Accepted / Remaining) ============
function openPODetail(poNumber) {
	var po = findPO(poNumber);
	if (!po) { sap.m.MessageToast.show('PO not found.'); return; }
	poDetailDialog.setTitle(po.poNumber + ' \u2014 ' + po.description);
	var lines = po.lines.map(function(l){
		var rem = (l.orderedQty - l.acceptedQty);
		var state = 'Warning', status = 'Partially accepted';
		if (l.acceptedQty === 0) { state = 'None'; status = 'Open'; }
		else if (rem === 0) { state = 'Success'; status = 'Fully accepted'; }
		return {
			description: l.lineNo + ' - ' + l.description,
			ordered: String(l.orderedQty) + ' ' + l.unit,
			accepted: String(l.acceptedQty) + ' ' + l.unit,
			remaining: String(rem) + ' ' + l.unit,
			lineStatus: status,
			lineState: state
		};
	});
	modelPODetailLines.setData({ ITEMS: lines });
	var cocs = (window.__allCoCs || []).filter(function(c){ return c.poNumber === poNumber; });
	poDetailLinksText.setText(po.entity + ' \u00b7 Contract ' + po.contractRef + '. This PO stays open until every line item is fully accepted across one or more CoCs. Approved CoCs: ' + cocs.filter(function(c){return c.status==='Approved';}).length + '.');
	poDetailDialog.open();
}




function deleteCompReqAttach(oEvent) {
	var oItem = oEvent.getSource().getParent();
	var ctx = oItem.getBindingContext('CompReqAttach');
	if (!ctx) return;
	var idx = parseInt(ctx.getPath().split('/').pop(), 10);
	var data = modelCompReqAttach.getData();
	data.ITEMS.splice(idx, 1);
	modelCompReqAttach.setData(data);
}




// ============ Admin: review Completion Requests & issue CoC ============
function refreshCoCListModel() {
	var d = modelCoCList.getData();
	d.ITEMS = (window.__allCoCs || []).filter(function(c){ return c.status === 'Approved'; });
	modelCoCList.setData(d);
}

function acceptCompReqAndIssueCoC() {
	var req = modelCompReqList.getData().detail;
	if (!req) return;
	var po = findPO(req.poNumber);
	var today = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
	var totalQty = 0, totalAmount = 0;
	var cocLines = (req.lines || []).map(function(l){
		var qty = parseFloat(String(l.requested).replace(/[^0-9.]/g, '')) || 0;
		var pl = null;
		if (po) { pl = po.lines.filter(function(x){ return (l.description || '').indexOf(x.lineNo + ' -') === 0 || (l.description || '').indexOf(x.description) > -1; })[0]; }
		var price = pl ? pl.price : 0;
		var ordered = pl ? pl.orderedQty : qty;
		var already = pl ? pl.acceptedQty : 0;
		if (pl) { pl.acceptedQty = Math.min(pl.orderedQty, pl.acceptedQty + qty); }
		totalQty += qty; totalAmount += qty * price;
		return { description: l.description, orderedQty: String(ordered), acceptedQty: String(qty), remainingQty: String(Math.max(0, ordered - already - qty)), acceptedAmount: fmtEUR(qty * price), price: price, lineNo: pl ? pl.lineNo : '', qty: qty };
	});
	var nextCoC = 'COC-2026-' + String(3000 + Math.floor(Math.random() * 900)).padStart(4, '0');
	var coc = {
		cocNo: nextCoC, poNumber: req.poNumber, issueDate: today, status: 'Approved', statusState: 'Success',
		acceptedLines: String(cocLines.length), acceptedQty: String(totalQty), acceptedAmount: fmtEUR(totalAmount),
		approvedBy: 'Karim Haddad (Procurement)', subtitle: 'Approved - ' + (po ? po.description : ''),
		sourceCR: req.requestNo, lines: cocLines, attachments: (req.attachments || []).slice()
	};
	if (!window.__allCoCs) window.__allCoCs = [];
	window.__allCoCs.unshift(coc);
	req.status = 'Accepted'; req.statusState = 'Success'; req.reviewedOn = today; req.reviewer = 'Karim Haddad (Procurement)'; req.cocNo = nextCoC;
	refreshCoCListModel();
	filterCompReqs();
	sap.m.MessageBox.success('Completion Request ' + req.requestNo + ' accepted. Certificate of Completion ' + nextCoC + ' has been issued.', { styleClass: 'badeel_main_msgBox' });
	openCompReqDetail(req);
}

function rejectCompReq() {
	var req = modelCompReqList.getData().detail;
	if (!req) return;
	sap.m.MessageBox.confirm('Reject completion request ' + req.requestNo + '?', {
		styleClass: 'badeel_main_msgBox',
		onClose: function(action) {
			if (action !== sap.m.MessageBox.Action.OK) return;
			var today = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
			req.status = 'Rejected'; req.statusState = 'Error'; req.reviewedOn = today; req.reviewer = 'Karim Haddad (Procurement)';
			req.rejection = 'Rejected by Badeel Procurement. Please review the supporting evidence and resubmit.';
			filterCompReqs();
			sap.m.MessageToast.show('Completion Request ' + req.requestNo + ' rejected.');
			openCompReqDetail(req);
		}
	});
}




function isAdminMode() { return navInviteText.getText() === 'Invite Vendors'; }







// ============ Lookups (from getLookups API, with mock fallback) ============
// Fallback defaults preserve original behavior until the API responds / if it fails.
window.__lookups = window.__lookups || {
	countries: [],
	taxCountries: [],
	currencies: [],
	paymentTerms: [],
	attachmentTypes: [],
	contactTitles: [],
	documentTypes: []
};

// Push cached lookups into every lookup-bound model. Safe to call repeatedly.
function applyLookups() {
	var L = window.__lookups;
	modelQualCountries.setData({ ITEMS: L.countries });
	modelQualTaxCountries.setData({ ITEMS: L.taxCountries });
	modelQualCurrencies.setData({ ITEMS: L.currencies });
	modelInvPayTerms.setData({ ITEMS: L.paymentTerms });
	modelInvAttachTypes.setData({ ITEMS: L.attachmentTypes });
	modelRegContactTitles.setData({ ITEMS: L.contactTitles });
	modelCompReqDocTypes.setData({ ITEMS: L.documentTypes });
}

// ajaxSuccess handler for getLookups: cache the API response then re-apply.
function onGetLookupsSuccess(xhr) {
	var response = xhr.responseJSON;
	if (!response) return;
	function items(node) { return (node && node.ITEMS) ? node.ITEMS : []; }
	var L = window.__lookups;
	if (items(response.countries).length) L.countries = items(response.countries);
	if (items(response.taxCountries).length) L.taxCountries = items(response.taxCountries);
	if (items(response.currencies).length) L.currencies = items(response.currencies);
	if (items(response.paymentTerms).length) L.paymentTerms = items(response.paymentTerms);
	if (items(response.attachmentTypes).length) L.attachmentTypes = items(response.attachmentTypes);
	if (items(response.contactTitles).length) L.contactTitles = items(response.contactTitles);
	if (items(response.documentTypes).length) L.documentTypes = items(response.documentTypes);
	applyLookups();
}

function onGetLookupsError(xhr) {
	// Keep fallback lookups so the app stays fully functional.
	applyLookups();
	sap.m.MessageToast.show('Could not load lookups from server. Using default reference data.');
}



// ============ Phase 1: load reference data from getLookups on startup ============
apigetLookups();



// ============ Phase 2: Vendors + Invitations (from API, with mock fallback) ============
function onGetVendorsSuccess(xhr) {
	var response = xhr.responseJSON;
	var data = (response && response.ITEMS) ? response.ITEMS : [];
	// API is the sole source of truth: always apply the response (even if empty).
	window.__allVendors = data;
	filterVendors();
	if (typeof recomputeAdminKpis === 'function') recomputeAdminKpis();
}

function onGetVendorsError(xhr) {
	window.__allVendors = [];
	filterVendors();
	sap.m.MessageToast.show('Could not load vendors from server.');
}

function onGetVendorinvitationsSuccess(xhr) {
	var response = xhr.responseJSON;
	var data = (response && response.ITEMS) ? response.ITEMS : [];
	modelRecentInvites.setData({ ITEMS: data });
}

function onGetVendorinvitationsError(xhr) {
	modelRecentInvites.setData({ ITEMS: [] });
	sap.m.MessageToast.show('Could not load recent invitations from server.');
}



// ============ Phase 2: load vendors + invitations from API on startup ============
// initVendorsData()/initInviteData() have already seeded fallback data synchronously above;
// these calls refresh those datasets from the server and overwrite the fallback on success.
apigetVendors();
apigetVendorinvitations();




// ============ Phase 3: Vendor Bank Accounts + Documents (from API, with mock fallback) ============
function onGetVendorbankaccountsSuccess(xhr) {
	var response = xhr.responseJSON;
	var data = (response && response.ITEMS) ? response.ITEMS : [];
	modelQualBanks.setData({ ITEMS: data });
}

function onGetVendorbankaccountsError(xhr) {
	modelQualBanks.setData({ ITEMS: [] });
	sap.m.MessageToast.show('Could not load bank accounts from server.');
}

function onGetVendordocumentsSuccess(xhr) {
	var response = xhr.responseJSON;
	var data = (response && response.ITEMS) ? response.ITEMS : [];
	modelQualDocs.setData({ ITEMS: data });
}

function onGetVendordocumentsError(xhr) {
	modelQualDocs.setData({ ITEMS: [] });
	sap.m.MessageToast.show('Could not load vendor documents from server.');
}

// ============ Phase 3: load bank accounts + documents from API on startup ============
// initQualData() seeds fallback bank/doc data synchronously; these calls refresh
// those datasets from the server and overwrite the fallback on success.
apigetVendorbankaccounts();
apigetVendordocuments();




// ============ Phase 4: Purchase Orders (from API, with mock fallback) ============
// getPurchaseorders refreshes the master PO catalogue (window.__poCatalog), the single
// source of truth that drives CompReq PO options and the CoC-based invoice PO list.
function onGetPurchaseordersSuccess(xhr) {
	var response = xhr.responseJSON;
	var data = (response && response.ITEMS) ? response.ITEMS : [];
	// API is the sole source of truth: always apply the response (even if empty).
	window.__poCatalog = data;
	if (typeof rebuildInvoicePOList === 'function') rebuildInvoicePOList();
	var poOpts = window.__poCatalog.map(function(p){
		return { poNumber: p.poNumber, poLabel: p.poNumber + ' - ' + p.description };
	});
	modelCompReqPOs.setData({ ITEMS: poOpts });
}

function onGetPurchaseordersError(xhr) {
	window.__poCatalog = [];
	if (typeof rebuildInvoicePOList === 'function') rebuildInvoicePOList();
	modelCompReqPOs.setData({ ITEMS: [] });
	sap.m.MessageToast.show('Could not load purchase orders from server.');
}

// getInvoicepurchaseorders returns the invoiceable PO list ready for the invoice wizard.
function onGetInvoicepurchaseordersSuccess(xhr) {
	var response = xhr.responseJSON;
	var data = (response && response.ITEMS) ? response.ITEMS : [];
	modelInvPOs.setData({ ITEMS: data });
}

function onGetInvoicepurchaseordersError(xhr) {
	modelInvPOs.setData({ ITEMS: [] });
	sap.m.MessageToast.show('Could not load invoice purchase orders from server.');
}

// ============ Phase 4: load purchase orders from API on startup ============
apigetPurchaseorders();
apigetInvoicepurchaseorders();




// ============ Phase 5: Completion Requests (from API, with mock fallback) ============
// getCompletionrequests refreshes window.__allCompReqs, the master source that drives
// the CompReq list, Admin review, CoC source linking and Admin KPIs.
function onGetCompletionrequestsSuccess(xhr) {
	var response = xhr.responseJSON;
	var data = (response && response.ITEMS) ? response.ITEMS : [];
	// API is the sole source of truth: always apply the response (even if empty).
	window.__allCompReqs = data;
	var d = modelCompReqList.getData() || {};
	d.ITEMS = window.__allCompReqs.slice();
	modelCompReqList.setData(d);
	if (typeof recomputeAdminKpis === 'function') recomputeAdminKpis();
}

function onGetCompletionrequestsError(xhr) {
	window.__allCompReqs = [];
	var d = modelCompReqList.getData() || {};
	d.ITEMS = [];
	modelCompReqList.setData(d);
	sap.m.MessageToast.show('Could not load completion requests from server.');
}

// ============ Phase 5: load completion requests from API on startup ============
apigetCompletionrequests();




// ============ Phase 6: Certificates of Completion / CoC (from API, with mock fallback) ============
// getCoclist refreshes window.__allCoCs, the master source that drives the CoC list,
// invoice PO eligibility, invoice CoC options, CoC source linking and Admin KPIs.
function onGetCoclistSuccess(xhr) {
	var response = xhr.responseJSON;
	var data = (response && response.ITEMS) ? response.ITEMS : [];
	// API is the sole source of truth: always apply the response (even if empty).
	window.__allCoCs = data;
	// Refresh dependents so the PO -> CoC -> Invoice chain stays consistent.
	if (typeof refreshCoCListModel === 'function') refreshCoCListModel();
	if (typeof rebuildInvoicePOList === 'function') rebuildInvoicePOList();
	if (typeof recomputeAdminKpis === 'function') recomputeAdminKpis();
}

function onGetCoclistError(xhr) {
	sap.m.MessageToast.show('Could not load Certificates of Completion from server. Showing default data.');
}

// ============ Phase 6: load CoC list from API on startup ============
apigetCoclist();




// ============ Phase 7: Invoices (from API, with mock fallback) ============
// getInvoices refreshes window.__allInvoices, the master source that drives the invoice
// list, invoice detail, approve/reject and Admin KPIs.
function onGetInvoicesSuccess(xhr) {
	var response = xhr.responseJSON;
	var data = (response && response.ITEMS) ? response.ITEMS : [];
	// API is the sole source of truth: always apply the response (even if empty).
	window.__allInvoices = data;
	if (typeof filterInvoices === 'function') filterInvoices();
	if (typeof recomputeAdminKpis === 'function') recomputeAdminKpis();
}

function onGetInvoicesError(xhr) {
	window.__allInvoices = [];
	if (typeof filterInvoices === 'function') filterInvoices();
	sap.m.MessageToast.show('Could not load invoices from server.');
}

// ============ Phase 7: load invoices from API on startup ============
apigetInvoices();




// ============ Phase 8: KPI Data (from API, with derived fallback) ============
// KPI tiles are normally DERIVED from the live data arrays via recomputeAdminKpis().
// getKpidata provides authoritative server-computed totals: when it returns values we
// MERGE them into modelKpiData.SUMMARY (server wins per-key); otherwise the derived
// values from recomputeAdminKpis() remain as the fallback.
function onGetKpidataSuccess(xhr) {
	var response = xhr.responseJSON;
	if (!response) return;
	// Accept either { SUMMARY: {...} } or a flat summary object.
	var incoming = response.SUMMARY ? response.SUMMARY : response;
	if (!incoming || typeof incoming !== 'object') return;
	var data = modelKpiData.getData() || {};
	if (!data.SUMMARY) data.SUMMARY = {};
	Object.keys(incoming).forEach(function(k) {
		if (incoming[k] !== null && incoming[k] !== undefined) {
			data.SUMMARY[k] = incoming[k];
		}
	});
	modelKpiData.setData(data);
}

function onGetKpidataError(xhr) {
	sap.m.MessageToast.show('Could not load KPI data from server. Showing derived values.');
}

// ============ Phase 8: load KPI data from API on startup ============
apigetKpidata();
