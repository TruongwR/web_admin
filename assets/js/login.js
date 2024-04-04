 

export default class login {
    constructor() {

    }

    static makeAjaxRequest (method, url, requestData) {
            return new Promise(function(resolve, reject) {
                var xhr = new XMLHttpRequest();
                xhr.open(method, url, true);
                xhr.setRequestHeader('Content-Type', 'application/json');
                var responseData = null;

                xhr.onreadystatechange = function() {
                    if (xhr.readyState === 4) {
                        if (xhr.status >= 200 && xhr.status < 300) {
                            var responseData = null;
                            try {
                                responseData = JSON.parse(xhr.responseText);
                            } catch (e) {
                                responseData = xhr.responseText;
                            }
                            logAPIRequest(url, requestData, responseData);
                            resolve(responseData);
                        } else {
                            reject(xhr.statusText);
                        }
                    }
                };

                xhr.onerror = function() {
                    reject(xhr.statusText);
                };

                xhr.send(JSON.stringify(requestData));
            });
    }
}


