function webservice(resultFunc, errorFunc, sdata, postmethod) {
    this.resultFunc = resultFunc;
    this.errorFunc = errorFunc;
    this.sdata = sdata;
    this.postmethod = postmethod;
    var parent = this;
    this.callService = function (serviceName) {
        $.ajax({
            type: this.postmethod,
            url:  serviceName,
            data: this.sdata != "" ? this.sdata : {},
            contentType: "application/json",
            dataType: "json",
            success: function (data) {
                parent.resultFunc(data)
            },
            error: function (data) {
                parent.errorFunc(data);
            }
        });
    }
}

webservice.prototype.getTables = 'GetTables';
webservice.prototype.buildReport = 'BuildReport';