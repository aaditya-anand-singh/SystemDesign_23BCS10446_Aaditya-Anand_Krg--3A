from flask import Flask, request, redirect, jsonify
import string
import random

app = Flask(__name__)

url_db = {}

def generate_short_id():
    """Creates a random 6-character code like 'aB12Xy'"""
    characters = string.ascii_letters + string.digits
    return ''.join(random.choice(characters) for _ in range(6))

@app.route('/shorten', methods=['POST'])
def shorten():
    data = request.get_json()
    long_url = data.get('url')
    
    if not long_url:
        return jsonify({"error": "Please provide a URL"}), 400

    short_id = generate_short_id()
    url_db[short_id] = long_url
    
    print(f"ShortURL : {short_id} Corrospond to longURL-> {long_url}") 
    
    return jsonify({
        "short_id": short_id,
        "short_url": f"http://127.0.0.1:5000/{short_id}"
    }), 201

@app.route('/<short_id>', methods=['GET'])
def go_to_url(short_id):

    long_url = url_db.get(short_id)
    
    if long_url:
        return redirect(long_url)
    return "URL Not Found", 404

if __name__ == '__main__':
    print("Server starting... Go to Postman to test.")
    app.run(debug=True)