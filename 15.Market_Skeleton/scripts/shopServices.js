let shop = (() => {

    function getAllProducts() {//GET https://baas.kinvey.com/appdata/app_id/products
        const endpoint = `products`;
        return requester.get('appdata', endpoint, 'kinvey');
    }

    function getUserInfo(user_id) {//GET https://baas.kinvey.com/user/app_id/user_Id
        return requester.get('user',`${user_id}`, "kinvey");
    }
    function updateUser(userInfo) {//PUT https://baas.kinvey.com/user/app_id/user_Id
        let endPoint = sessionStorage.getItem('id');
        return requester.update('user', endPoint, 'kinvey', userInfo)
    }





    return {
        getAllProducts,
        getUserInfo,
       updateUser



    }

})();