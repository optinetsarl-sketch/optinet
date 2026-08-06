import re
import urllib.parse
from django.db import migrations


ATLAS_URI = (
    "mongodb+srv://abrahamnabine1_db_user:"
    + urllib.parse.quote("Abraxi0551410896")
    + "@bus-menu.pzctol2.mongodb.net/?retryWrites=true&w=majority"
)


def extract_price(text):
    if not text:
        return ""
    match = re.search(r"Prix[:\s]*([\d\s]+(?:fcfa|FCFA|f|F)?)", text, re.IGNORECASE)
    if match:
        return match.group(1).strip()
    match2 = re.search(r"([\d\s]{5,}\s*(?:fcfa|FCFA))", text, re.IGNORECASE)
    if match2:
        return match2.group(1).strip()
    return ""


def sync_atlas_posts(apps, schema_editor):
    try:
        from pymongo import MongoClient
    except ImportError:
        return

    try:
        client = MongoClient(ATLAS_URI, serverSelectionTimeoutMS=8000)
        db = client["optipub"]
        posts = list(db["posts"].find())
    except Exception as e:
        print(f"Erreur connexion Atlas migration 0027: {e}")
        return

    if not posts:
        return

    Produit = apps.get_model("OPTINET", "Produit")
    PhotoProduit = apps.get_model("OPTINET", "PhotoProduit")
    Actualite = apps.get_model("OPTINET", "Actualite")
    CategorieProduit = apps.get_model("OPTINET", "CategorieProduit")

    cat_ord = CategorieProduit.objects.filter(slug="ordinateurs").first()
    cat_net = CategorieProduit.objects.filter(slug="reseau-wifi").first()
    cat_acc = CategorieProduit.objects.filter(slug="accessoires").first()

    for idx, p in enumerate(posts):
        title = p.get("title") or "Sans titre"
        content = p.get("content") or ""
        category = p.get("category", "offre")
        media = p.get("media") or []
        created_at = p.get("createdAt") or p.get("publishedAt")

        if category == "actu":
            act, created = Actualite.objects.get_or_create(
                titre=title[:250],
                defaults={
                    "contenu": content,
                    "categorie": "actualite",
                    "est_publie": True,
                },
            )
        else:
            # Determining product category based on title
            lower_title = title.lower()
            if any(w in lower_title for w in ["laptop", "pc", "ordinateur", "hp", "dell", "lenovo", "asus", "macbook", "probook", "thinkpad"]):
                target_cat = cat_ord
            elif any(w in lower_title for w in ["routeur", "switch", "wifi", "4g", "5g", "antenne", "fibre", "modem"]):
                target_cat = cat_net
            else:
                target_cat = cat_acc or cat_ord

            price = extract_price(content)

            prod, created = Produit.objects.get_or_create(
                nom=title[:250],
                defaults={
                    "description": content,
                    "prix": price or "Sur devis",
                    "quantite_disponible": 5,
                    "est_actif": True,
                    "ordre": idx + 1,
                    "categorie": target_cat,
                },
            )

            # Associate photo URLs from media if present
            if created and media:
                for img_idx, m in enumerate(media):
                    img_url = m.get("url") or ""
                    if img_url:
                        # Normalize URL path if needed
                        if not img_url.startswith("http"):
                            img_url = f"https://optipub.ginolux.com{img_url}" if not img_url.startswith("/") else f"https://optipub.ginolux.com{img_url}"
                        PhotoProduit.objects.create(
                            produit=prod,
                            image=img_url,
                            est_principale=(img_idx == 0),
                            ordre=img_idx,
                        )


def reverse_sync(apps, schema_editor):
    pass


class Migration(migrations.Migration):

    dependencies = [
        ("OPTINET", "0026_seed_actualites"),
    ]

    operations = [
        migrations.RunPython(sync_atlas_posts, reverse_sync),
    ]
