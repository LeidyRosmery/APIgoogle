var miUbicacion;

function initMap() {
    var laboratoriaLima = {
        lat: -12.1191427,
        lng: -77.0349046
    };
    var map = new google.maps.Map(document.getElementById("map"), {
        zoom: 18,
        center: laboratoriaLima
    });
    var markadorLaboratoria = new google.maps.Marker({
        position: laboratoriaLima,
        map: map
    });
    /****/

    var funcionError = function(error) {
        alert("tenemos un problema con encontrar tu ubicacion")
    };
    var latitud, longitud;
    var funcionExito = function(posicion) {
        latitud = posicion.coords.latitude;
        longitud = posicion.coords.longitude;
        map.setZoom(18);
        map.setCenter({
            lat: latitud,
            lng: longitud
        });
        miUbicacion = new google.maps.Marker({
            position: {
                lat: latitud,
                lng: longitud
            },
            map: map
        });
    }

    function buscar() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(funcionExito, funcionError);
        }
    }
    document.getElementById("encuentrame").addEventListener("click", buscar);
    var inputPartida = document.getElementById("punto-partida");
    var inputDestino = document.getElementById("punto-destino");
    new google.maps.places.Autocomplete(inputPartida);
    new google.maps.places.Autocomplete(inputDestino);
    var directionsService = new google.maps.DirectionsService;
    var directionsDisplay = new google.maps.DirectionsRenderer;
    var calculateAndDisplayRoute = function(directionsService, directionsDisplay) {
        directionsService.route({
            origin: inputPartida.value,
            destination: inputDestino.value,
            travelMode: 'DRIVING'
        }, function(response, status) {
            if (status === 'OK') {
                /************codigo distancia************/
                var distancia = Number((response.routes[0].legs[0].distance.text.replace("km", "")).replace(",", "."));
                tarifa.classList.remove("none");
                var costo = distancia * 1.75;
                if (costo < 4) {
                    tarifa.innerHTML = "S/. 4"
                }
                tarifa.innerHTML = "S/. " + parseInt(costo);
                console.log(response.routes[0].legs[0].distance.text);
                /************codigo distancia************/
                directionsDisplay.setDirections(response);
                miUbicacion.setMap(null);
            } else {
                window.alert("No econtramos una ruta.");
            }
        });
    }
    directionsDisplay.setMap(map);
    var trazarRuta = function() {
        calculateAndDisplayRoute(directionsService, directionsDisplay);
    };
    document.getElementById("trazar-ruta").addEventListener("click", trazarRuta);
}
