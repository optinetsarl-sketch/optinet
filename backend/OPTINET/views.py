from rest_framework import generics
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from .models import Photo, User, Message, Categorie, Portfolio
from .serializers import PhotoSerializer, RegisterSerializer, UserSerializer
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .serializers import MessageSerializer,CategorieSerializer,PortfolioSerializer,MessageSerializer
from .models import Contact, Produit, PhotoProduit, Actualite, PhotoActualite
from .serializers import ContactSerializer
from .serializers import ProduitListSerializer, ProduitDetailSerializer, PhotoProduitSerializer
from .serializers import ActualiteListSerializer, ActualiteDetailSerializer, PhotoActualiteSerializer
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser

# User
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer

class UserCreateView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

class UserDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

class UserToggleStatusView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        try:
            user = User.objects.get(pk=pk)
        except User.DoesNotExist:
            return Response({"detail": "User not found."}, status=status.HTTP_404_NOT_FOUND)
        user.is_active = not user.is_active
        user.save()
        return Response({"id": user.id, "is_active": user.is_active}, status=status.HTTP_200_OK)

# Duplicate UserDetailView and UserToggleStatusView removed

class UserListView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

# Message

class MessageListView(generics.ListAPIView):
    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Message.objects.all().order_by("-date_creation")
class MessageCreateView(generics.CreateAPIView):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer
    permission_classes = [AllowAny]

class MessageDetailView(generics.RetrieveAPIView):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticated]

class MessageUpdateView(generics.UpdateAPIView):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticated]

class MessageDestroyView(generics.DestroyAPIView):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticated]

# Categorie
class CategorieListCreateView(generics.ListCreateAPIView):
    queryset = Categorie.objects.all()
    serializer_class = CategorieSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]    

class CategorieDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Categorie.objects.all()
    serializer_class = CategorieSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]    
# Portfolio
class PortfolioListCreateView(generics.ListCreateAPIView):
    queryset = Portfolio.objects.all()
    serializer_class = PortfolioSerializer
    # permission_classes = [IsAuthenticatedOrReadOnly]    

class PortfolioDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Portfolio.objects.all()
    serializer_class = PortfolioSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]    

class PhotoListView(generics.ListAPIView):
    queryset = Photo.objects.all().order_by("-created_at")
    serializer_class = PhotoSerializer
    permission_classes = [AllowAny]

class PhotoDetailView(generics.RetrieveAPIView):
    queryset = Photo.objects.all()
    serializer_class = PhotoSerializer
    permission_classes = [AllowAny]

class PhotoCreateView(generics.CreateAPIView):
    queryset = Photo.objects.all()
    serializer_class = PhotoSerializer
    permission_classes = [IsAuthenticated]

class PhotoUpdateView(generics.UpdateAPIView):
    queryset = Photo.objects.all()
    serializer_class = PhotoSerializer
    permission_classes = [IsAuthenticated]

class PhotoDeleteView(generics.DestroyAPIView):
    queryset = Photo.objects.all()
    serializer_class = PhotoSerializer
    permission_classes = [IsAuthenticated]    

class ContactListView(generics.ListAPIView):

    queryset = Contact.objects.all().order_by("-created_at")
    serializer_class = ContactSerializer

class ContactCreateView(generics.CreateAPIView):

    queryset = Contact.objects.all()
    serializer_class = ContactSerializer

class ContactDetailView(generics.RetrieveAPIView):

    queryset = Contact.objects.all()
    serializer_class = ContactSerializer

class ContactUpdateView(generics.UpdateAPIView):

    queryset = Contact.objects.all()
    serializer_class = ContactSerializer

class ContactDeleteView(generics.DestroyAPIView):

    queryset = Contact.objects.all()
    serializer_class = ContactSerializer


# ---------- Produits (boutique e-commerce) ----------

def _to_bool(value, default=True):
    if value is None:
        return default
    return str(value).strip().lower() in ("true", "1", "on", "yes", "oui")


class ProduitListView(generics.ListAPIView):
    serializer_class = ProduitListSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        return Produit.objects.all().prefetch_related("photos")


class ProduitDetailView(generics.RetrieveAPIView):
    queryset = Produit.objects.all().prefetch_related("photos")
    serializer_class = ProduitDetailSerializer
    permission_classes = [AllowAny]


class ProduitCreateView(APIView):
    """Créer un produit avec plusieurs photos (multipart: champ 'images' répété)."""
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        data = request.data
        produit = Produit.objects.create(
            nom=data.get("nom") or data.get("titre") or "Produit",
            description=data.get("description", "") or "",
            prix=data.get("prix", "") or "",
            caracteristiques=data.get("caracteristiques", "") or "",
            est_actif=_to_bool(data.get("est_actif"), default=True),
        )
        images = request.FILES.getlist("images") or request.FILES.getlist("image_principale")
        for i, img in enumerate(images):
            PhotoProduit.objects.create(produit=produit, image=img, est_principale=(i == 0), ordre=i)
        return Response(
            ProduitDetailSerializer(produit, context={"request": request}).data,
            status=status.HTTP_201_CREATED,
        )


class ProduitUpdateView(APIView):
    """Modifier les champs texte d'un produit (nom, prix, description, specs, actif)."""
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def patch(self, request, pk):
        try:
            produit = Produit.objects.get(pk=pk)
        except Produit.DoesNotExist:
            return Response({"detail": "Produit introuvable."}, status=404)
        data = request.data
        for field in ("nom", "description", "prix", "caracteristiques"):
            if field in data:
                setattr(produit, field, data.get(field) or "")
        if "est_actif" in data:
            produit.est_actif = _to_bool(data.get("est_actif"))
        if "ordre" in data:
            try:
                produit.ordre = int(data.get("ordre"))
            except (TypeError, ValueError):
                pass
        produit.save()
        # nouvelles photos éventuelles
        for i, img in enumerate(request.FILES.getlist("images")):
            has_main = produit.photos.filter(est_principale=True).exists()
            PhotoProduit.objects.create(produit=produit, image=img, est_principale=(not has_main and i == 0), ordre=produit.photos.count() + i)
        return Response(ProduitDetailSerializer(produit, context={"request": request}).data)


class ProduitDeleteView(generics.DestroyAPIView):
    queryset = Produit.objects.all()
    serializer_class = ProduitDetailSerializer
    permission_classes = [IsAuthenticated]


class PhotoProduitCreateView(APIView):
    """Ajouter une photo à un produit existant."""
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request, pk):
        try:
            produit = Produit.objects.get(pk=pk)
        except Produit.DoesNotExist:
            return Response({"detail": "Produit introuvable."}, status=404)
        img = request.FILES.get("image")
        if not img:
            return Response({"detail": "Aucune image fournie."}, status=400)
        has_main = produit.photos.filter(est_principale=True).exists()
        photo = PhotoProduit.objects.create(
            produit=produit, image=img,
            est_principale=_to_bool(request.data.get("est_principale"), default=not has_main),
            ordre=produit.photos.count(),
        )
        return Response(PhotoProduitSerializer(photo, context={"request": request}).data, status=201)


class PhotoProduitDeleteView(generics.DestroyAPIView):
    queryset = PhotoProduit.objects.all()
    serializer_class = PhotoProduitSerializer
    permission_classes = [IsAuthenticated]


# ---------- Actualités (Le Journal) ----------

class ActualiteListView(generics.ListAPIView):
    serializer_class = ActualiteListSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        qs = Actualite.objects.all().prefetch_related("photos")
        cat = self.request.query_params.get("categorie")
        if cat:
            qs = qs.filter(categorie=cat)
        service = self.request.query_params.get("service")
        if service:
            qs = qs.filter(service=service)
        return qs


class ActualiteDetailView(generics.RetrieveAPIView):
    queryset = Actualite.objects.all().prefetch_related("photos")
    serializer_class = ActualiteDetailSerializer
    permission_classes = [AllowAny]


class ActualiteCreateView(APIView):
    """Créer une actualité avec plusieurs photos (multipart: champ 'images' répété)."""
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        data = request.data
        actu = Actualite.objects.create(
            titre=data.get("titre") or "Actualité",
            contenu=data.get("contenu", "") or "",
            categorie=data.get("categorie") or "intervention",
            service=(data.get("service") or "") or None,
            video_url=data.get("video_url", "") or "",
            est_publie=_to_bool(data.get("est_publie"), default=True),
        )
        images = request.FILES.getlist("images") or request.FILES.getlist("image_principale")
        for i, img in enumerate(images):
            PhotoActualite.objects.create(actualite=actu, image=img, est_principale=(i == 0), ordre=i)
        return Response(
            ActualiteDetailSerializer(actu, context={"request": request}).data,
            status=status.HTTP_201_CREATED,
        )


class ActualiteUpdateView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def patch(self, request, pk):
        try:
            actu = Actualite.objects.get(pk=pk)
        except Actualite.DoesNotExist:
            return Response({"detail": "Actualité introuvable."}, status=404)
        data = request.data
        for field in ("titre", "contenu", "categorie", "video_url"):
            if field in data:
                setattr(actu, field, data.get(field) or "")
        if "service" in data:
            actu.service = (data.get("service") or "") or None
        if "est_publie" in data:
            actu.est_publie = _to_bool(data.get("est_publie"))
        actu.save()
        for i, img in enumerate(request.FILES.getlist("images")):
            has_main = actu.photos.filter(est_principale=True).exists()
            PhotoActualite.objects.create(actualite=actu, image=img, est_principale=(not has_main and i == 0), ordre=actu.photos.count() + i)
        return Response(ActualiteDetailSerializer(actu, context={"request": request}).data)


class ActualiteDeleteView(generics.DestroyAPIView):
    queryset = Actualite.objects.all()
    serializer_class = ActualiteDetailSerializer
    permission_classes = [IsAuthenticated]


class PhotoActualiteCreateView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request, pk):
        try:
            actu = Actualite.objects.get(pk=pk)
        except Actualite.DoesNotExist:
            return Response({"detail": "Actualité introuvable."}, status=404)
        img = request.FILES.get("image")
        if not img:
            return Response({"detail": "Aucune image fournie."}, status=400)
        has_main = actu.photos.filter(est_principale=True).exists()
        photo = PhotoActualite.objects.create(
            actualite=actu, image=img,
            est_principale=_to_bool(request.data.get("est_principale"), default=not has_main),
            ordre=actu.photos.count(),
        )
        return Response(PhotoActualiteSerializer(photo, context={"request": request}).data, status=201)


class PhotoActualiteDeleteView(generics.DestroyAPIView):
    queryset = PhotoActualite.objects.all()
    serializer_class = PhotoActualiteSerializer
    permission_classes = [IsAuthenticated]