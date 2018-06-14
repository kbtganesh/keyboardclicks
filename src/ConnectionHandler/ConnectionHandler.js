import request from 'superagent';
var baseURL = 'http://www.randomtext.me/api';
const ConnectionHandler =  {
	sendRequest(serviceName,reqData) {
     return request
        .get(baseURL)
        .send(reqData) // sends a JSON post body
    },
};
export default ConnectionHandler;