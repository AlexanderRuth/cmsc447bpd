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
@FilterDef(name="isWeapon", parameters=@ParamDef(name="weapon", type="string"))
@FilterDef(name="isCrimeCode", parameters=@ParamDef(name="crimecode", type="string"))
@FilterDef(name="isDistrict", parameters=@ParamDef(name="district", type="string"))
@FilterDef(name="northOfLatitude", parameters=@ParamDef(name="southBoundary", type="double"))
@FilterDef(name="southOfLatitude", parameters=@ParamDef(name="northBoundary", type="double"))
@FilterDef(name="westOfLongitude", parameters=@ParamDef(name="eastBoundary", type="double"))
@FilterDef(name="eastOfLongitude", parameters=@ParamDef(name="westBoundary", type="double"))
@Filters( {
	@Filter(name="beforeDate", condition=":beforeDate >= crimedate"),
	@Filter(name="afterDate", condition=":afterDate <= crimedate"),
	@Filter(name="isWeapon", condition=":weapon = weapon"),
	@Filter(name="isCrimeCode", condition=":crimecode = crimecode"),
	@Filter(name="isDistrict", condition=":district = district"),
	@Filter(name="northOfLatitude", condition=":southBoundary <= latitude"),
	@Filter(name="southOfLatitude", condition=":northBoundary >= latitude"),
	@Filter(name="westOfLongitude", condition=":eastBoundary >= longitude"),
	@Filter(name="eastOfLongitude", condition=":westBoundary <= longitude")
})
public class Crime {

	public Crime()
	{
		return;
	}
	
    public Crime(Integer id, LocalDate crimedate, LocalTime crimetime, String crimecode, String location,
			String description, String inside_outside, String weapon, Integer post, String district,
			String neighborhood, Double longitude, Double latitude, String premise, Integer total_incidents) {
		super();
		this.id = id;
		this.crimedate = crimedate;
		this.crimetime = crimetime;
		this.crimecode = crimecode;
		this.location = location;
		this.description = description;
		this.inside_outside = inside_outside;
		this.weapon = weapon;
		this.post = post;
		this.district = district;
		this.neighborhood = neighborhood;
		this.longitude = longitude;
		this.latitude = latitude;
		this.premise = premise;
		this.total_incidents = total_incidents;
	}
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
