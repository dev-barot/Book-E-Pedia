from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from api.views import serve_media

urlpatterns = [
    path('media/<path:path>', serve_media),

    path('admin/', admin.site.urls),

    # ALL API ROUTES HERE
    path('api/', include('api.urls')),
]

# if settings.DEBUG:
#     urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

if settings.DEBUG:
    urlpatterns += [
        path('media/<path:path>', serve_media),
    ]