# Pinpoint

A JavaScript library for creating beautifully simple maps in seconds, developed at The Wall Street Journal.

- [Example on WSJ.com](http://www.wsj.com/articles/when-napoleon-met-his-waterloo-he-was-out-of-town-1433894903)
- [Blog post](http://ejb.github.io/2015/03/21/pinpoint-maps-at-wsj.html)

## Features

- Map settings are stored in a simple JSON format and can be generated using [Pinpoint Editor](https://github.com/dowjones/pinpoint-editor).
- Fully responsive with touch-friendly "click-to-activate" behaviour.
- Powered by the awesome [Leaflet.js](http://leafletjs.com).

## Quickstart

Include:

- `pinpoint.js`
- `pinpoint.css`
- [Leaflet](http://leafletjs.com/download.html) (both the JS and CSS)
- [Leaflet Minimap](https://github.com/Norkart/Leaflet-MiniMap) (both the JS and CSS)

In terms of HTML, just a single div is needed:

```html
<div class="map-container"></div>
```

Then in your JavaScript file:

```js
var options = {
    "element": ".map-container",
    "aspect-ratio": "wide",
    "dek": "",
    "hed": "The U.K.",
    "lat": 51.5049378,
    "lon": -0.0870377,
    "minimap": false,
    "zoom": 4,
    "markers": [
        {
            "lat": 51.5049378,
            "lon": -0.0870377,
            "text": "London"
        }
    ]
};
var map = new Pinpoint( options );
```


### Options

Pinpoint accepts a JavaScript object for configuration.

option              | type     | default                                    | description
------------------- | -------- | ------------------------------------------ | ------------------
el                  | string   | "#map-el"                                  | CSS selector for map parent element.
aspect-ratio        | string   | (required)                                 | The shape of the map: "wide" (3x2), "square" (1x1), or "tall" (5x6)
lat                 | number   | (required)                                 | Latitude for map centre.
lon                 | number   | (required)                                 | Longitude for map centre.
markers             | array    | (required)                                 | Array of markers/icons on map (see below for details).
zoom                | number   | (required)                                 | Initial zoom level of map.
hed                 | string   | (blank)                                    | Headline for map (optional).
dek                 | string   | (blank)                                    | Dek for map (optional).
note                | string   | (blank)                                    | Note to go below map (optional).
minimap             | boolean  | false                                      | Set to `true` to enables zoomed-out smaller map in corner.
minimap-zoom-offset | number   | -5                                         | Zoom level of minimap relative to main map zoom. Should always be below 0.
basemap             | string   | "http://{s}.tile.osm.org/{z}/{x}/{y}.png"  | Leaflet tile layer [URL template](http://leafletjs.com/reference.html#url-template) (optional)
basemapCredit       | string   | "Leaflet \| © OpenStreetMap contributors"   | Credit for tilelayer. Goes at bottom, below note. (optional)
creation            | boolean  | false                                      | Set to `true tot enables "creation mode" for use in admin tool.
dragend             | function | undefined                                  | Anonymous function called on Leaflet `dragend` event (ie. when dragging/panning map).
zoomend             | function | undefined                                  | Anonymous function called on Leaflet `zoomend` event (ie. when zooming).
markerdragend       | function | undefined                                  | Anonymous function called on Leaflet marker `dragend` event (ie. when dragging a marker around the map). Only works when `creation` is true.


### Marker options

Markers are stored as an array of objects.

option          | type   | default    | description
--------------- | ------ | ---------- | ------------------
lat             | number | (required) | Latitude of point.
lon             | number | (required) | Longitude of point.
text            | string | (blank)    | Text for marker callout.
icon            | string | "square"   | Marker icon style: "circle", "square" or "none".
label           | string | "callout"  | Marker label style: "callout" or "plain".
label-direction | string | "north"    | Marker label direction. Available directions varies between label styles.

### Example configuration JSON

```json
{
    "aspect-ratio": "wide",
    "dek": "",
    "hed": "The U.K.",
    "lat": 51.5049378,
    "lon": -0.0870377,
    "minimap": false,
    "minimap-zoom-offset": -5,
    "zoom": 4,
    "markers": [
        {
            "icon": "circle",
            "label": "plain",
            "label-direction": "north",
            "lat": 51.5049378,
            "lon": -0.0870377,
            "text": "London"
        },
        {
            "icon": "circle",
            "label": "plain",
            "label-direction": "north",
            "lat": 53.4779669,
            "lon": -2.0613722,
            "text": "Manchester"
        }
    ]
}
```

### Public methods

- `.remove()`: Reset map container to empty element.

## Compiling dist folder

You must have [npm](https://www.npmjs.com) and [grunt](http://gruntjs.com) installed.

- `npm install`
- `grunt` (this will also run tests)

Note that the images in `src/img` are not auto-compiled - if they're changed, the SVG code will need to be copied into `pinpoint.js`.

## Customising styles

The look of the map and its markers is mostly controlled with CSS/SASS. These files can be found in `src/scss`:

- **main:** Head and deck, scale line style
- **overlay:** "Zoom/pan" icon
- **markers:** Square, circle and plain/invisible marker styles
- **marker-label-callout:** Callout label with north and south styles
- **marker-label-plain:** Plain label with N, NE, E, SE, S, SW, W and NW styles
- **geojson:** Styles for geojson objects

To change the map's basemap/tilelayer, use the `basemap` configuration variable. See above for more details.

## Running tests

Tests are carried out with [QUnit](http://qunitjs.com). To run tests, either open the HTML files in the `test/` folder individually, or install NPM and Grunt (see above for details) and run `grunt test`.

## Changelog

v1.1.1 (July 17, 2015)

- Fixed marker position bug

v1.1.0 (July 17, 2015)

- Removed jQuery dependency

v1.0.1 (July 9, 2015)

- Fix bug when no head or deck
- Throw useful error if Leaflet is missing
- Add basic tests


v1.0.0

- Initial release


