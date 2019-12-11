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
        console.log('!! on-pause');
    },

    onResume: function() {
        console.log('!! on-resume');
    },

    receivedEvent: function(id) {
        console.log('Loading COMPLETED!');

        $(function (){
            $("#btn").click(function () {
                $.ajax({
                    method:"post",
                    url: "https://ewserver.di.unimi.it/mobicomp/mostri/getmap.php",
                    data: JSON.stringify({session_id : 'zqfQaL0q6TKACDrP'}),
                    type: "POST",
                    dataType : "json",
                    success: function (result) {
                        alert( "brv" );
                        console.log(result);
                    },
                    error: function (error) {
                        alert( "Sorry, there was a problem!" );
                        console.log( "Error: " + errorThrown );
                    },
                })
            })
        });
    }
};
