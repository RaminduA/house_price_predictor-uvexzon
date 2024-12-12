from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np
import pandas as pd

# Initialize Flask app
app = Flask(__name__)

# Enable CORS
CORS(
    app  # , resources={r"/predict": {"origins": ["https://your-frontend-domain.com"]}}
)

# Load the trained model
MODEL_PATH = "model.joblib"
try:
    with open(MODEL_PATH, "rb") as file:
        model = joblib.load(file)
except FileNotFoundError:
    raise Exception(f"Model file not found at {MODEL_PATH}. Make sure the model.joblib file exists.")


# Preprocessing function
def preprocess_input(rooms, location, square_footage):
    location_list = ["rural", "suburban", "urban"]
    input_data = {'rooms': rooms, 'square_footage': square_footage}

    # One-hot encode the 'location' feature
    for loc in location_list:
        input_data[f'location_{loc}'] = 1 if location == loc else 0

    input_df = pd.DataFrame(input_data, index=[0])
    return input_df


# Define a route for health check
@app.route("/", methods=["GET"])
def health_check():
    return jsonify({"message": "API is running."}), 200


# Define a route for prediction
@app.route("/predict", methods=["POST"])
def predict():
    try:
        # Parse JSON request body
        data = request.get_json()

        # Validate input fields
        required_fields = ["rooms", "location", "square_footage"]
        if not all(field in data for field in required_fields):
            return jsonify({"error": "Missing required fields. Required: rooms, location, square_footage."}), 400

        # Extract input features
        rooms = data.get("rooms")
        location = data.get("location")
        square_footage = data.get("square_footage")

        # Preprocess input features
        input_features = preprocess_input(rooms, location, square_footage)

        # Perform prediction
        predicted_price = model.predict(input_features)[0]

        # Return the prediction
        return jsonify({"predicted_price": round(predicted_price, 2)}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Run the Flask app
if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
