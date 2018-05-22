let receipts = (() => {


    function createEntry(type, qty, price, receiptId) {//POST https://baas.kinvey.com/appdata/app_key/entries
        let data = {type, qty, price, receiptId};
        return requester.post("appdata", 'entries', 'kinvey', data)

    }

    function deleteEntry(entry_id) { //DELETE https://baas.kinvey.com/appdata/app_key/entries/entry_id
        const endpoint = `entries/${entry_id}`;
        return requester.remove('appdata', endpoint, 'kinvey');

    }

    function createReceipt(active, productCount, total) {//POST https://baas.kinvey.com/appdata/app_key/receipts
        let data = {active, productCount, total};
        return requester.post("appdata", 'receipts', 'kinvey', data)

    }

    function getActiveReceipt(userId) {//GET https://baas.kinvey.com/appdata/app_key/receipts?query={"_acl.creator":"userId","active":"true"}
        const endpoint = `receipts?query={"_acl.creator":"${userId}","active":"true"}`;
        return requester.get('appdata', endpoint, 'kinvey');
    }


    function getEntries(receiptId) { //GET https://baas.kinvey.com/appdata/app_key/entries?query={"receiptId":"receiptId"}
        const endpoint = `entries?query={"receiptId":"${receiptId}"}`;
        return requester.get("appdata", endpoint, 'kinvey')

    }

    function getMyReceipts(userId) {//GET https://baas.kinvey.com/appdata/app_key/receipts?query={"_acl.creator":"userId","active":"false"}
        const endpoint = `receipts?query={"_acl.creator":"${userId}","active":"false`;
        return requester.get("appdata", endpoint, 'kinvey');
    }

    function receiptDetails(receipt_id) {//GET https://baas.kinvey.com/appdata/app_key/receipts/receipt_id
        const endpoint = `receipts/${receipt_id}`;
        return requester.get('appdata', endpoint, 'kinvey');
    }
    function commitReceipt(receipt_id,active, productCount,total) {//PUT https://baas.kinvey.com/appdata/app_key/receipts/receipt_id
        const endpoint = `receipts/${receipt_id}`;
        let data = {active, productCount,total};
        return requester.update('appdata', endpoint, 'kinvey', data)
    }

    return {
        createEntry,
        deleteEntry,
        createReceipt,
        getActiveReceipt,
        getEntries,
        getMyReceipts,
        receiptDetails,
        commitReceipt


    }

})();