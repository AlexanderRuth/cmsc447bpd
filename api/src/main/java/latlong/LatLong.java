package latlong;

public class LatLong {
	private Double lat;
	private Double lng;
	public Double getLat() {
		return lat;
	}
	public void setLat(Double lat) {
		this.lat = lat;
	}
	public Double getLng() {
		return lng;
	}
	public LatLong()
	{
		
	}
	public LatLong(Double lat, Double lng) {
		super();
		this.lat = lat;
		this.lng = lng;
	}
	public void setLng(Double lng) {
		this.lng = lng;
	}
}
