# Admin Login Credentials Setup Guide

## Creating Your Admin Account

Since this application uses Supabase Authentication, you need to create an admin user through the Supabase dashboard.

### Step-by-Step Instructions:

#### Option 1: Create User in Supabase Dashboard (Recommended)

1. **Log in to Supabase**
   - Go to [https://supabase.com](https://supabase.com)
   - Log in to your account

2. **Navigate to Your Project**
   - Select the project you created for this application

3. **Go to Authentication**
   - In the left sidebar, click **Authentication**
   - Click on **Users** tab

4. **Create New User**
   - Click the **Add user** button (or **New user**)
   - Select **Create new user**
   - Fill in the form:
     - **Email**: Enter your admin email (e.g., `admin@durkkas.com`)
     - **Password**: Create a strong password
     - **Auto Confirm User**: ✅ Check this box (important!)
   - Click **Create user**

5. **Save Your Credentials**
   - Note down your email and password
   - These will be your admin login credentials

#### Option 2: Sign Up via the Application (Alternative)

If you want to allow sign-ups through the application:

1. You can modify the Login page to include a "Sign Up" link
2. Users can then register themselves
3. This requires additional setup in Supabase Authentication settings

### Important Notes:

⚠️ **Auto Confirm User**: Make sure to check "Auto Confirm User" when creating the user in Supabase, otherwise you won't be able to log in.

🔐 **Email Confirmation**: By default, Supabase may require email confirmation. You can:
- Disable email confirmation in Supabase Settings → Authentication → Email Auth
- Or use the "Auto Confirm User" option when creating the user

### Testing Your Login:

1. Run the application: `npm run dev`
2. Navigate to the login page: `http://localhost:5173/login`
3. Enter your email and password
4. You should be redirected to the dashboard

### Troubleshooting:

**Can't log in?**
- Verify the user exists in Supabase → Authentication → Users
- Check that "Auto Confirm User" was selected when creating the user
- Ensure email confirmation is disabled or you've confirmed your email
- Check browser console for error messages

**Forgot password?**
- In Supabase dashboard → Authentication → Users
- Find your user and click the three dots menu
- Select "Reset Password" to send a reset email

### Example Admin Credentials:

For testing purposes, you can use:
- **Email**: `admin@durkkas.com`
- **Password**: `Admin123!` (or any secure password of your choice)

Remember to use strong passwords in production!

---

**Next Steps:**
Once you have your admin credentials set up, you can:
1. Log in to the application
2. Start adding employees through the dashboard
3. Generate ID cards with QR codes

