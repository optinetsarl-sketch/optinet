from rest_framework import serializers
from .models import Photo, User,Portfolio, Categorie, Message
from .models import Contact, Produit, PhotoProduit, Actualite, PhotoActualite
from .models import CategorieProduit, Commande, LigneCommande

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    class Meta:
        model = User

        fields = [
            "id",
            "email",
            "password",
            "first_name",
            "last_name",
            "role",
            "telephone",
        ]

    def create(self, validated_data):

        password = validated_data.pop("password")

        user = User.objects.create_user(
            password=password,
            **validated_data
        )

        return user

class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = [
            "telephone",
            "id",
            "email",
            "first_name",
            "last_name",
            "role",
            "is_active",
            "date_joined",
        ]




class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = "__all__"

class CategorieSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categorie
        fields = ["id", "nom"]

class PortfolioSerializer(serializers.ModelSerializer):
    image_principale = serializers.ImageField(use_url=True, required=False)
    categorie = CategorieSerializer(read_only=True)
    categorie_id = serializers.PrimaryKeyRelatedField(
        queryset=Categorie.objects.all(), source='categorie', write_only=True, required=False, allow_null=True
    )

    class Meta:
        model = Portfolio
        fields = [
            "id", "titre", "description", "image_principale",
            "technologies", "lien_projet", "date_realisation",
            "ordre_affichage", "est_actif", "created_at", "categorie", "categorie_id"
        ]
        read_only_fields = ["created_at"]



class PhotoSerializer(serializers.ModelSerializer):

    class Meta:
        model = Photo
        fields = "__all__"        





class ContactSerializer(serializers.ModelSerializer):

    class Meta:
        model = Contact
        fields = "__all__"


# ---------- Produits (boutique e-commerce) ----------

def _abs_url(serializer, obj_image):
    """URL absolue d'une image (avec le domaine) si possible."""
    if not obj_image:
        return None
    url = obj_image.url
    request = serializer.context.get("request")
    return request.build_absolute_uri(url) if request else url


class PhotoProduitSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    class Meta:
        model = PhotoProduit
        fields = ["id", "image", "est_principale", "ordre"]

    def get_image(self, obj):
        return _abs_url(self, obj.image)


class CategorieProduitSerializer(serializers.ModelSerializer):
    nb_produits = serializers.SerializerMethodField()

    class Meta:
        model = CategorieProduit
        fields = ["id", "nom", "slug", "ordre", "nb_produits"]

    def get_nb_produits(self, obj):
        return obj.produits.filter(est_actif=True).count()


class ProduitListSerializer(serializers.ModelSerializer):
    """Version légère pour la liste boutique : 1 photo principale."""
    image_principale = serializers.SerializerMethodField()
    nb_photos = serializers.SerializerMethodField()
    categorie_nom = serializers.CharField(source="categorie.nom", read_only=True, default=None)
    categorie_slug = serializers.CharField(source="categorie.slug", read_only=True, default=None)

    class Meta:
        model = Produit
        fields = ["id", "uuid", "nom", "prix", "quantite_disponible", "est_actif", "image_principale", "nb_photos",
                  "categorie", "categorie_nom", "categorie_slug", "created_at"]

    def get_image_principale(self, obj):
        photo = obj.photo_principale
        return _abs_url(self, photo.image) if photo else None

    def get_nb_photos(self, obj):
        return obj.photos.count()


class ProduitDetailSerializer(serializers.ModelSerializer):
    """Version complète : toutes les photos + caractéristiques structurées."""
    photos = PhotoProduitSerializer(many=True, read_only=True)
    image_principale = serializers.SerializerMethodField()
    caracteristiques_list = serializers.SerializerMethodField()

    categorie_nom = serializers.CharField(source="categorie.nom", read_only=True, default=None)
    categorie_slug = serializers.CharField(source="categorie.slug", read_only=True, default=None)

    class Meta:
        model = Produit
        fields = [
            "id", "uuid", "nom", "description", "prix", "quantite_disponible", "caracteristiques",
            "caracteristiques_list", "est_actif", "ordre", "created_at",
            "categorie", "categorie_nom", "categorie_slug",
            "photos", "image_principale",
        ]

    def get_image_principale(self, obj):
        photo = obj.photo_principale
        return _abs_url(self, photo.image) if photo else None

    def get_caracteristiques_list(self, obj):
        result = []
        for line in (obj.caracteristiques or "").splitlines():
            line = line.strip()
            if not line:
                continue
            if ":" in line:
                nom, valeur = line.split(":", 1)
                result.append({"nom": nom.strip(), "valeur": valeur.strip()})
            else:
                result.append({"nom": "", "valeur": line})
        return result


# ---------- Actualités (Le Journal) ----------

import re as _re


def _youtube_embed(url):
    """Transforme un lien YouTube en URL d'intégration (embed)."""
    if not url:
        return None
    m = _re.search(r"(?:youtu\.be/|youtube\.com/(?:watch\?v=|embed/|shorts/))([\w-]{11})", url)
    if m:
        return f"https://www.youtube.com/embed/{m.group(1)}"
    return url


class PhotoActualiteSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    class Meta:
        model = PhotoActualite
        fields = ["id", "image", "est_principale", "ordre"]

    def get_image(self, obj):
        return _abs_url(self, obj.image)


class ActualiteListSerializer(serializers.ModelSerializer):
    image_principale = serializers.SerializerMethodField()
    nb_photos = serializers.SerializerMethodField()
    a_video = serializers.SerializerMethodField()
    categorie_label = serializers.CharField(source="get_categorie_display", read_only=True)
    extrait = serializers.SerializerMethodField()

    service_label = serializers.CharField(source="get_service_display", read_only=True)

    class Meta:
        model = Actualite
        fields = [
            "id", "titre", "categorie", "categorie_label", "service", "service_label",
            "date_publication", "est_publie", "image_principale", "nb_photos", "a_video", "extrait",
        ]

    def get_image_principale(self, obj):
        photo = obj.photo_principale
        return _abs_url(self, photo.image) if photo else None

    def get_nb_photos(self, obj):
        return obj.photos.count()

    def get_a_video(self, obj):
        return bool(obj.video_url)

    def get_extrait(self, obj):
        txt = (obj.contenu or "").strip().replace("\n", " ")
        return txt[:160] + ("…" if len(txt) > 160 else "")


class ActualiteDetailSerializer(serializers.ModelSerializer):
    photos = PhotoActualiteSerializer(many=True, read_only=True)
    image_principale = serializers.SerializerMethodField()
    categorie_label = serializers.CharField(source="get_categorie_display", read_only=True)
    service_label = serializers.CharField(source="get_service_display", read_only=True)
    video_embed = serializers.SerializerMethodField()

    class Meta:
        model = Actualite
        fields = [
            "id", "titre", "contenu", "categorie", "categorie_label",
            "service", "service_label", "video_url", "video_embed",
            "date_publication", "est_publie", "created_at", "photos", "image_principale",
        ]

    def get_image_principale(self, obj):
        photo = obj.photo_principale
        return _abs_url(self, photo.image) if photo else None

    def get_video_embed(self, obj):
        return _youtube_embed(obj.video_url)


# ---------- Commandes (boutique) ----------

class LigneCommandeSerializer(serializers.ModelSerializer):
    class Meta:
        model = LigneCommande
        fields = ["id", "produit", "nom", "prix", "quantite"]


class CommandeSerializer(serializers.ModelSerializer):
    lignes = LigneCommandeSerializer(many=True, read_only=True)
    nb_articles = serializers.IntegerField(read_only=True)
    mode_paiement_label = serializers.CharField(source="get_mode_paiement_display", read_only=True)
    statut_label = serializers.CharField(source="get_statut_display", read_only=True)

    class Meta:
        model = Commande
        fields = [
            "id", "client_nom", "client_telephone", "client_adresse", "client_ville",
            "note", "mode_paiement", "mode_paiement_label", "total",
            "statut", "statut_label", "created_at", "nb_articles", "lignes",
        ]