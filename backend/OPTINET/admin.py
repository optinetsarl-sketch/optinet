from django.contrib import admin
from .models import User, Message, Categorie, Portfolio, Photo

# Register your models here.

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('id', 'username', 'email', 'is_staff')
    list_filter = ('is_staff', 'is_active')
    search_fields = ('username', 'email')

@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = ('id', 'entreprise', 'email', 'statut', 'date_creation')
    list_filter = ('statut', 'date_creation')
    search_fields = ('entreprise', 'email')

@admin.register(Categorie)
class CategorieAdmin(admin.ModelAdmin):
    list_display = ('id', 'nom')
    search_fields = ('nom',)

@admin.register(Portfolio)
class PortfolioAdmin(admin.ModelAdmin):
    list_display = ('id', 'titre', 'est_actif', 'created_at')
    list_filter = ('est_actif', 'created_at')
    search_fields = ('titre',)

@admin.register(Photo)
class PhotoAdmin(admin.ModelAdmin):
    list_display = ('id', 'titre', 'est_actif', 'created_at')
    list_filter = ('est_actif', 'created_at')
    search_fields = ('titre',)

