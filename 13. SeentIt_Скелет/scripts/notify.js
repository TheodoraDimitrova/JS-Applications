let notify = (() => {

    $(document).on({
        ajaxStart: function () {
            $("#loadingBox").show()
        },
        ajaxStop: function () {
            $("#loadingBox").fadeOut()
        }
    });

    function showInfo(message) {
        let infoBox = $('#infoBox');//moje da e smeneno idto
        infoBox.text(message);
        infoBox.show();
        setTimeout(() => infoBox.fadeOut(), 3000);
    }

    function handleError(reason) {
        showError(reason.responseJSON.description);
    }

    function showError(message) {
        let errorBox = $('#errorBox');//moje da e ameneno idto
        errorBox.text(message);
        errorBox.show();
        setTimeout(() => errorBox.fadeOut(), 3000);
    }

    return {
        showInfo,
        showError,
        handleError
    }

})();