from django.contrib import admin
from django.utils.html import format_html
from .models import User, Message, Categorie, Portfolio, Photo, Produit, PhotoProduit, Actualite, PhotoActualite

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


class PhotoProduitInline(admin.TabularInline):
    model = PhotoProduit
    extra = 3
    fields = ('apercu', 'image', 'est_principale', 'ordre')
    readonly_fields = ('apercu',)

    def apercu(self, obj):
        if obj and obj.image:
            return format_html('<img src="{}" style="height:60px;border-radius:6px;" />', obj.image.url)
        return "—"
    apercu.short_description = "Aperçu"


@admin.register(Produit)
class ProduitAdmin(admin.ModelAdmin):
    list_display = ('id', 'apercu', 'nom', 'prix', 'nb_photos', 'est_actif', 'created_at')
    list_filter = ('est_actif', 'created_at')
    list_editable = ('est_actif',)
    search_fields = ('nom', 'description')
    inlines = [PhotoProduitInline]
    fields = ('nom', 'prix', 'description', 'caracteristiques', 'est_actif', 'ordre')

    def apercu(self, obj):
        photo = obj.photo_principale
        if photo and photo.image:
            return format_html('<img src="{}" style="height:44px;width:44px;object-fit:cover;border-radius:6px;" />', photo.image.url)
        return "—"
    apercu.short_description = "Photo"

    def nb_photos(self, obj):
        return obj.photos.count()
    nb_photos.short_description = "Nb photos"


class PhotoActualiteInline(admin.TabularInline):
    model = PhotoActualite
    extra = 3
    fields = ('apercu', 'image', 'est_principale', 'ordre')
    readonly_fields = ('apercu',)

    def apercu(self, obj):
        if obj and obj.image:
            return format_html('<img src="{}" style="height:60px;border-radius:6px;" />', obj.image.url)
        return "—"
    apercu.short_description = "Aperçu"


@admin.register(Actualite)
class ActualiteAdmin(admin.ModelAdmin):
    list_display = ('id', 'apercu', 'titre', 'categorie', 'service', 'a_video', 'est_publie', 'date_publication')
    list_filter = ('categorie', 'service', 'est_publie', 'date_publication')
    list_editable = ('est_publie',)
    search_fields = ('titre', 'contenu')
    inlines = [PhotoActualiteInline]
    fields = ('titre', 'categorie', 'service', 'date_publication', 'contenu', 'video_url', 'est_publie')

    def apercu(self, obj):
        photo = obj.photo_principale
        if photo and photo.image:
            return format_html('<img src="{}" style="height:44px;width:44px;object-fit:cover;border-radius:6px;" />', photo.image.url)
        return "—"
    apercu.short_description = "Photo"

    def a_video(self, obj):
        return bool(obj.video_url)
    a_video.boolean = True
    a_video.short_description = "Vidéo"

