function showView(viewName) {
    $('main > section').hide();// Hide all views
    $('#' + viewName).show() // Show the selected view only
}

async function showHideMenuLinks() {
    $("#linkHome").show();
    let authoken = sessionStorage.getItem('authToken');
    let headers = window.headers.unauthHeaders;
    if (authoken) {
        headers = window.headers.authHeaders;
    }
    let source = await $.get('./templates/headers-template.hbs');
    let compiled=Handlebars.compile(source);
    let template=compiled({
        headers
    });
 $('#app').append(template);

}

function showInfo(message) {
    let infoBox = $('#infoBox');
    infoBox.text(message);
    infoBox.show();
    setTimeout(function () {
        $('#infoBox').fadeOut()
    }, 3000)
}

function showError(errorMsg) {
    let errorBox = $('#errorBox');
    errorBox.text("Error: " + errorMsg);
    errorBox.show()
}

function showHomeView() {
    showView('viewHome')
}

function showLoginView() {
    showView('viewLogin');
    $('#formLogin').trigger('reset')
}

function showRegisterView() {
    $('#formRegister').trigger('reset');
    showView('viewRegister')
}

function showCreateAdView() {
    $('#formCreateAd').trigger('reset');
    showView('viewCreateAd')
}
