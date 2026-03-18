import { useState, useEffect } from 'react'
import { DEFAULT_COORDS } from '../utils/constants'

const useLocation = () => {
  const [coords, setCoords] = useState(null)
  const [locationError, setLocationError] = useState(null)
  const [isLoadingLocation, setIsLoadingLocation] = useState(true)

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationError('Browser tidak mendukung geolocation')
      setCoords(DEFAULT_COORDS)
      setIsLoadingLocation(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        })
        setIsLoadingLocation(false)
      },
      (error) => {

        let msg = 'Tidak dapat mengambil lokasi'
        if (error.code === error.PERMISSION_DENIED) {
          msg = 'Izin lokasi ditolak. Menggunakan lokasi default.'
        }
        setLocationError(msg)
        setCoords(DEFAULT_COORDS)
        setIsLoadingLocation(false)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000,
      }
    )
  }, [])

  return { coords, locationError, isLoadingLocation }
}

export default useLocation
