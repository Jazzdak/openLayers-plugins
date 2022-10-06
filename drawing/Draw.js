function Draw (_options) {

	var this_ = this;
	
	var draw = null;
	var modify = null;
	var buttons = [];

	var Ext_options = _options || {};

	var drawDiv = document.createElement('div');

	var label = document.createElement('span');
	var labelClass = document.createAttribute('class');
	labelClass.value = "fa fa-pencil fa-2x";

	label.setAttributeNode(labelClass);
	
	var options = {
		element : ((null != Ext_options.element) ? Ext_options.element : drawDiv),
		target : ((null != Ext_options.target) ? Ext_options.target : null),
		className : ((null != Ext_options.className) ? Ext_options.className : "ol-draw"),
		collapsible : ((null != Ext_options.collapsible) ? Ext_options.collapsible : true),
		collapsed : ((null != Ext_options.collapsed) ? Ext_options.collapsed : true),
		tipLabel : ((null != Ext_options.tipLabel) ? Ext_options.tipLabel : "Dessiner"),
		label : ((null != Ext_options.label) ? Ext_options.label : label),
		features: ((null != Ext_options.features) ? Ext_options.features : null),
		source : ((null != Ext_options.source) ? Ext_options.source : null),
		saveURL : ((null != Ext_options.saveURL) ? Ext_options.saveURL : null),
		saveDatas : ((null != Ext_options.saveDatas) ? Ext_options.saveDatas : {}),
	};

	if (options.source == null && typeof options.source == "ol.source.Vector") {
		alert('Une source valide est necessaire pour le control Draw.');
		return;
	}
	
	ol.control.Control.call(this, {
		element : options.element,
		target : options.target
	});
	
	var EndDraw = function EndDraw(evt){
		evt.feature.set('name', text);
		evt.feature.setStyle(function(){
			return new ol.style.Style({
				image: new ol.style.Circle({
					radius: 3,
					fill: new ol.style.Fill({color: 'rgba(255, 0, 0, 0.1)'}),
					stroke: new ol.style.Stroke({color: 'red', width: 2})
				}),
				text: new ol.style.Text({
					textAlign: 'center',
					textBaseline: 'middle',
					font: 'bold 12pt sans-serif',
					text: evt.feature.get('name'),
					fill: new ol.style.Fill({color: '#FF0000'}),
					stroke: new ol.style.Stroke({color: '#FFFFFF', width: 3}),
					offsetX: 0,
					offsetY: -10,
					rotation: 0
				})
			});
		});
	    map.removeInteraction(draw);
	    draw.removeEventListener('drawend', EndDraw);
	    draw = null;
	}
	
	var text = null;
	
	var DrawText = function DrawText(event){
		var code = event.keyCode || event.which;
		
		if(code == 13){
			var map = this_.getMap();
			
			text = drawtextFieldButton.value;
			
			draw = new ol.interaction.Draw({
				source : options.source,
				type : 'Point',
				condition: function (event) {
					return true;
				}
			});
			draw.addEventListener('drawend', EndDraw);
			drawtextFieldButton.value = "";
			if (!drawtextFieldButton.className.match(/ol-collapsed/g)) {
				drawtextFieldButton.className += " ol-collapsed";
			}
			map.addInteraction(draw);
			drawtextFieldButton.removeEventListener('keypress', DrawText);
			
			return false;
		}
	}
	
	function clickButton (event) {

		var otarget = event.target;
		
		console.log(otarget);
		
		var map = this_.getMap();
		
		if(draw != null){
			console.log("map.removeInteraction(draw)");
			map.removeInteraction(draw);
		}
		
		if(modify != null){
			console.log("map.removeInteraction(modify)");
			map.removeInteraction(modify);
		}
		
		var oldControl = null;
		for (var index = 0; index < buttons.length; index++) {
			var control = buttons[index];
			if (control.className.match(/active/g)) {
				control.className = control.className.replace(/active/g, "");
				oldControl = control;
			}
		}
		if (oldControl != otarget) {
			if(otarget != deleteButton){
				switch(otarget.id){					
					case "Text":
						console.log("Creating Draw Action for text");
						if (drawtextFieldButton.className.match(/ol-collapsed/g)) {
							drawtextFieldButton.addEventListener('keypress', DrawText, true);
							drawtextFieldButton.className = drawtextFieldButton.className.replace(/ol-collapsed/g, '');
							drawtextFieldButton.focus();
						} else {
							drawtextFieldButton.value = "";
							drawtextFieldButton.className += " ol-collapsed";
						}
						return;
					break;
					case "Square":
						console.log("Creating Draw Action for square");
						draw = new ol.interaction.Draw({
							source : options.source,
							type : "Circle",
							geometryFunction : ol.interaction.Draw.createRegularPolygon(4),
							condition: function (event) {
								return true;
							},
							deleteCondition: function (event) {
								return false;
							}
						});
					break;
					case "Circle":
						console.log("Creating Draw Action for square");
						draw = new ol.interaction.Draw({
							source : options.source,
							type : "Circle",
							geometryFunction : ol.interaction.Draw.createRegularPolygon(),
							condition: function (event) {
								return true;
							},
							deleteCondition: function (event) {
								return false;
							}
						});
					break;
					default:
						console.log("Creating default Draw Action");
						draw = new ol.interaction.Draw({
							source : options.source,
							type : otarget.id,
							condition: function (event) {
								return true;
							},
							deleteCondition: function (event) {
								return false;
							}
						});
					break;
				}
				
				console.log("Adding Draw Action to map");
				map.addInteraction(draw);
				
				console.log("Creating Modify Action");
				
				console.log("features sources : "+options.features);
				
				modify = new ol.interaction.Modify({
					features : options.features,
					condition: function (evt) {
						return  true;
					},
					deleteCondition: function (event) {
						return false;
					}
				});
				
				console.log("Adding Modify Action to map");
				map.addInteraction(modify);
				
				map.removeEventListener('click');
			}else{
				console.log("Remove Draw Action from map");
				map.removeInteraction(draw);
				draw = null;
				console.log("Adding Remove Action to map");
				map.addEventListener('click', function(evt) {
					var feature = map.forEachFeatureAtPixel(evt.pixel,
		            function(feature, layer) {
						options.source.removeFeature(feature);
		            });
			    });
			}
			console.log("Set Button Active");
			otarget.className += " active";
		}
	};
	
	var defaultClass = options.className + " ol-unselectable ol-control";

	var drawDivClass = document.createAttribute('class');
	drawDivClass.value = defaultClass + ((options.collapsed) ? ' ol-collapsed' : '');

	drawDiv.setAttributeNode(drawDivClass);

	var drawButton = document.createElement('button');
	drawButton.appendChild(label);

	var drawButtonType = document.createAttribute('type');
	drawButtonType.value = "button";

	var drawButtonTitle = document.createAttribute('title');
	drawButtonTitle.value = options.tipLabel;

	drawButton.setAttributeNode(drawButtonType);
	drawButton.setAttributeNode(drawButtonTitle);

	drawButton.addEventListener('click', function () {

		if (drawDiv.className.match(/ol-collapsed/g)) {
			drawDiv.className = drawDiv.className.replace(/ol-collapsed/g, '');
		} else {
			drawDiv.className += " ol-collapsed";
		}
	});

	var drawPointButton = document.createElement('button');
	var drawPolyButton = document.createElement('button');
	var drawLineButton = document.createElement('button');
	var drawCircleButton = document.createElement('button');
	var drawSquareButton = document.createElement('button');
	var drawSquareButton = document.createElement('button');
	var drawtextButton = document.createElement('button');
	var drawtextFieldButton = document.createElement('input');
	var deleteButton = document.createElement('button');
	var saveButton = document.createElement('a');
	var cloudButton = document.createElement('a');

	var drawButtonsClass = document.createAttribute('class');
	drawButtonsClass.value = "ol-draw-button";

	drawPointButton.setAttributeNode(drawButtonsClass.cloneNode(true));
	drawPolyButton.setAttributeNode(drawButtonsClass.cloneNode(true));
	drawLineButton.setAttributeNode(drawButtonsClass.cloneNode(true));
	drawCircleButton.setAttributeNode(drawButtonsClass.cloneNode(true));
	drawSquareButton.setAttributeNode(drawButtonsClass.cloneNode(true));
	drawtextButton.setAttributeNode(drawButtonsClass.cloneNode(true));
	deleteButton.setAttributeNode(drawButtonsClass.cloneNode(true));
	drawButtonsClass.value += " button";
	saveButton.setAttributeNode(drawButtonsClass.cloneNode(true));
	cloudButton.setAttributeNode(drawButtonsClass.cloneNode(true));

	drawButtonsClass.value = "ol-draw-text-field ol-collapsed";
	drawtextFieldButton.setAttributeNode(drawButtonsClass.cloneNode(true));
	
	var drawtextFieldLength = document.createAttribute('maxlength');
	drawtextFieldLength.value = "15";
	drawtextFieldButton.setAttributeNode(drawtextFieldLength.cloneNode(true));
	
	var drawtextFieldTitle = document.createAttribute('title');
	drawtextFieldTitle.value = "Saisir le texte à afficher";
	drawtextFieldButton.setAttributeNode(drawtextFieldTitle.cloneNode(true));
	
	var drawButtonType = document.createAttribute('type');
	drawButtonType.value = "button";
	
	drawPointButton.setAttributeNode(drawButtonType.cloneNode(true));
	drawPolyButton.setAttributeNode(drawButtonType.cloneNode(true));
	drawLineButton.setAttributeNode(drawButtonType.cloneNode(true));
	drawCircleButton.setAttributeNode(drawButtonType.cloneNode(true));
	drawSquareButton.setAttributeNode(drawButtonType.cloneNode(true));
	drawtextButton.setAttributeNode(drawButtonType.cloneNode(true));
	deleteButton.setAttributeNode(drawButtonType.cloneNode(true));
	saveButton.setAttributeNode(drawButtonType.cloneNode(true));
	cloudButton.setAttributeNode(drawButtonType.cloneNode(true));
	
	var drawButtonType = document.createAttribute('type');
	drawButtonType.value = "text";
	drawtextFieldButton.setAttributeNode(drawButtonType.cloneNode(true));
	
	var drawButtonTarget = document.createAttribute('target');
	drawButtonTarget.value = "_blank";
	saveButton.setAttributeNode(drawButtonTarget);
	
	var drawButtonDownload = document.createAttribute('download');
	var num = 0;
	drawButtonDownload.value = "map_"+num+".png";
	saveButton.setAttributeNode(drawButtonDownload);

	var drawButtonTitle = document.createAttribute('title');
	
	var drawButtonId = document.createAttribute('id');

	drawButtonTitle.value = "Point";
	drawPointButton.setAttributeNode(drawButtonTitle.cloneNode(true));
	drawButtonId.value = "Point";
	drawPointButton.setAttributeNode(drawButtonId.cloneNode(true));

	drawButtonTitle.value = "Polygon";
	drawPolyButton.setAttributeNode(drawButtonTitle.cloneNode(true));
	drawButtonId.value = "Polygon";
	drawPolyButton.setAttributeNode(drawButtonId.cloneNode(true));

	drawButtonTitle.value = "Ligne";
	drawLineButton.setAttributeNode(drawButtonTitle.cloneNode(true));
	drawButtonId.value = "LineString";
	drawLineButton.setAttributeNode(drawButtonId.cloneNode(true));

	drawButtonTitle.value = "Rectangle";
	drawSquareButton.setAttributeNode(drawButtonTitle.cloneNode(true));
	drawButtonId.value = "Square";
	drawSquareButton.setAttributeNode(drawButtonId.cloneNode(true));

	drawButtonTitle.value = "Cercle";
	drawCircleButton.setAttributeNode(drawButtonTitle.cloneNode(true));
	drawButtonId.value = "Circle";
	drawCircleButton.setAttributeNode(drawButtonId.cloneNode(true));
	
	drawButtonTitle.value = "Texte";
	drawtextButton.setAttributeNode(drawButtonTitle.cloneNode(true));
	drawButtonId.value = "Text";
	drawtextButton.setAttributeNode(drawButtonId.cloneNode(true));
	
	drawButtonId.value = "TextInput";
	drawtextFieldButton.setAttributeNode(drawButtonId.cloneNode(true));

	drawButtonTitle.value = "Enregistrer";
	saveButton.setAttributeNode(drawButtonTitle.cloneNode(true));
	
	drawButtonTitle.value = "Enregistrer";
	cloudButton.setAttributeNode(drawButtonTitle.cloneNode(true));

	drawButtonTitle.value = "Effacer";
	deleteButton.setAttributeNode(drawButtonTitle.cloneNode(true));
	drawButtonId.value = "Delete";
	deleteButton.setAttributeNode(drawButtonId.cloneNode(true));

	var labelButtons = document.createElement('span');
	var labelButtonsClass = document.createAttribute('class');

	labelButtonsClass.value = "glyphicons glyphicons-record x1";
	labelButtons.setAttributeNode(labelButtonsClass.cloneNode(true));
	drawPointButton.appendChild(labelButtons.cloneNode(true));

	labelButtonsClass.value = "glyphicons glyphicons-vector-path-polygon x1";
	labelButtons.setAttributeNode(labelButtonsClass.cloneNode(true));
	drawPolyButton.appendChild(labelButtons.cloneNode(true));

	labelButtonsClass.value = "glyphicons glyphicons-vector-path-line x1";
	labelButtons.setAttributeNode(labelButtonsClass.cloneNode(true));
	drawLineButton.appendChild(labelButtons.cloneNode(true));

	labelButtonsClass.value = "glyphicons glyphicons-vector-path-circle x1";
	labelButtons.setAttributeNode(labelButtonsClass.cloneNode(true));
	drawCircleButton.appendChild(labelButtons.cloneNode(true));

	labelButtonsClass.value = "glyphicons glyphicons-vector-path-square x1";
	labelButtons.setAttributeNode(labelButtonsClass.cloneNode(true));
	drawSquareButton.appendChild(labelButtons.cloneNode(true));
	
	labelButtonsClass.value = "glyphicons glyphicons-text-bigger x1";
	labelButtons.setAttributeNode(labelButtonsClass.cloneNode(true));
	drawtextButton.appendChild(labelButtons.cloneNode(true));

	labelButtonsClass.value = "glyphicons glyphicons-cloud-upload x1";
	labelButtons.setAttributeNode(labelButtonsClass.cloneNode(true));
	cloudButton.appendChild(labelButtons.cloneNode(true));
	
	labelButtonsClass.value = "glyphicons glyphicons-floppy-save x1";
	labelButtons.setAttributeNode(labelButtonsClass.cloneNode(true));
	saveButton.appendChild(labelButtons.cloneNode(true));

	labelButtonsClass.value = "glyphicons glyphicons-bin x1";
	labelButtons.setAttributeNode(labelButtonsClass.cloneNode(true));
	deleteButton.appendChild(labelButtons.cloneNode(true));
	
	drawDiv.appendChild(drawButton);
	drawDiv.appendChild(drawPointButton);
	drawDiv.appendChild(drawPolyButton);
	drawDiv.appendChild(drawLineButton);
	drawDiv.appendChild(drawCircleButton);
	drawDiv.appendChild(drawSquareButton);
	drawDiv.appendChild(drawtextButton);
	drawDiv.appendChild(drawtextFieldButton);
	drawDiv.appendChild(deleteButton);
	drawDiv.appendChild(saveButton);
	if(options.saveURL != null){
		drawDiv.appendChild(cloudButton);
	}
	
	saveButton.addEventListener('click', function (event){
		var map = this_.getMap();
		
		map.once('postcompose', function(event) {
			var canvas = event.context.canvas;
			saveButton.href = canvas.toDataURL('image/png');
        });
        map.renderSync();
        num++;
        
        var drawButtonDownload = document.createAttribute('download');
    	drawButtonDownload.value = "map_"+num+".png";
    	saveButton.setAttributeNode(drawButtonDownload);
    	
	}, false);
	
	cloudButton.addEventListener('click', function (event){
		
		var geojson  = new ol.format.GeoJSON();
		
		var features = geojson.writeFeatures(options.source.getFeatures());
		
		var datasToSend = extend({}, {drawingLayer: features}, options.saveDatas);
		
		datasToSend = JSON.stringify(datasToSend);
		
		var xhttp = new XMLHttpRequest();
		xhttp.open("POST", options.saveURL, false);
		xhttp.setRequestHeader("Content-Type", 'application/json');
		xhttp.onload = function() {
			if (xhttp.readyState === 4) {
				if (xhttp.status === 200) {
					var oResponse = JSON.parse(xhttp.responseText);
					if(oResponse.success){
						alert(oResponse.msg);
					}else{
						alert(oResponse.msg);
					}
				} else {
					alert(xhttp.statusText);
				}
			}
		};
		var sResponse = xhttp.send(datasToSend);
	}, false);
	

	function extend () {
		for (var i = 1; i < arguments.length; i++){
			for ( var key in arguments[i]){
				if (arguments[i].hasOwnProperty(key)){
					arguments[0][key] = arguments[i][key];
				}
			}
		}
		return arguments[0];
	}
	  
	
	buttons = [ drawPointButton, drawPolyButton, drawLineButton, drawCircleButton, drawSquareButton, drawtextButton, deleteButton ];

	for (var index = 0; index < buttons.length; index++) {
		var button = buttons[index];
		button.removeEventListener('click', clickButton);
		
		button.addEventListener('click', function (event) {
			clickButton(event);
		});
	}
};
ol.inherits(Draw, ol.control.Control);