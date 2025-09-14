import React from 'react';

function Learn() {
  const steps = [
    {
      step: '1️⃣ Choose a Mode',
      desc: 'Select either "Summarization" or "Q&A" from the top section of the page. This tells TALQS what type of output you want.',
    },
    {
      step: '2️⃣ Upload or Paste Legal Content',
      desc: 'Upload a court judgment PDF or simply paste the legal text into the input box provided.',
    },
    {
      step: '3️⃣ Submit for Processing',
      desc: 'Click the "Submit" button. TALQS will use its fine-tuned AI model to process your input instantly.',
    },
    {
      step: '4️⃣ View Results',
      desc: 'Your result — either a summary or a set of question-answer pairs — will be displayed clearly below.',
    },
    {
      step: '5️⃣ Try Again or Switch Modes',
      desc: 'You can upload another file or switch between summary and Q&A modes as needed.',
    },
  ];

  const faqs = [
    {
      q: '🧾 Can I upload scanned PDFs?',
      a: 'Not yet. TALQS currently supports only machine-readable PDFs or pasted text.',
    },
    {
      q: '📚 What type of cases does it work best on?',
      a: 'TALQS is trained on Indian legal judgments — mostly High Court and Supreme Court texts.',
    },
    {
      q: '🔐 Are my documents safe?',
      a: 'Yes. Files are processed locally and are never stored or uploaded elsewhere.',
    },
    {
      q: '⚡ How long does it take to generate output?',
      a: 'Usually less than 5 seconds depending on file size and text complexity.',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#1e1e1e] text-gray-900 dark:text-[#f0f0f0] p-10">
      <h1 className="text-4xl font-bold text-center mb-10 border-b pb-4 border-gray-300 dark:border-gray-600">
        📘 Learn How to Use TALQS
      </h1>

      {/* Steps to Use */}
      <section className="max-w-4xl mx-auto mb-12">
        <h2 className="text-2xl font-semibold mb-6">🚀 Quick Start Guide</h2>
        <ol className="space-y-6">
          {steps.map((item, index) => (
            <li
              key={index}
              className="bg-white dark:bg-[#2c2c2c] p-6 rounded shadow hover:shadow-md transition duration-300"
            >
              <h3 className="text-xl font-semibold">{item.step}</h3>
              <p className="mt-2 text-gray-700 dark:text-gray-300">{item.desc}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* FAQ Section */}
      <section className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-semibold mb-6">❓ Frequently Asked Questions (FAQs)</h2>
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="bg-white dark:bg-[#2c2c2c] p-5 rounded shadow"
            >
              <h4 className="text-lg font-semibold">{faq.q}</h4>
              <p className="text-gray-700 dark:text-gray-300 mt-1">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Learn;
