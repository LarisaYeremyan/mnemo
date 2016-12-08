const ELEMENT_WIDTH = 67,
	  ELEMENT_HEIGHT = 67,
	  MAX_ROW = 8,
	  MAX_IMAGE_COUNT = 55,
	  IMAGE_EXTENSION = '.png',
	  IMAGE_PATH = 'Content/imgs/';

var Images = ['Symbols', 'Brands', 'Cars', 'Flags', 'FruitsAndVegetables', 'Animals', 'Flowers'],
    BgImages =['symbolBg', 'brandBg', 'carBg', 'flagBg', 'fruitsAndVegetableBg', 'animalBg', 'flowerBg'],
	size = 0,
	timerID = 0,
	firstClickedIndex = 0,
	secondClickedIndex = 0,
	cellCount = 0,
	topOffset = 0,
	leftOffset = 0,
	totalClick = 0;


function MemoryChecker(container) {
	this.create = function (row, column, imageIndex, isGame, index) {

		var left = leftOffset;
		var top = topOffset + ELEMENT_HEIGHT * row;		
		if(column % size == 0) {
			left = leftOffset;
		} else {
			left = leftOffset + ELEMENT_WIDTH * column;
		}
		var imageTypeIndex = $('#image_type').prop('selectedIndex');
		var imagePath = IMAGE_PATH + Images[imageTypeIndex] + '/' + imageIndex + IMAGE_EXTENSION;		

		var memoryElement = $( '<div>' )
			.addClass( 'memory_element' )
			.attr({ 'index': index, 'fileName': imagePath, 'clicked': false })
			.css({ 'left': left +'px', 'top': top + 'px'});

		if(isGame) {
			imagePath = IMAGE_PATH + 'BgImages/' + BgImages[imageTypeIndex] + IMAGE_EXTENSION;
			memoryElement.attr('bgName', imagePath);	
		} 
		memoryElement.css('backgroundImage', 'url(' + imagePath + ')');		

		switch(imageTypeIndex) {
			case 1:
				memoryElement.css('filter', 'hue-rotate(200deg)');	
				break;
			case 2:
				memoryElement.css('filter','saturate(10) hue-rotate(10deg)');
				break;
		}		

		container.append(memoryElement);
		memoryElement.on('click', function mouseClickHandler () {
			if( isGame ){
			 	 totalClick++;
				 if(totalClick == 1) {
			 		startTimer();		
			 	 }			
			 	 $( memoryElement ).attr( 'clicked', true );
			 	 var clickedCount = defineClickedCount();
	 	 
			 	 rotateImage( memoryElement );
				 setBgImage( memoryElement );	
			 
				 switch( clickedCount ) {
				 	case 1:
				 		firstClickedIndex = $( memoryElement ).attr( 'index' );
						break;
				 	case 2:
				 		secondClickedIndex = $( memoryElement ).attr( 'index' );
				 		definePair();
				 }				
			}

		});		
	}
}
function rotateSelectedImage(element, interval) {
	var id = setInterval( frame, interval );
	function frame() {
		$( element ).css( 'animation', 'rotateInRight 1s 1' );
		clearInterval( id );
	}
}
function setSelectedBgImage(element, interval) {
	var id = setInterval( frame, interval );
	function frame() {
		var bgName = $( element ).attr( 'bgName' );
		$( element ).css( 'backgroundImage', 'url(' + bgName + ')' );
		clearInterval( id );
	}
}
function rotateImage(element) {
	var id = setInterval( frame, 300) ;
	function frame() {
		$( element ).css( 'animation','rotateInLeft 1s 1' );
		clearInterval( id );
	}
}
function setBgImage(element) {
	var id = setInterval( frame, 600 );
	function frame() {
		$( element ).css( 'backgroundImage', 'url(' + $(element).attr('fileName') + ')' );
		clearInterval( id );
	}
}
function definePair() {
	var elements = $( '.memory_element' );
	var elementFirstClicked;
	var elementSecondClicked; 
	
	for(var i = 0; i < elements.length; i++) {	
		if( $(elements[i] ).attr( 'index' ) == firstClickedIndex) {
			elementFirstClicked = elements[i];
		}
		if( $(elements[i] ).attr( 'index' ) == secondClickedIndex) {
			elementSecondClicked = elements[i];
		}	
	} 

	if ( $(elementFirstClicked ).attr( 'fileName' ) == $( elementSecondClicked ).attr( 'fileName' )) {
		$( elementFirstClicked ).fadeOut( 2000 );
		$( elementSecondClicked ).fadeOut( 2000 ); 
		cellCount = cellCount - 2;
		if(cellCount == 0) {
			clearTimeout( timerID );
			clearBorder();
		}
	} else {
		 rotateSelectedImage( elementFirstClicked, 1000 );
		 setSelectedBgImage( elementFirstClicked, 1300 );	
		 rotateSelectedImage( elementSecondClicked, 1000 );
		 setSelectedBgImage( elementSecondClicked, 1300 );			 	 
	}
	$( elementFirstClicked ).attr( 'clicked', false );
	$( elementSecondClicked ).attr( 'clicked', false );
	firstClickedIndex = 0;
	secondClickedIndex = 0; 	
}
function clearBorder() {
	var id = setInterval( frame, 2000 );
	function frame() {
		$( '#container' ).css( { 'border': 'none', 'background-color': 'transparent' } );
		$( '.hand' ).css( 'visibility', 'visible');
		$( '.win' ).css( { 'visibility': 'visible', 'animation': 'letter-zoom 1s linier infinite' } );	
		clearInterval( id );
	}	
}
function defineClickedCount () {
	var elements = $( '.memory_element' );
	var clickedCount = 0;
	for(var i = 0; i < elements.length; i++) {
		if($(elements[i]).attr( 'clicked' ) == 'true') {
			clickedCount = clickedCount + 1;
		}
	} 
	return clickedCount;
}
function startTimer() {
	var game_timer = $( '#game_timer' );
	var time = game_timer.html();
	var arr = time.split(':');
	var h = arr[0];
	var m = arr[1];
	var s = arr[2];

	if (s == 59) {
		if (m == 59) {
			h++;
			m = 0;
			if (h < 10) {
				h = '0' + h;
			}
		}
		m++;
		if (m < 10) {
			m = '0' + m;
		}
		s = 0;
	}
	else s++;
	if (s < 10) {
		s = '0' + s;
	}
	$( '#game_timer' ).html( h+':'+m+':'+s );
	timerID = setTimeout( startTimer, 1000 );
}
function shuffleArray(array) {
	for (var i = array.length - 1; i > 0; i--) {
		var j = Math.floor(Math.random() * (i + 1));
		var temp = array[i];
		array[i] = array[j];
		array[j] = temp;
	}
	return array;
}
function log(message){
	var console = document.getElementById('debuginfo');
	if (console === null){
		console = document.createElement('div');
		console.id = 'debuginfo';
		console.style.background = '#dedede';
		console.style.border = '1px solid silver';
		console.style.padding = '5px';
		console.style.width = '200px';
		console.style.position = 'absolute';
		console.style.right = '0px';
		console.style.top = '0px';
		document.body.appendChild(console);
	}
	console.innerHTML += '<p>' + message + '</p>';
}
function createGame(isGame) {
	totalClick = 0;
	clearTimeout( timerID );
	$( '#game_timer' ).html( '00:00:00' );

	$( '.hand' ).css( 'visibility', 'hidden' );
	$( '.win' ).css( { 'visibility': 'hidden', 'animation': '' } );	
	$( '.memory_element' ).remove();
	$( '#container' ).css( { 'border': '3px solid rgb(24, 87, 154)', 'backgroundColor': 'white' } );

	var container = new MemoryChecker( $( '#game_container' ) );
	size = $( '#size' ).val();
	var rows, columns;
	if(size < 10) {
		rows = size;
		columns = size;
	} else {
		rows = MAX_ROW;
		columns = size;
	}
	cellCount = rows * columns;

	var gameContainer = $( '#game_container' );
	topOffset = ( gameContainer.outerHeight()- rows * ELEMENT_HEIGHT) / 2 ;
	leftOffset = ( gameContainer.outerWidth() - columns * ELEMENT_WIDTH ) / 2 ;
	
	$( '#container' ).css( { 'left': leftOffset - 10 +'px',
		 'top': topOffset- 10 +'px',
		 'width': columns * ELEMENT_WIDTH + 15 +'px',
		 'height': rows * ELEMENT_HEIGHT + 15 +'px' } );

	var ImageArray = [];
	var length = (rows * columns) / 2;
	var start = Math.floor(Math.random() * MAX_IMAGE_COUNT);
	for(var j = 0; j < length; j++){
		if(start + j > MAX_IMAGE_COUNT) {
			start = 0;
		}
		ImageArray[j] = start + j;
	}

	ImageArray = ImageArray.concat( ImageArray ); 
	ImageArray = shuffleArray( ImageArray );

	var k = 0;
	for (var i = 0; i < rows; i++) {
		for (var j = 0; j < columns; j++) {
			container.create(i, j, ImageArray[k], isGame, k);
			k++;
		} 
	}
}