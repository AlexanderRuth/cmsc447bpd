package crime;

import java.util.List;


import org.springframework.data.domain.Example;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.geo.Polygon;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.RepositoryDefinition;
import org.springframework.stereotype.Repository;

import crime.Crime;
import latlong.LatLong;
import aggregation.Aggregation;

/*  Crime Schema:
 
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
 */

@Repository
public interface CrimeRepository extends CrudRepository<Crime, Integer> {
	
		Iterable<Crime> findAll(Example<Crime> example);
        Iterable<Crime> findAll(Example<Crime> example, Pageable pageRequest);
 
        @Query("SELECT new latlong.LatLong(c.latitude, c.longitude) FROM Crime c")
        Page<LatLong> FindAll(Example<Crime> example, Pageable page);
        @Query("SELECT new latlong.LatLong(latitude, longitude) FROM Crime c "
        		+ "WHERE true = ST_CONTAINS(ST_GeomFromText(?1), Point(c.longitude, c.latitude)) "
        		+ "GROUP BY latitude, longitude")        
        Page<LatLong> FindAll(String polygon, Pageable page);
        
        @Query("SELECT new aggregation.Aggregation(c.weapon, COUNT(c)) FROM Crime c "
        		+ "GROUP BY c.weapon")
        List<Aggregation> countByWeapon();
        @Query("SELECT new aggregation.Aggregation(c.weapon, COUNT(c)) FROM Crime c "
        		+ "WHERE true = ST_CONTAINS(ST_GeomFromText(?1), Point(c.longitude, c.latitude)) "
        		+ "GROUP BY c.weapon")
        List<Aggregation> countByWeapon(String polygon);
        
        @Query("SELECT new aggregation.Aggregation(c.crimecode, COUNT(c)) FROM Crime c "
        		+ "GROUP BY c.crimecode")
        List<Aggregation> countByCrimecode();
        @Query("SELECT new aggregation.Aggregation(c.crimecode, COUNT(c)) FROM Crime c "
        		+ "WHERE true = ST_CONTAINS(ST_GeomFromText(?1), Point(c.longitude, c.latitude)) "
        		+ "GROUP BY c.crimecode")
        List<Aggregation> countByCrimecode(String polygon);
        
        @Query("SELECT new aggregation.Aggregation(c.district, COUNT(c)) FROM Crime c "
        		+ "GROUP BY c.district")
        List<Aggregation> countByDistrict();
        @Query("SELECT new aggregation.Aggregation(c.district, COUNT(c)) FROM Crime c "
        		+ "WHERE true = ST_CONTAINS(ST_GeomFromText(?1), Point(c.longitude, c.latitude)) "
        		+ "GROUP BY c.district")
        List<Aggregation> countByDistrict(String polygon);

        @Query("SELECT new aggregation.Aggregation(DAY(c.crimedate), MONTH(c.crimedate), YEAR(c.crimedate), COUNT(c)) FROM Crime c "
        		+ "GROUP BY YEAR(c.crimedate), MONTH(c.crimedate), DAY(c.crimedate)")
        List<Aggregation> countByDay();
        @Query("SELECT new aggregation.Aggregation(DAY(c.crimedate), MONTH(c.crimedate), YEAR(c.crimedate), COUNT(c)) FROM Crime c "
        		+ "WHERE true = ST_CONTAINS(ST_GeomFromText(?1), Point(c.longitude, c.latitude)) "
        		+ "GROUP BY YEAR(c.crimedate), MONTH(c.crimedate), DAY(c.crimedate)")
        List<Aggregation> countByDay(String polygon);
        
        @Query("SELECT new aggregation.Aggregation(MONTH(c.crimedate), YEAR(c.crimedate), COUNT(c)) FROM Crime c "
        		+ "GROUP BY YEAR(c.crimedate), MONTH(c.crimedate)")
        List<Aggregation> countByMonth();
        @Query("SELECT new aggregation.Aggregation(MONTH(c.crimedate), YEAR(c.crimedate), COUNT(c)) FROM Crime c "
        		+ "WHERE true = ST_CONTAINS(ST_GeomFromText(?1), Point(c.longitude, c.latitude)) "
        		+ "GROUP BY YEAR(c.crimedate), MONTH(c.crimedate)")
        List<Aggregation> countByMonth(String polygon);
        
        @Query("SELECT new aggregation.Aggregation(YEAR(c.crimedate), COUNT(c)) FROM Crime c "
        		+ "WHERE true = ST_CONTAINS(ST_GeomFromText(?1), Point(c.longitude, c.latitude)) "
        		+ "GROUP BY YEAR(c.crimedate)")
        List<Aggregation> countByYear();
        @Query("SELECT new aggregation.Aggregation(YEAR(c.crimedate), COUNT(c)) FROM Crime c "
        		+ "WHERE true = ST_CONTAINS(ST_GeomFromText(?1), Point(c.longitude, c.latitude)) "
        		+ "GROUP BY YEAR(c.crimedate)")
        List<Aggregation> countByYear(String polygon);
        
        Crime findFirstByOrderByCrimedateDesc();
        
        @Query(value = "SELECT new crime.Crime(c.id, c.crimedate, c.crimetime, c.crimecode, c.location, c.description, c.insideOutside, c.weapon, c.post, c.district, c.neighborhood, c.longitude, c.latitude, c.premise, c.total_incidents)"
        		+ " FROM Crime c WHERE true = ST_CONTAINS(ST_GeomFromText(?1), Point(c.longitude, c.latitude))")
        Page<Crime> withinPolygon(String polygon, Pageable pageRequest);
}
