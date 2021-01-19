$('#mysubmit').click(function(e) {

    // prevent default form behavior (avoid the page reload)
    e.preventDefault(); 

    // get the data from the user
    var formData = $("#myform").serialize();   

    // send ajax http request (instead of the XMLHttpRequest)
     $.ajax({
        type: "POST",
        url: "/savemove",
        contentType: "application/x-www-form-urlencoded",
        data: formData,
        success: function(result){ alert(result)},
        error: function(xhr){ alert(xhr.responseText) }
    });

    // reset the form (erase user data)
    $('#myform' ).each(function(){
        this.reset();
    });
});

// drop down input change event
$("#wodName").change(function() {

    // get the selected option for the URL query string
    var formData = {wodName: $('option:selected', this).text()};

    // send ajax http request (instead of the XMLHttpRequest)
    $.ajax({
        type: "GET",
        url: "/findwod",
        data : formData, 
        success: findWod,
        error: function(xhr){ alert(xhr.responseText) }

    });
});

function findWod(result) {
    //clear any previous WODS
    $('#WODdisplay').empty();
    
    //prepare the data received from the server/database
    var myobj = JSON.parse(result);

    //display the chosen WOD data
    var myul = $("<ul id=\"WODdisplayul\">").append("<li class=\"AMRAPlist AMRAPname\" id=\"wodName2\">"+myobj.WOD_name+"</li>"+
                                "<li id=\"instructions\" class=\"AMRAPlist\">As Many Rounds as Possible in "+myobj.time+" minutes </li>"+
                                "<li class=\"AMRAPlist\">"+myobj.movement_1+"</li>"+
                                "<li class=\"AMRAPlist\">"+myobj.movement_2+"</li>"+
                                "<li class=\"AMRAPlist\">"+myobj.movement_3+"</li>");
    $('#WODdisplay').append(myul);
}