from flask import Flask, render_template

import ssl

app = Flask(__name__)

@app.route("/")
def hello():
    return "Hello World"

@app.route("/page1")
def page1():

    return render_template('./index.html')
    

if __name__ == "__main__":
	ssl_context = ssl.SSLContext(ssl.PROTOCOL_TLS)
	ssl_context.load_cert_chain(certfile='www/CERT/1key.kr.crt', keyfile='www/CERT/1key.kr.key')
	app.run(host="0.0.0.0", port=9000, ssl_context=ssl_context, debug=True)	
