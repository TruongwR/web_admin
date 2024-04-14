// Hàm để lưu trữ dữ liệu vào sessionStorage
function saveSession(key, data) {
    // Chuyển đổi đối tượng thành chuỗi JSON
    var jsonData = JSON.stringify(data);
    console.log('save to session:\n', key, ': ', data);
    // Lưu chuỗi JSON vào sessionStorage
    sessionStorage.setItem(key, jsonData);
}

// Hàm để lấy dữ liệu từ sessionStorage
function getSession(key) {
    // Lấy dữ liệu từ sessionStorage
    var jsonData = sessionStorage.getItem(key);

    console.log('get from session:\n', key, ': ', jsonData);
    // Nếu không có dữ liệu được lưu trữ cho khóa đã chỉ định, trả về null
    if (!jsonData) {
        return null;
    }
    // Chuyển đổi chuỗi JSON thành đối tượng JavaScript và trả về
    return JSON.parse(jsonData);
}

function saveLocal(key, data) {
    var jsonData = JSON.stringify(data);
    console.log('save to local:\n', key, ': ', data);
    localStorage.setItem(key, jsonData);
}

function getLocal(key) {
    var jsonData = localStorage.getItem(key);

    console.log('get from local:\n', key, ': ', jsonData);

    if (!jsonData)
        return null;

    return JSON.parse(jsonData);
}