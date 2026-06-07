from rest_framework import serializers
from .models import Photo, User,Portfolio, Categorie, Message
from .models import Contact

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