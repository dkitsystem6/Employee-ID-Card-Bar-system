import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { employeeService } from '../services/employeeService'
import { Employee } from '../types/employee'
import toast from 'react-hot-toast'

export default function Verify() {
  const { id_number } = useParams<{ id_number: string }>()
  const navigate = useNavigate()
  const [employee, setEmployee] = useState<Employee | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check URL params in case barcode scanner appends to URL
    const urlParams = new URLSearchParams(window.location.search)
    const scannedId = urlParams.get('id') || urlParams.get('scan') || id_number
    
    if (scannedId) {
      loadEmployee(scannedId)
    } else if (id_number) {
      loadEmployee(id_number)
    }
  }, [id_number])

  const loadEmployee = async (employeeId: string) => {
    try {
      setLoading(true)
      const data = await employeeService.getByIdNumber(employeeId)
      setEmployee(data)
      // Update URL if needed
      if (employeeId !== id_number) {
        navigate(`/v/${employeeId}`, { replace: true })
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to verify employee')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/10 via-purple-50 to-indigo-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!employee) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/10 via-purple-50 to-indigo-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Invalid or Unverified ID</h2>
          <p className="text-gray-600 mb-4">
            The employee ID "{id_number || 'scanned code'}" could not be found or verified.
          </p>
          <div className="mt-4 text-sm text-gray-500">
            <p>If you scanned a barcode, make sure:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>The barcode contains a valid employee ID</li>
              <li>The scanner app copied the ID correctly</li>
            </ul>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-purple-50 to-indigo-50 flex items-center justify-center px-4 py-10">
      <div className="max-w-sm w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="mb-6">
          <div className="inline-block p-2 bg-green-100 rounded-full mb-4">
            <svg
              className="w-12 h-12 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="text-sm font-semibold text-green-600 uppercase tracking-wide mb-2">
            Verified Employee
          </h2>
        </div>

        {employee.photo_url ? (
          <img
            src={employee.photo_url}
            alt={employee.name}
            className="rounded-full w-32 h-32 mx-auto mb-6 object-cover border-4 border-primary/20"
          />
        ) : (
          <div className="rounded-full w-32 h-32 mx-auto mb-6 bg-gray-200 border-4 border-primary/20 flex items-center justify-center">
            <span className="text-4xl text-gray-400">{employee.name.charAt(0)}</span>
          </div>
        )}

        <h2 className="text-2xl font-bold text-gray-900 mb-2">{employee.name}</h2>
        <p className="text-gray-600 text-lg mb-4">{employee.role}</p>

        <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-left mb-6">
          <div className="flex justify-between">
            <span className="text-gray-600">Employee ID:</span>
            <span className="font-semibold text-gray-900">{employee.id_number}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Date of Joining:</span>
            <span className="font-semibold text-gray-900">
              {new Date(employee.date_of_joining).toLocaleDateString()}
            </span>
          </div>
          {employee.blood_group && (
            <div className="flex justify-between">
              <span className="text-gray-600">Blood Group:</span>
              <span className="font-semibold text-gray-900">{employee.blood_group}</span>
            </div>
          )}
        </div>

        <p className="text-xs text-gray-400 mt-6">
          Verified by Durkkas Employee ID System
        </p>
      </div>
    </div>
  )
}

