var str = {
    SESSION_ID : 'pickashu-session-id',
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
    MAP_STYLE : 'mapbox://styles/mapbox/navigation-guidance-day-v4',
};

var smaug = {
    map : undefined,
    items : {},
};

var fnc = {

    reqUrl : function (resource) { return str.BASE_URL.replace('URIRES', resource); },

    sendRequest: function (url, data, success) {
        data.session_id = localStorage.getItem(str.SESSION_ID);
        $.ajax({
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
        fnc.refreshMap();
        fnc.refreshChart();
        fnc.refreshProfile();
    },

    refreshMap : function () {
        fnc.sendRequest(str.GET_MAP, str.EMPTY_JSON, function (result, status, xhr) {

        });
    },

    refreshChart : function () {
        fnc.sendRequest(str.RANKING, str.EMPTY_JSON, function (result, status, xhr) {

        });
    },

    refreshProfile : function () {
        fnc.sendRequest(str.GET_PROFILE, str.EMPTY_JSON, function (result, status, xhr) {

        });
    },

    loadMapBox : function () {
        mapboxgl.accessToken = str.MAPBOX_TOKEN;
        smaug.map = new mapboxgl.Map({
            container: 'map',
            style: str.MAP_STYLE,
            center: [9.150, 45.475],
            zoom: 9
        });
    },

    addItem : function (id, base64img)
    {
        var el = document.createElement('div');
        el.className = 'marker';
        el.style.backgroundImage = 'url(data:image/png;base64,'+base64img+')';

        let tmp = smaug.items[id];
        new mapboxgl.Marker(el)
            .setLngLat([tmp.lon, tmp.lat])
            .setPopup(new mapboxgl.Popup({ offset: 25 }) // add popups
                .setHTML('<h3>' + str.items[id].name + '</h3><button class="btn-danger">Fight</button>'))
            .addTo(smaug.map);

        //el.addEventListener('click', function() { window.alert(str.geojson.features[0].properties.message); });
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
        fnc.loadMapBox();
        if(localStorage.getItem(str.SESSION_ID) === null)
        {
            $.ajax({
                url:  fnc.reqUrl(str.REGISTER),
                type: 'GET',
                dataType: 'json',
                success: app.onRegisterResult,
                error: function () { alert( 'Error network, check your Internet connection.' ); }
            });
        }
        else fnc.changeSection('map');
    },

    onRegisterResult : function (result, status, xhr) {
        localStorage.setItem(str.SESSION_ID, result.session_id);
        fnc.changeSection('map');
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
