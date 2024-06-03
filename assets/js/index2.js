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

        var barChartData = responseData.barChartData;
        barChartData.datasets[0].backgroundColor = 'rgba(255, 188, 53, 0.5)';
        barChartData.datasets[0].borderColor = 'rgba(255, 188, 53, 1)';
        barChartData.datasets[0].borderWidth = 1;
        var ctx = document.getElementById('bargraph').getContext('2d');
        window.myBar = new Chart(ctx, {
            type: 'bar',
            data: barChartData,
            options: {
                responsive: true,
                legend: {
                    display: false,
                }
            }
        });
        var lineChartData = responseData.lineCharData;
        lineChartData.datasets[0].backgroundColor =  "rgba(0, 158, 251, 0.5)";
        var linectx = document.getElementById('linegraph').getContext('2d'); 
        window.myLine = new Chart(linectx, {
            type: 'line',
            data: lineChartData,
            options: {
                responsive: true,
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true,
                            min: 0
                        }
                    }]
                },
                tooltips: {
                    mode: 'index',
                    intersect: false,
                }
            }
        }); 
    }) ;  
});

function viewProfile(id) { 
    saveSession(id);
    window.location.href = 'profile.html';
}

					 