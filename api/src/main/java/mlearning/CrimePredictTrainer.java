package mlearning;

import java.io.File;
import java.util.Properties;

import weka.classifiers.functions.LinearRegression;
import weka.core.Instances;
import weka.core.SerializationHelper;
import weka.experiment.InstanceQuery;
import weka.filters.Filter;
import weka.filters.unsupervised.attribute.NominalToBinary;

public class CrimePredictTrainer {
	private static String db_url = "jdbc:mysql://130.85.228.219:3306/bpd_crime?serverTimezone=EST";

	private static String db_username = "springuser";

	private static String db_password = "SPRINGPASSWORD";
	
	public static void main(String[] args) {
		
		//Weka
		try {
			File file = new File(new CrimePredictTrainer().getClass().getClassLoader().getResource("DatabaseUtil.props").getFile());
		
			InstanceQuery query = new InstanceQuery();
			
			query.setCustomPropsFile(file);
			query.setDatabaseURL(db_url);
			query.setUsername(db_username);
			query.setPassword(db_password);
			query.setQuery("SELECT MONTH(crimedate) as month, YEAR(crimedate) as year, weapon, COUNT(*) as count"
						+ " FROM crime WHERE YEAR(crimedate) > 2012 GROUP BY YEAR(crimedate), MONTH(crimedate), DAYOFWEEK(crimedate), weapon");
		
			Instances data = query.retrieveInstances();
			data.setClassIndex(data.numAttributes() - 1);
			NominalToBinary ntb = new NominalToBinary();
			ntb.setInputFormat(data);
			data = Filter.useFilter(data,  ntb);
			
			//Build the model
			LinearRegression model = new LinearRegression();
			model.setOptions(new String[] {"-additional-stats"});
			model.buildClassifier(data);
			
			//Save models (they should be moved to resources)
			SerializationHelper.write("C:\\Users\\alexr\\OneDrive\\Desktop\\lr.model", model);
			SerializationHelper.write("C:\\Users\\alexr\\OneDrive\\Desktop\\ntb.model", ntb);
			
			//How to load an object
			//ntb = (NominalToBinary) SerializationHelper.read("C:\\Users\\alexr\\OneDrive\\Desktop\\ntb.model");
			//System.err.println(ntb.getOutputFormat());
		}
		catch (Exception err) {
			System.err.println(err);
		}
		
		/*
		 * MLLIB
		 * //Spark Configuration
		SparkConf sparkConf = new SparkConf().setAppName("CrimePredictTrainer")
				.setMaster("local");
		JavaSparkContext ctx = new JavaSparkContext(sparkConf);
		SparkSession spark = SparkSession
				.builder()
				.appName("CrimePredictTrainer")
				.master("local")
				.getOrCreate();
		
		//Read the database
		Dataset<Row> jdbcDF = spark.read()
				.format("jdbc")
				.option("url", "jdbc:mysql://130.85.228.219:3306/bpd_crime")
				.option("user", "springuser")
				.option("password", "SPRINGPASSWORD")
				.option("query", "SELECT MONTH(crimedate) as month, DAYOFWEEK(crimedate) as day, weapon, COUNT(*) as count"
						+ " FROM crime GROUP BY YEAR(crimedate), MONTH(crimedate), DAYOFWEEK(crimedate), weapon")
				.load();
		
		Column weaponCol = when(col("weapon").equalTo("KNIFE"), 0)
				.when(col("weapon").equalTo("FIREARM"), 1)
				.when(col("weapon").equalTo("KNIFE"), 2)
				.when(col("weapon").equalTo("HANDS"), 3)
				.when(col("weapon").equalTo("OTHER"), 4)
				.otherwise(5);
		
		jdbcDF = jdbcDF.withColumn("weapon", weaponCol);
		jdbcDF = jdbcDF.withColumnRenamed("count", "label");
		jdbcDF.show();
		StringIndexer indexer = new StringIndexer()
				.setInputCol("weapon")
				.setOutputCol("weaponIndex");
		StringIndexerModel strmodel = indexer.fit(jdbcDF); 
		jdbcDF = strmodel.transform(jdbcDF);
		
		OneHotEncoderEstimator encoder = new OneHotEncoderEstimator()
				.setInputCols(new String[] {"weapon"})
				.setOutputCols(new String[] {"weaponVec"});
		OneHotEncoderModel model = encoder.fit(jdbcDF);
		jdbcDF = model.transform(jdbcDF);
	
		String[] input = {"weapon", "month", "day"};
		
		VectorAssembler assembler = new VectorAssembler()
				.setInputCols(input)
				.setOutputCol("features");
		
		jdbcDF= assembler.transform(jdbcDF);
		jdbcDF.show();
		
		Dataset<Row>[] splits = jdbcDF.randomSplit(new double[] {0.8, 0.2}, 11L);
		Dataset<Row> trainingData = splits[0];
		Dataset<Row> testData = splits[1];
	
		
		LinearRegression lr = new LinearRegression()
				.setMaxIter(10)
				.setRegParam(0.3)
				.setElasticNetParam(0.8);
		
		LinearRegressionModel lrModel = lr.train(trainingData);
		
		//LinearRegressionTrainingSummary trainingSummary = lrModel.summary();
		//System.err.println("r2: " + trainingSummary.r2());
		
		//Properties connectionProperties = new Properties();
		//connectionProperties.put("user", "root");
		//connectionProperties.put("password", "root");
		
		//Output the DataFrame (Dataset in reality)
		jdbcDF.show();*/
	}
}
