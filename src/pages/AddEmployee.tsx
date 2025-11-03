import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { employeeService } from '../services/employeeService'
import Navbar from '../components/Navbar'
import toast from 'react-hot-toast'

export default function AddEmployee() {
  const [searchParams] = useSearchParams()
  const editId = searchParams.get('edit')
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    id_number: '',
    name: '',
    role: '',
    date_of_joining: '',
    blood_group: '',
  })
  const [photo, setPhoto] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [loadingEmployee, setLoadingEmployee] = useState(false)

  useEffect(() => {
    if (editId) {
      loadEmployee()
    }
  }, [editId])

  const loadEmployee = async () => {
    try {
      setLoadingEmployee(true)
      const employees = await employeeService.getAll()
      const employee = employees.find((e) => e.id === editId)
      if (employee) {
        setFormData({
          id_number: employee.id_number,
          name: employee.name,
          role: employee.role,
          date_of_joining: employee.date_of_joining,
          blood_group: employee.blood_group,
        })
        if (employee.photo_url) {
          setPhotoPreview(employee.photo_url)
        }
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to load employee')
    } finally {
      setLoadingEmployee(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setPhoto(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (editId) {
        await employeeService.update(editId, { ...formData, photo: photo || undefined })
        toast.success('Employee updated successfully!')
      } else {
        await employeeService.create({ ...formData, photo: photo || undefined })
        toast.success('Employee added successfully!')
      }
      navigate('/dashboard')
    } catch (error: any) {
      toast.error(error.message || 'Failed to save employee')
    } finally {
      setLoading(false)
    }
  }

  if (loadingEmployee) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          {editId ? 'Edit Employee' : 'Add New Employee'}
        </h1>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-6 space-y-6">
          <div>
            <label htmlFor="id_number" className="block text-sm font-medium text-gray-700 mb-2">
              Employee ID <span className="text-red-500">*</span>
            </label>
            <input
              id="id_number"
              name="id_number"
              type="text"
              value={formData.id_number}
              onChange={handleInputChange}
              required
              disabled={!!editId}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none disabled:bg-gray-100"
              placeholder="e.g., DI-3001"
            />
          </div>

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
              Role/Designation <span className="text-red-500">*</span>
            </label>
            <input
              id="role"
              name="role"
              type="text"
              value={formData.role}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              placeholder="Software Engineer"
            />
          </div>

          <div>
            <label htmlFor="date_of_joining" className="block text-sm font-medium text-gray-700 mb-2">
              Date of Joining <span className="text-red-500">*</span>
            </label>
            <input
              id="date_of_joining"
              name="date_of_joining"
              type="date"
              value={formData.date_of_joining}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
            />
          </div>

          <div>
            <label htmlFor="blood_group" className="block text-sm font-medium text-gray-700 mb-2">
              Blood Group
            </label>
            <select
              id="blood_group"
              name="blood_group"
              value={formData.blood_group}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
            >
              <option value="">Select Blood Group</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
            </select>
          </div>

          <div>
            <label htmlFor="photo" className="block text-sm font-medium text-gray-700 mb-2">
              Photo
            </label>
            <input
              id="photo"
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
            />
            {photoPreview && (
              <div className="mt-4">
                <img
                  src={photoPreview}
                  alt="Preview"
                  className="w-32 h-32 rounded-full object-cover border-2 border-gray-300"
                />
              </div>
            )}
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : editId ? 'Update Employee' : 'Add Employee'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

