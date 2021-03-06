const request = require('request');

var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
const  port = process.env.PORT || 3000;

var liste = [];

app.use(require("express").static("public"));
app.get('/', function(req, res){
    res.sendfile("./public/index.html");
});

http.listen(port, function(){
    console.log('listening on *:3000');
});


var soap = require('soap');
const {json} = require("express");
var url = 'https://servsoapinfo802.herokuapp.com/?wsdl';

soap.createClient(url, function(err, client) {
    client.recupListVoiture(function(err, result) {
        liste = JSON.parse(result.recupListVoitureResult);
    });
});



io.on('connect',function(socket){
        socket.on('affiche',function(){
            io.emit('liste',liste);
            console.log(liste)
        })

        socket.on('trajet',function (lat,lng,limite){
            request( "https://carapiinfo802.herokuapp.com/findWaysPoints?lat="+lat+"&lng="+lng+"&limite="+limite,function (error,response,body){
                io.emit('dist',body);
                //console.log(json.parse(response));
            })
        })
    }
);