function initHomeData() {
	// KPIs for both roles
	modelKpiData.setData({
		SUMMARY: {
			vendorsInvited: 8,
			pendingRegistration: 2,
			registeredVendors: 4,
			invoicesPendingReview: 2,
			draftInvoices: 1,
			submittedInvoices: 1,
			approvedInvoices: 1,
			openPurchaseOrders: 3
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
		txtWelcomeSub.setText('Here is an overview of your invoices and purchase orders.');
		btnRoleVendor.addStyleClass('badeel_main_roleBtnActive');
		btnRoleAdmin.removeStyleClass('badeel_main_roleBtnActive');
		// Vendor sidebar menu: Home, Qualification Profile, Create Invoice, Invoices
		navInviteText.setText('Qualification Profile');
		navInviteIcon.setSrc('sap-icon://document-text');
		navVendorsText.setText('Create Invoice');
		navVendorsIcon.setSrc('sap-icon://add-document');
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
	[navHome, navInvite, navVendors, navInvoices].forEach(function(it){ it.removeStyleClass('badeel_main_navItemActive'); });
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
	navSettings.attachBrowserEvent('click', function() { sap.m.MessageToast.show('Settings'); });
}
wireNavClicks();




// ============ Qualification Profile ============
function initQualData() {
	var countries = ['United Kingdom','Spain','Germany','Greece','Portugal','United Arab Emirates','Singapore','Nigeria','Other'];
	var taxCountries = ['United Kingdom','Spain','Germany','Greece','Portugal','United Arab Emirates'];
	modelQualCountries.setData({ ITEMS: countries.map(function(c){ return { key: c, text: c }; }) });
	modelQualTaxCountries.setData({ ITEMS: taxCountries.map(function(c){ return { key: c, text: c }; }) });
	modelQualCurrencies.setData({ ITEMS: [{key:'EUR',text:'EUR'},{key:'USD',text:'USD'},{key:'GBP',text:'GBP'}] });
	modelQualBanks.setData({ ITEMS: [
		{ bankName: 'Banco Santander', account: 'ES91 2100 0418 4502 0005 1332', swift: 'BSCHESMM', currency: 'EUR' }
	] });
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
	modelInvPayTerms.setData({ ITEMS: [{key:'Net 30',text:'Net 30'},{key:'Net 45',text:'Net 45'},{key:'Net 60',text:'Net 60'}] });
	modelInvAttachTypes.setData({ ITEMS: [{key:'Tax Invoice',text:'Tax Invoice'},{key:'Certificate of Completion',text:'Certificate of Completion'},{key:'Supporting Document',text:'Supporting Document'}] });
	modelInvLines.setData({ ITEMS: [] });
	modelInvAttach.setData({ ITEMS: [] });
	sap.ui.getCore().setModel(modelInvForm, 'InvForm');
	modelInvForm.setData({ selectedPO: null, gross: 0, advancePaid: 0, net: 0 });
}

function showInvoiceView() {
	vboxHeader.setVisible(false);
	vboxAdmin.setVisible(false);
	vboxVendor.setVisible(false);
	vboxQual.setVisible(false);
	vboxInvList.setVisible(false);
	vboxInvDetail.setVisible(false);
	vboxInvite.setVisible(false);
	vboxVendors.setVisible(false);
	vboxVendorDetail.setVisible(false);
	vboxInvoice.setVisible(true);
	resetWizard();
}

function resetWizard() {
	invCurrentStep = 1;
	modelInvLines.setData({ ITEMS: [] });
	modelInvAttach.setData({ ITEMS: [] });
	invNumber.setValue('');
	poTable.removeSelections(true);
	modelInvForm.setData({ selectedPO: null, gross: 0, advancePaid: 0, net: 0 });
	poSummaryStrip.setText('Select a purchase order in step 1.');
	invBillingDetails.setValue('');
	invTaxInfo.setValue('');
	invCurrency.setValue('EUR');
	lineItemsGrossTotal.setText('\u2013');
	goToStep(1);
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
	if (step === 3) recalcLineItems();
	if (step === 4) updateAdvanceSummary();
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

function onPOSelect(oEvent) {
	var oItem = oEvent.getParameter('listItem') || oEvent.getSource();
	if (!oItem) return;
	var ctx = oItem.getBindingContext('InvPOs');
	if (!ctx) return;
	var po = ctx.getObject();
	var fd = modelInvForm.getData();
	fd.selectedPO = po;
	fd.advancePaid = po.advancePaid || 0;
	modelInvForm.setData(fd);
	poSummaryStrip.setText('Invoicing against ' + po.poNumber + ' \u2014 ' + po.description + '. Remaining: ' + po.remaining);
	invBillingDetails.setValue(po.billing);
	invTaxInfo.setValue(po.tax);
	invCurrency.setValue(po.currency);
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
	html += pair('PO Number', po.poNumber);
	html += pair('Entity', po.entity);
	html += pair('Invoice Number', invNumber.getValue());
	html += pair('Invoice Date', dateDisp);
	html += pair('Payment Terms', invPaymentTerms.getSelectedKey());
	html += pair('Billed From', billedFrom);
	html += '</div></div>';

	// Line Items section
	html += '<div class="badeel_main_revSection">';
	html += '<div class="badeel_main_revSectionTitle">Line Items</div>';
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
			html += '<td class="badeel_main_revNum">' + fmtEUR(li.price) + '</td>';
			html += '<td class="badeel_main_revNum">' + esc(li.tax) + '%</td>';
			html += '<td class="badeel_main_revNum">' + esc(li.total) + '</td>';
			html += '</tr>';
		});
	}
	html += '</tbody></table></div>';

	// Attachments section
	html += '<div class="badeel_main_revSection">';
	html += '<div class="badeel_main_revSectionTitle">Attachments</div>';
	if (atts.length === 0) {
		html += '<div class="badeel_main_revEmptyText">No documents attached.</div>';
	} else {
		html += '<ul class="badeel_main_revAttList">';
		atts.forEach(function(a){ html += '<li><span class="badeel_main_revAttName">' + esc(a.name) + '</span><span class="badeel_main_revAttType">' + esc(a.type) + '</span></li>'; });
		html += '</ul>';
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
		if (!invNumber.getValue() || !invDate.getValue()) { sap.m.MessageToast.show('Invoice Number and Date are required.'); return; }
	}
	if (invCurrentStep === 3) {
		var lines = modelInvLines.getData().ITEMS || [];
		if (lines.length === 0) { sap.m.MessageToast.show('Add at least one line item.'); return; }
		recalcLineItems();
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
	window.__allInvoices = [
		{ invoiceNo: 'INV-2026-0071', poNumber: 'PO-100234', entity: 'Badeel - National Renewable Energy Program (NREP)', vendor: 'Atlas Engineering Ltd.', netPayable: '\u20ac18,500.00', status: 'Draft', statusState: 'None', date: '03 Jul 2026', dueDate: '02 Aug 2026', terms: 'Net 30', gross: '\u20ac18,500.00', advance: '\u2013 \u20ac0.00', net: '\u20ac18,500.00', rejection: '', lines: [{description:'Engineering consultancy', qty:'10', price:'\u20ac1,850.00', tax:'0', total:'\u20ac18,500.00'}], attachments: [] },
		{ invoiceNo: 'INV-2026-0041', poNumber: 'PO-100234', entity: 'Badeel - National Renewable Energy Program (NREP)', vendor: 'Atlas Engineering Ltd.', netPayable: '\u20ac70,000.00', status: 'Approved', statusState: 'Success', date: '02 Jun 2026', dueDate: '02 Jul 2026', terms: 'Net 30', gross: '\u20ac90,000.00', advance: '\u2013 \u20ac20,000.00', net: '\u20ac70,000.00', rejection: '', lines: [{description:'Solar panel installation', qty:'1', price:'\u20ac90,000.00', tax:'0', total:'\u20ac90,000.00'}], attachments: [{name:'tax-invoice-0041.pdf', type:'Tax Invoice'},{name:'completion-cert.pdf', type:'Certificate of Completion'}] },
		{ invoiceNo: 'INV-2026-0035', poNumber: 'PO-100240', entity: 'Badeel Facilities', vendor: 'Atlas Engineering Ltd.', netPayable: '\u20ac12,300.00', status: 'Submitted', statusState: 'Information', date: '20 May 2026', dueDate: '19 Jun 2026', terms: 'Net 30', gross: '\u20ac12,300.00', advance: '\u2013 \u20ac0.00', net: '\u20ac12,300.00', rejection: '', lines: [{description:'Cleaning services', qty:'3', price:'\u20ac4,100.00', tax:'0', total:'\u20ac12,300.00'}], attachments: [{name:'tax-invoice-0035.pdf', type:'Tax Invoice'}] },
		{ invoiceNo: 'INV-2026-0028', poNumber: 'PO-100255', entity: 'Badeel IT', vendor: 'Atlas Engineering Ltd.', netPayable: '\u20ac8,900.00', status: 'Under Review', statusState: 'Warning', date: '11 May 2026', dueDate: '10 Jun 2026', terms: 'Net 45', gross: '\u20ac8,900.00', advance: '\u2013 \u20ac0.00', net: '\u20ac8,900.00', rejection: '', lines: [{description:'Cloud setup', qty:'1', price:'\u20ac8,900.00', tax:'0', total:'\u20ac8,900.00'}], attachments: [] },
		{ invoiceNo: 'INV-2026-0019', poNumber: 'PO-100255', entity: 'Badeel IT', vendor: 'Atlas Engineering Ltd.', netPayable: '\u20ac25,000.00', status: 'Paid', statusState: 'Success', date: '28 Apr 2026', dueDate: '28 May 2026', terms: 'Net 30', gross: '\u20ac25,000.00', advance: '\u2013 \u20ac0.00', net: '\u20ac25,000.00', rejection: '', lines: [{description:'Software licenses', qty:'50', price:'\u20ac500.00', tax:'0', total:'\u20ac25,000.00'}], attachments: [{name:'tax-invoice-0019.pdf', type:'Tax Invoice'}] },
		{ invoiceNo: 'INV-2026-0007', poNumber: 'PO-100240', entity: 'Badeel Facilities', vendor: 'Atlas Engineering Ltd.', netPayable: '\u20ac4,200.00', status: 'Rejected', statusState: 'Error', date: '15 Apr 2026', dueDate: '15 May 2026', terms: 'Net 30', gross: '\u20ac4,200.00', advance: '\u2013 \u20ac0.00', net: '\u20ac4,200.00', rejection: 'Missing certificate of completion. Please attach and resubmit.', lines: [{description:'Ad-hoc maintenance', qty:'2', price:'\u20ac2,100.00', tax:'0', total:'\u20ac4,200.00'}], attachments: [] }
	];
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
	modelInviteRows.setData({ ITEMS: [{ company: '', contact: '', email: '' }] });
	modelRecentInvites.setData({ ITEMS: [
		{ company: 'Stellar Marine Logistics', contact: 'Ms. Ines Duarte', email: 'ines.duarte@stellarmarine.com', status: 'Invitation Sent', statusState: 'Information', invitedOn: '05 Jul 2026' },
		{ company: 'Horizon Facilities Group', contact: 'Mr. Marcus Weber', email: 'm.weber@horizonfg.com', status: 'Invitation Sent', statusState: 'Information', invitedOn: '01 Jul 2026' },
		{ company: 'Bright Line IT Consulting', contact: 'Mr. Daniel Okafor', email: 'daniel@brightlineit.com', status: 'Pending Registration', statusState: 'Warning', invitedOn: '25 Jun 2026' },
		{ company: 'NovaTech Digital Solutions', contact: 'Mr. Rahul Menon', email: 'rahul.menon@novatech.io', status: 'Pending Registration', statusState: 'Warning', invitedOn: '18 Jun 2026' },
		{ company: 'Meridian Supply Chain Co.', contact: 'Ms. Elena Papadopoulos', email: 'elena.p@meridiansc.com', status: 'Registered', statusState: 'Success', invitedOn: '04 May 2026' },
		{ company: 'Atlas Freight Partners', contact: 'Mr. Omar Siddiqui', email: 'omar@atlasfreight.com', status: 'Registered', statusState: 'Success', invitedOn: '28 Apr 2026' }
	] });
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
	window.__allVendors = [
		{ company: 'Stellar Marine Logistics', contact: 'Ms. Ines Duarte', country: 'Portugal', status: 'Invitation Sent', statusState: 'Information', qualification: 'Not Started', invitedOn: '05 Jul 2026', registeredOn: '\u2013', legalName: 'Stellar Marine Logistics Lda.', taxId: 'PT509876543', address: 'Rua do Ouro 120', city: 'Lisbon', zip: '1100-062', contactTitle: 'Ms.', contactFirstName: 'Ines', contactLastName: 'Duarte', contactEmail: 'ines.duarte@stellarmarine.com', contactPhone: '+351 21 555 0110', bankVerified: 'No', categories: ['Logistics','Freight Forwarding'], locations: [{name:'Lisbon HQ', city:'Lisbon', country:'Portugal'}] },
		{ company: 'Horizon Facilities Group', contact: 'Mr. Marcus Weber', country: 'Germany', status: 'Invitation Sent', statusState: 'Information', qualification: 'Not Started', invitedOn: '01 Jul 2026', registeredOn: '\u2013', legalName: 'Horizon Facilities GmbH', taxId: 'DE811234567', address: 'Hauptstrasse 45', city: 'Munich', zip: '80331', contactTitle: 'Mr.', contactFirstName: 'Marcus', contactLastName: 'Weber', contactEmail: 'm.weber@horizonfg.com', contactPhone: '+49 89 555 0134', bankVerified: 'No', categories: ['Facilities Management','Cleaning'], locations: [{name:'Munich Office', city:'Munich', country:'Germany'}] },
		{ company: 'Bright Line IT Consulting', contact: 'Mr. Daniel Okafor', country: 'Nigeria', status: 'Pending Registration', statusState: 'Warning', qualification: 'In Progress', invitedOn: '25 Jun 2026', registeredOn: '\u2013', legalName: 'Bright Line IT Consulting Ltd.', taxId: 'NG12345678', address: '14 Adeola Odeku St', city: 'Lagos', zip: '101241', contactTitle: 'Mr.', contactFirstName: 'Daniel', contactLastName: 'Okafor', contactEmail: 'daniel@brightlineit.com', contactPhone: '+234 1 555 0190', bankVerified: 'No', categories: ['IT Consulting','Software'], locations: [{name:'Lagos HQ', city:'Lagos', country:'Nigeria'}] },
		{ company: 'Meridian Supply Chain Co.', contact: 'Ms. Elena Papadopoulos', country: 'Greece', status: 'Registered', statusState: 'Success', qualification: 'Approved', invitedOn: '04 May 2026', registeredOn: '12 May 2026', legalName: 'Meridian Supply Chain S.A.', taxId: 'EL998877665', address: 'Leof. Kifisias 200', city: 'Athens', zip: '11525', contactTitle: 'Ms.', contactFirstName: 'Elena', contactLastName: 'Papadopoulos', contactEmail: 'elena.p@meridiansc.com', contactPhone: '+30 21 555 0155', bankVerified: 'Yes', categories: ['Supply Chain','Warehousing','Distribution'], locations: [{name:'Athens DC', city:'Athens', country:'Greece'},{name:'Thessaloniki Hub', city:'Thessaloniki', country:'Greece'}] },
		{ company: 'Atlas Freight Partners', contact: 'Mr. Omar Siddiqui', country: 'United Arab Emirates', status: 'Registered', statusState: 'Success', qualification: 'Approved', invitedOn: '28 Apr 2026', registeredOn: '03 May 2026', legalName: 'Atlas Freight Partners FZE', taxId: 'AE100234567800003', address: 'Jebel Ali Free Zone', city: 'Dubai', zip: '17000', contactTitle: 'Mr.', contactFirstName: 'Omar', contactLastName: 'Siddiqui', contactEmail: 'omar@atlasfreight.com', contactPhone: '+971 4 555 0178', bankVerified: 'Yes', categories: ['Freight','Customs Clearance'], locations: [{name:'Dubai HQ', city:'Dubai', country:'United Arab Emirates'}] },
		{ company: 'Atlas Engineering Ltd.', contact: 'Ms. Sofia Marin', country: 'Spain', status: 'Registered', statusState: 'Success', qualification: 'Approved', invitedOn: '20 Apr 2026', registeredOn: '26 Apr 2026', legalName: 'Atlas Engineering Ltd.', taxId: 'ESB12345674', address: 'Calle Mayor 45', city: 'Madrid', zip: '28013', contactTitle: 'Ms.', contactFirstName: 'Sofia', contactLastName: 'Marin', contactEmail: 'sofia.marin@atlaseng.com', contactPhone: '+34 91 555 0147', bankVerified: 'Yes', categories: ['Engineering','Construction','Renewable Energy'], locations: [{name:'Madrid HQ', city:'Madrid', country:'Spain'}] }
	];
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
	vboxVendorDetail.setVisible(true);
}

function renderVendorCategories(cats) {
	var dom = categoryTags.getDomRef();
	if (!dom) { setTimeout(function(){ renderVendorCategories(cats); }, 60); return; }
	var html = '';
	cats.forEach(function(c){ html += '<span class="badeel_main_tagPill">' + esc(c) + '</span>'; });
	dom.innerHTML = html || '<span class="badeel_main_revEmptyText">No categories.</span>';
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
	modelRegContactTitles.setData({ ITEMS: [
		{ key: 'Mr.', text: 'Mr.' },
		{ key: 'Ms.', text: 'Ms.' },
		{ key: 'Mrs.', text: 'Mrs.' },
		{ key: 'Dr.', text: 'Dr.' }
	] });
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
