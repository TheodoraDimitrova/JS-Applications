let comments = (() => {


    function getPostComments(postId) {//https://baas.kinvey.com/appdata/app_id/comments?query={"postId":"post_id"}&sort={"_kmd.ect": -1}
        const endpoint = `comments?query={"postId":"${postId}"}&sort={"_kmd.ect": -1}`;
        return requester.get('appdata', endpoint, 'kinvey');

    }

    function createComment(postId, content, author) {//POST https://baas.kinvey.com/appdata/app_id/comments

        let data = {postId, content, author};
        return requester.post('appdata', 'comments', 'kinvey', data);

    }

    //DELETE https://baas.kinvey.com/appdata/app_id/comments/comment_id
    function deleteComment(commentId) {
        const endpoint = `comments/${commentId}`;
        return requester.remove('appdata', endpoint, 'kinvey');
    }

    return {
        getPostComments,
        createComment,
        deleteComment

    }

})();