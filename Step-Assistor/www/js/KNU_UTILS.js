function IS_VALID_JSON(STR) {
    try {
      var JSON_PARSED = JSON.parse(STR);
      return true;
    } catch (e) {
      return false;
    }
}

function JSON_PARSE_IF_CAN(STR_JSON) {
	if (typeof STR_JSON == 'string') {
		STR_JSON = unescape(STR_JSON);
	}
	var JSON_RESULT; try {
		JSON_RESULT = JSON.parse(STR_JSON);
		if (typeof JSON_RESULT == 'number') {
			if (STR_JSON.substring(0,1) == '0') {
				JSON_RESULT = STR_JSON;
			}
		}
	} catch(e) {
		JSON_RESULT = STR_JSON;
	}
	if (JSON_RESULT == Infinity) {
		JSON_RESULT = STR_JSON;
	}
	if (JSON_RESULT instanceof Array) {
		var JSON_ARRAY_TEMP = [];
		JSON_RESULT.forEach(function (ONE_ITEM) {
			JSON_ARRAY_TEMP.push(JSON_PARSE_IF_CAN(ONE_ITEM));
		});
		JSON_RESULT = JSON_ARRAY_TEMP;
	} else if (JSON_RESULT instanceof Object) {
		var JSON_OBJ_TEMP	= {};
		var KEYS = Object.keys(JSON_RESULT);
		KEYS.forEach(function (ONE_KEY) {
			JSON_OBJ_TEMP[ONE_KEY] = JSON_PARSE_IF_CAN(JSON_RESULT[ONE_KEY]);
		});
		JSON_RESULT = JSON_OBJ_TEMP;
	}
	return JSON_RESULT;
}

function KNU_API_ACCESS(API_ACCESS_INFORMATION, ON_RESULT) {

	if (API_ACCESS_INFORMATION == undefined) return;

	var POST_DATAS = new FormData();
	Object.keys(API_ACCESS_INFORMATION).forEach(function (ONE_KEY) {
		if (API_ACCESS_INFORMATION[ONE_KEY] instanceof Object) {
			POST_DATAS.append(ONE_KEY, JSON.stringify(API_ACCESS_INFORMATION[ONE_KEY]));
		} else if (API_ACCESS_INFORMATION[ONE_KEY] instanceof Array) {
			POST_DATAS.append(ONE_KEY, JSON.stringify(API_ACCESS_INFORMATION[ONE_KEY]));
		} else {
			POST_DATAS.append(ONE_KEY, API_ACCESS_INFORMATION[ONE_KEY]);
		}
	});
	
	$.ajax({
		url : $('#TXT_API_SERVER_URL').val(),
		type : 'post',
		data : POST_DATAS,
		async: true, 
		contentType: false,
		processData: false,
		success : function(result) {
			if (ON_RESULT != undefined) ON_RESULT(result);
		},
		error : function(request,status,error) {
			var JSON_ERROR = {
				ERR_STATUS: request.status,
				ERR_MSG: request.responseText,
				ERR_AUX: error
			}
			if (ON_RESULT != undefined) ON_RESULT(JSON.stringify(JSON_ERROR));
		}
	});

}
