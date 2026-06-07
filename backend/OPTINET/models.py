from django.db import models

# Create your models here.
from django.db import models
from django.contrib.auth.models import AbstractUser

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
    est_actif = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

class Contact(models.Model):
    nom = models.CharField(max_length=150, blank=True, null=True)
    email = models.EmailField()
    numero_de_telephone = models.CharField(max_length=30, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return f"{self.nom or self.email}"


