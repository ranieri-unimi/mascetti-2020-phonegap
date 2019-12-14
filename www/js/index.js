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
            style: 'mapbox://styles/mapbox/streets-v11'
        });
    }
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
        //$("#btn").click(function(){ fnc.sendRequest(str.GET_MAP, str.EMPTY_JSON, app.onMapResult); });
        $("#btn-lx").click(function() { fnc.changeSection('map'); fnc.loadMapBox(); });
        $("#btn-lx").click();
        $("#btn-rx").click(function() { fnc.changeSection('chart'); });
    },

    onMapResult : function (result) {
        console.log(result);
    },
};
