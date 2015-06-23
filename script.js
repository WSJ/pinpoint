$(function(){
    
    var map = new Pinpoint({
        "lat": 51.504864,
        "lon": -0.087765,
        "zoom": 15,
        "aspect-ratio": "square",
        "minimap": true,
        "basemap": "https://{s}.tiles.mapbox.com/v3/wsjgraphics.ilj8ej2b/{z}/{x}/{y}.png",
        "basemapCredit": "<a href=\"http://leafletjs.com\" title=\"A JS library for interactive maps\">Leaflet</a> | &copy; <a href=\"https://www.mapbox.com/about/maps\">Mapbox</a> | <a href=\"http://openstreetmap.org/copyright\">&copy; OpenStreetMap</a>",
        "markers": [
            {
                "text": "The News Building",
                "lat": 51.505864,
                "lon": -0.087765,
                "icon": "square",
                "label": "callout"
            }
        ]
    });
    

    
});

