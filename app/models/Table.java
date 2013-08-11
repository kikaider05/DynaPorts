package models;

import java.util.ArrayList;

public class Table {
	public String name;
	public ArrayList<Column> columns;
	
	public Table(String Name) {
		name = Name;
		columns = new ArrayList<Column>();
	}
}
