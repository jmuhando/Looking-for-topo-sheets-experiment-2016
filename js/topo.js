var map = L.map('map', {zoomControl: false}).setView([-0.085091, 37.497650], 6 );
//var osmlayer = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

map.addControl(L.control.zoom({position:'topright'}));
map.setMaxBounds(map.getBounds());
var style_grid = {
    "color": "black",
    "weight": 0.5,
    "opacity": 0.5,
    "fillColor": "white",
    "fillOpacity": 0.1
};
var style_counties = {
    "color": "white",
    "weight": 1.5,
    "opacity": 1,
    "fillColor": "#ADADAD",
    "fillOpacity": 0.3
};

function getColor(d) {
    return d == 'UNAVAILABLE' ? '#ff0000' :
           d == 'AVAILABLE'  ? '#00cc00' :
                      '#FFEDA0';
}
function gridStyle(feature) {
    return { 
        opacity:0.5,
        weight:0.5,
        fillColor: getColor(feature.properties.Availabili),
        color: "black",
        fillOpacity:0.4
    };
}

var grid;
var nameIG;

function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 4,
        color: '#ffff00',
        dashArray: '',
        fillOpacity: 0
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }
    info.update(layer.feature.properties);
}
function resetHighlight(e) {
    grid.resetStyle(e.target);
    info.update();
}

//
function zoomToFeature(e,nameIG) {
    var nameIG = e.target.feature.properties.SHEET_NO; 
    map.fitBounds(e.target.getBounds());
    info1.update(e.target.feature.properties);
    console.log(nameIG);

    var img = new Image();
    img.src = "http://simoa.me.ke/img/topo/" + nameIG+ ".jpg";

    var $image = $("img").first();
    var $downloadingImage = $("<img>");
    $downloadingImage.load(function(){
      $image.attr("src", $(this).attr("src"));  
    });
    $downloadingImage.attr("src", img.src);

    img.onerror = function() {
        img.alt = "404";
        console.log('fail');
    };
    img.onload = function() {
        if (img.alt === "404") {
            return;
        }
        console.log('yes');
    };

}

function onEachFeature(feature, layer) {
	layer.bindPopup(feature.properties.SHEET_NAME);
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
    	click: zoomToFeature 	   
    });    
}

var counties = L.geoJson(counties,{style:style_counties}).addTo(map);
var grid = L.geoJson(grids,{style:gridStyle,onEachFeature:onEachFeature}).addTo(map);


//LEGEND
var legend_pipes = L.control({position: 'bottomright'});

legend_pipes.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'info legend'),
        grades = ["AVAILABLE", "UNAVAILABLE"],
        labels = [];
        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
            '<i style="background:' + getColor(grades[i]) + '"></i> ' +
            grades[i] + (grades[i] ?  '<br>' : '+');
        }
    return div;
};
legend_pipes.addTo(map);

//INFO WINDOW 1
var info = L.control({position: 'topleft'});

info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
    this.update();
    return this._div;
};

// method that we will use to update the control based on feature properties passed
info.update = function (props) {
    this._div.innerHTML = '<h4>SHEET NAME & NUMBER</h4>' +  (props ?
        '<b>' + props.SHEET_NAME + '</b><br />'+'<b>' + props.SHEET_NO + '</b>'
        : 'Hover over a grid');
};

info.addTo(map);

//INFO WINDOW 2
var info1 = L.control({position: 'topleft'});

info1.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
    this.update();
    return this._div;
};

// method that we will use to update the control based on feature properties passed
info1.update = function (props) {
    this._div.innerHTML = '<h4>SHEET INFORMATION</h4>' +  (props ?
        '<br/>Sheet name&nbsp;:'+'&nbsp;<b>'+props.SHEET_NAME+'</b>' + 
        '<br/>Sheet number&nbsp;:'+'&nbsp;<b>'+props.SHEET_NO+'</b>' + 
        '<br/>Availability&nbsp;:'+'&nbsp;<b>'+props.Availabili+'</b>' +
        '<br/>Scale&nbsp;:'+'&nbsp;<b>'+props.scale+'</b>' + 
        '<br/>Type&nbsp;:'+'&nbsp;<b>'+props.use + '</b>' + 
        '<br/>Georeferenced&nbsp;:'+'&nbsp;<b>'+props.GEOREF+'</b>' 
        : '');
};

info1.addTo(map);

//INFO WINDOW 3 image window
var info2 = L.control({position: 'bottomleft'});

info2.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
    this.update();
    return this._div;
};

// method that we will use to update the control based on feature properties passed
info2.update = function (props) {
    this._div.innerHTML = '<h4> SHEET PREVIEW </h4>'+'<button id="ImgButton" class="open">Click to view</button>';
    

};

info2.addTo(map);

//image window pop up

$('body').append('<div class="popup-overlay"><div class="popup-content"><p> SHEET previews come here!!</p><img src=""><br/><button class="close">Close</button></div></div>');

$(".open").on("click", function(){
    console.log('tHIS WORKS!!')
    $(".popup-overlay, .popup-content").addClass("active");
});

$(".close, .popup-overlay").on("click", function(){
    console.log('tHIS worked!!')
    $(".popup-overlay, .popup-content").removeClass("active");
});


//loading images
var $image = $("img").first();
var $downloadingImage = $("<img>");
$downloadingImage.load(function(){
  $image.attr("src", $(this).attr("src"));  
});
$downloadingImage.attr("src", "");

//var catalogue={};











