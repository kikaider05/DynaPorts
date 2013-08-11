package controllers;

import play.*;
import play.mvc.*;
import play.libs.Json;
import play.db.*;
import models.*;

import java.sql.*;
import java.util.*;


import org.codehaus.jackson.JsonNode;
import org.codehaus.jackson.map.ObjectMapper;

import views.html.*;

public class DataService extends Controller {
	
	public static Result GetTables() throws SQLException {
		data.dataContext data = new data.dataContext();
		ArrayList<Table> tables = new ArrayList<Table>();
		tables = data.getTables();
		data.close();
		
		return ok(Json.toJson(tables));
	}
	
	public static Result BuildReport() {
		JsonNode json = request().body().asJson();
		Report report = Json.fromJson(json, Report.class);
		String query = logic.ReportBuilder.BuildQuery(report);
		return ok(Json.toJson(query));
	}
}
