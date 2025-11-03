import { Link, useNavigate } from 'react-router-dom'
import { authService } from '../services/authService'
import toast from 'react-hot-toast'

interface NavbarProps {
  showDashboardLink?: boolean
}

export default function Navbar({ showDashboardLink = true }: NavbarProps) {
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await authService.signOut()
      toast.success('Logged out successfully')
      navigate('/login')
    } catch (error: any) {
      toast.error(error.message || 'Logout failed')
    }
  }

  return (
    <nav className="bg-primary text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to={showDashboardLink ? '/dashboard' : '/'} className="text-xl font-bold">
            Durkkas Employee ID System
          </Link>
          
          {showDashboardLink && (
            <div className="flex items-center gap-4">
              <Link
                to="/dashboard"
                className="hover:text-purple-200 transition px-3 py-2 rounded"
              >
                Dashboard
              </Link>
              <Link
                to="/add-employee"
                className="bg-white text-primary px-4 py-2 rounded-lg hover:bg-gray-100 transition font-medium"
              >
                Add Employee
              </Link>
              <button
                onClick={handleLogout}
                className="hover:text-purple-200 transition px-3 py-2 rounded"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

