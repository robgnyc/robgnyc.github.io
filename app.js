$(document).ready(function() {
function isHashPresent() {
  if(window.location.hash == "") {
    return false;
  } else {
    return true;
  }
}

if(isHashPresent()) {
  $('.sign-in-view').hide();
    var accessToken = window.location.hash.replace('#access_token=', '');
    var url = 'https://api.instagram.com/v1/users/self/media/recent/?access_token=' + accessToken;

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

          $.panelslider($('#my-link'));
    			$('#my-panel').append(imageEl);
    		})
    	}
    })
    

 
	} else {
 	
  	$('.image-results-view').hide();
	}
// invoke the panel slider
// $('#my-link').panelslider();
});