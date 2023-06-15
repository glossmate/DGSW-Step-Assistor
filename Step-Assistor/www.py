
import base64
import os

import cv2
import numpy as np
from flask import Flask, render_template, send_from_directory
from flask_sock import Sock

from algorithm.object_detector import YOLOv7
from utils.detections import draw
import json

from types import SimpleNamespace

yolov7 = YOLOv7()
yolov7.load('coco.weights', classes='coco.yaml', device='gpu') # use 'gpu' for CUDA GPU inference


app = Flask(__name__,
    template_folder='./www',
    static_folder='./www',
    static_url_path='/'
)
sock = Sock(app)

@app.route("/favicon.ico")
def favicon():
    """
    The favicon function serves the favicon.ico file from the static directory.
    
    :return: A favicon
    """
    return send_from_directory(
        os.path.join(app.root_path, "static"),
        "favicon.ico",
        mimetype="image/vnd.microsoft.icon",
    )


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


@sock.route('/echo')
def echo(sock):
    while True:
        data = sock.receive()
        sock.send(data)

@sock.route('/image')
def receive_image(sock):
    """
    The receive_image function takes in an image from the webcam, converts it to grayscale, and then emits
    the processed image back to the client.


    :param image: Pass the image data to the receive_image function
    :return: The image that was received from the client
    """
    # Decode the base64-encoded image data
    
    data = sock.receive()
    print(data)
    image = base64_to_image(data)
    detections = yolov7.detect(image)
    detected_image = draw(image, detections)
    
    frame_resized = cv2.resize(detected_image, (640, 360))
    encode_param = [int(cv2.IMWRITE_JPEG_QUALITY), 90]
    result, frame_encoded = cv2.imencode(".jpg", frame_resized, encode_param)
    processed_img_data = base64.b64encode(frame_encoded).decode()
    b64_src = "data:image/jpg;base64,"
    processed_img_data = b64_src + processed_img_data
    json_result = {}
#    json_result['processed_img'] = processed_img_data
    json_result['processed_json'] = detections
    sock.send(json.dumps(json_result, indent=4));

@app.route('/')
def index():
    """
    The index function returns the index.html template, which is a landing page for users.
    
    :return: The index
    """
    return render_template('index.html')


if __name__ == '__main__':
    app.run(host="0.0.0.0", port=9000)
