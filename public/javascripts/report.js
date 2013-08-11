function report() {
	this.columns = [];
	this.tables = [];
	this.filters = [];
	var parent = this;
	this.addColumns = function (options) {
		$.each(options, function (i, key) {
			var split = key.title.split(".");
			var column = new Object({ table: split[0], name: split[1], datatype: key.value, aggregate: "None" });
			if (parent.columns.indexOf(column) == -1) {
				var item = ich.tmpColumn({ name: key.title });
				$(item).data("columnObject", column);
				if (isNumeric(key.value)) 
					$(item).find("select").append(ich.tmpNumOptions())
				parent.columns.push(column);
				$('#tblColumns').append(item);
			}
		})
		parent.updateTables();
	}

	this.updateTables = function () {
		var tableNames = [];
		$.each(parent.tables, function (i, key) {
			tableNames.push(key.name);
		})
		$.each(parent.columns, function(i, key) {
			if (tableNames.indexOf(key.table) == -1) {
				var item = ich.tmpTable({ name: key.table })
				var select = $(item).find("select:first");
				$.each(ArrTables[key.table], function (j, skey) {
					var fullName = key.table + "." + skey.name;
					select.append("<option value='" + fullName + "'>" + fullName + "</option>");
				})
				var table = new Object({ name: key.table, primaryJoin: "", foreignJoin: "" });
				$(item).data("tableObject", table);
				parent.tables.push(table);
				$('#tblTables').append(item);
				tableNames.push(key.table);
			}
		})
		$('#tblTables tr:eq(1)').find("select").hide();
		$.each($('#tblTables tr:gt(1)'), function (i, key) {
			var foreignSelect = $(key).find('select:eq(1)'),
				currentValue = foreignSelect.val(),
				tableObject = $(key).data("tableObject");
			foreignSelect.find("option:gt(0)").remove();
			$.each(parent.tables, function (j, skey) {
				if (tableObject.name != skey.name) {
					$.each(ArrTables[skey.name], function (k, lkey) {
						var fullName = skey.name + "." + lkey.name;
						foreignSelect.append("<option value='" + fullName + "'>" + fullName + "</option>");
					})
				}
			})
			foreignSelect.val(currentValue);
		})
	}

	this.addFilter = function () {
		var item = ich.tmpFilter();
			filter = new Object({ name: "", filter: "", value: "" })
		$(item).data("filterObject", filter);
		var select = $(item).find("select:first");
		$.each(parent.tables, function (i, key) {
			$.each(ArrTables[key.name], function (j, skey) {
				select.append("<option value='" + skey.datatype + "'>" + key.name + '.' + skey.name + "</option>");
			})
		})
		parent.filters.push(filter);
		$('#tblFilters').append(item);
	}
}