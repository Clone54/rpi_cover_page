import React, { useState, useRef, useEffect } from 'react';
import { Printer, Lightbulb, Download } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface FormFields {
  department: string;
  parba: string;
  shift: string;
  bishoy: string;
  jobNo: string;
  jobName: string;
  studentName: string;
  boardRoll: string;
  session: string;
  date: string;
}

const DEPARTMENTS = [
  'সিভিল টেকনোলজি',
  'মেক্যানিকাল টেকনোলজি',
  'ইলেকট্রিক্যাল টেকনোলজি',
  'মেকাট্রনিক্স টেকনোলজি',
  'ইলেকট্রনিক্স টেকনোলজি',
  'কম্পিউটার টেকনোলজি',
  'ইলেকট্রোমেডিকেল টেকনোলজি',
  'পাওয়ার টেকনোলজি'
];

export default function App() {
  const [formData, setFormData] = useState<FormFields>({
    department: 'ইলেকট্রিক্যাল টেকনোলজি',
    parba: '',
    shift: '',
    bishoy: '',
    jobNo: '',
    jobName: '',
    studentName: '',
    boardRoll: '',
    session: '',
    date: '',
  });

  const [isMobilePreview, setIsMobilePreview] = useState(false);
  const [scale, setScale] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.clientWidth;
        const a4WidthPx = 793.7; // 210mm at 96 DPI
        if (containerWidth < a4WidthPx) {
          setScale((containerWidth - 32) / a4WidthPx); // 32px for padding
        } else {
          setScale(1);
        }
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobilePreview]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = async () => {
    const element = printRef.current;
    if (!element) return;

    // Temporarily apply print styles for accurate PDF rendering
    const originalTransform = element.style.transform;
    element.style.transform = 'scale(1)';

    try {
      const canvas = await html2canvas(element, {
        scale: 2, // Higher resolution
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      // Calculate image dimensions to fit the A4 page (maintaining aspect ratio or just fill it, we will use a4 sizes)
      // A4 ratio is ~ 1:1.414. Our print area is exactly 210x297mm
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('lab-report-cover.pdf');
    } catch (err) {
      console.error('Failed to generate PDF', err);
      alert('PDF ডাউনলোড করতে সমস্যা হয়েছে। দয়া করে আবার চেষ্টা করুন।');
    } finally {
      // Restore styles
      element.style.transform = originalTransform;
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100 font-bangla-sans">
      {/* Sidebar Form (Hidden on Print) */}
      <div className={`print-hidden w-full md:w-80 bg-white border-r border-gray-200 shadow-md flex-col h-auto md:h-screen sticky top-0 overflow-y-auto ${isMobilePreview ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-6 bg-blue-600 text-white shadow-sm flex items-center justify-between">
          <h2 className="text-xl font-bold">ল্যাব রিপোর্ট ফর্ম</h2>
          <div className="hidden md:flex gap-2">
            <button
              onClick={handleDownloadPdf}
              className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
              title="PDF ডাউনলোড করুন"
            >
              <Download size={20} />
            </button>
            <button
              onClick={handlePrint}
              className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
              title="প্রিন্ট করুন"
            >
              <Printer size={20} />
            </button>
          </div>
        </div>

        <div className="p-6 flex-grow flex flex-col gap-4">
          <SelectField label="টেকনোলজি" name="department" value={formData.department} onChange={handleChange} options={DEPARTMENTS} />
          <InputField label="পর্ব" name="parba" value={formData.parba} onChange={handleChange} />
          <InputField label="শিফট" name="shift" value={formData.shift} onChange={handleChange} />
          <InputField label="বিষয়" name="bishoy" value={formData.bishoy} onChange={handleChange} />
          <InputField label="জব নং" name="jobNo" value={formData.jobNo} onChange={handleChange} />
          <InputField label="জবের নাম" name="jobName" value={formData.jobName} onChange={handleChange} />
          <InputField label="ছাত্র/ছাত্রীর নাম" name="studentName" value={formData.studentName} onChange={handleChange} />
          <div className="flex gap-4">
            <InputField label="বোর্ড রোল" name="boardRoll" value={formData.boardRoll} onChange={handleChange} className="flex-1" />
            <InputField label="সেশন" name="session" value={formData.session} onChange={handleChange} className="flex-1" />
          </div>
          <InputField label="জব সম্পাদনের তারিখ" name="date" value={formData.date} onChange={handleChange} type="text" />

          <div className="mt-6 flex flex-col gap-3">
            <button
              type="button"
              onClick={() => setIsMobilePreview(true)}
              className="md:hidden w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold text-lg shadow-md flex items-center justify-center gap-2 transition-colors"
            >
              পরবর্তী ধাপ (Preview)
            </button>
            <div className="hidden md:flex flex-col gap-3">
              <button
                onClick={handlePrint}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-lg shadow-md flex items-center justify-center gap-2 transition-colors"
              >
                <Printer size={22} />
                প্রিন্ট করুন
              </button>
              <button
                onClick={handleDownloadPdf}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-lg shadow-md flex items-center justify-center gap-2 transition-colors"
              >
                <Download size={22} />
                PDF ডাউনলোড
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Preview Area */}
      <div className={`flex-grow flex-col items-center p-4 md:p-8 overflow-auto print:p-0 ${!isMobilePreview ? 'hidden md:flex' : 'flex'}`}>

        {/* Mobile action bar */}
        <div className="md:hidden w-full max-w-[210mm] flex justify-between items-center mb-6 print-hidden">
          <button onClick={() => setIsMobilePreview(false)} className="px-4 py-2 bg-white border border-gray-300 shadow-sm rounded-md text-gray-800 font-bold transition-colors hover:bg-gray-50">
            ফিরে যান
          </button>
          <div className="flex gap-2">
            <button onClick={handleDownloadPdf} className="flex items-center gap-1.5 px-3 py-2 bg-emerald-600 text-white rounded-md shadow-sm font-bold text-sm"><Download size={16} /> PDF</button>
            <button onClick={handlePrint} className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 text-white rounded-md shadow-sm font-bold text-sm"><Printer size={16} /> প্রিন্ট</button>
          </div>
        </div>

        <div ref={containerRef} className="w-full flex justify-center print:block relative overflow-x-hidden print:overflow-visible">
          <div
            className="print:!scale-100 print:!h-auto print:!transform-none origin-top"
            style={{
              transform: `scale(${scale})`,
              height: scale < 1 ? `calc(297mm * ${scale})` : 'auto'
            }}
          >
            <div ref={printRef} className="w-[210mm] h-[297mm] overflow-hidden bg-white print-area font-bangla relative mx-auto flex-shrink-0" style={{ boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>

              {/* Inner Dashed Border */}
              <div className="absolute inset-[16px] border-[3px] border-dashed p-8 flex flex-col" style={{ borderColor: '#1f2937' }}>

                {/* Header section */}
                <div className="text-center mt-2" style={{ color: '#111827' }}>
                  <p className="text-sm font-semibold tracking-wide">প্রতিষ্ঠান কোডঃ-২৩১০৫</p>
                  <h1 className="text-[2.2rem] font-bold mt-1 leading-normal tracking-tight">রাজশাহী পলিটেকনিক ইন্সটিটিউট রাজশাহী</h1>
                  <h2 className="text-2xl font-semibold mt-1">{formData.department}</h2>
                </div>

                {/* Logo */}
                <div className="flex justify-center mt-3 mb-4">
                  <img
                    src="/src/assets/logo.png"
                    alt="Rajshahi Polytechnic Institute Logo"
                    className="w-36 h-36 object-contain"
                  />
                </div>

                {/* Top Row: Parba & Shift */}
                <div className="flex justify-between gap-12 mt-1 w-11/12 mx-auto">
                  <DottedLine label="পর্বঃ-" value={formData.parba} />
                  <DottedLine label="শিফটঃ-" value={formData.shift} />
                </div>

                {/* Box 1: Subject Info */}
                <div className="border-[3px] border-black rounded-[2rem] p-5 pt-4 pb-5 mt-4 mx-2">
                  <div className="flex flex-col gap-4">
                    <DottedLine label="বিষয়ঃ-" value={formData.bishoy} />
                    <DottedLine label="জব নংঃ-" value={formData.jobNo} />
                    <DottedLine label="জবের নামঃ-" value={formData.jobName} />
                  </div>
                </div>

                {/* Box 2: Student Info */}
                <div className="border-[3px] border-black rounded-[2rem] p-5 pt-4 pb-5 mt-4 mx-2">
                  <div className="flex flex-col gap-4">
                    <DottedLine label="ছাত্র/ছাত্রীর নামঃ-" value={formData.studentName} />
                    <div className="flex justify-between gap-10">
                      <DottedLine label="বোর্ড রোলঃ-" value={formData.boardRoll} />
                      <DottedLine label="সেশনঃ-" value={formData.session} />
                    </div>
                    <DottedLine label="জব সম্পাদনের তারিখঃ-" value={formData.date} />
                  </div>
                </div>

                <div className="flex-grow"></div>

                {/* Bottom Section: Marks & Signature */}
                <div className="flex justify-between items-end mb-4 mx-2 mt-6">

                  {/* Marks Distribution Box */}
                  <div className="border-[3px] border-black rounded-xl p-5 pt-3 pb-6 w-[45%]">
                    <h3 className="text-center font-bold text-2xl mb-4 text-black border-b-[3px] border-double border-black pb-2 mx-8 inline-block w-[calc(100%-4rem)]">মানবন্টন</h3>
                    <div className="flex flex-col gap-[0.85rem] text-[1.1rem] font-bold mt-2" style={{ color: '#111827' }}>
                      <MarkRow label="কাজের ধাপ" marks="(৬)" />
                      <MarkRow label="আন্তরিকতার যত্ন" marks="(২)" />
                      <MarkRow label="নিরাপত্তা ও পরিচ্ছন্ন" marks="(২)" />
                      <MarkRow label="মোট" marks="(১০)" />
                    </div>
                  </div>

                  {/* Signature Line */}
                  <div className="mb-4 pr-4">
                    <p className="font-bold text-xl text-black">শিক্ষকের স্বাক্ষর ও তারিখ</p>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Subcomponents

function SelectField({ label, name, value, onChange, options, className = '' }: { label: string, name: string, value: string, onChange: any, options: string[], className?: string }) {
  return (
    <div className={`${className}`}>
      <label className="block text-gray-700 font-bold mb-1.5 text-sm">{label}</label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-bangla-sans"
      >
        <option value="" disabled>{label} নির্বাচন করুন</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );
}

function InputField({ label, name, value, onChange, className = '', type = 'text' }: { label: string, name: string, value: string, onChange: any, className?: string, type?: string }) {
  return (
    <div className={`${className}`}>
      <label className="block text-gray-700 font-bold mb-1.5 text-sm">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-bangla-sans"
        placeholder={`${label} লিখুন`}
      />
    </div>
  );
}

function DottedLine({ label, value }: { label: string, value: string }) {
  return (
    <div className="flex items-end flex-grow">
      <span className="whitespace-nowrap font-bold text-[1.35rem] mr-2 text-black leading-normal pb-0.5">{label}</span>
      <span className="flex-grow border-b-[3.5px] border-dotted border-black text-center text-xl pb-0.5 min-h-[32px] overflow-visible leading-normal font-medium" style={{ color: '#1e40af' }}>
        <span className="inline-block py-0">{value}</span>
      </span>
    </div>
  );
}

function MarkRow({ label, marks }: { label: string, marks: string }) {
  return (
    <div className="flex justify-between items-end">
      <span>{label}</span>
      <div className="flex-grow flex items-end">
        <span className="mx-2 whitespace-nowrap">{marks} :-</span>
        <span className="flex-grow border-b-[3px] border-dotted border-black min-w-[3rem]"></span>
      </div>
    </div>
  );
}
