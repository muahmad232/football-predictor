import sys
import json
import pandas as pd
import joblib
import numpy as np
import os
# --- FIX: Import euclidean_distances ---
from sklearn.metrics.pairwise import euclidean_distances

# --- Attribute Definitions ---

# Features for GK OVR prediction
GK_OVR_FEATURES = ['GK Diving', 'GK Handling', 'GK Kicking', 'GK Positioning', 'GK Reflexes']

# Features for League Tier prediction
LEAGUE_FEATURES = ['OVR', 'PAC', 'SHO', 'PAS', 'DRI', 'DEF', 'PHY']

# Features for GK Similarity search
GK_SIMILARITY_FEATURES = ['GK Diving', 'GK Handling', 'GK Kicking', 'GK Positioning', 'GK Reflexes', 'Reactions']


# --- Helper Function to Load Models ---
def load_models():
    """Loads all necessary models and scalers from the 'models' directory."""
    # Get the directory of the current script
    script_dir = os.path.dirname(os.path.abspath(__file__))
    models_dir = os.path.join(script_dir, '../models')
    
    try:
        models = {
            'gk_ovr_model': joblib.load(os.path.join(models_dir, 'gk_ovr_model.pkl')),
            'league_model': joblib.load(os.path.join(models_dir, 'league_tier_model.pkl')),
            'league_encoder': joblib.load(os.path.join(models_dir, 'league_tier_encoder.pkl')),
            'gk_sim_scaler': joblib.load(os.path.join(models_dir, 'gk_similarity_scaler.pkl')),
            'gk_sim_attributes': np.load(os.path.join(models_dir, 'scaled_gk_attributes.npy')),
            'gk_sim_player_info': pd.read_csv(os.path.join(models_dir, 'gk_player_info.csv'))
        }
        return models
    except Exception as e:
        print(f"Error loading models: {e}", file=sys.stderr)
        sys.exit(1)

# --- Main Prediction Function ---
def predict_all_gk(player_data, models):
    """Runs all predictions for a goalkeeper."""
    player_df = pd.DataFrame([player_data])

    # 1. Predict GK OVR
    X_ovr = player_df[GK_OVR_FEATURES]
    # Note: The gk_ovr_model was trained on unscaled data, so we predict directly
    predicted_ovr = models['gk_ovr_model'].predict(X_ovr)[0]
    predicted_ovr_rounded = round(float(predicted_ovr))

    # 2. Predict League Tier (Hybrid Logic)
    predicted_league = ''
    if predicted_ovr_rounded >= 86:
        predicted_league = 'Top Tier'
    elif predicted_ovr_rounded < 72:
        predicted_league = 'Lower Tier'
    else:
        # Use ML model for the middle range
        X_league_df = player_df[LEAGUE_FEATURES[1:]].copy() # Get face stats
        X_league_df['OVR'] = predicted_ovr_rounded # Add predicted OVR
        X_league = X_league_df[LEAGUE_FEATURES] # Ensure correct order
        
        league_pred_encoded = models['league_model'].predict(X_league)
        predicted_league = models['league_encoder'].inverse_transform(league_pred_encoded)[0]

    # 3. Find Similar Goalkeepers
    X_sim = player_df[GK_SIMILARITY_FEATURES]
    X_sim_scaled = models['gk_sim_scaler'].transform(X_sim)
    
    # --- FIX: Use euclidean_distances which returns a NumPy array ---
    distances = euclidean_distances(X_sim_scaled, models['gk_sim_attributes'])
    
    # Get top 5 most similar (closest distance).
    similar_indices = distances.argsort().flatten()[0:5] # Index 0 is the closest

    # Check if the closest player is the input itself (distance 0) and skip
    if distances.flatten()[similar_indices[0]] < 1e-6:
        similar_indices = similar_indices[1:6]
    else:
        similar_indices = similar_indices[0:5]
        
    similar_players_df = models['gk_sim_player_info'].iloc[similar_indices]
    similar_players = similar_players_df.to_dict('records')

    # GK position is fixed
    predicted_position = 'GK'

    return {
        'predicted_ovr': predicted_ovr_rounded,
        'predicted_position': predicted_position,
        'predicted_league_tier': predicted_league,
        'similar_players': similar_players
    }

# --- Script Execution ---
if __name__ == "__main__":
    try:
        # Load the player attributes from stdin
        player_input_data = json.load(sys.stdin)
        
        # Load all models
        all_models = load_models()
        
        # Run all predictions
        predictions = predict_all_gk(player_input_data, all_models)
        
        # Print the final JSON result to stdout
        print(json.dumps(predictions))
        
    except Exception as e:
        print(f"Python script error: {e}", file=sys.stderr)
        sys.exit(1)