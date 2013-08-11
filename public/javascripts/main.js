//indexOf Array function
var indexOf = function(needle) {
    if(typeof Array.prototype.indexOf === 'function') {
        indexOf = Array.prototype.indexOf;
    } else {
        indexOf = function(needle) {
            var i = -1, index = -1;
            for(i = 0; i < this.length; i++) {
                if(this[i] === needle) {
                    index = i;
                    break;
                }
            }
            return index;
        };
    }
    return indexOf.call(this, needle);
};

//isNumeric function regarding database types
var isNumeric = function(value) {
	var numeric = false;
	switch(value) {
		case "bigint":
			numeric = true;
			break;
		case "int":
			numeric = true;
			break;
		case "smallint":
			numeric = true;
			break;
		case "tinyint":
			numeric = true;
			break;
		case "decimal":
			numeric = true;
			break;
		default:
			numeric = false;
			break;
	}
	return numeric;
}

//Global Variables
ArrTables = [];

$(document).ready(function () {
	//Pull tables from database
	getTables();
	Report = new report();
	//Select section binds
	$('#btnAdd').bind("click", function () {
		var options = $('#selColumns').multiselect("getChecked");
		Report.addColumns(options);
		$('#selColumns').multiselect("uncheckAll");
	})

	$('#tblColumns').on('change', '.selColumns', function () {
		var changedTR = $(this).closest('tr'),
			columnObject = changedTR.data("columnObject");
		columnObject.aggregate = changedTR.find('select').val();
		changedTR.data("columnObject", columnObject);
	})

	//Table section binds
	$('#tblTables').on('change', '.selColumns', function () {
		var changedTR = $(this).closest('tr'),
			tableObject = changedTR.data("tableObject");
		tableObject.primaryJoin = changedTR.find('select:eq(0)').val();
		tableObject.foreignJoin = changedTR.find('select:eq(1)').val();
		changedTR.data("tableObject", tableObject);
	})

	//Filter section binds
	$('#btnFilterAdd').bind('click', function () {
		Report.addFilter();
	})

	$('#tblFilters').on('change', '.selColumns, .txtValue, .selFilters', function () {
		var changedTR = $(this).closest('tr'),
			filterObject = changedTR.data("filterObject"),
			selColumn = changedTR.find('select:eq(0)'),
			selFilter = changedTR.find('select:eq(1)');
		if ($(this).attr("class") == "selColumns") {
			selFilter.find('option:gt(0)').remove();
			if (isNumeric(selColumn.val())) {
				selFilter.append(ich.tmpNumFilters());
			} else {
				selFilter.append(ich.tmpStringFilters());
			}
		}
		filterObject.name = selColumn.find('option:selected').text();
		filterObject.filter = selFilter.val();
		filterObject.value = changedTR.find('input[type=text]').val();
		changedTR.data("filterObject", filterObject);
	})

	//Build report functionality
	$('#btnBuild').bind('click', function () {
		var reportData = JSON.stringify(Report);
		var resultFunc = function (data) {
			console.log(data);
			console.log("success");
		}, errorFunc = function () {
			console.log("error");
		}, sdata = reportData, postmethod = "POST";
		var service = new webservice(resultFunc, errorFunc, sdata, postmethod);
		service.callService(service.buildReport);
	})
});

function getTables() {
	var resultFunc = function (data) {
		$.each(data, function (i, key) {
			$('#selColumns').append("<optgroup label='" + key.name + "'>");
			ArrTables[key.name] = key.columns;
			$.each(key.columns, function (j, skey) {
				$('#selColumns').append("<option value='" + skey.datatype + "'>" + key.name + '.' + skey.name + "</option>");
			})
			$('#selColumns').append("</optgroup>");
		})
		$('#selColumns').multiselect({ minWidth: "auto" });
		$('#selColumns').multiselect("uncheckAll");
	}, errorFunc = function () {
		console.log("error");
	}, sdata = "", postmethod = "GET";
	var service = new webservice(resultFunc, errorFunc, "", postmethod);
	service.callService(service.getTables);
}