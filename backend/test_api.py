import requests

data = {
    "titre": "Test",
    "description": "Test",
    "technologies": "Test",
    "date_realisation": "2026-06-05",
    "ordre_affichage": 0,
    "est_actif": True,
}
r = requests.post("http://127.0.0.1:8000/api/portfolio/", data=data)
print("Status:", r.status_code)
print("Response:", r.text)
