var app = {

    initialize: function() {
        this.bindEvents();
    },

    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },

    onDeviceReady: function() {
        app.receivedEvent('deviceready');
        document.addEventListener("pause",app.onPause, false);
        document.addEventListener("resume",app.onResume, false);
    },

    onPause: function() {
    },

    onResume: function() {
    },

    receivedEvent: function(id) {
        $("#btn").click(smaug.sendRequest(
            'getmap',
            JSON.parse('{}'),
            app.onMapResult,
            smaug.networkError
        ));
    },

    onMapResult : function (result) {
        // Mappa pronta
    },
};
