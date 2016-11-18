;( function( $, window, document, undefined ) {

	"use strict";
		
		var pluginName = "weatherPlugin",
			defaults = {
				city: null,
				prev: 'k',
				key: '224e0c3868331db50d9d7b56b3ab17ac',
				tags: {
					body: null,
					search: null,
					temperature: null,
					metricTemperature: null,
					image: null,
					city: null,
					metricSelect: null,
					date: null,
					result: null
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

					const tag = this.settings.tags;
					tag.body = this.el.find('body');
					this._renderHTML();
					tag.search = this.el.find(".searchTextField");
					tag.temperature = this.el.find('.temp');
					tag.metricTemperature = this.el.find('.metric_temp');
					tag.image = this.el.find('.image');
					tag.city = this.el.find('.city');
					tag.metricSelect = this.el.find('.metric');
					tag.date = this.el.find('.date');
					tag.result = this.el.find('.result');

					let currLocation = this._setCity(tag.search);
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
		        	}
	 	    	});
			},

			_render: function(data) {
				const current = this.settings.prev;
				    	this.settings.tags.city.html(data.name + ", " + data.sys.country);
				    	let a = data.main.temp;
				    	let m;

				    	switch (current) {
				    		case 'k':
				    			a = Math.round(a);
				    			m = 'K';
				    			break;
				    		case 'c':
				    			a = Math.round(a - 273);
				    			m = '&deg;C';
				    			break;
				    		case 'f':
				    			a = Math.round((a - 273) *9/5 + 32);
				    			m = 'F';
				    			break;
				    	}
				    	this.settings.tags.temperature.html(a);
				    	this.settings.tags.metricTemperature.html(m);
				    	this.settings.tags.image.attr('src', `http://openweathermap.org/img/w/${data.weather[0].icon}.png`);
		        		this._writeDate();
		        		this._changeBgTemp(current);
		        		this._currentBg(data);
			},
			
			_renderHTML: function() {
				let template = `<div class="result">
		            <div class="search">
		           		<input class="searchTextField" type="text" size="50" placeholder="Enter a location" autocomplete="on" autofocus>
		            </div>
		            <div class="main">
		                <div class="date"></div>
		                <div class="city"></div> 
		                <div class="weather_image"><img class='image' src='' alt=""></div>
		                <span class='wrap'><span class="temp"></span><span class="metric_temp"></span></span>
		                <select name="metric" class="metric">
		                    <option value="k">Kelvin</option>
		                    <option value="c">Celsius</option>
		                	<option value="f">Fahrenheit</option>
		                </select>
		            </div>
		        </div>`;
        	this.settings.tags.body.html(template);
			},

			_setLocation: function(data) {
      			this.settings.city = data.value;
  			},

			_setCity: function (inp) {
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
		    	const current = this.settings.tags.body;
		    	let weather = data.weather[0].description;
		    	weather = weather !== 'cloudy' && weather !== 'sunny' && weather !== 'light rain' && weather !== 'mist' && weather !== 'broken clouds' ? 'snow' : weather;
		    	weather = weather === 'broken clouds' ? 'cloudy' : weather;
		    	weather = weather === 'clear sky' || weather === 'few clouds' || weather ===  'scattered clouds' ? 'sunny' : weather;
		    	weather = weather === 'mist' ? weather : weather;
		    	weather = weather === 'light rain' ? 'rainy' : weather;
		    	current.css('background', `url('../img/${weather}.jpg')`);
		    },

		    _changeBgTemp: function(prev) {
		    	let current = +this.settings.tags.temperature.html();
		    	current = prev === 'k' ? current - 273 : prev === 'f' ? Math.round((current - 32) * 5/9) : current;
		    	let color = current < 5 ? '#44a5dd' : current > 25 ? '#f01a1a' : '#F5DB5C';
		    	this.settings.tags.result.css('background-color', color);
		    },

			_changeMetric: function() {
				const self = this;
				this.settings.tags.metricSelect.change(function() {
					const current = self.settings.tags.metricSelect.val();
				    self._metricRender(self.settings.prev, current);
				    self.settings.prev = current;
				    self._metricTemp(current);
				});
			},

			_metricTemp: function(prev) {
				const current = this.settings.tags.metricTemperature;
				prev === 'k' ? current.html('K') : prev === 'c' ? current.html('&deg;C') : current.html('F');
			},

			_writeDate: function() {
				let d = new Date();
				const monthes = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
				this.settings.tags.date.html(monthes[d.getMonth()] + ", " + d.getDate());
			},

			_metricRender: function (prev, current) {
				let degree = +this.settings.tags.temperature.html();
				switch(prev) {
					case 'k':
						degree = current === 'c' ? degree - 273 : Math.round((degree - 273) * 9/5 + 32);
						break;
					case 'c':
						degree = current === 'k' ? degree + 273 : Math.round(degree * 9/5 + 32);
						break;
					case 'f':
						degree = current === 'c' ? Math.round((degree - 32) * 5/9) : Math.round((degree - 32) * 5/9 + 273);
						break;
				}
				this.settings.tags.temperature.html(degree);
			},

			_defaultCity: function() {
				let self = this;
				$.get('http://ip-api.com/json', function(response) {
			    	self._getWeatherRender(response.city);
				}, "jsonp");
			}

		})
} )( jQuery );