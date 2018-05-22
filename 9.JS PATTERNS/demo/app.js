const app = Sammy('#main', function () {
    this.use('Handlebars', 'hbs');

    this.get('#/index.html', () => {
        this.swap('<h2>Home Page</h2>');//размяна this sochi kum #main

    });
    this.get('#/about', () => {//this sochi kum url
        this.swap('<h2>About Page</h2>');
    });
    this.get('#/contact', () => {
        this.swap('<h2>Contact Page</h2>');
    });
    this.get('#/book/:id', (context) => {
        console.log(context.params.id);
    });
    this.get('#/login', () => {
        this.swap(`<form action="#/login" method="post">
             User: <input name="user" type="text">
             Pass: <input name="pass" type="password">
            <input type="submit" value="Login">
            </form>`);

    });
    this.post('#/login', (context) => {
        console.log(context.params.user);//name atr=user
        console.log(context.params.pass);//name atr=pass
    });
    this.get('#/hello/:name', function () {
        this.title = 'Welcome!';
        this.name = this.params.name;
        this.loadPartials({
            header: './templates/common/header.hbs',
            footer: './templates/common/footer.hbs',
            // thirdPartial: 'path-to/third.hbs'
        }).then(function (context) {
            this.partial('./templates/hello.hbs');
        });

    });

});

$(() => {
    app.run();
});