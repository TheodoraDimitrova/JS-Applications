let auth = (() => {
    function isAuth() {
        return sessionStorage.getItem('authtoken') !== null;
    }

    function login(username, password) {
        let userData = {
            username,
            password
        };

        return requester.post('user', 'login', 'basic', userData);
    }


    function register(username, password, name) {//POST https://baas.kinvey.com/user/app_id/
        let userData = {
            username,
            password,
            name
        };

        return requester.post('user', '', 'basic', userData);
    }

    function logout() {//https://baas.kinvey.com/user/app_id/_logout
        let logoutData = {
            authtoken: sessionStorage.getItem('authtoken')
        };

        return requester.post('user', '_logout', 'kinvey', logoutData);
    }


    function saveSession(userInfo) {
        let id = userInfo['_id'];
        let username = userInfo['username'];
        let authtoken = userInfo['_kmd']['authtoken'];
        let name=userInfo['name'];

        sessionStorage.setItem('id', id);
        sessionStorage.setItem('name', name);
        sessionStorage.setItem('username', username);
        sessionStorage.setItem('authtoken', authtoken);
    }



    return {
        isAuth,
        login,
        register,
        logout,
        saveSession,

    }
})();