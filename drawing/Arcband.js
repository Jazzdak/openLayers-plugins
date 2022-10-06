/**
 * 
 * Code source inspiré et adapté de RRAMUHN : contact@rramuhn.org
 * 
 * @param map ol.Map
 * @param source ol.source.Vector
 * @param position String, exemple : "48.07854514 2.4561315"
 * @param innerRadius Float
 * @param outerRadius Float
 * @param startAngle Int
 * @param openingAngle Int
 */
function DrawArcband(map, source, position, innerRadius, outerRadius, startAngle, openingAngle) {

    var pointList = [];
    var R = 6371;
    var segments = 360;
    var dAngle = segments + 1;
    var azimuth;
    var aPosition = position.split(" ");
	var coordinates = [deg2Rad(parseFloat(aPosition[1])), deg2Rad(parseFloat(aPosition[0]))];
	var coordinatesSnd = [];
	var oProjection = map.getView().getProjection();
	
    startAngle = deg2Rad(startAngle);
    openingAngle = deg2Rad(openingAngle);
    for (var i = 0; i < dAngle; i++) {
        azimuth = startAngle - (startAngle - openingAngle) * i / (dAngle - 1);
        coordinatesSnd[1] = Math.asin(Math.sin(coordinates[1]) * Math.cos(outerRadius / 1000 / R) + Math.cos(coordinates[1]) * Math.sin(outerRadius / 1000 / R) * Math.cos(azimuth));
        coordinatesSnd[0] = coordinates[0] + Math.atan2(Math.sin(azimuth) * Math.sin(outerRadius / 1000 / R) * Math.cos(coordinates[1]), Math.cos(outerRadius / 1000 / R) - Math.sin(coordinates[1]) * Math.sin(coordinatesSnd[1]));
        coordinatesSnd[1] = 180 * coordinatesSnd[1] / Math.PI;
        coordinatesSnd[0] = 180 * coordinatesSnd[0] / Math.PI;
        var point = ol.proj.fromLonLat(coordinatesSnd, oProjection);
        pointList.push(point);

    }

    for (var i = dAngle - 1; i >= 0; i--) {
        azimuth = startAngle - (startAngle - openingAngle) * i / (dAngle - 1);
        coordinatesSnd[1] = Math.asin(Math.sin(coordinates[1]) * Math.cos(innerRadius / 1000 / R) + Math.cos(coordinates[1]) * Math.sin(innerRadius / 1000 / R) * Math.cos(azimuth));
        coordinatesSnd[0] = coordinates[0] + Math.atan2(Math.sin(azimuth) * Math.sin(innerRadius / 1000 / R) * Math.cos(coordinates[1]), Math.cos(innerRadius / 1000 / R) - Math.sin(coordinates[1]) * Math.sin(coordinatesSnd[1]));
        coordinatesSnd[1] = 180 * coordinatesSnd[1] / Math.PI;
        coordinatesSnd[0] = 180 * coordinatesSnd[0] / Math.PI;
        var point = ol.proj.fromLonLat(coordinatesSnd, oProjection);
        pointList.push(point);
    }
    
    var polygon = new ol.geom.Polygon( [pointList] );
	var polygonFeature = new ol.Feature({
		geometry : polygon
	});
	
	var polygon_extent = polygon.getExtent();

	source.addFeature(polygonFeature);
	
	map.getView().setCenter(ol.extent.getCenter(polygon_extent));
	map.getView().fit(polygon_extent, map.getSize());
}

function deg2Rad(degrees) {
    return degrees * Math.PI / 180;
}