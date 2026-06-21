#!/usr/bin/env python
"""
Script de diagnostic pour vérifier la connexion backend-BD
"""
import os
import sys
import django
from pathlib import Path

# Ajouter le chemin du backend au PYTHONPATH
backend_path = Path(__file__).resolve().parent
sys.path.insert(0, str(backend_path))

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')

try:
    print("📦 Configuration Django...")
    django.setup()
    print("✅ Django configuré avec succès")
    
    print("\n🔗 Test de connexion à PostgreSQL...")
    from django.db import connection
    
    with connection.cursor() as cursor:
        cursor.execute("SELECT 1")
        result = cursor.fetchone()
    
    if result:
        print("✅ Connexion PostgreSQL réussie!")
        print(f"   Résultat query: {result}")
    else:
        print("❌ Erreur: aucune réponse de la BD")
        
    print("\n📊 Informations de la BD:")
    db_settings = connection.settings_dict
    print(f"   ENGINE: {db_settings['ENGINE']}")
    print(f"   NAME: {db_settings['NAME']}")
    print(f"   USER: {db_settings['USER']}")
    print(f"   HOST: {db_settings['HOST']}")
    print(f"   PORT: {db_settings['PORT']}")
    
except Exception as e:
    print(f"❌ Erreur: {type(e).__name__}")
    print(f"   Message: {str(e)}")
    import traceback
    traceback.print_exc()
