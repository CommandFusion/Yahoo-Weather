function searchWoied(join, value)
		{
		if (value == "") CF.setJoin("d1", 0)
			else {
				CF.setJoin("d1", 1)
				var userText = value.replace(/ /g, "+")	
				CF.request(
					"http://where.yahooapis.com/v1/places$and(.q(" +
					userText + "%2A)" +
					",.type(7,10,11));count=" +
					"10" +
					"?format=" +
					"json" +
					"&appid=" +
					"KL1y8DvV34GdHB7TszqFaU0Mh05_vFl.k2FHwifHyaYepZqEPv13T8g19aPhqQ--", {"Accept-Language" : "en-US"}, getWoeid);
			}
		}

var decodedJSONObj

function deleteList(){
//	CF.log("Deleting List")
	CF.setJoins([{join: "d1", value: 0}, {join: "s1", value:""}])
	CF.listInfo("l1", function(list, count)
				{
					for (var i = 0; i < count; i++) {CF.unwatch(CF.ObjectPressedEvent, "l1:" + i + ":d10")}
					CF.listRemove(list)
				})
}	
	
function getWoeid(status, headers, body){
		if (status == 200) 	
			{
			CF.listInfo("l1", function(list, count)
				{
					for (var i = 0; i < count; i++) {CF.unwatch(CF.ObjectPressedEvent, "l1:" + i + ":d10")}
					CF.listRemove(list)
					decodedJSONObj = JSON.parse(body)
					if (decodedJSONObj.places.count > 0)
						{
							for (var i = 0; i < decodedJSONObj.places.count; i++) 
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
//	CF.log("Flipped to: " + to)
	if (to == "Search") deleteList()
}
		
CF.userMain = function () 
	{
	CF.watch(CF.InputFieldEditedEvent, "s1", searchWoied)
	CF.watch(CF.PageFlipEvent, onPageFlip, true)
};	