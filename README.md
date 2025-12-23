<div align="center">
  
# FruitCart Pro 🍎
  
![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Next.js](https://img.shields.io/badge/Next.js-14-black.svg)
![MongoDB](https://img.shields.io/badge/MongoDB-Ready-green.svg)

**Complete Fruit Shop Management System**

A comprehensive web application designed for fruit shops to manage billing, inventory, merchant payouts, and analytics. This all-in-one solution streamlines daily operations and provides valuable business insights.

[Features](#features) •
[Tech Stack](#tech-stack) •
[Installation](#installation) •
[Usage](#usage) •
[Project Structure](#project-structure)

</div>

---

## Features

### Billing System
- Create bills with barcode/manual entry
- Process multiple payment methods (cash, card, UPI)
- Real-time inventory updates upon sale
- Generate and print receipts
- Customer association for loyalty tracking

### Inventory Management
- Track stock levels with low inventory alerts
- Bulk import/export of product data
- Product categorization and organization
- Wastage/spoilage tracking
- Automatic reorder suggestions
- Shelf-life tracking with expiration alerts

### Merchant Management
- Manage suppliers and contact details
- Track payments and payment history
- Schedule recurring payments
- Outstanding payment dashboard
- Generate payment receipts

### Reporting & Analytics
- Sales overview with trends
- Sales by category analysis
- Top-selling products tracking
- Inventory turnover metrics
- Merchant payout history
- Export reports in PDF and CSV

### User Management (Admin Only)
- Create and manage user accounts
- Role-based access control (Admin and User roles)
- Activity logs and audit trails
- Password management

### System Settings (Admin Only)
- Tax rate configuration
- Receipt template customization
- Business information management
- System preferences

---

## Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **React** - UI library
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - High-quality UI components
- **Recharts** - Data visualization library

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling

### Authentication
- **NextAuth.js** - Authentication for Next.js
- **JWT** - JSON Web Tokens for session management

### Form Handling
- **React Hook Form** - Form validation
- **Zod** - TypeScript-first schema validation

---

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18.x or higher
- **npm** or **yarn** or **pnpm**
- **MongoDB** database (Atlas or local instance)
- **Git** for version control

---

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/VinayHajare/FruitCart-Pro.git
cd FruitCart-Pro
```

### 2. Install dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. Set up environment variables

Create a `.env.local` file in the root directory:

```env
# MongoDB Connection
MONGODB_URI=your_mongodb_connection_string

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_key

# Application URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Generate NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

### 4. Set up the database

The application will automatically create the necessary collections. To create an admin user, run:

```bash
node scripts/create-admin.js
```

Default admin credentials:
- **Email:** vinayhajare2004@gmail.com
- **Password:** Vinay2324

### 5. Run the development server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

### 6. Build for production

```bash
npm run build
npm run start
```

---

## Usage

### Getting Started

1. **Login** - Use the admin credentials to access the system
2. **Add Products** - Navigate to Products and add your fruit catalog
3. **Manage Inventory** - Set initial stock levels in Inventory
4. **Create Bills** - Go to Billing to process customer transactions
5. **Add Merchants** - Set up your suppliers in the Merchants section
6. **View Reports** - Check analytics and insights in Reports

### User Roles

#### Admin
- Full system access
- User management
- Merchant payout management
- System settings configuration
- All user capabilities

#### User
- Create and process bills
- Manage inventory
- View products
- Basic reporting access
- View merchants

### Key Workflows

#### Processing a Sale
1. Go to **Billing** page
2. Search and add products to the bill
3. Adjust quantities as needed
4. Apply discounts if applicable
5. Select payment method
6. Complete transaction
7. Print or email receipt

#### Managing Inventory
1. Go to **Inventory** page
2. View current stock levels
3. Use **Stock Adjustment** to update quantities
4. Record wastage in **Wastage Tracking**
5. Monitor low stock alerts

#### Merchant Payouts
1. Go to **Merchants** page (Admin only)
2. Select a merchant
3. Create a new payout
4. Enter payout details
5. Submit and generate receipt

---

## Project Structure

```
fruitcart-pro/
├── app/                          # Next.js App Router
│   ├── admin/                    # Admin-only pages
│   │   ├── guide/                # Admin workflow guide
│   │   ├── settings/             # System settings
│   │   └── users/                # User management
│   ├── api/                      # API routes
│   │   ├── admin/                # Admin API endpoints
│   │   ├── auth/                 # Authentication
│   │   ├── inventory/            # Inventory operations
│   │   ├── merchants/            # Merchant management
│   │   ├── payouts/              # Payout processing
│   │   ├── products/             # Product CRUD
│   │   ├── reports/              # Analytics data
│   │   ├── transactions/         # Transaction records
│   │   └── users/                # User operations
│   ├── auth/                     # Authentication pages
│   ├── billing/                  # Billing module
│   ├── inventory/                # Inventory management
│   ├── merchants/                # Merchant management
│   ├── products/                 # Product catalog
│   ├── reports/                  # Reports and analytics
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Dashboard homepage
├── components/                   # React components
│   ├── admin/                    # Admin components
│   ├── billing/                  # Billing components
│   ├── inventory/                # Inventory components
│   ├── merchants/                # Merchant components
│   ├── products/                 # Product components
│   ├── reports/                  # Report components
│   └── ui/                       # UI components (shadcn)
├── hooks/                        # Custom React hooks
├── lib/                          # Utility functions
│   ├── mongodb.ts                # Database connection
│   └── utils.ts                  # Helper functions
├── models/                       # Mongoose schemas
│   ├── merchant.ts               # Merchant model
│   ├── payout.ts                 # Payout model
│   ├── product.ts                # Product model
│   ├── setting.ts                # Settings model
│   ├── stock-adjustment.ts       # Stock adjustment model
│   ├── transaction.ts            # Transaction model
│   └── user.ts                   # User model
├── public/                       # Static assets
├── scripts/                      # Utility scripts
│   └── create-admin.js           # Admin user creation
├── types/                        # TypeScript definitions
├── .env.local                    # Environment variables (create this)
├── middleware.ts                 # Next.js middleware
├── next.config.mjs               # Next.js configuration
├── package.json                  # Dependencies
├── tailwind.config.ts            # Tailwind configuration
└── tsconfig.json                 # TypeScript configuration
```

---

## Database Models

### Product
- Product information (name, category, SKU)
- Pricing (regular, wholesale, discount)
- Inventory quantity and unit
- Supplier information
- Seasonal availability

### Transaction
- Date and time
- Customer information
- Items purchased with quantities
- Payment method and status
- Discount and tax calculations

### Merchant
- Name and contact details
- Supply categories
- Payment terms
- Bank details
- Transaction history

### User
- Name and credentials
- Role (Admin/User)
- Contact information
- Activity logs

### Payout
- Merchant reference
- Amount and payment method
- Payment date and status
- Notes and description

### Setting
- Tax configuration
- Receipt templates
- Business information
- System preferences

---

## API Endpoints

### Authentication
- `POST /api/auth/[...nextauth]` - NextAuth.js endpoints

### Products
- `GET /api/products` - List all products
- `POST /api/products` - Create new product
- `PUT /api/products/[id]` - Update product
- `DELETE /api/products/[id]` - Delete product

### Transactions
- `GET /api/transactions` - List transactions
- `POST /api/transactions` - Create transaction

### Inventory
- `GET /api/inventory/stats` - Inventory statistics
- `POST /api/inventory/stock-adjustment` - Adjust stock
- `GET /api/inventory/actions` - Inventory action history

### Merchants
- `GET /api/merchants` - List merchants
- `POST /api/merchants` - Create merchant
- `PUT /api/merchants/[id]` - Update merchant
- `DELETE /api/merchants/[id]` - Delete merchant

### Payouts
- `GET /api/payouts` - List payouts
- `POST /api/payouts` - Create payout
- `PUT /api/payouts/[id]` - Update payout status

### Reports
- `GET /api/reports/sales-overview` - Sales summary
- `GET /api/reports/sales-by-category` - Category breakdown
- `GET /api/reports/top-products` - Best sellers
- `GET /api/reports/inventory-turnover` - Stock metrics
- `GET /api/reports/merchant-payouts` - Payout analytics

### Admin
- `GET /api/admin/users` - List users
- `POST /api/admin/users` - Create user
- `PUT /api/admin/users/[id]` - Update user
- `DELETE /api/admin/users/[id]` - Delete user
- `GET/POST /api/admin/settings/tax` - Tax settings
- `GET/POST /api/admin/settings/receipt` - Receipt settings

---

## Deployment

### Deploy to Vercel

The easiest way to deploy FruitCart Pro is using the [Vercel Platform](https://vercel.com):

1. Push your code to GitHub
2. Import your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/fruitcart-pro)

### Environment Variables on Vercel

Add these environment variables in your Vercel project settings:

- `MONGODB_URI`
- `NEXTAUTH_URL`
- `NEXTAUTH_SECRET`
- `NEXT_PUBLIC_APP_URL`

---

## Features Roadmap

- [ ] Multi-language support
- [ ] Offline mode with sync
- [ ] Mobile app (React Native)
- [ ] Customer loyalty program
- [ ] Advanced analytics dashboard
- [ ] Integration with accounting software
- [ ] Automated inventory reordering
- [ ] QR code-based payments
- [ ] WhatsApp integration for receipts

---

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow the existing code style
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting PR

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Support

If you encounter any issues or have questions:

- **Email:** vinayhajare2004@gmail.com
- **GitHub Issues:** [Create an issue](https://github.com/VinayHajare/FruitCart-Pro/issues)
- **Documentation:** [Wiki](https://github.com/VinayHajare/FruitCart-Pro/wiki)

---

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide](https://lucide.dev/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)

---

<div align="center">

**Made with ❤️ for fruit shop owners worldwide**

[⬆ back to top](#fruitcart-pro)

</div>
