package mlearning;

public class CrimePredictEntityResponse {
	Integer month;		//Month of Crime
	Integer day;		//Day of Crime (Mon - Sun, 0 = Mon, 1 = Tues)
	String weapon;		//Weapon (KNIFE, FIREARM, NONE, etc.)
	Integer count;		//Number of crimes matching the fields
	
	public CrimePredictEntityResponse(Integer month, Integer day, String weapon, Integer count) {
		super();
		this.month = month;
		this.day = day;
		this.weapon = weapon;
		this.count = count;
	}
	public Integer getMonth() {
		return month;
	}
	public void setMonth(Integer month) {
		this.month = month;
	}
	public Integer getDay() {
		return day;
	}
	public void setDay(Integer day) {
		this.day = day;
	}
	public String getWeapon() {
		return weapon;
	}
	public void setWeapon(String weapon) {
		this.weapon = weapon;
	}
	public Integer getCount() {
		return count;
	}
	public void setCount(Integer count) {
		this.count = count;
	}
}
