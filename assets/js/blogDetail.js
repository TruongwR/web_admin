var titleTxt = document.getElementById('title');
var timeTxt = document.getElementById('time');
var nameTxt = document.getElementById('name');
var shareTxt = document.getElementById('share');
var contentTxt = document.getElementById('content');

window.addEventListener('DOMContentLoaded', (event) => {
    var blogId = getLocal('blogId');

    getAPIBody('get', `${ROOT}/admin/blog/get?id=${blogId}`)
    .then(function(responseData) {
        titleTxt.innerText = responseData.title; 
        timeTxt.innerText = responseData.createAt.substring(0, 10); 
        nameTxt.innerText = responseData.doctorName;
        shareTxt.innerText = `${responseData.share} share`;
        contentTxt.innerHTML = responseData.content;
    });
});