function Goto(_options) {
	
	var this_ = this;
	
	function DMStoLL(degrees, minutes, seconds){
	   return parseFloat(parseFloat(degrees) + parseFloat(minutes) / 60 + parseFloat(seconds) / 3600);
	};
	
	function checkcoordinates(event){
		var key = event.which || event.keyCode;
		if(key == 13){
			var HDMS = /^([0-9]+)\°\s?([0-9]+)\'\s?([0-9]+\.?[0-9]+)\"\s?(N|S|E|W)/g;
			var DD = /^[0-9]+\.[0-9]+/g;
			var Natif = /^^[0-9]{6,8}[.][0-9]{1,4}/g;
			
			if((gotoFieldLon.value != null && gotoFieldLon.value.trim().length > 0) && (gotoFieldLat.value != null && gotoFieldLat.value.trim().length > 0)){
				var DDLon = null;
				var DDLat = null;
				if(gotoFieldLon.value.match(HDMS)){
					var matches = HDMS.exec(gotoFieldLon.value);
					DDLon = DMStoLL(matches[1], matches[2], matches[3]);
					if(!DDLon.toString().match(DD)){
						return;
					}
				}else if(gotoFieldLon.value.match(DD)){
					DDLon = gotoFieldLon.value;
				}else if(gotoFieldLon.value.match(Natif)){
					DDLon = gotoFieldLon.value;
				}else{
					alert('Longitude : Format inconnu.');
					return;
				}
				if(gotoFieldLat.value.match(HDMS)){
					var matches = HDMS.exec(gotoFieldLat.value);
					var DDLat = DMStoLL(matches[1], matches[2], matches[3]);
					if(!DDLat.toString().match(DD)){
						return;
					}
				}else if(gotoFieldLat.value.match(DD)){
					DDLat = gotoFieldLat.value;
				}else if(gotoFieldLat.value.match(Natif)){
					DDLat = gotoFieldLat.value;
				}else{
					alert('Latitude : Format inconnu.');
					return;
				}
				
				console.log([DDLon,DDLat]);
				
				var map = this_.getMap();
				var view = map.getView();
				
				if(!gotoFieldLat.value.match(Natif) && !gotoFieldLon.value.match(Natif)){
					var coords = ol.proj.fromLonLat([DDLat,DDLon],view.getProjection());
				}else{
					var coords = [DDLon,DDLat];
				}
				var iconFeature = new ol.Feature({
					geometry: new ol.geom.Point(coords),
					name: gotoFieldLon.value+', '+gotoFieldLat.value
				});
				
				options.source.addFeature(iconFeature);
				
				view.setCenter(coords);
				view.setZoom(12);
			}else{
				var message = "Erreur:\r\n";
				if((gotoFieldLon.value == null || gotoFieldLon.value.trim().length == 0)){
					message += "La longitude n'est pas renseignée.\r\n";
				}
				if((gotoFieldLat.value == null || gotoFieldLat.value.trim().length == 0)){
					message += "La latitude n'est pas renseignée.";
				}
				alert(message);
			}
		}
	};
	
	var Ext_options = _options || {};

	var gotoDiv = document.createElement('div');
	
	var label = document.createElement('span');
	var labelClass = document.createAttribute('class');
	labelClass.value = "fa fa-search";
	
	label.setAttributeNode(labelClass);
	
	var options = {
		element: ((null != Ext_options.element)?Ext_options.element : gotoDiv),
		target: ((null != Ext_options.target)?Ext_options.target : null),
		className: ((null != Ext_options.className)?Ext_options.className : "ol-goto"),
		collapsible: ((null != Ext_options.collapsible)?Ext_options.collapsible : true),
		collapsed:((null != Ext_options.collapsed)? Ext_options.collapsed : true),
		tipLabel: ((null != Ext_options.tipLabel)?Ext_options.tipLabel : "Aller à"),
		label: ((null != Ext_options.label)?Ext_options.label : label),
		source: ((null != Ext_options.source)?Ext_options.source : null)
	};
	
	if(options.source == null && typeof options.source == "ol.source.Vector"){
		alert('Une source valide est necessaire pour le control Goto.');
		return;
	}
	
	var defaultClass = options.className+" ol-unselectable ol-control";
	
	var gotoDivClass = document.createAttribute('class');
	gotoDivClass.value = defaultClass+((options.collapsed)?' ol-collapsed':'');
	
	gotoDiv.setAttributeNode(gotoDivClass);
	
	var gotoButton = document.createElement('button');
	
	var gotoButtonType = document.createAttribute('type');
	gotoButtonType.value = "button";
	
	var gotoButtonTitle = document.createAttribute('title');
	gotoButtonTitle.value = options.tipLabel;
	
	gotoButton.setAttributeNode(gotoButtonType);
	gotoButton.setAttributeNode(gotoButtonTitle);
	
	var gotoFieldType = document.createAttribute('type');
	gotoFieldType.value = "text";
	
	var gotoFieldId = document.createAttribute('id');
	gotoFieldId.value = "gotoLon";
	
	var gotoFieldLength = document.createAttribute('maxlength');
	gotoFieldLength.value = "15";
	
	var gotoFieldTitle = document.createAttribute('title');
	
	var gotoFieldClass = document.createAttribute('class');
	gotoFieldClass.value = "ol-goto-input";
	
	var gotoFieldLat = document.createElement('input');
	
	gotoFieldLat.setAttributeNode(gotoFieldType.cloneNode(true));
	gotoFieldLat.setAttributeNode(gotoFieldId.cloneNode(true));
	gotoFieldLat.setAttributeNode(gotoFieldLength.cloneNode(true));
	gotoFieldLat.setAttributeNode(gotoFieldClass.cloneNode(true));
	gotoFieldTitle.value="Latitude";
	gotoFieldLat.setAttributeNode(gotoFieldTitle.cloneNode(true));
	
	var gotoFieldLon = document.createElement('input');
	
	gotoFieldLon.setAttributeNode(gotoFieldType.cloneNode(true));
	gotoFieldLon.setAttributeNode(gotoFieldId.cloneNode(true));
	gotoFieldLon.setAttributeNode(gotoFieldLength.cloneNode(true));
	gotoFieldLon.setAttributeNode(gotoFieldClass.cloneNode(true));
	gotoFieldTitle.value="Longitude";
	gotoFieldLon.setAttributeNode(gotoFieldTitle.cloneNode(true));
	
	var virguleSpan = document.createElement('span');
	var virguleText = document.createTextNode(', ');
	virguleSpan.appendChild(virguleText);
	
	gotoButton.appendChild(options.label);
	gotoDiv.appendChild(gotoButton);
	gotoDiv.appendChild(gotoFieldLon);
	gotoDiv.appendChild(virguleSpan);
	gotoDiv.appendChild(gotoFieldLat);
	
	gotoButton.addEventListener('click', function(){
		if(gotoDiv.className.match(/ol-collapsed/g)){
			gotoDiv.className = gotoDiv.className.replace(/ol-collapsed/g, '');
		}else{
			gotoDiv.className += " ol-collapsed";
		}
	});
	
	gotoFieldLon.removeEventListener('keyup', checkcoordinates);
	
	gotoFieldLon.addEventListener('keyup', function(event){
		checkcoordinates(event);
	});
	
	gotoFieldLat.removeEventListener('keyup', checkcoordinates);
	
	gotoFieldLat.addEventListener('keyup', function(event){
		checkcoordinates(event);
	});
	
	ol.control.Control.call(this, {
	    element: options.element,
	    target: options.target
	});
	
};
ol.inherits(Goto, ol.control.Control);