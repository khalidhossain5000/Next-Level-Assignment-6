# Power Pulse

## Load Shedding and Power Management System

Power Pulse is a role-based backend API for managing electrical distribution infrastructure, planned outages, unexpected outages, load-shedding schedules, payments, technicians, and operational analytics. It provides separate workflows for administrators, customers, and technicians so power issues can be reported, assigned, tracked, and analyzed from one system.

## Description

Power Pulse helps an electricity service organization coordinate its day-to-day power management operations:

- Administrators manage users, zones, substations, feeders, areas, outages, schedules, technicians, and payment records.
- Customers view power schedules, report unexpected outages, make restoration-related payments, and review their outage and payment analytics.
- Technicians manage their profiles and update the status of outages assigned to them.
- The analytics module provides customer, technician, and administrator reports.

The application exposes a REST API under `/api/v1`.

## Core Features

### Authentication and user management

- Email registration with email verification
- Login and refresh-token authentication
- Google authentication
- JWT access and refresh tokens
- Cookie-based and `Authorization` header-based authentication
- Profile updates with optional profile image upload
- Role-based access control for admins, customers, and technicians
- User status management, including banning and unbanning

### Distribution infrastructure

- Zone management with optional images
- Substation management
- Feeder management
- Area management
- Public infrastructure listing and detail endpoints

### Outage management

- Customer outage reporting
- Admin outage monitoring
- Technician assignment
- Outage status workflow
- Priority-based outage handling
- Outage filtering, pagination, and search where supported

### Load shedding and planned outages

- Create and manage load-shedding schedules
- Public schedule browsing
- Planned outage scheduling
- Area-based outage planning

### Payments

- Customer payment creation
- SSLCommerz payment integration
- Payment confirmation and verification
- Customer payment history
- Admin payment records and search
- Priority restoration fee support

### Analytics

- Customer outage and spending analytics
- Technician assignment and restoration analytics
- Admin platform-wide analytics
- Outage status and user status breakdowns

## Technology Stack

- **Runtime:** Node.js
- **Language:** TypeScript
- **Framework:** Express 5
- **Database:** PostgreSQL
- **ORM:** Prisma 7
- **Cache and temporary data:** Redis
- **Authentication:** JWT and Google OAuth
- **Validation:** Zod
- **Email:** Nodemailer and EJS templates
- **File storage:** Cloudinary
- **Payments:** SSLCommerz
- **Formatting and linting:** Biome
- **Build tool:** tsup

## Requirements

Install the following before starting the project:

- Node.js 20 or later
- npm
- PostgreSQL
- Redis
- SMTP credentials for email features
- Cloudinary credentials for image uploads
- SSLCommerz credentials for payment features
- Google OAuth credentials if Google login is enabled

## Installation

1. Clone the repository and enter the project directory.

```bash
git clone <repository-url>
cd Next-Level-Assignment-6
```

2. Install dependencies.

```bash
npm install
```

3. Create a `.env` file in the project root using the template below.

4. Generate the Prisma client and apply the existing migrations.

```bash
npx prisma generate --config prisma7.config.ts
npx prisma migrate deploy --config prisma7.config.ts
```

5. Start the development server.

```bash
npm run dev
```

The API will be available at `http://localhost:5000` when `PORT=5000` is configured.

## Environment Variables

Create `.env` in the project root. Values below are examples only; do not commit real secrets.

```env
NODE_ENV=development
PORT=5000

DATABASE_URL="postgresql://postgres:password@localhost:5432/power_pulse?schema=public"

APP_URL=http://localhost:5000
FRONTEND_URL=http://localhost:3000

BCRYPT_SALT_ROUNDS=12
JWT_ACCESS_SECRET=replace-with-a-long-access-secret
JWT_REFRESH_SECRET=replace-with-a-long-refresh-secret
JWT_ACCESS_EXPIRES_IN=1d
JWT_REFRESH_EXPIRES_IN=30d

GOOGLE_CLIENT_ID=your-google-client-id

TESTER_ADMIN_NAME=Tester Admin
TESTER_ADMIN_EMAIL=admin@example.com
TESTER_ADMIN_PASSWORD=change-this-password

TESTER_TECHNICIAN_NAME=Tester Technician
TESTER_TECHNICIAN_EMAIL=technician@example.com
TESTER_TECHNICIAN_PASSWORD=change-this-password

TESTER_CUSTOMER_NAME=Tester Customer
TESTER_CUSTOMER_EMAIL=customer@example.com
TESTER_CUSTOMER_PASSWORD=change-this-password

REDIS_USER=default
REDIS_PASSWORD=your-redis-password
REDIS_HOST=localhost
REDIS_PORT=6379

SMTP_USER=your-smtp-user
SMTP_PASSWORD=your-smtp-password
SMTP_SENDER="Power Pulse <no-reply@example.com>"

CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret

SSL_COMMERZ_STORE_ID=your-store-id
SSL_COMMERZ_STORE_PASSWORD=your-store-password

PRIORITY_RESTORATION_FEE=100
PAYMENT_RESULT_REDIRECT_BASE_URL=http://localhost:3000/payment
```

`APP_URL` is used as the CORS origin by the current application configuration. Update it to the URL of the client application that will call the API.

## Database and Seeding

Prisma uses the PostgreSQL connection in `DATABASE_URL` and loads the schema from `prisma/schema`.

Apply migrations in an existing or production database:

```bash
npx prisma migrate deploy --config prisma7.config.ts
```

Create and apply a new migration during development:

```bash
npx prisma migrate dev --config prisma7.config.ts --name describe-your-change
```

The server runs idempotent startup seed functions automatically. On startup, it creates tester accounts for the admin, technician, and customer roles when they do not already exist. It also seeds sample zones, substations, feeders, and areas using the corresponding `TESTER_*` environment variables.

Do not use real user passwords or production data in the tester seed variables.

## Running the Project

### Development

```bash
npm run dev
```

This runs the TypeScript server with watch mode.

### Production build

```bash
npm run build
npm start
```

The build output is generated in `dist/` and the production server runs the compiled application.

### Code quality

```bash
npm run format:check
npm run lint:check
```

Apply formatting or lint fixes when appropriate:

```bash
npm run format:fix
npm run lint:fix
```

The repository currently does not define an automated test suite. `npm test` is a placeholder command.

## API Documentation

The complete route list, access rules, analytics response fields, and endpoint count are available in [API_DOCUMENTATION.md](API_DOCUMENTATION.md).

Base URL:

```text
http://localhost:5000/api/v1
```

The current API includes 49 registered route declarations across authentication, infrastructure, outages, load shedding, payments, planned outages, administration, and analytics.

### Authentication

Protected endpoints accept an access token in either of these forms:

```http
Authorization: Bearer <access-token>
```

or the `accessToken` cookie issued by the authentication flow.

### Main route groups

| Route group | Base path | Typical access |
| --- | --- | --- |
| Authentication | `/api/v1/auth` | Public and authenticated users |
| Technician profile | `/api/v1/technician` | Technician |
| Infrastructure | `/api/v1/zone`, `/substation`, `/feeder`, `/area` | Public and admin |
| Unexpected outages | `/api/v1/outage` | Customer, technician, and admin |
| Load shedding | `/api/v1/load-shedding` | Public and admin |
| Payments | `/api/v1/payment` | Customer and admin |
| Planned outages | `/api/v1/planned-outage` | Public, customer, and admin |
| Administration | `/api/v1/admin` | Admin |
| Analytics | `/api/v1/analytics` | Role-specific |

## User Roles

### Admin

Administrators manage users, technicians, infrastructure, outage assignments, load-shedding schedules, planned outages, payment records, and platform analytics.

### Customer

Customers register, verify their email, view schedules, report outages, make payments, view payment history, and access personal analytics.

### Technician

Technicians maintain their profile, view assigned outage work, and update outage progress according to the outage workflow.

## Project Structure

```text
prisma/
  migrations/              Database migration history
  schema/                  Modular Prisma schema files
src/
  app/
    config/                Environment configuration
    interfaces/            Shared TypeScript interfaces
    lib/                   Database and third-party integrations
    middlewares/           Authentication, validation, and error handling
    modules/               Feature modules and route handlers
    templates/             Email templates
    utils/                 Shared utilities and startup seed functions
  app.ts                   Express application and route registration
  server.ts                Database, Redis, seed, mail, and HTTP startup
API_DOCUMENTATION.md       Detailed API route documentation
prisma7.config.ts          Prisma CLI configuration
```

## Error Handling and Validation

The API uses shared middleware for:

- Request validation
- Authentication and role checks
- Global error handling
- Not-found responses
- Standardized API responses

Request and response examples should be maintained alongside the detailed endpoint documentation as the API evolves.

## Deployment Notes

Before deploying:

1. Configure all required environment variables in the hosting platform.
2. Provision PostgreSQL and Redis instances reachable by the application.
3. Run `npm run build` during the build step.
4. Run `npx prisma migrate deploy --config prisma7.config.ts` against the target database.
5. Start the application with `npm start`.
6. Set `APP_URL` to the allowed frontend origin and configure payment redirect URLs for the deployed environment.
7. Keep secrets, database credentials, and payment credentials outside source control.

## License

This project is released under the ISC license as declared in `package.json`.

## Author

Md Khalid Hossain
