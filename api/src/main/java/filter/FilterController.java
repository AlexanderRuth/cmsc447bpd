package filter;

import org.springframework.data.domain.Example;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.geo.Point;

import java.util.ArrayList;
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
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import crime.Crime;
import crime.CrimeRepository;
import latlong.LatLong;
import latlong.LatLongWrapper;
import aggregation.Aggregation;
import org.springframework.data.geo.Polygon;

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
	@PostMapping(path="/filterbyall")
    public @ResponseBody Iterable<Crime> findByAllFilters(@RequestBody CrimeFilter filter)
    	{
   
    	fs.apply_filters(filter);
        
    	Crime crime = new Crime();

    	Iterable<Crime> response;
    	
    	if(filter.points != null)
    		response = fs.points_within_polygon(filter);
    	else
    		response = crimeRepository.findAll(Example.of(crime)); 
    	
    	fs.clear_filters(filter);
    	
    	return response;
    }
    
    @CrossOrigin
	@PostMapping(path="/filterbyallpaged")
    public @ResponseBody Iterable<Crime> findByAllFiltersPaged(@RequestBody CrimeFilter filter) {
   
    	fs.apply_filters(filter);
        
    	Crime crime = new Crime();
    	
    	filter.page_number = filter.page_number != null ? filter.page_number : 0;
    	filter.page_size = filter.page_size != null ? filter.page_size : 5;
    	
    	Pageable page = PageRequest.of(filter.page_number, filter.page_size, Sort.by("post"));
    	
    	Iterable<Crime> response;
    	
    	if(filter.points != null)
    		response = fs.points_within_polygon(filter);
    	else
    		response = crimeRepository.findAll(Example.of(crime), page); 	
   
    	
    	fs.clear_filters(filter);
    	
    	return response;
    }

    @CrossOrigin
    @PostMapping(path="/latlong")
    public @ResponseBody List<LatLong> latlong(@RequestBody CrimeFilter filter) {
   
    	fs.apply_filters(filter);

    	Crime crime = new Crime();
    	String poly_string = filter.points != null ? fs.polygon_string(filter) : null;

    	List<LatLong> response = null;
    	
    	if(filter.points != null)
    		response = crimeRepository.FindAll(poly_string);
    	else
    		response = crimeRepository.FindAll(Example.of(crime));
    	
    	fs.clear_filters(filter);
    	
    	return response;
    }
    
    @CrossOrigin
	@PostMapping(path="/count")
    public @ResponseBody List<Aggregation> count(@RequestBody CrimeFilter filter) {
    	
    	fs.apply_filters(filter);
   
    	List<Aggregation> response = null;
    	String group_by = filter.group_by != null ? filter.group_by : "weapon";
    	String poly_string = filter.points != null ? fs.polygon_string(filter) : null;
    	
    	if(group_by.contentEquals("weapon"))
    		response = poly_string != null ? crimeRepository.countByWeapon(poly_string) : crimeRepository.countByWeapon();
    	if(group_by.contentEquals("district"))
    		response = poly_string != null ? crimeRepository.countByDistrict(poly_string) : crimeRepository.countByDistrict();
    	if(group_by.contentEquals("crimecode"))
    		response = poly_string != null ? crimeRepository.countByCrimecode(poly_string) : crimeRepository.countByCrimecode();
    	if(group_by.contentEquals("day"))
    		response = poly_string != null ? crimeRepository.countByDay(poly_string) : crimeRepository.countByDay();
    	if(group_by.contentEquals("month"))
    		response = poly_string != null ? crimeRepository.countByMonth(poly_string) : crimeRepository.countByMonth();
    	if(group_by.contentEquals("year"))
    		response = poly_string != null ? crimeRepository.countByYear(poly_string) : crimeRepository.countByYear();
    	
    	fs.clear_filters(filter);
    	
    	return response;
    }
    
    @CrossOrigin
	@PostMapping(path="/polygon")
    public @ResponseBody List<Crime> getPolygon(@RequestBody CrimeFilter filter) {
    	
    	fs.apply_filters(filter);
  
    	List<Crime> response = fs.points_within_polygon(filter);
    	
    	fs.clear_filters(filter);
    	
    	return response;
    }
    
}
