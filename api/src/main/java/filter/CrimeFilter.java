package filter;

import java.util.List;

import latlong.LatLong;

public class CrimeFilter {

	public List<LatLong> points;
	public java.time.LocalDate before;
	public java.time.LocalDate after;
    public String crimecode;
	public String weapon;
	public String district;
	public Integer page_number;
	public Integer page_size;
	public String group_by;
	
	
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

	public Integer getPage_number() {
		return page_number;
	}

	public void setPage_number(Integer page_number) {
		this.page_number = page_number;
	}

	public Integer getPage_size() {
		return page_size;
	}

	public void setPage_size(Integer page_size) {
		this.page_size = page_size;
	}
}
