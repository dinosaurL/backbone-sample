define(function (require) {

	'use strict';

	var Marionette = require('marionette'),
		Story = require('publish/views/story/Story'),
		MapEdit = require('publish/views/story/edit/MapEdit');

	var MapStory = Story.extend({

		template: '#map-story-tpl',

		initialize: function() {
			Story.prototype.initialize.apply(this, arguments);
			// Extend this with the superclass modelEvents
			_.extend(this.modelEvents, Story.prototype.modelEvents);
			this.edit = new MapEdit({ view: this });
		},

		serializeData: function () {

			var mapOpts = {};

			if (this.model.has('mapSettings')) {

				if (this.model.get('mapSettings').zoom) {
					mapOpts.mapZoom = this.model.get('mapSettings').zoom;
				}

				if (this.model.get('mapSettings').center) {
					mapOpts.mapCenterLat = this.model.get('mapSettings').center.lat;
					mapOpts.mapCenterLng = this.model.get('mapSettings').center.lng;
				}

				if (this.model.get('mapSettings').markers) {
					mapOpts.mapMarkers = this.model.get('mapSettings').markers.slice(0,80);
				}

			}

			return _.extend({}, Story.prototype.serializeData.call(this), mapOpts);
		},

		onDomRefresh: function () {
			//	added check for if google.maps is available or not
			if (typeof google === 'object' && typeof google.maps === 'object') {
				this.map = new google.maps.Map(this.$el.find(".googleMap")[0], this.model.get("mapDefaults"));
				var self = this;
				var mapSettings = this.model.get("mapSettings");

				if  (!_.isEmpty(mapSettings)) {

					// for now, center and zoom attributes are not mandatory,
					// particularly in cases when there're more than one
					// markers, when these values should be determined by
					// google maps automatically
					if (mapSettings.center) {
						this.map.setOptions({
							 center : mapSettings.center
						});
					};
					if (mapSettings.zoom) {
						this.map.setOptions({
							 zoom : mapSettings.zoom
						});
					};

	    			_.forEach(mapSettings.markers, function(m) {

			        	var marker = new google.maps.Marker({
				            map: self.map,
				            position: m.position,
				            title:  m.title,
		 					icon : { url : (m.icon || "/core/webcore/img/icons/googleMarkers/googlemarker-default.png")}
				        });

			        	if (m.url) {
				       	 	google.maps.event.addDomListener(marker, 'click', function() {
				            	window.location = m.url;
				        	})
			       	 	};

		         	});

				}

				this.listenTo(app.vent, 'story:change:size', _.bind(function (element) {
					google.maps.event.trigger($(element).find(".story-content")[0], "resize");
				}, this));
			}
			else {
				this.$el.find(".googleMap")
					.addClass("mapUnavailable")
					.text("Sorry, maps have been disabled due to regional restrictions outside of our control");
			}
		}

	});
	return MapStory;

});
