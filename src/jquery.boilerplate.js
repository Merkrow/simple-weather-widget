;( function( $, window, document, undefined ) {

	"use strict";


		
		var pluginName = "weatherPlugin",
			defaults = {
				city: null,
				prev: 'k',
				key: '224e0c3868331db50d9d7b56b3ab17ac',
				allWeather: {
					name: null,
					temp: null,
					weather: null,
					country: null
				}
			};

		var autocompleteOptions = {
		    serviceUrl: "http://gd.geobytes.com/AutoCompleteCity?callback=?",
		    dataType: 'jsonp',
		    paramName: 'q',
		    transformResult: responce => 0|| {suggestions: responce},
		    minChars: 3,
		    deferRequestBy: 0
		};

		function Plugin ( el, options ) {
		    this.el = $(el);
		    this._name = pluginName + this.el.index();
		    this.settings = $.extend( {}, defaults, this._name );
		    this._defaults = defaults;
		    this.init();
		};

		$.fn[ pluginName ] = function( options ) {
			this.each( function() {
				if ( !$.data( this, "plugin_" + pluginName ) ) {
					$.data( this, "plugin_" +
						pluginName, new Plugin( this, options ) );
				}
			});

			return this;
		};

		$.extend(Plugin.prototype, {

			init: function() {
				this._run();
			},

			_run: function () {
					if(this.settings.city === null) {
						this._defaultCity();
					}
					let currLocation = this._setCity();
					this._setLocation(currLocation);
					
					this._changeMetric();
					
					
					this.settings.prev = $('.metric').val();
					this._metricTemp(this.settings.prev);
				
			},

			_getWeatherRender: function(city) {
				let self = this;
				let myvar;
				const url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=${this.settings.key}`;
				jQuery.ajax({
			        url: url,
			        type: "GET",
			        dataType: "jsonp",
			        async: false,
			        success: function (data) {
			        	self._render(data);
		        	},
		        	error: function () {
		        		self.el.find('.searchTextField').html('Yay! Wrong city!')
		        	}
	 	    	});

			},

			_render: function(data) {
				const current = this.settings.prev;
				    	$(".city").html(data.name + ", " + data.sys.country);
				    	const a = data.main.temp;
				    	$(".metric_temp").html('K');
				    	if(current === 'k') {
				    		$(".temp").html(Math.round(a));
				    	} else if(current === 'c') {
				    		$(".temp").html(Math.round(a - 273));
				    		$(".metric_temp").html('&deg;C');
				    	} else {
				    		$(".temp").html(Math.round((a - 273) *9/5 + 32));
				    		$(".metric_temp").html("F");
			    		}
				    	$('img').attr('src', `http://openweathermap.org/img/w/${data.weather[0].icon}.png`);

		        		this._writeDate();
		        		this._changeBgTemp(current);
		        		this._currentBg(data);
			},
	
			_setLocation: function(data) {
      			this.settings.city = data.value;
  			},

			_setCity: function () {
		    	var inp = this.el.find(".searchTextField");
		    	const self = this;
		    	return  new Promise(resolve => {
		    		inp.keyup(function (e) {

		        	if ((e.keyCode == 13 && e.target.value)) {
		        		resolve (self._getWeatherRender(e.target.value.split(", ")[0]));
		           		 
		           		}        
		       		});

		       		if($.fn.autocomplete) {
						autocompleteOptions.onSelect = resolve;
          				inp.autocomplete(autocompleteOptions);
		   		};
		   	});
		    },

		    _currentBg: function(data) {
		    	const current = this.el.find('body');
		    	const weather = data.weather[0].description;
		    	console.log(data.weather[0].description);
		    	if(weather === 'broken clouds') {
		    		current.css('background', "url('../img/cloudy.jpg')");
		    	} else if(weather === 'mist') {
		    		current.css('background', "url('../img/mist.jpg')");
		    	} else if(weather === 'clear sky' || weather === 'few clouds'
		    		|| weather === 'scattered clouds') {
		    		current.css('background', "url('../img/sunny.jpg')");
		    	} else if(weather === 'light intensity drizzle' || weather === 'rain') {
		    		current.css('background', "url('../img/rainy.jpg')");
		    	} else {
		    		current.css('background', "url('../img/snow.jpg')");
		    	}

		    },

		    _changeBgTemp: function(prev) {
		    	let current = +$('.temp').html();
		    	console.log(current);
		    	if(prev === 'k') {
		    		current = current - 273;
		    	} else if(prev === 'f') {
		    		current = Math.round((current - 32) * 5/9);
		    	}
		    	if(current < 5) {
		    		this.el.find('.result').css('background-color', '#44a5dd');
		    	} else if(current > 25) {
		    		this.el.find('.result').css('background-color', '#f01a1a');
		    	} else {
		    		this.el.find('.result').css('background-color', '#F5DB5C');
		    	}
		    },

			_changeMetric: function() {
				const self = this;
				$(".metric").change(function() {
					const current = $('.metric').val();
				    self._metricRender(self.settings.prev, current);
				    self.settings.prev = current;
				    self._metricTemp(current);
				});
			},

			_metricTemp: function(prev) {
				if(prev === 'k') {
					$(".metric_temp").html('K');
				} else if (prev === 'c') {
					$(".metric_temp").html('&deg;C');
				} else if (prev === 'f') {
					$(".metric_temp").html("F");
				}
			},

			_writeDate: function() {
				let d = new Date();
				const monthes = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
				$('.date').html(monthes[d.getMonth()] + ", " + d.getDate());
			},

			_metricRender: function (prev, current) {

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
			},

			_defaultCity: function() {
				let self = this;
				$.get('http://ip-api.com/json', function(response) {
			    	self._getWeatherRender(response.city);
				}, "jsonp");
			}

			

		})
		
} )( jQuery );
