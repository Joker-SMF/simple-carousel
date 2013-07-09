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
	$(window).load(function() {
		var initCount = $(".images ul").children().length;
		var currCount = 1;

		$(".arrowLeft").click(function() {
			
		});

		var carouselTimer = null;
		
		moveCarouselLeft = function(autoScroll) {
			if(currCount == 1) {
				clearTimeout(carouselTimer);
				carouselTimer = null;
				clearTimeout(carouselTimer);
				carouselTimer = null;
				console.log('returning right: ' + currCount);
				moveCarouselRight(true);
				return;
			} else {
				currCount--;
				var wid = $(".images ul li img").width();
				var marg = $(".images ul").css("margin-left");
				total = parseInt(marg) + parseInt(wid);
				$(".images ul").animate({
					'margin-left' : total + "px"
				}, 1000);
			}

			if(autoScroll) {
				clearTimeout(carouselTimer);
				carouselTimer = null;
				carouselTimer = setTimeout(function() {
					moveCarouselLeft(true);
				}, 3000);
			}
		};

		$(".arrowRight").click(function() {
			moveCarouselRight();
		});

		moveCarouselRight = function(autoScroll) {
			if(currCount >= initCount) {
				clearTimeout(carouselTimer);
				carouselTimer = null;
				/*currCount = 1;
				$(".images ul").animate({
					'margin-left' : "0px"
				}, 1000);*/
				moveCarouselLeft(true);
				return;
			} else {
				currCount++;
				var wid = $(".images ul li img").width();
				var marg = $(".images ul").css("margin-left");
				total = parseInt(marg) - parseInt(wid);
				$(".images ul").animate({
					'margin-left' : total + "px"
				}, 1000);
			}

			if(autoScroll) {
				clearTimeout(carouselTimer);
				carouselTimer = null;
				carouselTimer = setTimeout(function() {
					moveCarouselRight(true);
				}, 3000);
			}
		};

		moveCarouselRight(true);
	});
})();