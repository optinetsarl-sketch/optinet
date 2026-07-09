from .views import ContactCreateView, ContactDeleteView, ContactDetailView, ContactListView, ContactUpdateView, PhotoCreateView, PhotoDeleteView, PhotoDetailView, PhotoListView, PhotoUpdateView, PortfolioDetailView
from .views import (
    ProduitListView, ProduitDetailView, ProduitCreateView, ProduitUpdateView,
    ProduitDeleteView, PhotoProduitCreateView, PhotoProduitDeleteView,
)
from .views import (
    ActualiteListView, ActualiteDetailView, ActualiteCreateView, ActualiteUpdateView,
    ActualiteDeleteView, PhotoActualiteCreateView, PhotoActualiteDeleteView,
)
from .views import (
    CategorieProduitListView, CommandeCreateView, CommandeListView,
    CommandeDetailView, CommandeUpdateView,
)
from .views import PortfolioListCreateView
from .views import CategorieDetailView
from .views import CategorieListCreateView
from .views import MessageUpdateView, MessageDestroyView
from .views import MessageCreateView
from .views import MessageListView
from .views import MessageDetailView
from .views import UserListView
from .views import UserCreateView, UserDetailView, UserToggleStatusView
from .views import RegisterView
from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path("register/", RegisterView.as_view()),

    path("login/", TokenObtainPairView.as_view(),),

    path("refresh/", TokenRefreshView.as_view(),),

    path("users/", UserListView.as_view(), name="user-list"),
    path("users/create/", UserCreateView.as_view(), name="user-create"),
    path("users/<int:pk>/", UserDetailView.as_view(), name="user-detail"),
    path("users/<int:pk>/toggle-status/", UserToggleStatusView.as_view(), name="user-toggle-status"),

    path("messages/", MessageListView.as_view()),
    path("messages/create/", MessageCreateView.as_view()),
    path("messages/<int:pk>/", MessageDetailView.as_view()),
    path("messages/update/<int:pk>/", MessageUpdateView.as_view()),
    path("messages/delete/<int:pk>/", MessageDestroyView.as_view()),
     # Categories
    path('categories/', CategorieListCreateView.as_view(), name='categories'),
    path('categories/<int:pk>/', CategorieDetailView.as_view(), name='categorie-detail'),
    # Portfolio
    path('portfolio/', PortfolioListCreateView.as_view(), name='portfolio'),
    path('portfolio/<int:pk>/', PortfolioDetailView.as_view(), name='portfolio-detail'),
     path(
        "photos/",
        PhotoListView.as_view(),
        name="photo-list"
    ),

    path(
        "photos/create/",
        PhotoCreateView.as_view(),
        name="photo-create"
    ),

    path(
        "photos/<int:pk>/",
        PhotoDetailView.as_view(),
        name="photo-detail"
    ),

    path(
        "photos/update/<int:pk>/",
        PhotoUpdateView.as_view(),
        name="photo-update"
    ),

    path(
        "photos/delete/<int:pk>/",
        PhotoDeleteView.as_view(),
        name="photo-delete"
    ),

    # Produits (boutique e-commerce)
    path("produits/", ProduitListView.as_view(), name="produit-list"),
    path("produits/create/", ProduitCreateView.as_view(), name="produit-create"),
    path("produits/<int:pk>/", ProduitDetailView.as_view(), name="produit-detail"),
    path("produits/update/<int:pk>/", ProduitUpdateView.as_view(), name="produit-update"),
    path("produits/delete/<int:pk>/", ProduitDeleteView.as_view(), name="produit-delete"),
    path("produits/<int:pk>/photos/", PhotoProduitCreateView.as_view(), name="produit-photo-add"),
    path("produit-photos/delete/<int:pk>/", PhotoProduitDeleteView.as_view(), name="produit-photo-delete"),

    # Boutique : catégories & commandes
    path("categories-produits/", CategorieProduitListView.as_view(), name="categorie-produit-list"),
    path("commandes/create/", CommandeCreateView.as_view(), name="commande-create"),
    path("commandes/", CommandeListView.as_view(), name="commande-list"),
    path("commandes/<int:pk>/", CommandeDetailView.as_view(), name="commande-detail"),
    path("commandes/update/<int:pk>/", CommandeUpdateView.as_view(), name="commande-update"),

    # Actualités (Le Journal)
    path("actualites/", ActualiteListView.as_view(), name="actualite-list"),
    path("actualites/create/", ActualiteCreateView.as_view(), name="actualite-create"),
    path("actualites/<int:pk>/", ActualiteDetailView.as_view(), name="actualite-detail"),
    path("actualites/update/<int:pk>/", ActualiteUpdateView.as_view(), name="actualite-update"),
    path("actualites/delete/<int:pk>/", ActualiteDeleteView.as_view(), name="actualite-delete"),
    path("actualites/<int:pk>/photos/", PhotoActualiteCreateView.as_view(), name="actualite-photo-add"),
    path("actualite-photos/delete/<int:pk>/", PhotoActualiteDeleteView.as_view(), name="actualite-photo-delete"),

    path(
        "contacts/",
        ContactListView.as_view(),
        name="contact-list"
    ),

    path(
        "contacts/create/",
        ContactCreateView.as_view(),
        name="contact-create"
    ),

    path(
        "contacts/<int:pk>/",
        ContactDetailView.as_view(),
        name="contact-detail"
    ),

    path(
        "contacts/update/<int:pk>/",
        ContactUpdateView.as_view(),
        name="contact-update"
    ),

    path(
        "contacts/delete/<int:pk>/",
        ContactDeleteView.as_view(),
        name="contact-delete"
    ),
]