# MongoDB Atlas Setup Guide

## Quick Setup (2 minutes)

### 1. Create Free MongoDB Atlas Account
1. Go to https://www.mongodb.com/cloud/atlas/register
2. Sign up with Google/GitHub or email
3. Choose **FREE M0 cluster** (512MB, perfect for development)

### 2. Create a Cluster
1. After signup, click "Build a Database"
2. Choose **M0 FREE** tier
3. Select a cloud provider (AWS recommended) and region closest to you
4. Name your cluster (e.g., "portfolio-cluster")
5. Click "Create Cluster" (takes 1-3 minutes)

### 3. Create Database User
1. Click "Database Access" in left sidebar
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Username: `portfolio`
5. Password: Click "Autogenerate Secure Password" and **COPY IT**
6. Database User Privileges: Select "Atlas admin"
7. Click "Add User"

### 4. Allow Network Access
1. Click "Network Access" in left sidebar
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (for development)
   - Or add your current IP for better security
4. Click "Confirm"

### 5. Get Connection String
1. Click "Database" in left sidebar
2. Click "Connect" button on your cluster
3. Choose "Connect your application"
4. Driver: **Node.js**, Version: **6.6 or later**
5. Copy the connection string - it looks like:
   ```
   mongodb+srv://portfolio:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
6. Replace `<password>` with the password you copied in step 3
7. Add database name after `.net/`: `.../portfolio?retryWrites...`

### Example Connection String
```env
DATABASE_URL="mongodb+srv://portfolio:MySecurePass123@cluster0.abc12.mongodb.net/portfolio?retryWrites=true&w=majority"
```

## Update Your .env File

Open `.env` and replace the DATABASE_URL with your MongoDB connection string.

## Then Run Setup Commands

```powershell
# Generate Prisma Client
npx prisma generate

# Push schema to MongoDB (creates collections)
npx prisma db push

# Seed database with sample data
npm run db:seed

# Start development server
npm run dev
```

## Troubleshooting

### "MongoServerError: bad auth"
- Check that password in connection string is correct
- Ensure no special characters need URL encoding

### "Could not connect to any servers"
- Check Network Access settings in Atlas
- Ensure IP is whitelisted (or use "Allow from Anywhere")
- Check internet connection

### "Authentication failed"
- Verify database user exists in "Database Access"
- Check username and password match

## Free Tier Limits
- **Storage**: 512 MB
- **RAM**: Shared
- **Connections**: 500 concurrent
- **Perfect for**: Development, portfolios, small projects
- **Cost**: $0/month forever

## Tips
- You can view/edit data using MongoDB Compass (GUI tool)
- Download: https://www.mongodb.com/products/compass
- Use the same connection string
