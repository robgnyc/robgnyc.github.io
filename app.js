function isHashPresent() {
  if(window.location.hash == "") {
    return false;
  } else {
    return true;
  }
}

if(isHashPresent()) {
  $('.sign-in-view').hide();

  navigator.geolocation.getCurrentPosition(function(pos){
    var lat = pos.coords.latitude;
    var long = pos.coords.longitude;
    var accessToken = window.location.hash.replace('#access_token=', '');
    var url = 'https://api.instagram.com/v1/tags/newyork/media/recent?access_token=' + accessToken;
    // var url = "https://api.instagram.com/tags/nofilter/media/recent?access_token=" + accessToken;
    // var url = url + "&lat=" + lat;
    // var url = url + "&lng=" + long;

    $.ajax( {
    	url: url,
    	method: "GET",
    	dataType: "jsonp",
    	success: function(response) {
    		var data = response.data;

        console.log(data);

    		data.forEach(function(data) {
    			var url = data.images.thumbnail.url;
    			var imageEl = $('<img src="' + url +'" />');

    			$('.images').append(imageEl);
    		})
    	}
    })
    // https://api.instagram.com/v1/users/self/follows?access_token=ACCESS-TOKEN

  	})
	} else {
 	
  	$('.image-results-view').hide();
	}