# Durkkas Employee ID System

A full-stack web application for managing employee records with barcode verification system.

## Features

- 🔐 Admin authentication with Supabase Auth
- 👥 Employee CRUD operations (Create, Read, Update, Delete)
- 📊 Barcode generation for each employee (CODE128 format)
- ✅ Public verification page accessible via barcode scan
- 🎴 Professional ID card preview with PDF download
- 📸 Photo upload to Supabase storage
- 🔍 Search and sort functionality
- 📱 Fully responsive design

## Tech Stack

- **Frontend:** React 18 + TypeScript + Vite
- **Styling:** TailwindCSS
- **Backend:** Supabase (Database, Auth, Storage)
- **Barcode:** react-barcode (CODE128 format)
- **PDF Generation:** html2canvas + jsPDF
- **Routing:** React Router v6
- **Notifications:** react-hot-toast

## Prerequisites

- Node.js 18+ and npm
- A Supabase account (free tier works)

## Setup Instructions

### 1. Clone and Install

```bash
npm install
```

### 2. Supabase Setup

#### A. Create a Supabase Project
1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the project to be fully initialized

#### B. Create the Database Table
1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy and paste the contents of `supabase-setup.sql`
4. Click **Run** to execute the SQL

#### C. Create Storage Bucket
1. Navigate to **Storage** in your Supabase dashboard
2. Click **New bucket**
3. Name it: `employee-photos`
4. Make it **Public** (check the public checkbox)
5. Click **Create bucket**

The SQL file already includes storage policies, but if you need to verify:
- Storage policies should allow public read access
- Authenticated users can upload/update/delete

#### D. Get Your Supabase Credentials
1. Go to **Settings** → **API**
2. Copy your **Project URL** and **anon/public key**

### 3. Environment Variables

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Create Admin User

1. In Supabase dashboard, go to **Authentication** → **Users**
2. Click **Add user** → **Create new user**
3. Enter an email and password (e.g., `admin@durkkas.com` / `YourPassword123!`)
4. ⚠️ **Important:** Check the **"Auto Confirm User"** checkbox
5. Click **Create user**
6. Save these credentials - you'll use them to log in to the app

> 💡 **Tip:** See `ADMIN_SETUP.md` for detailed instructions and troubleshooting.

### 5. Run the Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Usage

1. **Login:** Use the admin credentials you created in Supabase
2. **Add Employee:** Fill out the employee form with:
   - Employee ID (e.g., DI-3001)
   - Name, Role, Date of Joining, Blood Group
   - Upload a photo (optional)
3. **View ID Card:** Click "View ID" on any employee card
4. **Download/Print:** Use the buttons on the ID card page
5. **Verify Employee:** Share the barcode or verification link

## Routes

- `/login` - Admin login page
- `/dashboard` - Employee management dashboard (protected)
- `/add-employee` - Add new employee (protected)
- `/employee/:id_number` - View ID card (protected)
- `/verify/:id_number` - Public verification page (no login required)

## Build

```bash
npm run build
```

The built files will be in the `dist` folder.

## Deployment to Vercel

1. Push your code to GitHub
2. Import the project in Vercel
3. Add environment variables in Vercel dashboard:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Deploy!

The `vercel.json` file is already configured for React Router.

## Project Structure

```
src/
├── components/      # Reusable components (Navbar, ProtectedRoute)
├── lib/            # Supabase client configuration
├── pages/          # Page components (Login, Dashboard, etc.)
├── services/       # API services (employeeService, authService)
├── types/          # TypeScript type definitions
├── App.tsx         # Main app component with routing
└── main.tsx        # Entry point
```

## Security Notes

- Row Level Security (RLS) is enabled on the employees table
- Public read access for verification page
- Authenticated users only can create/update/delete
- Storage bucket allows public reads but authenticated uploads

## Troubleshooting

- **"Missing Supabase environment variables"**: Make sure your `.env` file is in the root directory with correct variable names
- **"Failed to upload photo"**: Check that the storage bucket `employee-photos` exists and policies are set correctly
- **Login issues**: Verify the user exists in Supabase Authentication dashboard
- **Database errors**: Ensure the SQL from `supabase-setup.sql` was executed successfully

## License

This project is open source and available for use.
