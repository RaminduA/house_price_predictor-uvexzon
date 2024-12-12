import os
from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
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
def preprocess_input(lot_area, bedroom_abv_gr, garage_area, ms_zoning, bldg_type, house_style):
    ms_zoning_list = ["C (all)", "FV", "RH", "RL", "RM"]
    bldg_type_list = ["1Fam", "2fmCon", "Duplex", "Twnhs", "TwnhsE"]
    house_style_list = ["1.5Fin", "1.5Unf", "1Story", "2.5Fin", "2.5Unf", "2Story", "SFoyer", "SLvl"]

    input_data = {
        "LotArea": lot_area,
        "BedroomAbvGr": bedroom_abv_gr,
        "GarageArea": garage_area,
    }

    # One-hot encode the nominal features
    for ms_zoning_val in ms_zoning_list:
        input_data[f"MSZoning_{ms_zoning_val}"] = 1 if ms_zoning == ms_zoning_val else 0

    for bldg_type_val in bldg_type_list:
        input_data[f"BldgType_{bldg_type_val}"] = 1 if bldg_type == bldg_type_val else 0

    for house_style_val in house_style_list:
        input_data[f"HouseStyle_{house_style_val}"] = 1 if house_style == house_style_val else 0

    # Create a DataFrame from the input data
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
        required_fields = ['LotArea', 'BedroomAbvGr', 'GarageArea', 'MSZoning', 'BldgType', 'HouseStyle']
        if not all(field in data for field in required_fields):
            return jsonify({"error": "Missing required fields. Required: rooms, location, square_footage."}), 400

        # Extract input features
        lot_area = data.get("LotArea")
        bedroom_abv_gr = data.get("BedroomAbvGr")
        garage_area = data.get("GarageArea")
        ms_zoning = data.get("MSZoning")
        bldg_type = data.get("BldgType")
        house_style = data.get("HouseStyle")

        # Preprocess input features
        input_features = preprocess_input(lot_area, bedroom_abv_gr, garage_area, ms_zoning, bldg_type, house_style)

        # Perform prediction
        predicted_price = model.predict(input_features)[0]

        # Return the prediction
        return jsonify({"predicted_price": round(predicted_price, 2)}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Run the Flask app
if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=int(os.environ.get("PORT", 5000)))
