// Get all groups
//$(document).ready(function() {

    let BASE_URL = "http://localhost:3000"

        $.ajax({'url': BASE_URL + '/groups',
            'type' : 'GET',
            'headers' : {'Content-Type' : 'application/json'},
            //'data' : JSON.stringify(requestObject), // datos a enviar
            'processData' : false,
            'success' : function(data){
                //data = JSON.parse(data)
                console.log("Mis grupos ", data);

            },

            'error': function(jqXHR, data){
                console.log("[CLientGroups] Error al enviar petioción: ", data);
                //comcast.cvs.apps.alerts.test.showErrorDialog( '<div style="color:red;font-weight:bold;">' +
                // 'Failed to save the settop box. See server logs for problem.</div>' );
                },
            'dataType' : 'json' // text  ->  JSON.parse(data)
        });


//});
