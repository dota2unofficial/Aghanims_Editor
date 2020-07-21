import fs from 'fs'

export const flatten = function(ob) {
	var toReturn = {};
	
	for (var i in ob) {
		if (!ob.hasOwnProperty(i)) continue;
		
		if ((typeof ob[i]) == 'object') {
			var flatObject = flatten(ob[i]);
			for (var x in flatObject) {
				if (!flatObject.hasOwnProperty(x)) continue;
				
				toReturn[i + '.' + x] = flatObject[x];
			}
		} else {
			toReturn[i] = ob[i];
		}
	}
	return toReturn;
};

export const getData = (fileName, type) => {
  return new Promise(function(resolve, reject){
    fs.readFile(fileName, type, (err, data) => {
        err ? reject(err) : resolve(data);
    });
  });
}

export const checkItemType = (key) => {
	if (key.includes("npc_precache")) return "PRECACHE";
	else if (key.includes("npc_dota_hero")) return "HERO";
	else if (key.includes("npc_dota")) return "UNIT";
	else if (key.includes("item_")) return "ITEM";
	else return "ABILITY";
}