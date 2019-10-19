package aggregation;

public class Aggregation {
	String field;
	Long count;
	
	public Aggregation(String f, Long c) {
		this.field = f;
		this.count = c;
	}
	
	//Constructor for day, month, year
	public Aggregation(int day, int month, int year, Long c) {
		this.field = Integer.toString(month) + "/" + Integer.toString(day) + "/" + Integer.toString(year);
		this.count = c;
	}
	
	//Constructor for month, year
	public Aggregation(int month, int year, Long c) {
		this.field = Integer.toString(month) + "/" + Integer.toString(year);
		this.count = c;
	}
	
	//Constructor for year
	public Aggregation(int year, Long c) {
		this.field = Integer.toString(year);
		this.count = c;
	}
	
	
	public String getField() {
		return field;
	}
	public void setField(String field) {
		this.field = field;
	}
	public Long getCount() {
		return count;
	}
	public void setCount(Long count) {
		this.count = count;
	}
}
