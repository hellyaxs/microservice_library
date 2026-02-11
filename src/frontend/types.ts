
export interface Book {
  id: string;
  title: string;
  author: string;
  category: string;
  stock: number;
  price: number;
  status: 'Available' | 'Low Stock' | 'Out of Stock';
  coverUrl: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'User' | 'Librarian';
  status: 'Active' | 'Inactive';
  lastLogin: string;
}

export interface Loan {
  id: string;
  userId: string;
  userName: string;
  bookId: string;
  bookTitle: string;
  loanDate: string;
  dueDate: string;
  status: 'On Time' | 'Overdue' | 'Returned';
}

export interface Payment {
  id: string;
  amount: number;
  method: 'Credit Card' | 'PIX' | 'Bank Slip';
  status: 'Confirmed' | 'Pending' | 'Failed';
  timestamp: string;
}

export interface ServiceStatus {
  name: string;
  status: 'Online' | 'Offline' | 'Degraded';
  latency: string;
  technology: string;
}

export type ViewType = 'dashboard' | 'books' | 'users' | 'loans' | 'payments' | 'notifications' | 'ai-insights';
