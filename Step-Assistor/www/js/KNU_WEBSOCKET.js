var KNU_WS_SERVER_URL	= '';
var KNU_WS_CHANNEL		= 'dummy';

function INIT_WS_CONNECTION(ws_url) {
	KNU_WS_SERVER_URL = ws_url;
	CHANGE_WS_SERVER();
}

function CHANGE_WS_SERVER() {
	if (typeof KNU_WS_CONNECTION !== 'undefined' && KNU_WS_CONNECTION !== null) KNU_WS_CONNECTION.CLOSE_FORCE();
	INIT_KNU_WS_CONNECTION(KNU_WS_SERVER_URL, KNU_WS_CHANNEL);
}

var KNU_WS_CONNECTION = undefined;
function INIT_KNU_WS_CONNECTION(ws_server, ws_channel) {

	KNU_WS_CONNECTION = {};
    // if user is running mozilla then use it's built-in WebSocket
    window.WebSocket = window.WebSocket || window.MozWebSocket;
  
    // if browser doesn't support WebSocket, just show some notification and exit
    if (!window.WebSocket) {
    	KNU_LOG_CONSOLE.CHAT_LOG(
    		DIV_LOG_CONSOLE,
    		'죄송합니다, 접속에 사용하신 웹 브라우저가 WebSockets 기능을 지원하지 않습니다.',
    		'me',
    		'70%'
    	);
		return;
    }

    // open connection
//	KNU_WS_CONNECTION = new WebSocket(ws_server, ws_channel);
    KNU_WS_CONNECTION = new WebSocket(ws_server);

    KNU_WS_CONNECTION.onopen = function () {
    	KNU_LOG_CONSOLE.CHAT_LOG(
    		DIV_LOG_CONSOLE,
//	   		sprintf( "WS_CONNECTION new WebSocket('%s', '%s') 이 연결되었습니다.", ws_server, ws_channel),
    		sprintf( "WS_CONNECTION new WebSocket('%s') 이 연결되었습니다.", ws_server),
    		'you',
    		'70%'
    	);
    };
    
    KNU_WS_CONNECTION.onerror = function (error) {
    	KNU_LOG_CONSOLE.CHAT_LOG(
    		DIV_LOG_CONSOLE,
    		'WebSocket 시스템에 어떤 문제가 있거나 WebSocket 시스템이 응답하지 않습니다.',
    		'you',
    		'70%'
    	);
    };

    // most important part - incoming messages
    KNU_WS_CONNECTION.onmessage = function (message) {
        // try to parse JSON message. Because we know that the server always returns
        // JSON this should work without any problem but we should make sure that
        // the massage is not chunked or otherwise damaged.
        try {
          var JSON_PARSED = JSON.parse(message.data);
        } catch (e) {
	    	KNU_LOG_CONSOLE.CHAT_LOG(
	    		DIV_LOG_CONSOLE,
	    		'이건 JSON 스트링이 아닌것 같아요! : ' + message.data,
	    		'me',
	    		'70%'
	    	);
			return;
        }
        
    	KNU_LOG_CONSOLE.CHAT_LOG(
    		DIV_LOG_CONSOLE,
    		'<pre>' + JSON.stringify(JSON_PARSED, null, '  ') + '</pre>',
    		'me',
    		'70%'
    	);

        // NOTE: if you're not sure about the JSON structure
        // check the server source code above

        
	};
	
    KNU_WS_CONNECTION.onclose  = function () {
    	KNU_LOG_CONSOLE.CHAT_LOG(
    		DIV_LOG_CONSOLE,
    		'WebSocket 시스템과 연결이 끊어졌습니다. 1초 이내에 연결을 재시도 합니다.',
    		'me',
    		'70%'
    	);
		//try to reconnect in 1 seconds
		setTimeout(function(){INIT_KNU_WS_CONNECTION(KNU_WS_SERVER_URL, KNU_WS_CHANNEL)}, 1000);
    };

    KNU_WS_CONNECTION.CLOSE_FORCE  = function () {
    	KNU_LOG_CONSOLE.CHAT_LOG(
    		DIV_LOG_CONSOLE,
    		'WebSocket 시스템과 연결을 정상적으로 종료 합니다.',
    		'me',
    		'70%'
    	);
    	KNU_WS_CONNECTION.onclose  = function () {}; // disable onclose handler first
    	KNU_WS_CONNECTION.close();
    	KNU_WS_CONNECTION = undefined;
    }
}
