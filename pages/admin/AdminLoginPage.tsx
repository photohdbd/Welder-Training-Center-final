import React, { useState, useContext, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';

const AdminLoginPage: React.FC = () => {
    const [email, setEmail] = useState('admin@example.com');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const context = useContext(AppContext);
    const navigate = useNavigate();

    if (!context) return null;
    const { t } = context;

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        setError('');

        if (context) {
            if (context.login(password)) {
                navigate('/admin/dashboard');
            } else {
                setError(t('password_incorrect'));
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <h1 className="text-2xl font-bold text-center mb-6">{t('admin_login_title')}</h1>
                <p className="text-center text-gray-500 mb-4 text-sm">
                    {t('demo_info')}
                </p>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-700">{t('email_label')}</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded mt-1"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700">{t('password_label')}</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded mt-1"
                            required
                        />
                    </div>
                    {error && <p className="text-red-500 text-center">{error}</p>}
                    <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700">
                        {t('login_button')}
                    </button>
                     <Link to="/" className="block w-full text-center bg-gray-600 text-white p-3 rounded hover:bg-gray-700 mt-2">
                        {t('back_to_site')}
                    </Link>
                </form>
            </div>
        </div>
    );
};

export default AdminLoginPage;