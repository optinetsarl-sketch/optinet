from django.db import migrations


CATEGORIES = [
    ("Ordinateurs", "ordinateurs", 1),
    ("Téléphones", "telephones", 2),
    ("Réseau & WiFi", "reseau-wifi", 3),
    ("Accessoires", "accessoires", 4),
]


def seed_categories(apps, schema_editor):
    CategorieProduit = apps.get_model("OPTINET", "CategorieProduit")
    for nom, slug, ordre in CATEGORIES:
        CategorieProduit.objects.get_or_create(slug=slug, defaults={"nom": nom, "ordre": ordre})


def remove_categories(apps, schema_editor):
    CategorieProduit = apps.get_model("OPTINET", "CategorieProduit")
    CategorieProduit.objects.filter(slug__in=[s for _, s, _ in CATEGORIES]).delete()


class Migration(migrations.Migration):

    dependencies = [
        ("OPTINET", "0020_categorieproduit_commande_produit_categorie_and_more"),
    ]

    operations = [
        migrations.RunPython(seed_categories, remove_categories),
    ]
