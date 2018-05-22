let posts = (() => {

    function getAllPosts() {////GET https://baas.kinvey.com/appdata/app_id/posts?query={}&sort={"_kmd.ect": -1}
        const endpoint = 'posts?query={}&sort={"_kmd.ect": -1}';
        return requester.get('appdata', endpoint, 'kinvey');
    }

    function createPost(author, title, description, url, imageUrl) {// //POST https://baas.kinvey.com/appdata/app_id/posts
        let data = {author, title, description, url, imageUrl};
        return requester.post("appdata", 'posts', 'kinvey', data)

    }

    function editPost(postId, author, title, description, url, imageUrl) {//PUT https://baas.kinvey.com/appdata/app_id/posts/post_id
        const endpoint = `posts/${postId}`;
        let data = {author, title, description, url, imageUrl};
        return requester.update('appdata', endpoint, 'kinvey', data)
    }

    function deletePost(postId) {//DELETE https://baas.kinvey.com/appdata/app_id/posts/post_id
        const endpoint = `posts/${postId}`;
        return requester.remove('appdata', endpoint, 'kinvey');

    }

    function getMyPosts(username) {//GET https://baas.kinvey.com/appdata/app_id/posts?query={"author":"username"}&sort={"_kmd.ect": -1}
        const endpoint = `posts?query={"author":"${username}"}&sort={"_kmd.ect": -1}`;
        return requester.get('appdata', endpoint, "kinvey");

    }

    function getPostById(postId) {//GET https://baas.kinvey.com/appdata/app_id/posts/post_id
        const endpoint = `posts/${postId}`;
        return requester.get('appdata', endpoint, 'kinvey');
    }

    return {
        getAllPosts,
        createPost,
        editPost,
        deletePost,
        getPostById,
        getMyPosts

    }

})();
