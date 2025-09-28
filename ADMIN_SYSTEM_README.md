# eGrowtify Admin System

## Overview

The eGrowtify admin system provides comprehensive administrative capabilities for managing users, content, feedback, and system reports. The system implements role-based access control to ensure that only authorized administrators can access sensitive administrative functions.

## Features

### 🔐 Role-Based Access Control
- **Admin Role**: Full access to all administrative functions
- **User Role**: Standard user access with no admin privileges
- **Secure Authentication**: Admin routes are protected and require proper authentication

### 📊 Admin Dashboard
- **System Statistics**: View total users, active users, feedback count, and system health
- **Quick Actions**: Fast access to common administrative tasks
- **Navigation Hub**: Centralized access to all admin management features

### 👥 User Management
- **View All Users**: Complete list of registered users with detailed information
- **User Details**: View comprehensive user profiles including contact info, learning level, and activity
- **User Status Control**: Activate/deactivate user accounts
- **User Deletion**: Remove user accounts (with protection for admin accounts)
- **Search & Filter**: Find users by name, email, or role

### 📚 Content Management
- **Learning Paths**: Manage educational content and modules
- **AI Data**: Configure AI recognition models and accuracy settings
- **Notifications**: Control system-wide notifications and announcements
- **Seasonal Content**: Manage seasonal planning guides and tips
- **Rollback System**: Undo content changes when needed

### 💬 Feedback Management
- **View Feedback**: Read user feedback and suggestions
- **Respond to Users**: Reply to user messages directly
- **Feedback Analytics**: Track satisfaction scores and trends
- **Status Management**: Mark feedback as read, replied, or new

### 📈 Reports & Analytics
- **User Activity Reports**: Track user engagement and activity patterns
- **Learning Analytics**: Analyze learning path completion and progress
- **System Performance**: Monitor system health and performance metrics
- **Feedback Analysis**: Generate reports on user satisfaction and feedback trends

## Admin Access

### Creating an Admin User

1. **Using the Script** (Recommended):
   ```bash
   python create_admin_user.py
   ```
   This creates an admin user with:
   - Email: `admin@egrowtify.com`
   - Password: `admin123`
   - Role: `admin`

2. **Manual Creation**:
   - Update a user's role to 'admin' in the database
   - Ensure the user has `is_active=True` and `email_verified=True`

### Admin Login
1. Navigate to the login page
2. Use admin credentials to log in
3. The system will automatically detect admin role and show admin navigation

## Navigation Structure

### Admin Routes
- `/admin` - Main admin dashboard
- `/admin/users` - User management
- `/admin/content` - Content management
- `/admin/feedback` - Feedback management
- `/admin/reports` - Reports and analytics

### User vs Admin Experience
- **Regular Users**: See standard user dashboard and features
- **Admin Users**: See admin panel button in user dashboard + full admin access
- **Role Separation**: Users cannot access admin routes, admins can access both

## Security Features

### Access Control
- **Route Protection**: All admin routes require admin authentication
- **Role Verification**: Server-side validation of admin privileges
- **Session Management**: Secure session handling for admin users

### Data Protection
- **Admin Account Protection**: Admins cannot delete other admin accounts
- **User Data Privacy**: Proper handling of sensitive user information
- **Audit Trail**: All admin actions are logged (in production)

## API Endpoints

### Admin Statistics
- `GET /api/admin/stats` - Get system statistics

### User Management
- `GET /api/admin/users` - List all users
- `DELETE /api/admin/users/<id>` - Delete user
- `PATCH /api/admin/users/<id>/status` - Toggle user status

### Content Management
- `GET /api/admin/learning-paths` - Get learning paths
- `GET /api/admin/ai-data` - Get AI model data
- `GET /api/admin/notifications` - Get system notifications
- `GET /api/admin/seasonal-content` - Get seasonal content
- `POST /api/admin/rollback/<type>/<id>` - Rollback content changes

### Feedback Management
- `GET /api/admin/feedback` - Get user feedback
- `POST /api/admin/feedback/<id>/reply` - Reply to feedback
- `PATCH /api/admin/feedback/<id>/status` - Update feedback status

### Reports
- `GET /api/admin/reports` - List generated reports
- `POST /api/admin/reports/generate` - Generate new report
- `GET /api/admin/reports/<id>/download` - Download report

## File Structure

```
src/
├── pages/
│   ├── AdminDashboard.jsx          # Main admin dashboard
│   └── admin/
│       ├── UserManagement.jsx      # User management interface
│       ├── ContentManagement.jsx   # Content management interface
│       ├── FeedbackManagement.jsx  # Feedback management interface
│       └── Reports.jsx             # Reports and analytics
├── components/
│   └── AdminRoute.jsx              # Route protection for admin pages
└── contexts/
    └── AuthContext.jsx             # Authentication with admin role support

website/
└── views.py                        # Backend API endpoints for admin functions
```

## Usage Instructions

### For Administrators

1. **Access Admin Panel**:
   - Log in with admin credentials
   - Click "Admin Panel" button in user dashboard
   - Or navigate directly to `/admin`

2. **Manage Users**:
   - View all registered users
   - Search and filter users
   - View detailed user information
   - Activate/deactivate accounts
   - Delete user accounts (except other admins)

3. **Manage Content**:
   - Edit learning paths and modules
   - Configure AI recognition data
   - Manage system notifications
   - Update seasonal content
   - Rollback changes when needed

4. **Handle Feedback**:
   - Read user feedback and suggestions
   - Reply to user messages
   - Track feedback status and trends

5. **Generate Reports**:
   - Create user activity reports
   - Generate learning analytics
   - Monitor system performance
   - Download reports in various formats

### For Regular Users

- Regular users have no access to admin functions
- They see only their standard user dashboard
- Admin routes are completely hidden and inaccessible

## Development Notes

### Adding New Admin Features

1. **Frontend**:
   - Create new admin component in `src/pages/admin/`
   - Add route to `src/App.jsx` with `AdminRoute` protection
   - Update admin dashboard navigation

2. **Backend**:
   - Add new API endpoints in `website/views.py`
   - Ensure proper admin authentication checks
   - Add appropriate error handling

### Security Considerations

- Always verify admin role on server-side
- Never trust client-side role information
- Implement proper session management
- Log all admin actions for audit purposes
- Use HTTPS in production

## Testing

### Admin User Testing
1. Create admin user using the script
2. Log in with admin credentials
3. Verify admin panel access
4. Test all admin functions
5. Verify regular users cannot access admin routes

### Role Separation Testing
1. Create regular user account
2. Verify no admin access
3. Try accessing admin routes directly
4. Confirm proper error messages

## Production Deployment

### Security Checklist
- [ ] Change default admin password
- [ ] Enable HTTPS
- [ ] Configure proper session security
- [ ] Set up admin action logging
- [ ] Implement rate limiting on admin routes
- [ ] Regular security audits

### Monitoring
- Monitor admin login attempts
- Track admin actions and changes
- Set up alerts for suspicious activity
- Regular backup of admin configurations

## Support

For issues or questions about the admin system:
1. Check the console for error messages
2. Verify admin user has proper role and permissions
3. Ensure all API endpoints are accessible
4. Check database connectivity and user data

---

**Note**: This admin system is designed for internal use by authorized administrators only. All admin functions require proper authentication and role verification.
