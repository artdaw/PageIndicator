(function($) {
	var methods = {
		init : function(options) {
			debug(this);

			// build main options before element iteration
			var opts = $.extend({}, $.fn.pageIndicator.defaults, options);

			return this.each(function(){
				$this = $(this);

				// build element specific options
				var options = $.meta ? $.extend({}, opts, $this.data()) : opts;

				// create bubble line
				var bubbleLine = createBubblesLine($this.children().length);

				// create container for slides
				var containerWithChildren = createContainerWithChildren($this, options); 
				$this.append(containerWithChildren).append(bubbleLine);

				//add bubble line listeners	
				$(bubbleLine.children()).bind('click.pageIndicator', function(){
					var activeBubbleIndex = $(this).siblings('li.pageIndicator_bubble_active').index();
					var currentBubbleIndex = $(this).index();
					var step = currentBubbleIndex - activeBubbleIndex;
					containerWithChildren.animate({"left": "-="+ (parseNumberFromOption(options.width) * step) +"px"}, "slow")
					
					// change style of bubble
					$(this).siblings().removeClass('pageIndicator_bubble_active');
					$(this).addClass('pageIndicator_bubble_active');
				});
			});
		},

		destroy : function() {
			return this.each(function(){
				//remove bubble line listeners
				$(this).find('ul > li').unbind('.pageIndicator');
				//remove whole Page Indicator from DOM
				$(this).detach();
			})
		}
	};

	$.fn.pageIndicator = function(method) {
		if (methods[method]) {
			return methods[method].apply( this, Array.prototype.slice.call(arguments, 1 ));
		} else if (typeof method === 'object' || ! method) {
			return methods.init.apply(this, arguments);
		} else {
			$.error('Method ' +  method + ' does not exist on jQuery.pageIndicator');
		}    
	};
	//
	// private function for debugging
	//
	function debug(obj) {
		if (window.console && window.console.log) {
			window.console.log('pageIndicator selection count: ' + obj.size());
		}
	};

/**
* Creates container for children of scroller 
*/
function createContainerWithChildren(obj, options) {
	// scroller wrapper styles
	var scroller = obj;
	scroller.addClass('pageIndicator_scroller');
	scroller.css({
		'height' : options.height,
		'width'	: options.width, 
	});

	// elments to show styles
	scroller.children().css({
		'float': 'left',
		'width': options.width
	})

	// container for elements
	var container = $('<div>');
	container.addClass('pageIndicator_container');	
	container_width = parseNumberFromOption(options.width) * scroller.children().length;
	container.css({
		'width': container_width
	});

	// wraps children 
	return container.append(scroller.children());
}

function parseNumberFromOption(option) {
	return parseInt(/(\d+)/.exec(option)[1], 10);
}

function createBubblesLine(length){
	var ul = $('<ul class="pageIndicator_bubbleLine">');
	ul.append('<li class="pageIndicator_bubble pageIndicator_bubble_active">&nbsp;</li>');
	for(var i=0; i < length-1; i++) {
		ul.append('<li class="pageIndicator_bubble">&nbsp;</li>');
	}
	return ul;
}

/**
* Page Indicator defaults
*/
$.fn.pageIndicator.defaults = {
	width: '480px',
	height: '320px'
};

})(jQuery);