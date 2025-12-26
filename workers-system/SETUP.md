# Workers Management System

A comprehensive system for managing employees and work accounts.

## Initial Setup

After deployment, run the following to create your first manager account:

```bash
node prisma/setup-manager.js
```

**Default credentials:**
- Username: `admin`
- Password: `admin123`

⚠️ **IMPORTANT:** Edit `prisma/setup-manager.js` and change the username and password before running!

## Database Management

### Clear all data (reset):
```bash
node prisma/reset.js
```

### Seed with test data:
```bash
node prisma/seed.js
```

## Features

### Manager Dashboard
- Employee management (add/remove employees)
- Account management (create/edit/delete accounts)
- Assign accounts to employees
- Track earnings and claims
- Payroll management
- Auto-logout after 5 minutes of inactivity

### Employee Dashboard
- View assigned accounts
- Accept/Pause/Leave accounts
- Submit task claims with screenshots
- Track earnings

## Environment Variables

Required in `.env`:
```
DATABASE_URL="your-postgresql-connection-string"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

## Development

```bash
npm install
npm run dev
```

## Production

```bash
npm run build
npm start
```
