$(() => {


    const app = Sammy('#container', function () {//promeni konteinera

        this.use('Handlebars', 'hbs');


        this.get('index.html', getWelcomePage);
        this.get('#/home', getWelcomePage);

        this.post('#/register', function (context) {
            let username = context.params.username;
            let password = context.params.password;
            let repeatPass = context.params.passwordRep;

            if (username !== "" && password !== "" && repeatPass !== "") {
                if (password === repeatPass) {
                    auth.register(username, password)
                        .then(function (userInfo) {
                            auth.saveSession(userInfo);//pazish sesiqta
                            notify.showInfo('User registration successful.');//pokazvash suobshtenie
                            context.redirect('#/userPage');
                        }).catch(notify.handleError)
                }

            } else {
                notify.showError("Full form registration");
            }


        });
        this.post('#/login', function (context) {
            let username = context.params.username;
            let password = context.params.password;
            if (username !== "" && password !== "") {
                auth.login(username, password)
                    .then(function (userInfo) {
                        auth.saveSession(userInfo);//pazish sesiqta
                        notify.showInfo('Login successful.');//pokazvash suobshtenie
                        context.redirect('#/userPage');
                    }).catch(notify.handleError)
            } else {
                notify.showError("Full login form!");
            }


        });
        function getWelcomePage(context) {

            context.loadPartials({
                header: 'templates/common/header.hbs',
                footer: 'templates/common/footer.hbs',
            }).then(function () {
                this.partial('templates/home.hbs')
            })

        }

        this.get('#/logout', function (context) {
            auth.logout()
                .then(function () {
                    sessionStorage.clear();
                    context.redirect('#/home');
                }).catch(notify.handleError)
        });

        this.get('#/userPage', function (context) {
            if (!auth.isAuth()) {
                context.redirect('#/home');
                return;
            }
            let userId = sessionStorage.getItem('id');
            context.username = sessionStorage.getItem('username');

            receipts.getActiveReceipt(userId).then(function (res) {
                if (res.length === 0) {
                    receipts.createReceipt(true, 0, 0).then(function (res) {
                        console.log(res);
                    })
                }
                let receiptId = res[0]._id;
                context.receiptId=receiptId;
                receipts.getEntries(receiptId).then(function (res) {
                    let sum=0;
                    for (let entry of res) {
                        entry.totalEntry = (Number(entry.qty) * Number(entry.price)).toFixed(2);
                        sum+=Number(entry.totalEntry);
                    }
                     context.total=sum.toFixed(2);
                     context.entries = res;

                    context.loadPartials({
                        header: 'templates/common/header.hbs',
                        footer: 'templates/common/footer.hbs',
                        entry:'templates/entry.hbs'
                    }).then(function () {
                        this.partial('templates/userPage.hbs');
                    })
                }).catch(notify.handleError);

            });

        });


        this.post('#/create/entry/:receiptId', function (context) {//prashtane kum bazata
            let type = context.params.type;
            let qty = context.params.qty;
            let price = context.params.price;
            let receiptId = context.params.receiptId;
            console.log(receiptId);
            if (type === "" || qty === "" || price === "") {
                notify.showError("Full the form!")
            }
            receipts.createEntry(type, qty, price, receiptId)
                .then(function (res) {
                   context.redirect('#/userPage')
                });


        });

        this.get('#/delete/entry/:entryId', (ctx) => {
            let entryId = ctx.params.entryId;
            console.log(entryId);
            receipts.deleteEntry(entryId)
                .then(() => {
                    notify.showInfo('Entry deleted.');
                    ctx.redirect(`#/userPage`);
                })
                .catch(notify.handleError);
        });
    });

    app.run();


});
