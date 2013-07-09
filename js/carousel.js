/*
* @package manifest file for simple carousel
* @version 0.1
* @author Joker (http://www.simplemachines.org/community/index.php?action=profile;u=226111)
* @copyright Copyright (c) 2012, Siddhartha Gupta
* @license http://www.mozilla.org/MPL/MPL-1.1.html
*/

/*
* Version: MPL 1.1
*
* The contents of this file are subject to the Mozilla Public License Version
* 1.1 (the "License"); you may not use this file except in compliance with
* the License. You may obtain a copy of the License at
* http://www.mozilla.org/MPL/
*
* Software distributed under the License is distributed on an "AS IS" basis,
* WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
* for the specific language governing rights and limitations under the
* License.
*
* The Initial Developer of the Original Code is
*  Joker (http://www.simplemachines.org/community/index.php?action=profile;u=226111)
* Portions created by the Initial Developer are Copyright (C) 2012
* the Initial Developer. All Rights Reserved.
*
* Contributor(s):
*/

(function() {
	$.fn.carousel = function(args) {
		args = args || {};
		var defaults = {
			ref : this,
			carouselTimer : 2000,
			carouselTimeOut : null,
			automatic : false
		};
		opts = $.extend({}, defaults, args);
		return cBrain.init(opts);
	};
	var cBrain = {
		args : {},
		init : function(params) {
			var defaults = {
				initCount : null,
				currCount : 1,
				direction : 'right'
			}, innerRef = this;

			this.args = $.extend({}, defaults, params);
			this.args.initCount = params.ref.children().length;
			this.clearCarouselTimer();

			$(this.args.ref).parent().find('.arrowLeft').click(function() {
				innerRef.moveCarouselLeft();
			});

			$(this.args.ref).parent().find('.arrowRight').click(function() {
				innerRef.moveCarouselRight();
			});

			$(this.args.ref).bind('mouseover', function() {
				innerRef.pauseCarousel();
			}).bind('mouseout', function() {
				innerRef.resumeCarousel();
			});
			if(this.args.automatic === true) {
				this.moveCarouselRight(true);
			}
		},
		moveCarouselLeft : function(autoScroll) {
			if(this.args.currCount == 1) {
				this.clearCarouselTimer();
				this.args.direction = 'right';
				this.moveCarouselRight(true);
				return;
			} else {
				this.args.direction = 'left';
				this.args.currCount--;
				var wid = $(this.args.ref).children().width();
				var marg = $(this.args.ref).css("margin-left");
				total = parseInt(marg) + parseInt(wid);
				$(this.args.ref).animate({
					'margin-left' : total + "px"
				}, this.args.carouselTimer);
			}

			if(this.args.automatic === true) {
				var e = this;
				this.clearCarouselTimer();
				this.args.direction = 'left';
				this.args.carouselTimeOut = setTimeout(function() {
					e.moveCarouselLeft(true);
				}, this.args.carouselTimer);
			}
		},
		moveCarouselRight : function(autoScroll) {
			if(this.args.currCount >= this.args.initCount) {
				this.clearCarouselTimer();
				this.args.direction = 'left';
				this.moveCarouselLeft(true);
				return;
			} else {
				this.args.direction = 'right';
				this.args.currCount++;
				var wid = $(this.args.ref).children().width();
				var marg = $(this.args.ref).css("margin-left");
				total = parseInt(marg) - parseInt(wid);
				$(this.args.ref).animate({
					'margin-left' : total + "px"
				}, this.args.carouselTimer);
			}

			if(this.args.automatic === true) {
				var e = this;
				this.args.direction = 'right';
				this.clearCarouselTimer();
				this.args.carouselTimeOut = setTimeout(function() {
					e.moveCarouselRight(true);
				}, this.args.carouselTimer);
			}
		},
		moveCarousel : function(options) {
			//if(options.direction) ? options.direction : 'right';

		},
		pauseCarousel : function() {
			this.clearCarouselTimer();
		},
		resumeCarousel : function() {
			if(this.args.direction === 'left')
				this.moveCarouselLeft(true);
			else
				this.moveCarouselRight();
		},
		clearCarouselTimer : function() {
			clearTimeout(this.args.carouselTimeOut);
			this.args.carouselTimeOut = null;
		}
	};
})();