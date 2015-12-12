/*
    Pinpoint v1.0.0
*/

function Pinpoint(opts){
    'use strict';
    
    if (window.L == null) {
        throw("Leaflet.js not present on page.");
    }

    var that = this;
    this.opts = opts;
    this.opts.el = this.opts.element ||this.opts.el || '#map-el';
    this.element = document.querySelector(this.opts.el);
    this.opts.basemap = opts.basemap || 'http://{s}.tile.osm.org/{z}/{x}/{y}.png';
    this.opts.basemapCredit = opts.basemapCredit || '<a href="http://leafletjs.com" title="A JS library for interactive maps">Leaflet</a> | &copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors';
    
    this.addElements();
    this.fillText();
    this.setAspectRatio();
    this.setupMap();
    this.calcBounds();
    
    this.disableInteraction();
    
    if (this.opts.creation) {
        this.enableInteraction();
        this.map.remove();
        this.map.setMaxBounds( null );
        this.setupMap({nozoomlimits: true});
        
    }

    this.element.querySelector('.map-outer').addEventListener( 'click', this.enableInteraction.bind(that) );
    
    if (opts.minimap) {
        this.addMinimap();
    }
    
    for (var i = 0; i < opts.markers.length; i++) {
        this.addMarker(opts.markers[i], i);
    }
    
    if (opts.geojson) {
        this.addGeoJSON(opts.geojson);
    }
    
    if (typeof Iframe !== 'undefined') {
        var fm = Iframe.init();
    }
    this.onResize(function(){
        that.setAspectRatio();
    });
}

Pinpoint.prototype.addElements = function(){
    
    var pointer = '<!-- Generator: Adobe Illustrator 16.0.1, SVG Export Plug-In . SVG Version: 6.00 Build 0)  --><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg version="1.1" id="Layer_5" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"	 width="13.312px" height="15.267px" viewBox="0 0 13.312 15.267" enable-background="new 0 0 13.312 15.267" xml:space="preserve"><path fill="#697379" d="M13.312,6.4c0.002-1.229-2.215-1.265-2.203,0.008c0,0,0-0.604,0-0.846c0.016-1.146-2.188-1.216-2.2,0.007	v-0.44c0-1.251-2.307-1.277-2.307,0.007c0,0,0-2.586,0-4.218c0-1.203-2.341-1.246-2.341,0.005v7.485L2.049,6.199	C1.292,5.286-0.58,6.604,0.177,7.68l5.129,6.233c0,0,1.097,1.354,3.285,1.354c1.963,0,2.704-0.394,3.481-1.2	c0.754-0.78,1.24-1.657,1.24-2.938C13.312,10.76,13.312,7.192,13.312,6.4z"/></svg>';
    var html = '<p class="pinpoint-hed"></p>'+
    '<p class="pinpoint-dek"></p>'+
    '<div class="map-outer inactive">'+
        '<span class="map-cover"></span>'+
        '<span class="image-interactive-icon">'+pointer+'<span class="image-interactive-icon-text">Zoom/Pan</span></span>'+
        '<span class="image-interactive-icon image-interactive-icon-hover">'+pointer.replace('#697379','white')+'<span class="image-interactive-icon-text">Zoom/Pan</span></span>'+
        '<div class="map-inner"></div>'+
   ' </div>'+
   ' <p class="pinpoint-note"></p>'+
   ' <p class="pinpoint-source">'+this.opts.basemapCredit+'</p>';
    this.element.innerHTML = html;
}

Pinpoint.prototype.setAspectRatio = function(){
    
    if( !this.element.querySelector('.map-inner') ){
        return;
    }
    
    
    var aspectRatios = {
        "tall": 1.2,
        "square": 1,
        "wide": (2/3)
    };
    
    var aspectRatio = aspectRatios[this.opts['aspect-ratio']];
    var newHeight = this.element.querySelector('.map-inner').offsetWidth * aspectRatio;
    var widthEls = this.element.querySelectorAll('.map-inner, .map-cover');
    for (var i = 0; i < widthEls.length; i++) {
        widthEls[i].style.height = newHeight+'px';
    }
    
    if (this.map) {
        this.map.invalidateSize();
    }
        
}

Pinpoint.prototype.setupMap = function(mapopts){
    
    var opts = this.opts;
    
    var maxZoom = opts.zoom +1;
    var minZoom = opts.zoom -1;
    if (mapopts && mapopts.nozoomlimits) {
        maxZoom = 20;
        minZoom = 1;
    }

	var mapOptions = {
		scrollWheelZoom: true,
		keyboard: false,
        maxZoom: maxZoom,
        minZoom: minZoom,
        attributionControl: false
	};
    
    var mapEl = this.element.querySelector('.map-inner');
	this.map = L.map(mapEl, mapOptions)
		.setView([opts.lat, opts.lon], opts.zoom);
    L.control.scale({ position: 'topright' }).addTo(this.map); // scale bar
    // put miles on top of km
    var scaleParent = this.element.querySelector('.leaflet-control-scale.leaflet-control');
    var scaleLine = scaleParent.querySelector('.leaflet-control-scale-line');
    scaleParent.appendChild(scaleLine);

	L.tileLayer(this.opts.basemap).addTo(this.map);
    
    if (opts.dragend) {
        this.map.on('dragend',opts.dragend);
    }
    if (opts.zoomend) {
        this.map.on('zoomend',opts.zoomend);
    }
    
}
    
Pinpoint.prototype.addMarker = function(mopts, index){
    this.markers = this.markers || [];
    mopts.icon = mopts.icon || 'circle'; 
    // set the icon type
	var squareIcon = L.divIcon({
        className: 'marker-icon marker-icon-'+mopts.icon
    });
	var icon = L.marker(
		[mopts.lat, mopts.lon],
		{
            icon: squareIcon,
            draggable: this.opts.creation,
            title: index
		}
	).addTo(this.map);
    mopts.label = mopts.label || 'plain'; 
    var labelDir = mopts["label-direction"] || 'north';
    if (mopts.label === 'callout') {
        var textBox = L.divIcon({
            className: 'marker-label-callout '+labelDir,
            html: '<div class="marker-inner">'+mopts.text+'</div>'
        });
    } else if (mopts.label === 'plain') {
        var textBox = L.divIcon({
            className: 'marker-label-plain '+labelDir,
            html: '<div class="marker-inner">'+mopts.text+'</div>'
        });
    }
	var text = L.marker(
		[mopts.lat, mopts.lon],
		{
            icon: textBox
		}
	).addTo(this.map);
    
    // you can set .my-div-icon styles in CSS

    // L.marker([50.505, 30.57]).addTo(map);
    
    var miList = this.element.querySelectorAll('.marker-inner');
    for (var i = 0; i < miList.length; i++) {
        var mi = miList[i];
    	mi.style.marginLeft = (-mi.offsetWidth/2)+'px';
    	setTimeout((function(){
        	mi.style.marginLeft = (-mi.offsetWidth/2)+'px';
    	}).bind(this),100);
    }
    
    if (this.opts.markerdragend) {
        icon.on('dragend', this.opts.markerdragend);
    }
    
    this.markers.push({
        icon: icon,
        text: text
    });
}

Pinpoint.prototype.addMinimap = function(){
	var minitiles = L.tileLayer(
	this.opts.basemap, {
		attribution: ''
	});

    var miniMap = new L.Control.MiniMap(minitiles, {
        zoomLevelOffset: this.opts['minimap-zoom-offset'] || -5,
        width: 100,
        height: 100,
        aimingRectOptions: {
            color: 'black',
            weight: 1,
            opacity: 1,
            fillColor: '#999',
            fillOpacity: 0
        }
    }).addTo(this.map);
    
    // Disable drag and zoom handlers.
    miniMap._miniMap.dragging.disable();
    miniMap._miniMap.touchZoom.disable();
    miniMap._miniMap.doubleClickZoom.disable();
    miniMap._miniMap.scrollWheelZoom.disable();

    // Disable tap handler, if present.
    if (miniMap._miniMap.tap) miniMap._miniMap.tap.disable();
    
            
}

Pinpoint.prototype.calcBounds = function(){
    var that = this;
    
    var bounds = calcNewMaxBounds(this.map);    
    this.map.setMaxBounds( bounds );
    
    function calcNewMaxBounds(map){
        // add an extra 30% margin to bounds
        var boundScaleFactor = 1/3;
        
        var current = map.getBounds();
        var hori = Math.abs( current._southWest.lng - current._northEast.lng ) * boundScaleFactor;
        var vert = Math.abs( current._southWest.lat - current._northEast.lat ) * boundScaleFactor;
        var southWest = {
            lat: current._southWest.lat - vert,
            lng: current._southWest.lng - hori
        }
        var northEast = {
            lat: current._northEast.lat + vert,
            lng: current._northEast.lng + hori
        }
        return L.latLngBounds(southWest, northEast);
        
    }
}

Pinpoint.prototype.fillText = function(){
    if (this.opts.hed && (this.opts.hed.length > 0)) {
        this.element.querySelector('.pinpoint-hed').innerText = this.opts.hed;
    } else {
        this.element.querySelector('.pinpoint-hed').style.display = 'none';
    }
    if (this.opts.dek && (this.opts.dek.length > 0)) {
        this.element.querySelector('.pinpoint-dek').innerText = this.opts.dek;
    } else {
        this.element.querySelector('.pinpoint-dek').style.display = 'none';
    }
    if (this.opts.note && (this.opts.note.length > 0)) {
        this.element.querySelector('.pinpoint-note').innerHTML = this.opts.note;
    } else {
        this.element.querySelector('.pinpoint-note').style.display = 'none';
    }
    var hedDek = this.element.querySelectorAll('.pinpoint-hed, .pinpoint-dek');
    for (var i = 0; i < hedDek.length; i++) {
        var element = hedDek[i];
        if (element.offsetWidth > 0 && element.offsetHeight > 0) {
            element.className = element.className+' pinpoint-topline';
        }
    }
}

Pinpoint.prototype.disableInteraction = function(){
    var map = this.map;
    this.element.querySelector('.map-outer').className += ' inactive';
    // map.dragging.disable();
    // map.touchZoom.disable();
    // map.doubleClickZoom.disable();
    // // map.scrollWheelZoom.disable();
    // map.boxZoom.disable();
    // map.keyboard.disable();
    return this;
}

Pinpoint.prototype.enableInteraction = function(){
    var map = this.map;
    var outer = this.element.querySelector('.map-outer');
    outer.className = outer.className.replace(/inactive/g,'');
    
    // map.dragging.enable();
    // map.touchZoom.enable();
    // map.doubleClickZoom.enable();
    // // map.scrollWheelZoom.enable();
    // map.boxZoom.enable();
    // map.keyboard.enable();
    return this;
}

Pinpoint.prototype.remove = function(){
    clearInterval( this.resizeInterval );
    this.map.outerHTML = '';
    this.element.innerHTML = '';
}

Pinpoint.prototype.addGeoJSON = function(geojson){
    var map = this.map;
    var features = geojson.features;
    for (var i = 0; i < features.length; i++) {
        if (features[i].geometry && features[i].geometry) {
            if (features[i].properties && features[i].properties.pinpointStyle) {
                var styleName = features[i].properties.pinpointStyle;
            } else {
                var styleName = '';
            }
            var type = features[i].geometry.type;
            if ( isOneOf( type, ["LineString", "MultiLineString", "Polygon", "MultiPolygon"]) ) {
                L.geoJson(features[i].geometry, {
                    style: {
                        className: 'pinpoint-geojson '+styleName
                    }
                }).addTo(map);
            
            }
        }
    }
    
    function isOneOf( needle, haystack ){
        for (var i = 0; i < haystack.length; i++) {
            if (haystack[i] === needle) {
                return true;
            }
        }
        return false;
    }
}

Pinpoint.prototype.onResize = function(callback) {
    var currentWidth = this.element.offsetWidth;
    this.resizeInterval = setInterval(function(){
        if (currentWidth !== this.element.offsetWidth) {
            currentWidth = currentWidth;
            callback();
        }
    }.bind(this), 50);
}