import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [formData, setFormData] = useState({
    LotArea: 9500,
    BedroomAbvGr: 3,
    GarageArea: 400,
    MSZoning: '',
    BldgType: '',
    HouseStyle: ''
  });
  const [predictedPrice, setPredictedPrice] = useState(null);

  const msZoningOptions = {
    "Commercial": "C (all)",
    "Floating Village Residential": "FV", 
    "Residential High Density": "RH",
    "Residential Low Density": "RL",
    "Residential Medium Density": "RM"
  };
  const bldgTypeOptions = {
    "Single Family Detached": "1Fam",
    "Two Family Conversion": "2fmCon", 
    "Duplex": "Duplex",
    "Townhouse Inside Unit": "Twnhs",
    "Townhouse End Unit": "TwnhsE"
  };
  const houseStyleOptions = {
    "One and one-half story: 2nd level finished": "1.5Fin",
    "One and one-half story: 2nd level unfinished": "1.5Unf",
    "One Story": "1Story", 
    "Two and one-half story: 2nd level finished": "2.5Fin",
    "Two and one-half story: 2nd level unfinished": "2.5Unf",
    "Two Story": "2Story",
    "Split Foyer": "SFoyer",
    "Split Level": "SLvl"
  };

  const WEB_URL = 'https://house-price-predictor-uvexzon-3c13dc832ef4.herokuapp.com/predict';

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(WEB_URL, formData);
      setPredictedPrice(response.data.predicted_price);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div style={{ backgroundColor: '#181818', minHeight: '100vh', color: '#ffffff', padding: '2rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
  
        <div style={{ display: 'flex', gap: '2rem' }}>
          {/* Left Column - Input Fields */}
          <div style={{ flex: '1' }}>
            <form style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              <div>
                <label>Lot Area:</label>
                <input
                  type="range"
                  name="LotArea"
                  min="1300"
                  max="215200"
                  value={formData.LotArea}
                  onChange={handleChange}
                  style={{ width: '100%', accentColor: '#dfad00' }}
                />
                <span>{formData.LotArea}</span>
              </div>
              
              <div>
                <label>Bedrooms Above Ground:</label>
                <input
                  type="range"
                  name="BedroomAbvGr"
                  min="1"
                  max="8"
                  value={formData.BedroomAbvGr}
                  onChange={handleChange}
                  style={{ width: '100%', accentColor: '#dfad00' }}
                />
                <span>{formData.BedroomAbvGr}</span>
              </div>

              <div>
                <label>Garage Area:</label>
                <input
                  type="range"
                  name="GarageArea"
                  min="0"
                  max="1400"
                  value={formData.GarageArea}
                  onChange={handleChange}
                  style={{ width: '100%', accentColor: '#dfad00' }}
                />
                <span>{formData.GarageArea}</span>
              </div>
  
              <div>
                <label>MS Zoning:</label>
                <select 
                  name="MSZoning"
                  value={formData.MSZoning}
                  onChange={handleChange}
                  style={{ width: '100%', padding: '0.5rem', backgroundColor: '#333', color: '#fff', border: '1px solid #dfad00' }}
                >
                  {Object.entries(msZoningOptions).map(([label, value]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label>Building Type:</label>
                <select
                  name="BldgType" 
                  value={formData.BldgType}
                  onChange={handleChange}
                  style={{ width: '100%', padding: '0.5rem', backgroundColor: '#333', color: '#fff', border: '1px solid #dfad00' }}
                >
                  {Object.entries(bldgTypeOptions).map(([label, value]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label>House Style:</label>
                <select
                  name="HouseStyle"
                  value={formData.HouseStyle}
                  onChange={handleChange}
                  style={{ width: '100%', padding: '0.5rem', backgroundColor: '#333', color: '#fff', border: '1px solid #dfad00' }}
                >
                  {Object.entries(houseStyleOptions).map(([label, value]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>

            </form>
          </div>
  
          {/* Right Column - Submit Button and Results */}
          <div style={{ flex: '1', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <h1 style={{ color: '#dfad00', textAlign: 'center', marginBottom: '0.5rem', marginTop: '0.5rem' }}>House Price Predictor</h1>
            <button
              onClick={handleSubmit}
              style={{
                backgroundColor: '#dfad00',
                color: '#000',
                padding: '1rem',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 'bold',
                marginTop: '1rem'
              }}
            >
              Predict Price
            </button>
  
            {predictedPrice && (
              <div style={{
                padding: '1rem',
                backgroundColor: '#333',
                borderRadius: '4px',
                textAlign: 'center'
              }}>
                <h2 style={{ color: '#dfad00' }}>Predicted Price:</h2>
                <p style={{ fontSize: '1.5rem' }}>${predictedPrice.toLocaleString()}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
