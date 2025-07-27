import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

interface Props {
  onClose: () => void;
}

const LoginForm: React.FC<Props> = ({ onClose }) => {
  const { login } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setSubmitting(true);
    setError('');

    try {
      const success = await login();
      if (success) {
        onClose();
      } else {
        setError('Login abgebrochen oder fehlgeschlagen');
      }
    } catch (err) {
      setError('Login fehlgeschlagen');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded shadow-lg p-6 w-full max-w-sm">
        <h2 className="text-xl font-bold mb-4">Admin Login</h2>
        <p className="text-gray-600 mb-4">
          Verwende Netlify Identity für die Anmeldung
        </p>

        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

        <div className="flex justify-end gap-2">
          <button
            type="button"
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded"
            onClick={onClose}
          >
            Abbrechen
          </button>
          <button
            type="button"
            disabled={submitting}
            onClick={handleLogin}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded disabled:opacity-50"
          >
            {submitting ? 'Anmelden…' : 'Mit Netlify Identity anmelden'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;