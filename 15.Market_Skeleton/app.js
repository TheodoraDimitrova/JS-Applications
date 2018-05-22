$(() => {


    const app = Sammy('#app', function () {//promeni konteinera

        this.use('Handlebars', 'hbs');



        this.get('market.html', getWelcomePage);
        this.get('#/home', getWelcomePage);
        function getWelcomePage(context) {
            if (!auth.isAuth()) {
                context.loadPartials({
                    header: 'templates/common/header.hbs',
                    footer: 'templates/common/footer.hbs',
                }).then(function () {
                    this.partial('templates/homePage.hbs')
                })
            } else {
                context.redirect('templates/userHome.hbs');
            }
        }

        this.get('#/userHome', function (context) {
            if (!auth.isAuth()) {
                context.redirect('#/homePage');
                return;
            }
            context.isAuth = sessionStorage.getItem('authtoken');
            context.username = sessionStorage.getItem('username');
            context.loadPartials({
                header: 'templates/common/header.hbs',
                footer: 'templates/common/footer.hbs',

            }).then(function () {
                this.partial('templates/userHome.hbs');

            });
        });


        this.get('#/register', function (context) {
            context.loadPartials({
                header: 'templates/common/header.hbs',
                footer: 'templates/common/footer.hbs',
            }).then(function () {
                this.partial('templates/register.hbs');
            })

        });
        this.post('#/register', function (context) {
            let username = context.params.username;
            let password = context.params.password;
            let name = context.params.name;
            if (username !== "" && password !== "" && name !== "") {
                auth.register(username, password,name)
                    .then(function (userInfo) {
                        console.log(userInfo);
                        auth.saveSession(userInfo);//pazish sesiqta
                        notify.showInfo('User registration successful!');//pokazvash suobshtenie
                        context.redirect('#/userHome');
                    }).catch(notify.handleError)
            } else {
                notify.showError("Full form registration");
            }


        });

        this.get('#/login', function (context) {
            context.loadPartials({
                header: 'templates/common/header.hbs',
                footer: 'templates/common/footer.hbs',
            }).then(function () {
                this.partial('templates/login.hbs');
            })

        });
        this.post('#/login', function (context) {
            let username = context.params.username;
            let password = context.params.password;

            if (username !== "" && password !== "") {
                auth.login(username, password)
                    .then(function (userInfo) {
                        auth.saveSession(userInfo);//pazish sesiqta
                        notify.showInfo('You are log in successful!');//pokazvash suobshtenie
                        context.redirect('#/userHome');
                    }).catch(notify.handleError)
            } else {
                notify.showError("Full login form!");
            }


        });

        this.get('#/logout', function (context) {
            auth.logout()
                .then(function () {
                    sessionStorage.clear();
                    notify.showInfo("Logout successful.");
                    context.redirect('#/home');
                }).catch(notify.handleError)
        });

        this.get('#/shop', function (context) {
            if (!auth.isAuth()) {
                context.redirect('#/home');
                return;
            }
            let username = sessionStorage.getItem('username');
            shop.getAllProducts()
                .then(function (products) {
                    for (let p of products) {
                        p['price'] = Number(p['price']).toFixed(2);
                    }

                    context.products = products;
                    context.isAuth = sessionStorage.getItem('authtoken');
                    context.username = sessionStorage.getItem('username');
                    context.loadPartials({
                        header: 'templates/common/header.hbs',
                        footer: 'templates/common/footer.hbs',
                        product: 'templates/product.hbs'
                    }).then(function () {
                        this.partial('templates/allProductsPage.hbs');
                    })

                })
        });
        this.get('#/cart', function (context) {
            if (!auth.isAuth()) {
                context.redirect('#/home');
                return;
            }
            let userId=sessionStorage.getItem('id');
            shop.getUserInfo().then(function (userInfo) {
                console.log(userInfo);


                context.isAuth = sessionStorage.getItem('authtoken');
                context.username = sessionStorage.getItem('username');
                context.loadPartials({
                    header: 'templates/common/header.hbs',
                    footer: 'templates/common/footer.hbs',
                    items: 'templates/product.hbs'
                }).then(function () {
                    this.partial('templates/cartPage.hbs');
                })
            });

        });





















    });


    app.run();

});