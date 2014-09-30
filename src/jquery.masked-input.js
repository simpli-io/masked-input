// the semi-colon before function invocation is a safety net against concatenated
// scripts and/or other plugins which may not be closed properly.
;(function ( $, window, document, undefined ) {

		// Create the defaults once
		var pluginName = "maskedInput",
			defaults = {
				propertyName: "value"
			};

		// The actual plugin constructor
		function MaskedInput ( element, options ) {
			this.element = element;
			this.settings = $.extend( {}, defaults, options );
			this._defaults = defaults;
			this._name = pluginName;
			this.init();
		}

		// Avoid MaskedInput.prototype conflicts
		$.extend(MaskedInput.prototype, {
			init: function () {
				console.log("Initializing simpli masked input.");
			}
		});

		// A really lightweight plugin wrapper around the constructor,
		// preventing against multiple instantiations
		$.fn[ pluginName ] = function ( options ) {
			this.each(function() {
				if ( !$.data( this, "simpli" + pluginName ) ) {
					$.data( this, "simpli" + pluginName, new MaskedInput( this, options ) );
				}
			});

			// chain jQuery functions
			return this;
		};

})( jQuery, window, document );