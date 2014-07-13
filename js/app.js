
$(function() {

	var lat = "",
			lng = "",
			appendeddatahtml = "",
			arguments = "",
			str = "",
			newstr = "",
			phone = "",
			rating = "",
			icon = "",
			address = ""
			description = "";
	
	$("#query").click(function(){
		$(this).val("");
	});
	
	$("#query").blur(function(){
		if ($(this).val() != "") {
			$(this).addClass("focus");
		} else {
			$(this).removeClass("focus");
		}
	});
	
	$("#searchform").submit(function(event){
		event.preventDefault();
    lat = 40.5629381; //location.coords.latitude;
    lng = -74.3073397;  //location.coords.longitude;

		if (!lat) {
			navigator.geolocation.getCurrentPosition(getLocation);
			getVenues();
		} else {
			getVenues();
		}
	});
	
	function getLocation(location) {
    lat = location.coords.latitude;
    lng = location.coords.longitude;
	}
	
	function getVenues() {
		$.ajax({
	  		type: "GET",
	  		url: "https://api.foursquare.com/v2/venues/explore?ll="+lat+","+lng+"&client_id=JSJTYKWKAWAA4TTMO13HXJJFLDQIRBPCFGO2RIQYFTZXRTTQ&client_secret=3UNLCY42OIDD4QELNWQDLIFPLI3C3DTTPBMLFALLZORNO3Y1&v=20130619&query="+$("#query").val()+"",
	  		success: function(data) {
				$("#venues").show();
				var dataobj = data.response.groups[0].items;
				$("#venues").html("");
				
				// Rebuild the map using data.
				var myOptions = {
					zoom:11,
					center: new google.maps.LatLng(lat,lng),
					mapTypeId: google.maps.MapTypeId.ROADMAP,
					panControl: false
				};

				var map = new google.maps.Map(document.getElementById('map'), myOptions);

				// Build markers and elements for venues returned.
				$.each( dataobj, function() {
					if (this.venue.categories[0]) {
						str = this.venue.categories[0].icon.prefix;
						newstr = str.substring(0, str.length - 1);
						icon = newstr+this.venue.categories[0].icon.suffix;
						console.log(icon);
					} else {
						icon = "";
					}
					
					if (this.venue.contact.formattedPhone) {
						phone = "Phone: "+this.venue.contact.formattedPhone+'<br>';
					} else {
						phone = "";
					}

					if (this.venue.description) {
						description = this.venue.description;
					} else {
						description = "";
					}

					if (this.venue.location.address) {
						address = '<p class="subinfo">'+this.venue.location.address+'<br>'+this.venue.location.city+', '+this.venue.location.state+' '+this.venue.location.postalCode+'<br>';
					} else {
						address = "";
					}
					
					if (this.venue.rating) {
						rating = '<span class="rating">'+this.venue.rating+'</span>';
					}
					
					appendeddatahtml = '<div class="venue"><h2><span>'+this.venue.name+'<img class="icon" src="'+icon+'"> '+rating+'</span></h2>'+description+address+phone+'</p><p><strong>Total Checkins:</strong> '+this.venue.stats.checkinsCount+'</p></div>';
					$("#venues").append(appendeddatahtml);
					
					// Build markers
					var markerImage = {
						url: 'images/pin2.png',
						scaledSize: new google.maps.Size(24, 24),
						origin: new google.maps.Point(0,0),
						anchor: new google.maps.Point(24/2, 24)
					},

					markerOptions = {
						map: map,
						position: new google.maps.LatLng(this.venue.location.lat, this.venue.location.lng),
						title: this.venue.name,
						animation: google.maps.Animation.DROP,
						icon: markerImage,
						optimized: false
					},

					marker = new google.maps.Marker(markerOptions);

					var infowindow = new google.maps.InfoWindow({
					  content: '<div class="noscrollbar"><div class="highlight">' + this.venue.name + '</div><div>' + address + phone + '</div></div>'
				  });

					google.maps.event.addListener(marker,'click',function() {
					  map.setZoom(18);
					  map.setCenter(marker.getPosition());
					  infowindow.open(map, marker);
				  });

				});
			}
		});
	}
	
	function initialize() {
		var initialLocation,
				newyork = new google.maps.LatLng(40.69847032728747, -73.9514422416687),
				unitedStates = new google.maps.LatLng(38.962612, -99.080879),
				browserSupportFlag =  new Boolean();

		$("#venues").hide();

	  var myOptions = {
	    zoom: 5,
	    mapTypeId: google.maps.MapTypeId.ROADMAP,
			panControl: false
	  };

		var map = new google.maps.Map(document.getElementById('map'), myOptions);

	  // Try W3C Geolocation (Preferred)
	  if(navigator.geolocation) {
	    browserSupportFlag = true;
	    navigator.geolocation.getCurrentPosition(function(position) {
	      initialLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
	      map.setCenter(initialLocation);
	    }, function() {
	      handleNoGeolocation(browserSupportFlag);
	    });
	  }
	  // Browser doesn't support Geolocation
	  else {
	    browserSupportFlag = false;
	    handleNoGeolocation(browserSupportFlag);
	  }

	  function handleNoGeolocation(errorFlag) {
	    if (errorFlag == true) {
	      alert("Geolocation service failed. We've placed you in New York.");
	      initialLocation = newyork;
	    } else {
	      alert("Your browser doesn't support geolocation. We've placed you in United States.");
	      initialLocation = unitedStates;
	    }

	    map.setCenter(initialLocation);
	  }

	}
	
	initialize();
	
});