$(document).ready(function() {
	function initialize() {
		var input = document.getElementById('searchTextField');
        var autocomplete = new google.maps.places.Autocomplete(input, { types: ['(cities)'], language: ['eu'] });
        google.maps.event.addListener(autocomplete, 'place_changed', function() {
            var place = autocomplete.getPlace().formatted_address.split(', ')[0];
            document.getElementById('searchTextField').value = place;
        });
    }
	google.maps.event.addDomListener(window, 'load', initialize);
   
	function getWeather(city) {
		const key = '224e0c3868331db50d9d7b56b3ab17ac';
		const url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=${key}`;
		jQuery.ajax({
		    url: url,
		    type: "GET",
		    dataType: "jsonp",
		    async: false,
    		success: function (data) {

		    	$(".city").html(data.name + ", " + data.sys.country);
		    	const a = data.main.temp;
		    	$(".metric_temp").html('K');
		    	if(prev === 'k') {
		    		$(".temp").html(Math.round(a));
		    	} else if(prev === 'c') {
		    		$(".temp").html(Math.round(a - 273));
		    		$(".metric_temp").html('&deg;C');
		    	} else {
		    		$(".temp").html(Math.round((a - 273) *9/5 + 32));
		    		$(".metric_temp").html("F");
		    	}
		    	$('img').attr('src', `http://openweathermap.org/img/w/${data.weather[0].icon}.png`);
        		writeDate();

        	},
        	error: function () {
        		document.getElementById('searchTextField').value = 'Yay! Wrong city!';
        	}
 	    });
	}
	
	function writeDate() {
		let d = new Date();
		const monthes = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
		$('.date').html(monthes[d.getMonth()] + ", " + d.getDate());
	}

	$('.submit').click(function () {
		var city = $('#searchTextField').val();
		getWeather(city);
	});
	
	function metricTemp(prev) {
		if(prev === 'k') {
			$(".metric_temp").html('K');
		} else if (prev === 'c') {
			$(".metric_temp").html('&deg;C');
		} else if (prev === 'f') {
			$(".metric_temp").html("F");
		}
	}

	let prev = $('.metric').val();
	$(".metric").change(function() {
		const current = $('.metric').val();
        metric(prev, current);
        prev = current;
        metricTemp(current);
    });

	function metric(prev, current) {
		const degree = +$('.temp').html();
		if(prev === 'k' && current === 'c') {
			$('.temp').html(degree - 273);
		} 
		if(prev === 'k' && current === 'f') {
			$('.temp').html(Math.round((degree - 273) * 9/5 + 32));
		}
		if(prev === 'c' && current === 'k') {
			$('.temp').html(degree + 273);
		}
		if(prev === 'c' && current === 'f') {
			$('.temp').html(Math.round(degree * 9/5 + 32));
		}
		if(prev === 'f' && current === 'c') {
			$('.temp').html(Math.round((degree - 32) * 5/9));
		}
		if(prev === 'f' && current === 'k') {
			$('.temp').html(Math.round((degree - 32) * 5/9 + 273));
		}
	}

	$.get('http://ip-api.com/json', function(response) {
    	getWeather(response.city);
	}, "jsonp");
	

})