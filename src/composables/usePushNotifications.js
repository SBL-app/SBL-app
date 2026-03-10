import { ref, readonly } from 'vue'
import ky from 'ky'
import { API_URL } from '../../API_URL'

const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY

// Convertit la clé VAPID base64url en Uint8Array (requis par l'API Web Push)
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = atob(base64)
  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)))
}

// État partagé entre toutes les instances du composable
const permission = ref(Notification.permission ?? 'default')
const isSubscribed = ref(false)
const isLoading = ref(false)

export function usePushNotifications() {
  const isSupported = 'Notification' in window && 'serviceWorker' in navigator && 'PushManager' in window

  async function subscribe() {
    if (!isSupported || !VAPID_PUBLIC_KEY || VAPID_PUBLIC_KEY === 'REMPLACER_PAR_LA_CLÉ_PUBLIQUE_VAPID') {
      console.warn('[PWA] Push notifications not supported or VAPID key not configured')
      return
    }

    isLoading.value = true
    try {
      // 1. Demander la permission
      const result = await Notification.requestPermission()
      permission.value = result
      if (result !== 'granted') return

      // 2. Récupérer le service worker enregistré
      const registration = await navigator.serviceWorker.ready

      // 3. S'abonner au push service
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
      })

      // 4. Envoyer la subscription à l'API
      // TODO: ajouter le header Authorization: Bearer <token> quand l'auth JWT
      // sera implémentée côté frontend (actuellement aucun store d'auth existant)
      await ky.post(`${API_URL}/push/subscribe`, { json: subscription.toJSON() })

      isSubscribed.value = true
    } catch (error) {
      console.error('[PWA] Failed to subscribe to push notifications:', error)
    } finally {
      isLoading.value = false
    }
  }

  async function unsubscribe() {
    const registration = await navigator.serviceWorker.ready
    const subscription = await registration.pushManager.getSubscription()
    if (!subscription) return

    isLoading.value = true
    try {
      // TODO: ajouter le header Authorization quand l'auth JWT sera implémentée
      await ky.delete(`${API_URL}/push/subscribe`, { json: { endpoint: subscription.endpoint } })
      await subscription.unsubscribe()
      isSubscribed.value = false
    } catch (error) {
      console.error('[PWA] Failed to unsubscribe:', error)
    } finally {
      isLoading.value = false
    }
  }

  // Vérifier l'état d'abonnement actuel au montage
  async function checkSubscriptionStatus() {
    if (!isSupported) return
    try {
      const registration = await navigator.serviceWorker.ready
      const subscription = await registration.pushManager.getSubscription()
      isSubscribed.value = !!subscription
    } catch {
      isSubscribed.value = false
    }
  }

  return {
    isSupported,
    permission: readonly(permission),
    isSubscribed: readonly(isSubscribed),
    isLoading: readonly(isLoading),
    subscribe,
    unsubscribe,
    checkSubscriptionStatus,
  }
}
