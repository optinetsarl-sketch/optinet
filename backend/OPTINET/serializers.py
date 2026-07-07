from rest_framework import serializers
from .models import Photo, User,Portfolio, Categorie, Message
from .models import Contact, Produit, PhotoProduit

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


class ProduitListSerializer(serializers.ModelSerializer):
    """Version légère pour la liste boutique : 1 photo principale."""
    image_principale = serializers.SerializerMethodField()
    nb_photos = serializers.SerializerMethodField()

    class Meta:
        model = Produit
        fields = ["id", "nom", "prix", "est_actif", "image_principale", "nb_photos", "created_at"]

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

    class Meta:
        model = Produit
        fields = [
            "id", "nom", "description", "prix", "caracteristiques",
            "caracteristiques_list", "est_actif", "ordre", "created_at",
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