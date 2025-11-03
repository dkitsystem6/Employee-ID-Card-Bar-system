import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function ScanRedirect() {
  const navigate = useNavigate()

  useEffect(() => {
    // Check if there's a scanned ID in the URL or localStorage
    const urlParams = new URLSearchParams(window.location.search)
    const scannedId = urlParams.get('id') || urlParams.get('scan')
    
    if (scannedId) {
      navigate(`/v/${scannedId}`, { replace: true })
    } else {
      // If no ID, redirect to home
      navigate('/')
    }
  }, [navigate])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  )
}
