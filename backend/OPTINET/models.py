from django.db import models

# Create your models here.
from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone
from django.utils.text import slugify
from .managers import UserManager


class User(AbstractUser):
    ROLE_CHOICES = (
        ("DG", "Directeur Général"),
        ("SG", "Secrétaire Général"),
        ("CD", "Chef Département"),
        ("CP", "Chef Projet"),
        ("DV", "Développeur"),
        ("UT", "Utilisateur"),
    )

    username = None
    email = models.EmailField(unique=True)
    role = models.CharField(
        max_length=2,
        choices=ROLE_CHOICES,
        default="UT"
    )
    telephone = models.CharField(
        max_length=20,
        blank=True,
        null=True
    )
    USERNAME_FIELD = "email"

    REQUIRED_FIELDS = []

    objects = UserManager()

    def __str__(self):
        return self.email

class Message(models.Model):
    nom = models.CharField(max_length=100)
    email = models.EmailField()
    entreprise = models.CharField(max_length=100, blank=True, null=True) 
    numero_de_telephone = models.CharField(max_length=30, blank=True, null=True) 
    sujet = models.CharField(max_length=200)
    contenu = models.TextField()
    STATUT_CHOICES = [
        ("non_lu", "Non lu"),
        ("lu", "Lu"),
        ("en_attente", "En attente"),
    ]
    statut = models.CharField(max_length=15, choices=STATUT_CHOICES, default="non_lu")
    date_creation = models.DateTimeField(auto_now_add=True) 

class Categorie(models.Model):
    nom = models.CharField(max_length=100)
    def __str__(self):
        return self.nom

class Portfolio(models.Model):
    categorie = models.ForeignKey(
        Categorie,
        on_delete=models.SET_NULL,
        null=True
    )
    titre = models.CharField(max_length=255)
    description = models.TextField()
    image_principale = models.ImageField(upload_to='portfolio/')
    technologies = models.TextField()
    lien_projet = models.URLField(blank=True, null=True)
    date_realisation = models.DateField()
    ordre_affichage = models.PositiveIntegerField(default=0)
    est_actif = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

class Photo(models.Model):
    titre = models.CharField(max_length=255,blank=True, null=True)
    image_principale = models.ImageField(upload_to='photo/')
    prix = models.CharField(max_length=100, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    est_actif = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

class CategorieProduit(models.Model):
    """Catégorie de la boutique (ex: Ordinateurs, Téléphones, Réseau...)."""
    nom = models.CharField(max_length=100)
    slug = models.SlugField(max_length=120, unique=True, blank=True)
    ordre = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["ordre", "nom"]

    def save(self, *args, **kwargs):
        if not self.slug:
            base = slugify(self.nom)[:110] or "categorie"
            slug, i = base, 1
            while CategorieProduit.objects.exclude(pk=self.pk).filter(slug=slug).exists():
                i += 1
                slug = f"{base}-{i}"
            self.slug = slug
        super().save(*args, **kwargs)

    def __str__(self):
        return self.nom


class Produit(models.Model):
    """Un produit de la boutique (peut avoir plusieurs photos)."""
    nom = models.CharField(max_length=255)
    categorie = models.ForeignKey(CategorieProduit, related_name="produits",
                                  on_delete=models.SET_NULL, null=True, blank=True)
    description = models.TextField(blank=True, null=True)
    prix = models.CharField(max_length=100, blank=True, null=True)
    quantite_disponible = models.PositiveIntegerField(
        blank=True, null=True,
        help_text="Stock disponible (laisser vide si non suivi)"
    )
    caracteristiques = models.TextField(
        blank=True, null=True,
        help_text="Une caractéristique par ligne, au format 'Nom: Valeur'. "
                  "Ex: Modèle: Galaxy A54 / Réseau: 4G/5G / Batterie: 5000 mAh"
    )
    est_actif = models.BooleanField(default=True)
    ordre = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["ordre", "-created_at"]

    def __str__(self):
        return self.nom

    @property
    def photo_principale(self):
        return self.photos.filter(est_principale=True).first() or self.photos.first()


class PhotoProduit(models.Model):
    """Une photo appartenant à un produit."""
    produit = models.ForeignKey(Produit, related_name="photos", on_delete=models.CASCADE)
    image = models.ImageField(upload_to="produits/")
    est_principale = models.BooleanField(default=False)
    ordre = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["-est_principale", "ordre", "id"]

    def __str__(self):
        return f"Photo de {self.produit.nom}"


class Actualite(models.Model):
    """Une publication du Journal (intervention terrain, réalisation, actu, annonce)."""
    CATEGORIE_CHOICES = [
        ("intervention", "Intervention terrain"),
        ("realisation", "Réalisation"),
        ("actualite", "Actualité"),
        ("annonce", "Annonce & Info"),
    ]
    SERVICE_CHOICES = [
        ("reseaux", "Réseaux & Infrastructure"),
        ("securite", "Sécurité & Surveillance"),
        ("fibre", "Fibre Optique & Télécoms"),
        ("serveurs", "Serveurs & Virtualisation"),
        ("telephonie", "Téléphonie d'Entreprise"),
        ("conseil", "Conseil & Formation"),
        ("developpement", "Développement & Applications"),
    ]
    titre = models.CharField(max_length=255)
    contenu = models.TextField(blank=True, null=True)
    categorie = models.CharField(max_length=20, choices=CATEGORIE_CHOICES, default="intervention")
    service = models.CharField(max_length=20, choices=SERVICE_CHOICES, blank=True, null=True,
                               help_text="Service OPTINET associé (pour l'afficher sur la page du service)")
    video_url = models.URLField(blank=True, null=True, help_text="Lien YouTube (facultatif)")
    est_publie = models.BooleanField(default=True)
    date_publication = models.DateTimeField(default=timezone.now)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-date_publication", "-created_at"]

    def __str__(self):
        return self.titre

    @property
    def photo_principale(self):
        return self.photos.filter(est_principale=True).first() or self.photos.first()


class PhotoActualite(models.Model):
    """Une photo appartenant à une actualité."""
    actualite = models.ForeignKey(Actualite, related_name="photos", on_delete=models.CASCADE)
    image = models.ImageField(upload_to="actualites/")
    est_principale = models.BooleanField(default=False)
    ordre = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["-est_principale", "ordre", "id"]

    def __str__(self):
        return f"Photo de {self.actualite.titre}"


class Commande(models.Model):
    """Une commande passée depuis la boutique (invité, sans compte)."""
    STATUT_CHOICES = [
        ("nouvelle", "Nouvelle"),
        ("confirmee", "Confirmée"),
        ("expediee", "Expédiée"),
        ("livree", "Livrée"),
        ("annulee", "Annulée"),
    ]
    MODE_CHOICES = [
        ("cod", "Paiement à la livraison"),
        ("whatsapp", "WhatsApp"),
    ]
    client_nom = models.CharField(max_length=150)
    client_telephone = models.CharField(max_length=40)
    client_adresse = models.TextField(blank=True, null=True)
    client_ville = models.CharField(max_length=100, blank=True, null=True)
    note = models.TextField(blank=True, null=True)
    mode_paiement = models.CharField(max_length=20, choices=MODE_CHOICES, default="cod")
    total = models.CharField(max_length=120, blank=True, null=True)  # prix en texte (ex "300 000 FCFA")
    statut = models.CharField(max_length=20, choices=STATUT_CHOICES, default="nouvelle")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"Commande #{self.id} — {self.client_nom}"

    @property
    def nb_articles(self):
        return sum(l.quantite for l in self.lignes.all())


class LigneCommande(models.Model):
    """Un article d'une commande (photo instantanée du produit au moment de l'achat)."""
    commande = models.ForeignKey(Commande, related_name="lignes", on_delete=models.CASCADE)
    produit = models.ForeignKey(Produit, on_delete=models.SET_NULL, null=True, blank=True)
    nom = models.CharField(max_length=255)
    prix = models.CharField(max_length=100, blank=True, null=True)
    quantite = models.PositiveIntegerField(default=1)

    def __str__(self):
        return f"{self.quantite} × {self.nom}"


class Contact(models.Model):
    nom = models.CharField(max_length=150, blank=True, null=True)
    email = models.EmailField()
    numero_de_telephone = models.CharField(max_length=30, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return f"{self.nom or self.email}"


