# 📊 E-PNMLS Data Migration Guide

Complete step-by-step guide to migrate data from MySQL (Laravel) to PostgreSQL (Supabase).

## 🎯 Overview

This migration script converts your existing MySQL database data into Supabase PostgreSQL format and populates real agent data into your dashboard.

### What Gets Migrated
- ✅ **Departments** (10+)
- ✅ **Fonctions** (Job titles: 49+)
- ✅ **Grades** (11 hierarchy levels)
- ✅ **Agents** (77 active agents)
- ✅ **Users** (9 users with roles)
- ✅ **Affectations** (Agent assignments)

### What Changes in Dashboard
- **Before**: Hardcoded stats (42 agents, 8 requests, 15 tasks, 3 notifications)
- **After**: Real live data from Supabase database

---

## ⚙️ Prerequisites

### 1. Environment Variables
Create or update `.env.local` with your Supabase credentials and MySQL connection:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# MySQL (Original Laravel Database)
DB_HOST=localhost
DB_PORT=3306
DB_USER=u605154961_pnmls_user
DB_PASSWORD=your_mysql_password
DB_DATABASE=u605154961_pnmls
```

### 2. Install Dependencies

```bash
npm install mysql2
# or with yarn
yarn add mysql2
```

---

## 📥 Step-by-Step Migration

### Step 1: Prepare Supabase
1. Open [Supabase Dashboard](https://app.supabase.com)
2. Go to SQL Editor
3. Run the schema and seed data scripts:
   - Go to `supabase-schema.sql` and execute
   - Go to `supabase-seed-data.sql` and execute (loads roles, permissions, provinces)

### Step 2: Run Migration Script

```bash
# Install dependencies (if not already done)
npm install

# Run the migration
npm run db:migrate
```

### Expected Output:
```
🚀 Starting E-PNMLS Data Migration

✅ Connected to MySQL
📦 Migrating departments...
✅ 10 departments migrated
📦 Migrating fonctions (job titles)...
✅ 49 fonctions migrated
📦 Migrating grades...
✅ 11 grades migrated
📦 Migrating agents...
✅ 77 agents migrated, 0 errors
📦 Migrating users...
✅ Users migrated
📦 Migrating affectations...
✅ 3 affectations migrated

✨ Migration completed successfully!
```

### Step 3: Verify Migration

Check your Supabase database:

```sql
-- In Supabase SQL Editor
SELECT COUNT(*) FROM agents WHERE is_active = true;  -- Should show ~77
SELECT COUNT(*) FROM departments;                     -- Should show ~10
SELECT COUNT(*) FROM grades;                          -- Should show 11
SELECT COUNT(*) FROM fonctions;                       -- Should show 49+
```

### Step 4: Test Dashboard
1. Start the dev server:
   ```bash
   npm run dev
   ```

2. Login to the app at `http://localhost:3000`

3. Go to Dashboard - **Stats should now show real data!**
   - 👥 Agents: Should show ~77
   - 📋 Pending Requests: Will show real requests count
   - 🎯 Tasks: Will show real tasks count
   - 🔔 Notifications: Will show real notifications count

---

## 📱 API Endpoints Created

### Dashboard Stats
```
GET /api/dashboard/stats
Returns: { agents, requests, tasks, notifications }
```

### Agents
```
GET /api/agents                # List all active agents
POST /api/agents               # Create new agent
```

### Requests
```
GET /api/requests              # Get user requests
POST /api/requests             # Create request
```

### Pointages (Attendance)
```
GET /api/pointages             # Get attendance records
POST /api/pointages            # Record attendance
```

---

## 🆘 Troubleshooting

### Issue: "Missing Supabase URL or Anon Key"
**Solution**: Check `.env.local` has correct Supabase credentials

### Issue: MySQL Connection Failed
**Solution**:
```bash
# Verify MySQL credentials
# Test connection manually:
mysql -h localhost -u your_user -p your_database
# Check ports: MySQL default 3306
```

### Issue: Migration Incomplete
**Solution**:
```bash
# Check logs for errors
# Re-run migration after fixing MySQL access
npm run db:migrate
```

### Issue: Dashboard Still Shows Hardcoded Numbers
**Solution**:
1. Clear browser cache: `Ctrl+Shift+Delete`
2. Hard refresh: `Ctrl+Shift+R`
3. Restart dev server: `npm run dev`
4. Verify Supabase has data: Check in Supabase dashboard

---

## 🔒 Security Notes

- ✅ Migration uses Supabase Service Role Key (server-side only)
- ✅ Original MySQL database remains unchanged
- ✅ Data validation happens during migration
- ⚠️ **Never commit .env.local** to Git

---

## 📊 After Migration

Your dashboard will now display:
- **Real agent count** from Supabase
- **Real request statistics**
- **Real task assignments**
- **Real notifications count**

All data is fetched via API endpoints from Supabase in real-time.

---

## 🚀 Next Steps After Migration

1. ✅ Create agents in Supabase (your 77 agents are now loaded)
2. ⏭️ Create requests via the app
3. ⏭️ Assign tasks to agents
4. ⏭️ Track attendance (pointages)
5. ⏭️ Manage documents

Your E-PNMLS app is now **fully connected to real data!** 🎉
