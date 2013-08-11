package data;

import models.*;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;

import play.db.DB;


public class dataContext {
	private Connection conn;
	public dataContext() {
		conn = DB.getConnection();
	}
	
	public void close() throws SQLException {
		conn.close();
	}

	public ArrayList<Table> getTables() throws SQLException {
		ArrayList<Table> tables = new ArrayList<Table>();
		
		Statement stmt = conn.createStatement();
		ResultSet rs = stmt.executeQuery("SELECT TABLE_NAME, COLUMN_NAME, DATA_TYPE FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA='sakila' ORDER BY TABLE_NAME ASC");
		String previousName = "";
		Table table = new Table("");
		while(rs.next()) {
			String tableName = rs.getString(1);
			String columnName = rs.getString(2);
			String dataType = rs.getString(3);
			if (!previousName.equalsIgnoreCase(tableName)) {
				if (!previousName.equals(""))
					tables.add(table);
				table = new Table(tableName);
				table.columns.add(new Column(columnName, dataType));
			} else {
				table.columns.add(new Column(columnName, dataType));
			}
			previousName = tableName;
		}
		
		return tables;
	}
}
