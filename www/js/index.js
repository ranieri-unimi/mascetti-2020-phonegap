var str = {
    SESSION_ID : 'sDpnK5c9APmw4ERC',
    BASE_URL : 'https://ewserver.di.unimi.it/mobicomp/mostri/URIRES.php',
    REGISTER : 'register',
    GET_MAP : 'getmap',
    GET_IMAGE : 'getimage',
    FIGHT_EAT : 'fighteat',
    RANKING : 'ranking',
    GET_PROFILE : 'getprofile',
    SET_PROFILE : 'setprofile',
    EMPTY_JSON : JSON.parse('{}'),
    MAPBOX_TOKEN: 'pk.eyJ1IjoibWFmZmluOTkiLCJhIjoiY2szNGF0NnQ3MGs2YzNnbnk4dDVwaHd0YiJ9.XYdHDkZRn2iHY1xmHSMc1A',
    geojson : {
        type: 'FeatureCollection',
        features: [{
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: [9.150, 45.475]
            },
            properties: {
                title: 'Mapbox',
                description: 'Washington, D.C.'
            }
        },
            {
                type: 'Feature',
                geometry: {
                    type: 'Point',
                    coordinates: [9.150, 45.475]
                },
                properties: {
                    title: 'Mapbox',
                    description: 'San Francisco, California'
                }
            }]
    },
};

var fnc = {

    reqUrl : function (resource) {
        return str.BASE_URL.replace('URIRES', resource);
    },

    sendRequest: function (url, data, success) {
        data.session_id = str.SESSION_ID;
        $.ajax({
            method: 'post',
            url:  fnc.reqUrl(url),
            data: JSON.stringify(data),
            type: 'POST',
            dataType: 'json',
            success: success,
            error: function () { alert( 'Error network, check your Internet connection.' ); }
        });
    },

    changeSection : function (id) {
        $("section").hide();
        $("#"+id).show();
    },

    loadMapBox : function () {
        mapboxgl.accessToken = str.MAPBOX_TOKEN;
        var map = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [9.150, 45.475],
            zoom: 7
        });


        var el = document.createElement('div');
        el.className = 'marker';
        el.style.backgroundImage = 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAE0AAABECAYAAADEBrh4AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAUVSURBVHhe5ZxbT1tHEMfH+G6Dr2AIBkNTUKK2pG1QafvQp6rqS9uH5LnfrN+gUhWVhvahiqreIgQB0iYtgSRgnICNCQZz97U7p5M2Uog5s+fYnOP9SZZnxrLF+bM7uzu75zjqAmgR5eM92FqZg0LmT6iWTyjaGgLRfogPvQOR/ssADgdF5WiJaJXSEeQe/CrEugf1eo2i54M3GIXE6IeGxGuuaOKnn6UXILf0W8tb1ln4w70wcOVT8IV6KKKfpolWKR1CZn4K9rfSFLEejg4nJEbehx7xcjg6KHo2TRHtsLAOa3OTIoftU8TadHYPQerqZ+B0+yjSGNNF28uvwtqdb6FWLVPEHnj8IRieuAbezjhFXo2pohWzy7A2fxPqtSpF7IXL4xfCXdfyXSP0d+QzONzZEIJN2VYwBEf5lemvxbVkKXI6pohWOipCeuaGEKxCEfuCo3x65hsoHexQ5GWMiyZ6d2buO220bBewxa0K4fD9NAyLln88q3XNduPkoADp2dN7jyHR8Idx4tqu4NQps/A9ef9jSLTs4i+2Tvx62N1Ygs2H0+T9i7RoOMLgFEMFsDe9uLKRFm1z+TZZCoCDnZhOYZUGkRKtLKYYe/kV8tQAZwdrdya1dCQl2vbaH5r6qoGzhKf3fpQTrfD0b7LUA2uCbNGOi3mte6oMW7Ti5mOy1IUt2n5+lSx14Ykmkv9RMUeOurBEOznYhlrFXsVF3DzBwmJnPKXVyTqcbvpAHlYRckeMmpmFKfKsTYfLAz2vT0AsNQYuT4CioFWUdzeWYVPM8rGkJQNLNFwF5JZ+J8+64Dbd8HvXwBOMUORlapUSpOcmpXI0q3vK/mdaCW6OYMm6kWAItsSh8S/AF0pQRD8s0cqH1hctMfoBeAJh8hqD+S059gl5+mGJVikfk2VNHB0uiA1eIU8fgUif9uLAEq1u8W05fzghuh1/dAzGB8nSB0u0msULjm5fJ1k8uN9jtjRr7zZVxYgoA/d7LNEcThdZ1uRkb0uqZIVFCA4s0cyYTTcTPDuyv50hTx9VMbhxC6pM0azd0pAcbvYwzsDllm6zl4Ys0ZwuL1nWBTd81u/f0tVNC0/uw7PVOfL0wxLNHQiRZW2203dhdfbGK4uluITa+OsneHL3B4rw4K09H05rx0DtAk52u3qGIBgbAJcvCNXSMRztZqGYe2ToZCavyrG+CJn5m+SpC6t7+rq6yVIbnmidca06oDos0bAKGohcIEddeKIJgrEkWerCFq0rcZEsdWGLhpsTbl8XeWrCFg0J9Y2QpSZSokUH3iRLTaREwy7KLRG3E1KiIbHU22Sph7Ro4f5L4HRbv+rRDKRFw4JkJPkGeWohLRoSS/G2y9oFQ6LhAr6rZ5g8dTAkGoI3mKqGYdGwwIc31auEYdEQvKVZJUwRDRfx7V6gxOMOWg4X18oqdzfCTgf+zgIfCIArHn9YvCK92rs3ENHqidrnZomGe40Pbn31360wdgSXh/HhdyHUO9Jw4m6aaEj+0QxkF38mzz64vEFIvvUxhPpGKdIYU3Lac3CyK3PU6TzBbjj60Ze6BUNMFQ2bdHRgjDzro53NnbiutTQOpoqGdF8cZz1N5bzAvzF19XPdDzB5EdOvDh8KYofKbjQ1JvWcIaQpTSI2aP0u2v3aOFl8miIaPruHmydaCR6Dx3wmS3OSj5gEhi9cIsd6GK3MNC1jR5KXybIesrnsOU0TDY8v6L0JotUYWycD/AO+j8mlET4JAgAAAABJRU5ErkJggg==)';
        el.style.width ='50px';
        el.style.height ='50px';

        new mapboxgl.Marker(el)
            .setLngLat(str.geojson.features[0].geometry.coordinates)
            .setPopup(new mapboxgl.Popup({ offset: 25 }) // add popups
                .setHTML('<h3>' + str.geojson.features[0].properties.title + '</h3><p>' + str.geojson.features[0].properties.description + '</p>'+
                '<button class="btn-danger">FIGHT</button>'))
            .addTo(map);

        // el.addEventListener('click', function() { window.alert(str.geojson.features[0].properties.message); });
    },

};

var app = {

    initialize: function() {
        this.bindEvents();
    },

    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },

    onDeviceReady: function() {
        document.addEventListener('pause',app.onPause, false);
        document.addEventListener('resume',app.onResume, false);

        // Here we go!
        app.receivedEvent('deviceready');
    },

    onPause: function() {
    },

    onResume: function() {
    },

    receivedEvent: function(id) {
        $("#btn-cx").click(function(){ fnc.sendRequest(str.GET_MAP, str.EMPTY_JSON, app.onMapResult); });
        $("#btn-lx").click(function() { fnc.changeSection('map'); fnc.loadMapBox(); });
        $("#btn-lx").click();
        $("#btn-rx").click(function() { fnc.changeSection('chart'); });
    },

    onMapResult : function (result) {
        console.log(result);
    },
    galleryLoad : function () {
        navigator.camera.getPicture(
            app.onPicture,
            null,
            {
                quality: 95,
                destinationType: Camera.DestinationType.DATA_URL,
                sourceType: Camera.PictureSourceType.PHOTOLIBRARY
            }
            );
    },
    onPicture : function (base64Picture) {
        $("#img-gallery").attr("src","data:image/png;base64,"+base64Picture);
    },
};
