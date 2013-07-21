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
		var defaults = {
			ref : this,
			carouselWidth: '70%',
			carouselTimer : 2000,
			effectTimer: 1000,
			automatic : false,
			effect: 'slide',
			carouselTimeOut : null,
			totalElements : null,
			currElement : 0,
			stopCarousel: false,
			childNodeName: null,
			parentEle: null,
			currFunc: null
		};
		return cBrain.init(defaults, args);
	};

	var cBrain = {
		args : {},
		init : function(defaults, opts) {
			this.args = $.extend({}, defaults, opts);

			var _this = this,
				childIssue = false;

			_this.args.childNodeName = $(_this.args.ref).children().get(0).tagName.toLowerCase();
			_this.args.parentEle = $(_this.args.ref).parent();
			var i = this.calculateIndex();

			$(_this.args.ref).children().each(function() {
				if(_this.args.childNodeName !== this.tagName.toLowerCase()) childIssue = true
			});

			if(childIssue === true) return false;

			$(_this.args.ref).parent().css({'width': _this.args.carouselWidth});
			_this.args.totalElements = parseInt(_this.args.ref.children().length) - 1;

			_this.args.childWidth = $(i).width();
			_this.args.childHeight = $(i).height();
			_this.args.childMargin = _this.args.childHeight/2;

			if(_this.args.automatic === false) {
				$('.left_arrow').click(function() {
					_this.moveCarouselLeft();
				});

				$('.right_arrow').click(function() {
					_this.moveCarouselRight();
				});
			}

			$(_this.args.ref).bind('mouseenter', function() {
				_this.pauseCarousel();
			}).bind('mouseleave', function() {
				_this.resumeCarousel();
			});
			_this.addCounter();
		},

		addCounter: function() {
			var _this = this;
			var counterLeft = $(_this.args.ref).offset().left + $(_this.args.ref).width()/2 - (_this.args.totalElements * 10);
			var str = '';
			for(var i = 0; i <= _this.args.totalElements; i++) {
				str += '<span class="content_' + i + '"> ' + i + '</span>'
			}
			$('.buttons').html(str);

			var buttonsWidth = $('.buttons').width();
			$('.bottom_bar').css({
				'margin-left': counterLeft + 'px',
				'width': parseInt(buttonsWidth + 50) + 'px'
			});
			_this.chooseEffectFunction();
		},

		chooseEffectFunction : function() {
			var _this = this;
			switch(this.args.effect) {
				case 'fade':
					_this.args.currFunc = 'fadeInElement';
					_this.hideElements(function() {
						if(_this.args.automatic === true)
							_this.fadeInElement();
					});
					break;

				case 'slide':
					_this.args.currElement = 1;
					_this.args.currFunc = 'slideInOut';
					_this.hideElements(function() {
						if(_this.args.automatic === true)
							_this.args.carouselTimeOut = setTimeout(_this.slideInOut.bind(_this), _this.args.carouselTimer);
					});
					break;

				case 'flip':
					_this.args.currFunc = 'flipOutElements';
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

		fadeInElement : function(options) {
			var i = this.calculateIndex(),
				_this = this;

			$(i).addClass('active');
			$(i).fadeIn(_this.args.effectTimer, function() {
				if(_this.args.automatic === true && _this.args.stopCarousel === false) {
					_this.args.carouselTimeOut = setTimeout(_this.fadeOutElement.bind(_this), _this.args.carouselTimer);
				}
			});
		},

		fadeOutElement: function() {
			var i = this.calculateIndex(),
				_this = this;

			$(i).removeClass('active');
			$(i).fadeOut(_this.args.effectTimer, function() {
				_this.args.currElement++;
				_this.changeIndicators();
				_this.fadeInElement();
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
				_this.changeIndicators();
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

			_this.changeIndicators();

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

		changeIndicators: function(callback) {
			$('.buttons span').removeClass('highlighter');
			$('.content_' + this.args.currElement).addClass('highlighter');
		},

		clearCarouselTimer : function() {
			clearTimeout(this.args.carouselTimeOut);
			this.args.carouselTimeOut = null;
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

		moveCarouselLeft: function() {
			this[this.args.currFunc]();
		},

		moveCarouselRight: function() {
			this[this.args.currFunc]();
		},
	};
})();