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
			automatic : false,
			effect: 'slide'
		};
		opts = $.extend({}, defaults, args);
		return cBrain.init(opts);
	};

	var cBrain = {
		args : {},
		init : function(params) {
			var defaults = {
				totalElements : null,
				currElement : 0,
				stopCarousel: false
			}, innerRef = this;

			this.args = $.extend({}, defaults, params);

			this.args.totalElements = parseInt(params.ref.children().length) - 1;
			//this.clearCarouselTimer();

			$(this.args.ref).parent().find('.arrowLeft').click(function() {
				innerRef.moveCarouselLeft();
			});

			$(this.args.ref).parent().find('.arrowRight').click(function() {
				innerRef.moveCarouselRight();
			});

			$(this.args.ref).bind('mouseenter', function() {
				console.log('mouse enter');
				innerRef.pauseCarousel();
			}).bind('mouseleave', function() {
				console.log('mouse leave');
				innerRef.resumeCarousel();
			});

			switch(this.args.effect) {
				case 'fade':
					innerRef.fadeInElement();
					break;
			}
		},

		calculateIndex : function (index) {
			var _this = this;
			if(_this.args.currElement > _this.args.totalElements) {
				console.log(_this.args.currElement + ' : ' + _this.args.totalElements);
				_this.args.currElement = 0;
			}
			return $(_this.args.ref).find('li').eq(_this.args.currElement);
		},

		fadeInElement : function(options) {
			var i = this.calculateIndex();
			var _this = this;
			$(i).addClass('active');
			$(i).fadeIn(_this.args.carouselTimer, function() {
				if(_this.args.automatic === true && _this.args.stopCarousel === false) {
					_this.fadeOutElement();
				}
			});
		},

		fadeOutElement: function() {
			var i = this.calculateIndex();
			var _this = this;
			$(i).removeClass('active');
			$(i).fadeOut(_this.args.carouselTimer, function() {
				_this.args.currElement++;
				_this.fadeInElement();
			});
		},

		pauseCarousel : function() {
			//this.clearCarouselTimer();
			//debugger;
			this.args.stopCarousel = true;
		},

		resumeCarousel : function() {
			this.args.stopCarousel = false;
			if(this.args.automatic === true) {
				this.fadeOutElement();
			}
		},

		clearCarouselTimer : function() {
			clearTimeout(this.args.carouselTimeOut);
			this.args.carouselTimeOut = null;
		}
	};
})();