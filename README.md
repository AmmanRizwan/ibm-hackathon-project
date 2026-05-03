# IBM Hackathon Project

## **Employee Payment App**

---

## **Table of Contents**

- [Problem Statement](#problem-statement)
- [Solution Overview](#solution-overview)
- [How IBM Bob Was Used](#how-ibm-bob-was-used)
- [Getting Started / Installation](#getting-started--installation)
- [Usage / Demo](#usage--demo)
- [Project Structure](#project-structure)
- [Team Members](#team-members)
- [License](#license)

---

## **Problem Statement**

### What real-world problem are we solving?

Traditional payroll systems force businesses to rely on expensive third-party payment processors that charge hefty subscription fees and transaction costs. Small to medium-sized businesses lose thousands of dollars annually on:

- **Monthly subscription fees** for payroll software
- **Per-transaction fees** charged by payment processors
- **Hidden charges** and complex pricing structures
- **Lack of control** over the payment process
- **Delayed payments** due to intermediary processing times

### Who faces this problem?

- **Small and medium-sized businesses** struggling with high payroll processing costs
- **Startups** looking for cost-effective payroll solutions
- **HR managers** dealing with complex third-party systems
- **Finance teams** seeking transparency and control over employee payments
- **Employees** experiencing delayed payments due to intermediary processing

### Why it matters?

- Companies can **save $15,000+ annually** by eliminating third-party fees
- **Direct payment control** ensures faster, more transparent transactions
- **Reduced administrative overhead** through automation
- **Better cash flow management** without subscription commitments
- **Enhanced security** with direct bank-to-bank transfers

---

## **Solution Overview**

Our **Employee Payment App** is a revolutionary payroll platform that eliminates the middleman, allowing businesses to pay their employees directly without relying on expensive third-party payment processors.

### Key Features

#### 🛡️ **Direct Payment Control**
- Pay employees directly without third-party processors
- Full control over payroll with enhanced security
- Bank-level encryption and security protocols
- Complete transparency in all transactions

#### ⚡ **No Subscription Fees**
- Zero monthly subscriptions or hidden charges
- Pay only for what you use
- Transparent pricing model
- Save thousands annually on payroll processing

#### 📊 **Automated & Efficient**
- Automated invoice generation and sending
- Real-time payment tracking
- Comprehensive transaction history
- Complete audit trail for compliance

#### 👥 **Employee Management**
- Easy employee onboarding and management
- Secure storage of payment details
- Multiple payment method support
- Bulk payment processing

#### 🔒 **Enterprise-Grade Security**
- Bank-level encryption
- Secure authentication with JWT
- OTP-based verification
- Role-based access control

### Architecture Overview

```
┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
│                 │         │                 │         │                 │
│  React Frontend │◄───────►│  Express API    │◄───────►│  PostgreSQL DB  │
│  (Vite + TS)    │         │  (Node.js + TS) │         │  (Sequelize)    │
│                 │         │                 │         │                 │
└─────────────────┘         └─────────────────┘         └─────────────────┘
        │                           │
        │                           │
        ▼                           ▼
┌─────────────────┐         ┌─────────────────┐
│  Redux Toolkit  │         │  Email Service  │
│  State Mgmt     │         │  (Nodemailer)   │
└─────────────────┘         └─────────────────┘
```

**Tech Stack:**
- **Frontend:** React 19, TypeScript, Vite, TailwindCSS, Shadcn/ui, Redux Toolkit
- **Backend:** Node.js, Express 5, TypeScript, Sequelize ORM
- **Database:** PostgreSQL
- **Authentication:** JWT, bcrypt, OTP verification
- **Email:** Nodemailer with EJS templates
- **Automation:** Node-cron for scheduled tasks

---

## **How IBM Bob Was Used**

IBM Bob was instrumental in accelerating the development of this project. Here's how Bob contributed:

### 🤖 **Code Generation**
- Generated boilerplate code for React components and Express routes
- Created TypeScript interfaces and type definitions
- Built reusable UI components with Shadcn/ui
- Scaffolded database models and controllers

### 📝 **Documentation**
- Helped structure and write comprehensive README documentation
- Generated inline code comments and JSDoc documentation
- Created API endpoint documentation
- Assisted in writing clear commit messages

### 🔧 **Refactoring**
- Optimized code structure and organization
- Improved TypeScript type safety
- Enhanced error handling patterns
- Suggested best practices for React hooks and state management

### 📊 **Bob Report Location**
All Bob interaction reports and session logs are stored in the `bob_session.zip` folder at the root of this repository. These reports document
---

## **Getting Started / Installation**

### Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher)
- **Yarn** (v4.10.3 or higher)
- **PostgreSQL** (v12 or higher)
- **Git**

### Installation Steps

#### 1. Clone the Repository
```bash
git clone https://github.com/AmmanRizwan/ibm-hackathon-project.git
cd ibm-hackathon-project
```

#### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend


# enable corepack globally
corepack enable

# set the version
corepack use yarn@4.10.3

# Install dependencies
yarn install

# Create environment file
cp .env.example .env

# Configure your .env file with the following variables:
# JWT_SECRET=your_jwt_secret_key
# SMTP_HOST=localhost
# SMTP_PORT=1025
# SMTP_EMAIL=your_email@gmail.com
# CORS_ORIGIN=http://localhost:8001
# PORT=8000

# Start development server
yarn dev
```

#### 3. Frontend Setup

```bash
# Navigate to frontend directory (from root)
cd frontend

# enable corepack globally
corepack enable

# set the version
corepack use yarn@4.10.3

# Install dependencies
yarn install

# Create environment file
cp .env.example .env

# Configure your .env file:
# VITE_API_URL=http://localhost:8000/v1/api

# Start development server
yarn dev
```

#### 4. Database Setup

```bash

# Or using psql
psql -U postgres -h localhost
CREATE DATABASE ibm_db;
\q
```

#### 5. MailDev Setup

```bash
sudo docker run -p 1080:1080 -p 1025:1025 maildev/maildev
```

### Running the Application

1. **Start Backend Server:**
   ```bash
   cd backend
   yarn dev
   ```
   Backend will run on `http://localhost:8000`

2. **Start Frontend Server:**
   ```bash
   cd frontend
   yarn dev
   ```
   Frontend will run on `http://localhost:8001`

3. **Start MailDev Server:**
   ```bash
   sudo docker run -p 1080:1080 -p 1025:1025 maildev/maildev
   ```
   Maildev will run on `http://localhost:1080`

4. **Access the Application:**
   Open your browser and navigate to `http://localhost:8001`

### Important Notes

- **Do not commit** `.env` files or expose sensitive credentials
- Use `.env.example` as a template for required environment variables
- Ensure PostgreSQL is running before starting the backend

- **Admin Access:** As of now, any user who signs up with the name "admin" will automatically be granted admin privileges. This is a temporary implementation for development and testing purposes. In production, implement proper role-based access control.
- For production deployment, build both frontend and backend:
  ```bash
  # Backend
  cd backend && yarn build
  
  # Frontend
  cd frontend && yarn build
  ```

---

## **Usage / Demo**

### How to Use the Application

#### 1. **Company Registration**
- Navigate to the signup page
- Register your company with admin credentials
- Verify your email via OTP

#### 2. **Add Employees**
- Log in to your admin dashboard
- Navigate to "Manage Employees"
- Add employee details including payment information
- Employees receive invitation emails

#### 3. **Process Payments**
- Create invoices for employees
- Review and approve payments
- Process direct bank transfers
- Track transaction history

#### 4. **Manage Payment Methods**
- Add multiple payment methods
- Configure default payment options
- Update billing details

### IBM BOB Demo Video

🎥 **[Watch Demo Video](https://vimeo.com/1188755899?share=copy&fl=sv&fe=ci)**

### Expected Output

After successful setup, you should see:
- ✅ Backend API running on port 8000
- ✅ Frontend application accessible at localhost:8001
- ✅ Database connected successfully
- ✅ Email service configured and working
- ✅ User authentication functional

---

## **Project Structure**

```
ibm-hackathon-project/
├── README.md                          # This file
├── bob_session.zip                     # IBM Bob interaction reports
│   
│   
│   
│
├── backend/                           # Node.js/Express backend
│   ├── src/
│   │   ├── index.ts                  # Application entry point
│   │   ├── config/                   # Configuration files
│   │   │   ├── db.ts                # Database configuration
│   │   │   └── env.ts               # Environment variables
│   │   ├── controller/              # Request handlers
│   │   │   ├── auth/                # Authentication controllers
│   │   │   ├── user/                # User management
│   │   │   ├── invoice/             # Invoice operations
│   │   │   ├── transaction/         # Payment transactions
│   │   │   ├── billing_detail/      # Billing information
│   │   │   └── payment_methods/     # Payment method management
│   │   ├── middleware/              # Express middleware
│   │   │   ├── auth.ts              # JWT authentication
│   │   │   ├── error.ts             # Error handling
│   │   │   └── permission.ts        # Role-based access control
│   │   ├── models/                  # Sequelize models
│   │   │   ├── user.ts              # User model
│   │   │   ├── invoice.ts           # Invoice model
│   │   │   ├── transaction.ts       # Transaction model
│   │   │   ├── billing_detail.ts    # Billing details model
│   │   │   ├── payment_method.ts    # Payment methods model
│   │   │   └── otp.ts               # OTP verification model
│   │   ├── routes/                  # API routes
│   │   ├── services/                # Business logic
│   │   │   └── smtp.ts              # Email service
│   │   ├── utils/                   # Utility functions
│   │   │   ├── bcrypt.ts            # Password hashing
│   │   │   ├── jwt.ts               # JWT utilities
│   │   │   ├── logger.ts            # Logging with Pino
│   │   │   ├── generate-otp.ts      # OTP generation
│   │   │   └── reminder.ts          # Payment reminders
│   │   └── views/                   # EJS email templates
│   │       ├── auth/                # Authentication emails
│   │       ├── invoice/             # Invoice emails
│   │       └── reminder/            # Reminder emails
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
│
└── frontend/                         # React frontend
    ├── src/
    │   ├── main.tsx                 # Application entry point
    │   ├── App.tsx                  # Root component
    │   ├── components/              # Reusable components
    │   │   ├── custom/              # Custom components
    │   │   │   ├── navbar/          # Navigation bar
    │   │   │   ├── sidebar/         # Sidebar navigation
    │   │   │   └── page-loader/     # Loading component
    │   │   └── ui/                  # Shadcn/ui components
    │   ├── page/                    # Page components
    │   │   ├── layout.tsx           # Main layout
    │   │   ├── home/                # Landing page
    │   │   ├── auth/                # Authentication pages
    │   │   │   ├── login/
    │   │   │   ├── signup/
    │   │   │   └── forgot-password/
    │   │   ├── admin/               # Admin pages
    │   │   │   ├── invoice/
    │   │   │   ├── manage_employee/
    │   │   │   ├── payment_method/
    │   │   │   └── transcation/
    │   │   ├── profile/             # User profile
    │   │   ├── invoice/             # Invoice management
    │   │   ├── transaction/         # Transaction history
    │   │   ├── billing_detail/      # Billing details
    │   │   └── payment_method/      # Payment methods
    │   ├── service/                 # API service layer
    │   │   ├── api.ts               # Axios configuration
    │   │   ├── auth/                # Auth API calls
    │   │   ├── user/                # User API calls
    │   │   ├── invoice/             # Invoice API calls
    │   │   ├── transaction/         # Transaction API calls
    │   │   ├── billing_details/     # Billing API calls
    │   │   └── payment_methods/     # Payment methods API calls
    │   ├── store/                   # Redux store
    │   │   ├── index.ts             # Store configuration
    │   │   ├── auth/                # Auth slice
    │   │   └── nav-toggle/          # Navigation state
    │   ├── utils/                   # Utility components
    │   │   ├── ProtectedRoute.tsx   # Route protection
    │   │   ├── PermissionRoute.tsx  # Permission-based routing
    │   │   └── AutoRedirect.tsx     # Auto redirect logic
    │   └── lib/                     # Helper functions
    ├── package.json
    ├── tsconfig.json
    ├── vite.config.ts
    ├── tailwind.config.js
    └── .env.example
```

### Key Directories Explained

- **`bob_session.zip`**: Contains all IBM Bob session reports
- **`backend/src/controller/`**: Handles HTTP requests and responses
- **`backend/src/models/`**: Database schema definitions using Sequelize
- **`backend/src/services/`**: Business logic and external service integrations
- **`frontend/src/page/`**: All page components organized by feature
- **`frontend/src/service/`**: API integration layer with TypeScript interfaces
- **`frontend/src/store/`**: Redux Toolkit state management

---

## **Team Members**

- **[Amman Rizwan]** - Full Stack Developer

---

## **License**

This project was developed for the IBM Hackathon 2026.

**Copyright © 2026 [ZenO Type]. All rights reserved.**

This project is proprietary software developed for the IBM Hackathon. Unauthorized copying, modification, distribution, or use of this software, via any medium, is strictly prohibited without explicit permission from the project authors.

For licensing inquiries, please contact: [ammanrizwan00007@gmail.com]

---

## **Acknowledgments**

- **IBM Bob** for AI-assisted development and code generation
- **IBM Hackathon** for providing the platform and opportunity
- **Open Source Community** for the amazing tools and libraries used in this project

---

## **Contact & Support**

For questions, issues, or contributions:
- 📧 Email: [ammanrizwan00007@gmail.com]

---

**Made with ❤️ for IBM Hackathon 2026**