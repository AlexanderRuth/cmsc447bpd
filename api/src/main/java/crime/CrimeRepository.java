package crime;

import java.util.List;

import org.springframework.data.domain.Example;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.RepositoryDefinition;
import org.springframework.stereotype.Repository;

import crime.Crime;
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
        Iterable<Crime> findAllByCrimecode(String crimecode);
        Iterable<Crime> findAllByCrimecodeAndCrimedate(String crimecode, java.util.Date date);
        Iterable<Crime> findAll(Example<Crime> example);
 
        @Query("SELECT new aggregation.Aggregation(c.weapon, COUNT(c)) FROM Crime c GROUP BY c.weapon")
        List<Aggregation> countByWeapon();
        
        @Query("SELECT new aggregation.Aggregation(c.crimecode, COUNT(c)) FROM Crime c GROUP BY c.crimecode")
        List<Aggregation> countByCrimecode();
        
        @Query("SELECT new aggregation.Aggregation(c.district, COUNT(c)) FROM Crime c GROUP BY c.district")
        List<Aggregation> countByDistrict();
}
