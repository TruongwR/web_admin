var loadMoreBtn = document.getElementById('loadmore');
var loadMoreDiv = document.getElementById('loadmorediv');
var showingSpan = document.getElementById('showing');
var doctorGrid = document.getElementById("doctor-grid");
var totalDotor;

var size;

window.addEventListener('DOMContentLoaded', (event) => {
    size = 12;

    getAPIBody('get', `${ROOT}/admin/employee/list?size=${size}`)
    .then(function(responseData) {  
        showingSpan.innerText = `${responseData.numberOfElements} / ${responseData.totalElements} doctors`
        if (responseData.numberOfElements <= size) {
            loadMoreDiv.hidden = false
        } else {
            loadMoreDiv.hidden = true
        } 
 
        totalDoctor = responseData.totalElements;  
        var newHTML = ``;
        if(responseData.content.length > 0) {  
            responseData.content.forEach(function(item) {  
                
                newHTML += `
                <div class="col-md-4 col-sm-4 col-lg-3">
                    <div class="profile-widget">
                        <div class="doctor-img">
                            <img class="avatar" alt=""  width="100%" height="100%" src="${item.avatar}">
                        </div>
                        <div class="dropdown profile-action">
                            <a href="#" class="action-icon dropdown-toggle" data-toggle="dropdown" aria-expanded="false"><i class="fa fa-ellipsis-v"></i></a>
                            <div class="dropdown-menu dropdown-menu-right">
                                <a class="dropdown-item" href="#" onclick="editClick('${item.id}')"><i class="fa fa-pencil m-r-5"></i> Edit</a>
                                <a class="dropdown-item" href="#" data-toggle="modal" data-target="#delete_doctor"><i class="fa fa-trash-o m-r-5"></i> Delete</a>
                            </div>
                        </div>
                        <h4 class="doctor-name text-ellipsis"><a href="profile.html">${item.name}</a></h4>
                        <div class=""><span>${item.phone}</span></div> 
                        <div class="user-country">
                            ${item.email}
                        </div>
                    </div>
                </div>
            `;
            }); 
        }
        doctorGrid.innerHTML += newHTML;
    })
});

function handleAvatarClick(doctorId) {
    saveSession('doctorId', doctorId);
    window.location.href = "/profile.html";
}

function editClick(doctorId) {
    saveSession('doctorId', doctorId);
    window.location.href = "/edit-doctor.html";
}

function changePageSize () {
    size += 12;

    doctorGrid.innerHTML = '';

    getAPIBody('get', `${ROOT}/admin/employee/list?size=${size}`)
    .then(function(responseData) {  
        showingSpan.innerText = `${responseData.numberOfElements} / ${responseData.totalElements} doctors`
        if (responseData.numberOfElements <= size) {
            loadMoreDiv.hidden = false
        } else {
            loadMoreDiv.hidden = true
        } 

        totalDoctor = responseData.totalElements;  
        var newHTML = ``;
        if(responseData.content.length > 0) {  
            responseData.content.forEach(function(item) {  
                
                newHTML += `
                <div class="col-md-4 col-sm-4 col-lg-3">
                    <div class="profile-widget">
                        <div class="doctor-img">
                            <img class="avatar" alt=""  width="100%" height="100%" src="${item.avatar}">
                        </div>
                        <div class="dropdown profile-action">
                            <a href="#" class="action-icon dropdown-toggle" data-toggle="dropdown" aria-expanded="false"><i class="fa fa-ellipsis-v"></i></a>
                            <div class="dropdown-menu dropdown-menu-right">
                                <a class="dropdown-item" href="#" onclick="editClick('${item.id}')"><i class="fa fa-pencil m-r-5"></i> Edit</a>
                                <a class="dropdown-item" href="#" data-toggle="modal" data-target="#delete_doctor"><i class="fa fa-trash-o m-r-5"></i> Delete</a>
                            </div>
                        </div>
                        <h4 class="doctor-name text-ellipsis"><a href="profile.html">${item.name}</a></h4>
                        <div class=""><span>${item.phone}</span></div> 
                        <div class="user-country">
                            ${item.email}
                        </div>
                    </div>
                </div>
            `;
            }); 
        }
        doctorGrid.innerHTML += newHTML;
    })
}