import { cleanupOutdatedCaches, precacheAndRoute } from 'workbox-precaching'

// Injection automatique du manifest de précache par vite-plugin-pwa
precacheAndRoute(self.__WB_MANIFEST)
cleanupOutdatedCaches()

// Gestion des notifications push entrantes
self.addEventListener('push', (event) => {
  if (!event.data) return

  event.waitUntil(
    (async () => {
      try {
        const data = event.data.json()
        const title = data.title ?? 'SBL'
        const options = {
          body: data.body ?? '',
          icon: data.icon ?? '/img/sbl-logo.png',
          badge: data.badge ?? '/img/sbl-logo.png',
          data: { url: data.url ?? '/' },
        }
        await self.registration.showNotification(title, options)
      } catch (error) {
        console.error('[SW] Failed to parse push payload:', error)
        await self.registration.showNotification('SBL', { body: 'Nouvelle notification', icon: '/img/sbl-logo.png' })
      }
    })()
  )
})

// Clic sur une notification → ouvrir l'URL correspondante
self.addEventListener('notificationclick', (event) => {
  event.notification.close()

  const url = event.notification.data?.url ?? '/'

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // Si une fenêtre de l'app est déjà ouverte, la focus et naviguer
      for (const client of clientList) {
        if (client.url.startsWith(self.location.origin) && 'focus' in client) {
          client.focus()
          client.navigate(url)
          return
        }
      }
      // Sinon ouvrir une nouvelle fenêtre
      if (clients.openWindow) {
        return clients.openWindow(url)
      }
    })
  )
})
