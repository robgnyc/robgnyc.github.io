$(document).ready(function() {
function isHashPresent() {
  if(window.location.hash == "") {
    return false;
  } else {
    return true;
  }
}

// set fireb so it can be used in all functions
var fireb = new Firebase('https://supersizeme.firebaseIO.com');

if(isHashPresent()) {
  getImages();
  $('#section0').remove();
  $('#infoMenu').show();

    var accessToken = window.location.hash.replace('#access_token=', '');
    var url = 'https://api.instagram.com/v1/users/self/media/recent/?access_token=' + accessToken;

    $.ajax( {
    	url: url,
    	method: "GET",
    	dataType: "jsonp",
    	success: function(response) {
    		
        var data = response.data;

        //slide the header down to show the images
       $('#header').addClass('active');

    		data.forEach(function(data) {
    			var thumbUrl = data.images.thumbnail.url;
          var standardUrl = data.images.standard_resolution.url;
          var instaID = data.id;
    			var imageEl = $('<img class="thumb" data-id="' + instaID + '"data-url="' + standardUrl + '" src="' + thumbUrl +'" />');
          
    			$('#header').append(imageEl);


    		})
    	}
    })
      
 
	} else {
 	
  	$('#section1').hide();
    $('#infoMenu').hide();
	}


  $(document).on('click', '.thumb', function(e) {



        if(!$(this).hasClass('active')) {
     
          // add firebase code to add image location to database
           
            var url = $(this).data("url");
            var id = $(this).data("id");

            fireb.child('images').push({
              src: url,
              id: id
            })
           
          }

          });

  function getImages() {
     var x = 0;
     // console.log(x);

    fireb.child('images').on('value', function(results) {
      
      $.fn.fullpage.destroy('all');

         $("#section1").empty();
          
         // $( "div#section1" ).replaceWith('<div class="section" id="section1" data-id="' + key + '"style="background-image: url(' + image.src + ')">

        var values = results.val();
        
        for(var key in values) {
          
          //new code to test number of images
        var ref = fireb.child('images');
        ref.once("value", function(snapshot) {
        var numImages = snapshot.numChildren();

        x = numImages;


       
        var image = values[key];

        // have to take a different approach if only one image and make slide background of section rather than add a slide to section

        if (numImages<2) {
            // console.log(numImages);
          $( "div#section1" ).replaceWith('<div class="section oneslide" id="section1" data-id="' + key + '"style="background-image: url(' + image.src + ')">');
          } 
          else {
          var container = 
          $('<div class="slide" data-id="' + key + '" style="background-image: url(' + image.src + ');"></div>');

          container.appendTo('#section1');
          }
          
          var thumbID = image.id;
          $('*[data-id="' + thumbID + '"]').addClass("active");
        

        });
           


        
        }
        // console.log(x-1);
         $('#fullpage').fullpage({
        // anchors: ['firstPage'],
        sectionsColor: ['#666'],
        css3: true
      });
          $.fn.fullpage.moveTo(0, x-1);

    })

  }

  // delete action
$(document).on('click', '.slide, .oneslide', function(e) {
           
            $('#header').removeClass("active");
            var imgID = $(this).data("id");
            mscConfirm("Delete?",function(){
            deleteImg(imgID);
            $('#header').addClass("active");
            });
           
          })

// delete function
 function deleteImg(imgID) {

    var ref = new Firebase('https://supersizeme.firebaseIO.com/images/' + imgID);
    // find the instagram id
    ref.once("value", function(snapshot) {
    var data = snapshot.val();

    var thumbID = data.id;
     $('*[data-id="' + thumbID + '"]').removeClass("active");
    })
   
    ref.remove();
    
  }
      // initialize fullpage
      $('#fullpage').fullpage({
        sectionsColor: ['#666'],
        css3: true
      });


      // function for toggling header
      $("#showHeader").on('click', function() {
          var head = $("#header");
         if (!head.hasClass("active")) {
        $(head).addClass("active");
        $(this).html("Hide Instagram Feed");
      }
      else {
        $(head).removeClass("active");
        $(this).html("Show Instagram Feed");
      }
      })
 

 
});