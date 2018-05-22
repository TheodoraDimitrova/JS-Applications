$(() => {


    const app = Sammy('#app', function () {//promeni konteinera

        this.use('Handlebars', 'hbs');
        function formatDate(dateISO8601) {
            let date = new Date(dateISO8601);
            if (Number.isNaN(date.getDate()))
                return '';
            return date.getDate() + '.' + padZeros(date.getMonth() + 1) +
                "." + date.getFullYear() + ' ' + date.getHours() + ':' +
                padZeros(date.getMinutes()) + ':' + padZeros(date.getSeconds());

            function padZeros(num) {
                return ('0' + num).slice(-2);
            }
        }

        function formatSender(name, username) {
            if (!name)
                return username;
            else
                return username + ' (' + name + ')';
        }


        this.get('messages.html', getWelcomePage);
        this.get('#/home', getWelcomePage);
        function getWelcomePage(context) {
            if (!auth.isAuth()) {
                context.loadPartials({
                    header: 'templates/common/header.hbs',
                    footer: 'templates/common/footer.hbs',
                }).then(function () {
                    this.partial('templates/home.hbs')
                })
            } else {
                context.redirect('templates/userHome.hbs');
            }
        }


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
            if (username !== "" && password !== "") {
                auth.register(username, password, name)
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

        this.get('#/userHome', function (context) {
            if (!auth.isAuth()) {
                context.redirect('#/home');
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
        this.get('#/logout', function (context) {
            auth.logout()
                .then(function () {
                    sessionStorage.clear();
                    notify.showInfo("Logout successful.");
                    context.redirect('#/home');
                }).catch(notify.handleError)
        });

        this.get('#/myMessages', function (context) {
            if (!auth.isAuth()) {
                context.redirect('#/home');
                return;
            }
            let username = sessionStorage.getItem('username');
            messages.getAllMessages(username)
                .then(function (messages) {
                    for (let m of messages) {
                        m.from = m.sender_name;
                        m.date = formatDate(m._kmd.lmt);
                        m.message = m.text;
                    }
                    context.messages = messages;
                    context.isAuth = sessionStorage.getItem('authtoken');
                    context.username = sessionStorage.getItem('username');
                    context.loadPartials({
                        header: 'templates/common/header.hbs',
                        footer: 'templates/common/footer.hbs',
                        message: 'templates/message.hbs'
                    }).then(function () {
                        this.partial('templates/myMessagesPage.hbs');
                    })

                })
        });
        this.get('#/sent', function (context) {//zarejdane na template
            messages.listAllUsers()
                .then(function (users) {
                    for (let u of users) {
                        u.sender=formatSender(u.name,u.username)
                    }
                    context.users=users;
                    context.username = sessionStorage.getItem('username');
                    context.isAuth = auth.isAuth();
                    context.loadPartials({
                        header: 'templates/common/header.hbs',
                        footer: 'templates/common/footer.hbs',

                    }).then(function () {
                        this.partial('templates/sentPage.hbs')
                    });
                });




        });
        this.post('#/sent', function (context) {//prashtane kum bazata

            //"sender_username"  sender_name" recipient_username" "text"

            let sender_username = sessionStorage.getItem('username');
            let sender_name = sessionStorage.getItem('name');
            let recipient_username = context.params.recipient;
            let text = context.params.text;

            messages.sendMessage(sender_username, sender_name, recipient_username, text)
                .then(function (res) {
                    notify.showInfo("Message send!");
                    context.redirect('#/myMessages')
                }).catch(notify.handleError)

        });

        this.get('#/archive', function (context) {
            if (!auth.isAuth()) {
                context.redirect('#/home');
                return;
            }
            let username = sessionStorage.getItem('username');
            messages.getMyMessages(username)
                .then(function (messages) {
                        for (let m of messages) {
                            m.to = m.recipient_username;
                            m.date = formatDate(m._kmd.lmt);
                            m.message = m.text;
                        }
                        context.messages = messages;
                        context.isAuth = sessionStorage.getItem('authtoken');
                        context.username = sessionStorage.getItem('username');

                        context.loadPartials({
                            header: 'templates/common/header.hbs',
                            footer: 'templates/common/footer.hbs',
                            sendMessage: 'templates/sendMessage.hbs'
                        }).then(function () {
                            this.partial('templates/archivePage.hbs');
                        })
                    });

        });

        this.get('#/delete/message/:messageId', (ctx) => {
            let messageId = ctx.params.messageId;
           messages.deleteMessage(messageId)
                .then(() => {
                    notify.showInfo('Message deleted.');
                    ctx.redirect(`#/archive`);
                })
                .catch(notify.handleError);
        });


    });


    app.run();

});