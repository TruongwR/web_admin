var patientTable = document.getElementById('table') 
var pageSizeInput = document.getElementById('pageSize');
var prevBtn = document.getElementById('prev')
var nextBtn = document.getElementById('next')
var pageNumInput = document.getElementById('pageNumber');
var maxPageTxt = document.getElementById('maxPage') 


window.addEventListener('DOMContentLoaded', (event) => {
    requestApi(10, 0);
});


function requestApi(pageSize, pageNumber) { 
    getAPIBody('get', `${ROOT}/admin/user/list?size=${pageSize}&page=${pageNumber}`)    
    .then(function(responseData) { 
        maxPageTxt.innerText = `/ ${responseData.totalPages}`
        pageNumInput.value = 1 + parseInt(`${responseData.number}`)
        if (responseData.number === 0) {
            prevBtn.removeEventListener("click", prevPage);
            prevBtn.style.backgroundColor = '#565656';
        } else {
            prevBtn.addEventListener("click", prevPage);
            prevBtn.style.backgroundColor = '#007bff';
        }

        if (responseData.number + 1 === responseData.totalPages) {
            nextBtn.removeEventListener("click", nextPage);
            nextBtn.style.backgroundColor = '#565656';
        } else {
            nextBtn.addEventListener("click", nextPage);
            nextBtn.style.backgroundColor = '#007bff';
        }

        for (var i = 0; i < pageSizeInput.options.length; i++) {  
            if (pageSizeInput.options[i].value === ''+ responseData.pageable.pageSize) {
                pageSizeInput.options[i].selected = true;
                break;
            }
        }
        
        console.log('Received API Response:', responseData);
        totalDoctor = responseData.totalElements;  
        var newHTML = `<tbody>`;
        if(responseData.content.length > 0) {  
            responseData.content.forEach(function(item) {  
                var addressArray = item.address.split(',').map(function(item) {
                    return item.trim();
                }).slice(0, 4);
                newHTML += `
                <tr>
                    <td><img width="28" height="28" src="${item.avatar !== null ? item.avatar : 'assets/img/user.jpg'}" class="rounded-circle m-r-5" alt=""> ${item.name}</td>
                    <td>${item.age}</td>
                    <td>${addressArray[3]}</td>
                    <td>${item.phone}</td> 
                    <td>${item.email}</td>
                    <td class="text-right">
                        <div class="dropdown dropdown-action">
                            <a href="#" class="action-icon dropdown-toggle" data-toggle="dropdown" aria-expanded="false"><i class="fa fa-ellipsis-v"></i></a>
                            <div class="dropdown-menu dropdown-menu-right">
                                <a class="dropdown-item" href="#" onclick="editPatient(${item.id})"><i class="fa fa-pencil m-r-5"></i> Thay Đổi</a>
                                <a class="dropdown-item" href="#" data-toggle="modal" data-target="#delete_patient" data-id="${item.id}"><i class="fa fa-trash-o m-r-5"></i> Xóa</a>
                            </div>
                        </div>
                    </td>
                </tr>
            `;
            }); // href="edit-patient.html"
        }

        patientTable.innerHTML += newHTML + `</tbody>`;
    })
}  

$(document).ready(function() {
    $('#delete_patient').on('show.bs.modal', function (event) {
        var button = $(event.relatedTarget); // Button that triggered the modal
        var doctorId = button.data('id'); // Extract info from data-* attributes

        $(this).find('.btn-danger').data('id', doctorId);
    });

    $('#delete_patient').find('.btn-danger').on('click', function() {
        var doctorId = $(this).data('id');

        getAPIBody('delete', `${ROOT}/admin/user/delete?userId=${doctorId}`)
        .then(function(responseData) {
            if(responseData) {
                showToast("success");
                setTimeout(function() { 
                    window.location.href = "patients.html";
                }, 1500); 
                
            } else {
                showToast("error");
            }
        });
    });
});


function editPatient(id) { 
    saveSession('patientId', id);
    window.location.href = "edit-patient.html";
}

function changePageSize() {
    patientTable.innerHTML = '';
    requestApi(pageSizeInput.value, 0)
}

function changePageNum() {
    patientTable.innerHTML = '';
    if (pageNumInput.value < 0) 
        pageNumInput.value = 0 
    // if (pageNumInput.value > maxPageTxt.value)
    //     pageNumInput.value = maxPageTxt.value
 
    requestApi(pageSizeInput.value, pageNumInput.value-1)
}

function nextPage() {
    patientTable.innerHTML = '';
    requestApi(pageSizeInput.value, pageNumInput.value)
}

function prevPage() {
    patientTable.innerHTML = '';
    requestApi(pageSizeInput.value, pageNumInput.value-2)
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