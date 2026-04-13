# 🏫 Sanjeevini Convent School – Admission Form System (Redesigned)

## Quick Start

1. Install Python 3.8+ from https://www.python.org/downloads/
2. Install dependencies:
   ```
   pip install -r requirements.txt
   ```
3. Run the app:
   ```
   python app.py
   ```
4. Open http://localhost:5000 in your browser

## Default Login Credentials

| Username    | Password      | Role  |
|-------------|---------------|-------|
| admin       | admin123      | Admin |
| office      | office123     | Staff |
| principal   | principal123  | Admin |

> **Admin** can delete records. **Staff** can only view, add, edit, print.

## Features
- Sign In / Sign Out with role-based access
- Professional card-based form UI (mobile-friendly)
- Real-time form progress indicator
- Collapsible form sections
- Smart radio & checkbox cards
- Aadhaar number auto-formatting
- Toast notifications (short duration)
- Print with TWO copies (Parent + Office) on one A4 page
- PDF export via browser
- Records page with stats dashboard
- Search, Edit, Delete (admin only)
- Ctrl+S keyboard shortcut to save
