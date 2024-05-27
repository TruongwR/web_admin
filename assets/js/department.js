var specializationTbl = document.getElementById("specializationTbl");

window.addEventListener('DOMContentLoaded', (event) => {
    size = 100;

    getAPIBody('get', `${ROOT}/admin/specialization/list?size=${size}`)
    .then(function(responseData) {  
        var newHTML = ` <thead>
                            <tr>
                                <th>Id</th>
                                <th>Khoa</th>
                                <th>Trạng Thái</th>
                                <th class="text-right">Hoạt Động</th>
                            </tr>
                        </thead>`;

        if(responseData.content.length > 0) {  
            responseData.content.forEach(function(item) {   
                newHTML += `<tr>
                                <td>${item.id}</td>
                                <td>${item.name}</td>
                                <td><span class="custom-badge status-${item.active === true ? 'green' : 'red'}">${item.active === true ? 'Active' : 'Inactive'}</span></td>
                                <td class="text-right">
                                <a href="#." onclick="changeActive(${item.id}, !${item.active})"><i class="fa ${item.active == true ? 'fa-trash' : 'fa-undo'}"></i></a>
                                </td>
                            </tr> `;
            }); 
        }
        specializationTbl.innerHTML = newHTML;
    })
});

function changeActive(id, newStatus) {
    var payload = {
        id: id,
        active: newStatus
    };

    getAPIBody('put', `${ROOT}/admin/specialization/update`, payload)
    .then(function(responseData) {    
        window.location.href = 'departments.html';
    });
}