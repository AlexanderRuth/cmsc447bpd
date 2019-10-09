package crime;

import java.util.List;

import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.RepositoryDefinition;
import org.springframework.stereotype.Repository;

import crime.Crime;

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
public class CrimeDao {
        List<Crime> findAllByAll(java.sql.Date crimedate,
        							 java.sql.Time crimetime,
        							 String crimecode,
        							 String location,
        							 String description,
        							 String inside_outside,
        							 String weapon,
        							 Integer post,
        							 String district,
        							 String neighborhood,
        							 Double longitude,
        							 Double latitude,
        							 String premise,
        							 Integer total_incidents)
        {
        	return null;
        }
}
