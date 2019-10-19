package filter;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

import org.hibernate.Filter;
import org.hibernate.Session;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestParam;

@Service("filter")
public class FilterService {

	@PersistenceContext 
    private EntityManager entityManager;
	
	public void apply_filters(String crimecode, java.time.LocalDate before,  java.time.LocalDate after, String weapon, String district)
	{
    	//Apply filters as needed
    	if(before != null) {
    		Filter filterBefore = (Filter)entityManager.unwrap(Session.class).enableFilter("beforeDate");
    		filterBefore.setParameter("beforeDate", java.sql.Date.valueOf(before));
    	}
        
    	if(after != null) {
    		Filter filterAfter = (Filter)entityManager.unwrap(Session.class).enableFilter("afterDate");
        	filterAfter.setParameter("afterDate", java.sql.Date.valueOf(after));
    	}
    	
    	if(weapon != null) {
    		Filter filterWeapon = (Filter)entityManager.unwrap(Session.class).enableFilter("isWeapon");
    		filterWeapon.setParameter("weapon", weapon); 		
    	}
    	
    	if(crimecode != null) {
    		Filter filterCrimecode = (Filter)entityManager.unwrap(Session.class).enableFilter("isCrimeCode");
    		filterCrimecode.setParameter("crimecode", crimecode);
    	}
    	
    	if(district != null) {
    		Filter filterDistrict = (Filter)entityManager.unwrap(Session.class).enableFilter("isDistrict");
    		filterDistrict.setParameter("district", district);
    	}
	}
	
	public void clear_filters(String crimecode, java.time.LocalDate before,  java.time.LocalDate after, String weapon, String district)
	{
    	//Remove filters as needed
    	if(before != null) {
    		entityManager.unwrap(Session.class).disableFilter("beforeDate");
    	}
        
    	if(after != null) {
    		entityManager.unwrap(Session.class).disableFilter("afterDate");
    	}
    	
    	if (weapon != null) {
    		entityManager.unwrap(Session.class).disableFilter("isWeapon");
    	}
    	
    	if (crimecode != null) {
    		entityManager.unwrap(Session.class).disableFilter("isCrimecode");
    	}
    	
    	if (district != null) {
    		entityManager.unwrap(Session.class).disableFilter("isDistrict");
    	}
	}
}
