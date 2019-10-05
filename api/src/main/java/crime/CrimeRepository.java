package crime;

import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.RepositoryDefinition;
import org.springframework.stereotype.Repository;

import crime.Crime;

@Repository
public interface CrimeRepository extends CrudRepository<Crime, Integer> {
        Iterable<Crime> findAllByCrimecode(String crimecode);
        Iterable<Crime> findAllByCrimecodeAndCrimedate(String crimecode, java.util.Date date);
}
