import sys
import json
import pandas as pd
import joblib
import numpy as np
import os
# --- FIX: Import euclidean_distances ---
from sklearn.metrics.pairwise import euclidean_distances

# --- Attribute Definitions ---

# Dictionary of weights for calculating position scores (from `position predictor new.ipynb`)
ATTRIBUTE_WEIGHTS = {
    'Striker': {
        'Finishing': 0.2, 'Shot Power': 0.15, 'Positioning': 0.15, 'Heading Accuracy': 0.1,
        'Sprint Speed': 0.1, 'Acceleration': 0.1, 'Strength': 0.1, 'Ball Control': 0.05, 'Dribbling': 0.05
    },
    'Winger': {
        'Dribbling': 0.2, 'Sprint Speed': 0.2, 'Acceleration': 0.15, 'Ball Control': 0.1,
        'Crossing': 0.1, 'Short Passing': 0.1, 'Finishing': 0.05, 'Curve': 0.05, 'Agility': 0.05
    },
    'Midfielder': {
        'Short Passing': 0.15, 'Long Passing': 0.15, 'Vision': 0.15, 'Ball Control': 0.1,
        'Dribbling': 0.1, 'Interceptions': 0.1, 'Stamina': 0.1, 'Standing Tackle': 0.05, 'Long Shots': 0.05
    },
    'Full-back': {
        'Sprint Speed': 0.15, 'Standing Tackle': 0.15, 'Sliding Tackle': 0.15, 'Crossing': 0.1,
        'Interceptions': 0.1, 'Def Awareness': 0.1, 'Stamina': 0.1, 'Acceleration': 0.05, 'Short Passing': 0.05
    },
    'Center-back': {
        'Def Awareness': 0.2, 'Standing Tackle': 0.2, 'Sliding Tackle': 0.15, 'Strength': 0.15,
        'Heading Accuracy': 0.1, 'Jumping': 0.1, 'Interceptions': 0.05, 'Aggression': 0.05
    }
}

# Features for OVR prediction (from `overall_new_predictor.ipynb`)
OVR_FEATURES = [
    'PAC', 'SHO', 'PAS', 'DRI', 'DEF', 'PHY', 'Acceleration', 'Sprint Speed',
    'Positioning', 'Finishing', 'Shot Power', 'Long Shots', 'Volleys', 'Penalties',
    'Vision', 'Crossing', 'Free Kick Accuracy', 'Short Passing', 'Long Passing',
    'Curve', 'Dribbling', 'Agility', 'Balance', 'Reactions', 'Ball Control',
    'Composure', 'Interceptions', 'Heading Accuracy', 'Def Awareness',
    'Standing Tackle', 'Sliding Tackle', 'Jumping', 'Stamina', 'Strength', 'Aggression'
]

# Features for League Tier prediction (from `League_predictor.ipynb`)
LEAGUE_FEATURES = ['OVR', 'PAC', 'SHO', 'PAS', 'DRI', 'DEF', 'PHY']

# Features for Similarity search (from `Similar players.ipynb`)
SIMILARITY_FEATURES = OVR_FEATURES # They are the same list of 36 attributes

# --- Helper Function to Load Models ---
def load_models():
    """Loads all necessary models and scalers from the 'models' directory."""
    # Get the directory of the current script
    script_dir = os.path.dirname(os.path.abspath(__file__))
    models_dir = os.path.join(script_dir, '../models')

    try:
        models = {
            'ovr_model': joblib.load(os.path.join(models_dir, 'best_xgb_regr_oerall.pkl')),
            'ovr_scaler': joblib.load(os.path.join(models_dir, 'ovr_feature_scaler.pkl')),
            'pos_model': joblib.load(os.path.join(models_dir, 'best_xgb_model.pkl')),
            'pos_scaler': joblib.load(os.path.join(models_dir, 'position_feature_scaler.pkl')),
            'pos_encoder': joblib.load(os.path.join(models_dir, 'position_label_encoder.pkl')),
            'league_model': joblib.load(os.path.join(models_dir, 'league_tier_model.pkl')),
            'league_encoder': joblib.load(os.path.join(models_dir, 'league_tier_encoder.pkl')),
            'sim_scaler': joblib.load(os.path.join(models_dir, 'similarity_scaler.pkl')),
            'sim_attributes': np.load(os.path.join(models_dir, 'scaled_attributes.npy')),
            'sim_player_info': pd.read_csv(os.path.join(models_dir, 'player_info.csv'))
        }
        return models
    except Exception as e:
        # Print error to stderr so Node.js can catch it
        print(f"Error loading models: {e}", file=sys.stderr)
        sys.exit(1)

# --- Main Prediction Function ---
def predict_all(player_data, models):
    """Runs all predictions for an outfield player."""
    player_df = pd.DataFrame([player_data])

    # 1. Predict OVR
    X_ovr = player_df[OVR_FEATURES]
    X_ovr_scaled = models['ovr_scaler'].transform(X_ovr)
    predicted_ovr = models['ovr_model'].predict(X_ovr_scaled)[0]
    predicted_ovr_rounded = round(float(predicted_ovr))

    # 2. Predict Position
    pos_scores = []
    pos_score_names = [] # To fix feature name warning
    for position, weights in ATTRIBUTE_WEIGHTS.items():
        score = sum(player_df[attr].iloc[0] * weight for attr, weight in weights.items())
        pos_scores.append(score)
        pos_score_names.append(f'{position}_Score')
    
    # --- FIX: Convert to DataFrame with feature names to avoid warning ---
    X_pos = pd.DataFrame([pos_scores], columns=pos_score_names)
    X_pos_scaled = models['pos_scaler'].transform(X_pos)
    pos_pred_encoded = models['pos_model'].predict(X_pos_scaled)
    predicted_position = models['pos_encoder'].inverse_transform(pos_pred_encoded)[0]

    # 3. Predict League Tier (Hybrid Logic)
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

    # 4. Find Similar Players
    X_sim = player_df[SIMILARITY_FEATURES]
    X_sim_scaled = models['sim_scaler'].transform(X_sim)
    
    # --- FIX: Use euclidean_distances which returns a NumPy array ---
    distances = euclidean_distances(X_sim_scaled, models['sim_attributes'])
    
    # Get top 5 most similar (closest distance).
    similar_indices = distances.argsort().flatten()[0:5] # Index 0 is the closest
    
    # Check if the closest player is the input itself (distance 0) and skip
    if distances.flatten()[similar_indices[0]] < 1e-6:
        similar_indices = similar_indices[1:6]
    else:
        similar_indices = similar_indices[0:5]

    similar_players_df = models['sim_player_info'].iloc[similar_indices]
    similar_players = similar_players_df.to_dict('records')

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
        predictions = predict_all(player_input_data, all_models)
        
        # Print the final JSON result to stdout
        print(json.dumps(predictions))
        
    except Exception as e:
        print(f"Python script error: {e}", file=sys.stderr)
        sys.exit(1)