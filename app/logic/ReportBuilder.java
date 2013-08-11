package logic;

import java.util.ArrayList;
import com.google.common.base.Joiner;

public class ReportBuilder {
	public static String BuildQuery(models.Report report) {
		ArrayList<String> listFields = new ArrayList<String>();
		for (models.ReportColumn column : report.columns) {
			String tmpField = column.table + "." + column.name;
			if (!column.aggregate.equals("None")){
				listFields.add(column.aggregate + "(" + tmpField + ")");
			} else {
				listFields.add(tmpField);
			}
		}
		String queryString = "SELECT ";
		queryString = queryString + Joiner.on(", ").join(listFields);
		for (int i = 0;i < report.tables.size();i++) {
			models.ReportTable curIndex = report.tables.get(i);
			if (i == 0) {
				queryString = queryString + " FROM " + curIndex.name;
			} else {
				queryString = queryString + " INNER JOIN " + curIndex.name + " ON " + curIndex.primaryJoin + " = " + curIndex.foreignJoin;
			}
		}
		
		for (int i = 0;i < report.filters.size();i++) {
			models.ReportFilter curIndex = report.filters.get(i);
			if (i == 0) {
				queryString = queryString + " WHERE";
			}
			switch (curIndex.filter) {
				case "EQ":
	                queryString = queryString + " " + curIndex.name + " = " + curIndex.value;
	                break;
	            case "GT":
	            	queryString = queryString + " " + curIndex.name + " > " + curIndex.value;
	                break;
	            case "LT":
	            	queryString = queryString + " " + curIndex.name + " < " + curIndex.value;
	                break;
	            case "GTE":
	            	queryString = queryString + " " + curIndex.name + " >= " + curIndex.value;
	                break;
	            case "LTE":
	            	queryString = queryString + " " + curIndex.name + " >= " + curIndex.value;
	                break;
	            case "Contains":
	            	if (curIndex.value.equals("")) {
	            		queryString = queryString + " " + curIndex.name + " = ''";
	            	} else {
	            		queryString = queryString + " " + curIndex.name + " LIKE '%" + curIndex.value + "%'";
	            	}
	                break;
	            case "NotContains":
	            	if (curIndex.value.equals("")) {
	            		queryString = queryString + " " + curIndex.name + " != ''";
	            	} else {
	            		queryString = queryString + " " + curIndex.name + " NOT LIKE '%" + curIndex.value + "%'";
	            	}
	                break;
	            case "StartsWith":
	            	queryString = queryString + " " + curIndex.name + " LIKE '" + curIndex.value + "%'"; 
	                break;
	            case "NotStartsWith":
	            	queryString = queryString + " " + curIndex.name + " NOT LIKE '" + curIndex.value + "%'";
	                break;
	            case "EndsWith":
	            	queryString = queryString + " " + curIndex.name + " LIKE '%" + curIndex.value + "'";
	                break;
	            case "NotEndsWith":
	            	queryString = queryString + " " + curIndex.name + " NOT LIKE '%" + curIndex.value + "'";
	                break;
	            default:
	            	queryString = queryString + " " + curIndex.name + " = " + curIndex.value;
	                break;
			}
		}
		
		return queryString;
	}            
}
