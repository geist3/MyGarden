// Creates review window canvas 
var viewWindow = null;
var hasSVGSupport = false;

// when document ready
$(document).ready(function() {
	debugOut("jquery ready");
	
	debugOut("detecting svg support");
	// initial drawing of tools etc
	if (Modernizr.svg){
		hasSVGSupport = true;
		debugOut("setting up svg gui");
		svgshow();
	}else{
		hasSVGSupport = false;
		debugOut("svg not supported");
	}
	
	// start listening for updates from server
	loadAnnots();
	
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
						break;
				}
				//alert(type);
				//var title = $(this).find('title').text();
			});
          }
	});
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
function svgshow() {
	debugOut("svg()");
	
	// Creates canvases
	debugOut("creating canvases");
	var canvasWidth = 680; 
	var canvasHeight = 600; 
	$("#viewWindow").width(canvasWidth);
	$("#viewWindow").height(canvasHeight);
	reviewWindow = Raphael("viewWindow", canvasWidth, canvasHeight);
	
	debugOut("end showsvg()");
}

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
}
