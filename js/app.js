
    var app = {};

	var coolones = ["art", "prettygirls", "perfecttiming", "earthporn", "carporn", "foodporn", "oldschoolcool", "ladyboners",  "cosplay", "mapporn", "Pareidolia"];
	var randred = coolones[Math.round(Math.random() * 10)];
	
 	$.getJSON("https://www.reddit.com/r/" + randred + "/search.json?restrict_sr=on&q=url%3Aimgur.com&sort=hot&t=all&limit=25", function(json){ 
		app.images = json.data.children;
		app.makeQuilt();
	})
	
    app.uniqueImageID = 1;

    app.addImages = function(urlArray) {
        for (var i = 0; i < urlArray.length; i++) {
            app.addImage(urlArray[i]);
        }
    };

    app.addImage = function(url) {
        app.images.push({
            url: url,
            id: app.uniqueImageID
        });

        app.uniqueImageID += 1;
    };

    app.removeImage = function(id) {
        app.images = _.without(app.images, _.findWhere(app.images, { id: id }));
        $('.image[data-id="' + id + '"]').remove();
    };
	
	arrSearch = function(array, ex){
		
		var res = 0;
		for(var i = 0; i < array.length; i++){
			
			if(array[i].search(ex) > -1){ res = i; }
			
		}
		return res;
	};
	
   
    app.makeQuilt = function() {
        if (!app.images.length) {
            $('body').removeClass('dragenter dragover');
            $('.update-outer').removeClass('show');
            return;
        }
		
		$(".quilt-wrapper").remove();

        var $body = $('body'),
            $quiltScrollWrapper = $('<div class="quilt-scroll-wrapper"></div>'),
            $quiltWrapper = $('<div class="quilt-wrapper"></div>'),
            $quilt = $('<div class="quilt" data-grayscale="0" data-invert="0" alignment="central-axis"></div>'),
            $tools = $('<div class="tools"></div>'),
            $imagesContainer = $('<div>'),
            $images,
            i
        ;
		

	  var imgi = [];
	  var refi = [];
	  var idi = [];
	  
	  	var redlink = $("#redditlink").is(":checked");
	
	  // get current state
		
		var inputs = [];
		var selects = [];
		$("input").each(function(){ 
			if($(this).attr("id") == "redditlink"){
				inputs.push($(this).is(":checked"));
			} else {
				inputs.push($(this).val());
					} 
		});
		$("select").each(function(){ selects.push($(this).val()); });
		
	  	for(var k=2; k<4; k++){
	  		
			if(typeof inputs[k] === "undefined"){
				inputs[k] = "";
			}
			
	  	}
		
	  	var sortsboo = [];
		var fromboo = [];
		var limboo = [];
		var sorts = ["hot", "relevance", "new", "top", "comments"];
		var from  = ["all", "hour", "day", "week", "month", "year"];
		var lim = ["10", "25", "50", "100"];
		$(sorts).each(function(id, el){
			if(selects[0] == el){
				sortsboo.push("selected");
			} else{
				sortsboo.push("");
			}
		})
		$(from).each(function(id, el){
			if(selects[1] == el){
				fromboo.push("selected");
			} else{
				fromboo.push("");
			}
		})
		$(lim).each(function(id, el){
			if(selects[2] == el){
				limboo.push("selected");
			} else{
				limboo.push("");
			}
		})
		
        for (i = 0; i < app.images.length; i++) {
			
			var splitURL = app.images[i].data.url.split("/");
			var imgrdex = arrSearch(splitURL, "imgur.com") + 1;
			var imgURL = app.images[i].data.url + ".png";
			
			if(redlink){
				refi.push("https://www.reddit.com/" + app.images[i].data.permalink);
			} else {
				refi.push(app.images[i].data.url);
			}
			idi.push(app.images[i].data.id);


			if(splitURL[imgrdex] == "a"){
			   imgi.push(app.images[i].data.thumbnail);
				} 
				else {
				 imgi.push(imgURL);
				  					  }
			   
        }
		
		
		for(var j = 0; j < imgi.length; j++){
			$imagesContainer.append('<img ref="' + refi[j] + '" data-id="' + idi[j] + '" src="' + imgi[j] + '" />');
		}

        $images = $imagesContainer.find('img');

        $body[0].className = '';
        $body.empty().css('visibility', 'hidden').addClass('chrome-image-quilts');
        $body.append('<div style="-webkit-transform: translateZ(0)"></div>');

        $body.append($tools);
		
		
        $tools
           
            // Alignment
            .append($('<a class="flush-left"><i>&nbsp;<b></b><b></b><b></b><b></b></i></a>').click(function(){ $quilt.attr('alignment', 'flush-left'); }))
            .append($('<a class="central-axis"><i>&nbsp;<b></b><b></b><b></b><b></b></i></a>').click(function(){ $quilt.attr('alignment', 'central-axis'); }))

            // Zoom
            .append('<span class="label zoom-tool">Zoom&nbsp;percent</span>')
            .append($('<a class="zoom-tool">100</a>').click(function(){ $(this).next().val(100).change(); }))
            .append($('<input class="zoom-tool" type="range" min="100" max="300" value="100">').on('change input', function(e){ $quilt.find('.image').each(function(){ $(this).find('.zoom input').val(e.target.value); $(this).find('img').css('-webkit-transform', 'scale(' + (e.target.value / 100) + ') translateZ(0)'); }); }))
            .append($('<a class="zoom-tool">300</a>').click(function(){ $(this).prev().val(300).change(); }))

            // Scale
            .append('<span class="label scale-tool">Row&nbsp;height&nbsp;in&nbsp;pixels</span>')
            .append($('<a class="scale-tool">30</a>').click(function(){ $(this).next().val(30).change(); }))
            .append($('<input class="scale-tool" type="range" min="30" max="300" value="150">').on('change input', function(e){ $quilt.find('.image, .image img').each(function(){ $(this).css('height', e.target.value); }); }))
            .append($('<a class="scale-tool">300</a>').click(function(){ $(this).prev().val(300).change(); }))

            // Order
            .append('<span class="label order-tool">Order</span>')
            .append($('<a class="order-tool">Original</a>').click(function(){
                $images = $quilt.find('.image').toArray();
                $images.sort(function(a, b){
                    a = parseInt($(a).attr('data-id'), 10);
                    b = parseInt($(b).attr('data-id'), 10);
                    if (a < b) return -1;
                    if (a > b) return 1;
                    return 0;
                });
                $quilt.html($images);
                app.setupIndividualZooms();
            }))
            .append($('<a class="order-tool">Shuffle</a>').click(function(){
                $images = $quilt.find('.image').toArray();
                $images.sort(function(a, b){
                    a = Math.random();
                    b = Math.random();
                    if (a < b) return -1;
                    if (a > b) return 1;
                    return 0;
                });
                $quilt.html($images);
                app.setupIndividualZooms();
            }))
            // Mode
            .append('<span class="label color-mode-tool">Mode</span>')
            .append($('<a class="color-mode-tool">Color</a>').click(function(){ $quilt.attr('data-grayscale', 0); }))
            .append($('<a class="color-mode-tool">Greyscale</a>').click(function(){ $quilt.attr('data-grayscale', 1); }))
            .append($('<a class="color-mode-tool">Inverted</a>').click(function(){ $quilt.attr('data-invert', parseInt($quilt.attr('data-invert'), 10) === 1 ? 0 : 1); }))


			// Search
			.append('<span class="label color-mode-tool">Subreddit</span>')
			.append('<input style="width: 75px" class="label color-mode-tool" type="text" id="subreddit" value="' + inputs[2] + '"></input>')
			.append('<span class="label color-mode-tool">Search</span>')
			.append('<input style="width: 75px" class="label color-mode-tool" type="text" id="query" value="' + inputs[3] + '"></input>')
			.append('<span style="width: 65px" class="label color-mode-tool">Comments</span>')
			.append('<input class="label color-mode-tool" type="checkbox" id="redditlink" value="' + inputs[4] + '" label="Link to comments"></>')
			.append('<span class="label color-mode-tool">Sorted</>')
			.append('<select id="relev"><option ' + sortsboo[0] + ' value="hot">hot</option><option ' + sortsboo[1] + ' value="relevance">relevance</option><option ' + sortsboo[2] + ' value="new">new</option><option ' + sortsboo[3] + ' value="top">top</option><option ' + sortsboo[4] + ' value="comments">comments</option></select>')
			.append('<span class="label color-mode-tool">From</>')
			.append('<select id="time"><option ' + fromboo[0] + ' value="all">all</option><option ' + fromboo[1] + ' value="hour">hour</option><option ' + fromboo[2] + ' value="day">day</option><option ' + fromboo[3] + ' value="week">week</option><option ' + fromboo[4] + ' value="month">month</option><option ' + fromboo[5] + ' value="year">year</option></select>')
			.append('<span class="label color-mode-tool">Limit</>')
			.append('<select id="limit"><option ' + limboo[0] + ' value="10">10</option><option ' + limboo[1] + ' value="25">25</option><option ' + limboo[2] + ' value="50">50</option><option ' + limboo[3] + ' value="100">100</option></select>')
			.append('<button id="go">Go!</button>')
			
           
        ;

		$("#go").click(function() {

			$body.append('<img id="load" src="icons/sspiffygif_176x176.gif"></img>')	

			var sub = $("#subreddit").val();
			var que = $("#query").val();
			var sterm = "/search.json?q=url%3Aimgur.com+AND+" + que;
			var subr = "";
			if(sub != ""){
				
				subr = "r/" + sub;
				
			}
			
			var surl = "https://www.reddit.com/" + subr + sterm + "&restrict_sr=on&sort=" + $("#relev").val() + "&t=" + $("#time").val() + "&limit=" + $("#limit").val();
		 	//console.log(surl);
			$.getJSON(surl, function(json){ 
				app.images = json.data.children;
			}).done(function(){ app.makeQuilt(); });
			
		})	
        $body.append($quiltScrollWrapper);
        $quiltScrollWrapper.append($quiltWrapper);
        $quiltWrapper.append($quilt);
        $quilt.append($images);

        $quilt.find('img').each(function(i){
            var $img = $(this);
            $img.wrap('<div class="image" data-zoom="1" data-id="' + $img.attr('data-id') + '"><a href="' + $img.attr('ref') + '" target="_blank"></a></div>');
        });

        app.setupIndividualZooms();

        $body.append('<div class="drag-helper"><div class="message">Add images...</div></div>');

        $body.css('visibility', 'visible');
    };

    app.setupIndividualZooms = function() {
        $('.image .zoom').empty().append(
            $('<input type="range" min="100" max="300" value="120">').on('change input', function(e){
                $(e.target).parents('.image').find('img').css('-webkit-transform', 'scale(' + (e.target.value / 100) + ') translateZ(0)');
            })
        );
    };

 
    app.decideToShowLoading = function() {
        setTimeout(function(){
            if (!app.images.length) {
                $('.update-outer').addClass('show');
            }
        }, 50);
    };
	


