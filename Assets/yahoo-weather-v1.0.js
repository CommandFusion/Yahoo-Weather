function getWeather(j,v,t)
		{
		CF.request(
		"http://weather.yahooapis.com/forecastrss?w=" +
		decodedJSONObj.places.place[/:(\d*):/.exec(j)[1]].woeid +
		"&u=c", {"Accept-Language" : "en-US"}, self.parseWeather);
		}

function parseWeather(status, headers, body)
		{
		try{
			var placeRegex = /<yweather:location city="(.*)" region="(.*)"   country="(.*)"\/>/
			var conditionRegex = /<yweather:condition  text="(.*)"  code="(.*)"  temp="(.*)"  date="(.*)" \/>/
			var forecastRegex = /<yweather:forecast day="(.*)" date="(.*)" low="(.*)" high="(.*)" text="(.*)" code="(.*)" \/>\n<yweather:forecast day="(.*)" date="(.*)" low="(.*)" high="(.*)" text="(.*)" code="(.*)" \/>/

			var placeData = placeRegex.exec(body)
			var conditionData = conditionRegex.exec(body)
			var forecastData = forecastRegex.exec(body)
			
			var currentCondURL = "http://l.yimg.com/a/i/us/nws/weather/gr/" + conditionData[2] + "d.png"
			var todayCondURL = "http://l.yimg.com/a/i/us/nws/weather/gr/" + forecastData[6] + "d.png"
			var tomorrowCondURL = "http://l.yimg.com/a/i/us/nws/weather/gr/" + forecastData[12] + "d.png"
			
			CF.setJoins([
			{join: "s11", value: placeData[1]},
			{join: "s12", value: currentCondURL},
			{join: "s13", value: conditionData[3] + "\xB0C"},
			{join: "s14", value: conditionData[1]},
			{join: "s15", value: conditionData[4]},
			{join: "s21", value: todayCondURL},
			{join: "s22", value: forecastData[4] + "\xB0C"},
			{join: "s23", value: forecastData[3] + "\xB0C"},
			{join: "s24", value: forecastData[5]},
			{join: "s25", value: forecastData[2]},
			{join: "s26", value: tomorrowCondURL},
			{join: "s27", value: forecastData[10] + "\xB0C"},
			{join: "s28", value: forecastData[9] + "\xB0C"},
			{join: "s29", value: forecastData[11]},
			{join: "s30", value: forecastData[8]}])
						
			CF.setJoins([
					{join: "d2", value: 1},
					{join: "s2", value: "Receiving data..."}])
			setTimeout(function() {
					CF.setJoin("d2", 0)
					CF.flipToPage("DisplayWeather")},2000)
				}
		
		catch(e){noData()}
		}

function noData(){
			CF.setJoins([
				{join: "d2", value: 1},
				{join: "s2", value: "No weather data available for this location"}])
}		

