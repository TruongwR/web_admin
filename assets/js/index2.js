var doctorClinictxt = document.getElementById('doctorClinic');
var patientTxt = document.getElementById('patients');
var homeDoctortxt = document.getElementById('homeDoctor');
var scheduleNumberTxt = document.getElementById('schedule');

window.addEventListener('DOMContentLoaded', (event) => {
    var loginData = getSession('loginData');
   
    console.log('check: ', loginData);
    getAPIBody('get', `${ROOT}/admin/index2/get`)
    .then(function(responseData) {  
        doctorClinictxt.innerText = responseData.clinicDoctors;
        homeDoctortxt.innerText = responseData.homeDoctors;
        patientTxt.innerText = responseData.patients;
        scheduleNumberTxt.innerText = responseData.schedules;
    }) ; 
});