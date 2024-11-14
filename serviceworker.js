var cacheStatic = 'cache';

self.addEventListener('install', function (event) {
    console.log('SW instalado', event); // installEvent
    event.waitUntil(
        caches.open(cacheStatic)
            .then(function (cache) {
                cache.addAll(
                    ['estilos/estilos.css',
                        'index.html',
                        'css/styles.css',
                        'img/32x32.png',
                        'img/icon.jpeg',
                    ]
                )
            })
            .catch((error) => {
                console.error('Error en cache.addAll:', error);
            })
        );
});

self.addEventListener('activate', function (event) {
    console.log('SW activado', event);
});

//cache dinamico
var cacheDynamic = 'dynamic';
self.addEventListener('fetch', function (event) {

    const requestUrl = new URL(event.request.url);
    if (requestUrl.pathname.includes('githubusercontent')) {
        event.respondWith(
            caches.match(event.request).then((cachedResponse) => {
                if (cachedResponse && typeof cachedResponse != 'undefined' ) {
                    return cachedResponse;
                }

                return fetch(event.request).then((networkResponse) => {
                    return caches.open('pokemon-image-cache').then((cache) => {
                        console.log("estoy en el service worker fetch 6!!", cache);
                        cache.put(event.request, networkResponse.clone());
                        return networkResponse;
                    });
                })
                .catch((error) => {
                    console.error('Fetch error:', error);
                    return caches.match('/img/fallback-image.png');
                });
            })
        );
    } else {
        //todos los demas fetch (caching)
        event.respondWith(caches.match(event.request)
            .then(function (response) {
                if (response) {
                    return response;
                }
                
                var requestToCache = event.request.clone(); // Clona la solicitud: una solicitud es un flujo y se puede consumir una vez.
                return fetch(requestToCache)
                    .then( // Trata de hacer la solicitud HTTP original según lo previsto.
                        function (response) {
                            if (!response || response.status !== 200) { //Si la solicitud falla o el servidor responde con un código de error, devolvelo inmediatamente
                                return response;
                            }
                            var responseToCache = response.clone(); // Nuevamente, clona la respuesta porque necesitamos agregarla al caché y porque se usa para la respuesta final
                            caches.open(cacheDynamic) // Abre el cache.
                                .then(function (cache) {
                                    cache.put(requestToCache, responseToCache); //Añadir respuesta en caché.
                                    console.log('SW actualizado');
                                });
                            return response;
                        });
            })
        );

    }

    
});

// Notificaciones push
/*
self.addEventListener("push", function (e) {
    console.log(e);
    var title = "un push para practicar";
    options = {
        body: "Click para regresar a la aplicacion",
        icon: "/icon.png",
        vibrate: [100, 50, 100],
        data: { id: 1 },
        actions: [{
            'action': 'SI', 'title': 'Copada la app',
            'icon': '/icon.png'
        },
        {
            'action': 'NO', 'title': 'buuu, fea la app',
            'icon': '/icon.png'
        }]
    }

    console.warn("llegue acaaaaaaaaaaaaa:::");
    try {
        e.waitUntil(self.registration.showNotification(title, options))
    } catch (error) {
        console.warn('el errror es::: ',error);
    } 
})
*/

self.addEventListener('push', event => {
    //const data = event.data ? event.data.json() : {};
    const data = 'Ejempl de push notification'; // event.data ? event.data.json() : {};
    const title = data.title || 'Título por defecto';
    const options = {
        body: data.body || 'Cuerpo por defecto',
        icon: '/icon-192x192.png', // Asegúrate de que la ruta sea correcta
        badge: '/icon-192x192.png'
    };

    // Intenta mostrar la notificación y captura errores si ocurren
    event.waitUntil(
        self.registration.showNotification(title, options)
        .then(() => {
            console.log('Notificación mostrada con éxito');
        })
        .catch(error => {
            console.error('Error mostrando la notificación:', error);
        })
    );
});

self.addEventListener("notificationclick", function (e) {
    console.log(e);
    if (e.action === "SI") {
        console.log("Me encanta esta APP")
        clients.openWindow('https://google.com')
        console.log(clients)
    } else if (e.action === "NO") {
        console.log("NO me gusta esta app");
    }
    e.notification.close();
})  