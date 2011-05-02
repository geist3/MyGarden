// Creates tool select canvas 
var toolsCanvas = null;
	
// Creates tool properties canvas 
var toolProperties = null;

// Creates review window canvas 
var reviewWindow = null;

// Creates review window canvas 
var imagesCanvas = null;

// tool properties
var toolType = "circle";
var toolSize = "1";
var toolFill = "blue";
var toolStroke = null;
var toolOpacity = 1;

var mouseDownX = null;
var mouseDownY = null;

var tempShape = null;

var hasTouchSupport = false;
var hasSVGSupport = false;

var annots = new Array();
var annotDetails = new Array();
var annotDbids = new Array();

// when document ready
$(document).ready(function() {
	debugOut("jquery ready");
	
	// detect capabilities
	//if ($('html').hasClass('touch')) 
	if(Modernizr.touch)
	{
		var htmlStr = $('#header').html();
		$('#header').text("Touch Support detected");
		hasTouchSupport = true;
	} else {
		var htmlStr = $('#header').html();
		$('#header').text("No Touch support");
		hasTouchSupport = false;
	}
	
	debugOut("detecting svg support");
	// initial drawing of tools etc
	if (Modernizr.svg){
		hasSVGSupport = true;
		debugOut("setting up svg gui");
		svg();
	}else{
		hasSVGSupport = false;
		debugOut("svg not supported");
	}
	
	debugOut("binding events");
	if(hasTouchSupport){
		$("#ReviewWindow").bind("touchstart", m_down);
	}else{
		$("#ReviewWindow").mousedown(m_down);
	}
	debugOut("bits binded");

	// attach clear the review window function to clear button 
	$("#clear").click(
		function(theEvent) 
		{
			 //tools.clear();
			 var simulatedEvent = document.createEvent("MouseEvent");
			simulatedEvent.initMouseEvent("touchStart", true, true, window, 1, 
            150, 150, 
            150, 150, false, 
            false, false, false, 0, null);
    
			document.dispatchEvent(simulatedEvent);

		}
    );
    
    // accordion
    debugOut("accordion");
    $("#accordion").accordion();
	
	// start listening for updates from server
	loadAnnots();
	
	// Show menu when #myDiv is clicked
				$("#myDiv").contextMenu({
					menu: 'myMenu'
				},
					function(action, el, pos) {
					alert(
						'Action: ' + action + '\n\n' +
						'Element ID: ' + $(el).attr('id') + '\n\n' + 
						'X: ' + pos.x + '  Y: ' + pos.y + ' (relative to element)\n\n' + 
						'X: ' + pos.docX + '  Y: ' + pos.docY+ ' (relative to document)'
						);
				});

	
	// bind save function to save button
	//$("#saveButton").click(saveData);
	
	// add contect menu
	//http://abeautifulsite.net/blog/2008/09/jquery-context-menu-plugin/#download
	// 
	
	debugOut("ready end");
 })

// start listening to server 
function loadAnnots(){
	$.ajax({
          type: "GET",
          url: '/annots.xml',
          dataType: 'xml',
          success: function(msg) {
            //alert( "Data gotten: " + msg );
            $(msg).find('annot').each(function(){
				var dbid = $(this).find('id').text();
				var props = $(this).find('props').text();
				var shape = $(this).find('shape').text();
				switch(shape){
					case "circle":
						var propArr =  props.split(",");
						debugOut("drawing svg circle");
						var rx = propArr[0].split(":")[1];
						var ry = propArr[1].split(":")[1];
						var cx = propArr[2].split(":")[1];
						var cy = propArr[3].split(":")[1];
						var fill = propArr[4].split(":")[1];
						var opacity = propArr[5].split(":")[1];
						tempShape = reviewWindow.ellipse(cx, cy, rx, ry);
						tempShape.attr("fill", fill);
						tempShape.attr("opacity", opacity);
						var arrayPos = annotDetails.length;
						tempShape.node.id="shape" + dbid;
						
						annots[arrayPos] = tempShape;
						annotDetails[arrayPos] = "circle";
						annotDbids[arrayPos] = dbid;
						debugOut("adding context menu");
						$(tempShape.node).contextMenu(
							{
								menu: 'myMenu'
							},
							function(action, el, pos) {
								var id = $(el).attr('id');
								deleteAnnot(id);
							}
						);
						debugOut("drawn circle");
						break;
					case "rect":
						var propArr =  props.split(",");
						debugOut("drawing svg rect");
						var x = propArr[0].split(":")[1];
						var y = propArr[1].split(":")[1];
						var width = propArr[2].split(":")[1];
						var height = propArr[3].split(":")[1];
						var r = propArr[4].split(":")[1];
						//var rx = propArr[5].split(":")[1];
						//var ry = propArr[6].split(":")[1];
						var fill = propArr[7].split(":")[1];
						var opacity = propArr[8].split(":")[1];
						tempShape = reviewWindow.rect(x, y, width, height, r);
						tempShape.attr("fill", fill);
						tempShape.attr("opacity", opacity);
						var arrayPos = annotDetails.length;
						tempShape.node.id="shape" + dbid;
						annots[arrayPos] = tempShape;
						annotDetails[arrayPos] = "rect";
						annotDbids[arrayPos] = dbid;
						debugOut("adding context menu");
						$(tempShape.node).contextMenu(
							{
								menu: 'myMenu'
							},
							function(action, el, pos) {
								var id = $(el).attr('id');
								deleteAnnot(id);
							}
						);
						debugOut("drawn rect");
						break;
				}
				
				debugOut("drawn shape");
				//alert(type);
				//var title = $(this).find('title').text();
			});
			
			updateAnnotList();
          }
	});
}

function saveData(i){
	var data = "";
	//var i = 0;
	switch(annotDetails[i]){
		case "circle":
			var annot = annots[i];
			data = "rx:" + annot.attr('rx');
			data += ",ry:" + annot.attr('ry');
			data += ",cx:" + annot.attr('cx');
			data += ",cy:" + annot.attr('cy');
			data += ",fill:" + annot.attr('fill');
			data += ",opacity:" + annot.attr('opacity');
			break;
		case "rect":
			var annot = annots[i];
			data = "x:" + annot.attr('x');
			data += ",y:" + annot.attr('y');
			data += ",width:" + annot.attr('width');
			data += ",height:" + annot.attr('height');
			data += ",r:" + annot.attr('r');
			data += ",rx:" + annot.attr('rx');
			data += ",ry:" + annot.attr('ry');
			data += ",fill:" + annot.attr('fill');
			data += ",opacity:" + annot.attr('opacity');
			break;
	}
	
	if(data.length > 0 ){
		$.ajax({
			  type: "POST",
			  url: '/annots.xml',
			  dataType: 'xml',
			  data: { _method:'POST', annot : { shape: annotDetails[i], props: data } },
			  success: function(msg) {
				//alert( "Data Saved: " + msg );
				$(msg).find('annot').each(function(){
					var arrayPos = annots.length -1;
					var dbid = $(this).find('id').text();
					annotDbids[arrayPos] = dbid;
					var tempShape = annots[arrayPos]
					tempShape.node.id="shape" + dbid;
					debugOut("adding context menu");
					$(tempShape.node).contextMenu(
						{
							menu: 'myMenu'
						},
						function(action, el, pos) {
							var id = $(el).attr('id');
							deleteAnnot(id);
						}
					);
				});
				
				updateAnnotList();
			  }
		});
	}
	//string atts = "";
	//for(j=0; j<annot[i].attr.count;j++){
		//atts += annots[0].attr;
	//}
}

//automagically add auth token
// http://henrik.nyh.se/2008/05/rails-authenticity-token-with-jquery
$(document).ajaxSend(function(event, request, settings) {
  if (typeof(AUTH_TOKEN) == "undefined") return;
  // settings.data is a serialized string like "foo=bar&baz=boink" (or null)
  settings.data = settings.data || "";
  settings.data += (settings.data ? "&" : "") + "authenticity_token=" + encodeURIComponent(AUTH_TOKEN);
});

// set up canvases and draw tools
function svg() {
	debugOut("svg()");
	
	// Creates canvases
	debugOut("creating canvases");
	toolsCanvas = Raphael("toolsCanvas", 50, 200);
	imagesCanvas = Raphael("imagesCanvas", 50, 200);
	toolProperties = Raphael("toolProperties", 50, 50);
	var canvasWidth = 680; // $(window).width()-$("#ReviewWindow").offset().left-100;
	var canvasHeight = 600; //$(window).height()-250;//$("#ReviewWindow").offset().top;
	$("#ReviewWindow").width(canvasWidth);
	$("#ReviewWindow").height(canvasHeight);
	//reviewWindow = Raphael("ReviewWindow", "100%", "100%");
	reviewWindow = Raphael("ReviewWindow", canvasWidth, canvasHeight);
	
	// creating tools
	debugOut("creating tools");
	// circle
	var c = toolsCanvas.circle(25, 25, 20).attr({
		fill: "hsb(.8, 1, 1)",
		stroke: "none",
		opacity: .5
	});
	
	// onclick select
	c.node.onclick = function () {
		toolProperties.clear();
		toolProperties.circle(25, 25, 20).attr({
			fill: "hsb(.8, 1, 1)",
			stroke: "none",
			opacity: .5
		});
		
		toolType = "circle";
		toolSize = 20;
		toolFill = "hsb(.8, 1, 1)";
		toolStroke = "none";
		toolOpacity = .5;
	};
	
	// rounded rectangle
	var rn = toolsCanvas.rect(10, 60, 30, 30, 5);
	rn.attr("fill", "blue");
	
	// onclick select
	rn.node.onclick = function () {
		toolProperties.clear();
		rn2 = toolProperties.rect(10, 10, 30, 30, 5);
		rn2.attr("fill", "blue");
		
		toolType = "rect";
		toolSize = 30;
		toolFill = "blue";
	};

	// image
	var img = imagesCanvas.image("../../images/apple.jpg", 10, 10, 320 / 10, 240 / 10);

	// onclick select
	img.node.onclick = function () {
		toolProperties.clear();
		rn2 = toolProperties.image("../../images/apple.jpg", 10, 10, 320 / 10, 240 / 10);
		
		toolType = "img";
	};
	
	debugOut("end svg()");
}

//draw a shape on click
//$("#ReviewWindow").click(ReviewWindowClick);
// mouse down start drawing and bind mouse move and up
// http://popdevelop.com/2010/08/touching-the-web/
// http://html5demos.com/drag
function m_down(e) {
	// left button
	if(e.which == 1){
		debugOut("m_down");
		
		debugOut("preventing default");
		e.preventDefault(); 

		debugOut("getting touch coords");
		if(hasTouchSupport){
			var orig = e.originalEvent;
			debugOut("e.t.l: " + orig.touches.length );
			if(orig.touches.length == 1){	// Only deal with one finger
				var touch = orig.touches[0]; // Get the information for finger #1
				mouseDownX = touch.pageX;
				mouseDownY = touch.pageY;
			}
		}else{
			mouseDownX = e.pageX;
			mouseDownY = e.pageY;
		}
		
		debugOut("getting offsetcoords");
		
		var p = $("#ReviewWindow");
		
		var offset = p.offset();
		var oLeft = offset.left;
		var oTop = offset.top;

		debugOut("calculating position");
		var xPos = mouseDownX - oLeft;
		var yPos = mouseDownY - oTop;
		
		if(hasSVGSupport){
			debugOut("picking tool");
			switch(toolType)
			{
				case "circle":
					debugOut("drawing svg circle");
					//tempShape = reviewWindow.circle(xPos, yPos, 1);
					tempShape = reviewWindow.ellipse(xPos, yPos, 1, 1);
					tempShape.attr("fill", "red");
					tempShape.attr("opacity", .5);
					arrayPos = annots.length;
					annots[arrayPos] = tempShape;
					annotDetails[arrayPos] = "circle";
					if(hasTouchSupport){
						$("#ReviewWindow").bind("touchmove", m_move);
						$("#ReviewWindow").bind("touchend", m_up);
					}else{
						$("#ReviewWindow").mousemove(m_move);
						$("#ReviewWindow").mouseup(m_up);
					}
					break;
				case "rect":
					debugOut("drawing svg rect");
					tempShape = reviewWindow.rect(xPos, yPos, 1, 1, 5);
					tempShape.attr("fill", "blue");
					tempShape.attr("opacity", .5);
					arrayPos = annots.length;
					annots[arrayPos] = tempShape;
					annotDetails[arrayPos] = "rect";
					if(hasTouchSupport){
						$("#ReviewWindow").bind("touchmove", m_move);
						$("#ReviewWindow").bind("touchend", m_up);
					}else{
						$("#ReviewWindow").mousemove(m_move);
						$("#ReviewWindow").mouseup(m_up);
					}
					break;
				case "img":
					debugOut("img");
					tempShape = reviewWindow.image("../../images/rails.png", xPos, yPos, 320 / 5, 240 / 5);
					annots[annots.length] = tempShape;
					annotDetails[annotDetails.length] = "img";
					
					updateAnnotList();
					break;
				default:
					alert("Please select a tool");
					break;
			}
		}
		
		debugOut("end m_down");
	}
};

function debugOut(msg){
	$("#debugspan").text(msg);
}

function updateAnnotList(){
	debugOut("updateAnnotList");
	debugOut("clear");
	$("#commentsList>li").remove();
	
	debugOut("loop through all annots");
	for(i=0;i<annotDetails.length;i++) {
        $('<li value="' + i + '"><span>' + annotDetails[i] + '</span></li>').appendTo('#commentsList');
	} 
	
	debugOut("add list click");
	$('#commentsList>li').click(function(){
		// delete annot
		//var value = $(this).attr("value");
		//var element = annots[value*1];
		//deleteAnnot(element);
    });
}

function GetArrayPosFromAnnotId(id){
	var dbid = id.replace("shape","");
	dbid = dbid * 1;
	var arraypos = -1;
	for(var i = 0; i < annotDbids.length; i++){
		if(annotDbids[i] == dbid){
			arraypos = i;
		}
	}
	
	return arraypos;
}

function deleteAnnot(id){
	//remove from database
	debugOut("remove from database");
	var arraypos = GetArrayPosFromAnnotId(id);
	var element = annots[arraypos];
	
	if(i < 0){
		alert("couldnt find dbid " + dbid + " in list");
	}else{
		var data = annotDbids[arraypos];
		$.ajax({
			  type: "DELETE",
			  url: '/annots/' + data + '.xml',
			  dataType: 'xml',
			  data: { _method:'DELETE', id: data },
			  success: function() {
				updateAnnotList();
			  }
		});
			
		// remove from arrays
		debugOut("remove from arrays");
		annotDetails.splice(arraypos,1);
		annots.splice(arraypos,1);
		annotDbids.splice(arraypos,1);
		
		// remove from screen
		debugOut("remove from screen");
		element.remove();
		
		// remove from list
		debugOut("call update list");
		updateAnnotList();
	}
}

// handle move event
function m_move(e) {
	if(e.which == 1){
		debugOut("move");
		
		// prevent default move action, like page scroll
		debugOut("preventing default");
		e.preventDefault(); 
		
		// get coords original mouse down coords
		debugOut("getting offset");
		var p = $("#ReviewWindow");
		
		var offset = p.offset();
		var oLeft = offset.left;
		var oTop = offset.top;

		debugOut("calc start click pos");
		var xPos = mouseDownX - oLeft;
		var yPos = mouseDownY - oTop;
		
		// get new mouse/finger position
		debugOut("get new click pos");
		var rxPos = null;
		var ryPos = null;

		if(hasTouchSupport){
			var orig = e.originalEvent;
			debugOut("e.t.l: " + orig.touches.length );
			if(orig.touches.length == 1){	// Only deal with one finger
				var touch = orig.touches[0]; // Get the information for finger #1
				rxPos = touch.pageX - oLeft;
				ryPos = touch.pageY - oTop;
			}
		}else{
			rxPos = e.pageX - oLeft;
			ryPos = e.pageY - oTop;
		}
		
		// calculate drag distance
		var width = (rxPos - xPos);
		var height = (ryPos - yPos);
		/*if(width < 0){
			width = 0 - width;
		}
		if(height < 0){
			height = 0 - height;
		}*/
		debugOut(width + ", " + height);
		
		// http://raphaeljs.com/reference.html
		// dealing with shapes
		debugOut("dealing with shapes");
		if(hasSVGSupport){
			switch(toolType)
			{
				case "circle":
					//tempShape.attr("r", width);
					tempShape.attr("rx", width / 2);
					tempShape.attr("ry", height / 2);
					tempShape.attr("cx", xPos + (width / 2));
					tempShape.attr("cy", yPos + (height / 2));
					break;
				case "rect":
					tempShape.attr("height", height);
					tempShape.attr("width", width);
					break;
			}
		}
	}
}

// handle up event
function m_up(e) {
	if(e.which == 1){
		e.preventDefault();  
		debugOut("up");
		
		// save created annotation
		saveData(annots.length-1);
		
		// unbind
		if(hasTouchSupport){
			$("#ReviewWindow").unbind("touchmove", m_move);
			$("#ReviewWindow").unbind("touchend", m_up);
			
		}else{
			$("#ReviewWindow").unbind("mousemove", m_move);
			$("#ReviewWindow").unbind("mouseup", m_up);
		}
		
		debugOut("finished drawing");
	}
}
