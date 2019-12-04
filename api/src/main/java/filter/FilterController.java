package filter;

import org.springframework.data.domain.Example;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.geo.Point;

import java.io.File;
import java.io.InputStream;
import java.nio.file.Paths;
import java.time.LocalDate;
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
import mlearning.CrimePredictEntity;
import mlearning.CrimePredictEntityResponse;
import mlearning.CrimePredictTrainer;
import weka.classifiers.functions.LinearRegression;
import weka.core.Attribute;
import weka.core.DenseInstance;
import weka.core.Instance;
import weka.core.Instances;
import weka.core.SerializationHelper;
import weka.filters.unsupervised.attribute.NominalToBinary;
import aggregation.Aggregation;
import org.springframework.data.geo.Polygon;

@RestController
@RequestMapping("/crime")
public class FilterController {

	@PersistenceContext 
	private EntityManager entityManager;

	@Autowired
	private CrimeRepository crimeRepository;

	@Autowired
	private FilterService fs;

	@GetMapping(value = "/greeting")
	public String all()
	{
		return "Hi";
	}


	/*@CrossOrigin
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
    }*/

	@CrossOrigin
	@PostMapping(path="/filterbyallpaged")
	public @ResponseBody Iterable<Crime> findByAllFiltersPaged(@RequestBody CrimeFilter filter) {

		fs.apply_filters(filter);

		Crime crime = new Crime();

		filter.page_number = filter.page_number != null ? filter.page_number : 0;
		filter.page_size = filter.page_size != null ? filter.page_size : 5;

		Pageable page;

		//Sort or not sort, depending on the request
		if(filter.sort_by != null) {

			//If desc requested, sort descending, otherwise, default to sort ascending
			if(filter.sort_direction != null && filter.sort_direction.toLowerCase().contentEquals("desc"))
				page = PageRequest.of(filter.page_number, filter.page_size, Sort.by(filter.sort_by).descending());
			else
				page = PageRequest.of(filter.page_number, filter.page_size, Sort.by(filter.sort_by));
		}
		else
			page = PageRequest.of(filter.page_number, filter.page_size);

		Iterable<Crime> response;

		if(filter.points != null)
			response = fs.points_within_polygon(filter, page);
		else
			response = crimeRepository.findAll(Example.of(crime), page); 	


		fs.clear_filters(filter);

		return response;
	}

	@CrossOrigin
	@PostMapping(path="/latlong")
	public @ResponseBody Iterable<LatLong> latlong(@RequestBody CrimeFilter filter) {

		fs.apply_filters(filter);

		Crime crime = new Crime();
		String poly_string = filter.points != null ? fs.polygon_string(filter) : null;
		filter.page_number = filter.page_number != null ? filter.page_number : 0;
		filter.page_size = 50000;

		Pageable page = PageRequest.of(filter.page_number, filter.page_size);

		Iterable<LatLong> response = null;

		if(filter.points != null)
			response = crimeRepository.FindAll(poly_string, page);
		else
			response = crimeRepository.FindAll(Example.of(crime), page);

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
	@PostMapping(path="/latestdate")
	public LocalDate getLatestDate(){

		LocalDate response = null;

		Crime crime = crimeRepository.findFirstByOrderByCrimedateDesc();

		response = crime.getCrimedate();
		return response;
	}

	@CrossOrigin
	@PostMapping(path="/predict")
	public List<CrimePredictEntityResponse> getCrimePrediction(@RequestBody List<CrimePredictEntity> request_list) {
		Integer count;
		ArrayList<Attribute> atts = new ArrayList<Attribute>();  	
		ArrayList<String> weapon_nominal = new ArrayList<String>();

		ArrayList<CrimePredictEntityResponse> response_list = new ArrayList<CrimePredictEntityResponse>();

		try {
			ClassLoader classLoader = Thread.currentThread().getContextClassLoader();
			InputStream model_stream = classLoader.getResourceAsStream("lr.model");
			InputStream ntb_stream = classLoader.getResourceAsStream("ntb.model");

			//Add all potential weapon options
			weapon_nominal.add("NA");
			weapon_nominal.add("FIREARM");
			weapon_nominal.add("OTHER");
			weapon_nominal.add("KNIFE");
			weapon_nominal.add("HANDS");
			weapon_nominal.add("FIRE");

			//Set the attributes for each instance
			atts.add(new Attribute("month"));
			atts.add(new Attribute("year"));
			atts.add(new Attribute("weapon", weapon_nominal));
			atts.add(new Attribute("count"));
			
			//The group of instances being guessed
			Instances dataToGuess = new Instances("RequestInstances", atts, 0);

			//Add each instance to the instances
			for(int i = 0; i < request_list.size(); i++)
			{
				Instance inst = new DenseInstance(4);
				dataToGuess.setClassIndex(dataToGuess.numAttributes() - 1);

				inst.setDataset(dataToGuess);

				if(request_list.get(i).weapon.contentEquals("NONE"))
					request_list.get(i).weapon = "NA";

				inst.setValue(2, request_list.get(i).weapon);
				inst.setValue(1,  request_list.get(i).year);
				inst.setValue(0, request_list.get(i).month); 
				inst.setValue(3, 1000);

				dataToGuess.add(inst);

			}

			//Load the regression model and ntb filter
			LinearRegression model = (LinearRegression) SerializationHelper.read(model_stream);
			NominalToBinary ntb = (NominalToBinary) SerializationHelper.read(ntb_stream);
			dataToGuess = weka.filters.Filter.useFilter(dataToGuess, ntb);

			//Guess each count
			for(int i = 0; i < dataToGuess.numInstances(); i++)
			{
				count = (int) model.classifyInstance(dataToGuess.get(i));
				response_list.add(new CrimePredictEntityResponse(request_list.get(i).month, request_list.get(i).year, request_list.get(i).weapon, count));

			}
		}
		catch(Exception err) {
			System.err.println(err);
			return null;
		}
		
		//Return the response
		return response_list;
	}

}
