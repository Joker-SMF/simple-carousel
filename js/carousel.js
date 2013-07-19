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
		$this = this;

		var defaults = {
			ref : this,
			carouselWidth: '70%',
			carouselTimer : 2000,
			effectTimer: 1000,
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
				stopCarousel: false,
				childNodeName: null,
			};

			this.args = $.extend({}, defaults, params);
			this.makeInitialCheck();
		},

		makeInitialCheck: function() {
			var _this = this,
				diffChild = false;

			_this.args.childNodeName = $(_this.args.ref).children().get(0).tagName.toLowerCase();
			var i = this.calculateIndex();

			$(_this.args.ref).children().each(function() {
				if(_this.args.childNodeName !== this.tagName.toLowerCase()) diffChild = true
			});

			if(diffChild === true) {
				return false;
			}

			$(_this.args.ref).parent().css({'width': _this.args.carouselWidth});
			_this.args.totalElements = parseInt(_this.args.ref.children().length) - 1;

			_this.args.childWidth = $(i).width();
			_this.args.childHeight = $(i).height();
			_this.args.childMargin = _this.args.childHeight/2;

			$(_this.args.ref).parent().find('.arrowLeft').click(function() {
				_this.moveCarouselLeft();
			});

			$(_this.args.ref).parent().find('.arrowRight').click(function() {
				_this.moveCarouselRight();
			});

			$(_this.args.ref).bind('mouseenter', function() {
				_this.pauseCarousel();
			}).bind('mouseleave', function() {
				_this.resumeCarousel();
			});
			_this.chooseEffectFunction();
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

		hideElements: function(callback) {
			var _this = this;
			$(_this.args.ref).find(_this.args.childNodeName).not(':first-child').hide();
			$(_this.args.ref).find(_this.args.childNodeName + ':first').addClass('active');
			callback();
		},

		calculateIndex : function (index) {
			var _this = this;
			if(_this.args.currElement > _this.args.totalElements) {
				_this.args.currElement = 0;
			}
			return $(_this.args.ref).find(_this.args.childNodeName).eq(_this.args.currElement);
		},

		findActiveElement: function() {
			var _this = this;
			return $(_this.args.ref).find('.active');
		},

		clearCarouselTimer : function() {
			clearTimeout(this.args.carouselTimeOut);
			this.args.carouselTimeOut = null;
		},

		chooseEffectFunction : function() {
			var _this = this;
			switch(this.args.effect) {
				case 'fade':
					_this.hideElements(_this.fadeInElement.bind(_this));
					break;

				case 'slide':
					_this.args.currElement = 1;
					_this.hideElements(function() {
						if(_this.args.automatic === true) 
							_this.args.carouselTimeOut = setTimeout(_this.slideInOut.bind(_this), _this.args.carouselTimer);
					});
					break;

				case 'flip':
					_this.hideElements(function() {
						$(_this.args.ref).find(_this.args.childNodeName).not(':first-child').css({
							height:'0px',
							width: _this.args.childWidth +'px',
							marginTop: _this.args.childMargin +'px',
							opacity:'0.5',
							display: 'block'
						});
						if(_this.args.automatic === true) {
							_this.flipOutElements();
						}
					});
					break;

				default:
					break;
			}
		},

		flipOutElements: function() {
			var _this = this,
				i = this.calculateIndex();

			$(i).animate({
				height:'0px',
				width: _this.args.childWidth +'px',
				marginTop: _this.args.childMargin + 'px',
				opacity:'0.5'
			}, _this.args.effectTimer);

			_this.args.carouselTimeOut = setTimeout(_this.flipInElements.bind(_this), _this.args.carouselTimer);
		},

		flipInElements: function() {
			this.args.currElement++;

			var _this = this,
				i = _this.calculateIndex();

			$(i).animate({
				display: 'block',
				height: _this.args.childHeight +'px',
				width: _this.args.childWidth +'px',
				marginTop:'0px',
				opacity:'1',
			},_this.args.effectTimer, '', function() {
				if(_this.args.automatic === true) {
					_this.args.carouselTimeOut = setTimeout(_this.flipOutElements.bind(_this), _this.args.carouselTimer);
				}
			});
		},

		slideInOut : function() {
			var _this = this,
				i = this.calculateIndex(),
				active_ele = this.findActiveElement();

			if(active_ele.length > 0) {
				$(active_ele).animate({
	                left: -($(active_ele).width())
	            }, _this.args.effectTimer, '', function(){
	                $(active_ele).removeClass('active');
	            });
			}

			if(_this.args.automatic === true) {
				$(i).addClass('active').show().css({
	                left: $(i).width()
	            }).animate({
	                left: 0
	            }, _this.args.effectTimer, '', function() {
	            	_this.args.currElement++;
		            _this.args.carouselTimeOut = setTimeout(_this.slideInOut.bind(_this), _this.args.carouselTimer);
	            });
			}
		},

		fadeInElement : function(options) {
			var i = this.calculateIndex();
			var _this = this;
			$(i).addClass('active');
			$(i).fadeIn(_this.args.effectTimer, function() {
				if(_this.args.automatic === true && _this.args.stopCarousel === false) {
					_this.args.carouselTimeOut = setTimeout(_this.fadeOutElement.bind(_this), _this.args.carouselTimer);
				}
			});
		},

		fadeOutElement: function() {
			var i = this.calculateIndex();
			var _this = this;
			$(i).removeClass('active');
			$(i).fadeOut(_this.args.effectTimer, function() {
				_this.args.currElement++;
				_this.fadeInElement();
			});
		}
	};
})();