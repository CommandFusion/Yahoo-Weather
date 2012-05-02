function getWeather(listIndex)
//request weather at WOEID
		{
		CF.setJoin("s100", 
			"http://maps.google.com/maps/api/staticmap?center=" + 
			decodedJSONObj.places.place[listIndex].centroid.latitude +
			"," +
			decodedJSONObj.places.place[listIndex].centroid.longitude +
			"&zoom=6&format=png&maptype=roadmap&mobile=false&markers=label:S|" + 
			decodedJSONObj.places.place[listIndex].centroid.latitude +
			"," +
			decodedJSONObj.places.place[listIndex].centroid.longitude +
			"&size=320x480&key=ABQIAAAAQ127-gVdIM3nq38RBYCN-RRrZQw2CF6YFdWEO75V5821rhw7fBTGniMwnKw_COoRSFJ3rNONzbqycw&sensor=false")
		CF.request(
		"http://weather.yahooapis.com/forecastrss?w=" +
		decodedJSONObj.places.place[listIndex].woeid +		
		"&u=c", {"Accept-Language" : "en-US"}, parseWeather);
		}

function parseWeather(status, headers, body)
//parses response
		{
		try{	//attempts to match regex patterns
			//builds regular expressions to extract data
			var placeRegex = /<yweather:location city="(.*)" region="(.*)"   country="(.*)"\/>/		
			var conditionRegex = /<yweather:condition  text="(.*)"  code="(.*)"  temp="(.*)"  date="(.*)" \/>/
			var forecastRegex = /<yweather:forecast day="(.*)" date="(.*)" low="(.*)" high="(.*)" text="(.*)" code="(.*)" \/>\n<yweather:forecast day="(.*)" date="(.*)" low="(.*)" high="(.*)" text="(.*)" code="(.*)" \/>/
			//executes RegExp
			var placeData = placeRegex.exec(body)
			var conditionData = conditionRegex.exec(body)
			var forecastData = forecastRegex.exec(body)
			//builds condition images using higher res .png
			var currentCondURL = "http://l.yimg.com/a/i/us/nws/weather/gr/" + conditionData[2] + "d.png"
			var todayCondURL = "http://l.yimg.com/a/i/us/nws/weather/gr/" + forecastData[6] + "d.png"
			var tomorrowCondURL = "http://l.yimg.com/a/i/us/nws/weather/gr/" + forecastData[12] + "d.png"
			//sets joins to display weather
			CF.setJoins([
			{join: "s11", value: placeData[1]},						//place name
			{join: "s12", value: currentCondURL},					//current condition image
			{join: "s13", value: conditionData[3] + "\xB0C"},		//current temperature
			{join: "s14", value: conditionData[1]},					//current condition description
			{join: "s15", value: conditionData[4]},					//current condition date
			{join: "s21", value: todayCondURL},						//today forecast condition image
			{join: "s22", value: forecastData[4] + "\xB0C"},		//today forecast high temp
			{join: "s23", value: forecastData[3] + "\xB0C"},		//today forecast low temp
			{join: "s24", value: forecastData[5]},					//today forecast condition text
			{join: "s25", value: forecastData[2]},					//today forecast date
			{join: "s26", value: tomorrowCondURL},					//tomorrow forecast condition image
			{join: "s27", value: forecastData[10] + "\xB0C"},		//tomorrow forecast high temp
			{join: "s28", value: forecastData[9] + "\xB0C"},		//tomorrow forecast low temp
			{join: "s29", value: forecastData[11]},					//tomorrow forecast condition text
			{join: "s30", value: forecastData[8]}])					//tomorrow forecast date
			//handles message subpage and timed pageflip
			CF.setJoins([			
					{join: "d2", value: 1},
					{join: "s2", value: "Receiving data..."}])
			setTimeout(function() {
					CF.setJoin("d2", 0)
					CF.flipToPage("DisplayWeather")},2000)
				}
		
		catch(e){	//if any regex doesn't match, assume there is no data to display and alert user
			noData()}
		}

function noData(){
//user message to notify there is no weather data to display for the selected location
			CF.setJoins([
				{join: "d2", value: 1},
				{join: "s2", value: "No weather data available for this location"}])
}		

