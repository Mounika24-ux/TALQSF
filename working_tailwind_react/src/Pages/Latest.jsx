import React, { useState } from 'react';
import { useDarkMode } from "../contexts/DarkModeContext";

const faqs = [
  {
    question: 'What is TALQS used for?',
    answer: 'TALQS is an AI tool that converts legal judgments into simplified summaries and question-answer pairs to help users understand complex legal content easily.',
  },
  {
    question: 'What types of files can I upload?',
    answer: 'You can upload text-based PDFs of Indian court judgments. Scanned or image-based PDFs are not supported.',
  },
  {
    question: 'How do I choose between Q&A and Summary?',
    answer: 'Use Q&A mode to extract important questions and answers from the case, and Summary mode to get a short, plain-language explanation.',
  },
  {
    question: 'Is my data secure?',
    answer: 'Yes! TALQS processes everything in-browser. No data is stored or sent to external servers.',
  },
  {
    question: 'Why is my result blank?',
    answer: 'Make sure the document is readable text and long enough for the model to analyze. Very short inputs may return empty results.',
  },
  {
    question: 'Can I paste text instead of uploading a file?',
    answer: 'Absolutely. If you don’t have a PDF, you can paste legal text directly into the input box.',
  },
  {
    question: 'How long does it take to generate a result?',
    answer: 'Usually 3–5 seconds, depending on the length and formatting of the input.',
  },
  {
    question: 'Can I upload judgments from any court?',
    answer: 'TALQS is trained primarily on Indian High Court and Supreme Court data, so it works best with those.',
  },
  {
    question: 'Do I need an account to use TALQS?',
    answer: 'No account is required at this stage. Just open the site and start using it!',
  },
  {
    question: 'Can I use TALQS on mobile?',
    answer: 'Yes! TALQS is responsive and works on desktop, tablet, and mobile devices.',
  },
];

function Help() {
  const [openIndex, setOpenIndex] = useState(null);
  const { isDark } = useDarkMode();

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className={`min-h-screen py-12 px-4 sm:px-6 lg:px-8 ${isDark ? 'bg-[#1e1e1e] text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="max-w-3xl mx-auto text-center mb-10">
        <h1 className="text-5xl font-bold mb-4">
          Help<span className="text-indigo-500 dark:text-indigo-400"> ?</span>
        </h1>
        <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
          Find answers to your questions about using TALQS.
        </p>
      </div>

      <div className={`max-w-3xl mx-auto shadow-lg rounded-lg p-6 space-y-4 ${isDark ? 'bg-[#2c2c2c]' : 'bg-white'}`}>
        {faqs.map((item, index) => (
          <div key={index}>
            <button
              onClick={() => toggle(index)}
              className={`w-full text-left text-lg font-medium flex justify-between items-center py-3 border-b ${isDark ? 'text-white border-gray-600' : 'text-gray-800 border-gray-200'}`}
            >
              <span>{item.question}</span>
              <span className="text-xl">{openIndex === index ? '−' : '+'}</span>
            </button>
            {openIndex === index && (
              <p className={`mt-2 px-2 transition-all duration-300 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                {item.answer}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Help;
