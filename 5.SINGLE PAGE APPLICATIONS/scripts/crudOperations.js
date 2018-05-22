const BASE_URL = 'https://baas.kinvey.com/';
const APP_KEY = 'kid_BJby9E6qM';
const APP_SECRET = 'b29b20c7579944659d2a2bff72a56987';
const AUTH_HEADERS = {'Authorization': "Basic " + btoa(APP_KEY + ":" + APP_SECRET)};
const BOOKS_PER_PAGE = 10;

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
        listBooks();
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
        listBooks();
        showInfo('User registration successful.');
    }).catch(function (err) {
        handleAjaxError(err);
    })


}//ok

function listBooks() {
    // displayPaginationAndBooks(res.reverse())
    $.ajax({
        method: "GET",
        headers: getKinveyUserAuthHeaders(),
        url: BASE_URL + 'appdata/' + APP_KEY + '/books'
    }).then(function (res) {
        $('#books').empty();
        showView('viewBooks');
        loadBooksSuccess(res);
    }).catch(function (err) {
        handleAjaxError(err);
    })
}//ok


function createBook() {

    // TODO
    // POST -> BASE_URL + 'appdata/' + APP_KEY + '/books'
    // showInfo('Book created.')
    let bookData = {
        "title": $('#formCreateBook input[name="title"]').val(),
        "author": $('#formCreateBook input[name="author"]').val(),
        "description": $('#formCreateBook textarea[name="description"]').val()
    };
    $.ajax({
        method: "POST",
        headers: getKinveyUserAuthHeaders(),
        url: BASE_URL + "appdata/" + APP_KEY + "/books",
        data: bookData
    }).then(function (res) {
        listBooks();
        showInfo('Book created');
    }).catch(function (err) {
        handleAjaxError(err)
    })

}//ok

function deleteBook(book) {
    // TODO
    // DELETE -> BASE_URL + 'appdata/' + APP_KEY + '/books/' + book._id
    // showInfo('Book deleted.')
    $.ajax({
        method: "DELETE",
        headers: getKinveyUserAuthHeaders(),
        url: BASE_URL + 'appdata/' + APP_KEY + '/books/' + book._id
    }).then(function (res) {
        listBooks();
        showInfo("Book deleted.");
    }).catch(function (err) {
        handleAjaxError(err);
    })
}//ok

function loadBookForEdit(book) {
    $.ajax({
        method: "GET",
        url: kinveyBookUrl = BASE_URL + "appdata/" +
            APP_KEY + "/books/" + book._id,
        headers: getKinveyUserAuthHeaders(),
    }).then(function (res) {
        $('#formEditBook input[name=id]').val(res._id);
        $('#formEditBook input[name=title]').val(res.title);
        $('#formEditBook input[name=author]').val(res.author);
        $('#formEditBook textarea[name=description]').val(res.description);
        showView('viewEditBook');
    }).catch(function (err) {
        handleAjaxError(err);
    })


}//ok

function editBook() {
    // TODO
    // PUT -> BASE_URL + 'appdata/' + APP_KEY + '/books/' + book._id
    // showInfo('Book edited.')
    let bookData = {
        title: $('#formEditBook input[name=title]').val(),
        author: $('#formEditBook input[name=author]').val(),
        description: $('#formEditBook textarea[name=description]').val()
    };
    $.ajax({
        method: "PUT",
        headers: getKinveyUserAuthHeaders(),
        data: bookData,
        url: BASE_URL + 'appdata/' + APP_KEY + '/books/' + $('#formEditBook input[name=id]').val()
    }).then(function (res) {
        listBooks();
        showInfo('Book edited.');

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

function logoutUser() {
    sessionStorage.clear();
    $('#loggedInUser').text("");
    showHideMenuLinks();
    showView('viewHome');
    showInfo('Logout successful.');

}//ok

function signInUser(res, message) {
    "use strict";
    console.log(res);
}

function displayPaginationAndBooks(books) {
    let pagination = $('#pagination-demo')
    if (pagination.data("twbs-pagination")) {
        pagination.twbsPagination('destroy')
    }
    pagination.twbsPagination({
        totalPages: Math.ceil(books.length / BOOKS_PER_PAGE),
        visiblePages: 5,
        next: 'Next',
        prev: 'Prev',
        onPageClick: function (event, page) {
            // TODO remove old page books
            let startBook = (page - 1) * BOOKS_PER_PAGE
            let endBook = Math.min(startBook + BOOKS_PER_PAGE, books.length)
            $(`a:contains(${page})`).addClass('active')
            for (let i = startBook; i < endBook; i++) {
                // TODO add new page books
            }
        }
    })
}

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

}
function loadBooksSuccess(books) {
    showInfo('Books loaded.');
    if (books.length === 0) {
        $('#books').text('No books in the library.');
    } else {
        let booksTable = $('<table>')
            .append($('<tr>').append(
                '<th>Title</th><th>Author</th>',
                '<th>Description</th><th>Actions</th>'));
        for (let book of books)
            appendBookRow(book, booksTable);
        $('#books').append(booksTable);
    }


}//ok
function appendBookRow(book, booksTable) {
    let links = [];
    if (book._acl.creator === sessionStorage['userId']) {
        let deleteLink = $('<a href="#">[Delete]</a>')
            .click(deleteBook.bind(this, book));
        let editLink = $('<a href="#">[Edit]</a>')
            .click(loadBookForEdit.bind(this, book));
        links = [deleteLink, ' ', editLink];
    }

    booksTable.append($('<tr>').append(
        $('<td>').text(book.title),
        $('<td>').text(book.author),
        $('<td>').text(book.description),
        $('<td>').append(links)
    ));
}//ok


