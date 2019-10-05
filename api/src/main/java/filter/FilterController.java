package filter;

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

}
