
import React, { useState } from 'react';
import { MOCK_BOOKS } from '../constants';
import { Book } from '../types';

const BooksView: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [books, setBooks] = useState<Book[]>(MOCK_BOOKS);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Estados para o novo livro
  const [newBook, setNewBook] = useState({
    title: '',
    author: '',
    category: 'Technology',
    stock: 0,
    price: 0
  });

  const filteredBooks = books.filter(b => 
    b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSaveBook = (e: React.FormEvent) => {
    e.preventDefault();
    const bookToAdd: Book = {
      id: (books.length + 1).toString(),
      ...newBook,
      status: newBook.stock > 10 ? 'Available' : (newBook.stock > 0 ? 'Low Stock' : 'Out of Stock'),
      coverUrl: `https://picsum.photos/seed/${Math.random()}/200/300`
    };
    
    setBooks([bookToAdd, ...books]);
    setIsModalOpen(false);
    setNewBook({ title: '', author: '', category: 'Technology', stock: 0, price: 0 });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-slate-800">Gerenciamento de Livros</h2>
        <div className="flex gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <input
              type="text"
              placeholder="Buscar por título ou autor..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white text-slate-900 placeholder:text-slate-400 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <svg className="w-5 h-5 absolute left-3 top-2.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition flex items-center gap-2 shadow-lg shadow-indigo-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Adicionar
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Livro</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Autor</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Categoria</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-center">Estoque</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-center">Status</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-right">Preço</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredBooks.map((book) => (
              <tr key={book.id} className="hover:bg-slate-50 transition">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <img src={book.coverUrl} alt={book.title} className="w-10 h-14 object-cover rounded shadow-sm" />
                    <span className="font-semibold text-slate-800">{book.title}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-slate-600">{book.author}</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs font-medium">{book.category}</span>
                </td>
                <td className="px-6 py-4 text-center font-medium text-slate-700">{book.stock}</td>
                <td className="px-6 py-4 text-center">
                  <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    book.status === 'Available' ? 'bg-emerald-100 text-emerald-700' :
                    book.status === 'Low Stock' ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'
                  }`}>
                    {book.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right font-semibold text-slate-800">R$ {book.price.toFixed(2)}</td>
                <td className="px-6 py-4 text-right">
                  <button className="text-slate-400 hover:text-indigo-600 transition">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredBooks.length === 0 && (
          <div className="p-12 text-center text-slate-500">
            Nenhum livro encontrado para sua busca.
          </div>
        )}
      </div>

      {/* Modal de Adição de Livro */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative z-10 overflow-hidden animate-in fade-in zoom-in duration-200 border border-slate-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="text-xl font-bold text-slate-800">Novo Livro</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleSaveBook} className="p-6 space-y-4 bg-white">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Título do Livro</label>
                <input 
                  required
                  type="text" 
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition bg-white text-slate-900 placeholder:text-slate-400"
                  placeholder="Ex: Clean Code"
                  value={newBook.title}
                  onChange={(e) => setNewBook({...newBook, title: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Autor</label>
                <input 
                  required
                  type="text" 
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition bg-white text-slate-900 placeholder:text-slate-400"
                  placeholder="Ex: Robert C. Martin"
                  value={newBook.author}
                  onChange={(e) => setNewBook({...newBook, author: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Categoria</label>
                  <select 
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition bg-white text-slate-900"
                    value={newBook.category}
                    onChange={(e) => setNewBook({...newBook, category: e.target.value})}
                  >
                    <option value="Technology">Tecnologia</option>
                    <option value="Productivity">Produtividade</option>
                    <option value="Business">Negócios</option>
                    <option value="Self-help">Autoajuda</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Preço (R$)</label>
                  <input 
                    required
                    type="number" 
                    step="0.01"
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition bg-white text-slate-900 placeholder:text-slate-400"
                    placeholder="0.00"
                    value={newBook.price || ''}
                    onChange={(e) => setNewBook({...newBook, price: parseFloat(e.target.value)})}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Quantidade em Estoque</label>
                <input 
                  required
                  type="number" 
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition bg-white text-slate-900 placeholder:text-slate-400"
                  placeholder="0"
                  value={newBook.stock || ''}
                  onChange={(e) => setNewBook({...newBook, stock: parseInt(e.target.value)})}
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2 border border-slate-200 text-slate-600 font-semibold rounded-lg hover:bg-slate-50 transition bg-white"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition"
                >
                  Salvar Livro
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BooksView;
