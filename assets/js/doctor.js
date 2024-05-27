var loadMoreBtn = document.getElementById('loadmore');
var loadMoreDiv = document.getElementById('loadmorediv');
var showingSpan = document.getElementById('showing');
var doctorGrid = document.getElementById("doctor-grid");
var totalDotor;
var deleteDialog = document.getElementById("delete_doctor");

var size;

window.addEventListener('DOMContentLoaded', (event) => {
    size = 12;

    getAPIBody('get', `${ROOT}/admin/doctor/list?size=${size}`)
    .then(function(responseData) {  
        showingSpan.innerText = `${responseData.numberOfElements} / ${responseData.totalElements} doctors`

        if (responseData.totalElements > responseData.numberOfElements) {
            loadMoreDiv.hidden = false
        } else {
            loadMoreDiv.hidden = true
        } 

        totalDoctor = responseData.totalElements;  
        var newHTML = ``;
        if(responseData.content.length > 0) {  
            responseData.content.forEach(function(item) { 
                var addressArray = item.user.address.split(',').map(function(item) {
                    return item.trim();
                }).slice(0, 4);
                
                newHTML += `
                <div class="col-md-4 col-sm-4 col-lg-3">
                    <div class="profile-widget">
                        <div class="doctor-img">
                        <a class="avatar" href="#" onclick="handleAvatarClick('${item.id}')">
                            <img alt=""  width="100%" height="100%" src="${item.user.avatar}">
                        </a>
                        </div>
                        <div class="dropdown profile-action">
                            <a href="#" class="action-icon dropdown-toggle" data-toggle="dropdown" aria-expanded="false"><i class="fa fa-ellipsis-v"></i></a>
                            <div class="dropdown-menu dropdown-menu-right">
                                <a class="dropdown-item" href="#" onclick="editClick('${item.id}')"><i class="fa fa-pencil m-r-5"></i> Edit</a>
                                <a class="dropdown-item" href="#" data-toggle="modal" data-target="#delete_doctor" data-id="${item.id}"><i class="fa fa-trash-o m-r-5"></i> Delete</a>
                            </div>
                        </div>
                        <h4 class="doctor-name text-ellipsis"><a href="profile.html">${item.user.name}</a></h4>
                        <div class=""><span>${item.type == 0 ? ' &#160;' : '(Bs tại gia)'}</span></div>
                        <div class="doc-prof">${item.specialization.name}</div>
                        <div class="user-country">
                            <i class="fa fa-map-marker"></i>${addressArray[3]}
                        </div>
                    </div>
                </div>
            `;
            }); 
        }
        doctorGrid.innerHTML += newHTML;
    })
});

$(document).ready(function() {
    $('#delete_doctor').on('show.bs.modal', function (event) {
        var button = $(event.relatedTarget); // Button that triggered the modal
        var doctorId = button.data('id'); // Extract info from data-* attributes

        $(this).find('.btn-danger').data('id', doctorId);
    });

    $('#delete_doctor').find('.btn-danger').on('click', function() {
        var doctorId = $(this).data('id');

        getAPIBody('delete', `${ROOT}/admin/doctor/delete?doctorId=${doctorId}`)
        .then(function(responseData) {
            if(responseData) {
                showToast("success");
                setTimeout(function() { 
                    window.location.href = "doctors.html";
                }, 1500); 
                
            } else {
                showToast("error");
            }
        });
    });
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

    getAPIBody('get', `${ROOT}/admin/doctor/list?size=${size}`)
    .then(function(responseData) {  
        showingSpan.innerText = `${responseData.numberOfElements} / ${responseData.totalElements} doctors`
        
        if (responseData.totalElements > responseData.numberOfElements) {
            loadMoreDiv.hidden = false
        } else {
            loadMoreDiv.hidden = true
        } 

        totalDoctor = responseData.totalElements;  
        var doctorGrid = document.getElementById("doctor-grid");
        var newHTML = ``;
        if(responseData.content.length > 0) {  
            responseData.content.forEach(function(item) { 
                var addressArray = item.user.address.split(',').map(function(item) {
                    return item.trim();
                }).slice(0, 4);
                
                newHTML += `
                <div class="col-md-4 col-sm-4 col-lg-3">
                    <div class="profile-widget">
                        <div class="doctor-img">
                        <a class="avatar" href="#" onclick="handleAvatarClick('${item.id}')">
                            <img alt=""  width="100%" height="100%" src="${item.user.avatar}">
                        </a>
                        </div>
                        <div class="dropdown profile-action">
                            <a href="#" class="action-icon dropdown-toggle" data-toggle="dropdown" aria-expanded="false"><i class="fa fa-ellipsis-v"></i></a>
                            <div class="dropdown-menu dropdown-menu-right">
                                <a class="dropdown-item" href="#" onclick="editClick('${item.id}')"><i class="fa fa-pencil m-r-5"></i> Edit</a>
                                <a class="dropdown-item" href="#" data-toggle="modal" data-target="#delete_doctor" data-id="${item.id}"><i class="fa fa-trash-o m-r-5"></i> Delete</a>
                            </div>
                        </div>
                        <h4 class="doctor-name text-ellipsis"><a href="profile.html">${item.user.name}</a></h4>
                        <div class="doc-prof">${item.specialization.name}</div> 
                        <div><span>${item.specialization.name}</span></div>
                        <div class="user-country">
                            <i class="fa fa-map-marker"></i>${addressArray[3]}
                        </div>
                    </div>
                </div>
            `;
            }); 
        }
        doctorGrid.innerHTML += newHTML;
    })
}

function showToast(message) { 
    toast.innerHTML = `<div class="toast-content">${message}</div>`
    toast.style.display = 'block';
    var header = document.createElement('div');  
    header.classList.add('toast-header');  
    toast.insertBefore(header, toast.firstChild);
    setTimeout(function() {
      toast.style.display = 'none';
      toast.removeChild(header);
    }, 1500); // 3 seconds
}