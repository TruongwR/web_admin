var doctorNameInput = document.getElementById("doctorName");
var doctorMailInput = document.getElementById("doctorMail");
var dobInput = document.getElementById('dob');
var maleRadioButton = document.getElementById("Male");
var femaleRadioButton = document.getElementById("Female");
var phoneInput = document.getElementById('phone');
var avartarImg = document.getElementById('avatarImg');
var addressInput = document.getElementById('address');
var provinceDropDown = document.getElementById('province');
var districtDropDown = document.getElementById('district');
var communeDropDown = document.getElementById('commune');
var provicneDiv = document.getElementById('provinceDiv');
var districtDiv = document.getElementById('districtDiv');
var descriptionTextArial = document.getElementById('bio');
var activeRadio = document.getElementById('doctor_active');
var inActiveRadio = document.getElementById('doctor_inactive');
var passwordInput = document.getElementById("password");
var confirmInput = document.getElementById("confirm");
var specializationDropDown = document.getElementById('specialization');
var cccdInput = document.getElementById('cccd');
var toast = document.getElementById('toast');
var typeSelect = document.getElementById('type')
var examinationPriceInput = document.getElementById('examinationPrice');

var addressString;
var addressArray = ['1', '1', '1', ''];
var provinceId = -1;
var districtId = -1;
var avatarSrc;

window.addEventListener('DOMContentLoaded', (event) => {
    getAPIBody('get', `${ROOT}/admin/specialization/active`)
    .then(function(responseData) {
        var html = ``;

        if(responseData.content.length > 0) {
            responseData.content.forEach(function(item) {
                html += `<option value="${item.id}">${item.name}</option>`
            });
        }

        specializationDropDown.innerHTML = html;
    });


    saveSession('avatarSrc', 'assets/img/user.jpg');
    jsonProvince.forEach(function(province) {
        var option = document.createElement('option');
        option.value = province.id;
        option.text = province.name;
        option.dataset.id = province.id; // Thêm thuộc tính dataset.id để lưu id của tỉnh
        if (province.id === addressArray[0]) {
            option.selected = true;
        }
        provinceDropDown.appendChild(option);
    });

    provinceDropDown.onchange = (e) => {
        provinceId = e.target.value;
        if (provinceId != addressArray[0]) {
            addressArray[0] = provinceId;
            console.log(`change province: ${provinceId}`);
            setDistrict(provinceId);
        }
    }

    districtDropDown.onchange = (e) => {
        districtId = e.target.value;
        if (districtId != addressArray[1]) {
            addressArray[1] = provinceId;
            console.log(`change district: ${districtId}`);
            setCommune(districtId);
        }
    }

    setDistrict(addressArray[0]);
});

function createDoctor() {
    var password = passwordInput.value;
    var confirm = confirmInput.value;

    addressString = '' + provinceDropDown.value + ',' + districtDropDown.value + ',' + communeDropDown.value + ',' + addressInput.value;

    if (doctorMailInput.value.trim() === '')
        showToast('email is blank');
    else if (doctorNameInput.value.trim() === '')
        showToast('name is blank');
    else if (passwordInput.value.trim() === '')
        showToast('password is blank');
    else if (confirmInput.value.trim() !== passwordInput.value.trim())
        showToast('repeat incorrect');
    else if (phoneInput.value.trim() === '')
        showToast('phone is blank');
    else if (cccdInput.value === '') {
        showToast('cccd is blank');
    } else {
        var payload = {
            id: null,
            clinicId: 1,
            name: doctorNameInput.value.trim(),
            email: doctorMailInput.value.trim(),
            specializationId: specializationDropDown.value,
            password: password,
            address: addressString,
            phone: phoneInput.value.trim().replace(/^0+/, "84/"),
            avatar: avartarImg.src,
            gender: maleRadioButton.checked ? '1' : '0',
            description: descriptionTextArial.value.trim(),
            roleId: 2,
            active: activeRadio.checked ? 1 : 0,
            birthDate: dobInput.value,
            cccd: cccdInput.value.trim(),
            type: typeSelect.value,
            examinationPrice: examinationPriceInput.value > 0 ? examinationPriceInput.value : 0
        }
        console.log('before rest create api:\n', payload);

        getAPIBody('post', `${ROOT}/admin/doctor/create`, payload)
        .then(responseData => {
            window.location.href = "/doctors.html";
        })
        .catch(function(error) {
            // toast.innerText = error.response.message;

            showToast(error.response.message);
            // alert(error.response.message);
        });
    }
}


function handleFileSelect(event) {
    var input = event.target;
    if (input.files && input.files[0]) {
        var file = input.files[0];
        var reader = new FileReader();
        if (file && file.type.startsWith('image/')) {
            if (file.size <= 5 * 1024 * 1024) {

                reader.onload = function(event) {
                    avatarSrc = event.target.result;
                    avartarImg.src = avatarSrc;
                    console.log("Encoded image:", avatarSrc);
                };

                reader.readAsDataURL(file);
            } else {
                showToast('File size should be less than or equal to 5MB');
            }
        } else {
            showToast('Please select a valid image file');
        }
    } else {
        avartarImg.src = getSession('avatarSrc');
        console.log('cancel input img');
    }
}

function setDistrict(provinceId) {
    if(typeof provinceId === 'undefined')
    return;

    while (districtDropDown.firstChild) {
        districtDropDown.removeChild(districtDropDown.firstChild);
    }

    console.log(`set district with proviceId: ${provinceId}`);

    jsonDistric.forEach(function(district) {
        if (district.provinceid === provinceId) {
            var option = document.createElement('option');
            option.value = district.id;
            option.text = district.prefix + ' ' + district.name
            option.dataset.id = district.id;
            if (district.id === addressArray[1]) {
                option.selected = true;
            }
            option.onclick = function() {
                if(!option.selected) {
                    setCommune(option.value);
                }
            }
            districtDropDown.appendChild(option);
        }
    });

    setCommune(districtDropDown.value);

    if (districtDropDown.selectedIndex === -1) {
        districtDropDown.selectedIndex = 0;
    }
}

function setCommune(districtId) {
    if(typeof districtId === 'undefined')
        return;

    while (communeDropDown.firstChild) {
        communeDropDown.removeChild(communeDropDown.firstChild);
    }

    jsonCommune.forEach(function(commune) {
        if (commune.districtid === districtId) {
            var option = document.createElement('option');
            option.value = commune.id;
            option.text = commune.prefix + ' ' + commune.name
            option.dataset.id = commune.id;
            if (commune.id === addressArray[2]) {
                option.selected = true;
            }
            communeDropDown.appendChild(option);
        }
    });

    if (communeDropDown.selectedIndex === -1) {
        communeDropDown.selectedIndex = 0;
    }
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
    }, 3000); // 3 seconds
}
