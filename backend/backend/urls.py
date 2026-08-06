"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django import dispatch
from django.urls import include, path, re_path
from django.contrib import admin
from django.conf import settings
from django.conf.urls.static import static
from django.views.generic import TemplateView
from django.http import FileResponse
import os


def get_frontend_dist_path(*paths):
    return os.path.join(settings.BASE_DIR, os.pardir, 'frontend', 'dist', *paths)


def serve_index(request):
    """Serve index.html for frontend SPA"""
    index_path = get_frontend_dist_path('index.html')
    if os.path.exists(index_path):
        return FileResponse(open(index_path, 'rb'), content_type='text/html')
    from django.http import HttpResponseServerError
    return HttpResponseServerError(
        'Frontend build not found. Run `npm run build` in optinet-site/frontend.'
    )


urlpatterns = [
    path('admin/', admin.site.urls),
    path("api/", include("OPTINET.urls")),
]

# Serve static assets from frontend build
if os.path.exists(get_frontend_dist_path()):
    from django.views.static import serve as static_serve
    
    def serve_static_asset(request, path):
        """Serve static assets from frontend dist"""
        asset_path = get_frontend_dist_path(path)
        if os.path.exists(asset_path):
            return static_serve(request, path, document_root=get_frontend_dist_path())
        # If not found, return 404
        from django.http import HttpResponseNotFound
        return HttpResponseNotFound()
    
    urlpatterns += [
        re_path(r'^(?P<path>assets/.*)$', serve_static_asset, name='frontend-assets'),
        re_path(r'^(?P<path>.*\.svg)$', serve_static_asset, name='frontend-svg'),
    ]

# Serve frontend for all other routes (SPA fallback)
urlpatterns += [
    re_path(r'^(?!api/|admin/|media/).*$', serve_index, name='frontend'),
]

if settings.DEBUG:
    urlpatterns += static(
        settings.MEDIA_URL,
        document_root=settings.MEDIA_ROOT
    )
