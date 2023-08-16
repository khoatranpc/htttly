// $("#document").ready(function () {
    var format = 'image/png';
    var map;
    var vectorLayer;
//thay tọa độ VN
    var minX = 106.356674195;
    var minY = 10.354226112;
    var maxX = 107.027275086;
    var maxY = 11.160309792;

    var cenX = (minX + maxX) / 2;
    var cenY = (minY + maxY) / 2;
    var mapLat = cenY;
    var mapLng = cenX;
    var mapDefaultZoom = 8.8;
    function initialize_map() {
        //*
        layerBG = new ol.layer.Tile({
            source: new ol.source.OSM({})
        });
        //*/
        var layerCMR_adm1 = new ol.layer.Image({
            source: new ol.source.ImageWMS({
              ratio: 1,
              url: "http://localhost:8080/geoserver/btl/wms?",
              params: {
                FORMAT: format,
                VERSION: "1.1.1",
                STYLES: "",
                LAYERS: "hcm_boundary",
              },
            }),
          });
        var viewMap = new ol.View({
            center: ol.proj.fromLonLat([mapLng, mapLat]),
            zoom: mapDefaultZoom
            //projection: projection
        });
        map = new ol.Map({
            target: "map",
            layers: [layerBG, layerCMR_adm1],

            //layers: [layerCMR_adm1],

            view: viewMap
        });
        // map.getView().fit(bounds, map.getSize());
        
        var styles = {
            'MultiPolygon': new ol.style.Style({
                stroke: new ol.style.Stroke({
                    color: 'red', 
                    width: 3
                })
            })
        };
        var styleFunction = function (feature) {
            return styles[feature.getGeometry().getType()];
        };
        vectorLayer = new ol.layer.Vector({
            // source: vectorSource,
            style: styleFunction
        });
        map.addLayer(vectorLayer);

        function createJsonObj(result) {                    
            var geojsonObject = '{'
                    + '"type": "FeatureCollection",'
                    + '"crs": {'
                        + '"type": "name",'
                        + '"properties": {'
                            + '"name": "EPSG:4326"'
                        + '}'
                    + '},'
                    + '"features": [{'
                        + '"type": "Feature",'
                        + '"geometry": ' + result
                    + '}]'
                + '}';
            return geojsonObject;
        }

        function drawGeoJsonObj(paObjJson) {
            var vectorSource = new ol.source.Vector({
                features: (new ol.format.GeoJSON()).readFeatures(paObjJson, {
                    dataProjection: 'EPSG:4326',
                    featureProjection: 'EPSG:3857'
                })
            });
            vectorLayer = new ol.layer.Vector({
                source: vectorSource
            });
            map.addLayer(vectorLayer);
        }

        function displayObjInfo(result)
        {
            if(result != "null"){
                $("#info").html(result);
            }else{
                $("#info").html("");
            }
            
        }

        function highLightGeoJsonObj(paObjJson) {
            var vectorSource = new ol.source.Vector({
                features: (new ol.format.GeoJSON()).readFeatures(paObjJson, {
                    dataProjection: 'EPSG:4326',
                    featureProjection: 'EPSG:3857'
                })
            });
            vectorLayer.setSource(vectorSource);

            /*

            var vectorLayer = new ol.layer.Vector({
                source: vectorSource
            });
            map.addLayer(vectorLayer);

            */

        }

        function highLightObj(result) {
            //alert("result: " + result);
            var strObjJson = createJsonObj(result);
            //alert(strObjJson);
            var objJson = JSON.parse(strObjJson);
            //alert(JSON.stringify(objJson));
            // drawGeoJsonObj(objJson);
            highLightGeoJsonObj(objJson);
        }

        map.on('singleclick', function (evt) {
            //alert("coordinate org: " + evt.coordinate);
            //var myPoint = 'POINT(12,5)';
            var lonlat = ol.proj.transform(evt.coordinate, 'EPSG:3857', 'EPSG:4326');
            var lon = lonlat[0];
            var lat = lonlat[1];
            var myPoint = 'POINT(' + lon + ' ' + lat + ')';
            //alert("myPoint: " + myPoint);
            //*
            $.ajax({
                type: "POST",
                url: "models/CMR_pgsqlAPI.php",
                //dataType: 'json',
                //data: {functionname: 'reponseGeoToAjax', paPoint: myPoint},
                data: {functionname: 'getInfoCMRToAjax', paPoint: myPoint},
                success : function (result, status, erro) {
                    displayObjInfo(result );
                },
                error: function (req, status, error) {
                    alert(req + " " + status + " " + error);
                }
            });
            $.ajax({
                type: "POST",
                url: "models/CMR_pgsqlAPI.php",
                //dataType: 'json',
                data: {functionname: 'getGeoCMRToAjax', paPoint: myPoint},
                success : function (result, status, erro) {
                    highLightObj(result);
                },
                error: function (req, status, error) {
                    alert(req + " " + status + " " + error);
                }
            });
            //*/
        });


    };
    function search(){
                function createJsonObj(result) {                    
            var geojsonObject = '{'
                    + '"type": "FeatureCollection",'
                    + '"crs": {'
                        + '"type": "name",'
                        + '"properties": {'
                            + '"name": "EPSG:4326"'
                        + '}'
                    + '},'
                    + '"features": [{'
                        + '"type": "Feature",'
                        + '"geometry": ' + result
                    + '}]'
                + '}';
            return geojsonObject;
        }

        function drawGeoJsonObj(paObjJson) {
            var vectorSource = new ol.source.Vector({
                features: (new ol.format.GeoJSON()).readFeatures(paObjJson, {
                    dataProjection: 'EPSG:4326',
                    featureProjection: 'EPSG:3857'
                })
            });
            vectorLayer = new ol.layer.Vector({
                source: vectorSource
            });
            map.addLayer(vectorLayer);
        }

        function displayObjInfo(result)
        {
            //alert("result: " + result);
            //alert("coordinate des: " + coordinate);
            $("#info").html(result);
        }

        function highLightGeoJsonObj(paObjJson) {
            var vectorSource = new ol.source.Vector({
                features: (new ol.format.GeoJSON()).readFeatures(paObjJson, {
                    dataProjection: 'EPSG:4326',
                    featureProjection: 'EPSG:3857'
                })
            });
            vectorLayer.setSource(vectorSource);

            /*

            var vectorLayer = new ol.layer.Vector({
                source: vectorSource
            });
            map.addLayer(vectorLayer);

            */

        }
        function highLightObj(result) {
            //alert("result: " + result);
            var strObjJson = createJsonObj(result);
            //alert(strObjJson);
            var objJson = JSON.parse(strObjJson);
            //alert(JSON.stringify(objJson));
            // drawGeoJsonObj(objJson);
            highLightGeoJsonObj(objJson);
        }



        $key = $("#key").val();
        $input = $("#input").val();

        if($key == 1)
        {
            $.ajax({
                url: "models/CMR_pgsqlAPI.php",
                type: "POST",
                data: {
                    functionname: 'searchbydistrict',
                    Input: $input,
                },
                success : function (result, status, erro) {
                    highLightObj(result);
                },
                error: function (req, status, error) {
                    alert(req + " " + status + " " + error);
                }
    
            }),
            $.ajax({
                type: "POST",
                url: "models/CMR_pgsqlAPI.php",
                //dataType: 'json',
                //data: {functionname: 'reponseGeoToAjax', paPoint: myPoint},
                data: {functionname: 'getinfosearchbydistrict', Input: $input},
                success : function (result, status, erro) {
                    console.log(result);
                    displayObjInfo(result);
                },
                error: function (req, status, error) {
                    alert(req + " " + status + " " + error);
                }
            });
        }
        else{
            $.ajax({
                url: "assets/script.js",
                type: "POST",
                data: {
                    functionname: 'searchbyward',
                    Input: $input,
                },
                success : function (result, status, erro) {
                    highLightObj(result);
                },
                error: function (req, status, error) {
                    alert(req + " " + status + " " + error);
                }
    
            })
        }
    }

// });