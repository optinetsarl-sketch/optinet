from collections import OrderedDict
from django.db import migrations


def photos_vers_produits(apps, schema_editor):
    """Regroupe les Photo existantes en Produits.
    Toutes les photos qui partagent le MÊME titre (+ prix) appartiennent au
    même article -> 1 seul Produit avec plusieurs photos (les différents côtés).
    Rien n'est supprimé : les Photo restent en place (compatibilité)."""
    Photo = apps.get_model("OPTINET", "Photo")
    Produit = apps.get_model("OPTINET", "Produit")
    PhotoProduit = apps.get_model("OPTINET", "PhotoProduit")

    groupes = OrderedDict()
    for photo in Photo.objects.all().order_by("created_at", "id"):
        if not photo.image_principale:
            continue
        titre = (photo.titre or "").strip()
        if titre:
            # même titre + même prix => même article
            cle = ("t", titre.lower(), (photo.prix or "").strip())
        else:
            # sans titre : chaque photo reste un article distinct
            cle = ("id", photo.id)
        groupes.setdefault(cle, []).append(photo)

    for photos in groupes.values():
        first = photos[0]
        produit = Produit.objects.create(
            nom=(first.titre or "Produit").strip()[:255],
            description=first.description or "",
            prix=first.prix or "",
            est_actif=any(p.est_actif for p in photos),
        )
        for i, photo in enumerate(photos):
            PhotoProduit.objects.create(
                produit=produit,
                image=photo.image_principale.name,  # réutilise le fichier déjà présent
                est_principale=(i == 0),
                ordre=i,
            )


def revert(apps, schema_editor):
    Produit = apps.get_model("OPTINET", "Produit")
    Produit.objects.all().delete()


class Migration(migrations.Migration):

    dependencies = [
        ("OPTINET", "0015_produit_photoproduit"),
    ]

    operations = [
        migrations.RunPython(photos_vers_produits, revert),
    ]
