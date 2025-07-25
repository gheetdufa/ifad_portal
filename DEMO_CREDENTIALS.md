# IFAD Portal Demo Credentials & Testing Guide

## 🔐 Demo Account Access

### Host Account
- **Email:** `demo.host@capitalone.com`
- **Password:** `DemoPass123!`
- **Role:** Host (Capital One Software Engineer)
- **Access:** Direct login via Host option

### Admin Account (Hidden Access)
- **Email:** `admin@umd.edu` 
- **Password:** `AdminPass123!`
- **Role:** System Administrator
- **Access:** Hidden admin portal (see instructions below)

### Student Account  
- **Authentication:** UMD CAS only
- **Demo ID:** `testudent@umd.edu`
- **Note:** Students must use University of Maryland CAS authentication

## 🕵️ Hidden Admin Portal Access

The admin portal is intentionally hidden from the main login interface for security. To access it:

1. **Navigate to the login page**
2. **Triple-click the "Host" button rapidly** (3 quick clicks)
3. **Admin button will appear** with a red color and pulse animation
4. **Click the Admin button** to switch to admin login mode
5. **Use admin credentials** to log in

### Security Features:
- ✅ Admin button only appears after triple-click sequence
- ✅ Admin button auto-hides after 5 seconds of inactivity
- ✅ Visual warning about restricted access
- ✅ No direct navigation or URL access to admin portal

## 🧪 Testing the Authentication

### Backend Testing
```bash
# Test that demo accounts exist and work
cd backend
npm run test-auth

# Re-seed demo data if needed
npm run seed-demo
```

### Frontend Testing
1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Navigate to:** `http://localhost:5173/ifad_portal/login`

3. **Test each user type:**
   - **Student:** Click Student → "Sign In with UMD CAS" 
   - **Host:** Click Host → Enter host credentials
   - **Admin:** Triple-click Host → Click Admin → Enter admin credentials

## 🎯 Expected Behavior

### Host Login Flow
1. User selects "Host" option
2. Enters `demo.host@capitalone.com` / `DemoPass123!`
3. Redirects to `/host` dashboard
4. Can access host registration, applications, etc.

### Admin Login Flow (Hidden)
1. User triple-clicks "Host" button
2. Admin button appears in red
3. User clicks Admin button
4. Enters `admin@umd.edu` / `AdminPass123!`
5. Redirects to `/admin` dashboard  
6. Full administrative access

### Student Login Flow
1. User selects "Student" option
2. Clicks "Sign In with UMD CAS"
3. Redirects to UMD CAS authentication
4. After authentication, returns to student portal

## 🛠️ Troubleshooting

### If Demo Accounts Don't Work:
```bash
# Check if AWS credentials are set
echo $AWS_ACCESS_KEY_ID

# Re-seed the demo data
cd backend
npm run seed-demo

# Verify accounts were created
npm run test-auth
```

### If Admin Access Doesn't Appear:
- Make sure you're triple-clicking the Host button rapidly
- The admin button appears for only 5 seconds
- Try refreshing the page and attempting again

### If Authentication Fails:
- Check that the backend is deployed and running
- Verify AWS Cognito User Pool is accessible
- Check browser console for error messages

## 🔒 Security Notes

- **Admin access is intentionally hidden** to prevent unauthorized access
- **Demo credentials are for testing only** and should be changed in production
- **Student authentication requires real UMD CAS** for security
- **All demo accounts have appropriate role restrictions** in the backend

## 📝 Demo Data Included

The demo accounts include:

### Demo Host (Capital One):
- ✅ Complete host profile with all required fields
- ✅ Capital One company information and logo
- ✅ Career fields: Computing/Technology, Business  
- ✅ In-person shadowing opportunity in McLean, VA
- ✅ Available all weekdays, interested in recruitment

### Demo Admin:
- ✅ Full administrative permissions
- ✅ Access to user management, host approval, reports
- ✅ System configuration capabilities

### Demo Student (CAS):
- ✅ Computer Science major, graduating 2025
- ✅ Ready for orientation and host matching
- ✅ Uses UMD CAS authentication

## 🚀 Ready for Testing!

The IFAD Portal is now set up with working demo credentials and hidden admin access. The authentication flows have been tested and verified to work with the deployed backend infrastructure.