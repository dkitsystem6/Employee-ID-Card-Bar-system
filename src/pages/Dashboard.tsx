import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { employeeService } from '../services/employeeService'
import { Employee } from '../types/employee'
import Navbar from '../components/Navbar'
import toast from 'react-hot-toast'

export default function Dashboard() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<'name' | 'id_number' | 'date_of_joining'>('date_of_joining')

  useEffect(() => {
    loadEmployees()
  }, [])

  const loadEmployees = async () => {
    try {
      setLoading(true)
      const data = await employeeService.getAll()
      setEmployees(data)
    } catch (error: any) {
      toast.error(error.message || 'Failed to load employees')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete ${name}?`)) return

    try {
      await employeeService.delete(id)
      toast.success('Employee deleted successfully')
      loadEmployees()
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete employee')
    }
  }

  const filteredAndSorted = employees
    .filter((emp) =>
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.id_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.role.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name)
      if (sortBy === 'id_number') return a.id_number.localeCompare(b.id_number)
      return new Date(b.date_of_joining).getTime() - new Date(a.date_of_joining).getTime()
    })

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-3xl font-bold text-gray-900">Employee Dashboard</h1>
          <Link
            to="/add-employee"
            className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition font-medium"
          >
            + Add Employee
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              placeholder="Search by name, ID, or role..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
            />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
            >
              <option value="date_of_joining">Sort by Date</option>
              <option value="name">Sort by Name</option>
              <option value="id_number">Sort by ID</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          </div>
        ) : filteredAndSorted.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <p className="text-gray-500 text-lg">No employees found.</p>
            <Link to="/add-employee" className="text-primary hover:underline mt-4 inline-block">
              Add your first employee
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSorted.map((employee) => (
              <div key={employee.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    {employee.photo_url ? (
                      <img
                        src={employee.photo_url}
                        alt={employee.name}
                        className="w-20 h-20 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-2xl text-gray-400">{employee.name.charAt(0)}</span>
                      </div>
                    )}
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                      {employee.id_number}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">{employee.name}</h3>
                  <p className="text-gray-600 mb-2">{employee.role}</p>
                  <p className="text-sm text-gray-500 mb-4">
                    Joined: {new Date(employee.date_of_joining).toLocaleDateString()}
                  </p>

                  <div className="flex gap-2 mt-4">
                    <Link
                      to={`/employee/${employee.id_number}`}
                      className="flex-1 text-center bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition text-sm font-medium"
                    >
                      View ID
                    </Link>
                    <Link
                      to={`/add-employee?edit=${employee.id}`}
                      className="flex-1 text-center bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition text-sm font-medium"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(employee.id, employee.name)}
                      className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition text-sm font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

