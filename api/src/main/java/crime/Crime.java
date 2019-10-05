package crime;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Entity
public class Crime {

    @Id
    @GeneratedValue(strategy=GenerationType.AUTO)
    private Integer id;

    private java.sql.Date crimedate;
    private java.sql.Time crimetime;
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

    public java.sql.Date getCrimedate() {
        return crimedate;
    }

    public java.sql.Time getCrimetime() {
        return crimetime;
    }

    public String getCrimecode() {
        return crimecode;
    }

    public String getLocation() {
        return location;
    }

    public String getDescription() {
        return description;
    }

    public String getInside_outside() {
        return inside_outside;
    }

    public String getWeapon() {
        return weapon;
    }

    public Integer getPost() {
        return post;
    }

    public String getDistrict() {
        return district;
    }

    public String getNeighborhood() {
        return neighborhood;
    }

    public Double getLongitude() {
        return longitude;
    }

    public Double getLatitude() {
        return latitude;
    }

    public String getPremise() {
        return premise;
    }

    public Integer getTotal_incidents() {
        return total_incidents;
    }
}
