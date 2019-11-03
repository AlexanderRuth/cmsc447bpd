package filter;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

import org.hibernate.Filter;
import org.hibernate.Session;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.geo.Point;
import org.springframework.data.geo.Polygon;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestParam;

import crime.Crime;
import crime.CrimeRepository;
import latlong.LatLong;

@Service("filter")
public class FilterService {

	@PersistenceContext 
    private EntityManager entityManager;

	@Autowired
	private CrimeRepository crimeRepository;
	
	public void apply_filters(CrimeFilter f)
	{
    	//Apply filters as needed
    	if(f.before != null) {
    		Filter filterBefore = (Filter)entityManager.unwrap(Session.class).enableFilter("beforeDate");
    		filterBefore.setParameter("beforeDate", java.sql.Date.valueOf(f.before));
    	}
    	if(f.after != null) {
    		Filter filterAfter = (Filter)entityManager.unwrap(Session.class).enableFilter("afterDate");
        	filterAfter.setParameter("afterDate", java.sql.Date.valueOf(f.after));
    	}
    	
    	if(f.weapon != null) {
    		Filter filterWeapon = (Filter)entityManager.unwrap(Session.class).enableFilter("isWeapon");
    		filterWeapon.setParameter("weapon", f.weapon); 		
    	}
    	
    	if(f.crimecode != null) {
    		Filter filterCrimecode = (Filter)entityManager.unwrap(Session.class).enableFilter("isCrimeCode");
    		filterCrimecode.setParameter("crimecode", f.crimecode);
    	}
    	
    	if(f.district != null) {
    		Filter filterDistrict = (Filter)entityManager.unwrap(Session.class).enableFilter("isDistrict");
    		filterDistrict.setParameter("district", f.district);
    	}
	}
	
	public void clear_filters(CrimeFilter f)
	{
    	//Remove filters as needed
    	if(f.before != null) {
    		entityManager.unwrap(Session.class).disableFilter("beforeDate");
    	}
        
    	if(f.after != null) {
    		entityManager.unwrap(Session.class).disableFilter("afterDate");
    	}
    	
    	if (f.weapon != null) {
    		entityManager.unwrap(Session.class).disableFilter("isWeapon");
    	}
    	
    	if (f.crimecode != null) {
    		entityManager.unwrap(Session.class).disableFilter("isCrimecode");
    	}
    	
    	if (f.district != null) {
    		entityManager.unwrap(Session.class).disableFilter("isDistrict");
    	}
	}
	
	public String polygon_string(CrimeFilter filter)
	{
		List<LatLong> polygon = filter.getPoints();
    	ArrayList<Point> points = new ArrayList<Point>();
    	
    	for(int i = 0; i < polygon.toArray().length; i++)
    		points.add(new Point(polygon.get(i).getLng(), polygon.get(i).getLat()));
    	
    	Polygon poly = new Polygon(points);
    	
    	String poly_string = "POLYGON((";
    	
    	for(Point point : poly.getPoints())
    	{
    		poly_string += String.valueOf(point.getX()) + " " + String.valueOf(point.getY()) + ", ";
    	}
    	
    	poly_string += String.valueOf(poly.getPoints().get(0).getX()) + " " + String.valueOf(poly.getPoints().get(0).getY()) + "))";
    	
    	return poly_string;
	}
	
	public List<Crime> points_within_polygon(CrimeFilter filter)
	{
		List<LatLong> polygon = filter.getPoints();
    	ArrayList<Point> points = new ArrayList<Point>();
    	
    	for(int i = 0; i < polygon.toArray().length; i++)
    		points.add(new Point(polygon.get(i).getLng(), polygon.get(i).getLat()));
    	
    	Polygon poly = new Polygon(points);
    	
    	String poly_string = "POLYGON((";
    	
    	for(Point point : poly.getPoints())
    	{
    		poly_string += String.valueOf(point.getX()) + " " + String.valueOf(point.getY()) + ", ";
    	}
    	
    	poly_string += String.valueOf(poly.getPoints().get(0).getX()) + " " + String.valueOf(poly.getPoints().get(0).getY()) + "))";
    	
    	return crimeRepository.withinPolygon(poly_string);
	}
}
