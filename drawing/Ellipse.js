/**
 * @param map ol.Map
 * @param source ol.source.Vector
 * @param position String, exemple : "48.07854514 2.4561315"
 * @param semiMajorAxis Float
 * @param semiMinorAxis Float
 * @param orientation Int
 */

function DrawEllipse (map, source, position, semiMajorAxis, semiMinorAxis, orientation) {

	var radiusX = semiMajorAxis;
	var radiusY = semiMinorAxis;

	var rot = deg2Rad(orientation);

	var aPosition = position.split(" ");
	
	var coordinates = [parseFloat(aPosition[1]), parseFloat(aPosition[0])];
	
	var oProjection = map.getView().getProjection();
	
	coordinates = ol.proj.fromLonLat(coordinates, oProjection);
	
	var list = [];

	for (var i = 0 * Math.PI; i < 2 * Math.PI; i += 0.01) {	
		xPos = parseFloat(coordinates[0]) - (radiusX * Math.sin(i)) * Math.sin(rot) + (radiusY * Math.cos(i)) * Math.cos(rot);
		yPos = parseFloat(coordinates[1]) + (radiusY * Math.cos(i)) * Math.sin(rot) + (radiusX * Math.sin(i)) * Math.cos(rot);

		var oPoint = [xPos, yPos];

		list.push(oPoint);
	}

	var linear_ring = new ol.geom.LinearRing(list);
	var linear_ring_extent = linear_ring.getExtent();
	
	var polygon = new ol.geom.Polygon();
	polygon.appendLinearRing(linear_ring);
	var polygonFeature = new ol.Feature({
		geometry : polygon
	});
	source.addFeature(polygonFeature);
	
	map.getView().setCenter(ol.extent.getCenter(linear_ring_extent));
	map.getView().fit(linear_ring_extent, map.getSize());
}

function deg2Rad(degrees) {
    return degrees * Math.PI / 180;
}