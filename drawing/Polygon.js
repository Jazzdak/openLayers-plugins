/**
 * @param map ol.Map
 * @param source ol.source.Vector
 * @param coordinates Array<ol.Coordinate>
 */

function DrawPolygon (map, source, coordinates) {

	var oProjection = map.getView().getProjection();
	
	var list = [];

	for (var i = 0; i < coordinates.length; i++) {
		var coordinate = coordinates[i];
		
		var oPoint = ol.proj.fromLonLat(coordinate, oProjection);
		
		list.push(oPoint);
	}

	var polygon = new ol.geom.Polygon([list]);
	var polygonFeature = new ol.Feature({
		geometry : polygon
	});
	source.addFeature(polygonFeature);
	
	var polygon_extent = polygon.getExtent();
	
	map.getView().setCenter(ol.extent.getCenter(polygon_extent));
	map.getView().fit(polygon_extent, map.getSize());
}