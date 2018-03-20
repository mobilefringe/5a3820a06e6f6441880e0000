function searchFunction (e) {
    var search = $("input.site_search").val();
    if(search.length > 0) {
        console.log("search",search);
        search = search.toLowerCase();
        document.location.href = '/blog?search='+search;
    }
}
function searchFunctionMobile (e) {
    var search = $("input.site_search_m").val();
    if(search.length > 0) {
        console.log("search",search);
        search = search.toLowerCase();
        document.location.href = '/blog?search='+search;
    }
}

function renderPostsPageData(){
    //render main banner post
    var blog_posts = getBlogDataBySlug('cornwall-queen-city').posts.sortBy(function(o){ return o.publish_date}).reverse();
    renderMainPost('#blog_banner_container','#blog_banner_template', blog_posts[0]);
        
    //check if tag is attached to path
    var query = window.location.search;
    if(query !== "") {
        $(".load_more").hide();
        $('.blog_selector').hide();
        $(".bottom_blogs").hide();
        var search_part = query.split('?')[1];
        var search_tag = search_part.split('=')[0];
        console.log("search_part",search_tag);
        if(search_tag == "search"){
            var search_query = query.split('=')[1];
            if(search_query.length > 0) {
                search_query = search_query.replace("%20"," ");
                console.log("search",search_query);
                var key_posts =  getPostsByKeyword(search_query);
                if(key_posts.length === 0){
                    $("#no_posts").show();
                }
                else {
                    renderPosts('#latest_blog_container_1','#latest_blog_template_1',key_posts);
                }
                $('.inner_select_bar_div').prepend('<span class="col-xs-6 col-sm-3 blog_selector active">'+search_query+'</span>')
            }
            else {
                regularPostList();
            }
        }
        else {
            var tag_name = query.split('=')[1];
            tag_name = tag_name.replace("%20"," ");
            console.log("tag_name",tag_name);
        
            // var blog_posts = getBlogDataBySlug('cornwall-queen-city').posts.sortBy(function(o){ return o.publish_date}).reverse();
            renderSearchPosts('#latest_blog_container_1','#latest_blog_template_1', blog_posts, tag_name);
            $('.inner_select_bar_div').prepend('<span class="col-xs-6 col-sm-3 blog_selector active">'+tag_name+'</span>')
        }
        
        
        
        
        // <span class="blog_selector">Popular</span>
    }
    else {
        regularPostList();

    }
    var youtube_videos = [];
    $.ajax({
    	type: "GET",
    	url: "https://gdata.youtube.com/feeds/api/users/CornwallCentre/uploads?max-results=3&orderby=published&v=2&alt=jsonc",
    	cache: false,
    	dataType:'jsonp',
    	success: function(data){
// 		show_my_videos(data);
		//If you want to see in console...
		console.log(data);
        // console.log(data.data.items);
		// });
        }
    });
   show_content();
}
function renderPostDetailData(){
    var pathArray = window.location.pathname.split( '/' );
    var slug = pathArray[pathArray.length-1];
    // var post = getPostDetailsBySlug(slug);
    var post = getPublishedPostDetailsBySlug(slug);
    console.log(post);
    
    
    
    var blog_posts = getBlogDataBySlug('cornwall-queen-city').posts.reverse();
    var post_banners = [];
    if(post[0].additional_images.length > 0) {
        $.each( post[0].additional_images , function( key, val ) {
            var temp = {};
            temp.image_url = val.image_url;
            post_banners.push(temp)
            // post.seconcol-xs-6 col-sm-3 d_image_url = post.additional_images[0].image_url;
        });
    }        
    var temp = {};
    temp.image_url = post[0].image_url;
    post_banners.unshift(temp);
    
    console.log(post_banners);
    renderGeneral("#blog_banner_container", "#blog_banner_template",post_banners);
    renderPostDetails("#title_blog_container", "#title_blog_template", post, blog_posts);
    renderPostDetails("#current_blog_container", "#current_blog_template", post, blog_posts);
    var popular_blogs = blog_posts.splice(0,5).sortBy(function(o){ return o.impression_count}).reverse();
    renderPosts('#popular_blog_container_1','#popular_blog_template_1', popular_blogs);
    
    var posts = getBlogDataBySlug('cornwall-queen-city').posts.sortBy(function(o){ return o.publish_date}).reverse();
    renderPosts('#latest_blog_container_2','#latest_blog_template_2', posts);
    
    // console.log(post, post[0].main_tag);
    
    //load related posts by tag
    var current_tag = post[0].tag;
    var filtered_posts = getBlogDataBySlug('cornwall-queen-city').posts.filter(function(o){
        if(current_tag != null && o.tag !==null){
            for( var i = 0; i < current_tag.length ; i++ ) {
               return o.tag.indexOf(current_tag[i]) === -1;
            }
        }
        // console.log("post.main_tag", current_tag, "o.tag", o.tag, compareArrays(current_tag, o.tag)); return compareArrays(current_tag, o.tag)
        
    });
    console.log(filtered_posts);
    renderPosts('#latest_blog_container_3','#latest_blog_template_3', filtered_posts.splice(0,4));
    if (filtered_posts.length === 0) {
        $(".you_may_like").hide();
        $("#latest_blog_container_3").hide();
    }
    renderTags('#tag_container','#tag_template', post);
    load_more_1(1);
    $('#load_more_posts_1').click(function(e){
        var i = $('#num_loaded_1').val();
        load_more_1(i);
        e.preventDefault();
    });
    
    
    $('.flexslider').flexslider({
        animation: "slide",
    });
    $('.details_share_icons a').click(function(){
        var social_media = $(this).attr("data-value");
        console.log("social_media", social_media, post[0].slug);
        ga('send', 'social', social_media, 'share', 'http://cornwallcentre.com/blog/'+ post[0].slug);
    });
    show_content();
}
function init() {
    $('<div class="loader_backdrop"><div class="loader">Loading...</div></div>').appendTo(document.body);
    $('#menu-icon').click(function(){
		$(this).toggleClass('open');
		$('.mobile_menu_container').slideToggle();
		$('body').toggleClass('no_scroll');
		
	});
	$(".header_search").click(function(){
	    $(".search_bar").slideToggle();
	});
//     $('#menu-icon').click(function(){
//       $(this).toggleClass('open');
// 		if($(this).hasClass('open')){
//             console.log("#menu-icon", $(this).hasClass('open'));
//               $(".nav_header_menu_container").css({"height": "500px"});
//               $(".nav_container").css({"height": "500px"});
//               $('.nav_container').slideDown();
// 		        $('body').addClass('no_scroll');
// 		}
// 		else {
// 		    $(".nav_header_menu_container").removeAttr("style");//.css({"height": "75px"});
//             $(".nav_container").removeAttr("style");//.css({"height": "auto"});
//             $('.nav_container').slideUp();
// 		    $('body').removeClass('no_scroll');
// 		}
// 		$('.nav_container').slideToggle();
// 		$('body').toggleClass('no_scroll');
// 	});
// 	$(window).on('resize', function(){
// 	    if($( document ).width() > 768) {
// 	        $(".nav_header_menu_container").removeAttr("style");//.css({"height": "75px"});
//             $(".nav_container").removeAttr("style");//.css({"height": "auto"});
// 	    }
// 	    else {
// 	        $('#menu-icon').removeClass("open");
// 	        $('body').removeClass('no_scroll');
// 	        $('.nav_container').slideUp();
// 	    }
// 	})
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
    
    blogNewsletterSignup();
}

function show_content() {
    $("#content").css('visibility','visible').hide().fadeIn('slow');
    $(".loader_backdrop").remove();
}

function blogNewsletterSignup (){
    
    blog_cm_url = "//mobilefringe.createsend.com/t/d/s/fjdtyy/";
    $('.blogNewsletterForm').submit(function(e) {
        e.preventDefault();
        console.log("e",e);
        values = [];
        values = JSON.stringify($(this).serializeArray());
        // console.log($(this).attr("id"));
        form_id = $(this).attr("id");
        // console.log(this ,$(this + " #success_subscribe"));
        
        $.getJSON(
            blog_cm_url + "?callback=?",
            $(this).serialize(),
            function (data) {
                if (data.Status === 400) {
                    alert("Please try again later.");
                } else { // 200
                    $("#"+ form_id +" #success_subscribe").fadeIn();
                }
            }
        );
        
    });
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
        
        if(val.additional_images.length > 0) {
            val.second_image_url = val.additional_images[0].image_url;
        }
        
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
        
        if(val.body.length > 150){
            val.description_short = val.body.substring(0, 150) + "...";
        } else {
            val.description_short = val.body;
        }
        
        val.description_short = val.description_short.replace("&amp;", "&");
        
        var published_on = moment(val.publish_date).tz(getPropertyTimeZone());
        val.publish_date = published_on.format("MMMM D, YYYY");
        
        //get first tag 
        if(val.tag != null && val.tag !== undefined) {
            val.main_tag = val.tag[0];
            // console.log("main tag", val.main_tag);
            val.show_tag = "display:inline-block";
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
        
        if(val.body.length > 150){
            val.description_short = val.body.substring(0,150) + "...";
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
                val.next_post = "/blog/" + next_slug;
                val.next_show = "display: block";
            } else {
                val.next_show = "display: none";
            }
        }
        if(index >= 0 && index < blog_list.length){
            var prev_slug = blog_list[index - 1];
            if(prev_slug != undefined || prev_slug != null){
                val.prev_post = "/blog/" + prev_slug;
                val.prev_show = "display: block";
            } else {
                val.prev_show = "display: none";
            }
        }
        var published_on = moment(val.publish_date).tz(getPropertyTimeZone());
        val.publish_date = published_on.format("MMMM D, YYYY");
        
        if(val.tag != null && val.tag !== undefined) {
            val.main_tag = val.tag[0];
            // console.log("main tag", val.main_tag);
            val.show_tag = "display:inline-block";
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
function renderTags (container, template, post){
    var item_list = [];
    var item_rendered = [];
    var template_html = $(template).html();
    var collection = post[0].tag;
    console.log("collection", collection);
    if(collection != null && collection !== undefined) {
        $.each(collection , function( key, val ) {
        console.log(key,val)
        var new_val = {};
        new_val.name = val;
        var rendered = Mustache.render(template_html,new_val);
            item_rendered.push(rendered);
        });
    }
    
    
    $(container).html(item_rendered.join(''));
}

function renderSearchPosts(container, template, collection, search){
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
        
        if(val.body.length > 150){
            val.description_short = val.body.substring(0, 150) + "...";
        } else {
            val.description_short = val.body;
        }
        
        val.description_short = val.description_short.replace("&amp;", "&");
        
        var published_on = moment(val.publish_date).tz(getPropertyTimeZone());
        console.log(val.publish_date);
        val.published_date = published_on.format("MMMM D, YYYY");
        console.log("dates", val.title, published_on, val.published_date);
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
        var added_val = false;
        if(val.tag !== null && val.tag !== undefined) {
            //search through all the tags with query, if matches render
            $.each( val.tag , function( key2, tag ) {
                if(!added_val){
                    tag = tag.toLowerCase();
                    search = search.toLowerCase();
                    // console.log(key, "tag is", tag , "search is", search);
                    if(tag.indexOf(search) > -1 || search.indexOf(tag) > -1) {
                        // console.log("tag is", tag , "search is", search);
                        var rendered = Mustache.render(template_html,val);
                        item_rendered.push(rendered);
                        counter = counter + 1;
                        added_val = true;
                    }
                }
            });
            
        }
        // item_list.push(val);
    });
    if(item_rendered.length === 0) {
        $("#no_posts").show();
    }
    $(container).html(item_rendered.join(''));
}
function renderGeneral(container, template, collection){
    var item_list = [];
    var item_rendered = [];
    var template_html = $(template).html();
    Mustache.parse(template_html); 
    $.each( collection , function( key, val ) {
        var repo_rendered = Mustache.render(template_html,val);
        item_rendered.push(repo_rendered);
    });
    $(container).html(item_rendered.join(''));
}

function load_more_1(num){
    var n = parseInt(num);
    for(i = n; i < n + 3; i++){
        var id = i.toString();
        $('#latest_show_' + id ).fadeIn();
    }
    var blog_posts = getBlogDataBySlug('cornwall-queen-city').posts.sortBy(function(o){ return o.publish_date}).reverse();
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
    var blog_posts = getBlogDataBySlug('cornwall-queen-city').posts.sortBy(function(o){ return o.impression_count}).reverse();
    var posts = blog_posts.splice(3);
    console.log(posts[0]);
    var total_posts = posts.length;
    if(i >= total_posts){
        $('#loaded_posts_2').hide();
        $('#all_loaded_2').show();
    }
    $('#num_loaded_2').val(i);
}
function compareArrays(arr1, arr2) {
    return $(arr1).not(arr2).length === 0 && $(arr2).not(arr1).length === 0
}

function regularPostList () {
    var blog_posts = getBlogDataBySlug('cornwall-queen-city').posts.sortBy(function(o){ return o.publish_date}).reverse();
    //three posts before subscription
    var first_3 = blog_posts.splice(0,3);
    console.log("first_3",first_3);
    renderPosts('#latest_blog_container_1','#latest_blog_template_1', first_3);
    
    var blog_popular_posts = blog_posts.sortBy(function(o){ return o.impression_count}).reverse();
    var pop_first_3 = blog_popular_posts.splice(0,3);
    console.log("pop_first_3",pop_first_3);
    renderPosts('#popular_blog_container_1','#popular_blog_template_1', pop_first_3);
    
    //render all the rest of the posts 
    blog_posts = getBlogDataBySlug('cornwall-queen-city').posts.sortBy(function(o){ return o.publish_date}).reverse();
    var posts = blog_posts.splice(3);
    // renderPosts('#posts_container', '#posts_template', posts);
    renderPosts('#latest_blog_container_2','#latest_blog_template_2', posts);
    // latest_posts = getBlogDataBySlug('cornwall-queen-city').posts.sortBy(function(o){ return o.publish_date}).reverse();
    // // var posts = blog_posts.splice(5);
    // // renderPosts('#posts_container', '#posts_template', posts);
    // console.log("posts",latest_posts);
    // renderPosts('#latest_blog_container_3','#latest_blog_template_3', latest_posts);
    
    var blog_popular_posts_2 = posts.sortBy(function(o){ return o.impression_count}).reverse();
    posts = blog_popular_posts_2.splice(3);
    renderPosts('#popular_blog_container_2','#popular_blog_template_2', posts);
    
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
function renderYoutube(container, template, collection){
    var item_list = [];
    var item_rendered = [];
    var template_html = $(template).html();
    Mustache.parse(template_html); 
    $.each( collection , function( key, val ) {
        val.embedded_url = "//www.youtube.com/embed/" + getId(val.link)+"?rel=0&autoplay=1&mute=1";
        val.title = truncate(val.title, 6);
        var repo_rendered = Mustache.render(template_html,val);
        item_rendered.push(repo_rendered);
    });
    $(container).html(item_rendered.join(''));
}
function getId(url) {
    var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    var match = url.match(regExp);

    if (match && match[2].length == 11) {
        return match[2];
    } else {
        return 'error';
    }
}

function truncate(str, no_words) {
    return str.split(" ").splice(0,no_words).join(" ");
}
// var videoId = getId('http://www.youtube.com/watch?v=zbYf5_S7oJo');