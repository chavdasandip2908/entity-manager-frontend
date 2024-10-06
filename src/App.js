// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from './components/Header';
import Users from './pages/Users';
import UserDetail from './pages/UserDetail';
import Collections from './pages/Collections';
import CreateChildCollectionForm from './components/CreateChildCollectionForm';
import CollectionDetail from './pages/CollectionDetail';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<h1 >welcome</h1>} />
            <Route path="/users" element={<Users />} />
            <Route path="/users/:userId" element={<UserDetail />} />
            <Route path="/collections" element={<Collections />} />
            <Route path="/collections/:collectionId" element={<CollectionDetail />} />
            <Route path="/create-collection" element={<CreateChildCollectionForm />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </main>
        <ToastContainer position="bottom-right" />
      </div>
    </Router>
  );
}

export default App;