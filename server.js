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
var url = 'http://127.0.0.1:8000/wsdl?wsdl';

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
            request("http://127.0.0.1:5000/findWaysPoints/"+lat+"/"+lng+"/"+limite,function (error,response,body){
                io.emit('dist',body);
                //console.log(json.parse(response));
            })
        })
    }
);