let map;
let flickr =[];
//let infowindow = new google.maps.InfoWindow();

//to debug (trace function)
function trace(message){
    if(typeof console != 'undefined' ){
        console.log(message);
    }
}

//create Flickr Marker
function createFlickrMarker(i, latitude, longitude, infowindowcontent, icon) {
    let markerLatLng = new google.maps.LatLng(latitude, longitude);
    let image = new google.maps.MarkerImage(icon, null, null, null, new google.maps.Size(60,60));

    let infowindow = new google.maps.InfoWindow();
    //map the marker (create)
    flickr[i] = new google.maps.Marker({
        position: markerLatLng,
        map: map,
        title: infowindowcontent,
        icon: image
    });
    //event handler
    google.maps.event.addListener(flickr[i], 'click', function() {
        infowindow.setContent(infowindowcontent);
        infowindow.open(map, flickr[i]);
    });
}

//get data from Flickr
function getFlickr(search){
    $.getJSON('http://api.flickr.com/services/rest/?method=flickr.photos.search&format=json&api_key=fb2b578dc5be0682d427d88c57fe0533&text='+search+'&lat=-27.4698&lon=153.0251&extras=geo,url_t,url_m,url_sq&radius=20&accuracy=13&per_page=100&jsoncallback=?',

    function(data){
        trace(data);
             $.each(data.photos.photo, function(i, item){
                infowindowcontent = '<strong>'+item.title+'</strong><br>';
                infowindowcontent += '<a href="'+item.url_m+'" target="_blank">';
                infowindowcontent += '<img src="'+item.url_t+'"></a>';
                createFlickrMarker(i, item.latitude, item.longitude, infowindowcontent, item.url_sq);
            });
         }
    );
}

function initialize(){
    map = new google.maps.Map(document.getElementById('map-canvas'), {
        center: {lat: -27.4698, lng: 153.0251},
        zoom: 13,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    });


    function clearOverlays(){
        if(flickr){
            for(i in flickr){
                flickr[i].setMap(null);
            }
        }
    }

    function getSearchTerm(){
        let searchQuery = $("#query").val();
        clearOverlays();
        getFlickr(searchQuery);
    }
    $("button").click(getSearchTerm);
    getSearchTerm();
}
