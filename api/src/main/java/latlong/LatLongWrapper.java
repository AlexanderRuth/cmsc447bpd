package latlong;

import java.util.List;

public class LatLongWrapper {

	private List<LatLong> points;
	private java.time.LocalDate before;
	private java.time.LocalDate after;
    private String crimecode;
	private String weapon;
	private String district;
	
	public java.time.LocalDate getBefore() {
		return before;
	}

	public void setBefore(java.time.LocalDate before) {
		this.before = before;
	}

	public java.time.LocalDate getAfter() {
		return after;
	}

	public void setAfter(java.time.LocalDate after) {
		this.after = after;
	}

	public String getCrimecode() {
		return crimecode;
	}

	public void setCrimecode(String crimecode) {
		this.crimecode = crimecode;
	}

	public String getWeapon() {
		return weapon;
	}

	public void setWeapon(String weapon) {
		this.weapon = weapon;
	}

	public String getDistrict() {
		return district;
	}

	public void setDistrict(String district) {
		this.district = district;
	}

	public List<LatLong> getPoints() {
		return points;
	}

	public void setPoints(List<LatLong> points) {
		this.points = points;
	}
}
