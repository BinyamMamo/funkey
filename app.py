from flask import Flask
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"*": {"origins": "*"}})

@app.route("/")
def home():
  return "Hello there"

@app.route("/text")
def text():
  return "text"


if __name__ == "__main__":
  app.run(debug=True)
