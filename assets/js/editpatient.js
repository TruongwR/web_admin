var nameInput = document.getElementById('name');
var emailInput = document.getElementById('email')
var passwordInput = document.getElementById('password')
var confirmInput = document.getElementById('confirm')
var birthDateInput = document.getElementById('dob')
var maleRadioBtn = document.getElementById('male')
var femaleRadioBtn = document.getElementById('female')
var addressInput = document.getElementById('address')
var provinceSelect = document.getElementById('province')
var districtSelect = document.getElementById('district')
var communeSelect = document.getElementById('commune')
var descriptionInput = document.getElementById('bio')
var phoneInput = document.getElementById('phone')
var avatarImg = document.getElementById('avatarImg')
var avatarInput = document.getElementById('avatarInput')
var cccdInput = document.getElementById('cccd')
var activeRadioBtn = document.getElementById('patient_active')
var inactiveRadioBtn = document.getElementById('patient_inactive')
var provicneDiv = document.getElementById('provinceDiv')
var districtDiv = document.getElementById('districtDiv')

var toast = document.getElementById('toast');
var addressString;
var addressArray = ['1', '1', '1', ''];
var provinceId = -1;
var districtId = -1; 
var avatarSrc;

window.addEventListener('DOMContentLoaded', (event) => { 
    var patientId = getSession('patientId');

    getAPIBody('get', `${ROOT}/admin/user/get?id=${patientId}`)
    .then(function(user) {  
        addressString = user.address;
        addressArray = addressString.split(',').map(function(item) {
            return item.trim();
        }).slice(0, 4);
        
        console.log(addressArray);

        nameInput.value = user.name;
        emailInput.value = user.email;
        birthDateInput.value = user.birthDate;
        if(user.gender === '0')
            maleRadioBtn.checked = true;
        else
            femaleRadioBtn.checked = true;
        phoneInput.value = user.phone;
        avatarImg.src = user.avatar != null ? user.avatar : 'assets/img/user.jpg';
        saveSession('avatarSrc', avatarImg.src);
        addressInput.value = addressArray[3];

        console.log(user);

        jsonProvince.forEach(function(province) {
            var option = document.createElement('option');
            option.value = province.id;
            option.text = province.name;
            option.dataset.id = province.id; // Thêm thuộc tính dataset.id để lưu id của tỉnh
            if (province.id === addressArray[0]) {  
                option.selected = true;
            } 
            provinceSelect.appendChild(option);
        });

        provinceSelect.onchange = (e) => {
            provinceId = e.target.value; 
            if (provinceId != addressArray[0]) {
                addressArray[0] = provinceId;
                console.log(`change province: ${provinceId}`);
                setDistrict(provinceId);
            } 
        }
        
        districtSelect.onchange = (e) => {
            districtId = e.target.value;
            if (districtId != addressArray[1]) {
                addressArray[1] = provinceId;
                console.log(`change district: ${districtId}`);
                setCommune(districtId);
            } 
        }

        setDistrict(addressArray[0]); 

        descriptionInput.value = user.description;
        if (user.active === true) 
            activeRadioBtn.checked = true;
        else
            inactiveRadioBtn.checked = true;

        cccdInput.value = user.cccd;        
    })  
});

function editPatient() {
    var patientId = getSession('patientId');
    var password = passwordInput.value.trim();
    var confirm = confirmInput.value.trim(); 
 
    addressString = '' + provinceSelect.value + ',' + districtSelect.value + ',' + communeSelect.value + ',' + addressInput.value;
  
    if (emailInput.value.trim() === '') 
        showToast('email is blank'); 
    else if (nameInput.value.trim() === '') 
        showToast('name is blank'); 
    else if (confirm !== password)
        showToast('repeat incorrect');   
    else if (phoneInput.value.trim() === '') 
        showToast('phone is blank');
    else if (cccdInput.value.trim() === '') {
        showToast('cccd is blank');
    } else { 
        var payload = {
            id: patientId, 
            name: nameInput.value.trim(),
            email: emailInput.value.trim(),
            password: password,
            address: addressString,
            phone: phoneInput.value.trim(),
            avatar: avatarImg.src,
            gender: maleRadioBtn.checked ? '1' : '0',
            description: descriptionInput.value.trim(),
            roleId: 3, 
            active: activeRadioBtn.checked ? 1 : 0,
            birthDate: birthDateInput.value,
            cccd: cccdInput.value.trim()
        } 
        console.log('before rest create api:\n', payload);

        getAPIBody('put', `${ROOT}/admin/user/update`, payload)
        .then(responseData => {  
            window.location.href = "/patients.html";
        })
        .catch(function(error) {                        
            showToast(error.response.message);  
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
                    avatarImg.src = avatarSrc;
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
        avatarImg.src = getSession('avatarSrc');
        console.log('cancel input img');
    }
}


function setDistrict(provinceId) {
    if(typeof provinceId === 'undefined')
    return;

    while (districtSelect.firstChild) {
        districtSelect.removeChild(districtSelect.firstChild);
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
            districtSelect.appendChild(option);
        }
    });
 
    setCommune(districtSelect.value);

    if (districtSelect.selectedIndex === -1) {
        districtSelect.selectedIndex = 0; 
    }
} 

function setCommune(districtId) {
    if(typeof districtId === 'undefined')
        return;

    while (communeSelect.firstChild) {
        communeSelect.removeChild(communeSelect.firstChild);
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
            communeSelect.appendChild(option);
        }
    });

    if (communeSelect.selectedIndex === -1) {
        communeSelect.selectedIndex = 0;
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
