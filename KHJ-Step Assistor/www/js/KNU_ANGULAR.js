var ANGULAR_WEBAPPS;
var _RS = {};
var _AC = {};
var _FT = {};

function KNU_ANGULAR_INIT(ARGS, FUNC_AFTER) {
	ANGULAR_WEBAPPS = angular.module(ARGS.ng_app, ARGS.ng_app_injects);
	ANGULAR_WEBAPPS.controller(ARGS.ng_controller, function ($scope, $compile, $filter) {
		_RS = $scope;
		_AC = $compile;
		_FT = $filter;
		
		if (FUNC_AFTER != undefined) FUNC_AFTER();
	});
	ANGULAR_WEBAPPS.filter('prettyJSON', function () {
		return function(json) {
			if (json instanceof Object) {
				return angular.toJson(json, true);
			} else {
				var STR_JSON = (json != undefined) ? json.replace(/(<([^>]+)>)/gi, '') : '';
				var JSON_RESULT = JSON_PARSE_IF_CAN(unescape(STR_JSON));
				if (JSON_RESULT instanceof Object) {
					return angular.toJson(JSON_RESULT, true);
				} else {
					return json;
				}
			}
		}
	});
}
			