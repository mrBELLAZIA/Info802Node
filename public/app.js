var socket = io();
var liste = [];
var index;

var options = {
    types: ['(cities)'],
    componentRestrictions:{'country': ['FR','IT']},
    fields : ['place_id','geometry','name']
};

var input1 = document.getElementById("from");
var input2 = document.getElementById("to");
var autocomplete1 = new google.maps.places.Autocomplete(input1,options);
var autocomplete2 = new google.maps.places.Autocomplete(input2,options);

window.onload = afficheListe();
function afficheListe() {
    socket.emit("affiche");
    socket.on('liste', function (carArray) {
        liste = carArray;
        var list = document.getElementById('affiche');

        liste.forEach(function (item, index) {
            var option = document.createElement('option');
            option.value = index;
            option.innerHTML = item['nom'];
            list.appendChild(option);

        });
    })
};

function afficheStat(elem) {
    index = elem.selectedIndex
    console.log(elem.selectedIndex);
    document.getElementById('stats').innerHTML =
        "Kilometres d'autonomie : "+liste[elem.selectedIndex]['autonomie'] +"</br>" +
        "Temps de recharge : "+liste[elem.selectedIndex]['temps'];
}


function initMap() {
    map = new google.maps.Map(document.getElementById("googlemap"), {
        center: {
            lat : 45.564601,
            lng : 5.917781 },
        zoom: 6,
    });
    infoWindow = new google.maps.InfoWindow();

    const locationButton = document.createElement("button");

    locationButton.textContent = "Pan to Current Location";
    locationButton.classList.add("custom-map-control-button");
    map.controls[google.maps.ControlPosition.TOP_CENTER].push(locationButton);
    locationButton.addEventListener("click", () => {
        // Try HTML5 geolocation.
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const pos = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    };

                    infoWindow.setPosition(pos);
                    infoWindow.setContent("Location found.");
                    infoWindow.open(map);
                    map.setCenter(pos);
                },
                () => {
                    handleLocationError(true, infoWindow, map.getCenter());
                }
            );
        } else {
            // Browser doesn't support Geolocation
            handleLocationError(false, infoWindow, map.getCenter());
        }
    });
}

initMap();

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(
        browserHasGeolocation
            ? "Error: The Geolocation service failed."
            : "Error: Your browser doesn't support geolocation."
    );
    infoWindow.open(map);
}

var directionsServices = new google.maps.DirectionsService();

var directionsDisplay = new google.maps.DirectionsRenderer();

directionsDisplay.setMap(map);

function calcRoute() {
    //createRequest
    var request = {
        origin: document.getElementById("from").value,
        destination : document.getElementById("to").value,
        travelMode : google.maps.TravelMode.DRIVING, // can be changed
        unitSystem : google.maps.UnitSystem.METRIC
    }

    //pass request tu the route methode
    directionsServices.route(request,(result,status) => {
            if (status == google.maps.DirectionsStatus.OK) {

                //console.log(result.routes[0].legs[0].steps);
                // get Distance & Time

                const output = document.querySelector('#output');
                output.innerHTML =`<div class='alert-info'> From : ${document.getElementById("from").value} .<br/> To : ${document.getElementById("to").value}. <br/> Distance en voiture : ${result.routes[0].legs[0].distance.text}. <br/> Temps de trajets : ${result.routes[0].legs[0].duration.text}. </div>`

                directionsDisplay.setDirections(result);
            }
            else {
                //delete route from map
                directionsDisplay.setDirections({ routes : [] });
                //show error
                output.innerHTML = "<div class='alert-danger'> impossible mon reuf </div> ";
            }
        response = directionsDisplay.getDirections();
        if (liste[index]['autonomie'] < directionsDisplay.getDirections().routes[0].legs[0].distance.value) {
            var tab = [];
            var coord = [];
            for (var i = 0; i < response.routes[0].legs[0].steps.length; i++) {
                coord.push(response.routes[0].legs[0].steps[i].end_location.toUrlValue(6))
                tab.push(coord);
                coord = [];
            }
            ;
            console.log(tab);

            res = []
            lastPoint = tab[0]
            i = 0
            dist = 0
            while (lastPoint != tab[tab.length-1]){
                dist = 0
                while ((dist < 'trajet',liste[index]['autonomie'] - 10) && i < tab.length) {
                    dist += tab[i]["distance"]
                    lastPoint = tab[i]
                    i+=1
                }
            console.log(socket.emit('trajet',lastPoint[1],lastPoint[0],10000))
            }
            console.log(i)
        }
        }
    )
}
