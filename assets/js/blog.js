var blogGrid = document.getElementById('blogGrid');

window.addEventListener('DOMContentLoaded', (event) => {   
    getAPIBody('get', `${ROOT}/admin/blog/list`)
    .then(function(responseData) {    
        var html = ``; 
        responseData.content.forEach(blog => {
            var time = blog.createAt.substring(0, 10); 

            html += `        
            <div class="col-sm-6 col-md-6 col-lg-4">          
                <div class="blog grid-blog" height='250px'> 
                    <div class="blog-content">
                        <a href="#" onclick="viewBlog(${blog.id})"><h3 class="blog-title">${blog.title}</h3></a>
                        <p style="height: 150px;">${blog.content.substring(0, 180)}${blog.content.length > 150 ? ' ...': ''}</p>
                        <a href="#" onclick="viewBlog(${blog.id})" class="read-more"><i class="fa fa-long-arrow-right"></i> Read More</a>
                        <div class="blog-info clearfix">
                            <div class="post-left">
                                <ul>
                                    <li><a href="#."><i class="fa fa-calendar"></i> <span>${time}</span></a></li>
                                </ul>
                            </div>
                            <div class="post-right">
                                <a href="#."><i class="fa fa-eye"></i>${blog.view}</a> 
                                <a href="#."><i class="fa fa-share"></i>${blog.share}</a>
                                <a href="#." onclick="changeActive(${blog.id}, !${blog.isActive})"><i class="fa ${blog.isActive == true ? 'fa-trash' : 'fa-undo'}"></i></a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`
        });
        blogGrid.innerHTML += html;
    });
});

function viewBlog(id) {
    saveLocal('blogId', id);
    window.location.href = 'blog-details.html';
}

function changeActive(id, newStatus) {
    getAPIBody('delete', `${ROOT}/admin/blog/delete?id=${id}&status=${newStatus}`)
    .then(function(responseData) {    
        window.location.href = 'blog.html';
    });
}