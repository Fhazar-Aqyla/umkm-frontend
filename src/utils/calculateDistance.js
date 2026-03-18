export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const distance = R * c

  return Math.round(distance * 10) / 10
}

const toRad = (value) => (value * Math.PI) / 180

export const formatDistance = (distanceKm) => {
  if (!distanceKm && distanceKm !== 0) return '-'
  if (distanceKm < 1) {
    return `${Math.round(distanceKm * 1000)} m`
  }
  return `${distanceKm} km`
}

export const calculateDeliveryFee = (distanceKm) => {
  const FEE_PER_KM = 2000
  return Math.ceil(distanceKm) * FEE_PER_KM
}
