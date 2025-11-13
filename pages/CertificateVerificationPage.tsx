
import React, { useState, useContext, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { Student } from '../types';
import CertificateDisplay from '../components/CertificateDisplay';

const CertificateVerificationPage: React.FC = () => {
  const context = useContext(AppContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [foundStudent, setFoundStudent] = useState<Student | null>(null);
  const [message, setMessage] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();

  if (!context) return null;
  const { findStudent, siteSettings, t } = context;

  const performSearch = useCallback((query: string) => {
    if (!query) return;
    const student = findStudent(query);
    if (student) {
      setFoundStudent(student);
      setMessage('');
    } else {
      setFoundStudent(null);
      setMessage(t('certificate_not_found'));
    }
  }, [findStudent, t]);

  useEffect(() => {
    const idFromUrl = searchParams.get('id');
    if (idFromUrl) {
      setSearchQuery(idFromUrl);
      performSearch(idFromUrl);
    }
  }, [searchParams, performSearch]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(searchQuery);
    setSearchParams(searchQuery ? { id: searchQuery } : {});
  };

  return (
    <div className="bg-gray-100 min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-md text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">{t('verify_certificate_title')}</h1>
          <p className="text-gray-600 mb-6">{t('verify_certificate_intro')}</p>
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('certificate_id_or_phone_placeholder')}
              className="flex-grow p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <button type="submit" className="bg-blue-600 text-white font-bold py-3 px-6 rounded-md hover:bg-blue-700 transition duration-300">
              {t('search')}
            </button>
          </form>
        </div>

        {message && <p className="text-center text-red-500 mt-6 bg-red-100 p-4 rounded-md max-w-3xl mx-auto">{message}</p>}

        {foundStudent && siteSettings && (
          foundStudent.certificatePdfUrl ? (
            <div className="mt-8 max-w-5xl mx-auto">
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">{t('uploaded_certificate_title')}</h2>
                <p className="text-gray-600 mb-6">Student: {foundStudent.name} (ID: {foundStudent.id})</p>
                 <div className="border-4 border-gray-300 rounded-lg overflow-hidden bg-gray-200">
                    <iframe
                        src={foundStudent.certificatePdfUrl}
                        className="w-full aspect-[4/5] md:aspect-video"
                        title={`Certificate for ${foundStudent.name}`}
                    />
                </div>
                <div className="text-center mt-6">
                    <a
                        href={foundStudent.certificatePdfUrl}
                        download={`certificate-${foundStudent.id}.pdf`}
                        className="inline-block bg-green-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-green-700 transition duration-300"
                    >
                        {t('download_pdf')}
                    </a>
                </div>
              </div>
            </div>
          ) : (
            <CertificateDisplay student={foundStudent} siteSettings={siteSettings} />
          )
        )}
      </div>
    </div>
  );
};

export default CertificateVerificationPage;