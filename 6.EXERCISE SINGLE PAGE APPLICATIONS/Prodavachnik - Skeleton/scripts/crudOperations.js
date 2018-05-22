const BASE_URL = 'https://baas.kinvey.com/';
const APP_KEY = 'kid_ryz9QqAcz';
const APP_SECRET = 'f15073b443e44b3d970a0a5c960a29a1';
const AUTH_HEADERS = {'Authorization': "Basic " + btoa(APP_KEY + ":" + APP_SECRET)};


function loginUser() {
    let userData = {
        username: $('#formLogin input[name="username"]').val(),
        password: $('#formLogin input[name="passwd"]').val()
    };
    $.ajax({
        method: 'POST',
        headers: AUTH_HEADERS,//Authorization: Basic base64(app_id:app_secret)
        url: `${BASE_URL}user/${APP_KEY}/login`, //https://baas.kinvey.com/user/{app_id}/register
        data: userData
    }).then(function (res) {
        saveAuthInSession(res);
        showHideMenuLinks();
        listAds();
        showInfo('Log in successful.');
    }).catch(function (err) {
        handleAjaxError(err);
    });


}//ok

function registerUser() {
    let userData = {
        username: $('#formRegister input[name="username"]').val(),
        password: $('#formRegister input[name="passwd"]').val()
    };
    $.ajax({
        method: "POST",
        headers: AUTH_HEADERS,// {'Authorization': "Basic " + btoa(APP_KEY + ":" + APP_SECRET)};
        url: `${BASE_URL}user/${APP_KEY}/`,
        data: userData
    }).then(function (userInfo) {
        saveAuthInSession(userInfo);
        showHideMenuLinks();
        listAds();
        showInfo('User registration successful.');
    }).catch(function (err) {
        handleAjaxError(err);
    })


}//ok

function logoutUser() {
    sessionStorage.clear();
    $('#loggedInUser').text("");
    showHideMenuLinks();
    showView('viewHome');
    showInfo('Logout successful.');

}//ok

function createAd() {
    let adData = {
        "title": $('#formCreateAd input[name=title]').val(),
        "img": $('#formCreateAd input[name=image]').val(),
        "description": $('#formCreateAd textarea[name=description]').val(),
        "date": $('#formCreateAd input[name=datePublished]').val(),
        "price": Number($('#formCreateAd input[type=number]').val()),
        "publisher": sessionStorage.getItem('username'),
        "count": 0
    };
    $.ajax({
        method: "POST",
        headers: getKinveyUserAuthHeaders(),
        url: BASE_URL + "appdata/" + APP_KEY + "/ads",
        data: adData
    }).then(function (res) {
        listAds();
        showInfo('Ad created');
    }).catch(function (err) {
        handleAjaxError(err)
    })
}//ok

function listAds() {
    $.ajax({
        method: "GET",
        headers: getKinveyUserAuthHeaders(),
        url: BASE_URL + 'appdata/' + APP_KEY + '/ads'
    }).then(function (res) {
        $('#ads').empty();
        showView('viewAds');
        loadAdsSuccess(res);
    }).catch(function (err) {
        handleAjaxError(err);
    })


}//ok

function loadAdsSuccess(ads) {
    showInfo('Ads loaded.');
    if (ads.length === 0) {
        $('#ads').text('No advertisements available.');
    } else {
        let adsTable = $('<table>')
            .append($('<tr>').append(`
                    <th>Title</th>
                    <th>Publisher</th>
                    <th>Description</th>
                    <th>Price</th>
                    <th>Date Published</th>
                    <th>Actions</th>
                `));
        for (let ad of ads)
            appendAdRow(ad, adsTable);
        $('#ads').append(adsTable);
    }
}//ok

function appendAdRow(ad, adsTable) {
    let d = new Date(ad.date);
    let links = [];
    let readMore = $('<a href="#">[ReadMore]</a>')
        .click(displayAdvert.bind(this, ad));
    if (ad._acl.creator === sessionStorage['userId']) {
        let deleteLink = $('<a href="#">[Delete]</a>')
            .click(deleteAd.bind(this, ad));
        let editLink = $('<a href="#">[Edit]</a>')
            .click(loadAdForEdit.bind(this, ad));

        links = [deleteLink, ' ', editLink];
    }
    adsTable.append($('<tr>').append(
        $('<td>').text(ad.title),
        $('<td>').text(ad.publisher),
        $('<td>').text(ad.description),
        $('<td>').text(ad.price),
        $('<td>').text(`${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`),
        $('<td>').append(readMore, " ", links)
    ));
}//ok

function displayAdvert(ad) {
    $.ajax({
        method: "PUT",
        headers: getKinveyUserAuthHeaders(),
        url: BASE_URL + 'appdata/' + APP_KEY + '/ads/' + ad._id,
        data:{count: ad.count++}
    }).then(function (res) {
        console.log(res);
    }).catch(function (err) {
        handleAjaxError(err);
    });

    $('#viewDetailsAd').empty();
    if (ad.img === "") {
        let advertInfo = $('<div>').append(
            $(`<img src="data:image/png;base64,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" width="460" height="345">`),
            $('<br>'),
            $('<label>').text("Title :"),
            $('<h1>').text(ad.title),
            $('<label>').text("Description :"),
            $('<p>').text(ad.description),
            $('<label>').text("Publisher :"),
            $('<div>').text(ad.publisher),
            $('<label>').text("Date :"),
            $('<div>').text(ad.date),
            $('<label>').text("Views :"),
            $('<div>').text(ad.count)
            )
        ;
        $('#viewDetailsAd').append(advertInfo);
        showView("viewDetailsAd");

    }
    else {
        let advertInfo = $('<div>').append(
            $(`<img src=${ad.img} width="460" height="345">`),
            $('<br>'),
            $('<label>').text("Title :"),
            $('<h1>').text(ad.title),
            $('<label>').text("Description :"),
            $('<p>').text(ad.description),
            $('<label>').text("Publisher :"),
            $('<div>').text(ad.publisher),
            $('<label>').text("Date :"),
            $('<div>').text(ad.date),
            $('<label>').text("Views :"),
            $('<div>').text(ad.count)
        );
        $('#viewDetailsAd').append(advertInfo);
        showView("viewDetailsAd");
    }


}//ok

function deleteAd(ad) {
    $.ajax({
        method: "DELETE",
        headers: getKinveyUserAuthHeaders(),
        url: BASE_URL + 'appdata/' + APP_KEY + '/ads/' + ad._id
    }).then(function (res) {
        listAds();
        showInfo("ad deleted.");
    }).catch(function (err) {
        handleAjaxError(err);
    })

}//ok

function loadAdForEdit(ad) {
    $.ajax({
        method: "GET",
        url: kinveyBookUrl = BASE_URL + "appdata/" +
            APP_KEY + "/ads/" + ad._id,
        headers: getKinveyUserAuthHeaders(),
    }).then(function (res) {
        $('#formEditAd input[name=id]').val(res._id);
        $('#formEditAd input[name=publisher]').val(res.publisher);
        $('#formEditAd input[name=title]').val(res.title);
        $('#formEditAd input[name=image]').val(res.img);
        $('#formEditAd textarea[name=description]').val(res.description);
        $('#formEditAd input[name=datePublished]').val(res.date);
        $('#formEditAd input[name=price]').val(res.price);
        showView('viewEditAd');
    }).catch(function (err) {
        handleAjaxError(err);
    })

}//ok

function editAd() {
    let adData = {
        "title": $('#formEditAd input[name=title]').val(),
        "img": $('#formEditAd input[name=image]').val(),
        "publisher": $('#formEditAd input[name=publisher]').val(),
        "description": $('#formEditAd textarea[name=description]').val(),
        "date": $('#formEditAd input[name=datePublished]').val(),
        "price": $('#formEditAd input[name=price]').val()
    };

    $.ajax({
        method: "PUT",
        headers: getKinveyUserAuthHeaders(),
        data: adData,
        url: BASE_URL + 'appdata/' + APP_KEY + '/ads/' + $('#formEditAd input[name=id]').val()
    }).then(function (res) {
        listAds();
        showInfo('Ad edited.');

    }).catch(function (err) {
        handleAjaxError(err);
    })
}//ok

function saveAuthInSession(userInfo) {
    let userAuth = userInfo._kmd.authtoken;
    sessionStorage.setItem('authToken', userAuth);
    let userId = userInfo._id;
    sessionStorage.setItem('userId', userId);
    let username = userInfo.username;
    sessionStorage.setItem('username', username);
    $('#loggedInUser').text(
        "Welcome, " + username + "!");

}//ok

function handleAjaxError(response) {
    let errorMsg = JSON.stringify(response);
    if (response.readyState === 0)
        errorMsg = "Cannot connect due to network error.";
    if (response.responseJSON &&
        response.responseJSON.description)
        errorMsg = response.responseJSON.description;//response.responseJSON.error
    showError(errorMsg);
}//ok

function getKinveyUserAuthHeaders() {

    return {
        'Authorization': "Kinvey " +
        sessionStorage.getItem('authToken'),
    };

}//ok

