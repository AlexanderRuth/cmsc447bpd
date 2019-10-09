package crime;

import org.springframework.data.domain.Example;
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
public interface CrimeRepository extends CrudRepository<Crime, Integer> {
        Iterable<Crime> findAllByCrimecode(String crimecode);
        Iterable<Crime> findAllByCrimecodeAndCrimedate(String crimecode, java.util.Date date);
        Iterable<Crime> findAll(Example<Crime> example);
}
