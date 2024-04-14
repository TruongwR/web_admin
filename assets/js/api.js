function makeAjaxRequest(method, url, requestData) {
    console.log (`${method} : ${url}`);

    return new Promise(function(resolve, reject) {
        var xhr = new XMLHttpRequest();
        var token = getLocal('accessToken');

        xhr.open(method, url, true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.setRequestHeader('Authorization', 'Bearer ' + token);

        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                var responseData = null;
                try {
                    responseData = JSON.parse(xhr.responseText);
                } catch (e) {
                    responseData = xhr.responseText;
                }

                if (xhr.status >= 200 && xhr.status < 300) {
                    resolve(responseData);
                } else {
                    reject({ status: xhr.status, response: responseData });
                }
            }
        }; 

        xhr.onerror = function() {
            reject(xhr.statusText);
        };

        xhr.send(JSON.stringify(requestData));
    });
}

// Hàm để gọi AJAX request và lấy ra body của API
function getAPIBody(method, url, requestData) {
    return new Promise(function(resolve, reject) {
        makeAjaxRequest(method, url, requestData)
            .then(function(responseData) {
                console.log(`Received API Response:`);
                console.log(responseData)
                resolve(responseData); // Trả về responseData nếu không có lỗi
            })
            .catch(function(error) {
                if (error.status === 400) {
                    console.error('Bad Request:', error.response);
                    reject(error); // Reject với error nếu status code là 400
                } else {
                    reject(error); // Xử lý các lỗi khác
                }
            });
    });
}

// function makeAjaxRequest(method, url, requestData) {
//     return new Promise(function(resolve, reject) {
//         var xhr = new XMLHttpRequest();
//         var token = getLocal('accessToken');

//         xhr.open(method, url, true);
//         xhr.setRequestHeader('Content-Type', 'application/json');
//         xhr.setRequestHeader('Authorization', 'Bearer ' + token);

//         xhr.onreadystatechange = function() {
//             if (xhr.readyState === 4) {
//                 if (xhr.status >= 200 && xhr.status < 300) {
//                     var responseData = null;
//                     try {
//                         responseData = JSON.parse(xhr.responseText);
//                     } catch (e) {
//                         responseData = xhr.responseText;
//                     }
//                     resolve(responseData);
//                 } else {
//                     reject(xhr.statusText);
//                 }
//             }
//         }; 

//         xhr.onerror = function() {
//             reject(xhr.statusText);
//         };

//         xhr.send(JSON.stringify(requestData));
//     });
// }

// // Hàm để gọi AJAX request và lấy ra body của API
// function getAPIBody(method, url, requestData) {
//     return new Promise(function(resolve, reject) {
//         makeAjaxRequest(method, url, requestData)
//             .then(function(responseData) {
//                 resolve(responseData); // Trả về responseData nếu không có lỗi
//             }) 
//             .catch(function(error) {
//                 if (error.status === 400) {
//                     console.error('Bad Request:', error.response);
//                 }
//                 reject(error);
//             });
//     });
// }