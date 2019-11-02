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
	@GetMapping(path="/filterbyall")
    public @ResponseBody Iterable<Crime> findByAllFilters(@RequestParam(name = "crimecode", required=false) String crimecode, 
    	@RequestParam(name = "before", required=false)  @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) java.time.LocalDate before, 
    	@RequestParam(name = "after", required=false)  @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) java.time.LocalDate after, 
    	@RequestParam(name = "weapon", required=false) String weapon,
    	@RequestParam(name = "district", required=false) String district,
    	@RequestParam(name = "northBoundary", required=false) Double northBoundary,
    	@RequestParam(name = "westBoundary", required=false) Double westBoundary,
    	@RequestParam(name = "southBoundary", required=false) Double southBoundary,
    	@RequestParam(name = "eastBoundary", required=false) Double eastBoundary) 
    	{
   
    	fs.apply_filters(crimecode, before, after, weapon, district, northBoundary, westBoundary, southBoundary, eastBoundary);
        
    	Crime crime = new Crime();
    
    	Iterable<Crime> response = crimeRepository.findAll(Example.of(crime)); 	
    	
    	fs.clear_filters(crimecode, before, after, weapon, district, northBoundary, westBoundary, southBoundary, eastBoundary);
    	
    	return response;
    }
    
    @CrossOrigin
	@GetMapping(path="/filterbyallpaged")
    public @ResponseBody Iterable<Crime> findByAllFiltersPaged(@RequestParam(name = "crimecode", required=false) String crimecode, 
    	@RequestParam(name = "before", required=false)  @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) java.time.LocalDate before, 
    	@RequestParam(name = "after", required=false)  @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) java.time.LocalDate after, 
    	@RequestParam(name = "weapon", required=false) String weapon,
    	@RequestParam(name = "district", required=false) String district,
    	@RequestParam(name = "northBoundary", required=false) Double northBoundary,
    	@RequestParam(name = "westBoundary", required=false) Double westBoundary,
    	@RequestParam(name = "southBoundary", required=false) Double southBoundary,
    	@RequestParam(name = "eastBoundary", required=false) Double eastBoundary, 
    	@RequestParam(name = "page_number", required=false) Integer page_number, @RequestParam(name="page_size", required=false) Integer page_size) {
   
    	fs.apply_filters(crimecode, before, after, weapon, district, northBoundary, westBoundary, southBoundary, eastBoundary);
        
    	Crime crime = new Crime();
    	
    	page_number = page_number != null ? page_number : 0;
    	page_size = page_size != null ? page_size : 5;
    	
    	Pageable page = PageRequest.of(page_number, page_size, Sort.by("post"));
    
    	Iterable<Crime> response = crimeRepository.findAll(Example.of(crime), page); 	
    	
    	fs.clear_filters(crimecode, before, after, weapon, district, northBoundary, westBoundary, southBoundary, eastBoundary);
    	
    	return response;
    }

    @CrossOrigin
	@GetMapping(path="/count")
    public @ResponseBody List<Aggregation> count(@RequestParam(name = "crimecode", required=false) String crimecode, 
    	@RequestParam(name = "before", required=false)  @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) java.time.LocalDate before, 
    	@RequestParam(name = "after", required=false)  @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) java.time.LocalDate after, 
    	@RequestParam(name = "weapon", required=false) String weapon,
    	@RequestParam(name = "district", required=false) String district,
    	@RequestParam(name = "northBoundary", required=false) Double northBoundary,
    	@RequestParam(name = "westBoundary", required=false) Double westBoundary,
    	@RequestParam(name = "southBoundary", required=false) Double southBoundary,
    	@RequestParam(name = "eastBoundary", required=false) Double eastBoundary, 
    	@RequestParam(name = "group_by", required = true) String group_by) {
    	
    	fs.apply_filters(crimecode, before, after, weapon, district, northBoundary, westBoundary, southBoundary, eastBoundary);
   
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
    	
    	fs.clear_filters(crimecode, before, after, weapon, district, northBoundary, westBoundary, southBoundary, eastBoundary);
    	
    	return response;
    }
    
    @CrossOrigin
	@PostMapping(path="/polygon")
    public @ResponseBody List<Crime> getPolygon(@RequestBody LatLongWrapper polygon_wrapper) {
    	
    	fs.apply_filters(polygon_wrapper.getCrimecode(), polygon_wrapper.getBefore(), polygon_wrapper.getAfter(), polygon_wrapper.getWeapon(), polygon_wrapper.getDistrict(), null, null, null, null);
   
   
    	List<LatLong> polygon = polygon_wrapper.getPoints();
    	ArrayList<Point> points = new ArrayList<Point>();
    	
    	for(int i = 0; i < polygon.toArray().length; i++)
    	{
    		System.err.println(polygon.get(i).getLat());
    		points.add(new Point(polygon.get(i).getLng(), polygon.get(i).getLat()));
    	}
    	
    	Polygon poly = new Polygon(points);
    	String poly_string = "POLYGON((";
    	Boolean first = true;
    	
    	for(Point point : poly.getPoints())
    	{
    		poly_string += String.valueOf(point.getX()) + " " + String.valueOf(point.getY()) + ", ";
    	}
    	
    	poly_string += String.valueOf(poly.getPoints().get(0).getX()) + " " + String.valueOf(poly.getPoints().get(0).getY());
    	
    	poly_string += "))";
    	
    	System.err.println(poly_string);
    	
    	//String test = "POLYGON((-71.1776585052917 42.3902909739571,-71.1776820268866 42.3903701743239, -71.1776063012595 42.3903825660754,-71.1775826583081 42.3903033653531,-71.1776585052917 42.3902909739571))";

    	List<Crime> response = crimeRepository.withinPolygon(poly_string);
    	
    	fs.clear_filters(polygon_wrapper.getCrimecode(), polygon_wrapper.getBefore(), polygon_wrapper.getAfter(), polygon_wrapper.getWeapon(), polygon_wrapper.getDistrict(), null, null, null, null);
    	
    	return response;
    }
    
}
