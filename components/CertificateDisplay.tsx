

import React, { useRef, useContext } from 'react';
import { Student, SiteSettings } from '../types';
import { QRCodeSVG } from 'qrcode.react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { AppContext } from '../context/AppContext';

interface CertificateDisplayProps {
  student: Student;
  siteSettings: SiteSettings;
}

const CertificateDisplay: React.FC<CertificateDisplayProps> = ({ student, siteSettings }) => {
  const certificateRef = useRef<HTMLDivElement>(null);
  const context = useContext(AppContext);
  const verificationUrl = `${window.location.origin}${window.location.pathname}#/certificate-verification?id=${student.id}`;

  if (!context) return null;
  const { lang, t } = context;
  
  const siteName = lang === 'bn' ? siteSettings.name_bn : siteSettings.name_en;
  const address = lang === 'bn' ? siteSettings.address_bn : siteSettings.address_en;
  const courseName = lang === 'bn' ? student.courseName_bn : student.courseName_en;
  const courseDuration = lang === 'bn' ? student.courseDuration_bn : student.courseDuration_en;

  const getIssueDate = () => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date().toLocaleDateString(lang === 'bn' ? 'bn-BD' : 'en-US', options);
  };

  const downloadPDF = () => {
    const input = certificateRef.current;
    if (input) {
      const issueDateEl = input.querySelector('.issue-date-dynamic');
      if (issueDateEl) {
          issueDateEl.textContent = `${t('issue_date')}: ${getIssueDate()}`;
      }

      html2canvas(input, { scale: 2.5, useCORS: true }).then((canvas) => {
        const imgData = canvas.toDataURL('image/jpeg', 0.95); // Use JPEG with 95% quality
        const pdf = new jsPDF('l', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`certificate-${student.id}.pdf`);
        if (issueDateEl) {
            issueDateEl.textContent = ''; // Clear after download
        }
      });
    }
  };

  return (
    <div className="mt-8">
      <div ref={certificateRef} className="bg-white p-8 border-4 border-blue-800 relative w-full max-w-5xl mx-auto aspect-[1.414/1] flex flex-col">
          <div className="absolute inset-0 bg-contain bg-no-repeat bg-center opacity-5" style={{backgroundImage: `url(${siteSettings.logoUrl})`}}></div>
          <div className="relative z-10 text-center flex-grow flex flex-col">
            <div className="flex items-center justify-center space-x-4 mb-2">
                <img src={siteSettings.logoUrl} alt="Logo" className="h-20" crossOrigin="anonymous" />
                <div>
                    <h1 className="text-4xl font-bold text-blue-900">{siteName}</h1>
                    <p className="text-lg text-gray-600">{address}</p>
                </div>
            </div>
            
            <h2 className="text-3xl font-semibold text-gray-800 my-4 border-b-2 border-gray-300 pb-2 inline-block">{t('certificate_title')}</h2>
            
            <p className="text-lg my-2">{t('this_is_to_certify')}</p>
            
            <div className="text-left text-lg mx-auto max-w-3xl space-y-2 my-4 flex-grow">
                 <div className="flex flex-row gap-8 items-start justify-center">
                    <div className="flex-grow">
                      <p><span className="font-semibold w-40 inline-block">{t('student_name')}</span>: {student.name}</p>
                      <p><span className="font-semibold w-40 inline-block">{t('father_name')}</span>: {student.fatherName}</p>
                      <p><span className="font-semibold w-40 inline-block">{t('course_name')}</span>: {courseName}</p>
                      <p><span className="font-semibold w-40 inline-block">{t('course_duration')}</span>: {courseDuration}</p>
                      <p><span className="font-semibold w-40 inline-block">{t('duration')}</span>: {student.startDate} to {student.endDate}</p>
                      <p><span className="font-semibold w-40 inline-block">{t('certificate_id')}</span>: {student.id}</p>
                    </div>
                    {student.imageUrl && (
                      <div className="flex-shrink-0">
                        <img 
                          src={student.imageUrl} 
                          alt={student.name} 
                          className="w-28 h-36 object-cover border-2 border-gray-300 p-1" 
                          crossOrigin="anonymous"
                        />
                      </div>
                    )}
                  </div>
            </div>
            
            <p className="text-lg my-2">{t('wishing_success')}</p>
            
            <div className="flex justify-between items-end mt-8 pt-4">
                <div className="text-center text-sm">
                    <p className="font-semibold issue-date-dynamic"></p>
                </div>
                <div className="text-center">
                    <QRCodeSVG value={verificationUrl} size={80} />
                    <p className="text-xs mt-1">{t('scan_qr')}</p>
                </div>
                <div className="text-center">
                    <img src={siteSettings.signatureUrl} alt="Signature" className="h-12 mx-auto mb-1" crossOrigin="anonymous" />
                    <p className="font-bold border-t-2 border-gray-700 pt-2 px-8">{t('director')}</p>
                    <p className="text-sm">{siteName}</p>
                </div>
            </div>
          </div>
          <div className="absolute bottom-2 right-4 text-xs text-gray-400">{t('digitally_verified')}</div>
      </div>
      
      <div className="text-center mt-6 flex justify-center items-center gap-4">
        <button
          onClick={downloadPDF}
          className="bg-green-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-green-700 transition duration-300"
        >
          {t('download_pdf')}
        </button>
        {student.certificatePdfUrl && (
            <a
                href={student.certificatePdfUrl}
                download={`original-certificate-${student.id}.pdf`}
                className="bg-purple-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-purple-700 transition duration-300"
            >
                {t('download_original_pdf')}
            </a>
        )}
      </div>
    </div>
  );
};

export default CertificateDisplay;