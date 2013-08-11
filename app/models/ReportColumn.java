package models;

public class ReportColumn {
	public String table;
	public String name;
	public String datatype;
	public String aggregate;
	
	public ReportColumn() {
		this.table = "";
		this.name = "";
		this.datatype = "";
		this.aggregate = "";
	}
}
