from flask import Flask, render_template, send_file, request, make_response
from flask_sock import Sock
import requests

import base64
import os

import cv2
import numpy as np

from algorithm.object_detector import YOLOv7
from utils.detections import draw
import json
from flask_cors import CORS


yolov7 = YOLOv7(conf_thres=0.35, iou_thres=0.45)
yolov7.load('coco.weights', classes='coco.yaml', device='gpu') # use 'gpu' for CUDA GPU inference
yolov7.conf = 0.7

app = Flask(__name__,
	template_folder='./www',
	static_folder='./www',
	static_url_path='/'
)
#CORS(app, resources={r'*': {'origins': 'http://knu.1key.kr:9090/api, http://knu.1key.kr:9000'}})
#CORS(app)

sock = Sock(app)

def IS_VALID_JSON(STR_JSON):
	try:
		json.loads(STR_JSON)
	except ValueError as e:
		return False
	return True
	
def JSON_PARSE_RECURSION(args_JSON):
	if (isinstance(args_JSON, dict)):
		OBJ_RESULT = json.loads(json.dumps(args_JSON))
		for KEY in OBJ_RESULT.keys():
			VALUE = OBJ_RESULT[KEY];
			OBJ_RESULT[KEY] = JSON_PARSE_RECURSION(VALUE)
		return OBJ_RESULT
	elif (isinstance(args_JSON, list)):
		ARR_RESULT = []
		for VALUE in args_JSON:
			ARR_RESULT.append(JSON_PARSE_RECURSION(VALUE))
		return ARR_RESULT
	elif (isinstance(args_JSON, str)):
		if (IS_VALID_JSON(args_JSON)):
			TEMP_OBJECT = json.loads(args_JSON)
			if (isinstance(TEMP_OBJECT, dict)):
				return JSON_PARSE_RECURSION(TEMP_OBJECT)
			elif (isinstance(TEMP_OBJECT, list)):
				return JSON_PARSE_RECURSION(TEMP_OBJECT)
			else:
				return args_JSON
		else:
			return args_JSON
	else:
		return args_JSON

def API(args_JSON):
	if ('REQ' in args_JSON) and (args_JSON['REQ'] == 'TTS_VW'):
		TTS_LANG = '0'
		if ('TTS_LANG' in args_JSON):
			TTS_LANG = args_JSON['TTS_LANG']
		URL  = args_JSON['TTS_URL']
		URL += '?REQ=' + args_JSON['REQ']
		URL += '&TTS_TEXT=' + args_JSON['TTS_TEXT']
		URL += '&TTS_LANG=' + TTS_LANG
		WAV_RESULT = requests.get(URL)
		response = make_response(WAV_RESULT.content)
		response.headers['Content-Type'] = 'audio/wav'
		response.headers['Content-Disposition'] = 'attachment; filename=TTS.wav'
		return response
	else:
		return json.dumps(args_JSON, indent=4)

@app.route('/', methods = ['POST', 'GET'])
def index():
	if request.method == 'POST':
		args_JSON = request.form;
	else:
		args_JSON = request.args;
	args_JSON = JSON_PARSE_RECURSION(args_JSON)
	#"""
	print("KKKKK -> " + json.dumps(args_JSON, indent=4))
	#"""
	if (len(args_JSON.keys()) > 0):
		return API(args_JSON);
	else:
		return send_file('www/index.html')

def base64_to_image(base64_string):
	"""
	The base64_to_image function accepts a base64 encoded string and returns an image.
	The function extracts the base64 binary data from the input string, decodes it, converts 
	the bytes to numpy array, and then decodes the numpy array as an image using OpenCV.

	:param base64_string: Pass the base64 encoded image string to the function
	:return: An image
	"""
	base64_data = base64_string.split(",")[1]
	image_bytes = base64.b64decode(base64_data)
	image_array = np.frombuffer(image_bytes, dtype=np.uint8)
	image = cv2.imdecode(image_array, cv2.IMREAD_COLOR)
	return image

@sock.route('/image')
def echo(sock):
	print(sock);
	while True:
		data = sock.receive()
		json_data = json.loads(data);
		
		image = base64_to_image(json_data['image_base64'])
		detections = yolov7.detect(image, track=True)
		detected_image = draw(image, detections)
		encode_param = [int(cv2.IMWRITE_JPEG_QUALITY), 90]
		result, frame_encoded = cv2.imencode(".jpg", detected_image, encode_param)
		processed_img_data = base64.b64encode(frame_encoded).decode()
		b64_src = "data:image/jpg;base64,"
		processed_img_data = b64_src + processed_img_data
		
		OBJ_RESULT = json.loads('{}')
		OBJ_RESULT['processed_image'] = processed_img_data
		OBJ_RESULT['processed_json'] = detections

		sock.send(json.dumps(OBJ_RESULT, indent=4))

if __name__ == '__main__':
	app.run(host="0.0.0.0", port=8020)
