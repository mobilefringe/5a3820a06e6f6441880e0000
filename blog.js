// $(document).ready(function(){
        
// });


function renderPostsPageData(){
    
    //check if tag is attached to path
    var tag_query = window.location.pathname.split( '?' );
    
    
    var blog_posts = getBlogDataBySlug('cornwall-main').posts.sortBy(function(o){ return o.publish_date}).reverse();
    // console.log(blog_posts);
    //main banner post
    renderMainPost('#blog_banner_container','#blog_banner_template', blog_posts[0]);
    
    //three posts before subscription
    var first_3 = blog_posts.splice(0,3);
    console.log("first_3",first_3);
    renderPosts('#latest_blog_container_1','#latest_blog_template_1', first_3);
    
    var blog_popular_posts = blog_posts.sortBy(function(o){ return o.impression_count}).reverse();
    var pop_first_3 = blog_popular_posts.splice(0,3);
    console.log("pop_first_3",pop_first_3);
    renderPosts('#popular_blog_container_1','#popular_blog_template_1', pop_first_3);
    
    //render all the rest of the posts 
    blog_posts = getBlogDataBySlug('cornwall-main').posts.sortBy(function(o){ return o.publish_date}).reverse();
    var posts = blog_posts.splice(3);
    // renderPosts('#posts_container', '#posts_template', posts);
    renderPosts('#latest_blog_container_2','#latest_blog_template_2', posts);
    
    var blog_popular_posts_2 = posts.sortBy(function(o){ return o.impression_count}).reverse();
    posts = blog_popular_posts_2.splice(3);
    renderPosts('#popular_blog_container_2','#popular_blog_template_2', posts);
    
    show_content();
    load_more_1(1);
    load_more_2(1);
    
    $(".blog_selector").click(function(){
        var current_choice =$(this).text();
        console.log("clicked!", current_choice);
        
        $(".blog_selector").removeClass("active");
        $(this).addClass("active");
        
        if(current_choice == "Popular") {
            //sort by highest impression count
            $(".popular_blog_container").show();
            $(".latest_blog_container").hide();
        }
        else {
            //sort by newest post
            $(".popular_blog_container").hide();
            $(".latest_blog_container").show();
        }
    });
    $('#load_more_posts_1').click(function(e){
        var i = $('#num_loaded_1').val();
        load_more_1(i);
        e.preventDefault();
    });
    $('#load_more_posts_2').click(function(e){
        var i = $('#num_loaded_2').val();
        load_more_2(i);
        e.preventDefault();
    });
}
function renderPostDetailData(){
        var pathArray = window.location.pathname.split( '/' );
        var slug = pathArray[pathArray.length-1];
        // var post = getPostDetailsBySlug(slug);
        var post = getPublishedPostDetailsBySlug(slug);
        console.log(post);
        var blog_posts = getBlogDataBySlug('cornwall-main').posts.reverse();

        renderPostDetails("#blog_banner_container", "#blog_banner_template", post, blog_posts);
        renderPostDetails("#current_blog_container", "#current_blog_template", post, blog_posts);
        var popular_blogs = blog_posts.splice(0,5).sortBy(function(o){ return o.impression_count}).reverse();
        renderPosts('#popular_blog_container_1','#popular_blog_template_1', popular_blogs);
        
        var posts = getBlogDataBySlug('cornwall-main').posts.sortBy(function(o){ return o.publish_date}).reverse();
        renderPosts('#latest_blog_container_2','#latest_blog_template_2', posts);
    
        load_more_1(1);
        $('#load_more_posts_1').click(function(e){
            var i = $('#num_loaded_1').val();
            load_more_1(i);
            e.preventDefault();
        });
    }
function init() {
    $('<div class="loader_backdrop"><div class="loader">Loading...</div></div>').appendTo(document.body);
    
//     $('#menu-icon').click(function(){
// 		$(this).toggleClass('open');
// 		$('.nav_container').slideToggle();
// 		$('body').toggleClass('no_scroll');
// 	});
	
//     store_search();
    
//     get_instagram("", 5, 'standard_resolution', render_instagram); //Add social json
 
//     $(document).on('click', '[data-toggle="lightbox"]', function(event) {
//         event.preventDefault();
//         $(this).ekkoLightbox();
//     });
    
//     $(".alpha_list a").click(function(e) {
//         e.preventDefault();
//         var id = $(this).attr("href");
//         $('html, body').animate({
//             scrollTop: $(id).offset().top -25
//         }, 1500);
//     });
//     $('.locate_store').click(function(e){
//         e.preventDefault();
//         $('.stores_table').show()
//     });
    //dynamically changing copyright year
    var current_year = moment().year();
    $("#current_year").text(current_year);
}

function show_content() {
    $("#content").css('visibility','visible').hide().fadeIn('slow');
    $(".loader_backdrop").remove();
}

function renderMainPost(container, template, val){
    var item_list = [];
    var item_rendered = [];
    var template_html = $(template).html();
    var counter = 1;
    Mustache.parse(template_html);   // optional, speeds up future uses
    // $.each( val , function( key, val ) {
        if (val.image_url.indexOf('missing.png') > -1) {
            val.post_image = "//codecloud.cdn.speedyrails.net/sites/59c082786e6f6462ee1d0000/image/png/1507232968000/Group 10.png";
        } else {
            val.post_image = val.image_url;
        }
        
        if(val.body.length > 175){
            val.description_short = val.body.substring(0, 175) + "...";
        } else {
            val.description_short = val.body;
        }
        
        val.description_short = val.description_short.replace("&amp;", "&");
        
        var published_on = moment(val.publish_date).tz(getPropertyTimeZone());
        val.publish_date = published_on.format("MMM. DD");
        
        var rendered = Mustache.render(template_html,val);
        item_rendered.push(rendered);
        counter = counter + 1;
    // });
    $(container).html(item_rendered.join(''));
}

function renderPosts(container, template, collection){
    var item_list = [];
    var item_rendered = [];
    var template_html = $(template).html();
    var counter = 1;
    Mustache.parse(template_html);   // optional, speeds up future uses
    
    $.each( collection , function( key, val ) {
        if (val.image_url.indexOf('missing.png') > -1) {
            val.post_image = "//codecloud.cdn.speedyrails.net/sites/59c082786e6f6462ee1d0000/image/png/1507232968000/Group 10.png";
        } else {
            val.post_image = val.image_url;
        }
        
        if(val.body.length > 100){
            val.description_short = val.body.substring(0, 100) + "...";
        } else {
            val.description_short = val.body;
        }
        
        val.description_short = val.description_short.replace("&amp;", "&");
        
        var published_on = moment(val.publish_date).tz(getPropertyTimeZone());
        val.publish_date = published_on.format("MMM DD, YYYY");
        
        //get first tag 
        if(val.tag != null && val.tag !== undefined) {
            val.main_tag = val.tag[0];
            // console.log("main tag", val.main_tag);
            val.show_tag = "display:block";
        }
        else {
            val.show_tag = "display:none"
        }
        //get the tag that is capitalized
        // if(val.tag != null && val.tag !== undefined) {
        //     console.log(val.tag);
        //     $.each( val.tag , function( key, tag ) {
               
                
        //         if(tag[0] === tag[0].toUpperCase()){
        //             val.main_tag = tag;
        //         }
        //     })
        //     console.log("main tag", val.main_tag);
        // }
        
        val.counter = counter;
        
        var rendered = Mustache.render(template_html,val);
        item_rendered.push(rendered);
        counter = counter + 1;
        // item_list.push(val);
    });
    
    // $(container).show();
    $(container).html(item_rendered.join(''));
}
function renderPostDetails(container, template, collection, blog_posts){
    var item_list = [];
    var item_rendered = [];
    var template_html = $(template).html();
    $.each(collection , function( key, val ) {
        if (val.image_url.indexOf('missing.png') > -1) {
            val.post_image = "//codecloud.cdn.speedyrails.net/sites/57f7f01f6e6f647835890000/image/png/1461352407000/HallifaxLogo.png";
        } else {
            val.post_image = val.image_url;
        }
        
        if(val.body.length > 100){
            val.description_short = val.body.substring(0,100) + "...";
        }
        else{
            val.description_short = val.body;
        }

        var blog_list = [];
        $.each(blog_posts, function(key, val) {
            var slug = val.slug;
            blog_list.push(val.slug);
        });
        var current_slug = val.slug;
        var index = blog_list.indexOf(current_slug);
        if(index >= 0 && index < blog_list.length){
          var next_slug = blog_list[index + 1];
            if(next_slug != undefined || next_slug != null){
                val.next_post = "/posts/" + next_slug;
                val.next_show = "display: block";
            } else {
                val.next_show = "display: none";
            }
        }
        if(index >= 0 && index < blog_list.length){
            var prev_slug = blog_list[index - 1];
            if(prev_slug != undefined || prev_slug != null){
                val.prev_post = "/posts/" + prev_slug;
                val.prev_show = "display: block";
            } else {
                val.prev_show = "display: none";
            }
        }
        var published_on = moment(val.publish_date).tz(getPropertyTimeZone());
        val.publish_date = published_on.format("MMM DD, YYYY");
        
        if(val.tag != null && val.tag !== undefined) {
            val.main_tag = val.tag[0];
            // console.log("main tag", val.main_tag);
            val.show_tag = "display:block";
        }
        else {
            val.show_tag = "display:none"
        }
        
        val.twitter_title = val.title + " via @shopHSC";
        
        var rendered = Mustache.render(template_html,val);
        item_rendered.push(rendered);
    });
    
    $(container).html(item_rendered.join(''));
}

    
function load_more_1(num){
    var n = parseInt(num);
    for(i = n; i < n + 2; i++){
        var id = i.toString();
        $('#latest_show_' + id ).fadeIn();
    }
    var blog_posts = getBlogDataBySlug('cornwall-main').posts.sortBy(function(o){ return o.publish_date}).reverse();
    var posts = blog_posts.splice(3);
    var total_posts = posts.length;
    if(i >= total_posts){
        $('#loaded_posts_1').hide();
        $('#all_loaded_1').show();
    }
    $('#num_loaded_1').val(i);
}
function load_more_2(num){
    var n = parseInt(num);
    for(i = n; i < n + 2; i++){
        var id = i.toString();
        $('#pop_show_' + id ).fadeIn();
    }
    var blog_posts = getBlogDataBySlug('cornwall-main').posts.sortBy(function(o){ return o.impression_count}).reverse();
    var posts = blog_posts.splice(3);
    console.log(posts[0]);
    var total_posts = posts.length;
    if(i >= total_posts){
        $('#loaded_posts_2').hide();
        $('#all_loaded_2').show();
    }
    $('#num_loaded_2').val(i);
}