let messages = (() => {

    function getAllMessages(username) {//GET https://baas.kinvey.com/appdata/app_id/messages?query={"recipient_username":"username"}
        const endpoint = `messages?query={"recipient_username":"${username}"}`;
        return requester.get('appdata', endpoint, 'kinvey');
    }

    function sendMessage(sender_username, sender_name, recipient_username, text) {//POST https://baas.kinvey.com/appdata/app_id/messages
        let data = {sender_username, sender_name, recipient_username, text};
        return requester.post("appdata", 'messages', 'kinvey', data)

    }

    function getMyMessages(username) {//GET https://baas.kinvey.com/appdata/app_id/messages?query={"recipient_username":"username"}
        const endpoint = `messages?query={"sender_username":"${username}"}`;
        return requester.get('appdata', endpoint, "kinvey");

    }

    function deleteMessage(msg_id) {//DELETE https://baas.kinvey.com/appdata/app_id/messages/msg_id
        const endpoint = `messages/${msg_id}`;
        return requester.remove('appdata', endpoint, 'kinvey');

    }


    function listAllUsers() {//GET https://baas.kinvey.com/user/app_id/
        return requester.get('user','', 'kinvey');
    }

    return {
        getAllMessages,
        sendMessage,
        getMyMessages,
        deleteMessage,
        listAllUsers


    }

})();