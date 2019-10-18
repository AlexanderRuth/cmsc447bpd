package aggregation;

public class Aggregation {
	String field;
	Long count;
	
	public Aggregation(String f, Long c) {
		this.field = f;
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
