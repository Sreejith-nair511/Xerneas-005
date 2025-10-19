# Database Disable Guide

This guide explains how the database has been temporarily disabled and how to re-enable it when needed.

## Current State

The database has been temporarily disabled to allow the application to function without file-based storage. Instead, the application now uses an in-memory temporary user store.

## How It Works

1. **Environment Variable Control**: The `ENABLE_DATABASE` environment variable controls whether the database is active:
   - `ENABLE_DATABASE=true` - Uses the file-based database (default when re-enabled)
   - `ENABLE_DATABASE=false` - Uses temporary in-memory storage (current state)

2. **Temporary Storage**: When the database is disabled, all user operations are handled by `lib/temp-user-store.ts` which:
   - Stores users in memory only (lost when server restarts)
   - Provides the same interface as the database functions
   - Allows basic user authentication and management

3. **API Routes Updated**: The following API routes have been modified to work with temporary storage:
   - `/api/auth/signup` - Creates temporary users
   - `/api/auth/login` - Authenticates against temporary users
   - `/api/premium/upgrade` - Updates premium status temporarily

## Re-enabling the Database

To re-enable the database:

1. **Update Environment Variables**:
   ```env
   # Change this line in .env.local
   ENABLE_DATABASE=true
   ```

2. **No Code Changes Required**: The existing code automatically switches between database and temporary storage based on the environment variable.

3. **Database Initialization**: The database will be automatically created when first accessed.

## Testing the Current Setup

With the database disabled, you can test the application:

1. **Signup**: Creates a temporary user (not persisted)
2. **Login**: Authenticates against temporary users or creates a temporary user if none exists
3. **Premium Upgrade**: Temporarily upgrades user status

## Limitations of Temporary Mode

1. **Data Persistence**: All user data is lost when the server restarts
2. **User Uniqueness**: No validation for duplicate emails across sessions
3. **Premium Status**: Premium status is temporary and not persisted

## When to Re-enable the Database

Re-enable the database when you need:
- Persistent user accounts
- Real user data storage
- Production deployment
- Multiple server instances

## Re-enabling Process

1. Set `ENABLE_DATABASE=true` in your environment variables
2. Restart the application
3. The database files will be automatically created in the `data/` directory
4. All existing API routes will automatically use the file-based database

## Troubleshooting

If you encounter issues after re-enabling the database:

1. **Permission Errors**: Ensure the application has write permissions to the `data/` directory
2. **File Locks**: Make sure no other processes are accessing the database file
3. **Corrupted Data**: Delete `data/database.json` to start fresh (you'll lose all data)

## Code Structure

The implementation maintains the same interface for both storage methods:
- `lib/db.ts` - Main database interface (conditionally uses temp storage)
- `lib/temp-user-store.ts` - Temporary in-memory storage implementation
- API routes unchanged - they work with both storage methods

This design allows seamless switching between database and temporary storage without code changes.