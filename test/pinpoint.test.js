
QUnit.test( "Most basic map", function( assert ) { 
  
    var data = {
      "lat": 51.5049378,
      "lon": - 0.0870377,
      "zoom": 4,
      "aspect-ratio": "tall",
      "markers": []
    };

    data.el = '.test-map';
    var p = new Pinpoint(data);
  
    assert.ok( p instanceof Pinpoint );
    p.remove();
});

QUnit.test( "Map with a marker", function( assert ) { 
  
    var data = {
      "lat": 51.5049378,
      "lon": - 0.0870377,
      "zoom": 4,
      "aspect-ratio": "tall",
      "markers": [{
        "lat": 51.5049378,
        "lon": - 0.0870377
      }]
    };

    data.el = '.test-map';
    var p = new Pinpoint(data);
  
    assert.ok( p instanceof Pinpoint );
    assert.ok( $('.marker-icon').length > 0 );
    p.remove();
});

QUnit.test( "Dynamic height", function( assert ) { 
    var done = assert.async();
  
    var data = {
      "lat": 51.5049378,
      "lon": - 0.0870377,
      "zoom": 4,
      "aspect-ratio": "square",
      "markers": [{
        "lat": 51.5049378,
        "lon": - 0.0870377
      }]
    };

    data.el = '.test-map';
    var p = new Pinpoint(data);
  
    var $m = $('.test-map');
    $m.width(100);
    setTimeout(function(){
        assert.equal( $('.map-inner').height(), 100 );
        assert.equal( $('.map-cover').height(), 100 );
        $m.width(200);
        setTimeout(function(){
            assert.equal( $('.map-inner').height(), 200 );
            assert.equal( $('.map-cover').height(), 200 );
            p.remove();
            done();
        },200);
    },200);
});

QUnit.test( "Marker placement", function( assert ) { 
    var data = {
        "lat": 51.5049378,
        "lon": - 0.0870377,
        "zoom": 4,
        "aspect-ratio": "tall",
        "hed": "Hi",
        "dek": "You",
        "markers": [{
            "lat": 51.5049378,
            "lon": - 0.0870377,
            "label": ""
        }]
    };
    data.el = '.test-map';

    var p = new Pinpoint(data);    
    assert.ok( ($('.marker-inner').offset().left / $('.map-inner').width()) < 0.5 );
    p.remove();

    data.markers[0].label = 'callout';
    var p = new Pinpoint(data);
    assert.ok( ($('.marker-inner').offset().left / $('.map-inner').width()) < 0.5 );
    p.remove();

});

QUnit.test( "'element' property in config", function( assert ) { 
  
    var data = {
      "lat": 51.5049378,
      "lon": - 0.0870377,
      "zoom": 4,
      "aspect-ratio": "tall",
      "markers": []
    };

    data.element = '.test-map';
    var p = new Pinpoint(data);
  
    assert.ok( p instanceof Pinpoint );
    p.remove();
});


