import React from 'react';

function Features() {
  const featureList = [
    {
      title: '📄 Upload Legal Documents',
      desc: 'TALQS accepts both PDF uploads and raw legal text for processing.',
    },
    {
      title: '🤖 AI-Powered Summarization',
      desc: 'Get instant, simplified summaries of complex court judgments using a fine-tuned T5 model.',
    },
    {
      title: '❓ Automatic Q&A Generation',
      desc: 'Generates meaningful question-answer pairs from legal texts to help with understanding and revision.',
    },
    {
      title: '🇮🇳 Trained on Indian Legal Datasets',
      desc: 'Built on ILDC and IN-Abs, TALQS understands the structure and language of Indian court cases.',
    },
    {
      title: '🌗 Light & Dark Mode',
      desc: 'Switch between modern light and elegant dark themes for better readability.',
    },
    {
      title: '⚡ Fast & Lightweight UI',
      desc: 'Built with React and Tailwind, TALQS provides a seamless and responsive experience.',
    },
    {
      title: '🔐 Secure & Private',
      desc: 'Your uploaded documents are processed locally — nothing is stored or sent to external servers.',
    },
  ];

  return (
    <div className="bg-gray-50 dark:bg-[#1e1e1e] min-h-screen p-10 text-gray-800 dark:text-gray-100">
      <h1 className="text-4xl font-bold mb-8 text-center border-b pb-4 border-gray-300 dark:border-gray-600">
        Features of TALQS
      </h1>
      
      <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {featureList.map((feature, index) => (
          <div
            key={index}
            className="bg-white dark:bg-[#2a2a2a] p-6 rounded-xl shadow hover:shadow-md transition duration-300"
          >
            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
            <p className="text-gray-700 dark:text-gray-300">{feature.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Features;
