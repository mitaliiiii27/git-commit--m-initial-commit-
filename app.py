from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from pymongo import MongoClient
import bcrypt
from bson import ObjectId

app = Flask(__name__)

# Enable CORS
CORS(app, resources={r"/*": {"origins": "*"}})

@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS')
    return response

# MongoDB Setup
client = MongoClient("mongodb+srv://mitalirawat:mitalirawat2705@cluster0.tvn3g3r.mongodb.net/?retryWrites=true&w=majority")
db = client["mental_health"]

collection = db["bookings"]
users = db["users"]

# ---------------- FRONTEND ROUTES ---------------- #

@app.route("/")
def home():
    return send_from_directory('.', 'index.html')

@app.route("/chat")
def chat_page():
    return send_from_directory('.', 'chat.html')

# ---------------- TEST ROUTE ---------------- #

@app.route("/test")
def test():
    return jsonify({"status": "working"})

# ---------------- BOOKINGS ---------------- #

@app.route("/book", methods=["POST"])
def book():
    data = request.json

    booking = {
        "mode": data.get("mode"),
        "doctor": data.get("doctor"),
        "area": data.get("area"),
        "slot": data.get("slot"),
        "rating": None
    }

    collection.insert_one(booking)
    return jsonify({"message": "Slot booked successfully ✅"})


@app.route("/bookings", methods=["GET"])
def get_bookings():
    data = list(collection.find({}, {
        "_id": 1,
        "mode": 1,
        "doctor": 1,
        "area": 1,
        "slot": 1,
        "rating": 1
    }))

    for d in data:
        d["_id"] = str(d["_id"])

    return jsonify(data)


@app.route("/delete_booking/<id>", methods=["DELETE"])
def delete_booking(id):
    collection.delete_one({"_id": ObjectId(id)})
    return jsonify({"message": "Booking deleted 🗑️"})


@app.route("/rate_booking/<id>", methods=["POST"])
def rate_booking(id):
    rating = request.json.get("rating")

    collection.update_one(
        {"_id": ObjectId(id)},
        {"$set": {"rating": rating}}
    )

    return jsonify({"message": "Rating saved ⭐"})

# ---------------- AUTH ---------------- #

@app.route("/register", methods=["POST"])
def register():
    data = request.json

    username = data.get("username")
    password = data.get("password")

    if users.find_one({"username": username}):
        return jsonify({"message": "User already exists ❌"}), 400

    hashed_pw = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

    users.insert_one({
        "username": username,
        "password": hashed_pw
    })

    return jsonify({"message": "Registered successfully ✅"})


@app.route("/login", methods=["POST"])
def login():
    data = request.json

    username = data.get("username")
    password = data.get("password")

    user = users.find_one({"username": username})

    if not user:
        return jsonify({"message": "User not found ❌"}), 404

    if bcrypt.checkpw(password.encode('utf-8'), user["password"]):
        return jsonify({"message": "Login successful ✅"})
    else:
        return jsonify({"message": "Wrong password ❌"}), 401

# ---------------- CHATBOT API ---------------- #

@app.route("/chatbot", methods=["POST"])
def chatbot():
    user_message = request.json.get("message", "")

    return jsonify({
        "reply": "I'm here for you 💛 Tell me what's on your mind."
    })

# Run Server
if __name__ == "__main__":
    app.run(debug=True)