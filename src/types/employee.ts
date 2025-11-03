export interface Employee {
  id: string
  id_number: string
  name: string
  role: string
  date_of_joining: string
  blood_group: string
  photo_url: string | null
  qr_link: string | null
  created_at: string
}

export interface EmployeeFormData {
  id_number: string
  name: string
  role: string
  date_of_joining: string
  blood_group: string
  photo?: File
}

