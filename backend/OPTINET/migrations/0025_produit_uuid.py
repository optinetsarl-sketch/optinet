import uuid
from django.db import migrations, models


def generer_uuids(apps, schema_editor):
    """Attribue un UUID unique à chaque produit existant."""
    Produit = apps.get_model("OPTINET", "Produit")
    for produit in Produit.objects.all():
        produit.uuid = uuid.uuid4()
        produit.save(update_fields=["uuid"])


class Migration(migrations.Migration):

    dependencies = [
        ("OPTINET", "0024_visitelive_dimensionjour"),
    ]

    operations = [
        # 1) Ajout nullable, non-unique (pour ne pas violer l'unicité sur les lignes existantes)
        migrations.AddField(
            model_name="produit",
            name="uuid",
            field=models.UUIDField(default=uuid.uuid4, editable=False, null=True),
        ),
        # 2) Un UUID distinct par produit existant
        migrations.RunPython(generer_uuids, migrations.RunPython.noop),
        # 3) On verrouille : unique + indexé
        migrations.AlterField(
            model_name="produit",
            name="uuid",
            field=models.UUIDField(default=uuid.uuid4, editable=False, unique=True, db_index=True),
        ),
    ]
