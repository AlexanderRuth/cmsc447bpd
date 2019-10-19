package filter;

import org.springframework.data.domain.Example;

import java.util.HashMap;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

import org.hibernate.Filter;
import org.hibernate.Session;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;
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

import aggregation.Aggregation;

@RestController
public class FilterController {

	@PersistenceContext 
    private EntityManager entityManager;

	@Autowired
	private CrimeRepository crimeRepository;
	
	@Autowired
	private FilterService fs;
	
	@RequestMapping(value = "/greeting")
	public String all()
	{
		return "Hi";
	}
	
	
    @CrossOrigin
	@GetMapping(path="/filterbyall")
    public @ResponseBody Iterable<Crime> findByAllFilters(@RequestParam(name = "crimecode", required=false) String crimecode, 
    	@RequestParam(name = "before", required=false)  @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) java.time.LocalDate before, 
    	@RequestParam(name = "after", required=false)  @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) java.time.LocalDate after, 
    	@RequestParam(name = "weapon", required=false) String weapon,
    	@RequestParam(name = "district", required=false) String district) {
   
    	fs.apply_filters(crimecode, before, after, weapon, district);
        
    	Crime crime = new Crime();
    
    	Iterable<Crime> response = crimeRepository.findAll(Example.of(crime)); 	
    	
    	fs.clear_filters(crimecode, before, after, weapon, district);
    	
    	return response;
    }

    @CrossOrigin
	@GetMapping(path="/count")
    public @ResponseBody List<Aggregation> count(@RequestParam(name = "crimecode", required=false) String crimecode, 
    	@RequestParam(name = "before", required=false)  @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) java.time.LocalDate before, 
    	@RequestParam(name = "after", required=false)  @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) java.time.LocalDate after, 
    	@RequestParam(name = "weapon", required=false) String weapon,
    	@RequestParam(name = "district", required=false) String district,
    	@RequestParam(name = "group_by", required = true) String group_by) {
    	
    	fs.apply_filters(crimecode, before, after, weapon, district);
   
    	List<Aggregation> response = null;
    	
    	if(group_by.contentEquals("weapon"))
    		response = crimeRepository.countByWeapon();
    	if(group_by.contentEquals("district"))
    		response = crimeRepository.countByDistrict();
    	if(group_by.contentEquals("crimecode"))
		    response = crimeRepository.countByCrimecode();
    	if(group_by.contentEquals("day"))
    		response = crimeRepository.countByDay();
    	if(group_by.contentEquals("month"))
    		response = crimeRepository.countByMonth();
    	if(group_by.contentEquals("year"))
    		response = crimeRepository.countByYear();
    	
    	fs.clear_filters(crimecode, before, after, weapon, district);
    	
    	return response;
    }
    
}
