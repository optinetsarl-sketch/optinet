from .views import ContactCreateView, ContactDeleteView, ContactDetailView, ContactListView, ContactUpdateView, PhotoCreateView, PhotoDeleteView, PhotoDetailView, PhotoListView, PhotoUpdateView, PortfolioDetailView
from .views import (
    ProduitListView, ProduitDetailView, ProduitCreateView, ProduitUpdateView,
    ProduitDeleteView, PhotoProduitCreateView, PhotoProduitDeleteView,
)
from .views import PortfolioListCreateView
from .views import CategorieDetailView
from .views import CategorieListCreateView
from .views import MessageUpdateView, MessageDestroyView
from .views import MessageCreateView
from .views import MessageListView
from .views import MessageDetailView
from .views import UserListView
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