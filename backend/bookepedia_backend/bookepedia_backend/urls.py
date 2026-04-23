from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from api.views import add_to_cart, serve_media

urlpatterns = [
    path('media/<path:path>', serve_media),

    path('admin/', admin.site.urls),

    # ALL API ROUTES HERE
    path('api/', include('api.urls')),
    path('cart/', add_to_cart),
    # path('api/', api_home),
]

# if settings.DEBUG:
#     urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

if settings.DEBUG:
    urlpatterns += [
        path('media/<path:path>', serve_media),
    ]