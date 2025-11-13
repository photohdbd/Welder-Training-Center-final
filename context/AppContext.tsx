import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { SiteSettings, Slide, Notice, Trainer, Student, Course, GalleryItem, Feature, WhyChooseUsItem, TrainingItem, Video } from '../types';

// Custom hook to sync state with localStorage
function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      // Parse stored json or if none return initialValue
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // If error also return initialValue
      console.log(error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      // Save state
      setStoredValue(valueToStore);
      // Save to local storage
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      // A more advanced implementation would handle the error case
      console.log(error);
    }
  };

  return [storedValue, setValue] as const;
}

// --- I18n Translations ---
const translations = {
    bn: {
        // Header & Footer
        'home': 'হোম',
        'courses': 'কোর্সসমূহ',
        'gallery': 'গ্যালারি',
        'videos': 'ভিডিও',
        'certificate_verification': 'সার্টিফিকেট যাচাই',
        'notices': 'নোটিশ',
        'trainers': 'প্রশিক্ষক',
        'admin_login': 'অ্যাডমিন লগইন',
        'copyright': '© 2025 ওয়েল্ডার ট্রেনিং সেন্টার. সর্বস্বত্ব সংরক্ষিত।',
        'language_switch': 'English',
        'quick_links': 'গুরুত্বপূর্ণ লিঙ্ক',
        'contact': 'যোগাযোগ',

        // Home Page
        'view_courses': 'কোর্সসমূহ দেখুন',
        'verify_certificate': 'সার্টিফিকেট যাচাই',
        'our_trainings': 'আমাদের প্রশিক্ষণ সমূহ',
        'our_courses': 'আমাদের কোর্সসমূহ',
        'all_courses': 'সকল কোর্স দেখুন',
        'our_features': 'আমাদের বৈশিষ্ট্য',
        'our_gallery': 'আমাদের গ্যালারি',
        'all_photos': 'সব ছবি দেখুন',
        'why_choose_us': 'কেন আমাদের বেছে নেবেন?',
        'contact_us': 'যোগাযোগ করুন',
        'contact_intro': 'আপনার যেকোনো প্রশ্নের উত্তর দিতে আমরা এখানে আছি। আমাদের সাথে যোগাযোগ করুন।',
        'address': 'ঠিকানা',
        'phone': 'ফোন',
        'email': 'ইমেইল',
        'read_more': 'বিস্তারিত জানুন',
        'price': 'মূল্য',
        'offer_price': 'অফার মূল্য',
        'offer_ends': 'অফার শেষ হবে',

        // Certificate Page
        'verify_certificate_title': 'সার্টিফিকেট যাচাই করুন',
        'verify_certificate_intro': 'আপনার স্টুডেন্ট আইডি বা মোবাইল নম্বর দিয়ে সার্চ করুন।',
        'certificate_id_or_phone_placeholder': 'সার্টিফিকেট আইডি বা ফোন নম্বর লিখুন',
        'search': 'অনুসন্ধান',
        'certificate_not_found': 'এই আইডি বা নম্বর দিয়ে কোনো সার্টিফিকেট পাওয়া যায়নি।',
        'certificate_title': 'প্রশিক্ষণ সনদপত্র',
        'this_is_to_certify': 'এই মর্মে প্রত্যয়ন করা যাচ্ছে যে,',
        'student_name': 'নাম',
        'father_name': 'পিতার নাম',
        'course_name': 'কোর্সের নাম',
        'course_duration': 'কোর্সের মেয়াদ',
        'duration': 'সময়কাল',
        'certificate_id': 'সার্টিফিকেট আইডি',
        'wishing_success': 'আমরা তার সার্বিক সাফল্য কামনা করি।',
        'scan_qr': 'স্ক্যান করুন',
        'issue_date': 'ইস্যু তারিখ',
        'director': 'পরিচালক',
        'digitally_verified': 'ডিজিটালভাবে তৈরি ও যাচাইকৃত',
        'download_pdf': 'PDF ডাউনলোড করুন',
        'download_original_pdf': 'মূল সার্টিফিকেট ডাউনলোড করুন',
        'uploaded_certificate_title': 'আপলোডকৃত সার্টিফিকেট',

        // Other Pages
        'all_notices': 'নোটিশ বোর্ড',
        'no_notices': 'আপাতত কোনো নতুন নোটিশ নেই।',
        'our_trainers': 'আমাদের অভিজ্ঞ প্রশিক্ষকগণ',
        'no_trainers': 'কোনো প্রশিক্ষকের তথ্য পাওয়া যায়নি।',
        'no_courses': 'আপাতত কোনো কোর্স উপলব্ধ নেই।',
        'no_gallery': 'গ্যালারিতে কোনো ছবি পাওয়া যায়নি।',
        'our_videos': 'আমাদের ভিডিও গ্যালারি',
        'no_videos': 'কোনো ভিডিও পাওয়া যায়নি।',
        'close': 'বন্ধ করুন',

        // Admin General
        'admin_panel': 'অ্যাডমিন প্যানেল',
        'dashboard': 'ড্যাশবোর্ড',
        'settings': 'সেটিংস',
        'slides': 'স্লাইড',
        'students_certificates': 'ছাত্র ও সার্টিফিকেট',
        'back_to_site': 'সাইটে ফিরে যান',
        'logout': 'লগ আউট',
        'courses_manage': 'কোর্স',
        'gallery_manage': 'গ্যালারি',
        'videos_manage': 'ভিডিও',
        'notices_manage': 'নোটিশ',
        'trainers_manage': 'প্রশিক্ষক',
        'trainings_manage': 'প্রশিক্ষণ সমূহ',
        'edit': 'এডিট',
        'delete': 'ডিলিট',
        'cancel': 'বাতিল',
        'add': 'যোগ করুন',
        'update': 'আপডেট করুন',
        'actions': 'অ্যাকশন',
        'upload_from_device': 'ডিভাইস থেকে আপলোড',
        'or_enter_image_url': 'অথবা ছবির URL দিন',
        'image_url_placeholder': 'ছবির URL পেস্ট করুন',

        // Admin Login
        'admin_login_title': 'অ্যাডমিন লগইন',
        'demo_info': '(ডেমো এর জন্য ইমেইল: admin@example.com এবং পাসওয়ার্ড: admin123 ব্যবহার করুন)',
        'email_label': 'ইমেইল',
        'password_label': 'পাসওয়ার্ড',
        'login_button': 'লগইন করুন',
        'password_incorrect': 'পাসওয়ার্ড সঠিক নয়।',
        
        // Admin Dashboard
        'total_students': 'মোট ছাত্র',
        'total_trainers': 'মোট প্রশিক্ষক',
        'total_notices': 'মোট নোটিশ',
        'total_courses': 'মোট কোর্স',
        'gallery_photos': 'গ্যালারিতে ছবি',
        'total_videos': 'মোট ভিডিও',

        // Admin Settings
        'settings_title': 'ওয়েবসাইট সেটিংস',
        'settings_general': 'সাধারণ সেটিংস',
        'settings_site_name_bn': 'ওয়েবসাইটের নাম (বাংলা)',
        'settings_site_name_en': 'ওয়েবসাইটের নাম (English)',
        'settings_logo_image': 'লোগো ছবি',
        'settings_favicon_image': 'ফ্যাভিকন ছবি',
        'settings_signature_image': 'পরিচালকের স্বাক্ষর ছবি',
        'settings_description_bn': 'ডিসক্রিপশন (বাংলা)',
        'settings_description_en': 'ডিসক্রিপশন (English)',
        'settings_address_bn': 'ঠিকানা (বাংলা)',
        'settings_address_en': 'ঠিকানা (English)',
        'settings_phone': 'ফোন নম্বর',
        'settings_email_label': 'ইমেইল',
        'settings_whatsapp': 'WhatsApp নম্বর',
        'settings_google_map_url': 'Google Map Embed URL',
        'settings_features_section': '"আমাদের বৈশিষ্ট্য" সেকশন',
        'settings_why_choose_us_section': '"কেন আমাদের বেছে নেবেন?" সেকশন',
        'settings_why_choose_us_image': '"কেন আমাদের বেছে নেবেন?" সেকশনের ছবি',
        'settings_icon_placeholder': 'আইকন (e.g., 👨‍🏫)',
        'settings_title_bn_placeholder': 'টাইটেল (বাংলা)',
        'settings_title_en_placeholder': 'Title (English)',
        'settings_desc_bn_placeholder': 'বিবরণ (বাংলা)',
        'settings_desc_en_placeholder': 'Description (English)',
        'settings_add_feature': 'নতুন বৈশিষ্ট্য যোগ করুন',
        'settings_add_reason': 'নতুন কারণ যোগ করুন',
        'settings_save_all': 'সকল সেটিংস সেভ করুন',
        'settings_success_message': 'সেটিংস সফলভাবে আপডেট করা হয়েছে!',

        // Admin Slides
        'slides_title': 'স্লাইড শো ম্যানেজমেন্ট',
        'slides_add_new': 'নতুন স্লাইড যোগ করুন',
        'slides_image': 'স্লাইডের ছবি',
        'slides_caption_bn': 'ক্যাপশন (বাংলা)',
        'slides_caption_en': 'Caption (English)',
        'slides_current': 'বর্তমান স্লাইডসমূহ',

        // Admin Courses
        'courses_title': 'কোর্স ম্যানেজমেন্ট',
        'courses_add_new': 'নতুন কোর্স যোগ করুন',
        'courses_edit': 'কোর্স এডিট করুন',
        'courses_name_bn': 'কোর্সের নাম (বাংলা)',
        'courses_name_en': 'Course Name (English)',
        'courses_short_desc_bn': 'সংক্ষিপ্ত বিবরণ (বাংলা)',
        'courses_short_desc_en': 'Short Description (English)',
        'courses_image': 'কোর্সের ছবি',
        'courses_details_bn': 'বিস্তারিত বিবরণ (বাংলা)',
        'courses_details_en': 'Details (English)',
        'courses_price': 'মূল্য (BDT)',
        'courses_offer_price': 'অফার মূল্য (BDT)',
        'courses_offer_end_date': 'অফার শেষ হওয়ার তারিখ',
        'courses_all': 'সকল কোর্স',

        // Admin Trainings
        'trainings_title': 'প্রশিক্ষণ আইটেম ম্যানেজমেন্ট',
        'trainings_add_new': 'নতুন আইটেম যোগ করুন',
        'trainings_edit': 'আইটেম এডিট করুন',
        'trainings_name_bn': 'নাম (বাংলা)',
        'trainings_name_en': 'Name (English)',
        'trainings_image': 'ছবি',
        'trainings_all': 'সকল প্রশিক্ষণ আইটেম',
        
        // Admin Gallery
        'gallery_title': 'গ্যালারি ম্যানেজমেন্ট',
        'gallery_add_new': 'নতুন ছবি যোগ করুন',
        'gallery_image': 'গ্যালারির ছবি',
        'gallery_desc_bn': 'বিবরণ (বাংলা)',
        'gallery_desc_en': 'Description (English)',
        'gallery_all': 'গ্যালারির ছবিসমূহ',

        // Admin Videos
        'videos_title': 'ভিডিও ম্যানেজমেন্ট',
        'videos_add_new': 'নতুন ভিডিও যোগ করুন',
        'videos_edit': 'ভিডিও এডিট করুন',
        'videos_title_bn': 'টাইটেল (বাংলা)',
        'videos_title_en': 'Title (English)',
        'videos_youtube_url': 'ইউটিউব ভিডিও URL',
        'videos_all': 'সকল ভিডিও',

        // Admin Notices
        'notices_title': 'নোটিশ ম্যানেজমেন্ট',
        'notices_add_new': 'নতুন নোটিশ যোগ করুন',
        'notices_edit': 'নোটিশ এডিট করুন',
        'notices_title_bn': 'টাইটেল (বাংলা)',
        'notices_title_en': 'Title (English)',
        'notices_date': 'তারিখ',
        'notices_content_bn': 'বিবরণ (বাংলা)',
        'notices_content_en': 'Content (English)',
        'notices_all': 'সকল নোটিশ',
        
        // Admin Trainers
        'trainers_title': 'প্রশিক্ষক ম্যানেজমেন্ট',
        'trainers_add_new': 'নতুন প্রশিক্ষক যোগ করুন',
        'trainers_edit': 'প্রশিক্ষক এডিট করুন',
        'trainers_name_bn': 'নাম (বাংলা)',
        'trainers_name_en': 'Name (English)',
        'trainers_phone': 'ফোন নম্বর',
        'trainers_expertise_bn': 'দক্ষতা (বাংলা)',
        'trainers_expertise_en': 'Expertise (English)',
        'trainers_address_bn': 'ঠিকানা (বাংলা)',
        'trainers_address_en': 'Address (English)',
        'trainers_image': 'প্রশিক্ষকের ছবি',
        'trainers_all': 'সকল প্রশিক্ষক',
        
        // Admin Students
        'students_title': 'ছাত্র ও সার্টিফিকেট ম্যানেজমেন্ট',
        'students_add_new': 'নতুন ছাত্র যোগ করুন',
        'students_edit': 'ছাত্রের তথ্য এডিট করুন',
        'students_id': 'সার্টিফিকেট/স্টুডেন্ট আইডি',
        'students_name': 'ছাত্রের নাম',
        'students_father_name': 'বাবার নাম',
        'students_phone': 'ফোন নম্বর',
        'students_course_name_bn': 'কোর্সের নাম (বাংলা)',
        'students_course_name_en': 'Course Name (English)',
        'students_course_duration_bn': 'কোর্সের মেয়াদ (বাংলা)',
        'students_course_duration_en': 'Course Duration (English)',
        'students_start_date': 'শুরুর তারিখ',
        'students_end_date': 'শেষ তারিখ',
        'students_image': 'ছাত্রের ছবি (ঐচ্ছিক)',
        'students_image_crop_title': 'ছবি ক্রপ করুন',
        'students_image_crop_button': 'ক্রপ করুন',
        'students_certificate_pdf': 'সার্টিফিকেট PDF (ঐচ্ছিক)',
        'students_pdf_size_error': 'ফাইলের সাইজ 1MB এর কম হতে হবে।',
        'students_pdf_type_error': 'শুধুমাত্র PDF ফাইল আপলোড করা যাবে।',
        'students_view_uploaded_pdf': 'আপলোড করা PDF দেখুন',
        'students_all': 'সকল ছাত্র',
        'students_cert_id': 'সার্টিফিকেট আইডি',
        'students_duration': 'সময়কাল',
        'students_fill_all_fields': 'অনুগ্রহ করে সকল তথ্য পূরণ করুন।',
        'students_id_exists': 'এই সার্টিফিকেট আইডি দিয়ে একজন ছাত্র অলরেডি রেজিস্টার করা আছে।',
        'upload_certificate': 'সার্টিফিকেট আপলোড',
        'upload_certificate_title': 'বিদ্যমান ছাত্রের জন্য সার্টিফিকেট আপলোড করুন',
        'upload_certificate_intro': 'ছাত্রের আইডি এবং মোবাইল নম্বর দিয়ে তাদের প্রোফাইলে সরাসরি সার্টিফিকেট PDF আপলোড করুন।',
        'student_id_placeholder': 'ছাত্রের আইডি লিখুন',
        'student_phone_placeholder': 'ছাত্রের ফোন নম্বর লিখুন',
        'select_pdf': 'PDF ফাইল নির্বাচন করুন',
        'upload_button': 'আপলোড করুন',
        'student_not_found_for_upload': 'এই আইডি এবং মোবাইল নম্বর দিয়ে কোনো ছাত্র পাওয়া যায়নি।',
        'upload_success': 'সার্টিফিকেট সফলভাবে আপলোড করা হয়েছে!',

    },
    en: {
        // Header & Footer
        'home': 'Home',
        'courses': 'Courses',
        'gallery': 'Gallery',
        'videos': 'Videos',
        'certificate_verification': 'Certificate Verification',
        'notices': 'Notices',
        'trainers': 'Trainers',
        'admin_login': 'Admin Login',
        'copyright': '© 2025 Welder Training Center. All rights reserved.',
        'language_switch': 'বাংলা',
        'quick_links': 'Quick Links',
        'contact': 'Contact',

        // Home Page
        'view_courses': 'View Courses',
        'verify_certificate': 'Verify Certificate',
        'our_trainings': 'Our Trainings',
        'our_courses': 'Our Courses',
        'all_courses': 'View All Courses',
        'our_features': 'Our Features',
        'our_gallery': 'Our Gallery',
        'all_photos': 'See All Photos',
        'why_choose_us': 'Why Choose Us?',
        'contact_us': 'Contact Us',
        'contact_intro': 'We are here to answer any questions you may have. Get in touch with us.',
        'address': 'Address',
        'phone': 'Phone',
        'email': 'Email',
        'read_more': 'Read More',
        'price': 'Price',
        'offer_price': 'Offer Price',
        'offer_ends': 'Offer Ends',

        // Certificate Page
        'verify_certificate_title': 'Verify Your Certificate',
        'verify_certificate_intro': 'Search with your Student ID or Mobile Number.',
        'certificate_id_or_phone_placeholder': 'Enter Certificate ID or Phone Number',
        'search': 'Search',
        'certificate_not_found': 'No certificate found with this ID or number.',
        'certificate_title': 'Certificate of Training',
        'this_is_to_certify': 'This is to certify that,',
        'student_name': 'Name',
        'father_name': "Father's Name",
        'course_name': 'Course Name',
        'course_duration': 'Course Duration',
        'duration': 'Duration',
        'certificate_id': 'Certificate ID',
        'wishing_success': 'We wish him/her every success in life.',
        'scan_qr': 'Scan QR',
        'issue_date': 'Issue Date',
        'director': 'Director',
        'digitally_verified': 'Digitally generated and verified',
        'download_pdf': 'Download PDF',
        'download_original_pdf': 'Download Original Certificate',
        'uploaded_certificate_title': 'Uploaded Certificate',

        // Other Pages
        'all_notices': 'Notice Board',
        'no_notices': 'No new notices at the moment.',
        'our_trainers': 'Our Experienced Trainers',
        'no_trainers': 'No trainer information found.',
        'no_courses': 'No courses available at the moment.',
        'no_gallery': 'No photos found in the gallery.',
        'our_videos': 'Our Video Gallery',
        'no_videos': 'No videos found.',
        'close': 'Close',

        // Admin General
        'admin_panel': 'Admin Panel',
        'dashboard': 'Dashboard',
        'settings': 'Settings',
        'slides': 'Slides',
        'students_certificates': 'Students & Certificates',
        'back_to_site': 'Back to Site',
        'logout': 'Logout',
        'courses_manage': 'Courses',
        'gallery_manage': 'Gallery',
        'videos_manage': 'Videos',
        'notices_manage': 'Notices',
        'trainers_manage': 'Trainers',
        'trainings_manage': 'Trainings',
        'edit': 'Edit',
        'delete': 'Delete',
        'cancel': 'Cancel',
        'add': 'Add',
        'update': 'Update',
        'actions': 'Actions',
        'upload_from_device': 'Upload from Device',
        'or_enter_image_url': 'Or enter Image URL',
        'image_url_placeholder': 'Paste image URL',
        
        // Admin Login
        'admin_login_title': 'Admin Login',
        'demo_info': '(For demo, use email: admin@example.com and password: admin123)',
        'email_label': 'Email',
        'password_label': 'Password',
        'login_button': 'Login',
        'password_incorrect': 'Incorrect password.',

        // Admin Dashboard
        'total_students': 'Total Students',
        'total_trainers': 'Total Trainers',
        'total_notices': 'Total Notices',
        'total_courses': 'Total Courses',
        'gallery_photos': 'Photos in Gallery',
        'total_videos': 'Total Videos',

        // Admin Settings
        'settings_title': 'Website Settings',
        'settings_general': 'General Settings',
        'settings_site_name_bn': 'Website Name (Bengali)',
        'settings_site_name_en': 'Website Name (English)',
        'settings_logo_image': 'Logo Image',
        'settings_favicon_image': 'Favicon Image',
        'settings_signature_image': "Director's Signature Image",
        'settings_description_bn': 'Description (Bengali)',
        'settings_description_en': 'Description (English)',
        'settings_address_bn': 'Address (Bengali)',
        'settings_address_en': 'Address (English)',
        'settings_phone': 'Phone Number',
        'settings_email_label': 'Email',
        'settings_whatsapp': 'WhatsApp Number',
        'settings_google_map_url': 'Google Map Embed URL',
        'settings_features_section': '"Our Features" Section',
        'settings_why_choose_us_section': '"Why Choose Us?" Section',
        'settings_why_choose_us_image': '"Why Choose Us?" Section Image',
        'settings_icon_placeholder': 'Icon (e.g., 👨‍🏫)',
        'settings_title_bn_placeholder': 'Title (Bengali)',
        'settings_title_en_placeholder': 'Title (English)',
        'settings_desc_bn_placeholder': 'Description (Bengali)',
        'settings_desc_en_placeholder': 'Description (English)',
        'settings_add_feature': 'Add New Feature',
        'settings_add_reason': 'Add New Reason',
        'settings_save_all': 'Save All Settings',
        'settings_success_message': 'Settings updated successfully!',

        // Admin Slides
        'slides_title': 'Slide Show Management',
        'slides_add_new': 'Add New Slide',
        'slides_image': 'Slide Image',
        'slides_caption_bn': 'Caption (Bengali)',
        'slides_caption_en': 'Caption (English)',
        'slides_current': 'Current Slides',

        // Admin Courses
        'courses_title': 'Course Management',
        'courses_add_new': 'Add New Course',
        'courses_edit': 'Edit Course',
        'courses_name_bn': 'Course Name (Bengali)',
        'courses_name_en': 'Course Name (English)',
        'courses_short_desc_bn': 'Short Description (Bengali)',
        'courses_short_desc_en': 'Short Description (English)',
        'courses_image': 'Course Image',
        'courses_details_bn': 'Details (Bengali)',
        'courses_details_en': 'Details (English)',
        'courses_price': 'Price (BDT)',
        'courses_offer_price': 'Offer Price (BDT)',
        'courses_offer_end_date': 'Offer End Date',
        'courses_all': 'All Courses',
        
        // Admin Trainings
        'trainings_title': 'Training Item Management',
        'trainings_add_new': 'Add New Item',
        'trainings_edit': 'Edit Item',
        'trainings_name_bn': 'Name (Bengali)',
        'trainings_name_en': 'Name (English)',
        'trainings_image': 'Image',
        'trainings_all': 'All Training Items',

        // Admin Gallery
        'gallery_title': 'Gallery Management',
        'gallery_add_new': 'Add New Photo',
        'gallery_image': 'Gallery Image',
        'gallery_desc_bn': 'Description (Bengali)',
        'gallery_desc_en': 'Description (English)',
        'gallery_all': 'Gallery Photos',

        // Admin Videos
        'videos_title': 'Video Management',
        'videos_add_new': 'Add New Video',
        'videos_edit': 'Edit Video',
        'videos_title_bn': 'Title (Bengali)',
        'videos_title_en': 'Title (English)',
        'videos_youtube_url': 'YouTube Video URL',
        'videos_all': 'All Videos',

        // Admin Notices
        'notices_title': 'Notice Management',
        'notices_add_new': 'Add New Notice',
        'notices_edit': 'Edit Notice',
        'notices_title_bn': 'Title (Bengali)',
        'notices_title_en': 'Title (English)',
        'notices_date': 'Date',
        'notices_content_bn': 'Content (Bengali)',
        'notices_content_en': 'Content (English)',
        'notices_all': 'All Notices',

        // Admin Trainers
        'trainers_title': 'Trainer Management',
        'trainers_add_new': 'Add New Trainer',
        'trainers_edit': 'Edit Trainer',
        'trainers_name_bn': 'Name (Bengali)',
        'trainers_name_en': 'Name (English)',
        'trainers_phone': 'Phone Number',
        'trainers_expertise_bn': 'Expertise (Bengali)',
        'trainers_expertise_en': 'Expertise (English)',
        'trainers_address_bn': 'Address (Bengali)',
        'trainers_address_en': 'Address (English)',
        'trainers_image': 'Trainer Photo',
        'trainers_all': 'All Trainers',

        // Admin Students
        'students_title': 'Student & Certificate Management',
        'students_add_new': 'Add New Student',
        'students_edit': 'Edit Student Info',
        'students_id': 'Certificate/Student ID',
        'students_name': 'Student Name',
        'students_father_name': "Father's Name",
        'students_phone': 'Phone Number',
        'students_course_name_bn': 'Course Name (Bengali)',
        'students_course_name_en': 'Course Name (English)',
        'students_course_duration_bn': 'Course Duration (Bengali)',
        'students_course_duration_en': 'Course Duration (English)',
        'students_start_date': 'Start Date',
        'students_end_date': 'End Date',
        'students_image': 'Student Photo (Optional)',
        'students_image_crop_title': 'Crop Image',
        'students_image_crop_button': 'Crop',
        'students_certificate_pdf': 'Certificate PDF (Optional)',
        'students_pdf_size_error': 'File size must be under 1MB.',
        'students_pdf_type_error': 'Only PDF files are allowed.',
        'students_view_uploaded_pdf': 'View Uploaded PDF',
        'students_all': 'All Students',
        'students_cert_id': 'Certificate ID',
        'students_duration': 'Duration',
        'students_fill_all_fields': 'Please fill in all required fields.',
        'students_id_exists': 'A student with this Certificate ID already exists.',
        'upload_certificate': 'Upload Certificate',
        'upload_certificate_title': 'Upload Certificate for Existing Student',
        'upload_certificate_intro': 'Upload a certificate PDF directly to a student\'s profile using their ID and mobile number.',
        'student_id_placeholder': 'Enter Student ID',
        'student_phone_placeholder': 'Enter Student Phone Number',
        'select_pdf': 'Select PDF File',
        'upload_button': 'Upload',
        'student_not_found_for_upload': 'No student found with this ID and mobile number.',
        'upload_success': 'Certificate uploaded successfully!',
    },
};

type Lang = 'bn' | 'en';

const initialSiteSettings: SiteSettings = {
  name_bn: "ওয়েল্ডার ট্রেনিং সেন্টার",
  name_en: "Welder Training Center",
  logoUrl: "https://i.ibb.co/9vVYg03/welding-logo.png",
  faviconUrl: "https://i.ibb.co/9vVYg03/welding-logo.png",
  signatureUrl: "https://i.ibb.co/SNkZ0Z2/signature.png", // Placeholder signature
  description_bn: "আন্তর্জাতিক মানের ওয়েল্ডিং প্রশিক্ষণ নিয়ে আপনার ক্যারিয়ার গড়ুন। আমরা আপনাকে দিচ্ছি সেরা প্রশিক্ষণ।",
  description_en: "Build your career with international standard welding training. We provide you with the best training.",
  address_bn: "১২৩, ওয়েল্ডিং রোড, ঢাকা, বাংলাদেশ",
  address_en: "123, Welding Road, Dhaka, Bangladesh",
  phone: "+8801234567890",
  email: "contact@welders.com",
  whatsappNumber: "8801234567890",
  googleMapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3651.872855146035!2d90.39257231542468!3d23.751948894576394!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755b8bd552c2b3b%3A0x4e70f1178de97e2c!2sDhaka!5e0!3m2!1sen!2sbd!4v1627892080829!5m2!1sen!2sbd",
  whyChooseUsImageUrl: "https://images.unsplash.com/photo-1621905252472-943afaa20e20?q=80&w=1470&auto=format&fit=crop",
  features: [
      { id: '1', icon: '👨‍🏫', title_bn: 'অভিজ্ঞ প্রশিক্ষক', title_en: 'Experienced Trainers', description_bn: 'আমাদের সকল প্রশিক্ষক इंडस्ट्री एक्सपर्ट এবং অভিজ্ঞ।', description_en: 'All our trainers are industry experts and experienced.' },
      { id: '2', icon: '🛠️', title_bn: 'আধুনিক সরঞ্জাম', title_en: 'Modern Equipment', description_bn: 'আমরা অত্যাধুনিক ওয়েল্ডিং মেশিন ও সরঞ্জাম ব্যবহার করি।', description_en: 'We use state-of-the-art welding machines and equipment.' },
      { id: '3', icon: '📜', title_bn: 'সনদপত্র প্রদান', title_en: 'Certification', description_bn: 'কোর্স শেষে আন্তর্জাতিকভাবে স্বীকৃত সনদপত্র প্রদান করা হয়।', description_en: 'Internationally recognized certificates are awarded upon course completion.' },
  ],
  whyChooseUs: [
      { id: '1', icon: '👨‍🔧', title_bn: 'হাতে-কলমে প্রশিক্ষণ', title_en: 'Hands-on Training', description_bn: 'আমরা প্রতিটি ছাত্রকে হাতে-কলমে কাজ শেখানোর উপর গুরুত্ব দেই।', description_en: 'We emphasize teaching each student through hands-on work.' },
      { id: '2', icon: '💼', title_bn: 'চাকরির সুযোগ', title_en: 'Job Placement', description_bn: 'কোর্স শেষে আমরা ছাত্রদের চাকরির জন্য সহায়তা করে থাকি।', description_en: 'We assist students with job placement after the course.' },
      { id: '3', icon: '🌍', title_bn: 'আন্তর্জাতিক মান', title_en: 'International Standards', description_bn: 'আমাদের প্রশিক্ষণের মান আন্তর্জাতিক স্তরের।', description_en: 'Our training standards are of an international level.' },
  ],
};

const initialSlides: Slide[] = [
  { id: '1', imageUrl: 'https://images.unsplash.com/photo-1533013214436-8d18e95454d0?q=80&w=1470&auto=format&fit=crop', caption_bn: 'আন্তর্জাতিক মানের প্রশিক্ষণ', caption_en: 'International Standard Training' },
  { id: '2', imageUrl: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?q=80&w=1469&auto=format&fit=crop', caption_bn: 'নিরাপদ এবং আধুনিক ওয়ার্কশপ', caption_en: 'Safe and Modern Workshop' },
  { id: '3', imageUrl: 'https://images.unsplash.com/photo-1581295247833-df5d5138c238?q=80&w=1470&auto=format&fit=crop', caption_bn: 'উজ্জ্বল ভবিষ্যতের নিশ্চয়তা', caption_en: 'Guarantee of a Bright Future' },
];

const initialNotices: Notice[] = [
  { id: '1', title_bn: 'নতুন ব্যাচের ভর্তি চলছে', title_en: 'Admission for New Batch is Open', date: '2025-01-15', content_bn: 'TIG এবং MIG ওয়েল্ডিং কোর্সের নতুন ব্যাচের ভর্তি শুরু হয়েছে। আসন সংখ্যা সীমিত।', content_en: 'Admission for the new batch of TIG and MIG welding courses has started. Seats are limited.' },
  { id: '2', title_bn: 'সার্টিফিকেট বিতরণ অনুষ্ঠান', title_en: 'Certificate Distribution Ceremony', date: '2025-01-10', content_bn: 'গত ব্যাচের ছাত্রদের সার্টিফিকেট আগামী ২০শে জানুয়ারি বিতরণ করা হবে।', content_en: 'Certificates for the previous batch of students will be distributed on the 20th of January.' },
];

const initialTrainers: Trainer[] = [
    { id: '1', name_bn: 'মোঃ রফিকুল ইসলাম', name_en: 'Md. Rafiqul Islam', phone: '01711223344', address_bn: 'ঢাকা', address_en: 'Dhaka', expertise_bn: 'TIG Welding', expertise_en: 'TIG Welding', imageUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=400&h=400&fit=crop' },
    { id: '2', name_bn: 'আব্দুল করিম', name_en: 'Abdul Karim', phone: '01811223355', address_bn: 'চট্টগ্রাম', address_en: 'Chattogram', expertise_bn: 'MIG Welding', expertise_en: 'MIG Welding', imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&h=400&fit=crop' },
    { id: '3', name_bn: 'হাসান মাহমুদ', name_en: 'Hasan Mahmud', phone: '01911223366', address_bn: 'ঢাকা', address_en: 'Dhaka', expertise_bn: 'ARC Welding', expertise_en: 'ARC Welding', imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&h=400&fit=crop' },
];

const initialStudents: Student[] = [
    { id: 'WTC-1001', name: 'John Doe', fatherName: 'Richard Doe', phone: '0123456789', courseName_bn: 'TIG ওয়েল্ডিং', courseName_en: 'TIG Welding', courseDuration_bn: '৩ মাস', courseDuration_en: '3 Months', startDate: '2024-10-01', endDate: '2024-12-31', imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&h=400&fit=crop', certificatePdfUrl: undefined },
    { id: 'WTC-1002', name: 'Jane Smith', fatherName: 'Robert Smith', phone: '0198765432', courseName_bn: 'MIG ওয়েল্ডিং', courseName_en: 'MIG Welding', courseDuration_bn: '৩ মাস', courseDuration_en: '3 Months', startDate: '2024-10-01', endDate: '2024-12-31', imageUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=400&h=400&fit=crop', certificatePdfUrl: undefined },
    { id: 'WTC-1003', name: 'আরিফুল ইসলাম', fatherName: 'সিরাজুল ইসলাম', phone: '01500000003', courseName_bn: 'ARC ওয়েল্ডিং', courseName_en: 'ARC Welding', courseDuration_bn: '৩ মাস', courseDuration_en: '3 Months', startDate: '2025-01-01', endDate: '2025-03-31', imageUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=400&h=400&fit=crop', certificatePdfUrl: undefined }
];

const initialCourses: Course[] = [
    { id: '1', name_bn: 'TIG ওয়েল্ডিং', name_en: 'TIG Welding', shortDescription_bn: 'উন্নত মানের TIG ওয়েল্ডিং শিখুন।', shortDescription_en: 'Learn high-quality TIG welding.', imageUrl: 'https://images.unsplash.com/photo-1612801454333-f8a7e4b5443a?q=80&w=600&h=400&fit=crop', details_bn: 'এই কোর্সে আপনি শিখবেন:\n- আর্গন গ্যাস ওয়েল্ডিং\n- স্টেইনলেস স্টিল ওয়েল্ডিং\n- অ্যালুমিনিয়াম ওয়েল্ডিং', details_en: 'In this course, you will learn:\n- Argon gas welding\n- Stainless steel welding\n- Aluminum welding', price: 15000, offerPrice: 12000, offerEndDate: '2025-12-31' },
    { id: '2', name_bn: 'MIG ওয়েল্ডিং', name_en: 'MIG Welding', shortDescription_bn: 'দ্রুত এবং কার্যকর MIG ওয়েল্ডিং।', shortDescription_en: 'Fast and effective MIG welding.', imageUrl: 'https://images.unsplash.com/photo-1605481942004-9476464f4361?q=80&w=600&h=400&fit=crop', details_bn: 'এই কোর্সে আপনি শিখবেন:\n- কার্বন ডাইঅক্সাইড গ্যাস ওয়েল্ডিং\n- ভারী মেটাল ওয়েল্ডিং\n- স্বয়ংক্রিয় ওয়েল্ডিং প্রক্রিয়া', details_en: 'In this course, you will learn:\n- Carbon dioxide gas welding\n- Heavy metal welding\n- Automatic welding processes', price: 14000 },
    { id: '3', name_bn: 'ARC ওয়েল্ডিং', name_en: 'ARC Welding', shortDescription_bn: 'সাধারণ এবং বহুল ব্যবহৃত ARC ওয়েল্ডিং।', shortDescription_en: 'Common and widely used ARC welding.', imageUrl: 'https://images.unsplash.com/photo-1551699290-67c9f8c2ac71?q=80&w=600&h=400&fit=crop', details_bn: 'এই কোর্সে আপনি শিখবেন:\n- বেসিক ওয়েল্ডিং কৌশল\n- বিভিন্ন ধরণের রড ব্যবহার\n- নিরাপত্তা বিধি', details_en: 'In this course, you will learn:\n- Basic welding techniques\n- Use of different types of rods\n- Safety regulations', price: 10000, offerPrice: 8500, offerEndDate: '2024-01-01' },
];

const initialGalleryItems: GalleryItem[] = [
    { id: '1', imageUrl: 'https://plus.unsplash.com/premium_photo-1678812165223-261a8f94d21f?q=80&w=600&h=400&fit=crop', description_bn: 'আমাদের ওয়ার্কশপের একটি দৃশ্য', description_en: 'A view of our workshop' },
    { id: '2', imageUrl: 'https://images.unsplash.com/photo-1633596683179-a7fd41885a53?q=80&w=600&h=400&fit=crop', description_bn: 'ছাত্ররা কাজ শিখছে', description_en: 'Students learning their craft' },
    { id: '3', imageUrl: 'https://images.unsplash.com/photo-1505798577917-3b27595a8b27?q=80&w=600&h=400&fit=crop', description_bn: 'অভিজ্ঞ প্রশিক্ষক হাতে-কলমে শেখাচ্ছেন', description_en: 'Experienced trainer providing hands-on guidance' },
    { id: '4', imageUrl: 'https://images.unsplash.com/photo-1594367035223-aa53455118a7?q=80&w=600&h=400&fit=crop', description_bn: 'প্র্যাকটিক্যাল ক্লাস চলছে', description_en: 'Practical class in session' },
];

const initialTrainingItems: TrainingItem[] = [
    { id: '1', name_bn: 'TIG ওয়েল্ডিং', name_en: 'TIG Welding', imageUrl: 'https://images.unsplash.com/photo-1612801454333-f8a7e4b5443a?q=80&w=400&h=300&fit=crop' },
    { id: '2', name_bn: 'MIG ওয়েল্ডিং', name_en: 'MIG Welding', imageUrl: 'https://images.unsplash.com/photo-1605481942004-9476464f4361?q=80&w=400&h=300&fit=crop' },
    { id: '3', name_bn: 'ARC ওয়েল্ডিং', name_en: 'ARC Welding', imageUrl: 'https://images.unsplash.com/photo-1551699290-67c9f8c2ac71?q=80&w=400&h=300&fit=crop' },
    { id: '4', name_bn: 'গ্যাস ওয়েল্ডিং', name_en: 'Gas Welding', imageUrl: 'https://plus.unsplash.com/premium_photo-1678812165223-261a8f94d21f?q=80&w=400&h=300&fit=crop' },
    { id: '5', name_bn: 'পাইপ ওয়েল্ডিং', name_en: 'Pipe Welding', imageUrl: 'https://images.unsplash.com/photo-1581295247833-df5d5138c238?q=80&w=400&h=300&fit=crop' },
    { id: '6', name_bn: 'প্লেট ওয়েল্ডিং', name_en: 'Plate Welding', imageUrl: 'https://images.unsplash.com/photo-1633596683179-a7fd41885a53?q=80&w=400&h=300&fit=crop' },
];

const initialVideos: Video[] = [
    { id: '1', title_bn: 'বেসিক ওয়েল্ডিং কৌশল', title_en: 'Basic Welding Techniques', youtubeUrl: 'https://www.youtube.com/watch?v=c0kY1L-s_tE' },
    { id: '2', title_bn: 'TIG ওয়েল্ডিং টিউটোরিয়াল', title_en: 'TIG Welding Tutorial', youtubeUrl: 'https://www.youtube.com/watch?v=8i5-x3_2jF4' },
    { id: '3', title_bn: 'নিরাপত্তা টিপস', title_en: 'Safety Tips', youtubeUrl: 'https://www.youtube.com/watch?v=S4_iQ-ySo-E' },
];

interface AppContextType {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: keyof typeof translations.bn) => string;
  
  siteSettings: SiteSettings;
  slides: Slide[];
  notices: Notice[];
  trainers: Trainer[];
  students: Student[];
  courses: Course[];
  galleryItems: GalleryItem[];
  trainingItems: TrainingItem[];
  videos: Video[];

  isAuthenticated: boolean;
  login: (password: string) => boolean;
  logout: () => void;

  findStudent: (query: string) => Student | undefined;
  updateSiteSettings: (settings: SiteSettings) => void;

  addSlide: (slide: Omit<Slide, 'id'>) => void;
  deleteSlide: (id: string) => void;

  addNotice: (notice: Omit<Notice, 'id'>) => void;
  updateNotice: (notice: Notice) => void;
  deleteNotice: (id: string) => void;

  addTrainer: (trainer: Omit<Trainer, 'id'>) => void;
  updateTrainer: (trainer: Trainer) => void;
  deleteTrainer: (id: string) => void;

  addStudent: (student: Student) => void;
  updateStudent: (student: Student) => void;
  deleteStudent: (id: string) => void;

  addCourse: (course: Omit<Course, 'id'>) => void;
  updateCourse: (course: Course) => void;
  deleteCourse: (id: string) => void;

  addGalleryItem: (item: Omit<GalleryItem, 'id'>) => void;
  deleteGalleryItem: (id: string) => void;

  addTrainingItem: (item: Omit<TrainingItem, 'id'>) => void;
  updateTrainingItem: (item: TrainingItem) => void;
  deleteTrainingItem: (id: string) => void;

  addVideo: (item: Omit<Video, 'id'>) => void;
  updateVideo: (item: Video) => void;
  deleteVideo: (id: string) => void;
}

export const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [lang, setLang] = useState<Lang>('bn');
    
    const [siteSettings, setSiteSettings] = useLocalStorage<SiteSettings>('wtc-siteSettings', initialSiteSettings);
    const [slides, setSlides] = useLocalStorage<Slide[]>('wtc-slides', initialSlides);
    const [notices, setNotices] = useLocalStorage<Notice[]>('wtc-notices', initialNotices);
    const [trainers, setTrainers] = useLocalStorage<Trainer[]>('wtc-trainers', initialTrainers);
    const [students, setStudents] = useLocalStorage<Student[]>('wtc-students', initialStudents);
    const [courses, setCourses] = useLocalStorage<Course[]>('wtc-courses', initialCourses);
    const [galleryItems, setGalleryItems] = useLocalStorage<GalleryItem[]>('wtc-galleryItems', initialGalleryItems);
    const [trainingItems, setTrainingItems] = useLocalStorage<TrainingItem[]>('wtc-trainingItems', initialTrainingItems);
    const [videos, setVideos] = useLocalStorage<Video[]>('wtc-videos', initialVideos);
    
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => !!sessionStorage.getItem('wtc-auth'));

    const t = useCallback((key: keyof typeof translations.bn) => {
        return translations[lang][key] || key;
    }, [lang]);

    const login = (password: string) => {
        if (password === 'admin123') {
            sessionStorage.setItem('wtc-auth', 'true');
            setIsAuthenticated(true);
            return true;
        }
        return false;
    };

    const logout = () => {
        sessionStorage.removeItem('wtc-auth');
        setIsAuthenticated(false);
    };

    const findStudent = (query: string) => {
        const trimmedQuery = query.trim().toLowerCase();
        return students.find(s => s.id.toLowerCase() === trimmedQuery || s.phone === trimmedQuery);
    };

    const updateSiteSettings = (settings: SiteSettings) => setSiteSettings(settings);

    // CRUD functions with unique ID generation
    const createCrudFunctions = <T extends { id: string }>(
        state: T[],
        setState: React.Dispatch<React.SetStateAction<T[]>>
    ) => ({
        add: (item: Omit<T, 'id'>) => setState(prev => [{ ...item, id: Date.now().toString() } as T, ...prev]),
        update: (updatedItem: T) => setState(prev => prev.map(item => item.id === updatedItem.id ? updatedItem : item)),
        delete: (id: string) => setState(prev => prev.filter(item => item.id !== id)),
    });

    const { add: addSlide, delete: deleteSlide } = createCrudFunctions(slides, setSlides as any);
    const { add: addNotice, update: updateNotice, delete: deleteNotice } = createCrudFunctions(notices, setNotices as any);
    const { add: addTrainer, update: updateTrainer, delete: deleteTrainer } = createCrudFunctions(trainers, setTrainers as any);
    const { add: addCourse, update: updateCourse, delete: deleteCourse } = createCrudFunctions(courses, setCourses as any);
    const { add: addGalleryItem, delete: deleteGalleryItem } = createCrudFunctions(galleryItems, setGalleryItems as any);
    const { add: addTrainingItem, update: updateTrainingItem, delete: deleteTrainingItem } = createCrudFunctions(trainingItems, setTrainingItems as any);
    const { add: addVideo, update: updateVideo, delete: deleteVideo } = createCrudFunctions(videos, setVideos as any);

    const addStudent = (student: Student) => setStudents(prev => [student, ...prev]);
    const updateStudent = (updatedStudent: Student) => setStudents(prev => prev.map(s => s.id === updatedStudent.id ? updatedStudent : s));
    const deleteStudent = (id: string) => setStudents(prev => prev.filter(s => s.id !== id));

    const value = {
        lang, setLang, t,
        siteSettings, slides, notices, trainers, students, courses, galleryItems, trainingItems, videos,
        isAuthenticated, login, logout,
        findStudent, updateSiteSettings,
        addSlide, deleteSlide,
        addNotice, updateNotice, deleteNotice,
        addTrainer, updateTrainer, deleteTrainer,
        addStudent, updateStudent, deleteStudent,
        addCourse, updateCourse, deleteCourse,
        addGalleryItem, deleteGalleryItem,
        addTrainingItem, updateTrainingItem, deleteTrainingItem,
        addVideo, updateVideo, deleteVideo,
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};
