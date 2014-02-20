var sockets = io.connect()

$(function() {

    var markers = [];

    google.maps.event.addDomListener(window, 'load', initialize);

    /**
     * Select an etablissement
     */
    $('#list-etablissement').on('click','.list-etablissement',function(){
        $('#list-etablissement').find('.sub-title').removeClass('sub-title');
        $(this).addClass('sub-title');

        sockets.emit('get_details',this.getAttribute('data-etablissement'));
    });

    /**
     * Get details of an etablissement
     */
    sockets.on('get_details',function(msg){

        map.setCenter(new google.maps.LatLng( msg.etab.lat, msg.etab.lon ) );
        map.setZoom(11);

        for (var i = 0; i < markers.length; i++) {
            markers[i].setMap(null);
        }
        markers = [];

        jade.render(document.getElementById('list-details'), 'etablissement_details', { data : msg });

        for(var i in msg.maps.arret){
            var marker = new google.maps.Marker({
                position: new google.maps.LatLng(msg.maps.arret[i].lon, msg.maps.arret[i].lat),
                title:'Défibrilateur',
                animation: google.maps.Animation.DROP,
                icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
            });

            markers.push(marker);



            // To add the marker to the map, call setMap();
            marker.setMap(map);
        }

        for(var i in msg.maps.defib){
            var marker = new google.maps.Marker({
                position: new google.maps.LatLng(msg.maps.defib[i].lon, msg.maps.defib[i].lat),
                title:'Défibrilateur',
                animation: google.maps.Animation.DROP
            });

            markers.push(marker);

            // To add the marker to the map, call setMap();
            marker.setMap(map);
        }

     });

    $(function () {
        $(window).scroll(function () {
            DivSrollMax();
        });
    });

    var hauteurMax = 0; //Hauteur arbitrairement choisie
    function DivSrollMax() {
        if (hauteurMax < $(window).scrollTop()) {
            var top = $(window).scrollTop() - hauteurMax ;
            $(".list-details").css("top", top + "px");
            $("#map-canvas").css("top", top + "px");

        }
        else {
            $(".list-details").css("top", "");
            $("#map-canvas").css("top", "");

        }
    }

});


var map;
function initialize() {
    var mapOptions = {
        zoom: 8,
        center: new google.maps.LatLng(49.4432320, 1.0999710)
    };

    map = new google.maps.Map(document.getElementById('map-canvas'),
        mapOptions);
}







