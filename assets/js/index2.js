var doctorClinictxt = document.getElementById('doctorClinic');
var patientTxt = document.getElementById('patients');
var homeDoctortxt = document.getElementById('homeDoctor');
var scheduleNumberTxt = document.getElementById('schedule');
var userTbl = document.getElementById('userTable');
var doctorList = document.getElementById('doctorList');

var size = 5;

window.addEventListener('DOMContentLoaded', (event) => {
    var loginData = getSession('loginData');
   
    console.log('check: ', loginData);
    getAPIBody('get', `${ROOT}/admin/index2/get?size=${size}`)
    .then(function(responseData) {  
        doctorClinictxt.innerText = responseData.clinicDoctors;
        homeDoctortxt.innerText = responseData.homeDoctors;
        patientTxt.innerText = responseData.patients;
        scheduleNumberTxt.innerText = responseData.schedules;

        var html = ``; 
        responseData.users.content.forEach(function(user) {
            html += `    
                <tr>
                    <td>
                        <img width="28" height="28" class="rounded-circle" src="${user.avatar != null ? user.avatar : 'assets/img/user.jpg'}" alt="">
                        <h2>${user.name}</h2>
                    </td>
                    <td>${user.email}</td>
                    <td>${user.phone}</td>
                </tr>`;
        });
        userTbl.innerHTML += html;

        html = ``;
        responseData.doctorUsers.content.forEach(function(doctor) {
            html += `                                     
            <li>
                <div class="contact-cont">
                    <div class="float-left user-img m-r-10">
                        <a href="#" onclick="viewProfile(${doctor.id})" title="${doctor.user.name}"><img height="40"  src="${doctor.user.avatar != null ? doctor.user.avatar : 'assets/img/user.jpg'}" alt="" class="w-40 rounded-circle"><span class="status online"></span></a>
                    </div>
                    <div class="contact-info">
                        <span class="contact-name text-ellipsis">${doctor.user.name}</span>
                        <span class="contact-date">${doctor.specialization.name}</span>
                    </div>
                </div>
            </li>`;
        });
        doctorList.innerHTML += html;
    }) ;  
});

function viewProfile(id) { 
    saveSession(id);
    window.location.href = 'profile.html';
}

					 