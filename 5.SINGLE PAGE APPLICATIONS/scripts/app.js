function startApp() {
    sessionStorage.clear();// Clear user auth data
    showHideMenuLinks();
    showView('viewWelcome');
    attachAllEvents()
}
