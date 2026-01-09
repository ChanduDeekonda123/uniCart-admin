export const stepperUrls: any = ['general', 'basic', 'address', 'contact', 'finance', 'bank', 'statutory', 'confirmation']
export const listParams: any = ['d', 'p', 'a', 'r'];
export const actionsKeys: any = {
    edit: 'Edit',
    view: 'View',
    delete: 'Delete'
}
export const actionBtns: any = [
    { text: actionsKeys['edit'], icon: 'https://i.postimg.cc/HW82G1bj/pencil.png' },
    { text: actionsKeys['view'], icon: 'https://i.postimg.cc/mrdw4bdm/eye.png' },
    { text: actionsKeys['delete'], icon: 'https://i.postimg.cc/x15GGfVt/recycle-bin.png' }
]
export const sellerFields: any = [
    { label: 'Business Partner', value: 'businessPartner', isCheck: true },
    { label: 'Business Partner Code', value: 'businessPartnerCode', isCheck: true },
    { label: 'Created On', value: 'createdOn', isCheck: true },
    { label: 'City', value: 'city', isCheck: true },
    { label: 'State', value: 'state', isCheck: true },
    { label: 'Country', value: 'country', isCheck: false },
    { label: 'Pin Code', value: 'pincode', isCheck: false },
    { label: 'Currency', value: 'currency', isCheck: false },
    { label: 'Record Status', value: 'recordStatus', isCheck: false },
    { label: 'Store Name', value: 'storeName', isCheck: false },
    { label: 'GST Number', value: 'gstNumber', isCheck: false },
    { label: 'Brand Name', value: 'brandName', isCheck: false },
    { label: 'Sales Rating', value: 'salesRating', isCheck: false },
    { label: 'Payment Rating', value: 'paymentRating', isCheck: false },
    { label: 'Transit Days', value: 'transitDays', isCheck: false },
    { label: 'Balance', value: 'balance', isCheck: false },
    { label: 'Over due', value: 'overDuebalance', isCheck: false },
    { label: 'Account group', value: 'accountGroup', isCheck: false },
    { label: 'SL Account', value: 'slAccount', isCheck: false },
    { label: 'Tax Rate', value: 'taxRates', isCheck: false },
    { label: 'Payment Term', value: 'paymentTerm', isCheck: false },
    { label: 'Mode Of Payment', value: 'modeOfPayment', isCheck: false },
    { label: 'Overdue Days', value: 'overdueDays', isCheck: false },
    { label: 'Credit Limit', value: 'creditLimit', isCheck: false },
    { label: 'Credit Hold Amount', value: 'creditHoldAmount', isCheck: false },
    { label: 'Credit Hold', value: 'isCreditHold', isCheck: false },
    { label: 'Overdue Hold', value: 'isOverdueHold', isCheck: false },
    { label: 'Payment Reminder', value: 'paymentReminder', isCheck: false },
    { label: 'Business Model', value: 'businessModel', isCheck: false },
    { label: 'Business Category', value: 'businessCategory', isCheck: false },
    { label: 'Primary Product Category', value: 'primaryProductCategory', isCheck: false },
    { label: 'Domestic', value: 'domestic', isCheck: false },
    { label: 'PAN No', value: 'panNo', isCheck: false },
    { label: 'Aadhar No', value: 'aadharNo', isCheck: false },
    { label: 'MSME No', value: 'msmeNo', isCheck: false },
    { label: 'PF No', value: 'pfNo', isCheck: false },
    { label: 'ESI No', value: 'esiNo', isCheck: false },
];

//store the constant values used across your seller module/pages
//these constant help you avoid repeating strings everywhere, making the project cleaner and easier to maintain