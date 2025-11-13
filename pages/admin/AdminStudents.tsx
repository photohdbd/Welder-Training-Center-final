
import React, { useContext, useState, FormEvent } from 'react';
import { AppContext } from '../../context/AppContext';
import { Student } from '../../types';
import ImageCropInput from '../../components/ImageCropInput';

const AdminStudents: React.FC = () => {
    const context = useContext(AppContext);
    const [currentStudent, setCurrentStudent] = useState<Partial<Student>>({});
    const [isEditing, setIsEditing] = useState(false);
    const [pdfError, setPdfError] = useState('');

    if (!context) return <p>Loading...</p>;
    const { students, addStudent, updateStudent, deleteStudent, findStudent, t } = context;

    const handleEdit = (student: Student) => {
        setCurrentStudent(student);
        setIsEditing(true);
        setPdfError('');
    };

    const handleCancel = () => {
        setCurrentStudent({});
        setIsEditing(false);
        setPdfError('');
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        const studentData = currentStudent as Student;
        if (!studentData.id || !studentData.name || !studentData.fatherName || !studentData.phone || !studentData.courseName_bn || !studentData.courseName_en || !studentData.courseDuration_bn || !studentData.courseDuration_en || !studentData.startDate || !studentData.endDate) {
            alert(t('students_fill_all_fields'));
            return;
        }

        if (isEditing) {
            updateStudent(studentData);
        } else {
            // In a real app, you'd check against all students, not just the initial ones
            if (context.students.find(s => s.id === studentData.id)) {
                alert(t('students_id_exists'));
                return;
            }
            addStudent(studentData);
        }
        handleCancel();
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCurrentStudent({ ...currentStudent, [e.target.name]: e.target.value });
    };

    const handlePdfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPdfError('');
        const file = e.target.files?.[0];
        if (file) {
            if (file.type !== 'application/pdf') {
                setPdfError(t('students_pdf_type_error'));
                e.target.value = ''; // Clear the input
                return;
            }
            if (file.size > 1024 * 1024) { // 1MB
                setPdfError(t('students_pdf_size_error'));
                e.target.value = ''; // Clear the input
                return;
            }
            const reader = new FileReader();
            reader.onload = (event) => {
                if (event.target?.result) {
                    setCurrentStudent({ ...currentStudent, certificatePdfUrl: event.target.result as string });
                }
            };
            reader.readAsDataURL(file);
        }
    };


    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">{t('students_title')}</h1>
            <div className="bg-white p-8 rounded-lg shadow-md mb-8">
                <h2 className="text-xl font-semibold mb-4">{isEditing ? t('students_edit') : t('students_add_new')}</h2>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <input type="text" name="id" value={currentStudent.id || ''} onChange={handleChange} placeholder={t('students_id')} className="p-2 border rounded" required disabled={isEditing} />
                    <input type="text" name="name" value={currentStudent.name || ''} onChange={handleChange} placeholder={t('students_name')} className="p-2 border rounded" required />
                    <input type="text" name="fatherName" value={currentStudent.fatherName || ''} onChange={handleChange} placeholder={t('students_father_name')} className="p-2 border rounded" required />
                    <input type="text" name="phone" value={currentStudent.phone || ''} onChange={handleChange} placeholder={t('students_phone')} className="p-2 border rounded" required />
                    <input type="text" name="courseName_bn" value={currentStudent.courseName_bn || ''} onChange={handleChange} placeholder={t('students_course_name_bn')} className="p-2 border rounded" required />
                    <input type="text" name="courseName_en" value={currentStudent.courseName_en || ''} onChange={handleChange} placeholder={t('students_course_name_en')} className="p-2 border rounded" required />
                    <input type="text" name="courseDuration_bn" value={currentStudent.courseDuration_bn || ''} onChange={handleChange} placeholder={t('students_course_duration_bn')} className="p-2 border rounded" required />
                    <input type="text" name="courseDuration_en" value={currentStudent.courseDuration_en || ''} onChange={handleChange} placeholder={t('students_course_duration_en')} className="p-2 border rounded" required />
                    <div>
                        <label className="text-sm text-gray-500">{t('students_start_date')}</label>
                        <input type="date" name="startDate" value={currentStudent.startDate || ''} onChange={handleChange} className="w-full p-2 border rounded" required />
                    </div>
                    <div>
                        <label className="text-sm text-gray-500">{t('students_end_date')}</label>
                        <input type="date" name="endDate" value={currentStudent.endDate || ''} onChange={handleChange} className="w-full p-2 border rounded" required />
                    </div>
                    <div>
                        <ImageCropInput
                            label={t('students_image')}
                            value={currentStudent.imageUrl || ''}
                            onValueChange={(v) => setCurrentStudent({...currentStudent, imageUrl: v})}
                            t={t}
                        />
                    </div>
                     <div>
                        <label className="block text-gray-700 font-semibold">{t('students_certificate_pdf')}</label>
                        <input type="file" accept=".pdf" onChange={handlePdfChange} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                        {pdfError && <p className="text-red-500 text-sm mt-1">{pdfError}</p>}
                        {currentStudent.certificatePdfUrl && !pdfError && (
                            <a href={currentStudent.certificatePdfUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 text-sm mt-1 hover:underline block">
                                {t('students_view_uploaded_pdf')}
                            </a>
                        )}
                    </div>
                    <div className="flex gap-4 md:col-span-full">
                        <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">{isEditing ? t('update') : t('add')}</button>
                        {isEditing && <button type="button" onClick={handleCancel} className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600">{t('cancel')}</button>}
                    </div>
                </form>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-md">
                 <h2 className="text-xl font-semibold mb-4">{t('students_all')}</h2>
                 <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="p-2">{t('students_cert_id')}</th>
                                <th className="p-2">{t('students_name')}</th>
                                <th className="p-2">{t('course_name')}</th>
                                <th className="p-2">{t('students_duration')}</th>
                                <th className="p-2">{t('actions')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {students.map(student => (
                                <tr key={student.id} className="border-b">
                                    <td className="p-2">{student.id}</td>
                                    <td className="p-2">{student.name}</td>
                                    <td className="p-2">{student.courseName_bn}</td>
                                    <td className="p-2">{student.startDate} to {student.endDate}</td>
                                    <td className="p-2 flex gap-2">
                                        <button onClick={() => handleEdit(student)} className="bg-yellow-500 text-white px-3 py-1 rounded text-sm">{t('edit')}</button>
                                        <button onClick={() => deleteStudent(student.id)} className="bg-red-500 text-white px-3 py-1 rounded text-sm">{t('delete')}</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                 </div>
            </div>
        </div>
    );
};

export default AdminStudents;