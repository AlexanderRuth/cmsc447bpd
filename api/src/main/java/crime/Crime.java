package crime;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Date;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

import org.hibernate.annotations.Filter;
import org.hibernate.annotations.FilterDef;
import org.hibernate.annotations.Filters;
import org.hibernate.annotations.ParamDef;

@Entity
@FilterDef(name="beforeDate", parameters=@ParamDef(name="beforeDate", type="date"))
@FilterDef(name="afterDate", parameters=@ParamDef(name="afterDate", type="date"))
@Filters( {
	@Filter(name="beforeDate", condition=":beforeDate >= crimedate"),
	@Filter(name="afterDate", condition=":afterDate <= crimedate")
})
public class Crime {

    @Id
    @GeneratedValue(strategy=GenerationType.AUTO)
    private Integer id;

    private java.time.LocalDate crimedate;
    private java.time.LocalTime crimetime;
    private String crimecode;
    private String location;
    private String description;
    private String inside_outside;
    private String weapon;
    private Integer post;
    private String district;
    private String neighborhood;
    private Double longitude;
    private Double latitude;
    private String premise;
    private Integer total_incidents;
    
	public Integer getId() {
		return id;
	}
	public void setId(Integer id) {
		this.id = id;
	}
	public LocalDate getCrimedate() {
		return crimedate;
	}
	public void setCrimedate(java.time.LocalDate crimedate) {
		this.crimedate = crimedate;
	}
	public LocalTime getCrimetime() {
		return crimetime;
	}
	public void setCrimetime(java.time.LocalTime crimetime) {
		this.crimetime = crimetime;
	}
	public String getCrimecode() {
		return crimecode;
	}
	public void setCrimecode(String crimecode) {
		this.crimecode = crimecode;
	}
	public String getLocation() {
		return location;
	}
	public void setLocation(String location) {
		this.location = location;
	}
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	public String getInside_outside() {
		return inside_outside;
	}
	public void setInside_outside(String inside_outside) {
		this.inside_outside = inside_outside;
	}
	public String getWeapon() {
		return weapon;
	}
	public void setWeapon(String weapon) {
		this.weapon = weapon;
	}
	public Integer getPost() {
		return post;
	}
	public void setPost(Integer post) {
		this.post = post;
	}
	public String getDistrict() {
		return district;
	}
	public void setDistrict(String district) {
		this.district = district;
	}
	public String getNeighborhood() {
		return neighborhood;
	}
	public void setNeighborhood(String neighborhood) {
		this.neighborhood = neighborhood;
	}
	public Double getLongitude() {
		return longitude;
	}
	public void setLongitude(Double longitude) {
		this.longitude = longitude;
	}
	public Double getLatitude() {
		return latitude;
	}
	public void setLatitude(Double latitude) {
		this.latitude = latitude;
	}
	public String getPremise() {
		return premise;
	}
	public void setPremise(String premise) {
		this.premise = premise;
	}
	public Integer getTotal_incidents() {
		return total_incidents;
	}
	public void setTotal_incidents(Integer total_incidents) {
		this.total_incidents = total_incidents;
	}
}
