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
            }));
});
self.addEventListener('activate', function (event) {
    console.log('SW activado', event);
});

//cache dinamico
var cacheDynamic = 'dynamic';
self.addEventListener('fetch', function (event) {
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
});

// Notificaciones push
self.addEventListener("push", function (e) {
    console.log(e)

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
    e.waitUntil(self.registration.showNotification(title, options))

})


self.addEventListener("notificationclick", function (e) {
    console.log(e);

    if (e.action === "SI") {
        console.log("Me encanta esta APP")
        clients.openWindow('https://google.com')
        console.log(clients)
    }
    else if (e.action === "NO") {
        console.log("NO me gusta esta app")


    }

    e.notification.close();
})