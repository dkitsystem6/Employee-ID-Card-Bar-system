import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { employeeService } from '../services/employeeService'
import { Employee } from '../types/employee'
import Barcode from 'react-barcode'
import Navbar from '../components/Navbar'
import toast from 'react-hot-toast'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

export default function EmployeeID() {
  const { id_number } = useParams<{ id_number: string }>()
  const [employee, setEmployee] = useState<Employee | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (id_number) {
      loadEmployee()
    }
  }, [id_number])

  const loadEmployee = async () => {
    try {
      setLoading(true)
      const data = await employeeService.getByIdNumber(id_number!)
      if (!data) {
        toast.error('Employee not found')
      }
      setEmployee(data)
    } catch (error: any) {
      toast.error(error.message || 'Failed to load employee')
    } finally {
      setLoading(false)
    }
  }

  const handleDownloadPDF = async () => {
    const element = document.getElementById('id-card')
    if (!element) return

    try {
      toast.loading('Generating PDF...')
      const canvas = await html2canvas(element, {
        scale: 2,
        backgroundColor: '#ffffff',
      })
      const imgData = canvas.toDataURL('image/png')
      
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: [89, 51], // ID card size (3.5" x 2")
      })

      const imgWidth = 89
      const imgHeight = (canvas.height * imgWidth) / canvas.width

      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight)
      pdf.save(`${employee?.id_number || 'employee'}-id-card.pdf`)
      toast.dismiss()
      toast.success('PDF downloaded successfully!')
    } catch (error: any) {
      toast.dismiss()
      toast.error('Failed to generate PDF')
    }
  }

  const handleDownloadBarcode = async () => {
    const barcodeElement = document.getElementById('barcode-container')
    if (!barcodeElement || !employee) return

    try {
      toast.loading('Downloading barcode...')
      const canvas = await html2canvas(barcodeElement, {
        scale: 2,
        backgroundColor: '#ffffff',
      })
      const imgData = canvas.toDataURL('image/png')
      
      // Create download link
      const link = document.createElement('a')
      link.download = `${employee.id_number}-barcode.png`
      link.href = imgData
      link.click()
      
      toast.dismiss()
      toast.success('Barcode downloaded successfully!')
    } catch (error: any) {
      toast.dismiss()
      toast.error('Failed to download barcode')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  if (!employee) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <p className="text-gray-500 text-lg mb-4">Employee not found</p>
            <Link to="/dashboard" className="text-primary hover:underline">
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Employee ID Card</h1>
          <div className="flex gap-4">
            <button
              onClick={handleDownloadPDF}
              className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition font-medium"
            >
              Download PDF
            </button>
            <button
              onClick={() => window.print()}
              className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition font-medium"
            >
              Print
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-xl p-8">
          <div
            id="id-card"
            className="max-w-lg mx-auto bg-gradient-to-br from-white to-purple-50 rounded-2xl border-2 border-primary/20 p-8 shadow-lg"
          >
            {/* Header */}
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-primary mb-1">Durkkas</h2>
              <p className="text-sm text-gray-600">Employee Identification Card</p>
            </div>

            {/* Content */}
            <div className="flex items-center gap-6 mb-6">
              {/* Photo */}
              <div className="flex-shrink-0">
                {employee.photo_url ? (
                  <img
                    src={employee.photo_url}
                    alt={employee.name}
                    className="w-32 h-32 rounded-full object-cover border-4 border-primary"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-gray-200 border-4 border-primary flex items-center justify-center">
                    <span className="text-4xl text-gray-400">{employee.name.charAt(0)}</span>
                  </div>
                )}
              </div>

              {/* Details */}
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{employee.name}</h3>
                <p className="text-lg text-gray-700 mb-1">{employee.role}</p>
                <p className="text-sm text-gray-600 mb-1">
                  <span className="font-semibold">ID:</span> {employee.id_number}
                </p>
                <p className="text-sm text-gray-600 mb-1">
                  <span className="font-semibold">Joined:</span>{' '}
                  {new Date(employee.date_of_joining).toLocaleDateString()}
                </p>
                {employee.blood_group && (
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold">Blood Group:</span> {employee.blood_group}
                  </p>
                )}
              </div>
            </div>

            {/* Barcode - Admin only section with download button */}
            <div className="mt-4">
              <div className="flex justify-between items-center mb-2">
                <p className="text-xs text-gray-500 text-center flex-1">Scan barcode to verify</p>
                {/* Download button - Admin only (this page is protected) */}
                {employee.id_number && (
                  <button
                    onClick={handleDownloadBarcode}
                    className="bg-primary text-white px-4 py-1.5 rounded-lg hover:bg-primary/90 transition text-xs font-medium ml-2 flex items-center gap-1"
                    title="Download barcode as image (Admin only)"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download
                  </button>
                )}
              </div>
              {/* Barcode container - this is what gets scanned/downloaded (no button included) */}
              {employee.id_number && (
                <div id="barcode-container" className="bg-white p-3 rounded-lg flex flex-col items-center">
                  <Barcode
                    value={employee.id_number}
                    format="CODE128"
                    width={1.8}
                    height={70}
                    displayValue={true}
                    fontSize={14}
                    margin={10}
                    lineColor="#00184d"
                  />
                  <p className="text-xs text-gray-400 mt-2 text-center">
                    Scan with camera app and visit: {window.location.origin}/v/{employee.id_number}
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="mt-6 pt-4 border-t border-gray-200 text-center">
              <p className="text-xs text-gray-400">Verified by Durkkas Employee ID System</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
