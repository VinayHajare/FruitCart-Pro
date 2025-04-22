### 🍎FruitCart Pro: Complete Fruit Shop Management System

FruitCart Pro is a comprehensive web application designed for fruit shops to manage billing, inventory, merchant payouts, and analytics. This all-in-one solution streamlines daily operations and provides valuable business insights.
## Try Now 👇 

[FruitCart-Pro](https://v0-fruit-shop-billing-system-j68orl2d3.vercel.app/)  

## 🌟 Key Features

- **Billing System**: Create bills, process payments, and generate receipts
- **Inventory Management**: Track stock levels, manage product details, and handle inventory adjustments
- **Merchant Management**: Manage suppliers and process payments with detailed tracking
- **Reporting & Analytics**: Access sales reports, inventory analytics, and financial insights
- **User Management**: Role-based access control with admin and user roles
- **Responsive Design**: Works seamlessly on desktop and mobile devices


## 🚀 Technologies Used

- **Frontend**: Next.js 14 (App Router), React, Tailwind CSS, shadcn/ui
- **Backend**: Next.js API Routes, MongoDB
- **Authentication**: NextAuth.js with JWT
- **State Management**: React Hooks
- **Charts**: Recharts
- **Form Handling**: React Hook Form with Zod validation


## 📋 Prerequisites

- Node.js 18.x or higher
- MongoDB database (Atlas or local)
- npm or yarn


## 🔧 Installation

1. **Clone the repository**


```shellscript
git clone https://github.com/VinayHajare/FruitCart-Pro.git
cd DruitCart-Pro
```

2. **Install dependencies**


```shellscript
npm install
# or
yarn install
```

3. **Set up environment variables**


Create a `.env.local` file in the root directory with the following variables:

```plaintext
# MongoDB
MONGODB_URI=your_mongodb_connection_string

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. **Create admin user**


```shellscript
node scripts/create-admin.js
```

5. **Run the development server**


```shellscript
npm run dev
# or
yarn dev
```

6. **Open your browser**


Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

## 📱 Usage

### Login

Use the admin credentials created in the setup process:

- Email: [abc@xyz.com](mailto:abc@xyz.com)
- Password: Password@1234


### Modules

1. **Dashboard**: Overview of key metrics and quick access to all modules
2. **Billing**: Create new bills, search products, and process payments
3. **Inventory**: Manage stock levels, adjust inventory, and track wastage
4. **Products**: Add, edit, and organize your product catalog
5. **Merchants**: Manage suppliers and process payouts
6. **Reports**: View sales analytics, inventory turnover, and financial insights
7. **User Management**: Create and manage user accounts (Admin only)
8. **Settings**: Configure tax rates and receipt templates (Admin only)


## 🏗️ Project Structure

```plaintext
FruitCart-Pro/
├── app/                  # Next.js App Router pages
│   ├── admin/            # Admin-only pages
│   ├── api/              # API routes
│   ├── auth/             # Authentication pages
│   ├── billing/          # Billing module
│   ├── inventory/        # Inventory management
│   ├── merchants/        # Merchant management
│   ├── products/         # Product catalog
│   └── reports/          # Reports and analytics
├── components/           # React components
│   ├── admin/            # Admin components
│   ├── billing/          # Billing components
│   ├── inventory/        # Inventory components
│   ├── merchants/        # Merchant components
│   ├── products/         # Product components
│   ├── reports/          # Report components
│   └── ui/               # UI components (shadcn/ui)
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions
├── models/               # MongoDB models
├── public/               # Static assets
└── scripts/              # Utility scripts
```

## 🔒 Authentication and Authorization

The system uses NextAuth.js for authentication with JWT strategy. There are two user roles:

1. **Admin**: Full access to all features including user management, merchant payouts, and system configuration
2. **User**: Access to day-to-day operations like billing, inventory management, and basic reporting


## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request


## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Contact

If you have any questions or feedback, please reach out to:

- **Email**: [vinayhajare2004@gmail.com](mailto:vinayhajare2004@gmail.com)
- **GitHub**: [VinayHajare](https://github.com/VinayHajare)


---

Made with ❤️ by [Vinay Hajare]
