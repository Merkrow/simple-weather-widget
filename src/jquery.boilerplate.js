/*
 *  jquery-boilerplate - v4.0.0
 *  A jump-start for jQuery plugins development.
 *  http://jqueryboilerplate.com
 *
 *  Made by Zeno Rocha
 *  Under MIT License
 */
// the semi-colon before function invocation is a safety net against concatenated
// scripts and/or other plugins which may not be closed properly.
;( function( $, window, document, undefined ) {

	"use strict";

		// undefined is used here as the undefined global variable in ECMAScript 3 is
		// mutable (ie. it can be changed by someone else). undefined isn't really being
		// passed in so we can ensure the value of it is truly undefined. In ES5, undefined
		// can no longer be modified.

		// window and document are passed through as local variable rather than global
		// as this (slightly) quickens the resolution process and can be more efficiently
		// minified (especially when both are regularly referenced in your plugin).

		// Create the defaults once
		var pluginName = "weatherPlugin",
			defaults = {

				propertyName: "value"
			};

		function getCity() {
			const city = $(input).val(function) {

			}
		}
		function getWeather(city) {
			const key = '224e0c3868331db50d9d7b56b3ab17ac';
			const url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=${key}`;
			jQuery.ajax({
		        url: url,
		        type: "GET",
		        dataType: "jsonp",
		        async: false,
		        success: function (data) {
		        	$(".country").html(data.sys.country);
		            $(".city").html(data.name);
		            $(".temp").html(Math.round(data.main.temp));
		            $(".wind").html(data.wind.speed);
		            $("weather_icon").html(data.weather.icon);
        		}
 	    	});
		}


		// A really lightweight plugin wrapper around the constructor,
		// preventing against multiple instantiations
		$.fn[ pluginName ] = function( options ) {
			return this.each( function() {
				if ( !$.data( this, "plugin_" + pluginName ) ) {
					$.data( this, "plugin_" +
						pluginName, new Plugin( this, options ) );
				}
			} );
		};
		
} )( jQuery, window, document );
