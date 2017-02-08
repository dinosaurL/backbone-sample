define(function (require) {
	'use strict';

	var Edit = require('publish/views/story/edit/Edit');

	var MapEdit = Edit.extend((typeof google === 'object' && typeof google.maps === 'object') ? {

		start: function () {
			Edit.prototype.start.apply(this, arguments);
			this.view.map.setOptions({
				draggable: true,
				zoomControl: true,
				disableDoubleClickZoom: false,
				scrollwheel: true
			});
		},

		save: function (model) {
			this.view.model.set({
				mapSettings: {
					zoom: this.view.map.getZoom(),
					center: this.view.map.getCenter()
				}
			});

			this.view.map.setOptions({
				draggable: false,
				zoomControl: false,
				disableDoubleClickZoom: true,
				scrollwheel: false
			});
			Edit.prototype.save.apply(this, arguments);
		}

	}: {});

	return MapEdit;

});
