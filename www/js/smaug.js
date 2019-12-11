var strings = {
    SESSION_ID: "sDpnK5c9APmw4ERC",
};

var smaug = {

    sendRequest: function (url, data, success, error) {
        data.session_id = strings.SESSION_ID;
        console.log(data);
        $.ajax({
            method: "post",
            url: "https://ewserver.di.unimi.it/mobicomp/mostri/" + url + ".php",
            data: JSON.stringify(data),
            type: "POST",
            dataType: "json",
            success: success,
            error: error
        });
    },

    networkError : function () {
        alert( "Error network, check Internet connection." );
    },

};
