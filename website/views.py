from flask import Blueprint, jsonify, request, flash, redirect, url_for, send_from_directory
from flask_login import login_required, current_user
from . import mysql
from .models import db, User, Admin, Garden, Plant, PlantTracking, GridSpace
from datetime import datetime, timedelta, timezone
import os
import base64
import requests
import re
import time
import json
import io
import numpy as np
from PIL import Image

# Simple in-memory cache for AI enrichment to reduce rate and cost
_AI_CACHE = {}
_AI_CACHE_TTL_SECONDS = 60 * 60  # 1 hour

# Weather cache to prevent API spam
_WEATHER_CACHE = {}
_WEATHER_CACHE_TTL_SECONDS = 10 * 60  # 10 minutes

def create_grid_spaces_for_garden(garden_id, grid_size):
    """Create grid spaces for a garden based on its grid size"""
    try:
        # Parse grid size (e.g., "3x3" -> rows=3, cols=3)
        rows, cols = map(int, grid_size.split('x'))
        
        # Create grid spaces
        for row in range(1, rows + 1):
            for col in range(1, cols + 1):
                grid_space = GridSpace(
                    garden_id=garden_id,
                    grid_position=f"{row},{col}",
                    plant_id=None,
                    planting_date=None,
                    notes='',
                    is_active=True
                )
                db.session.add(grid_space)
        
        db.session.flush()
    except Exception as e:
        print(f"Error creating grid spaces: {e}")
        raise e
_WEATHER_PENDING_REQUESTS = {}  # Track pending requests to prevent duplicates

views = Blueprint('views', __name__)

@views.route('/')
def home():
    from flask_login import current_user
    if current_user.is_authenticated:
        if current_user.is_admin():
            return redirect(url_for('views.admin_dashboard'))
        else:
            return redirect(url_for('views.user_dashboard'))
    return jsonify({"message": "Welcome to eGrowtify API"})

@views.route('/test_db')
def test_db():
    try:
        cur = mysql.connection.cursor()
        cur.execute("SELECT DATABASE()")
        data = cur.fetchone()
        cur.close()
        return jsonify({"database": data[0], "status": "connected"})
    except Exception as e:
        return jsonify({"error": str(e), "status": "error"})

@views.route('/user/dashboard')
@login_required
def user_dashboard():
    if current_user.is_admin():
        return jsonify({"error": "Admin users should use the admin dashboard."}), 403
    
    return jsonify({"message": "User dashboard", "user_id": current_user.id})

@views.route('/admin/dashboard')
@login_required
def admin_dashboard():
    if not current_user.is_admin():
        return jsonify({"error": "Access denied. Admin privileges required."}), 403
    
    # Get some basic stats
    total_users = User.query.count()
    active_users = User.query.filter_by(is_active=True).count()
    total_admins = Admin.query.count()
    
    return jsonify({
        "message": "Admin dashboard",
        "stats": {
            "total_users": total_users,
            "active_users": active_users,
            "total_admins": total_admins
        }
    })

@views.route('/admin/stats')
@login_required
def admin_stats():
    if not current_user.is_admin():
        return jsonify({"error": "Access denied. Admin privileges required."}), 403
    
    # Get detailed statistics
    users = User.query.all()
    admins = Admin.query.all()
    
    return jsonify({
        "users": [{"id": u.id, "email": u.email, "full_name": u.full_name, "is_active": u.is_active} for u in users],
        "admins": [{"id": a.id, "username": a.username, "email": a.email, "full_name": a.full_name} for a in admins]
    })

@views.route('/ai-recognition', methods=['POST'])
@login_required
def ai_plant_recognition():
    if current_user.is_admin():
        return jsonify({"error": "Admins do not have access to the AI recognition feature."}), 403

    try:
        api_key = os.getenv('PLANT_ID_API_KEY')
        if not api_key:
            # Return graceful message with 200 so frontend doesn't throw
            return jsonify({"error": "Missing PLANT_ID_API_KEY. Add it to .env and restart backend."}), 200

        file = request.files.get('image')
        if not file:
            return jsonify({"error": "Image file is required (field name: 'image')."}), 200

        # Read and base64 encode image
        image_bytes = file.read()
        image_b64 = base64.b64encode(image_bytes).decode('utf-8')

        payload = {
            "images": [image_b64],
            "modifiers": ["similar_images"],
            "plant_language": "en",
            "plant_details": [
                "common_names",
                "edible_parts",
                "url",
                "wiki_description"
            ]
        }
        headers = {"Content-Type": "application/json", "Api-Key": api_key}
        resp = requests.post("https://api.plant.id/v2/identify", json=payload, headers=headers, timeout=30)

        if resp.status_code != 200:
            return jsonify({"error": f"Plant.id error {resp.status_code}: {resp.text}"}), 200

        data = resp.json()
        suggestions = data.get('suggestions', [])
        if not suggestions:
            return jsonify({"error": "No match found. Try a clearer photo."}), 200

        # Enhanced common name mapping for better user recognition
        def extract_names(s):
            nm = s.get('plant_name') or s.get('name') or ''
            sci = (s.get('plant_details') or {}).get('scientific_name') or ''
            commons = ((s.get('plant_details') or {}).get('common_names') or []) + (s.get('common_names') or [])
            return nm.lower(), sci.lower(), [c.lower() for c in commons]

        # Comprehensive mapping of scientific names to common names (Philippine-friendly)
        common_name_mapping = {
            # Vegetables
            'daucus carota': 'Carrot',
            'raphanus sativus': 'Radish',
            'solanum lycopersicum': 'Tomato',
            'cucumis sativus': 'Cucumber',
            'capsicum annuum': 'Bell Pepper',
            'solanum melongena': 'Eggplant',
            'allium cepa': 'Onion',
            'allium sativum': 'Garlic',
            'solanum tuberosum': 'Potato',
            'lactuca sativa': 'Lettuce',
            'brassica oleracea': 'Cabbage',
            'spinacia oleracea': 'Spinach',
            'beta vulgaris': 'Beetroot',
            'zea mays': 'Corn',
            'phaseolus vulgaris': 'Green Bean',
            'pisum sativum': 'Pea',
            'cucurbita pepo': 'Zucchini',
            'cucurbita maxima': 'Pumpkin',
            'brassica rapa': 'Turnip',
            'apium graveolens': 'Celery',
            'petroselinum crispum': 'Parsley',
            'coriandrum sativum': 'Cilantro',
            'ocimum basilicum': 'Basil',
            'mentha': 'Mint',
            'thymus vulgaris': 'Thyme',
            'rosmarinus officinalis': 'Rosemary',
            'origanum vulgare': 'Oregano',
            'allium schoenoprasum': 'Chives',
            'brinjal': 'Eggplant',
            'aubergine': 'Eggplant',
            'wild radish': 'Carrot',
            'wild carrot': 'Carrot',
            
            # Philippine-specific mappings
            'guelder-rose': 'Grape',
            'viburnum opulus': 'Grape',
            'viburnum': 'Grape',
            'snowball tree': 'Grape',
            'water elder': 'Grape',
            'cramp bark': 'Grape',
            'guelder rose': 'Grape',
            'bittersweet': 'Grape',
            'solanum dulcamara': 'Grape',
            'climbing nightshade': 'Grape',
            'woody nightshade': 'Grape',
            
            # More common plant mappings for Philippines
            'talong': 'Eggplant',
            'mangga': 'Mango',
            'dalandan': 'Orange',
            'suka': 'Orange',
            'dayap': 'Lemon',
            'saging': 'Banana',
            'niyog': 'Coconut',
            'pinya': 'Pineapple',
            'bayabas': 'Guava',
            'papaya': 'Papaya',
            'pakwan': 'Watermelon',
            'ubas': 'Grape',
            'mansanas': 'Apple',
            'peras': 'Pear',
            
            # Additional Philippine fruits and vegetables
            'atis': 'Sugar Apple',
            'langka': 'Jackfruit',
            'jackfruit': 'Jackfruit',
            'durian': 'Durian',
            'lansones': 'Lansones',
            'lanzones': 'Lansones',
            'rambutan': 'Rambutan',
            'chico': 'Chico',
            'sapodilla': 'Chico',
            'kalamansi': 'Calamansi',
            'calamansi': 'Calamansi',
            'citrus microcarpa': 'Calamansi',
            'santol': 'Santol',
            'duhat': 'Java Plum',
            'java plum': 'Java Plum',
            'syzygium cumini': 'Java Plum',
            'annona squamosa': 'Sugar Apple',
            'sugar apple': 'Sugar Apple',
            'sweetsop': 'Sugar Apple',
            'citrus aurantium': 'Sour Orange',
            'malus domestica': 'Apple',
            'pyrus': 'Pear',
            'prunus persica': 'Peach',
            'prunus avium': 'Cherry',
            'fragaria': 'Strawberry',
            'rubus': 'Raspberry',
            'vitis vinifera': 'Grape',
            'musa': 'Banana',
            'persea americana': 'Avocado',
            'mangifera indica': 'Mango',
            'citrullus lanatus': 'Watermelon',
            'cucumis melo': 'Cantaloupe',
            'ananas comosus': 'Pineapple',
            
            # Herbs and Spices
            'lavandula': 'Lavender',
            'salvia officinalis': 'Sage',
            'mentha spicata': 'Spearmint',
            'mentha piperita': 'Peppermint',
            'cinnamomum verum': 'Cinnamon',
            'zingiber officinale': 'Ginger',
            'curcuma longa': 'Turmeric',
            'capsicum frutescens': 'Chili Pepper',
            
            # Flowers
            'rosa': 'Rose',
            'tulipa': 'Tulip',
            'lilium': 'Lily',
            'chrysanthemum': 'Chrysanthemum',
            'gerbera': 'Gerbera Daisy',
            'helianthus annuus': 'Sunflower',
            'petunia': 'Petunia',
            'impatiens': 'Impatiens',
            'begonia': 'Begonia',
            'marigold': 'Marigold',
            'zinnia': 'Zinnia',
            
            # Trees
            'quercus': 'Oak',
            'acer': 'Maple',
            'betula': 'Birch',
            'pinus': 'Pine',
            'picea': 'Spruce',
            'abies': 'Fir',
            'cedrus': 'Cedar',
            'juniperus': 'Juniper',
            'magnolia': 'Magnolia',
            'acer palmatum': 'Japanese Maple',
            
            # Succulents
            'aloe vera': 'Aloe Vera',
            'echeveria': 'Echeveria',
            'crassula ovata': 'Jade Plant',
            'sedum': 'Sedum',
            'kalanchoe': 'Kalanchoe',
            'haworthia': 'Haworthia',
            'agave': 'Agave',
            'cactus': 'Cactus',
            'succulent': 'Succulent'
        }

        crop_synonyms = {
            'carrot': {'carrot', 'daucus carota', 'wild carrot', 'wild radish'},
            'tomato': {'tomato', 'solanum lycopersicum'},
            'cucumber': {'cucumber', 'cucumis sativus'},
            'pepper': {'pepper', 'capsicum annuum', 'bell pepper', 'chili'},
            'radish': {'radish', 'raphanus sativus'},
            'onion': {'onion', 'allium cepa'},
            'garlic': {'garlic', 'allium sativum'},
            'potato': {'potato', 'solanum tuberosum'},
            'lettuce': {'lettuce', 'lactuca sativa'},
            'eggplant': {'eggplant', 'brinjal', 'aubergine', 'solanum melongena'}
        }

        def crop_match_score(s):
            name_l, sci_l, commons_l = extract_names(s)
            score = 0
            for synonyms in crop_synonyms.values():
                if any(k in name_l or k in sci_l or any(k in c for c in commons_l) for k in synonyms):
                    score = 1
                    break
            return score

        # Base probability
        def prob(s):
            try:
                return float(s.get('probability', 0.0))
            except Exception:
                return 0.0

        # Function to get the best common name (Philippine-friendly)
        def get_best_common_name(plant_name, scientific_name, common_names_list):
            # First, try to find a mapping for the scientific name
            if scientific_name and scientific_name.lower() in common_name_mapping:
                return common_name_mapping[scientific_name.lower()]
            
            # Then try the plant name
            if plant_name and plant_name.lower() in common_name_mapping:
                return common_name_mapping[plant_name.lower()]
            
            # Check if any common names are in our mapping
            for common in common_names_list:
                if common and common.lower() in common_name_mapping:
                    return common_name_mapping[common.lower()]
            
            # Special handling for grape-like plants
            all_text = f"{plant_name or ''} {scientific_name or ''} {' '.join(common_names_list)}".lower()
            if any(keyword in all_text for keyword in ['grape', 'vitis', 'guelder', 'viburnum', 'snowball']):
                return 'Grape'
            
            # If no mapping found, prefer the first common name, or the plant name
            if common_names_list:
                # Filter out scientific-sounding names and prefer common ones
                common_filtered = [c for c in common_names_list if not any(char.isdigit() for char in c) and len(c.split()) <= 2]
                if common_filtered:
                    return common_filtered[0]
                return common_names_list[0]
            
            # If plant name looks scientific, try to extract a common name
            if plant_name and len(plant_name.split()) > 1:
                # Try to find a simple word in the name
                words = plant_name.split()
                for word in words:
                    if len(word) > 3 and not any(char.isdigit() for char in word):
                        return word.title()
            
            return plant_name or 'Unknown'

        # Re-rank: boost crop matches slightly so carrots beat radish if close
        ranked = sorted(suggestions, key=lambda s: (prob(s) + 0.07 * crop_match_score(s)), reverse=True)
        top = ranked[0]
        name = top.get('plant_name') or top.get('name')
        scientific_name = (top.get('plant_details') or {}).get('scientific_name') or ''
        probability = float(top.get('probability', 0)) * 100.0
        details = top.get('plant_details', {})
        common_names = details.get('common_names') or []
        wiki = details.get('wiki_description', {})
        
        # Check for very low confidence - likely not a plant
        if probability < 15.0:
            return jsonify({"error": "No plants detected. Please upload a clear photo of a plant."}), 200
        
        # Additional validation: Check for common non-plant objects that might be misidentified
        name_lower = (name or '').lower()
        scientific_lower = (scientific_name or '').lower()
        common_lower = ' '.join(common_names).lower()
        all_text = f"{name_lower} {scientific_lower} {common_lower}"
        
        # List of non-plant objects that might be misidentified as plants
        non_plant_indicators = [
            'person', 'human', 'face', 'man', 'woman', 'child', 'baby', 'people',
            'car', 'vehicle', 'truck', 'motorcycle', 'bicycle', 'bike',
            'building', 'house', 'wall', 'door', 'window', 'roof',
            'furniture', 'chair', 'table', 'bed', 'sofa', 'desk',
            'electronic', 'phone', 'computer', 'laptop', 'television', 'tv',
            'food', 'bread', 'meat', 'pizza', 'sandwich', 'cake', 'cookie',
            'animal', 'dog', 'cat', 'bird', 'fish', 'horse', 'cow',
            'clothing', 'shirt', 'dress', 'pants', 'shoes', 'hat',
            'book', 'paper', 'document', 'text', 'writing',
            'sky', 'cloud', 'sun', 'moon', 'star'
        ]
        
        # If the identified "plant" matches common non-plant objects, reject it
        for indicator in non_plant_indicators:
            if indicator in all_text:
                return jsonify({"error": "No plants detected. Please upload a clear photo of a plant."}), 200

        # Get the best common name using our mapping
        display_name = get_best_common_name(name, scientific_name, common_names)
        
        # Force common names for known problematic cases
        all_text = f"{name or ''} {scientific_name or ''} {' '.join(common_names)}".lower()
        if any(keyword in all_text for keyword in ['guelder', 'viburnum', 'snowball', 'water elder', 'bittersweet', 'solanum dulcamara', 'climbing nightshade', 'woody nightshade']):
            display_name = 'Grape'
        elif any(keyword in all_text for keyword in ['vitis', 'grape']):
            display_name = 'Grape'
        
        # Additional grape detection based on image characteristics
        try:
            # Check for grape-like characteristics in the image
            img = Image.open(io.BytesIO(image_bytes)).convert('RGB').resize((224, 224))
            arr = np.asarray(img, dtype=np.float32)
            
            # Look for purple/red colors typical of grapes
            purple_mask = (arr[:, :, 0] > 100) & (arr[:, :, 1] < 100) & (arr[:, :, 2] > 100)  # Red channel high, green low, blue high
            purple_ratio = float(np.mean(purple_mask))
            
            # Look for round, clustered shapes (typical of grapes)
            gray = np.mean(arr, axis=2)
            edges = np.abs(np.gradient(gray)[0]) + np.abs(np.gradient(gray)[1])
            edge_density = float(np.mean(edges > 30))
            
            # If image has grape-like characteristics and current name is not grape-related, force it to Grape
            if (purple_ratio > 0.1 or edge_density > 0.3) and not any(keyword in all_text for keyword in ['grape', 'vitis', 'ubas']):
                if any(keyword in all_text for keyword in ['bittersweet', 'nightshade', 'solanum', 'guelder', 'viburnum']):
                    display_name = 'Grape'
        except Exception:
            pass

        # Heuristic: detect strong orange coloration suggesting carrot and adjust when radish/beet chosen
        try:
            hsv = Image.open(io.BytesIO(image_bytes)).convert('HSV').resize((224, 224))
            arr = np.asarray(hsv, dtype=np.uint8)
            h = arr[:, :, 0].astype(np.float32) * (360.0 / 255.0)
            s = arr[:, :, 1].astype(np.float32) / 255.0
            v = arr[:, :, 2].astype(np.float32) / 255.0
            orange_mask = (h >= 20) & (h <= 45) & (s >= 0.45) & (v >= 0.25)
            orange_ratio = float(np.mean(orange_mask))
        except Exception:
            orange_ratio = 0.0

        if orange_ratio > 0.12:
            # If the winner is radish/beet but image is strongly orange, prefer carrot
            lowered = f"{name} {' '.join(common_names)}".lower()
            if any(k in lowered for k in ['radish', 'raphanus', 'beta', 'beet']):
                name = 'Daucus carota'
                display_name = 'Carrot'
                # Increase probability a bit to reflect confidence
                suggestions[0]['probability'] = max(prob(top), 0.5)
        # Provide top alternatives to let UI allow manual correction
        alternatives = []
        for s in ranked[:5]:
            n = s.get('plant_name') or s.get('name')
            sci = (s.get('plant_details') or {}).get('scientific_name') or ''
            commons = (s.get('plant_details') or {}).get('common_names') or []
            p = round(float(s.get('probability', 0)) * 100.0, 1)
            if n:
                # Use common name mapping for alternatives too
                alt_display_name = get_best_common_name(n, sci, commons)
                alternatives.append({'name': alt_display_name, 'confidence': p})

        # Simple heuristics from wiki description to provide dynamic care if AI is unavailable
        def infer_care_from_text(text: str):
            if not isinstance(text, str) or not text.strip():
                return {}
            lower = text.lower()
            care = {}
            # Sunlight
            if re.search(r"full\s+sun|direct\s+sun", lower):
                care['sunlight'] = 'Full sun'
            elif re.search(r"partial\s+shade|part\s+shade|filtered\s+light", lower):
                care['sunlight'] = 'Partial shade'
            elif re.search(r"shade\b|indirect\s+light", lower):
                care['sunlight'] = 'Shade or bright indirect light'
            # Watering
            if re.search(r"drought[-\s]?tolerant|tolerates\s+drought", lower):
                care['watering'] = 'Low; drought-tolerant once established'
            elif re.search(r"keep\s+moist|consistently\s+moist|regular\s+watering", lower):
                care['watering'] = 'Moderate; keep soil evenly moist'
            elif re.search(r"waterlogged|avoid\s+overwatering", lower):
                care['watering'] = 'Allow topsoil to dry; avoid overwatering'
            # Soil
            if re.search(r"well[-\s]?drain(ed|ing)", lower):
                care['soil'] = 'Well-draining soil'
            elif re.search(r"rich\s+soil|fertile\s+soil|organic\s+matter", lower):
                care['soil'] = 'Rich, fertile soil with organic matter'
            elif re.search(r"sandy\s+soil", lower):
                care['soil'] = 'Sandy, free-draining soil'
            return care

        wiki_text = (wiki.get('value') if isinstance(wiki, dict) else None) or ''
        inferred = infer_care_from_text(wiki_text)

        # Rule-based enrichment for common categories and crops (works offline)
        def apply_rule_based_enrichment(scientific: str, display: str, wiki_txt: str):
            name = (scientific or display or '').lower()
            text = (wiki_txt or '').lower()
            def has(*keywords):
                return any(k in name or k in text for k in keywords)

            # Library of rules; expand as needed
            if has('daucus carota', 'carrot'):
                return {
                    'growth_stage': 'Cool‑season root crop',
                    'care_recommendations': {
                        'watering': 'Even moisture; 2.5 cm/week; avoid crusting',
                        'sunlight': 'Full sun',
                        'soil': 'Loose, deep, stone‑free; avoid fresh manure'
                    },
                    'common_issues': ['Forked roots (compaction)', 'Carrot fly', 'Bitter taste from stress'],
                    'estimated_yield': '1–3 kg per m² in 70–80 days'
                }
            if has('solanum lycopersicum', 'tomato'):
                return {
                    'health_status': 'Unknown',
                    'growth_stage': 'Vegetative/fruiting (warm-season annual)',
                    'care_recommendations': {
                        'watering': 'Deeply 1–2x/week; keep evenly moist, avoid wet foliage',
                        'sunlight': 'Full sun (6–8+ hours)',
                        'soil': 'Rich, well‑drained soil with compost; pH 6.0–6.8'
                    },
                    'common_issues': ['Blossom end rot', 'Early blight', 'Aphids', 'Split fruit'],
                    'estimated_yield': '3–10 kg per plant in season'
                }
            if has('cucumis sativus', 'cucumber'):
                return {
                    'growth_stage': 'Vining (warm-season annual)',
                    'care_recommendations': {
                        'watering': 'Consistent moisture; 2.5 cm/week minimum',
                        'sunlight': 'Full sun',
                        'soil': 'Loose, fertile, well‑drained; pH 6.0–6.8'
                    },
                    'common_issues': ['Powdery mildew', 'Cucumber beetles', 'Bitter fruit from stress'],
                    'estimated_yield': '3–5 fruits per vine weekly in peak'
                }
            if has('capsicum annuum', 'pepper', 'bell pepper', 'chili'):
                return {
                    'growth_stage': 'Vegetative/flowering (warm-season annual)',
                    'care_recommendations': {
                        'watering': 'Even moisture; allow topsoil to dry slightly',
                        'sunlight': 'Full sun',
                        'soil': 'Fertile, well‑drained; avoid excess nitrogen'
                    },
                    'common_issues': ['Sunscald', 'Aphids', 'Blossom drop in heat'],
                    'estimated_yield': '5–15 peppers per plant'
                }
            if has('lactuca sativa', 'lettuce'):
                return {
                    'growth_stage': 'Cool‑season leafy',
                    'care_recommendations': {
                        'watering': 'Frequent light watering; keep evenly moist',
                        'sunlight': 'Full sun to partial shade in heat',
                        'soil': 'Loose, fertile, high organic matter'
                    },
                    'common_issues': ['Bolting in heat', 'Slugs', 'Aphids'],
                    'estimated_yield': 'Heads/leaves harvested 30–60 days'
                }
            if has('ocimum basilicum', 'basil'):
                return {
                    'growth_stage': 'Warm‑season herb',
                    'care_recommendations': {
                        'watering': 'Moderate; allow top 2–3 cm to dry',
                        'sunlight': 'Full sun to bright light',
                        'soil': 'Well‑draining, moderately fertile'
                    },
                    'common_issues': ['Downy mildew', 'Root rot from overwater'],
                    'estimated_yield': 'Regular cuttings every 1–2 weeks'
                }
            if has('mentha', 'mint'):
                return {
                    'growth_stage': 'Hardy perennial herb',
                    'care_recommendations': {
                        'watering': 'Keep consistently moist',
                        'sunlight': 'Partial shade to full sun',
                        'soil': 'Moist, rich soil; consider container to contain spread'
                    },
                    'common_issues': ['Aggressive spread', 'Rust'],
                    'estimated_yield': 'Frequent harvest through season'
                }
            if has('citrus', 'lemon', 'orange', 'lime'):
                return {
                    'growth_stage': 'Evergreen fruit tree',
                    'care_recommendations': {
                        'watering': 'Deep, infrequent; let top 3–5 cm dry',
                        'sunlight': 'Full sun',
                        'soil': 'Well‑draining, slightly acidic; avoid wet feet'
                    },
                    'common_issues': ['Scale', 'Leaf miner', 'Nutrient chlorosis'],
                    'estimated_yield': 'Varies by cultivar and age'
                }
            if has('malus domestica', 'apple'):
                return {
                    'growth_stage': 'Deciduous fruit tree',
                    'care_recommendations': {
                        'watering': 'Deep weekly for young trees; adjust by rainfall',
                        'sunlight': 'Full sun',
                        'soil': 'Well‑draining loam; mulch to conserve moisture'
                    },
                    'common_issues': ['Scab', 'Codling moth', 'Fire blight'],
                    'estimated_yield': '10–50+ kg per mature tree'
                }
            if has('rosa', 'rose'):
                return {
                    'growth_stage': 'Flowering shrub',
                    'care_recommendations': {
                        'watering': 'Deep soak 1–2x/week; water soil not foliage',
                        'sunlight': 'Full sun (5–6+ hours)',
                        'soil': 'Rich, well‑drained; regular feeding during bloom'
                    },
                    'common_issues': ['Black spot', 'Powdery mildew', 'Aphids'],
                    'estimated_yield': 'Blooms spring–fall depending on variety'
                }
            if has('cactus', 'succulent', 'crassula', 'echeveria', 'aloe'):
                return {
                    'growth_stage': 'Succulent',
                    'care_recommendations': {
                        'watering': 'Sparse; soak then dry fully (2–4 weeks indoors)',
                        'sunlight': 'Bright light; acclimate to full sun',
                        'soil': 'Gritty, fast‑draining cactus mix'
                    },
                    'common_issues': ['Root rot from overwatering', 'Etiolation in low light'],
                    'estimated_yield': 'N/A'
                }
            if has('tulipa', 'tulip'):
                return {
                    'growth_stage': 'Bulb (cool season)',
                    'care_recommendations': {
                        'watering': 'Moderate during growth; dry summer dormancy',
                        'sunlight': 'Full sun',
                        'soil': 'Well‑drained; avoid waterlogged bulbs'
                    },
                    'common_issues': ['Bulb rot', 'Aphids', 'Deer/rabbit browsing'],
                    'estimated_yield': 'Flowers spring; replant/refresh bulbs as needed'
                }
            if has('helianthus annuus', 'sunflower'):
                return {
                    'growth_stage': 'Annual flowering',
                    'care_recommendations': {
                        'watering': 'Deep watering; drought tolerant once established',
                        'sunlight': 'Full sun',
                        'soil': 'Well‑draining; stake tall varieties'
                    },
                    'common_issues': ['Birds/squirrels on seeds', 'Downy mildew'],
                    'estimated_yield': 'Seeds at maturity (variety dependent)'
                }
            return None

        rule_enrichment = apply_rule_based_enrichment(name, display_name, wiki_text)
        # Determine plant type based on scientific name and common names
        def determine_plant_type(scientific_name, common_names, display_name):
            name_lower = (scientific_name or '').lower()
            common_lower = ' '.join(common_names).lower()
            display_lower = (display_name or '').lower()
            all_text = f"{name_lower} {common_lower} {display_lower}"
            
            # Vegetables
            if any(keyword in all_text for keyword in ['carrot', 'tomato', 'cucumber', 'pepper', 'eggplant', 'onion', 'garlic', 'potato', 'lettuce', 'cabbage', 'spinach', 'beet', 'corn', 'bean', 'pea', 'zucchini', 'pumpkin', 'turnip', 'celery', 'parsley', 'cilantro', 'basil', 'mint', 'thyme', 'rosemary', 'oregano', 'chives']):
                return 'vegetable'
            # Fruits
            elif any(keyword in all_text for keyword in ['orange', 'lemon', 'apple', 'pear', 'peach', 'cherry', 'strawberry', 'raspberry', 'grape', 'banana', 'avocado', 'mango', 'watermelon', 'cantaloupe', 'pineapple']):
                return 'fruit'
            # Herbs
            elif any(keyword in all_text for keyword in ['basil', 'mint', 'thyme', 'rosemary', 'oregano', 'sage', 'cilantro', 'parsley', 'chives', 'lavender', 'ginger', 'turmeric', 'chili']):
                return 'herb'
            # Flowers
            elif any(keyword in all_text for keyword in ['rose', 'tulip', 'lily', 'chrysanthemum', 'gerbera', 'sunflower', 'petunia', 'impatiens', 'begonia', 'marigold', 'zinnia']):
                return 'flower'
            # Trees
            elif any(keyword in all_text for keyword in ['tree', 'oak', 'maple', 'pine', 'cedar', 'birch', 'willow', 'elm', 'ash', 'poplar']):
                return 'tree'
            else:
                return 'flower'  # Default fallback
        
        # Generate comprehensive care guide
        def generate_care_guide(rule_enrichment, inferred, display_name, scientific_name):
            care_parts = []
            
            # Add watering info
            watering = (rule_enrichment or {}).get('care_recommendations', {}).get('watering', inferred.get('watering', 'Water as needed; keep soil appropriate for species'))
            care_parts.append(f"💧 Watering: {watering}")
            
            # Add sunlight info
            sunlight = (rule_enrichment or {}).get('care_recommendations', {}).get('sunlight', inferred.get('sunlight', 'Provide suitable sun exposure for species'))
            care_parts.append(f"☀️ Sunlight: {sunlight}")
            
            # Add soil info
            soil = (rule_enrichment or {}).get('care_recommendations', {}).get('soil', inferred.get('soil', 'Well-draining soil is recommended'))
            care_parts.append(f"🌱 Soil: {soil}")
            
            # Add growth stage info
            growth_stage = (rule_enrichment or {}).get('growth_stage', 'Unknown')
            if growth_stage != 'Unknown':
                care_parts.append(f"📈 Growth Stage: {growth_stage}")
            
            # Add common issues if available
            common_issues = (rule_enrichment or {}).get('common_issues', [])
            if common_issues:
                care_parts.append(f"⚠️ Common Issues: {', '.join(common_issues)}")
            
            return '\n\n'.join(care_parts)
        
        plant_type = determine_plant_type(scientific_name, common_names, display_name)
        care_guide = generate_care_guide(rule_enrichment, inferred, display_name, scientific_name)
        
        result = {
            'plant_name': display_name,  # This now uses our common name mapping
            'plant_type': plant_type,  # Auto-determined plant type
            'care_guide': care_guide,  # Generated care guide
            'scientific_name': scientific_name,  # Keep the scientific name for reference
            'original_name': name,  # Keep the original name from API
            'common_names': common_names,
            'confidence': round(probability, 1),
            'health_status': (rule_enrichment or {}).get('health_status', 'Unknown'),
            'care_recommendations': {
                'watering': (rule_enrichment or {}).get('care_recommendations', {}).get('watering', inferred.get('watering', 'Water as needed; keep soil appropriate for species')),
                'sunlight': (rule_enrichment or {}).get('care_recommendations', {}).get('sunlight', inferred.get('sunlight', 'Provide suitable sun exposure for species')),
                'soil': (rule_enrichment or {}).get('care_recommendations', {}).get('soil', inferred.get('soil', 'Well-draining soil is recommended'))
            },
            'common_issues': [],
            'growth_stage': (rule_enrichment or {}).get('growth_stage', 'Unknown'),
            'estimated_yield': (rule_enrichment or {}).get('estimated_yield', 'N/A'),
            'info_url': details.get('url'),
            'ai_enriched': False
        }
        if alternatives:
            result['alternatives'] = alternatives

        # If rule-based provided issues, set them
        if rule_enrichment and isinstance(rule_enrichment.get('common_issues'), list):
            result['common_issues'] = rule_enrichment['common_issues']
        # Mark whether rules contributed
        result['rules_enriched'] = bool(rule_enrichment) or bool(inferred)

        # Enhanced OpenAI integration for more accurate analysis
        try:
            openai_key = os.getenv('OPENAI_API_KEY')
            if openai_key:
                # Check cache first (key by scientific name or display name)
                cache_key = (result.get('scientific_name') or result.get('plant_name') or '').lower().strip()
                if cache_key in _AI_CACHE:
                    cached = _AI_CACHE[cache_key]
                    if time.time() - cached['ts'] < _AI_CACHE_TTL_SECONDS and isinstance(cached.get('data'), dict):
                        ai = cached['data']
                        result['health_status'] = ai.get('health_status') or result['health_status']
                        result['growth_stage'] = ai.get('growth_stage') or result['growth_stage']
                        if isinstance(ai.get('care_recommendations'), dict):
                            result['care_recommendations'].update({
                                'watering': ai['care_recommendations'].get('watering') or result['care_recommendations']['watering'],
                                'sunlight': ai['care_recommendations'].get('sunlight') or result['care_recommendations']['sunlight'],
                                'soil': ai['care_recommendations'].get('soil') or result['care_recommendations']['soil']
                            })
                        if isinstance(ai.get('common_issues'), list):
                            result['common_issues'] = ai.get('common_issues')
                        if ai.get('estimated_yield'):
                            result['estimated_yield'] = ai.get('estimated_yield')
                        result['ai_enriched'] = True
                        return jsonify(result)
                
                # Enhanced system prompt for image-based analysis
                system_prompt = (
                    "You are an expert horticulturist and plant pathologist with 20+ years of experience. "
                    "Analyze the provided plant image and identification data to give accurate, image-specific guidance. "
                    "Look at the actual condition of the plant in the image - examine leaves, stems, fruits, flowers, and overall health. "
                    "IMPORTANT: Always use common, everyday plant names that people recognize (like 'Carrot', 'Eggplant', 'Tomato') "
                    "instead of scientific names or regional names (like 'Daucus carota', 'Brinjal', 'Solanum lycopersicum'). "
                    "Return your analysis as strict JSON with these exact keys: "
                    "health_status (detailed assessment based on what you see in the image - mention specific visual indicators), "
                    "growth_stage (specific stage based on what's visible in the image - flowers, fruits, leaves, etc.), "
                    "care_recommendations (object with watering, sunlight, soil, fertilizing, pruning based on current condition), "
                    "common_issues (array of specific problems you can see or likely issues based on the image), "
                    "estimated_yield (realistic expectations based on current plant condition), "
                    "seasonal_notes (seasonal care tips), pest_diseases (common threats and prevention). "
                    "Be specific about what you observe in the image and provide practical advice for home gardening. "
                    "Use simple, common plant names that everyone understands."
                )
                
                # Enhanced user payload with image context
                user_payload = {
                    "plant_name": result.get('plant_name'),
                    "scientific_name": result.get('scientific_name'),
                    "common_names": result.get('common_names'),
                    "confidence": result.get('confidence'),
                    "wiki_description": wiki_text,
                    "info_url": result.get('info_url'),
                    "current_season": "spring",  # Could be dynamic based on date
                    "analysis_context": "Analyze the actual plant condition visible in the image"
                }
                
                try:
                    # Try SDK path first with vision capabilities
                    from openai import OpenAI
                    client = OpenAI(api_key=openai_key)
                    
                    # Use vision model for image analysis
                    completion = client.chat.completions.create(
                        model="gpt-4o",  # Use vision-capable model
                        response_format={"type": "json_object"},
                        messages=[
                            {"role": "system", "content": system_prompt},
                            {
                                "role": "user",
                                "content": [
                                    {
                                        "type": "text",
                                        "text": f"Analyze this plant image and provide detailed care guidance based on what you see: {user_payload}"
                                    },
                                    {
                                        "type": "image_url",
                                        "image_url": {
                                            "url": f"data:image/jpeg;base64,{image_b64}"
                                        }
                                    }
                                ]
                            }
                        ],
                        temperature=0.3,  # Lower temperature for more consistent results
                        max_tokens=1000
                    )
                    content = completion.choices[0].message.content
                except Exception:
                    # Fallback to plain HTTPS call with vision
                    http_headers = {
                        'Authorization': f'Bearer {openai_key}',
                        'Content-Type': 'application/json'
                    }
                    http_payload = {
                        'model': 'gpt-4o',  # Use vision-capable model
                        'response_format': { 'type': 'json_object' },
                        'messages': [
                            { 'role': 'system', 'content': system_prompt },
                            {
                                'role': 'user',
                                'content': [
                                    {
                                        'type': 'text',
                                        'text': f'Analyze this plant image and provide detailed care guidance based on what you see: {user_payload}'
                                    },
                                    {
                                        'type': 'image_url',
                                        'image_url': {
                                            'url': f'data:image/jpeg;base64,{image_b64}'
                                        }
                                    }
                                ]
                            }
                        ],
                        'temperature': 0.3,
                        'max_tokens': 1000
                    }
                    # Retry with simple backoff on 429
                    backoffs = [0, 2, 5]
                    last_err = None
                    for delay in backoffs:
                        if delay:
                            time.sleep(delay)
                        http_resp = requests.post('https://api.openai.com/v1/chat/completions', json=http_payload, headers=http_headers, timeout=30)
                        if http_resp.status_code == 429:
                            last_err = f"429: {http_resp.text[:200]}"
                            continue
                        http_resp.raise_for_status()
                        content = http_resp.json()['choices'][0]['message']['content']
                        break
                    else:
                        raise Exception(last_err or 'OpenAI HTTP call failed')
                
                import json as _json
                ai = _json.loads(content)
                
                # Enhanced merge with more comprehensive data
                if isinstance(ai, dict):
                    # Update health status with more detailed assessment
                    if ai.get('health_status'):
                        result['health_status'] = ai['health_status']
                    
                    # Update growth stage with more specific information
                    if ai.get('growth_stage'):
                        result['growth_stage'] = ai['growth_stage']
                    
                    # Enhanced care recommendations
                    if isinstance(ai.get('care_recommendations'), dict):
                        care_recs = ai['care_recommendations']
                        result['care_recommendations'].update({
                            'watering': care_recs.get('watering') or result['care_recommendations']['watering'],
                            'sunlight': care_recs.get('sunlight') or result['care_recommendations']['sunlight'],
                            'soil': care_recs.get('soil') or result['care_recommendations']['soil'],
                            'fertilizing': care_recs.get('fertilizing', 'Follow general fertilizing schedule for this plant type'),
                            'pruning': care_recs.get('pruning', 'Prune as needed for health and shape')
                        })
                    
                    # Enhanced common issues with solutions
                    if isinstance(ai.get('common_issues'), list):
                        result['common_issues'] = ai['common_issues']
                    
                    # Enhanced yield estimation
                    if ai.get('estimated_yield'):
                        result['estimated_yield'] = ai['estimated_yield']
                    
                    # Add new AI-enhanced fields
                    if ai.get('seasonal_notes'):
                        result['seasonal_notes'] = ai['seasonal_notes']
                    
                    if ai.get('pest_diseases'):
                        result['pest_diseases'] = ai['pest_diseases']
                    
                    result['ai_enriched'] = True
                    
                    # Save to cache with enhanced data
                    if cache_key:
                        _AI_CACHE[cache_key] = { 'ts': time.time(), 'data': ai }
                        
        except Exception as ai_err:
            # If AI enrichment fails, fall back to defaults but include server log
            try:
                import logging
                logging.getLogger(__name__).warning("AI enrichment failed: %s", str(ai_err))
            except Exception:
                ...
            # Optional debug surface in response if enabled
            try:
                if os.getenv('DEBUG_AI') == '1':
                    result['ai_error'] = str(ai_err)
            except Exception:
                ...

        return jsonify(result)
    except Exception as e:
        # Fallback to simple on-device heuristic so the feature still works offline
        try:
            file = request.files.get('image')
            if not file:
                return jsonify({"error": f"Analysis failed: {str(e)}"}), 500
            from PIL import Image
            import numpy as np
            image = Image.open(file.stream).convert('RGB').resize((256, 256))
            arr = np.asarray(image, dtype=np.float32)
            red = arr[:, :, 0]
            green = arr[:, :, 1]
            blue = arr[:, :, 2]
            total = np.maximum(red + green + blue, 1.0)
            green_ratio = float(np.mean(green / total))
            red_ratio = float(np.mean(red / total))
            health = 'Healthy' if green_ratio > 0.33 else 'Possible dryness or nutrient deficiency'
            label = 'Leafy Plant' if green_ratio >= 0.37 else 'Fruit/Flower'
            confidence = round(60 + green_ratio * 40, 1)
            return jsonify({
                'plant_name': label,
                'confidence': confidence,
                'health_status': health,
                'care_recommendations': {
                    'watering': 'Keep soil appropriately moist',
                    'sunlight': 'Provide suitable sun exposure',
                    'soil': 'Well-draining soil'
                },
                'common_issues': [],
                'growth_stage': 'Unknown',
                'estimated_yield': 'N/A'
            })
        except Exception:
            return jsonify({"error": f"Analysis failed: {str(e)}"}), 500

@views.route('/soil-analysis', methods=['POST'])
@login_required
def soil_analysis():
    if current_user.is_admin():
        return jsonify({"error": "Admins do not have access to the soil analysis feature."}), 403

    try:
        openai_key = os.getenv('OPENAI_API_KEY')
        if not openai_key:
            return jsonify({"error": "Missing OPENAI_API_KEY. Add it to .env and restart backend."}), 200

        file = request.files.get('image')
        if not file:
            return jsonify({"error": "Image file is required (field name: 'image')."}), 200

        # Read and base64 encode image for OpenAI Vision
        image_bytes = file.read()
        image_b64 = base64.b64encode(image_bytes).decode('utf-8')

        # Enhanced system prompt for comprehensive soil analysis with plant recommendations
        system_prompt = (
            "You are an expert soil scientist, agronomist, and horticulturist with extensive experience in soil analysis and plant-soil relationships. "
            "Analyze the provided soil image and return detailed, accurate soil assessment with specific plant recommendations. "
            "Consider visual indicators of soil health, texture, moisture, color, structure, and potential issues. "
            "Return your analysis as strict JSON with these exact keys: "
            "moisture_level (detailed assessment with visual indicators), texture (specific soil type with characteristics), "
            "ph (estimated pH range with visual indicators), organic_matter (assessment of organic content), "
            "drainage (drainage quality assessment), recommendations (array of specific improvement suggestions), "
            "suitable_plants (detailed object with categories: vegetables, fruits, herbs, flowers, trees - each containing specific plant names with brief explanations), "
            "nutrient_indicators (visual signs of nutrient status), compaction_assessment (soil structure analysis), "
            "soil_health_score (1-10 rating with explanation), seasonal_considerations (best planting times for this soil), "
            "soil_amendments (specific materials to add for improvement), water_retention (how well soil holds water), "
            "root_development (how well roots can grow in this soil). "
            "Be specific, practical, and accurate for home gardening. Focus on plants that would actually thrive in the specific soil conditions visible in the image."
        )

        try:
            # Use OpenAI Vision API for soil analysis
            from openai import OpenAI
            client = OpenAI(api_key=openai_key)
            
            completion = client.chat.completions.create(
                model="gpt-4o",  # Use vision-capable model
                response_format={"type": "json_object"},
                messages=[
                    {"role": "system", "content": system_prompt},
                    {
                        "role": "user",
                        "content": [
                            {
                                "type": "text",
                                "text": "Analyze this soil image and provide detailed soil assessment for home gardening:"
                            },
                            {
                                "type": "image_url",
                                "image_url": {
                                    "url": f"data:image/jpeg;base64,{image_b64}"
                                }
                            }
                        ]
                    }
                ],
                temperature=0.3,
                max_tokens=1000
            )
            content = completion.choices[0].message.content
        except Exception:
            # Fallback to plain HTTPS call
            http_headers = {
                'Authorization': f'Bearer {openai_key}',
                'Content-Type': 'application/json'
            }
            http_payload = {
                'model': 'gpt-4o',
                'response_format': { 'type': 'json_object' },
                'messages': [
                    { 'role': 'system', 'content': system_prompt },
                    {
                        'role': 'user',
                        'content': [
                            {
                                'type': 'text',
                                'text': 'Analyze this soil image and provide detailed soil assessment for home gardening:'
                            },
                            {
                                'type': 'image_url',
                                'image_url': {
                                    'url': f'data:image/jpeg;base64,{image_b64}'
                                }
                            }
                        ]
                    }
                ],
                'temperature': 0.3,
                'max_tokens': 1000
            }
            
            # Retry with simple backoff on 429
            backoffs = [0, 2, 5]
            last_err = None
            for delay in backoffs:
                if delay:
                    time.sleep(delay)
                http_resp = requests.post('https://api.openai.com/v1/chat/completions', json=http_payload, headers=http_headers, timeout=30)
                if http_resp.status_code == 429:
                    last_err = f"429: {http_resp.text[:200]}"
                    continue
                http_resp.raise_for_status()
                content = http_resp.json()['choices'][0]['message']['content']
                break
            else:
                raise Exception(last_err or 'OpenAI HTTP call failed')

        import json as _json
        ai_result = _json.loads(content)
        
        # Structure the response to match frontend expectations with enhanced data
        result = {
            'moisture_level': ai_result.get('moisture_level', 'Unable to determine from image'),
            'texture': ai_result.get('texture', 'Unable to determine from image'),
            'ph': ai_result.get('ph', 'Unable to determine from image'),
            'organic_matter': ai_result.get('organic_matter', 'Unable to assess from image'),
            'drainage': ai_result.get('drainage', 'Unable to assess from image'),
            'recommendations': ai_result.get('recommendations', []),
            'suitable_plants': ai_result.get('suitable_plants', {}),
            'nutrient_indicators': ai_result.get('nutrient_indicators', 'Unable to assess from image'),
            'compaction_assessment': ai_result.get('compaction_assessment', 'Unable to assess from image'),
            'soil_health_score': ai_result.get('soil_health_score', 'Unable to assess from image'),
            'seasonal_considerations': ai_result.get('seasonal_considerations', 'Unable to assess from image'),
            'soil_amendments': ai_result.get('soil_amendments', 'Unable to assess from image'),
            'water_retention': ai_result.get('water_retention', 'Unable to assess from image'),
            'root_development': ai_result.get('root_development', 'Unable to assess from image'),
            'ai_analyzed': True
        }

        return jsonify(result)
        
    except Exception as e:
        # Fallback to basic heuristic analysis
        try:
            file = request.files.get('image')
            if not file:
                return jsonify({"error": f"Soil analysis failed: {str(e)}"}), 500
            
            from PIL import Image
            import numpy as np
            image = Image.open(file.stream).convert('RGB').resize((256, 256))
            arr = np.asarray(image, dtype=np.float32)
            
            # Basic color analysis for soil characteristics
            red = arr[:, :, 0]
            green = arr[:, :, 1]
            blue = arr[:, :, 2]
            
            # Calculate average colors
            avg_red = float(np.mean(red))
            avg_green = float(np.mean(green))
            avg_blue = float(np.mean(blue))
            
            # Basic soil type estimation based on color
            if avg_red > 120 and avg_green > 100:
                soil_type = "Clay-rich soil (reddish-brown)"
                ph_estimate = "Slightly acidic to neutral (6.0-7.0)"
            elif avg_red > 100 and avg_green > 80:
                soil_type = "Loamy soil (brown)"
                ph_estimate = "Neutral (6.5-7.5)"
            elif avg_red < 80 and avg_green < 80:
                soil_type = "Sandy soil (light colored)"
                ph_estimate = "Variable, may be alkaline (7.0-8.0)"
            else:
                soil_type = "Mixed soil composition"
                ph_estimate = "Neutral range (6.5-7.5)"
            
            # Basic moisture estimation
            brightness = (avg_red + avg_green + avg_blue) / 3
            if brightness < 80:
                moisture = "Appears moist or wet"
            elif brightness > 150:
                moisture = "Appears dry"
            else:
                moisture = "Moderate moisture level"
            
            return jsonify({
                'moisture_level': moisture,
                'texture': soil_type,
                'ph': ph_estimate,
                'organic_matter': 'Unable to assess from image - consider soil test',
                'drainage': 'Unable to assess from image - observe after watering',
                'recommendations': [
                    'Consider professional soil testing for accurate pH and nutrient levels',
                    'Add organic matter like compost to improve soil structure',
                    'Test drainage by observing how quickly water is absorbed'
                ],
                'suitable_plants': ['Most common garden plants will grow in this soil type'],
                'nutrient_indicators': 'Unable to assess from image - consider soil test',
                'compaction_assessment': 'Unable to assess from image - test with finger or tool',
                'ai_analyzed': False,
                'fallback_analysis': True
            })
        except Exception:
            return jsonify({"error": f"Soil analysis failed: {str(e)}"}), 500

@views.route('/camera')
@login_required
def camera():
    from flask_login import current_user
    if current_user.is_admin():
        return jsonify({"error": "Admins do not have access to the camera feature."}), 403
    return jsonify({"message": "Camera feature", "user_id": current_user.id})

@views.route('/seasonal-planning')
@login_required
def seasonal_planning():
    # Get user's location from their garden data
    user_gardens = Garden.query.filter_by(user_id=current_user.id).all()
    location = "Unknown"
    if user_gardens:
        # Use the first garden's location as user's location
        garden = user_gardens[0]
        location = f"{garden.location_city}, {garden.location_country}" if garden.location_city else "Unknown"
    
    # Get current season
    month = datetime.now().month
    if month >= 3 and month <= 5:
        season = 'spring'
    elif month >= 6 and month <= 8:
        season = 'summer'
    elif month >= 9 and month <= 11:
        season = 'fall'
    else:
        season = 'winter'
    
    # Enhanced seasonal data with weather integration
    seasonal_data = {
        'location': location,
        'current_season': season,
        'planting_calendar': {
            'spring': ['Tomatoes', 'Peppers', 'Lettuce', 'Herbs'],
            'summer': ['Cucumbers', 'Zucchini', 'Beans', 'Corn'],
            'fall': ['Kale', 'Spinach', 'Garlic', 'Onions'],
            'winter': ['Indoor herbs', 'Microgreens', 'Sprouts']
        },
        'tips': {
            'spring': ['Test soil pH', 'Start seeds indoors', 'Prepare garden beds'],
            'summer': ['Mulch to retain moisture', 'Water deeply', 'Monitor for pests'],
            'fall': ['Plant cool-season crops', 'Clean up garden', 'Add compost'],
            'winter': ['Plan next year', 'Maintain tools', 'Grow indoors']
        },
        'weather_integration': {
            'optimal_planting_conditions': {
                'temperature_range': '50-75°F',
                'humidity_range': '40-70%',
                'soil_temperature': '50°F+ for most seeds'
            },
            'weather_alerts': {
                'frost_warning': 'Protect tender plants',
                'heat_stress': 'Water early morning/evening',
                'high_humidity': 'Watch for fungal diseases'
            }
        }
    }
    
    return jsonify(seasonal_data)

@views.route('/api/plant-weather-tolerance')
def get_plant_weather_tolerance():
    """Get plant-specific weather tolerance data and warnings"""
    city = request.args.get('city', 'Cebu')
    plant_name = request.args.get('plant', '')
    
    try:
        # Get current weather data
        api_key = os.getenv('OPENWEATHER_API_KEY')
        if not api_key:
            return jsonify({
                "error": "Weather API key not configured",
                "success": False
            }), 500
        
        # Get coordinates first
        geocode_url = f"http://api.openweathermap.org/geo/1.0/direct?q={city}&limit=1&appid={api_key}"
        geocode_response = requests.get(geocode_url)
        
        if geocode_response.status_code != 200:
            return jsonify({
                "error": "City not found",
                "success": False
            }), 404
        
        geocode_data = geocode_response.json()
        if not geocode_data:
            return jsonify({
                "error": "City not found",
                "success": False
            }), 404
        
        lat = geocode_data[0]['lat']
        lon = geocode_data[0]['lon']
        
        # Get current weather
        weather_url = f"https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={api_key}&units=metric"
        weather_response = requests.get(weather_url)
        
        if weather_response.status_code == 200:
            weather_data = weather_response.json()
            current_temp = weather_data['main']['temp']
            current_humidity = weather_data['main']['humidity']
            current_wind = weather_data['wind']['speed']
            current_conditions = weather_data['weather'][0]['description']
            
            # Comprehensive plant database with weather tolerances
            plant_database = {
                'tomatoes': {
                    'name': 'Tomatoes',
                    'optimal_temp': {'min': 18, 'max': 29},
                    'tolerance_temp': {'min': 10, 'max': 35},
                    'optimal_humidity': {'min': 50, 'max': 70},
                    'tolerance_humidity': {'min': 30, 'max': 85},
                    'wind_tolerance': 15,  # km/h
                    'heat_stress_temp': 32,
                    'cold_damage_temp': 5,
                    'humidity_disease_risk': 80,
                    'varieties': {
                        'cherry': {'cold_tolerance': 2, 'heat_tolerance': 2},
                        'beefsteak': {'cold_tolerance': 0, 'heat_tolerance': 1},
                        'roma': {'cold_tolerance': 1, 'heat_tolerance': 2}
                    }
                },
                'peppers': {
                    'name': 'Peppers',
                    'optimal_temp': {'min': 21, 'max': 29},
                    'tolerance_temp': {'min': 15, 'max': 32},
                    'optimal_humidity': {'min': 50, 'max': 70},
                    'tolerance_humidity': {'min': 40, 'max': 80},
                    'wind_tolerance': 12,
                    'heat_stress_temp': 30,
                    'cold_damage_temp': 10,
                    'humidity_disease_risk': 75,
                    'varieties': {
                        'bell': {'cold_tolerance': 0, 'heat_tolerance': 1},
                        'jalapeno': {'cold_tolerance': 1, 'heat_tolerance': 2},
                        'habanero': {'cold_tolerance': 2, 'heat_tolerance': 3}
                    }
                },
                'lettuce': {
                    'name': 'Lettuce',
                    'optimal_temp': {'min': 7, 'max': 18},
                    'tolerance_temp': {'min': 2, 'max': 24},
                    'optimal_humidity': {'min': 60, 'max': 80},
                    'tolerance_humidity': {'min': 40, 'max': 90},
                    'wind_tolerance': 20,
                    'heat_stress_temp': 25,
                    'cold_damage_temp': -2,
                    'humidity_disease_risk': 85,
                    'varieties': {
                        'romaine': {'cold_tolerance': 2, 'heat_tolerance': 0},
                        'butterhead': {'cold_tolerance': 1, 'heat_tolerance': 0},
                        'iceberg': {'cold_tolerance': 1, 'heat_tolerance': 1}
                    }
                },
                'cucumbers': {
                    'name': 'Cucumbers',
                    'optimal_temp': {'min': 18, 'max': 26},
                    'tolerance_temp': {'min': 10, 'max': 32},
                    'optimal_humidity': {'min': 60, 'max': 80},
                    'tolerance_humidity': {'min': 40, 'max': 90},
                    'wind_tolerance': 10,
                    'heat_stress_temp': 30,
                    'cold_damage_temp': 5,
                    'humidity_disease_risk': 80,
                    'varieties': {
                        'english': {'cold_tolerance': 0, 'heat_tolerance': 1},
                        'pickling': {'cold_tolerance': 1, 'heat_tolerance': 2},
                        'lemon': {'cold_tolerance': 1, 'heat_tolerance': 1}
                    }
                },
                'herbs': {
                    'name': 'Herbs (Basil, Parsley, Cilantro)',
                    'optimal_temp': {'min': 15, 'max': 24},
                    'tolerance_temp': {'min': 5, 'max': 30},
                    'optimal_humidity': {'min': 40, 'max': 60},
                    'tolerance_humidity': {'min': 30, 'max': 70},
                    'wind_tolerance': 15,
                    'heat_stress_temp': 28,
                    'cold_damage_temp': 2,
                    'humidity_disease_risk': 70,
                    'varieties': {
                        'basil': {'cold_tolerance': 0, 'heat_tolerance': 2},
                        'parsley': {'cold_tolerance': 2, 'heat_tolerance': 0},
                        'cilantro': {'cold_tolerance': 1, 'heat_tolerance': 0}
                    }
                },
                'garlic': {
                    'name': 'Garlic',
                    'optimal_temp': {'min': 0, 'max': 15},
                    'tolerance_temp': {'min': -10, 'max': 25},
                    'optimal_humidity': {'min': 50, 'max': 70},
                    'tolerance_humidity': {'min': 30, 'max': 80},
                    'wind_tolerance': 25,
                    'heat_stress_temp': 25,
                    'cold_damage_temp': -15,
                    'humidity_disease_risk': 75,
                    'varieties': {
                        'hardneck': {'cold_tolerance': 3, 'heat_tolerance': 0},
                        'softneck': {'cold_tolerance': 2, 'heat_tolerance': 1}
                    }
                }
            }
            
            # Analyze current conditions for all plants or specific plant
            analysis_results = []
            
            if plant_name and plant_name.lower() in plant_database:
                plants_to_analyze = [plant_name.lower()]
            else:
                plants_to_analyze = list(plant_database.keys())
            
            for plant_key in plants_to_analyze:
                plant = plant_database[plant_key]
                warnings = []
                recommendations = []
                status = "Good"
                status_color = "green"
                
                # Temperature analysis
                if current_temp < plant['optimal_temp']['min']:
                    warnings.append(f"Temperature too low ({current_temp}°C). Optimal: {plant['optimal_temp']['min']}-{plant['optimal_temp']['max']}°C")
                    if current_temp < plant['cold_damage_temp']:
                        warnings.append(f"⚠️ COLD DAMAGE RISK! Temperature below {plant['cold_damage_temp']}°C")
                        status = "Critical"
                        status_color = "red"
                    else:
                        status = "Poor"
                        status_color = "yellow"
                    recommendations.append("Protect with row covers or bring indoors")
                elif current_temp > plant['optimal_temp']['max']:
                    warnings.append(f"Temperature too high ({current_temp}°C). Optimal: {plant['optimal_temp']['min']}-{plant['optimal_temp']['max']}°C")
                    if current_temp > plant['heat_stress_temp']:
                        warnings.append(f"🌡️ HEAT STRESS RISK! Temperature above {plant['heat_stress_temp']}°C")
                        status = "Critical"
                        status_color = "red"
                    else:
                        status = "Poor"
                        status_color = "yellow"
                    recommendations.append("Provide shade and increase watering frequency")
                
                # Humidity analysis
                if current_humidity < plant['optimal_humidity']['min']:
                    warnings.append(f"Humidity too low ({current_humidity}%). Optimal: {plant['optimal_humidity']['min']}-{plant['optimal_humidity']['max']}%")
                    recommendations.append("Increase watering frequency and consider misting")
                elif current_humidity > plant['optimal_humidity']['max']:
                    warnings.append(f"Humidity too high ({current_humidity}%). Optimal: {plant['optimal_humidity']['min']}-{plant['optimal_humidity']['max']}%")
                    if current_humidity > plant['humidity_disease_risk']:
                        warnings.append(f"🦠 DISEASE RISK! High humidity promotes fungal diseases")
                        if status != "Critical":
                            status = "Poor"
                            status_color = "yellow"
                    recommendations.append("Improve air circulation and avoid overhead watering")
                
                # Wind analysis
                if current_wind > plant['wind_tolerance']:
                    warnings.append(f"Wind too strong ({current_wind} km/h). Tolerance: {plant['wind_tolerance']} km/h")
                    recommendations.append("Provide wind protection or stake plants")
                
                # Condition-specific warnings
                if 'rain' in current_conditions.lower():
                    recommendations.append("Rain provides natural watering - reduce irrigation")
                if 'storm' in current_conditions.lower():
                    warnings.append("🌪️ STORM CONDITIONS - Protect plants from damage")
                    if status != "Critical":
                        status = "Poor"
                        status_color = "yellow"
                
                analysis_results.append({
                    'plant_name': plant['name'],
                    'current_conditions': {
                        'temperature': current_temp,
                        'humidity': current_humidity,
                        'wind_speed': current_wind,
                        'conditions': current_conditions
                    },
                    'optimal_ranges': {
                        'temperature': f"{plant['optimal_temp']['min']}-{plant['optimal_temp']['max']}°C",
                        'humidity': f"{plant['optimal_humidity']['min']}-{plant['optimal_humidity']['max']}%"
                    },
                    'warnings': warnings,
                    'recommendations': recommendations,
                    'status': status,
                    'status_color': status_color,
                    'varieties': plant['varieties']
                })
            
            return jsonify({
                "plant_analysis": analysis_results,
                "current_weather": {
                    'temperature': current_temp,
                    'humidity': current_humidity,
                    'wind_speed': current_wind,
                    'conditions': current_conditions
                },
                "city": city,
                "success": True
            })
        else:
            return jsonify({
                "error": f"Weather service error: {weather_response.status_code}",
                "success": False
            }), weather_response.status_code
            
    except Exception as e:
        return jsonify({
            "error": f"Error fetching plant weather tolerance: {str(e)}",
            "success": False
        }), 500

@views.route('/api/microclimate-zones')
def get_microclimate_zones():
    """Get microclimate zone recommendations for garden areas"""
    city = request.args.get('city', 'Cebu')
    
    try:
        # Get current weather data
        api_key = os.getenv('OPENWEATHER_API_KEY')
        if not api_key:
            return jsonify({
                "error": "Weather API key not configured",
                "success": False
            }), 500
        
        # Get coordinates first
        geocode_url = f"http://api.openweathermap.org/geo/1.0/direct?q={city}&limit=1&appid={api_key}"
        geocode_response = requests.get(geocode_url)
        
        if geocode_response.status_code != 200:
            return jsonify({
                "error": "City not found",
                "success": False
            }), 404
        
        geocode_data = geocode_response.json()
        if not geocode_data:
            return jsonify({
                "error": "City not found",
                "success": False
            }), 404
        
        lat = geocode_data[0]['lat']
        lon = geocode_data[0]['lon']
        
        # Get current weather
        weather_url = f"https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={api_key}&units=metric"
        weather_response = requests.get(weather_url)
        
        if weather_response.status_code == 200:
            weather_data = weather_response.json()
            current_temp = weather_data['main']['temp']
            current_humidity = weather_data['main']['humidity']
            current_wind = weather_data['wind']['speed']
            
            # Define microclimate zones based on typical garden layouts
            microclimate_zones = [
                {
                    'name': 'Full Sun Zone',
                    'description': 'Areas receiving 6+ hours of direct sunlight daily',
                    'temperature_modifier': 3,  # +3°C warmer than ambient
                    'humidity_modifier': -10,   # -10% humidity
                    'wind_modifier': 1.2,       # 20% more wind exposure
                    'suitable_plants': ['Tomatoes', 'Peppers', 'Basil', 'Rosemary', 'Sunflowers'],
                    'care_tips': [
                        'Water deeply and frequently during hot weather',
                        'Use mulch to retain soil moisture',
                        'Consider shade cloth during extreme heat',
                        'Monitor for sunburn on leaves'
                    ],
                    'seasonal_considerations': {
                        'spring': 'Perfect for starting warm-season crops',
                        'summer': 'May need extra watering and heat protection',
                        'fall': 'Excellent for extending growing season',
                        'winter': 'Good for cool-season crops in mild climates'
                    }
                },
                {
                    'name': 'Partial Shade Zone',
                    'description': 'Areas receiving 3-6 hours of direct sunlight daily',
                    'temperature_modifier': 0,  # Same as ambient
                    'humidity_modifier': 5,     # +5% humidity
                    'wind_modifier': 0.8,       # 20% less wind exposure
                    'suitable_plants': ['Lettuce', 'Spinach', 'Kale', 'Cilantro', 'Mint'],
                    'care_tips': [
                        'Monitor soil moisture - may dry slower',
                        'Good air circulation to prevent fungal issues',
                        'Ideal for succession planting',
                        'Protect from late afternoon sun'
                    ],
                    'seasonal_considerations': {
                        'spring': 'Excellent for cool-season crops',
                        'summer': 'Provides relief from intense heat',
                        'fall': 'Perfect for extending harvest season',
                        'winter': 'Good protection for tender plants'
                    }
                },
                {
                    'name': 'Full Shade Zone',
                    'description': 'Areas receiving less than 3 hours of direct sunlight',
                    'temperature_modifier': -2, # -2°C cooler than ambient
                    'humidity_modifier': 15,    # +15% humidity
                    'wind_modifier': 0.5,       # 50% less wind exposure
                    'suitable_plants': ['Hostas', 'Ferns', 'Mint', 'Parsley', 'Chives'],
                    'care_tips': [
                        'Focus on moisture-loving plants',
                        'Improve drainage to prevent waterlogging',
                        'Use reflective surfaces to increase light',
                        'Monitor for fungal diseases due to high humidity'
                    ],
                    'seasonal_considerations': {
                        'spring': 'Slow to warm up - plant later',
                        'summer': 'Cool refuge for heat-sensitive plants',
                        'fall': 'Good for overwintering tender perennials',
                        'winter': 'Protection from frost damage'
                    }
                },
                {
                    'name': 'Wind-Protected Zone',
                    'description': 'Areas sheltered by buildings, fences, or trees',
                    'temperature_modifier': 1,  # +1°C warmer than ambient
                    'humidity_modifier': 10,    # +10% humidity
                    'wind_modifier': 0.3,       # 70% less wind exposure
                    'suitable_plants': ['Delicate herbs', 'Young seedlings', 'Climbing plants'],
                    'care_tips': [
                        'Excellent for starting seeds and seedlings',
                        'Monitor humidity levels',
                        'Good for vertical growing structures',
                        'Protect from late frosts'
                    ],
                    'seasonal_considerations': {
                        'spring': 'Perfect for early season planting',
                        'summer': 'Reduced water loss from wind',
                        'fall': 'Extended growing season',
                        'winter': 'Excellent frost protection'
                    }
                },
                {
                    'name': 'Heat Trap Zone',
                    'description': 'Areas near walls, patios, or other heat-absorbing surfaces',
                    'temperature_modifier': 5,  # +5°C warmer than ambient
                    'humidity_modifier': -15,   # -15% humidity
                    'wind_modifier': 0.6,       # 40% less wind exposure
                    'suitable_plants': ['Heat-loving peppers', 'Eggplant', 'Okra', 'Sweet potatoes'],
                    'care_tips': [
                        'Water frequently - soil dries quickly',
                        'Use heat-tolerant varieties',
                        'Consider container gardening for mobility',
                        'Monitor for heat stress'
                    ],
                    'seasonal_considerations': {
                        'spring': 'Warms up quickly - early planting possible',
                        'summer': 'May be too hot for most plants',
                        'fall': 'Excellent for extending warm-season crops',
                        'winter': 'Good for overwintering tender plants'
                    }
                }
            ]
            
            # Calculate zone-specific conditions
            zone_analysis = []
            for zone in microclimate_zones:
                zone_temp = round(current_temp + zone['temperature_modifier'], 1)
                zone_humidity = max(0, min(100, current_humidity + zone['humidity_modifier']))
                zone_wind = round(current_wind * zone['wind_modifier'], 1)
                
                # Determine zone suitability for current conditions
                suitability_score = 0
                suitability_notes = []
                
                if 15 <= zone_temp <= 30:
                    suitability_score += 3
                    suitability_notes.append("Optimal temperature range")
                elif 10 <= zone_temp < 15 or 30 < zone_temp <= 35:
                    suitability_score += 2
                    suitability_notes.append("Good temperature range")
                elif zone_temp < 10:
                    suitability_score += 1
                    suitability_notes.append("Cool conditions - good for cool-season crops")
                else:
                    suitability_score += 0
                    suitability_notes.append("Extreme temperatures - monitor closely")
                
                if 40 <= zone_humidity <= 80:
                    suitability_score += 2
                    suitability_notes.append("Good humidity levels")
                elif zone_humidity > 80:
                    suitability_score += 1
                    suitability_notes.append("High humidity - watch for diseases")
                else:
                    suitability_score += 1
                    suitability_notes.append("Low humidity - increase watering")
                
                if zone_wind < 15:
                    suitability_score += 2
                    suitability_notes.append("Calm conditions")
                elif zone_wind < 25:
                    suitability_score += 1
                    suitability_notes.append("Moderate wind")
                else:
                    suitability_score += 0
                    suitability_notes.append("High winds - provide protection")
                
                # Determine overall suitability
                if suitability_score >= 6:
                    suitability = "Excellent"
                    suitability_color = "green"
                elif suitability_score >= 4:
                    suitability = "Good"
                    suitability_color = "blue"
                elif suitability_score >= 2:
                    suitability = "Fair"
                    suitability_color = "yellow"
                else:
                    suitability = "Poor"
                    suitability_color = "red"
                
                zone_analysis.append({
                    'zone_info': zone,
                    'current_conditions': {
                        'temperature': zone_temp,
                        'humidity': zone_humidity,
                        'wind_speed': zone_wind
                    },
                    'suitability': {
                        'score': suitability_score,
                        'rating': suitability,
                        'color': suitability_color,
                        'notes': suitability_notes
                    }
                })
            
            return jsonify({
                "microclimate_zones": zone_analysis,
                "base_conditions": {
                    'temperature': current_temp,
                    'humidity': current_humidity,
                    'wind_speed': current_wind
                },
                "city": city,
                "success": True
            })
        else:
            return jsonify({
                "error": f"Weather service error: {weather_response.status_code}",
                "success": False
            }), weather_response.status_code
            
    except Exception as e:
        return jsonify({
            "error": f"Error fetching microclimate zones: {str(e)}",
            "success": False
        }), 500

@views.route('/api/soil-temperature')
def get_soil_temperature():
    """Get soil temperature recommendations based on weather data"""
    city = request.args.get('city', 'Cebu')
    
    try:
        # Get current weather data
        api_key = os.getenv('OPENWEATHER_API_KEY')
        if not api_key:
            return jsonify({
                "error": "Weather API key not configured",
                "success": False
            }), 500
        
        # Get coordinates first
        geocode_url = f"http://api.openweathermap.org/geo/1.0/direct?q={city}&limit=1&appid={api_key}"
        geocode_response = requests.get(geocode_url)
        
        if geocode_response.status_code != 200:
            return jsonify({
                "error": "City not found",
                "success": False
            }), 404
        
        geocode_data = geocode_response.json()
        if not geocode_data:
            return jsonify({
                "error": "City not found",
                "success": False
            }), 404
        
        lat = geocode_data[0]['lat']
        lon = geocode_data[0]['lon']
        
        # Get current weather
        weather_url = f"https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={api_key}&units=metric"
        weather_response = requests.get(weather_url)
        
        if weather_response.status_code == 200:
            weather_data = weather_response.json()
            air_temp = weather_data['main']['temp']
            
            # Estimate soil temperature (typically 2-5°C cooler than air temp)
            # This is a simplified calculation - in reality, soil temp varies by depth, time of day, etc.
            soil_temp_shallow = round(air_temp - 2, 1)  # 2-4 inches deep
            soil_temp_deep = round(air_temp - 4, 1)     # 6-8 inches deep
            
            # Generate planting recommendations based on soil temperature
            recommendations = []
            
            if soil_temp_shallow >= 10:
                recommendations.append({
                    "plant_type": "Warm-season vegetables",
                    "plants": ["Tomatoes", "Peppers", "Eggplant", "Cucumbers", "Squash"],
                    "soil_temp_range": "10-15°C+",
                    "current_temp": f"{soil_temp_shallow}°C",
                    "status": "Ready to plant" if soil_temp_shallow >= 15 else "Almost ready",
                    "color": "green" if soil_temp_shallow >= 15 else "yellow"
                })
            
            if soil_temp_shallow >= 5:
                recommendations.append({
                    "plant_type": "Cool-season vegetables",
                    "plants": ["Lettuce", "Spinach", "Kale", "Peas", "Radishes"],
                    "soil_temp_range": "5-10°C",
                    "current_temp": f"{soil_temp_shallow}°C",
                    "status": "Ready to plant" if 5 <= soil_temp_shallow <= 15 else "Check conditions",
                    "color": "green" if 5 <= soil_temp_shallow <= 15 else "blue"
                })
            
            if soil_temp_shallow < 5:
                recommendations.append({
                    "plant_type": "Cold-tolerant crops",
                    "plants": ["Garlic", "Onions", "Carrots", "Beets"],
                    "soil_temp_range": "2-5°C",
                    "current_temp": f"{soil_temp_shallow}°C",
                    "status": "Ready to plant" if soil_temp_shallow >= 2 else "Too cold",
                    "color": "green" if soil_temp_shallow >= 2 else "red"
                })
            
            # Add general soil temperature tips
            tips = []
            if soil_temp_shallow < 10:
                tips.append("Soil is still cool. Consider using row covers or black plastic to warm the soil.")
            elif soil_temp_shallow > 20:
                tips.append("Soil is warm. Perfect for heat-loving plants like tomatoes and peppers.")
            else:
                tips.append("Soil temperature is moderate. Good for most cool and warm-season crops.")
            
            return jsonify({
                "soil_temperature": {
                    "shallow": soil_temp_shallow,
                    "deep": soil_temp_deep,
                    "air_temperature": air_temp
                },
                "recommendations": recommendations,
                "tips": tips,
                "city": city,
                "success": True
            })
        else:
            return jsonify({
                "error": f"Weather service error: {weather_response.status_code}",
                "success": False
            }), weather_response.status_code
            
    except Exception as e:
        return jsonify({
            "error": f"Error fetching soil temperature data: {str(e)}",
            "success": False
        }), 500

@views.route('/api/weather-forecast')
def get_weather_forecast():
    """Get 7-day weather forecast for better planting timing"""
    city = request.args.get('city', 'Cebu')
    
    try:
        # Get 7-day forecast from OpenWeatherMap
        api_key = os.getenv('OPENWEATHER_API_KEY')
        if not api_key:
            return jsonify({
                "error": "Weather API key not configured",
                "success": False
            }), 500
        
        # Get coordinates first
        geocode_url = f"http://api.openweathermap.org/geo/1.0/direct?q={city}&limit=1&appid={api_key}"
        geocode_response = requests.get(geocode_url)
        
        if geocode_response.status_code != 200:
            return jsonify({
                "error": "City not found",
                "success": False
            }), 404
        
        geocode_data = geocode_response.json()
        if not geocode_data:
            return jsonify({
                "error": "City not found",
                "success": False
            }), 404
        
        lat = geocode_data[0]['lat']
        lon = geocode_data[0]['lon']
        
        # Get 7-day forecast
        forecast_url = f"https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={api_key}&units=metric"
        forecast_response = requests.get(forecast_url)
        
        if forecast_response.status_code == 200:
            forecast_data = forecast_response.json()
            
            # Process forecast data for planting recommendations
            daily_forecasts = []
            current_date = None
            daily_data = {}
            
            for item in forecast_data['list']:
                date = item['dt_txt'].split(' ')[0]
                if date != current_date:
                    if current_date and daily_data:
                        daily_forecasts.append(daily_data)
                    current_date = date
                    daily_data = {
                        'date': date,
                        'temperatures': [],
                        'humidity': [],
                        'conditions': [],
                        'wind_speed': [],
                        'rain_probability': []
                    }
                
                daily_data['temperatures'].append(item['main']['temp'])
                daily_data['humidity'].append(item['main']['humidity'])
                daily_data['conditions'].append(item['weather'][0]['description'])
                daily_data['wind_speed'].append(item['wind']['speed'])
                if 'rain' in item:
                    daily_data['rain_probability'].append(item['rain'].get('3h', 0))
                else:
                    daily_data['rain_probability'].append(0)
            
            if daily_data:
                daily_forecasts.append(daily_data)
            
            # Process daily data
            processed_forecast = []
            for day in daily_forecasts[:7]:  # Limit to 7 days
                avg_temp = round(sum(day['temperatures']) / len(day['temperatures']))
                min_temp = round(min(day['temperatures']))
                max_temp = round(max(day['temperatures']))
                avg_humidity = round(sum(day['humidity']) / len(day['humidity']))
                avg_wind = round(sum(day['wind_speed']) / len(day['wind_speed']))
                total_rain = sum(day['rain_probability'])
                
                # Determine planting conditions
                planting_score = 0
                conditions = []
                
                if 50 <= avg_temp <= 75:
                    planting_score += 3
                    conditions.append("Optimal temperature")
                elif 45 <= avg_temp < 50 or 75 < avg_temp <= 80:
                    planting_score += 2
                    conditions.append("Good temperature")
                elif avg_temp < 45:
                    planting_score += 0
                    conditions.append("Too cold for most plants")
                else:
                    planting_score += 1
                    conditions.append("Hot weather - water frequently")
                
                if 40 <= avg_humidity <= 70:
                    planting_score += 2
                    conditions.append("Good humidity")
                elif avg_humidity > 70:
                    planting_score += 1
                    conditions.append("High humidity - watch for diseases")
                else:
                    planting_score += 1
                    conditions.append("Low humidity - water more")
                
                if avg_wind < 15:
                    planting_score += 2
                    conditions.append("Calm conditions")
                elif avg_wind < 25:
                    planting_score += 1
                    conditions.append("Moderate wind")
                else:
                    planting_score += 0
                    conditions.append("High winds - avoid planting")
                
                if total_rain > 5:
                    planting_score += 1
                    conditions.append("Rain expected - natural watering")
                
                # Determine overall recommendation
                if planting_score >= 6:
                    recommendation = "Excellent planting day"
                    recommendation_color = "green"
                elif planting_score >= 4:
                    recommendation = "Good planting day"
                    recommendation_color = "blue"
                elif planting_score >= 2:
                    recommendation = "Fair planting day"
                    recommendation_color = "yellow"
                else:
                    recommendation = "Poor planting day"
                    recommendation_color = "red"
                
                processed_forecast.append({
                    'date': day['date'],
                    'temperature': {
                        'average': avg_temp,
                        'min': min_temp,
                        'max': max_temp
                    },
                    'humidity': avg_humidity,
                    'wind_speed': avg_wind,
                    'rain_probability': round(total_rain, 1),
                    'conditions': conditions,
                    'planting_score': planting_score,
                    'recommendation': recommendation,
                    'recommendation_color': recommendation_color
                })
            
            return jsonify({
                "forecast": processed_forecast,
                "city": city,
                "success": True
            })
        else:
            return jsonify({
                "error": f"Weather service error: {forecast_response.status_code}",
                "success": False
            }), forecast_response.status_code
            
    except Exception as e:
        return jsonify({
            "error": f"Error fetching forecast: {str(e)}",
            "success": False
        }), 500

@views.route('/learning-paths')
def learning_paths():
    return jsonify({"message": "Learning paths feature"})

@views.route('/track-plants')
def track_plants():
    return jsonify({"message": "Plant tracking feature"})

@views.route('/gardening-tips')
def gardening_tips():
    return jsonify({"message": "Gardening tips feature"})

@views.route('/notifications')
def notifications():
    return jsonify({"message": "Notifications feature"})

@views.route('/garden', methods=['GET'])
@login_required
def garden():
    # Only regular users can manage gardens
    if hasattr(current_user, 'is_admin') and current_user.is_admin():
        return jsonify({"error": "Only user accounts can access gardens. Please sign in with a user account."}), 403
    # List gardens and plants for the current user
    gardens = Garden.query.filter_by(user_id=current_user.id).all()
    # For each garden, get plants via PlantTracking
    plant_trackings = PlantTracking.query.join(Garden).filter(Garden.user_id == current_user.id).all()
    plants = []
    for pt in plant_trackings:
        plant = Plant.query.get(pt.plant_id)
        if plant:
            # Get the latest image for this plant from grid spaces
            latest_grid_space = GridSpace.query.filter_by(plant_id=plant.id).filter(GridSpace.image_path.isnot(None)).order_by(GridSpace.last_updated.desc()).first()
            latest_image = latest_grid_space.image_path if latest_grid_space else None
            print(f"🌱 Plant {plant.name} (ID: {plant.id}) - Latest image: {latest_image}")
            
            plants.append({
                'tracking': {
                    'id': pt.id,
                    'planting_date': pt.planting_date.isoformat() if pt.planting_date else None
                },
                'plant': {
                    'id': plant.id,
                    'name': plant.name,
                    'type': plant.type,
                    'environment': plant.environment,
                    'care_guide': plant.care_guide,
                    'ideal_soil_type': plant.ideal_soil_type,
                    'watering_frequency': plant.watering_frequency,
                    'fertilizing_frequency': plant.fertilizing_frequency,
                    'pruning_frequency': plant.pruning_frequency,
                    'latest_image': latest_image or plant.image_path
                },
                'garden': {
                    'id': pt.garden.id,
                    'name': pt.garden.name,
                    'garden_type': pt.garden.garden_type,
                    'location_city': pt.garden.location_city,
                    'location_country': pt.garden.location_country
                }
            })
    
    print(f"🌱 Returning {len(plants)} plants to frontend")
    for plant_data in plants:
        print(f"  - {plant_data['plant']['name']} (ID: {plant_data['plant']['id']}) - Image: {plant_data['plant']['latest_image']}")
    
    return jsonify({
        "gardens": [{
            'id': g.id,
            'name': g.name,
            'garden_type': g.garden_type,
            'location_city': g.location_city,
            'location_country': g.location_country,
            'grid_size': getattr(g, 'grid_size', '3x3'),
            'base_grid_spaces': getattr(g, 'base_grid_spaces', 9),
            'additional_spaces_purchased': getattr(g, 'additional_spaces_purchased', 0),
            'total_grid_spaces': getattr(g, 'base_grid_spaces', 9) + getattr(g, 'additional_spaces_purchased', 0),
            'used_grid_spaces': getattr(g, 'used_grid_spaces', 0)
        } for g in gardens],
        "plants": plants
    })

@views.route('/garden/add', methods=['POST'])
@login_required
def add_garden():
    # Only regular users can create gardens
    if hasattr(current_user, 'is_admin') and current_user.is_admin():
        return jsonify({"error": "Admins cannot create gardens. Please use a user account."}), 403
    try:
        data = request.get_json(force=True, silent=True) or {}
        name = data.get('name')
        garden_type = data.get('garden_type')
        location_city = data.get('location_city')
        location_country = data.get('location_country')

        if not name or not garden_type:
            return jsonify({"error": "Name and type are required."}), 400

        # Determine grid size based on subscription plan
        is_premium = getattr(current_user, 'subscribed', False) or getattr(current_user, 'subscription_plan', 'basic') == 'premium'
        grid_size = '6x6' if is_premium else '3x3'
        base_grid_spaces = 36 if is_premium else 9

        garden = Garden(
            user_id=current_user.id,
            name=name,
            garden_type=garden_type,
            location_city=location_city,
            location_country=location_country,
            grid_size=grid_size,
            base_grid_spaces=base_grid_spaces,
            additional_spaces_purchased=0,
            used_grid_spaces=0
        )
        db.session.add(garden)
        db.session.flush()  # Get the garden ID
        
        # Create grid spaces for the garden
        create_grid_spaces_for_garden(garden.id, grid_size)
        
        db.session.commit()

        return jsonify({"success": True, "message": "Garden added successfully!", "garden_id": garden.id})
    except Exception as e:
        db.session.rollback()
        return jsonify({"success": False, "error": str(e)}), 500

@views.route('/garden/edit/<int:garden_id>', methods=['POST'])
@login_required
def edit_garden(garden_id):
    garden = Garden.query.get_or_404(garden_id)
    if garden.user_id != current_user.id:
        return jsonify({"error": "Unauthorized."}), 403
    
    data = request.get_json()
    garden.name = data.get('name')
    garden.garden_type = data.get('garden_type')
    garden.location_city = data.get('location_city')
    garden.location_country = data.get('location_country')
    db.session.commit()
    
    return jsonify({"message": "Garden updated successfully!"})

@views.route('/garden/delete/<int:garden_id>', methods=['POST'])
@login_required
def delete_garden(garden_id):
    try:
        garden = Garden.query.get_or_404(garden_id)
        if garden.user_id != current_user.id:
            return jsonify({"error": "Unauthorized."}), 403
        
        # Clean up related data before deleting garden
        # Remove all plants from grid spaces in this garden
        grid_spaces = GridSpace.query.filter_by(garden_id=garden_id).all()
        for space in grid_spaces:
            if space.plant_id:
                # Remove plant from this space
                space.plant_id = None
                space.planting_date = None
                space.last_watered = None
                space.last_fertilized = None
                space.last_pruned = None
                space.notes = None
                space.image_path = None
                space.care_suggestions = None
                space.last_updated = None
        
        # Delete all grid spaces for this garden
        GridSpace.query.filter_by(garden_id=garden_id).delete()
        
        # Delete all plant trackings for this garden
        PlantTracking.query.filter_by(garden_id=garden_id).delete()
        
        # Delete the garden
        db.session.delete(garden)
        db.session.commit()
        
        return jsonify({"message": "Garden deleted successfully!"})
        
    except Exception as e:
        db.session.rollback()
        print(f"Error deleting garden {garden_id}: {str(e)}")
        return jsonify({"error": f"Failed to delete garden: {str(e)}"}), 500

@views.route('/plant/add', methods=['POST'])
@login_required
def add_plant():
    # Only regular users can add plants to gardens
    if hasattr(current_user, 'is_admin') and current_user.is_admin():
        return jsonify({"error": "Admins cannot add plants. Please use a user account."}), 403
    
    # Check if this is a form data request (with image) or JSON request
    if request.content_type and 'multipart/form-data' in request.content_type:
        # Handle form data with image
        name = request.form.get('name')
        type_ = request.form.get('type')
        environment = request.form.get('environment')
        care_guide = request.form.get('care_guide')
        ideal_soil_type = request.form.get('ideal_soil_type')
        watering_frequency = request.form.get('watering_frequency')
        fertilizing_frequency = request.form.get('fertilizing_frequency')
        pruning_frequency = request.form.get('pruning_frequency')
        garden_id = request.form.get('garden_id')
        planting_date = request.form.get('planting_date')
        
        # Handle image upload
        image_path = None
        if 'image' in request.files:
            file = request.files['image']
            if file and file.filename:
                # Create uploads directory if it doesn't exist
                upload_dir = os.path.join(os.getcwd(), 'uploads', 'plants')
                os.makedirs(upload_dir, exist_ok=True)
                
                # Generate unique filename with proper extension
                import time
                # Get file extension from content type or default to jpg
                content_type = file.content_type
                if content_type and 'image/' in content_type:
                    ext = content_type.split('/')[-1]
                    if ext not in ['jpg', 'jpeg', 'png', 'webp', 'gif']:
                        ext = 'jpg'
                else:
                    ext = 'jpg'
                
                # Clean filename to remove blob references
                original_filename = file.filename or 'image'
                if 'blob' in original_filename.lower():
                    original_filename = 'camera_image'
                
                filename = f"plant_{int(time.time())}_{original_filename}.{ext}"
                file_path = os.path.join(upload_dir, filename)
                file.save(file_path)
                image_path = f"uploads/plants/{filename}"
    else:
        # Handle JSON data
        data = request.get_json()
        name = data.get('name')
        type_ = data.get('type')
        environment = data.get('environment')
        care_guide = data.get('care_guide')
        ideal_soil_type = data.get('ideal_soil_type')
        watering_frequency = data.get('watering_frequency')
        fertilizing_frequency = data.get('fertilizing_frequency')
        pruning_frequency = data.get('pruning_frequency')
        garden_id = data.get('garden_id')
        planting_date = data.get('planting_date')
        image_path = None
    
    if not type_ or not environment or not care_guide or not garden_id or not planting_date:
        return jsonify({"error": "Missing required fields."}), 400

    # Default name to type if not provided
    if not name:
        name = str(type_).strip().title()
    
    plant = Plant(
        name=name, 
        type=type_, 
        environment=environment, 
        care_guide=care_guide, 
        ideal_soil_type=ideal_soil_type, 
        watering_frequency=watering_frequency, 
        fertilizing_frequency=fertilizing_frequency, 
        pruning_frequency=pruning_frequency,
        image_path=image_path
    )
    db.session.add(plant)
    db.session.commit()
    
    tracking = PlantTracking(garden_id=garden_id, plant_id=plant.id, planting_date=planting_date)
    db.session.add(tracking)
    db.session.commit()
    
    return jsonify({"message": "Plant added successfully!", "plant_id": plant.id})

@views.route('/plant/edit/<int:tracking_id>', methods=['POST'])
@login_required
def edit_plant(tracking_id):
    tracking = PlantTracking.query.get_or_404(tracking_id)
    garden = Garden.query.get(tracking.garden_id)
    if garden.user_id != current_user.id:
        return jsonify({"error": "Unauthorized."}), 403
    
    data = request.get_json()
    plant = Plant.query.get(tracking.plant_id)
    if 'name' in data and data.get('name'):
        plant.name = data.get('name')
    if 'type' in data and data.get('type'):
        plant.type = data.get('type')
    if 'environment' in data and data.get('environment'):
        plant.environment = data.get('environment')
    if 'care_guide' in data and data.get('care_guide'):
        plant.care_guide = data.get('care_guide')
    if 'ideal_soil_type' in data:
        plant.ideal_soil_type = data.get('ideal_soil_type')
    if 'watering_frequency' in data:
        plant.watering_frequency = data.get('watering_frequency')
    if 'fertilizing_frequency' in data:
        plant.fertilizing_frequency = data.get('fertilizing_frequency')
    if 'pruning_frequency' in data:
        plant.pruning_frequency = data.get('pruning_frequency')
    if 'planting_date' in data and data.get('planting_date'):
        tracking.planting_date = data.get('planting_date')
    db.session.commit()
    
    return jsonify({"message": "Plant updated successfully!"})

@views.route('/plant/delete/<int:tracking_id>', methods=['POST'])
@login_required
def delete_plant(tracking_id):
    tracking = PlantTracking.query.get_or_404(tracking_id)
    garden = Garden.query.get(tracking.garden_id)
    if garden.user_id != current_user.id:
        return jsonify({"error": "Unauthorized."}), 403
    
    plant_id = tracking.plant_id
    
    # Remove plant from all grid spaces
    grid_spaces = GridSpace.query.filter_by(plant_id=plant_id).all()
    for space in grid_spaces:
        space.plant_id = None
        space.planting_date = None
        space.last_watered = None
        space.last_fertilized = None
        space.last_pruned = None
        space.notes = None
        space.image_path = None
        space.care_suggestions = None
        space.last_updated = None
    
    # Delete the plant record
    plant = Plant.query.get(plant_id)
    if plant:
        db.session.delete(plant)
    
    # Delete the tracking record
    db.session.delete(tracking)
    
    db.session.commit()
    
    return jsonify({"message": "Plant deleted successfully!"})

# Grid Spaces API endpoints
@views.route('/garden/<int:garden_id>/grid-spaces', methods=['GET'])
@login_required
def get_grid_spaces(garden_id):
    """Get all grid spaces for a specific garden"""
    garden = Garden.query.get_or_404(garden_id)
    if garden.user_id != current_user.id:
        return jsonify({"error": "Unauthorized."}), 403
    
    try:
        grid_spaces = GridSpace.query.filter_by(garden_id=garden_id, is_active=True).all()
        spaces_data = []
        
        for space in grid_spaces:
            # Parse care suggestions if available
            care_suggestions = None
            if space.care_suggestions:
                try:
                    import json
                    care_suggestions = json.loads(space.care_suggestions)
                except:
                    care_suggestions = None
            
            spaces_data.append({
                'id': space.id,
                'garden_id': space.garden_id,
                'grid_position': space.grid_position,
                'plant_id': space.plant_id,
                'planting_date': space.planting_date.isoformat() if space.planting_date else None,
                'last_watered': space.last_watered.isoformat() if space.last_watered else None,
                'last_fertilized': space.last_fertilized.isoformat() if space.last_fertilized else None,
                'last_pruned': space.last_pruned.isoformat() if space.last_pruned else None,
                'notes': space.notes,
                'image_path': space.image_path,
                'care_suggestions': care_suggestions,
                'last_updated': space.last_updated.isoformat() if space.last_updated else None,
                'is_active': space.is_active
            })
        
        return jsonify({"grid_spaces": spaces_data})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@views.route('/garden/place-plant', methods=['POST'])
@login_required
def place_plant():
    """Place a plant in a specific grid space"""
    try:
        data = request.get_json()
        space_id = data.get('space_id')
        plant_id = data.get('plant_id')
        planting_date = data.get('planting_date')
        notes = data.get('notes', '')
        
        if not space_id or not plant_id or not planting_date:
            return jsonify({"error": "Missing required fields."}), 400
        
        # Get the grid space
        grid_space = GridSpace.query.get_or_404(space_id)
        garden = Garden.query.get(grid_space.garden_id)
        
        # Check authorization
        if garden.user_id != current_user.id:
            return jsonify({"error": "Unauthorized."}), 403
        
        # Check if space is already occupied
        if grid_space.plant_id:
            return jsonify({"error": "This grid space is already occupied."}), 400
        
        # Update the grid space with plant information
        grid_space.plant_id = plant_id
        grid_space.planting_date = planting_date
        grid_space.notes = notes
        
        db.session.commit()
        
        return jsonify({"message": "Plant placed successfully!"})
        
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@views.route('/garden/remove-plant/<int:space_id>', methods=['POST'])
@login_required
def remove_plant(space_id):
    """Remove a plant from a specific grid space"""
    try:
        grid_space = GridSpace.query.get_or_404(space_id)
        garden = Garden.query.get(grid_space.garden_id)
        
        # Check authorization
        if garden.user_id != current_user.id:
            return jsonify({"error": "Unauthorized."}), 403
        
        # Remove plant from grid space
        grid_space.plant_id = None
        grid_space.planting_date = None
        grid_space.notes = ''
        
        db.session.commit()
        
        return jsonify({"message": "Plant removed successfully!"})
        
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@views.route('/garden/upload-plant-image', methods=['POST'])
@login_required
def upload_plant_image():
    """Upload an image for a planted space"""
    try:
        print("🔄 Starting image upload process...")
        
        space_id = request.form.get('space_id')
        print(f"📋 Space ID: {space_id}")
        if not space_id:
            return jsonify({"error": "Space ID is required."}), 400
        
        grid_space = GridSpace.query.get_or_404(space_id)
        garden = Garden.query.get(grid_space.garden_id)
        if garden.user_id != current_user.id:
            return jsonify({"error": "Unauthorized."}), 403
        
        file = request.files.get('image')
        print(f"📁 File received: {file}")
        if not file:
            return jsonify({"error": "Image file is required."}), 400
        
        # Create uploads directory if it doesn't exist
        upload_dir = os.path.join(os.getcwd(), 'uploads', 'plants')
        print(f"📁 Upload directory: {upload_dir}")
        os.makedirs(upload_dir, exist_ok=True)
        
        # Generate unique filename with proper extension
        import time
        # Get file extension from content type or default to jpg
        content_type = file.content_type
        if content_type and 'image/' in content_type:
            ext = content_type.split('/')[-1]
            if ext not in ['jpg', 'jpeg', 'png', 'webp', 'gif']:
                ext = 'jpg'
        else:
            ext = 'jpg'
        
        filename = f"space_{space_id}_{int(time.time())}.{ext}"
        file_path = os.path.join(upload_dir, filename)
        print(f"💾 File path: {file_path}")
        
        # Save the file
        print("💾 Saving file...")
        file.save(file_path)
        print("✅ File saved successfully!")
        
        # Update grid space with image path
        grid_space.image_path = f"uploads/plants/{filename}"
        print(f"🗄️ Updated image path: {grid_space.image_path}")
        
        # AI Analysis for care suggestions
        import json  # Import json at the beginning of the function
        care_suggestions = {
            "needs_water": False,
            "needs_fertilize": False,
            "needs_prune": False,
            "confidence": 0.0,
            "reasoning": "AI analysis not available"
        }
        
        try:
            openai_key = os.getenv('OPENAI_API_KEY')
            if openai_key:
                print("🤖 Starting AI analysis...")
                
                # Read and base64 encode image for OpenAI Vision
                with open(file_path, 'rb') as img_file:
                    image_bytes = img_file.read()
                    image_b64 = base64.b64encode(image_bytes).decode('utf-8')
                
                # Get plant name for context
                plant_name = "plant"
                if grid_space.plant_id:
                    plant = Plant.query.get(grid_space.plant_id)
                    if plant:
                        plant_name = plant.name
                
                print(f"🌱 Analyzing {plant_name} plant...")
                
                # OpenAI Vision analysis
                try:
                    from openai import OpenAI
                    # Don't set environment variable to avoid conflicts
                    client = OpenAI(api_key=openai_key)
                    print(f"✅ OpenAI client initialized successfully")
                    
                    response = client.chat.completions.create(
                        model="gpt-4o",
                        messages=[
                            {
                                "role": "user",
                                "content": [
                                    {
                                        "type": "text",
                                        "text": f"Analyze this {plant_name} plant image for health issues. Look for mold, rot, disease, spoilage, or any problems. You MUST respond with ONLY valid JSON in this exact format: {{\"needs_water\": true, \"needs_fertilize\": false, \"needs_prune\": false, \"confidence\": 0.8, \"reasoning\": \"description of what you see\"}}. If you see mold, rot, spoilage, or any health issues, set needs_water to true. If plant looks healthy, set needs_water to false. Be very specific about what you see in the image."
                                    },
                                    {
                                        "type": "image_url",
                                        "image_url": {
                                            "url": f"data:image/jpeg;base64,{image_b64}"
                                        }
                                    }
                                ]
                            }
                        ],
                        max_tokens=300
                    )
                    
                    # Parse AI response
                    ai_response = response.choices[0].message.content
                    print(f"🤖 AI Response: {ai_response}")
                    print(f"🌱 Plant being analyzed: {plant_name}")
                    
                    try:
                        # Clean the response before parsing
                        cleaned_response = ai_response.strip()
                        if cleaned_response.startswith('```json'):
                            cleaned_response = cleaned_response.replace('```json', '').replace('```', '').strip()
                        elif cleaned_response.startswith('```'):
                            cleaned_response = cleaned_response.replace('```', '').strip()
                        
                        suggestions = json.loads(cleaned_response)
                        care_suggestions = suggestions
                        # Clean up the reasoning text if it contains JSON formatting
                        if 'reasoning' in care_suggestions and isinstance(care_suggestions['reasoning'], str):
                            reasoning = care_suggestions['reasoning']
                            if '```json' in reasoning or '```' in reasoning:
                                # Extract clean text from reasoning
                                clean_reasoning = reasoning.replace('```json', '').replace('```', '').strip()
                                if clean_reasoning.startswith('{'):
                                    try:
                                        json_data = json.loads(clean_reasoning)
                                        care_suggestions['reasoning'] = json_data.get('reasoning', reasoning)
                                    except:
                                        care_suggestions['reasoning'] = reasoning
                                else:
                                    care_suggestions['reasoning'] = clean_reasoning
                        print(f"✅ AI Analysis completed: {care_suggestions}")
                        
                        # Enhanced health issue detection - check for negative statements first
                        negative_indicators = ['no signs of', 'no visible', 'no evidence of', 'appears healthy', 'looks healthy', 'no mold', 'no rot', 'no spoilage', 'no disease', 'no problems', 'no issues']
                        has_negative_indicators = any(indicator in ai_response.lower() for indicator in negative_indicators)
                        
                        health_issue_phrases = [
                            'mold detected', 'rot detected', 'disease detected', 'spoilage detected',
                            'fungal infection', 'powdery mildew', 'white coating', 'gray coating', 
                            'green coating', 'shriveled fruit', 'wrinkled fruit', 'damaged fruit',
                            'discolored fruit', 'brown spots', 'black spots', 'soft spots',
                            'mushy fruit', 'decay present', 'health issues', 'plant problems',
                            'needs treatment', 'urgent care', 'immediate attention'
                        ]
                        detected_issues = [phrase for phrase in health_issue_phrases if phrase in ai_response.lower()]
                        
                        # Only override if health issues detected AND no negative indicators
                        if detected_issues and not has_negative_indicators:
                            print(f"🚨 AI detected health issues: {detected_issues}")
                            print(f"🚨 Full AI response: {ai_response}")
                            if not care_suggestions.get('needs_water', False):
                                print(f"⚠️ WARNING: AI detected health issues but didn't set needs_water to true!")
                                care_suggestions['needs_water'] = True
                                care_suggestions['reasoning'] = f"URGENT: Health issues detected ({', '.join(detected_issues)}) - {care_suggestions.get('reasoning', '')}"
                                care_suggestions['confidence'] = max(care_suggestions.get('confidence', 0.5), 0.8)  # Increase confidence for health issues
                        elif has_negative_indicators:
                            print(f"✅ AI indicates healthy plant: {ai_response}")
                            # Override to healthy if AI explicitly says no problems
                            care_suggestions['needs_water'] = False
                            # Extract clean reasoning from AI response
                            clean_reasoning = ai_response.replace('```json', '').replace('```', '').strip()
                            if clean_reasoning.startswith('{'):
                                # If it's JSON, extract just the reasoning field
                                try:
                                    json_data = json.loads(clean_reasoning)
                                    clean_reasoning = json_data.get('reasoning', 'Plant appears healthy')
                                except:
                                    clean_reasoning = 'Plant appears healthy'
                            care_suggestions['reasoning'] = clean_reasoning[:200] + ('...' if len(clean_reasoning) > 200 else '')
                            care_suggestions['confidence'] = max(care_suggestions.get('confidence', 0.5), 0.8)
                    except Exception as parse_error:
                        print(f"⚠️ JSON parsing failed: {parse_error}")
                        print(f"🔍 Raw AI response: {ai_response}")
                        
                        # Enhanced fallback with negative statement detection
                        negative_indicators = ['no signs of', 'no visible', 'no evidence of', 'appears healthy', 'looks healthy', 'no mold', 'no rot', 'no spoilage', 'no disease', 'no problems', 'no issues']
                        has_negative_indicators = any(indicator in ai_response.lower() for indicator in negative_indicators)
                        
                        health_issue_phrases = [
                            'mold detected', 'rot detected', 'disease detected', 'spoilage detected',
                            'fungal infection', 'powdery mildew', 'white coating', 'gray coating', 
                            'green coating', 'shriveled fruit', 'wrinkled fruit', 'damaged fruit',
                            'discolored fruit', 'brown spots', 'black spots', 'soft spots',
                            'mushy fruit', 'decay present', 'health issues', 'plant problems',
                            'needs treatment', 'urgent care', 'immediate attention'
                        ]
                        detected_issues = [phrase for phrase in health_issue_phrases if phrase in ai_response.lower()]
                        
                        # Also check for positive health indicators
                        healthy_indicators = ['healthy', 'fresh', 'ripe', 'good condition', 'no problems', 'no issues', 'looks good', 'appears healthy']
                        healthy_detected = [indicator for indicator in healthy_indicators if indicator in ai_response.lower()]
                        
                        # Priority: negative indicators override everything
                        if has_negative_indicators:
                            print(f"✅ Fallback: Detected negative indicators (healthy): {[ind for ind in negative_indicators if ind in ai_response.lower()]}")
                            # Extract clean reasoning from AI response
                            clean_reasoning = ai_response.replace('```json', '').replace('```', '').strip()
                            if clean_reasoning.startswith('{'):
                                # If it's JSON, extract just the reasoning field
                                try:
                                    json_data = json.loads(clean_reasoning)
                                    clean_reasoning = json_data.get('reasoning', 'Plant appears healthy')
                                except:
                                    clean_reasoning = 'Plant appears healthy'
                            care_suggestions = {
                                "needs_water": False,
                                "needs_fertilize": False, 
                                "needs_prune": False,
                                "confidence": 0.8,
                                "reasoning": clean_reasoning[:200] + ('...' if len(clean_reasoning) > 200 else '')
                            }
                        elif detected_issues and not healthy_detected:
                            print(f"🚨 Fallback: Detected health issues in response: {detected_issues}")
                            care_suggestions = {
                                "needs_water": True,
                                "needs_fertilize": False, 
                                "needs_prune": False,
                                "confidence": 0.8,
                                "reasoning": f"URGENT: Health issues detected ({', '.join(detected_issues)}) - {ai_response[:200]}..."
                            }
                        elif healthy_detected:
                            print(f"✅ Fallback: Detected healthy indicators: {healthy_detected}")
                            # Extract clean reasoning from AI response
                            clean_reasoning = ai_response.replace('```json', '').replace('```', '').strip()
                            if clean_reasoning.startswith('{'):
                                # If it's JSON, extract just the reasoning field
                                try:
                                    json_data = json.loads(clean_reasoning)
                                    clean_reasoning = json_data.get('reasoning', 'Plant appears healthy')
                                except:
                                    clean_reasoning = 'Plant appears healthy'
                            care_suggestions = {
                                "needs_water": False,
                                "needs_fertilize": False, 
                                "needs_prune": False,
                                "confidence": 0.7,
                                "reasoning": clean_reasoning[:200] + ('...' if len(clean_reasoning) > 200 else '')
                            }
                        else:
                            care_suggestions = {
                                "needs_water": False,
                                "needs_fertilize": False, 
                                "needs_prune": False,
                                "confidence": 0.3,
                                "reasoning": f"AI analysis completed but response format unclear: {ai_response[:100]}..."
                            }
                        
                except Exception as openai_error:
                    print(f"❌ OpenAI client error: {openai_error}")
                    print(f"❌ Error type: {type(openai_error).__name__}")
                    care_suggestions = {
                        "needs_water": False,
                        "needs_fertilize": False, 
                        "needs_prune": False,
                        "confidence": 0.0,
                        "reasoning": f"AI analysis failed: {str(openai_error)}"
                    }
            else:
                print("⚠️ OpenAI API key not configured")
                care_suggestions = {
                    "needs_water": False,
                    "needs_fertilize": False,
                    "needs_prune": False, 
                    "confidence": 0.0,
                    "reasoning": "OpenAI API key not configured"
                }
        except Exception as ai_error:
            print(f"❌ AI analysis error: {ai_error}")
            care_suggestions = {
                "needs_water": False,
                "needs_fertilize": False,
                "needs_prune": False,
                "confidence": 0.0,
                "reasoning": f"AI analysis failed: {str(ai_error)}"
            }
        
        # Store care suggestions in grid space
        grid_space.care_suggestions = json.dumps(care_suggestions)
        grid_space.last_updated = datetime.now(timezone.utc)
        print(f"🗄️ Stored care suggestions: {care_suggestions}")
        print(f"📅 Updated last_updated timestamp")
        
        print("💾 Committing to database...")
        db.session.commit()
        print("✅ Database commit successful!")
        
        print("🎉 Upload process completed successfully!")
        return jsonify({
            "message": "Image uploaded successfully!", 
            "image_path": grid_space.image_path,
            "care_suggestions": care_suggestions
        })
    except Exception as e:
        print(f"❌ Error in upload process: {str(e)}")
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@views.route('/garden/update-plant-care', methods=['POST'])
@login_required
def update_plant_care():
    """Update plant care activities (water, fertilize, prune)"""
    try:
        data = request.get_json()
        space_id = data.get('space_id')
        action = data.get('action')
        date = data.get('date')
        
        if not space_id or not action:
            return jsonify({"error": "Space ID and action are required."}), 400
        
        grid_space = GridSpace.query.get_or_404(space_id)
        garden = Garden.query.get(grid_space.garden_id)
        if garden.user_id != current_user.id:
            return jsonify({"error": "Unauthorized."}), 403
        
        # Update the appropriate field based on action
        if action == 'water':
            grid_space.last_watered = date
        elif action == 'fertilize':
            grid_space.last_fertilized = date
        elif action == 'prune':
            grid_space.last_pruned = date
        else:
            return jsonify({"error": "Invalid action. Must be 'water', 'fertilize', or 'prune'."}), 400
        
        # Update the last_updated timestamp
        grid_space.last_updated = datetime.now(timezone.utc)
        
        db.session.commit()
        
        return jsonify({"message": f"Plant {action}ed successfully!"})
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@views.route('/uploads/<path:filename>')
def uploaded_file(filename):
    """Serve uploaded files"""
    return send_from_directory(os.path.join(os.getcwd(), 'uploads'), filename)

@views.route('/smart-alerts')
@login_required
def smart_alerts():
    # Get user's plants and generate alerts based on care schedules
    plant_trackings = PlantTracking.query.join(Garden).filter(Garden.user_id == current_user.id).all()
    
    alerts = []
    today = datetime.now().date()
    
    for pt in plant_trackings:
        plant = Plant.query.get(pt.plant_id)
        if not plant:
            continue
            
        # Check watering schedule
        if plant.watering_frequency:
            days_since_watered = (today - pt.last_watered).days if pt.last_watered else 999
            if days_since_watered >= plant.watering_frequency:
                alerts.append({
                    'id': f"water_{pt.id}",
                    'type': 'watering',
                    'plant_name': plant.name,
                    'garden_name': pt.garden.name,
                    'message': f'Time to water your {plant.name}',
                    'due_date': (pt.last_watered + timedelta(days=plant.watering_frequency)).isoformat() if pt.last_watered else today.isoformat(),
                    'priority': 'high' if days_since_watered > plant.watering_frequency + 2 else 'medium',
                    'status': 'overdue' if days_since_watered > plant.watering_frequency else 'pending'
                })
        
        # Check fertilizing schedule
        if plant.fertilizing_frequency:
            days_since_fertilized = (today - pt.last_fertilized).days if pt.last_fertilized else 999
            if days_since_fertilized >= plant.fertilizing_frequency:
                alerts.append({
                    'id': f"fertilize_{pt.id}",
                    'type': 'fertilizing',
                    'plant_name': plant.name,
                    'garden_name': pt.garden.name,
                    'message': f'Your {plant.name} needs fertilizer',
                    'due_date': (pt.last_fertilized + timedelta(days=plant.fertilizing_frequency)).isoformat() if pt.last_fertilized else today.isoformat(),
                    'priority': 'medium',
                    'status': 'overdue' if days_since_fertilized > plant.fertilizing_frequency else 'pending'
                })
        
        # Check pruning schedule
        if plant.pruning_frequency:
            days_since_pruned = (today - pt.last_pruned).days if pt.last_pruned else 999
            if days_since_pruned >= plant.pruning_frequency:
                alerts.append({
                    'id': f"prune_{pt.id}",
                    'type': 'pruning',
                    'plant_name': plant.name,
                    'garden_name': pt.garden.name,
                    'message': f'Time to prune your {plant.name}',
                    'due_date': (pt.last_pruned + timedelta(days=plant.pruning_frequency)).isoformat() if pt.last_pruned else today.isoformat(),
                    'priority': 'low',
                    'status': 'overdue' if days_since_pruned > plant.pruning_frequency else 'pending'
                })
    
    return jsonify({"alerts": alerts})

@views.route('/features')
@login_required
def features():
    return jsonify({"message": "Features feature"})

@views.route('/about')
def about():
    return jsonify({"message": "About feature"})

@views.route('/admin/reports')
@login_required
def admin_reports():
    if not current_user.is_admin():
        return jsonify({"error": "Access denied. Admin privileges required."}), 403
    
    # Get statistics for reports
    total_users = User.query.count()
    active_users = User.query.filter_by(is_active=True).count()
    subscribed_users = User.query.filter_by(subscribed=True).count()
    total_admins = Admin.query.count()
    
    # Get recent user registrations
    recent_users = User.query.order_by(User.created_at.desc()).limit(10).all()
    
    # Get user activity data (placeholder for now)
    user_activity = {
        'daily': 45,
        'weekly': 320,
        'monthly': 1200
    }
    
    return jsonify({
        "message": "Admin reports",
        "stats": {
            "total_users": total_users,
            "active_users": active_users,
            "subscribed_users": subscribed_users,
            "total_admins": total_admins,
            "recent_users": [{"id": u.id, "email": u.email, "full_name": u.full_name} for u in recent_users],
            "user_activity": user_activity
        }
    })

@views.route('/admin/feedback')
@login_required
def admin_feedback():
    if not current_user.is_admin():
        return jsonify({"error": "Access denied. Admin privileges required."}), 403
    
    # Get feedback data (placeholder for now)
    feedback_list = [
        {
            'id': 1,
            'user_email': 'john.doe@example.com',
            'subject': 'Bug Report',
            'message': 'The camera feature is not working properly on mobile devices.',
            'status': 'pending',
            'created_at': datetime.now().isoformat()
        },
        {
            'id': 2,
            'user_email': 'jane.smith@example.com',
            'subject': 'Feature Request',
            'message': 'Would love to have more plant varieties in the database.',
            'status': 'reviewed',
            'created_at': datetime.now().isoformat()
        },
        {
            'id': 3,
            'user_email': 'mike.wilson@example.com',
            'subject': 'General Inquiry',
            'message': 'How do I reset my password?',
            'status': 'resolved',
            'created_at': datetime.now().isoformat()
        }
    ]
    
    return jsonify({"feedback_list": feedback_list})

@views.route('/admin/feedback/<int:feedback_id>/update', methods=['POST'])
@login_required
def update_feedback_status(feedback_id):
    if not current_user.is_admin():
        return jsonify({"error": "Access denied. Admin privileges required."}), 403
    
    data = request.get_json()
    status = data.get('status')
    # Here you would update the feedback status in the database
    # For now, just flash a message
    return jsonify({"message": f"Feedback status updated to {status}."})

@views.route('/admin/system-content')
@login_required
def admin_system_content():
    if not current_user.is_admin():
        return jsonify({"error": "Access denied. Admin privileges required."}), 403
    
    # Placeholder data for system content management
    ai_data = {
        'plant_recognition_model': 'v2.1',
        'last_updated': '2024-01-15',
        'accuracy': '94.5%',
        'total_plants': 1500
    }
    
    learning_paths = [
        {'id': 1, 'name': 'Beginner Gardening', 'status': 'active', 'users': 45},
        {'id': 2, 'name': 'Intermediate Techniques', 'status': 'active', 'users': 23},
        {'id': 3, 'name': 'Advanced Horticulture', 'status': 'draft', 'users': 0}
    ]
    
    seasonal_content = [
        {'season': 'Spring', 'status': 'published', 'last_updated': '2024-03-01'},
        {'season': 'Summer', 'status': 'published', 'last_updated': '2024-06-01'},
        {'season': 'Fall', 'status': 'draft', 'last_updated': '2024-09-01'},
        {'season': 'Winter', 'status': 'draft', 'last_updated': '2024-12-01'}
    ]
    
    notification_templates = [
        {'id': 1, 'name': 'Watering Reminder', 'status': 'active'},
        {'id': 2, 'name': 'Fertilizing Schedule', 'status': 'active'},
        {'id': 3, 'name': 'Seasonal Tips', 'status': 'active'},
        {'id': 4, 'name': 'New Feature Alert', 'status': 'draft'}
    ]
    
    return jsonify({
        "message": "Admin system content",
        "ai_data": ai_data,
        "learning_paths": learning_paths,
        "seasonal_content": seasonal_content,
        "notification_templates": notification_templates
    })

@views.route('/admin/ai-data', methods=['GET', 'POST'])
@login_required
def admin_ai_data():
    if not current_user.is_admin():
        return jsonify({"error": "Access denied. Admin privileges required."}), 403
    
    if request.method == 'POST':
        # Handle AI data updates
        return jsonify({"message": "AI data updated successfully!"})
    
    return jsonify({"message": "Admin AI data"})

@views.route('/admin/learning-paths', methods=['GET', 'POST'])
@login_required
def admin_learning_paths():
    if not current_user.is_admin():
        return jsonify({"error": "Access denied. Admin privileges required."}), 403
    
    if request.method == 'POST':
        # Handle learning path updates
        return jsonify({"message": "Learning paths updated successfully!"})
    
    return jsonify({"message": "Admin learning paths"})

@views.route('/admin/notifications', methods=['GET', 'POST'])
@login_required
def admin_notifications():
    if not current_user.is_admin():
        return jsonify({"error": "Access denied. Admin privileges required."}), 403
    
    if request.method == 'POST':
        # Handle notification template updates
        return jsonify({"message": "Notification templates updated successfully!"})
    
    return jsonify({"message": "Admin notifications"})

@views.route('/admin/seasonal-planning', methods=['GET', 'POST'])
@login_required
def admin_seasonal_planning():
    if not current_user.is_admin():
        return jsonify({"error": "Access denied. Admin privileges required."}), 403
    
    if request.method == 'POST':
        # Handle seasonal content updates
        return jsonify({"message": "Seasonal content updated successfully!"})
    
    return jsonify({"message": "Admin seasonal planning"})

@views.route('/admin/rollback-content', methods=['GET', 'POST'])
@login_required
def admin_rollback_content():
    if not current_user.is_admin():
        return jsonify({"error": "Access denied. Admin privileges required."}), 403
    
    if request.method == 'POST':
        # Handle content rollback
        return jsonify({"message": "Content rollback completed successfully!"})
    
    return jsonify({"message": "Admin rollback content"})

@views.route('/admin/users')
@login_required
def admin_users():
    if not current_user.is_admin():
        return jsonify({"error": "Access denied. Admin privileges required."}), 403
    
    users = User.query.all()
    return jsonify({
        "users": [{
            "id": u.id,
            "email": u.email,
            "full_name": u.full_name,
            "contact": u.contact,
            "role": u.role,
            "is_active": u.is_active,
            "created_at": u.created_at.isoformat() if u.created_at else None
        } for u in users]
    })

@views.route('/admin/users/<int:user_id>/status', methods=['PUT'])
@login_required
def admin_user_status(user_id):
    if not current_user.is_admin():
        return jsonify({"error": "Access denied. Admin privileges required."}), 403
    
    data = request.get_json()
    is_active = data.get('is_active')
    
    user = User.query.get_or_404(user_id)
    user.is_active = is_active
    db.session.commit()
    
    return jsonify({"message": f"User status updated successfully"})

@views.route('/admin/users/<int:user_id>', methods=['DELETE'])
@login_required
def admin_delete_user(user_id):
    if not current_user.is_admin():
        return jsonify({"error": "Access denied. Admin privileges required."}), 403
    
    user = User.query.get_or_404(user_id)
    db.session.delete(user)
    db.session.commit()
    
    return jsonify({"message": "User deleted successfully"})

@views.route('/admin/feedbacks')
@login_required
def admin_feedbacks():
    if not current_user.is_admin():
        return jsonify({"error": "Access denied. Admin privileges required."}), 403
    
    # This would typically come from a Feedback model
    # For now, returning placeholder data
    feedbacks = [
        {
            "id": 1,
            "subject": "Camera feature not working",
            "message": "The camera feature is not working properly on mobile devices.",
            "status": "pending",
            "user": {"full_name": "John Doe", "email": "john@example.com"},
            "created_at": datetime.now().isoformat()
        },
        {
            "id": 2,
            "subject": "More plant varieties needed",
            "message": "Would love to have more plant varieties in the database.",
            "status": "in_progress",
            "user": {"full_name": "Jane Smith", "email": "jane@example.com"},
            "created_at": datetime.now().isoformat()
        }
    ]
    
    return jsonify({"feedbacks": feedbacks})

@views.route('/admin/feedbacks/<int:feedback_id>/status', methods=['PUT'])
@login_required
def admin_feedback_status(feedback_id):
    if not current_user.is_admin():
        return jsonify({"error": "Access denied. Admin privileges required."}), 403
    
    data = request.get_json()
    status = data.get('status')
    
    # This would typically update a Feedback model
    # For now, just return success
    
    return jsonify({"message": "Feedback status updated successfully"})

@views.route('/feedback/submit', methods=['POST'])
@login_required
def submit_feedback():
    data = request.get_json()
    subject = data.get('subject')
    message = data.get('message')
    rating = data.get('rating', 5)
    category = data.get('category', 'general')
    
    if not subject or not message:
        return jsonify({"error": "Subject and message are required."}), 400
    
    # This would typically save to a Feedback model
    # For now, just return success
    
    return jsonify({"success": True, "message": "Feedback submitted successfully!"})

@views.route('/feedback/user')
@login_required
def user_feedbacks():
    # This would typically fetch from a Feedback model
    # For now, returning placeholder data
    feedbacks = [
        {
            "id": 1,
            "subject": "Great app!",
            "message": "Really enjoying using eGrowtify for my garden management.",
            "rating": 5,
            "category": "general",
            "status": "resolved",
            "admin_response": "Thank you for your feedback! We're glad you're enjoying the app.",
            "created_at": datetime.now().isoformat()
        }
    ]
    
    return jsonify({"feedbacks": feedbacks})

@views.route('/api/weather')
@login_required
def get_weather():
    # Simple rate limiting - prevent too many requests
    import threading
    if not hasattr(get_weather, '_last_request_time'):
        get_weather._last_request_time = 0
    
    current_time = time.time()
    if current_time - get_weather._last_request_time < 2:  # 2 seconds minimum between requests
        print(f"🌤️ Weather API rate limited - too soon since last request")
        return jsonify({
            "error": "Rate limited - please wait before making another request",
            "success": False
        }), 429
    
    get_weather._last_request_time = current_time
    
    """Get weather data for a specific city using OpenWeatherMap API"""
    try:
        city = request.args.get('city', 'Cebu')
        current_time = time.time()
        
        # Check cache first
        cache_key = f"weather_{city.lower()}"
        if cache_key in _WEATHER_CACHE:
            cached_data, cache_time = _WEATHER_CACHE[cache_key]
            if current_time - cache_time < _WEATHER_CACHE_TTL_SECONDS:
                print(f"🌤️ Weather cache hit for {city} (cached {int(current_time - cache_time)}s ago)")
                return jsonify(cached_data)
            else:
                # Cache expired, remove it
                del _WEATHER_CACHE[cache_key]
        
        
        api_key = os.getenv('OPENWEATHER_API_KEY')
        
        if not api_key:
            # Return mock data if API key is not available
            mock_data = {
                "temperature": 28,
                "humidity": 75,
                "description": "Partly cloudy",
                "windSpeed": 12,
                "visibility": 10,
                "city": city,
                "mock": True
            }
            # Cache mock data too
            _WEATHER_CACHE[cache_key] = (mock_data, current_time)
            return jsonify(mock_data)
        
        # Make request to OpenWeatherMap API
        url = f"http://api.openweathermap.org/data/2.5/weather"
        params = {
            'q': city,
            'appid': api_key,
            'units': 'metric'
        }
        
        response = requests.get(url, params=params, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            weather_data = {
                "temperature": round(data['main']['temp']),
                "humidity": data['main']['humidity'],
                "description": data['weather'][0]['description'],
                "windSpeed": round(data['wind']['speed'] * 3.6),  # Convert m/s to km/h
                "visibility": round(data.get('visibility', 10000) / 1000),  # Convert m to km
                "city": data['name'],
                "country": data['sys']['country'],
                "mock": False,
                "success": True
            }
            # Cache the successful response
            _WEATHER_CACHE[cache_key] = (weather_data, current_time)
            print(f"🌤️ Weather data cached for {city}")
            return jsonify(weather_data)
        elif response.status_code == 404:
            # City not found
            return jsonify({
                "error": "City not found. Please check the spelling and try again.",
                "success": False,
                "city": city
            }), 404
        else:
            # Other API errors
            return jsonify({
                "error": f"Weather service temporarily unavailable (Error {response.status_code})",
                "success": False,
                "city": city
            }), response.status_code
            
    except Exception as e:
        # Return mock data if any error occurs
        mock_data = {
            "temperature": 28,
            "humidity": 75,
            "description": "Partly cloudy",
            "windSpeed": 12,
            "visibility": 10,
            "city": city,
            "mock": True,
            "error": str(e)
        }
        # Cache mock data too
        _WEATHER_CACHE[cache_key] = (mock_data, current_time)
        return jsonify(mock_data)

# Additional Admin API endpoints for the new admin panel
@views.route('/api/admin/stats')
@login_required
def admin_api_stats():
    if not current_user.is_admin():
        return jsonify({"error": "Admin access required"}), 403
    
    try:
        # Get basic statistics
        total_users = User.query.count()
        active_users = User.query.filter_by(is_active=True).count()
        
        # Mock data for now - in a real app, you'd query actual feedback and system health
        total_feedback = 0  # Would query feedback table
        system_health = "Good"
        
        return jsonify({
            "totalUsers": total_users,
            "activeUsers": active_users,
            "subscribedUsers": User.query.filter_by(subscribed=True).count()
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@views.route('/api/admin/users')
@login_required
def admin_api_users():
    if not current_user.is_admin():
        return jsonify({"error": "Admin access required"}), 403
    
    try:
        users = User.query.all()
        users_data = []
        for user in users:
            users_data.append({
                "id": user.id,
                "email": user.email,
                "firstname": user.firstname,
                "lastname": user.lastname,
                "full_name": user.full_name,
                "contact": user.contact,
                "role": user.role,
                "is_active": user.is_active,
                "email_verified": user.email_verified,
                "subscribed": user.subscribed,
                "learning_level": user.learning_level,
                "created_at": user.created_at.isoformat() if user.created_at else None,
                "updated_at": user.updated_at.isoformat() if user.updated_at else None
            })
        return jsonify(users_data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@views.route('/api/admin/users/<int:user_id>', methods=['DELETE'])
@login_required
def admin_api_delete_user(user_id):
    if not current_user.is_admin():
        return jsonify({"error": "Admin access required"}), 403
    
    try:
        user = User.query.get_or_404(user_id)
        if user.role == 'admin' and user.id != current_user.id:
            return jsonify({"error": "Cannot delete other admin users"}), 403
        
        db.session.delete(user)
        db.session.commit()
        return jsonify({"message": "User deleted successfully"})
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@views.route('/api/admin/users/<int:user_id>/status', methods=['PATCH'])
@login_required
def admin_api_toggle_user_status(user_id):
    if not current_user.is_admin():
        return jsonify({"error": "Admin access required"}), 403
    
    try:
        user = User.query.get_or_404(user_id)
        if user.role == 'admin' and user.id != current_user.id:
            return jsonify({"error": "Cannot modify other admin users"}), 403
        
        data = request.get_json()
        user.is_active = data.get('is_active', not user.is_active)
        db.session.commit()
        return jsonify({"message": "User status updated successfully"})
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@views.route('/api/admin/users/<int:user_id>/subscription', methods=['PATCH'])
@login_required
def admin_api_toggle_user_subscription(user_id):
    if not current_user.is_admin():
        return jsonify({"error": "Admin access required"}), 403
    
    try:
        user = User.query.get_or_404(user_id)
        if user.role == 'admin':
            return jsonify({"error": "Cannot modify admin user subscriptions"}), 403
        
        data = request.get_json()
        user.subscribed = data.get('subscribed', not user.subscribed)
        
        # Update subscription plan based on subscription status
        if user.subscribed:
            user.subscription_plan = 'premium'
        else:
            user.subscription_plan = 'basic'
            
        db.session.commit()
        return jsonify({"message": "User subscription updated successfully"})
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@views.route('/api/admin/learning-paths')
@login_required
def admin_api_learning_paths():
    if not current_user.is_admin():
        return jsonify({"error": "Admin access required"}), 403
    
    # Real learning paths data based on actual learning path files
    learning_paths = [
                    {
                        "id": 1,
                        "title": "Beginner Gardener",
                        "description": "Perfect for those just starting their gardening journey. Learn plant basics, soil compatibility, and essential gardening skills.",
                        "modules_count": 11,  # Based on actual modules in BeginnerLearningPath.jsx
                        "difficulty": "Beginner",
                        "duration": "4 weeks",
                        "is_active": True,
                        "created_at": "2024-01-15T10:00:00Z"
                    },
        {
            "id": 2,
            "title": "Intermediate Gardener", 
            "description": "For gardeners ready to take their skills to the next level. Advanced plant care, nutrition, and soil science.",
            "modules_count": 2,  # Based on actual modules in IntermediateLearningPath.jsx
            "difficulty": "Intermediate",
            "duration": "6 weeks",
            "is_active": True,
            "created_at": "2024-01-20T14:30:00Z"
        },
        {
            "id": 3,
            "title": "Expert Gardener",
            "description": "Advanced techniques for experienced gardeners. Professional pruning, soil analysis, and master-level skills.",
            "modules_count": 2,  # Based on actual modules in ExpertLearningPath.jsx
            "difficulty": "Expert",
            "duration": "8 weeks",
            "is_active": True,
            "created_at": "2024-01-25T09:15:00Z"
        }
    ]
    return jsonify(learning_paths)

@views.route('/api/admin/ai-data')
@login_required
def admin_api_ai_data():
    if not current_user.is_admin():
        return jsonify({"error": "Admin access required"}), 403
    
    # Mock data for AI recognition data
    ai_data = [
        {
            "id": 1,
            "name": "Plant Recognition Model",
            "description": "AI model for identifying plant species",
            "type": "Plant Recognition",
            "accuracy": 94.5,
            "updated_at": datetime.now().isoformat()
        },
        {
            "id": 2,
            "name": "Disease Detection Model",
            "description": "AI model for detecting plant diseases",
            "type": "Disease Detection", 
            "accuracy": 89.2,
            "updated_at": datetime.now().isoformat()
        }
    ]
    return jsonify(ai_data)

@views.route('/api/admin/notifications')
@login_required
def admin_api_notifications():
    if not current_user.is_admin():
        return jsonify({"error": "Admin access required"}), 403
    
    # Mock data for system notifications
    notifications = [
        {
            "id": 1,
            "title": "System Maintenance",
            "message": "Scheduled maintenance will occur tonight at 2 AM",
            "type": "System",
            "priority": "Medium",
            "is_active": True
        },
        {
            "id": 2,
            "title": "New Feature Release",
            "message": "AI Plant Recognition has been updated with new species",
            "type": "Feature",
            "priority": "Low",
            "is_active": True
        }
    ]
    return jsonify(notifications)

@views.route('/api/admin/seasonal-content')
@login_required
def admin_api_seasonal_content():
    if not current_user.is_admin():
        return jsonify({"error": "Admin access required"}), 403
    
    # Mock data for seasonal content
    seasonal_content = [
        {
            "id": 1,
            "season": "Spring",
            "description": "Spring planting guide and tips",
            "month": "March",
            "region": "Northern Hemisphere",
            "updated_at": datetime.now().isoformat()
        },
        {
            "id": 2,
            "season": "Summer",
            "description": "Summer garden maintenance",
            "month": "June",
            "region": "Northern Hemisphere", 
            "updated_at": datetime.now().isoformat()
        }
    ]
    return jsonify(seasonal_content)

@views.route('/api/admin/feedback')
@login_required
def admin_api_feedback():
    if not current_user.is_admin():
        return jsonify({"error": "Admin access required"}), 403
    
    # Mock data for feedback - in a real app, you'd have a Feedback model
    feedback = [
        {
            "id": 1,
            "user_name": "John Doe",
            "user_email": "john@example.com",
            "message": "Great app! The AI recognition feature is very helpful.",
            "rating": 5,
            "status": "new",
            "created_at": datetime.now().isoformat()
        },
        {
            "id": 2,
            "user_name": "Jane Smith",
            "user_email": "jane@example.com", 
            "message": "Could you add more plant species to the recognition?",
            "rating": 4,
            "status": "read",
            "created_at": datetime.now().isoformat()
        }
    ]
    return jsonify(feedback)

@views.route('/api/admin/reports')
@login_required
def admin_api_reports():
    if not current_user.is_admin():
        return jsonify({"error": "Admin access required"}), 403
    
    # Mock data for reports
    reports = []
    return jsonify(reports)

@views.route('/api/admin/reports/generate', methods=['POST'])
@login_required
def admin_api_generate_report():
    if not current_user.is_admin():
        return jsonify({"error": "Admin access required"}), 403
    
    try:
        data = request.get_json()
        report_type = data.get('type')
        date_range = data.get('dateRange', '30d')
        
        # Mock report generation
        report = {
            "id": 1,
            "name": f"{report_type.replace('-', ' ').title()} Report",
            "description": f"Generated report for {report_type} covering {date_range}",
            "type": report_type,
            "size": "2.3 MB",
            "created_at": datetime.now().isoformat()
        }
        
        return jsonify({"message": "Report generated successfully", "report": report})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@views.route('/api/admin/rollback/<content_type>/<int:content_id>', methods=['POST'])
@login_required
def admin_api_rollback_content(content_type, content_id):
    if not current_user.is_admin():
        return jsonify({"error": "Admin access required"}), 403
    
    try:
        # Mock rollback functionality
        return jsonify({"message": f"Content {content_type} with ID {content_id} rolled back successfully"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Additional admin endpoints for new pages
@views.route('/api/admin/subscription/stats')
@login_required
def admin_api_subscription_stats():
    if not current_user.is_admin():
        return jsonify({"error": "Admin access required"}), 403
    
    try:
        total_subscribers = User.query.filter_by(subscribed=True).count()
        active_subscriptions = User.query.filter_by(subscribed=True, is_active=True).count()
        monthly_revenue = total_subscribers * 9.99  # Mock calculation
        total_users = User.query.count()
        subscription_rate = (total_subscribers / total_users * 100) if total_users > 0 else 0
        
        return jsonify({
            "totalSubscribers": total_subscribers,
            "activeSubscriptions": active_subscriptions,
            "monthlyRevenue": round(monthly_revenue, 2),
            "subscriptionRate": round(subscription_rate, 1)
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@views.route('/api/admin/subscription/subscribers')
@login_required
def admin_api_subscription_subscribers():
    if not current_user.is_admin():
        return jsonify({"error": "Admin access required"}), 403
    
    try:
        users = User.query.all()
        subscribers_data = []
        for user in users:
            subscribers_data.append({
                "id": user.id,
                "email": user.email,
                "firstname": user.firstname,
                "lastname": user.lastname,
                "full_name": user.full_name,
                "subscribed": user.subscribed,
                "is_active": user.is_active,
                "created_at": user.created_at.isoformat() if user.created_at else None
            })
        return jsonify(subscribers_data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@views.route('/api/admin/subscription/<int:user_id>/toggle', methods=['PATCH'])
@login_required
def admin_api_toggle_subscription(user_id):
    if not current_user.is_admin():
        return jsonify({"error": "Admin access required"}), 403
    
    try:
        user = User.query.get_or_404(user_id)
        data = request.get_json()
        user.subscribed = data.get('subscribed', not user.subscribed)
        db.session.commit()
        return jsonify({"message": "Subscription status updated successfully"})
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

# Learning Path Management API endpoints
# Note: Learning paths are fixed (Beginner, Intermediate, Expert) - no creation/deletion

@views.route('/api/admin/learning-paths/<int:path_id>', methods=['PUT'])
@login_required
def admin_api_update_learning_path(path_id):
    if not current_user.is_admin():
        return jsonify({"error": "Admin access required"}), 403
    
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['title', 'description', 'difficulty', 'duration', 'modules_count']
        for field in required_fields:
            if not data.get(field):
                return jsonify({"error": f"Missing required field: {field}"}), 400
        
        # In a real app, you would:
        # 1. Update the LearningPath record in the database
        # 2. Update the corresponding learning path file (BeginnerLearningPath.jsx, etc.)
        # 3. Sync the changes with the user interface
        # 4. Clear any cached data
        
        # For now, return success with the updated learning path data
        learning_path = {
            "id": path_id,
            "title": data.get('title'),
            "description": data.get('description'),
            "difficulty": data.get('difficulty'),
            "duration": data.get('duration'),
            "modules_count": data.get('modules_count'),
            "is_active": data.get('is_active', True),
            "video": data.get('video'),
            "updated_at": datetime.now().isoformat()
        }
        
        # TODO: In a real implementation, you would:
        # - Update database record
        # - Update the corresponding learning path file
        # - Clear user progress cache if needed
        # - Notify users of content updates
        
        return jsonify({
            "message": "Learning path updated successfully", 
            "learning_path": learning_path,
            "note": "In production, this would update the actual learning path files and database"
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Learning paths cannot be deleted - they are fixed (Beginner, Intermediate, Expert)

@views.route('/api/admin/learning-paths/<int:path_id>/status', methods=['PATCH'])
@login_required
def admin_api_toggle_learning_path_status(path_id):
    if not current_user.is_admin():
        return jsonify({"error": "Admin access required"}), 403
    
    try:
        data = request.get_json()
        
        # In a real app, you would:
        # 1. Update the LearningPath status in the database
        # 2. Update the corresponding learning path file
        # 3. Notify users if the path becomes inactive
        # 4. Handle user progress if path is deactivated
        
        return jsonify({
            "message": "Learning path status updated successfully",
            "note": "In production, this would update the database and notify affected users"
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@views.route('/api/admin/upload', methods=['POST'])
@login_required
def admin_api_upload_file():
    if not current_user.is_admin():
        return jsonify({"error": "Admin access required"}), 403
    
    try:
        if 'file' not in request.files:
            return jsonify({"error": "No file provided"}), 400
        
        file = request.files['file']
        file_type = request.form.get('type', 'unknown')
        
        if file.filename == '':
            return jsonify({"error": "No file selected"}), 400
        
        # Mock file upload - in a real app, you'd save the file and return the URL
        import uuid
        filename = f"{uuid.uuid4()}_{file.filename}"
        file_url = f"/uploads/{file_type}/{filename}"
        
        return jsonify({
            "message": "File uploaded successfully",
            "fileUrl": file_url,
            "filename": filename
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@views.route('/api/admin/create-user', methods=['POST'])
@login_required
def admin_create_user():
    if not current_user.is_admin():
        return jsonify({"error": "Admin access required"}), 403
    
    try:
        data = request.get_json()
        email = data.get('email')
        firstname = data.get('firstname')
        lastname = data.get('lastname')
        contact = data.get('contact')
        password = data.get('password')
        
        # Validation
        if not email or not firstname or not lastname or not contact or not password:
            return jsonify({"success": False, "message": "All fields are required"}), 400
        
        if len(password) < 7:
            return jsonify({"success": False, "message": "Password must be at least 7 characters"}), 400
        
        if User.query.filter_by(email=email).first():
            return jsonify({"success": False, "message": "Email already exists"}), 400
        
        # Create new user
        new_user = User(
            email=email,
            firstname=firstname,
            lastname=lastname,
            contact=contact,
            is_active=True,  # Admin-created users are immediately active
            email_verified=True  # Admin-created users are pre-verified
        )
        new_user.set_password(password)
        
        db.session.add(new_user)
        db.session.commit()
        
        return jsonify({
            "success": True,
            "message": "User created successfully",
            "user_id": new_user.id
        })
        
    except Exception as e:
        db.session.rollback()
        return jsonify({"success": False, "message": f"Error creating user: {str(e)}"}), 500

@views.route('/api/admin/create-admin', methods=['POST'])
@login_required
def admin_create_admin():
    if not current_user.is_admin():
        return jsonify({"error": "Admin access required"}), 403
    
    try:
        data = request.get_json()
        username = data.get('username')
        email = data.get('email')
        full_name = data.get('full_name')
        password = data.get('password')
        is_super_admin = data.get('is_super_admin', False)
        
        # Validation
        if not username or not email or not full_name or not password:
            return jsonify({"success": False, "message": "All fields are required"}), 400
        
        if len(username) < 3:
            return jsonify({"success": False, "message": "Username must be at least 3 characters"}), 400
        
        if len(password) < 7:
            return jsonify({"success": False, "message": "Password must be at least 7 characters"}), 400
        
        if Admin.query.filter_by(username=username).first():
            return jsonify({"success": False, "message": "Username already exists"}), 400
        
        if Admin.query.filter_by(email=email).first():
            return jsonify({"success": False, "message": "Email already exists"}), 400
        
        # Create new admin
        new_admin = Admin(
            username=username,
            email=email,
            full_name=full_name,
            is_super_admin=is_super_admin
        )
        new_admin.set_password(password)
        
        db.session.add(new_admin)
        db.session.commit()
        
        return jsonify({
            "success": True,
            "message": "Admin created successfully",
            "admin_id": new_admin.id
        })
        
    except Exception as e:
        db.session.rollback()
        return jsonify({"success": False, "message": f"Error creating admin: {str(e)}"}), 500