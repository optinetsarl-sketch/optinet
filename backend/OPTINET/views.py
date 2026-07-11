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
from .models import CategorieProduit, Commande, LigneCommande
from .models import VisiteurJour, PageVue
from .serializers import ContactSerializer
from .serializers import ProduitListSerializer, ProduitDetailSerializer, PhotoProduitSerializer
from .serializers import ActualiteListSerializer, ActualiteDetailSerializer, PhotoActualiteSerializer
from .serializers import CategorieProduitSerializer, CommandeSerializer
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
    serializer_class = RegisterSerializer
    permission_classes = [IsAuthenticated]

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
        qs = Produit.objects.all().select_related("categorie").prefetch_related("photos")
        cat = self.request.query_params.get("categorie")
        if cat:
            if str(cat).isdigit():
                qs = qs.filter(categorie_id=cat)
            else:
                qs = qs.filter(categorie__slug=cat)
        q = self.request.query_params.get("q")
        if q:
            qs = qs.filter(nom__icontains=q)
        return qs


class ProduitDetailView(generics.RetrieveAPIView):
    queryset = Produit.objects.all().prefetch_related("photos")
    serializer_class = ProduitDetailSerializer
    permission_classes = [AllowAny]


def _to_int_or_none(value):
    """'' ou absent -> None ; sinon entier (>=0) ou None si invalide."""
    if value in (None, ""):
        return None
    try:
        return max(0, int(str(value).strip()))
    except (TypeError, ValueError):
        return None


def _resolve_categorie_produit(cat):
    """Accepte un id numérique ou un slug, renvoie l'instance ou None."""
    if not cat:
        return None
    try:
        if str(cat).isdigit():
            return CategorieProduit.objects.filter(pk=cat).first()
        return CategorieProduit.objects.filter(slug=cat).first()
    except (TypeError, ValueError):
        return None


class ProduitCreateView(APIView):
    """Créer un produit avec plusieurs photos (multipart: champ 'images' répété)."""
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        data = request.data
        produit = Produit.objects.create(
            nom=data.get("nom") or data.get("titre") or "Produit",
            categorie=_resolve_categorie_produit(data.get("categorie")),
            description=data.get("description", "") or "",
            prix=data.get("prix", "") or "",
            quantite_disponible=_to_int_or_none(data.get("quantite_disponible")),
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
        if "categorie" in data:
            produit.categorie = _resolve_categorie_produit(data.get("categorie"))
        if "quantite_disponible" in data:
            produit.quantite_disponible = _to_int_or_none(data.get("quantite_disponible"))
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


# ---------- Catégories & Commandes (boutique) ----------

class CategorieProduitListView(generics.ListAPIView):
    queryset = CategorieProduit.objects.all()
    serializer_class = CategorieProduitSerializer
    permission_classes = [AllowAny]


class CommandeCreateView(APIView):
    """Passer une commande (invité — pas de compte)."""
    permission_classes = [AllowAny]

    def post(self, request):
        data = request.data
        items = data.get("items") or []
        if not items:
            return Response({"detail": "Le panier est vide."}, status=400)
        if not data.get("client_nom") or not data.get("client_telephone"):
            return Response({"detail": "Le nom et le téléphone sont requis."}, status=400)
        commande = Commande.objects.create(
            client_nom=data.get("client_nom", ""),
            client_telephone=data.get("client_telephone", ""),
            client_adresse=data.get("client_adresse", "") or "",
            client_ville=data.get("client_ville", "") or "",
            note=data.get("note", "") or "",
            mode_paiement=data.get("mode_paiement") or "cod",
            total=data.get("total", "") or "",
        )
        for it in items:
            prod = None
            pid = it.get("produit") or it.get("produit_id") or it.get("id")
            if pid:
                prod = Produit.objects.filter(pk=pid).first()
            try:
                qte = int(it.get("quantite") or 1)
            except (TypeError, ValueError):
                qte = 1
            LigneCommande.objects.create(
                commande=commande,
                produit=prod,
                nom=it.get("nom") or (prod.nom if prod else "Article"),
                prix=it.get("prix", "") or "",
                quantite=max(1, qte),
            )
        return Response(CommandeSerializer(commande).data, status=status.HTTP_201_CREATED)


class CommandeListView(generics.ListAPIView):
    queryset = Commande.objects.all().prefetch_related("lignes")
    serializer_class = CommandeSerializer
    permission_classes = [IsAuthenticated]


class CommandeDetailView(generics.RetrieveAPIView):
    queryset = Commande.objects.all().prefetch_related("lignes")
    serializer_class = CommandeSerializer
    permission_classes = [IsAuthenticated]


class CommandeUpdateView(generics.UpdateAPIView):
    queryset = Commande.objects.all()
    serializer_class = CommandeSerializer
    permission_classes = [IsAuthenticated]

# ---------- Statistiques de visite (compteur intégré) ----------

_BOT_MARKERS = ("bot", "crawler", "spider", "curl", "wget", "python-requests",
                "httpclient", "headless", "lighthouse", "uptime", "monitor")


class TrackVisiteView(APIView):
    """Signal de visite envoyé par le site public (anonyme, sans cookie)."""
    permission_classes = [AllowAny]

    def post(self, request):
        import hashlib
        from django.conf import settings
        from django.db.models import F
        from django.utils import timezone as tz

        ua = (request.META.get("HTTP_USER_AGENT") or "").lower()
        if not ua or any(m in ua for m in _BOT_MARKERS):
            return Response(status=204)

        path = str(request.data.get("path") or "/")[:255].split("?")[0]
        if not path.startswith("/") or path.startswith("/admin") or path == "/login":
            return Response(status=204)

        ip = (request.META.get("HTTP_X_FORWARDED_FOR") or "").split(",")[0].strip() \
            or request.META.get("REMOTE_ADDR", "")
        today = tz.localdate()
        # hash salé + daté : anonyme, non retraçable, change chaque jour
        empreinte = hashlib.sha256(
            f"{settings.SECRET_KEY}{today}{ip}{ua}".encode()
        ).hexdigest()

        VisiteurJour.objects.get_or_create(date=today, empreinte=empreinte)
        obj, created = PageVue.objects.get_or_create(date=today, path=path, defaults={"count": 1})
        if not created:
            PageVue.objects.filter(pk=obj.pk).update(count=F("count") + 1)
        return Response(status=204)


class StatsVisitesView(APIView):
    """Statistiques de fréquentation pour le tableau de bord admin."""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        from datetime import timedelta
        from django.db.models import Count, Sum
        from django.utils import timezone as tz

        today = tz.localdate()
        d7 = today - timedelta(days=6)
        d30 = today - timedelta(days=29)

        def visiteurs(depuis):
            return VisiteurJour.objects.filter(date__gte=depuis).count()

        def pages(depuis):
            return PageVue.objects.filter(date__gte=depuis).aggregate(t=Sum("count"))["t"] or 0

        # série jour par jour sur 30 jours
        vis_par_jour = {
            str(r["date"]): r["n"]
            for r in VisiteurJour.objects.filter(date__gte=d30)
                .values("date").annotate(n=Count("id"))
        }
        vues_par_jour = {
            str(r["date"]): r["n"]
            for r in PageVue.objects.filter(date__gte=d30)
                .values("date").annotate(n=Sum("count"))
        }
        serie = []
        for i in range(30):
            d = str(d30 + timedelta(days=i))
            serie.append({"date": d, "visiteurs": vis_par_jour.get(d, 0), "pages_vues": vues_par_jour.get(d, 0)})

        top_pages = list(
            PageVue.objects.filter(date__gte=d30)
            .values("path").annotate(total=Sum("count"))
            .order_by("-total")[:8]
        )

        return Response({
            "aujourd_hui": {"visiteurs": VisiteurJour.objects.filter(date=today).count(),
                            "pages_vues": PageVue.objects.filter(date=today).aggregate(t=Sum("count"))["t"] or 0},
            "semaine": {"visiteurs": visiteurs(d7), "pages_vues": pages(d7)},
            "mois": {"visiteurs": visiteurs(d30), "pages_vues": pages(d30)},
            "serie": serie,
            "top_pages": top_pages,
        })
