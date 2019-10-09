package filter;

import org.springframework.data.domain.Example;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

import org.hibernate.Filter;
import org.hibernate.Session;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import crime.Crime;
import crime.CrimeRepository;

@RestController
public class FilterController {

	@PersistenceContext 
    private EntityManager entityManager;

	@Autowired
	private CrimeRepository crimeRepository;
	
	@RequestMapping(value = "/greeting")
	public String all()
	{
		return "Hi";
	}
	
	
	//Sample: /filterbydate?crimecode=4C&crimedate=2019-09-18
    @CrossOrigin
	@GetMapping(path="/filterbydate")
    public @ResponseBody Iterable<Crime> filterByDate(@RequestParam(name = "crimecode") String crimecode, @RequestParam(name = "crimedate") @DateTimeFormat(pattern="yyyy-mm-dd") java.util.Date crimedate) {
            return crimeRepository.findAllByCrimecodeAndCrimedate(crimecode, crimedate);
    }
    
    @CrossOrigin
	@GetMapping(path="/filterbyall")
    public @ResponseBody Iterable<Crime> findByAllFilters(@RequestParam(name = "crimecode", required=false) String crimecode, 
    	@RequestParam(name = "before", required=false)  @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) java.time.LocalDate before, 
    	@RequestParam(name = "after", required=false)  @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) java.time.LocalDate after, 
    	@RequestParam(name = "weapon", required=false) String weapon) {
   
    	//Apply before and after filters as needed
    	if(before != null) {
    		Filter filterBefore = (Filter)entityManager.unwrap(Session.class).enableFilter("beforeDate");
    		filterBefore.setParameter("beforeDate", java.sql.Date.valueOf(before));
    	}
        
    	if(after != null) {
    		Filter filterAfter = (Filter)entityManager.unwrap(Session.class).enableFilter("afterDate");
        	filterAfter.setParameter("afterDate", java.sql.Date.valueOf(after));
    	}
        
    	Crime crime = new Crime();
    	crime.setCrimecode(crimecode);
    	crime.setWeapon(weapon);
    
    	Iterable<Crime> response = crimeRepository.findAll(Example.of(crime)); 	
    	
    	//Remove before and after filters as needed
    	if(before != null) {
    		entityManager.unwrap(Session.class).disableFilter("beforeDate");
    	}
        
    	if(after != null) {
    		entityManager.unwrap(Session.class).disableFilter("afterDate");
    	}
    	
    	return response;
    }

}
