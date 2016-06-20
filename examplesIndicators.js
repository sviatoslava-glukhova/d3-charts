(function () {
    var options = {
        appendTo: '#percentIndicator',
        defaultColor: "#F1F1F1",
        primaryColor: '#48AEB4',
        dimentions: {
            height: 40
        }
    };


    Charts.generatePercentIndicator(options, 20);
    Charts.generatePercentIndicator(options, 67);
    Charts.generatePercentIndicator(options, -67);
    Charts.generatePercentIndicator(options, -7);


}());
