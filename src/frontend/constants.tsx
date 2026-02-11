
import React from 'react';
import { Book, User, Loan, Payment, ServiceStatus } from './types';

export const MOCK_BOOKS: Book[] = [
  { id: '1', title: 'Clean Code', author: 'Robert C. Martin', category: 'Technology', stock: 12, price: 45.90, status: 'Available', coverUrl: 'https://picsum.photos/seed/book1/200/300' },
  { id: '2', title: 'The Pragmatic Programmer', author: 'Andrew Hunt', category: 'Technology', stock: 2, price: 55.00, status: 'Low Stock', coverUrl: 'https://picsum.photos/seed/book2/200/300' },
  { id: '3', title: 'Deep Work', author: 'Cal Newport', category: 'Productivity', stock: 25, price: 32.50, status: 'Available', coverUrl: 'https://picsum.photos/seed/book3/200/300' },
  { id: '4', title: 'Zero to One', author: 'Peter Thiel', category: 'Business', stock: 0, price: 28.00, status: 'Out of Stock', coverUrl: 'https://picsum.photos/seed/book4/200/300' },
  { id: '5', title: 'Atomic Habits', author: 'James Clear', category: 'Self-help', stock: 40, price: 24.99, status: 'Available', coverUrl: 'https://picsum.photos/seed/book5/200/300' },
];

export const MOCK_USERS: User[] = [
  { id: 'u1', name: 'Alice Johnson', email: 'alice@example.com', role: 'Admin', status: 'Active', lastLogin: '2023-10-24 10:30' },
  { id: 'u2', name: 'Bob Smith', email: 'bob@example.com', role: 'User', status: 'Active', lastLogin: '2023-10-23 15:20' },
  { id: 'u3', name: 'Charlie Davis', email: 'charlie@example.com', role: 'Librarian', status: 'Inactive', lastLogin: '2023-10-10 09:45' },
];

export const MOCK_LOANS: Loan[] = [
  { id: 'l1', userId: 'u2', userName: 'Bob Smith', bookId: '1', bookTitle: 'Clean Code', loanDate: '2023-10-15', dueDate: '2023-10-22', status: 'Overdue' },
  { id: 'l2', userId: 'u3', userName: 'Charlie Davis', bookId: '3', bookTitle: 'Deep Work', loanDate: '2023-10-20', dueDate: '2023-10-27', status: 'On Time' },
];

export const MOCK_PAYMENTS: Payment[] = [
  { id: 'p1', amount: 45.90, method: 'Credit Card', status: 'Confirmed', timestamp: '2023-10-24 11:00' },
  { id: 'p2', amount: 32.50, method: 'PIX', status: 'Confirmed', timestamp: '2023-10-23 14:30' },
];

export const SERVICE_STATUS: ServiceStatus[] = [
  { name: 'Livros Service', status: 'Online', latency: '24ms', technology: 'NestJS' },
  { name: 'Users Service', status: 'Online', latency: '45ms', technology: 'Spring Boot' },
  { name: 'Pagamentos Service', status: 'Online', latency: '110ms', technology: 'FastAPI' },
  { name: 'Notificações Service', status: 'Online', latency: '12ms', technology: 'Go Fiber' },
  { name: 'Empréstimos Service', status: 'Degraded', latency: '450ms', technology: 'Spring Boot' },
  { name: 'Discovery (Consul)', status: 'Online', latency: '5ms', technology: 'Consul' },
  { name: 'Broker (RabbitMQ)', status: 'Online', latency: '8ms', technology: 'Erlang/RabbitMQ' },
];
