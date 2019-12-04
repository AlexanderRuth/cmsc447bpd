package mlearning;

//The entity used to train the prediction models
public class CrimePredictEntity {
	public Integer month;		//Month of Crime
	public Integer year;		//Year of Crime
	public String weapon;		//Weapon (KNIFE, FIREARM, NONE, etc.)
	public Integer getMonth() {
		return month;
	}
	public void setMonth(Integer month) {
		this.month = month;
	}
	public Integer getYear() {
		return year;
	}
	public void setYear(Integer year) {
		this.year = year;
	}
	public String getWeapon() {
		return weapon;
	}
	public void setWeapon(String weapon) {
		this.weapon = weapon;
	}
}
