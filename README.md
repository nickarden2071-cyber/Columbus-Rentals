# Columbus Rentals - Equipment Management System (V1)

A professional equipment rental and inventory management system built for Columbus Rentals. This Version 1 release provides a robust foundation for tracking assets, managing bookings, and preventing over-scheduling.

## 🚀 Key Features

### 1. Unified Dashboard
- **Real-time Stats:** Instant visibility into active rentals, total inventory, and items in maintenance.
- **Return Tracking:** A prioritized list of equipment due back in the next few days.
- **Quick Actions:** Shortcuts for the most frequent tasks like creating bookings or adding inventory.

### 2. Smart Inventory Management
- **Categorization:** Organize equipment into custom categories (e.g., Heavy Machinery, Power Tools).
- **Status Tracking:** Toggle between "Available" and "Maintenance" to ensure only quality gear is rented.
- **Live Search:** Quickly find specific items by name across your entire catalog.

### 3. Conflict-Free Booking Engine
- **Availability Logic:** The system automatically calculates stock levels to prevent overbooking.
- **Buffer Days:** Configurable turnaround time between rentals to allow for cleaning and maintenance.
- **Active Management:** View, track, and cancel bookings from a centralized professional table.

### 4. Admin Configuration
- **Global Settings:** Centralized control for buffer days and category CRUD operations.
- **Secure Access:** Protected by Supabase Authentication to ensure only authorized staff can manage the system.

## 🛠 Tech Stack
- **Frontend:** Next.js 15 (App Router), Tailwind CSS, Lucide Icons.
- **Backend:** Supabase (PostgreSQL, Auth, RLS).
- **Deployment:** Vercel (Recommended).

## 📖 Getting Started for Clients

1. **Login:** Use your admin credentials to access the [Dashboard](https://columbus-rentals.vercel.app/dashboard).
2. **Setup:** Go to **Settings** to define your equipment categories and preferred buffer days.
3. **Add Inventory:** Populated your catalog in the **Inventory** section.
4. **Start Renting:** Create your first booking through the **Bookings** page or the Dashboard shortcut.

---
*Developed for Columbus Rentals - 2024*
