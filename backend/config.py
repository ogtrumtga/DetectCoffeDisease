"""
Backend configuration for Firebase Admin SDK.
"""
import os
from dotenv import load_dotenv
import firebase_admin
from firebase_admin import credentials, firestore, auth

load_dotenv()

# Initialize Firebase Admin SDK
if not firebase_admin._apps:
    # Option 1: Use service account key file (recommended for production)
    # cred = credentials.Certificate("path/to/serviceAccountKey.json")
    
    # Option 2: Use default credentials (for development)
    cred = credentials.ApplicationDefault()
    
    firebase_admin.initialize_app(cred, {
        'projectId': 'coffe-detect',
    })

# Firestore client
db = firestore.client()

# Auth client
auth_client = auth
