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
			sliderTimer: 1000,
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

			$(this.args.ref).parent().find('.arrowLeft').click(function() {
				innerRef.moveCarouselLeft();
			});

			$(this.args.ref).parent().find('.arrowRight').click(function() {
				innerRef.moveCarouselRight();
			});

			$(this.args.ref).bind('mouseenter', function() {
				innerRef.pauseCarousel();
			}).bind('mouseleave', function() {
				innerRef.resumeCarousel();
			});
			this.chooseEffectFunction();
		},

		pauseCarousel : function() {
			this.args.stopCarousel = true;
		},

		resumeCarousel : function() {
			this.args.stopCarousel = false;
			if(this.args.automatic === true) {
				if(this.args.effect === 'fade') this.fadeOutElement();
			}
		},

		calculateIndex : function (index) {
			var _this = this;
			if(_this.args.currElement > _this.args.totalElements) {
				_this.args.currElement = 0;
			}
			return $(_this.args.ref).find('div').eq(_this.args.currElement);
		},

		chooseEffectFunction : function() {
			var _this = this;
			switch(this.args.effect) {
				case 'fade':
					_this.hideElements(_this.fadeInElement.bind(_this));
					break;

				case 'slide':
					_this.slideOutElement();
					break;
			}
		},

		hideElements: function(callback) {
			var _this = this;
			$(_this.args.ref).find('div').each(function(){
				$(this).css({'display': 'none'});
			});
			callback();
		},

		slideOutElement: function() {
			var _this = this,
				i = _this.calculateIndex();


			$(_this.args.ref).children(':last').removeClass('active');
			$(i).addClass('active');
			$(_this.args.ref).animate({'left' : '-' + $(_this.args.ref).width()}, _this.args.sliderTimer, function() {
				_this.slideInElement();	
			})

		},

		slideInElement: function() {
			var _this = this;
			$(_this.args.ref).css('left', 0).children(':first').appendTo($(_this.args.ref));
			setTimeout(function() {
				_this.slideOutElement();
			}, _this.args.carouselTimer)
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

		clearCarouselTimer : function() {
			clearTimeout(this.args.carouselTimeOut);
			this.args.carouselTimeOut = null;
		}
	};
})();