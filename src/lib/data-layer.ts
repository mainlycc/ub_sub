export type DataLayerEvent = Record<string, unknown> & {
  event: string
}

declare global {
  interface Window {
    dataLayer?: unknown[]
  }
}

export function pushToDataLayer(payload: DataLayerEvent) {
  if (typeof window === "undefined") return
  window.dataLayer = window.dataLayer || []
  window.dataLayer.push(payload)
}

