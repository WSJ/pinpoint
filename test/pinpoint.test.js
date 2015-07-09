
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
});
