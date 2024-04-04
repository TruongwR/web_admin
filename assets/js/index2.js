

window.addEventListener('DOMContentLoaded', (event) => {
    var loginData = getSession('loginData');
    var accessToken = getLocal('accessToken');
    var refreshToken = getLocal('refreshToken');

    console.log('check: ', loginData, '\n', accessToken);
});