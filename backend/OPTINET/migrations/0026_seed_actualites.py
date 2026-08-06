from django.db import migrations

INITIAL_ACTUALITES = [
    {
        "titre": "Déploiement, migration et mise en service d'une infrastructure informatique de nouvelle génération",
        "contenu": "La réussite d'un projet informatique se mesure au moment où la nouvelle infrastructure entre en production, avec une transition maîtrisée et sans interruption d'activité. Nos équipes ont mené l'installation et le déploiement complet des équipements de réseau, commutateurs et serveurs de dernière génération pour garantir une performance optimale.",
        "categorie": "realisation",
        "service": "reseaux",
        "est_publie": True,
    },
    {
        "titre": "Configuration d'une architecture Windows Server 2019 pour une infrastructure informatique performante",
        "contenu": "Après la mise en place de l'infrastructure matérielle, OPTINET SARLU a poursuivi le projet avec la configuration complète de l'environnement serveur basé sur Windows Server 2019. Mise en place de l'Active Directory, gestion centralisée des accès, politiques de sécurité et stratégies de sauvegarde automatique.",
        "categorie": "intervention",
        "service": "serveurs",
        "est_publie": True,
    },
    {
        "titre": "Mise en place d'une nouvelle infrastructure informatique pour accompagner la transformation digitale d'une entreprise",
        "contenu": "La performance d'une entreprise repose aujourd'hui sur une infrastructure informatique fiable, sécurisée et capable d'évoluer avec ses besoins. OPTINET SARLU a conçu et déployé un réseau sur-mesure combinant câblage structuré de catégorie 6A, couverture Wi-Fi maillée et passerelle de sécurité.",
        "categorie": "actualite",
        "service": "reseaux",
        "est_publie": True,
    },
    {
        "titre": "Déploiement Fortinet 80F + FortiAPs + FortiSD-WAN",
        "contenu": "Installation et sécurisation des réseaux multi-sites avec pare-feu Fortinet 80F, bornes FortiAP et liaison SD-WAN hautement disponible pour garantir la sécurité et l'interconnexion fluide de tous les sites de l'organisation.",
        "categorie": "intervention",
        "service": "securite",
        "est_publie": True,
    },
]

INITIAL_PRODUITS = [
    {
        "nom": "Serveur HP ProLiant DL380 Gen10",
        "description": "Serveur rack professionnel de haute performance pour infrastructures d'entreprise.",
        "prix": "1 850 000 FCFA",
        "caracteristiques": "Intel Xeon • 64 GB RAM DDR4 • 2x 1.2TB SAS • Double alimentation redundant",
        "quantite_disponible": 3,
        "est_actif": True,
        "ordre": 1,
    },
    {
        "nom": "Switch Cisco Catalyst C9300-48P",
        "description": "Commutateur réseau d'entreprise 48 ports PoE+ avec fonctions de routage Layer 3 et de sécurité avancées.",
        "prix": "950 000 FCFA",
        "caracteristiques": "48 Ports Gigabit PoE+ • Uplink 10G • Cisco IOS XE • Layer 3 Full",
        "quantite_disponible": 5,
        "est_actif": True,
        "ordre": 2,
    },
    {
        "nom": "Pare-feu Fortinet FortiGate 80F",
        "description": "Solution de sécurité périmétrique Next-Gen Firewall (NGFW) avec inspection SSL et SD-WAN intégré.",
        "prix": "720 000 FCFA",
        "caracteristiques": "Throughput 10 Gbps • SD-WAN • 8x Ports GE RJ45 • Protection Antivirus & IPS",
        "quantite_disponible": 2,
        "est_actif": True,
        "ordre": 3,
    },
    {
        "nom": "Ordinateur Portable Dell Latitude 5440",
        "description": "PC portable professionnel puissant et robuste pour les cadres et techniciens sur le terrain.",
        "prix": "485 000 FCFA",
        "caracteristiques": "Intel Core i7 13è Gen • 16 GB RAM • SSD 512 GB NVMe • Écran 14\" FHD",
        "quantite_disponible": 8,
        "est_actif": True,
        "ordre": 4,
    },
]


def seed_data(apps, schema_editor):
    Actualite = apps.get_model("OPTINET", "Actualite")
    for act in INITIAL_ACTUALITES:
        Actualite.objects.get_or_create(
            titre=act["titre"],
            defaults={
                "contenu": act["contenu"],
                "categorie": act["categorie"],
                "service": act["service"],
                "est_publie": act["est_publie"],
            },
        )

    Produit = apps.get_model("OPTINET", "Produit")
    CategorieProduit = apps.get_model("OPTINET", "CategorieProduit")
    cat_ord = CategorieProduit.objects.filter(slug="ordinateurs").first()
    cat_net = CategorieProduit.objects.filter(slug="reseau-wifi").first()

    for p in INITIAL_PRODUITS:
        target_cat = cat_ord if ("Dell" in p["nom"] or "Serveur" in p["nom"]) else cat_net
        Produit.objects.get_or_create(
            nom=p["nom"],
            defaults={
                "description": p["description"],
                "prix": p["prix"],
                "caracteristiques": p["caracteristiques"],
                "quantite_disponible": p["quantite_disponible"],
                "est_actif": p["est_actif"],
                "ordre": p["ordre"],
                "categorie": target_cat,
            },
        )


def remove_data(apps, schema_editor):
    pass


class Migration(migrations.Migration):

    dependencies = [
        ("OPTINET", "0025_produit_uuid"),
    ]

    operations = [
        migrations.RunPython(seed_data, remove_data),
    ]
