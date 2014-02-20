var express = require('express')
    , routes = require('./routes')
    , http = require('http')
    , path = require('path');

var app = express();
var server = http.createServer(app)

var gpsutil = require('gps-util');

etablissements = require('./json/college.json').d;
defibrilateurs = require('./json/defibrilateur.json').d;
arrets_bus = require('./json/arret_bus.json').d;




app.configure(function(){
    app.set('port', process.env.PORT || 8282);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.favicon());
    app.use(express.logger('dev'));
   // app.use(express.bodyParser()); fait planter l'appli
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(path.join(__dirname, 'public')));
});

// set route for index path
app.get('/', routes.index);



// activate the server listening
server.listen(app.get('port'), function(){
    console.log("Express server listening on port " + app.get('port'));
});

// activate socket io
var io = require("socket.io").listen(server)

io.sockets.on('connection', function (socket) {
    var me;


    socket.on('get_details',function(id_etablissement){
        the_etablissement = etablissements[id_etablissement]

        // Create default value for details
        all_details = {1 :
        {defib : 0, arret : 0},
            2 :
            {defib : 0, arret: 0},
            5 :
            {defib : 0, arret:0},
            10 :
            {defib : 0, arret:0}
        };
        
        all_details_lat_lon = {defib : Array(), arret : Array()};

        // load all defibrilateur in details
        for(i = 0; i < defibrilateurs.length; i++){

            var distance = gpsutil.getDistance(the_etablissement.longitude,the_etablissement.latitude,defibrilateurs[i].longitude,defibrilateurs[i].latitude);
            if(distance < 1000){
                all_details[1].defib = all_details[1].defib + 1;
            }

            if(distance < 2000){
                all_details[2].defib = all_details[2].defib + 1;
            }

            if(distance < 5000){
                all_details[5].defib = all_details[5].defib + 1;
            }


            if(distance < 10000){
                all_details[10].defib = all_details[10].defib + 1;
                all_details_lat_lon.defib.push({lat:defibrilateurs[i].longitude, lon:defibrilateurs[i].latitude});

            }
        }

        // load all arrêts in details

        for(i = 0; i < arrets_bus.length; i++){

            var distance = gpsutil.getDistance(the_etablissement.longitude,the_etablissement.latitude,arrets_bus[i].pa_y_wgs84,arrets_bus[i].pa_x_wgs84);
            if(distance < 1000){
                all_details[1].arret = all_details[1].arret + 1;
            }

            if(distance < 2000){
                all_details[2].arret = all_details[2].arret + 1;
            }

            if(distance < 5000){
                all_details[5].arret = all_details[5].arret + 1;
            }


            if(distance < 10000){
                all_details[10].arret = all_details[10].arret + 1;
                all_details_lat_lon.arret.push({lat:arrets_bus[i].pa_y_wgs84, lon:arrets_bus[i].pa_x_wgs84});
            }
        }

        socket.emit('get_details', {etab: {lon:the_etablissement.longitude, lat:the_etablissement.latitude}, details: all_details,  maps: all_details_lat_lon});

    });
});