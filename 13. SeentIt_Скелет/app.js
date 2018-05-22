$(() => {


    const app = Sammy('#container', function () {//promeni konteinera

        this.use('Handlebars', 'hbs');
        function calcTime(dateIsoFormat) {
            let diff = new Date - (new Date(dateIsoFormat));
            diff = Math.floor(diff / 60000);
            if (diff < 1) return 'less than a minute';
            if (diff < 60) return diff + ' minute' + pluralize(diff);
            diff = Math.floor(diff / 60);
            if (diff < 24) return diff + ' hour' + pluralize(diff);
            diff = Math.floor(diff / 24);
            if (diff < 30) return diff + ' day' + pluralize(diff);
            diff = Math.floor(diff / 30);
            if (diff < 12) return diff + ' month' + pluralize(diff);
            diff = Math.floor(diff / 12);
            return diff + ' year' + pluralize(diff);
            function pluralize(value) {
                if (value !== 1) return 's';
                else return '';
            }
        }


        this.get('index.html', getWelcomePage);
        this.get('#/home', getWelcomePage);


        this.post('#/register', function (context) {
            let username = context.params.username;
            let password = context.params.password;
            let repeatPass = context.params.repeatPass;

            if (username !== "" && password !== "" && repeatPass !== "") {
                auth.register(username, password, repeatPass)
                    .then(function (userInfo) {
                        auth.saveSession(userInfo);//pazish sesiqta
                        notify.showInfo('User registration successful!');//pokazvash suobshtenie
                        context.redirect('#/catalog');
                    }).catch(notify.handleError)
            } else {
                notify.showError("Full form registration");
            }


        });
        function getWelcomePage(context) {
            if (!auth.isAuth()) {
                context.loadPartials({
                    header: 'templates/common/header.hbs',
                    footer: 'templates/common/footer.hbs',
                }).then(function () {
                    this.partial('templates/welcome-anonymous.hbs')
                })
            } else {
                context.redirect('#/catalog');
            }
        }

        this.post('#/login', function (context) {
            let username = context.params.username;
            let password = context.params.password;
            if (username !== "" && password !== "") {
                auth.login(username, password)
                    .then(function (userInfo) {
                        auth.saveSession(userInfo);//pazish sesiqta
                        notify.showInfo('You are log in successful!');//pokazvash suobshtenie
                        context.redirect('#/catalog');
                    }).catch(notify.handleError)
            } else {
                notify.showError("Full login form!");
            }


        });

        this.get('#/logout', function (context) {
            auth.logout()
                .then(function () {
                    sessionStorage.clear();
                    context.redirect('#/home');
                }).catch(notify.handleError)
        });

        this.get('#/catalog', function (context) {
            if (!auth.isAuth()) {
                context.redirect('#/home');
                return;
            }
            posts.getAllPosts()
                .then(function (posts) {
                    let i = 1;
                    for (let post of posts) {
                        post.rank = i++;
                        post.date = calcTime(post._kmd.ect);
                        post.isAuthor = post._acl.creator === sessionStorage.getItem('id');
                    }
                    context.username = sessionStorage.getItem('username');
                    context.isAuth = auth.isAuth();
                    context.posts = posts;
                    context.loadPartials({
                        header: 'templates/common/header.hbs',
                        footer: 'templates/common/footer.hbs',
                        navigation: 'templates/common/navigation.hbs',
                        article: 'templates/article.hbs'
                    }).then(function () {
                        this.partial('templates/catalog.hbs');
                    })
                });
        });

        this.get('#/create/post', function (context) {//zarejdane na template
            context.username = sessionStorage.getItem('username');
            context.isAuth = auth.isAuth();
            context.loadPartials({
                header: 'templates/common/header.hbs',
                footer: 'templates/common/footer.hbs',
                navigation: 'templates/common/navigation.hbs',
            }).then(function () {
                this.partial('templates/createPost.hbs')
            })
            //   url title image description


        });
        this.post('#/create/post', function (context) {//prashtane kum bazata


            //author, url, title, imageUrl (optional), description (optional).

            let author = sessionStorage.getItem('username');
            let url = context.params.url;
            let imageUrl = context.params.imageUrl;
            let title = context.params.title;
            let description = context.params.description;
            if (title === "" || url === "") {
                notify.showError("Required title and url!")
            }
            posts.createPost(author, title, description, url, imageUrl)
                .then(function () {
                    notify.showInfo("Post created");
                    context.redirect('#/catalog')
                }).catch(notify.handleError)

        });


        this.get('#/edit/post/:postId', function (context) {//zarejdane na template
            let postId = context.params.postId;
            posts.getPostById(postId).then(function (post) {
                context.username = sessionStorage.getItem('username');
                context.isAuth = auth.isAuth();
                context.post = post;
                context.loadPartials({
                    header: 'templates/common/header.hbs',
                    footer: 'templates/common/footer.hbs',
                    navigation: 'templates/common/navigation.hbs',
                }).then(function () {
                    this.partial('templates/editPost.hbs')
                })

            });


            //   url title image description


        });
        this.post('#/edit/post', function (context) {//prashtane kum bazata
            console.log(context);
            let postId = context.params.postId;
            //author, url, title, imageUrl (optional), description (optional).

            let author = sessionStorage.getItem('username');
            let url = context.params.url;
            let imageUrl = context.params.imageUrl;
            let title = context.params.title;
            let description = context.params.description;
            if (title === "" || url === "") {
                notify.showError("Required title and url!")
            }
            posts.editPost(postId, author, title, description, url, imageUrl)
                .then(function () {
                    notify.showInfo("Post edited");
                    context.redirect('#/catalog')
                }).catch(notify.handleError)

        });


        this.get('#/delete/post/:postId', function (context) {//zarejdane na template
            let postId = context.params.postId;
            posts.deletePost(postId).then(function () {
                notify.showInfo('Post deleted.');
                context.redirect('#/catalog');
            }).catch(notify.handleError);


        });


        this.get('#/posts', function (context) {
            if (!auth.isAuth()) {
                context.redirect('#/home');
                return;
            }
            let username = sessionStorage.getItem('username');
            posts.getMyPosts(username)
                .then(function (posts) {
                    let i = 1;
                    for (let post of posts) {
                        post.rank = i++;
                        post.date = calcTime(post._kmd.ect);
                        post.isAuthor = post._acl.creator === sessionStorage.getItem('id');
                    }
                    context.username = sessionStorage.getItem('username');
                    context.isAuth = auth.isAuth();
                    context.posts = posts;
                    context.loadPartials({
                        header: 'templates/common/header.hbs',
                        footer: 'templates/common/footer.hbs',
                        navigation: 'templates/common/navigation.hbs',
                        article: 'templates/article.hbs'
                    }).then(function () {
                        this.partial('templates/myPosts.hbs');
                    })
                });
        });

        this.get('#/details/:postId', (ctx) => {
            let postId = ctx.params.postId;

            const postPromise = posts.getPostById(postId);
            const allCommentsPromise = comments.getPostComments(postId);

            Promise.all([postPromise, allCommentsPromise])
                .then(([post, comments]) => {
                    post.date = calcTime(post._kmd.ect);
                    post.isAuthor = post._acl.creator === sessionStorage.getItem('id');
                    comments.forEach((c) => {
                        c.date = calcTime(c._kmd.ect);
                        c.commentAuthor = c._acl.creator === sessionStorage.getItem('id');
                    });

                    ctx.isAuth = auth.isAuth();
                    ctx.username = sessionStorage.getItem('username');
                    ctx.post = post;
                    ctx.comments = comments;


                    ctx.loadPartials({
                        header: 'templates/common/header.hbs',
                        footer: 'templates/common/footer.hbs',
                        navigation: 'templates/common/navigation.hbs',
                        comment: 'templates/comment.hbs'
                    }).then(function () {
                        this.partial('templates/detailsPost.hbs');
                    })
                }).catch(notify.handleError);
        });
        this.post('#/create/comment/:postId', (ctx) => {
            let author = sessionStorage.getItem('username');
            let content = ctx.params.content;
            let postId = ctx.params.postId;

            if (content === '') {
                notify.showError('Cannot add empty comment!');
                return;
            }

            comments.createComment(postId,content,author)
                .then(() => {
                    notify.showInfo('Comment created!');
                    ctx.redirect(`#/details/${postId}`);
                }).catch(notify.showError);
        });

        this.get('#/comment/delete/:commentId/post/:postId', (ctx) => {

            let commentId = ctx.params.commentId;
            let postId = ctx.params.postId;

            comments.deleteComment(commentId)
                .then(() => {
                    notify.showInfo('Comment deleted.');
                    ctx.redirect(`#/details/${postId}`);
                })
                .catch(notify.handleError);
        });




    });


    app.run();

});