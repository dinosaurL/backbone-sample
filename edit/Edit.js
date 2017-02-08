define(function (require) {
	'use strict';

	var marionette = require('marionette');

	var Edit = Backbone.Class.extend({

		start: function () {
        	app.publishModel.set({
				story: {
					id: this.view.model.get('id'),
					viewCid: this.view.cid,
					imageFileId: this.view.model.get('imageFileId'),
					button: this.view.model.isButtonStory(),
					video: this.view.model.isVideoStory(),
					entityId: this.view.model.get('entityId'),
					entityTypeId: this.view.model.get('entityTypeId'),
					hyperlinkEntityId: this.view.model.get('hyperlinkEntityId'),
					storyGroup: {
						viewCid: this.view.storyGroup.cid,
						cid: this.view.storyGroup.model.cid,
						pageVersionStoryGroupId: this.view.storyGroup.model.get('pageVersionStoryGroupId')
					}
				}
			});

			this.view.$el.draggable('disable');
			this.view.$el.find('div.delete-story').removeClass('hide');
        	this.view.$el.find('div.story-content').addClass('editing');
		},

		stop: function () {
        	app.publishModel.resetStory();
        	if (CKEDITOR) { cleanCKEDITOR(); }
			this.view.$el.find('div.delete-story').addClass( 'hide');
			this.view.$el.find('div.story-content').attr('contenteditable', 'false');
			this.view.storyGroup.initDraggable(this.view);
			this.view.model.trigger('exitEditMode');
			app.vent.trigger('story:stop:edit');
		},

		save: function (model) {
			// Right now we always close the edit mode right after we make a
			// save. This is the desired behaviour at the moment but it could
			// be changed.
			var save = this.view.model.save();
			save.always(_.bind(function () {
				this.stop();
			}, this))
			return save;
		}

	});

	function cleanCKEDITOR() {

		if (CKEDITOR.instances) {
			// IE8 requires that we call blur on each instance of CKEDITOR
			// otherwise the toolbar remains in place
			for(var id in CKEDITOR.instances) {
				CKEDITOR.instances[id].focusManager.blur();
			}
			_.invoke(CKEDITOR.instances, 'destroy');
			for(var id in CKEDITOR.instances) {
				delete CKEDITOR.instances[id];
			}
		}

		if (CKEDITOR.filter.instances) {
			for(var id in CKEDITOR.filter.instances) {
				delete CKEDITOR.filter.instances[id];
			}
		}

		CKEDITOR.fire('reset');

	}

	return Edit;

});
