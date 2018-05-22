(function () {
    class Header {
        constructor(id, title) {
            this.id = id;
            this.title = title;
        }
    }
    let authHeaders=[//log out
        new Header("linkHome","Home"),
        new Header("linkLogin","Login"),
        new Header("linkRegister","Register"),

    ];
    let unauthHeaders=[//log in
        new Header("linkListAds","List Advertisements"),
        new Header("linkCreateAd","Create Advertisement"),
        new Header("linkLogout","Logout"),

    ];
    window.headers = {
        authHeaders,
        unauthHeaders
    }
})();