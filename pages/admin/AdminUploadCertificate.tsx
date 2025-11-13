
import React, { useState, useContext, FormEvent } from 'react';
import { AppContext } from '../../context/AppContext';

const AdminUploadCertificate: React.FC = () => {
    const context = useContext(AppContext);
    const [studentId, setStudentId] = useState('');
    const [phone, setPhone] = useState('');
    const [pdfFile, setPdfFile] = useState<File | null>(null);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    if (!context) return null;
    const { students, updateStudent, t } = context;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setError('');
        setMessage('');
        const file = e.target.files?.[0];
        if (file) {
            if (file.type !== 'application/pdf') {
                setError(t('students_pdf_type_error'));
                setPdfFile(null);
                return;
            }
            if (file.size > 1024 * 1024) { // 1MB
                setError(t('students_pdf_size_error'));
                setPdfFile(null);
                return;
            }
            setPdfFile(file);
        }
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        setError('');
        setMessage('');

        if (!studentId || !phone || !pdfFile) {
            setError('Please fill all fields and select a PDF file.');
            return;
        }

        const studentToUpdate = students.find(s => s.id.toLowerCase() === studentId.trim().toLowerCase() && s.phone === phone.trim());

        if (!studentToUpdate) {
            setError(t('student_not_found_for_upload'));
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            if (event.target?.result) {
                const updatedStudent = {
                    ...studentToUpdate,
                    certificatePdfUrl: event.target.result as string,
                };
                updateStudent(updatedStudent);
                setMessage(t('upload_success'));
                setStudentId('');
                setPhone('');
                setPdfFile(null);
                // Clear the file input visually
                const fileInput = document.getElementById('pdf-upload') as HTMLInputElement;
                if (fileInput) fileInput.value = '';
            }
        };
        reader.onerror = () => {
            setError('Failed to read the PDF file.');
        };
        reader.readAsDataURL(pdfFile);
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">{t('upload_certificate_title')}</h1>
            <div className="bg-white p-8 rounded-lg shadow-md">
                <p className="text-gray-600 mb-6">{t('upload_certificate_intro')}</p>
                <form onSubmit={handleSubmit} className="space-y-4 max-w-lg mx-auto">
                    <div>
                        <label className="block text-gray-700 font-semibold mb-1">{t('students_id')}</label>
                        <input
                            type="text"
                            value={studentId}
                            onChange={(e) => setStudentId(e.target.value)}
                            placeholder={t('student_id_placeholder')}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-semibold mb-1">{t('students_phone')} </label>
                        <input
                            type="text"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder={t('student_phone_placeholder')}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-semibold mb-1">{t('select_pdf')}</label>
                         <input 
                            id="pdf-upload"
                            type="file" 
                            accept=".pdf" 
                            onChange={handleFileChange} 
                            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" 
                            required
                        />
                    </div>
                    {error && <p className="text-red-500 text-center">{error}</p>}
                    {message && <p className="text-green-600 text-center">{message}</p>}
                    <div>
                        <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700 font-bold">
                            {t('upload_button')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminUploadCertificate;
