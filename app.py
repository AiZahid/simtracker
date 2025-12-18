
from flask import Flask, render_template, request, jsonify
import requests
import re

app = Flask(__name__)
API_BASE = "https://legendxdata.site/Api/simdata.php?phone="

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/lookup", methods=["POST"])
def lookup():
    data = request.get_json()
    phone = data.get("phone")

    if not phone or not re.fullmatch(r"\d{10}", phone):
        return jsonify({"error": "Phone number must be 10 digits"}), 400

    try:
        r = requests.get(API_BASE + phone, timeout=10)
        return jsonify(r.json())
    except Exception as e:
        return jsonify({"error": "API failed", "details": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
