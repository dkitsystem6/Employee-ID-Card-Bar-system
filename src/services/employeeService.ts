import { supabase } from '../lib/supabase'
import { Employee, EmployeeFormData } from '../types/employee'

const BUCKET_NAME = 'employee-photos'

// Get verification base URL (use production URL or current origin for development)
// Using shorter /v/ path to reduce barcode length
const getVerificationBaseUrl = () => {
  if (import.meta.env.PROD) {
    return 'https://durkkas-id.vercel.app/v'
  }
  return `${window.location.origin}/v`
}

export const employeeService = {
  // Get all employees
  async getAll(): Promise<Employee[]> {
    const { data, error } = await supabase
      .from('employees')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  },

  // Get employee by ID number
  async getByIdNumber(idNumber: string): Promise<Employee | null> {
    const { data, error } = await supabase
      .from('employees')
      .select('*')
      .eq('id_number', idNumber)
      .single()

    if (error) {
      if (error.code === 'PGRST116') return null // Not found
      throw error
    }
    return data
  },

  // Upload photo to Supabase storage
  async uploadPhoto(file: File, idNumber: string): Promise<string> {
    const fileExt = file.name.split('.').pop()
    const fileName = `${idNumber}-${Date.now()}.${fileExt}`
    const filePath = `${fileName}`

    const { error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, file)

    if (uploadError) throw uploadError

    const { data } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(filePath)

    return data.publicUrl
  },

  // Create employee
  async create(employeeData: EmployeeFormData): Promise<Employee> {
    let photoUrl: string | null = null

    // Upload photo if provided
    if (employeeData.photo) {
      photoUrl = await this.uploadPhoto(employeeData.photo, employeeData.id_number)
    }

    // Generate QR link
    const qrLink = `${getVerificationBaseUrl()}/${employeeData.id_number}`

    const { data, error } = await supabase
      .from('employees')
      .insert({
        id_number: employeeData.id_number,
        name: employeeData.name,
        role: employeeData.role,
        date_of_joining: employeeData.date_of_joining,
        blood_group: employeeData.blood_group,
        photo_url: photoUrl,
        qr_link: qrLink,
      })
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Update employee
  async update(id: string, employeeData: Partial<EmployeeFormData>): Promise<Employee> {
    const updateData: any = {
      id_number: employeeData.id_number,
      name: employeeData.name,
      role: employeeData.role,
      date_of_joining: employeeData.date_of_joining,
      blood_group: employeeData.blood_group,
    }

    // Upload new photo if provided
    if (employeeData.photo) {
      updateData.photo_url = await this.uploadPhoto(employeeData.photo, employeeData.id_number!)
    }
    
    // Update QR link if ID number changed
    if (employeeData.id_number) {
      updateData.qr_link = `${getVerificationBaseUrl()}/${employeeData.id_number}`
    }

    const { data, error } = await supabase
      .from('employees')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Delete employee
  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('employees')
      .delete()
      .eq('id', id)

    if (error) throw error
  },
}
