var avatarImg = document.getElementById('avatar');
var nameTxt = document.getElementById('name');
var specializationTxt = document.getElementById('specialization');
var idTxt = document.getElementById('id'); 
var cccdTxt = document.getElementById('cccd');
var phoneTxt = document.getElementById('phone');
var emailTxt = document.getElementById('email');
var birthdayTxt = document.getElementById('birthday');
var addressTxt = document.getElementById('address');
var genderTxt = document.getElementById('gender'); 
var bookingTxt = document.getElementById('booking'); 
var addressString;
var addressTxtInnerText = ''; 
var addressArray;
var cPhone = document.getElementById('cPhone'); 
var cEmail = document.getElementById('cEmail'); 
var cAddress = document.getElementById('cAddress'); 
var cIntroduction = document.getElementById('cIntroduction'); 
var examinationPriceTxt = document.getElementById('examinationPrice')


window.addEventListener('DOMContentLoaded', (event) => {
    var doctorId = getSession('doctorId');

    getAPIBody('get', `${ROOT}/admin/doctor/get?id=${doctorId}`)
    .then(function(responseData) {
        var user = responseData.user;
        var clinic = responseData.clinic;
        addressString = responseData.user.address;
        addressArray = addressString.split(',').map(function(item) {
            return item.trim();
        }).slice(0, 4);

        jsonProvince.forEach(function(province) {
            if (province.id === addressArray[0]) {
                addressTxtInnerText = province.name + ', ';
                return;
            } 
        });

        jsonDistric.forEach(function(district) {
            if (district.id === addressArray[1]) {
                addressTxtInnerText += district.prefix + ', ' + district.name;
                return;
            }
        });

        jsonCommune.forEach(function(commune) {
            if (commune.id === addressArray[2]) {
                addressTxtInnerText += commune.prefix + ', ' + commune.name;
                return;
            }
        });

        console.log('fill data: ', responseData);
        avatarImg.src = user.avatar;
        specializationTxt.innerText = 'Khoa ' + responseData.specialization.name;
        emailTxt.innerText = user.email;
        nameTxt.innerText  = user.name;
        idTxt.append(responseData.id);
        cccdTxt.append(user.cccd);
        phoneTxt.innerText  = user.phone;
        birthdayTxt.innerText = user.birthDate;
        addressTxt.innerText = addressTxtInnerText + addressArray[3];
        genderTxt.innerText = user.gender === 0 ? 'Male' : 'Female';
        bookingTxt.innerText = responseData.numberChoose + ' lượt';

        // cEmail.innerText = clinic.email;
        cPhone.innerText = clinic.phone;
        cAddress.innerText = clinic.address;
        cIntroduction.innerText = clinic.description;

        examinationPriceTxt.innerText = responseData.examinationPrice;
    })

});