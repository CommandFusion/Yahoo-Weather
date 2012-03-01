function searchWoeid(join, value)
//search for the Where On Earth IDentifier (WOEID)
		{
		if (value == "") CF.setJoin("d1", 0)	//handles clear input field button visibility
			else {
				CF.setJoin("d1", 1)
				var userText = value.replace(/ /g, "+")		//replaces whitespace with a "+" to search as "begins with.."
				CF.request(
				//WOEID request
					"http://where.yahooapis.com/v1/places$and(.q(" +		//query
					userText + "%2A)" +										//begins with text
					",.type(7,10,11));count=" +								//search for city/town/postal code types
					"10" +													//max number of items to return
					"?format=" +											
					"json" +												//response format (JSON)
					"&appid=" +												//unique Yahoo! developer appid
					"KL1y8DvV34GdHB7TszqFaU0Mh05_vFl.k2FHwifHyaYepZqEPv13T8g19aPhqQ--", {"Accept-Language" : "en-US"}, getWoeid);
			}
		}

var decodedJSONObj	//object built from the decoded JSON string

function deleteList(){
//Unwatches and deletes the list, invoked on pageflip
	CF.setJoins([{join: "d1", value: 0}, {join: "s1", value:""}])
	CF.listInfo("l1", function(list, count)
				{
					for (var i = 0; i < count; i++) {CF.unwatch(CF.ObjectPressedEvent, "l1:" + i + ":d10")}
					CF.listRemove(list)
				})
}	
	
function getWoeid(status, headers, body){
//decodes response and builds the array of the returned places
		if (status == 200) 	
			{
			CF.listInfo("l1", function(list, count)
				{
					for (var i = 0; i < count; i++) {CF.unwatch(CF.ObjectPressedEvent, "l1:" + i + ":d10")}		//unwatches list items to prevent multiple calls
					CF.listRemove(list)																			//removes the list
					decodedJSONObj = JSON.parse(body)															//parse JSON string
					if (decodedJSONObj.places.count > 0)														//if there are results to the query
						{
							for (var i = 0; i < decodedJSONObj.places.count; i++) 								//builds list
								{
									var listItem = decodedJSONObj.places.place[i].name + ", " + decodedJSONObj.places.place[i].country
									CF.listAdd("l1", [{"s10": listItem}])
									var addedListIndex = "l1:" + i + ":" + "d10"
									CF.watch(CF.ObjectPressedEvent, addedListIndex , getWeather)
								}
						}			
				})
			}
}		

function onPageFlip(from, to, orientation){
//handles pageflip event
	if (to == "Search") deleteList()
}
		
CF.userMain = function () 
	{
	CF.watch(CF.InputFieldEditedEvent, "s1", searchWoeid)
	CF.watch(CF.PageFlipEvent, onPageFlip, true)
};	