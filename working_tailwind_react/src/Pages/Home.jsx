import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useDarkMode } from '../contexts/DarkModeContext'; // adjust the path if needed


export default function Home() {
  const [file, setFile] = useState(null);
  const [inputText, setInputText] = useState('');
  const [question, setQuestion] = useState('');
  const [mode, setMode] = useState('');

  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [fileWarning, setFileWarning] = useState('');
  const [modeWarning, setModeWarning] = useState('');
  const [textWarning, setTextWarning] = useState('');

  const outputRef = useRef(null);
  const loadingRef = useRef(null);
  const { isDark } = useDarkMode();


  // Toggle dark mode by adding/removing "dark" class on <html>
 
  useEffect(() => window.scrollTo({ top: 0 }), []);
  useEffect(() => {
  const user = localStorage.getItem("user");
  if (!user) {
    navigate("/"); // redirect if not logged in
  }
}, []);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    const allowedTypes = [
      'application/pdf',
      'text/plain',
      'image/jpeg',
      'image/png',
      'image/jpg',
    ];

    if (selectedFile && !allowedTypes.includes(selectedFile.type)) {
      setFile(null);
      setFileWarning('⚠️ Only PDF, TXT, or image files (jpg, png) are allowed.');
      return;
    }

    setFile(selectedFile || null);
    setInputText('');
    setFileWarning('');
  };

  const handleTextChange = (e) => {
    setInputText(e.target.value);
    if (e.target.value.trim()) {
      setFile(null);
      setFileWarning('');
    }
  };

  const handleModeChange = (e) => {
    if (!file && !inputText.trim()) {
      setMode('');
      setModeWarning('⚠️ Upload a file or enter text first.');
    } else {
      setMode(e.target.value);
      setModeWarning('');
    }
  };

  const handleQuestionChange = (e) => setQuestion(e.target.value);

  const handleSubmit = async () => {
    if (!file && !inputText.trim()) {
      setTextWarning('⚠️ Provide input via file or text.');
      return;
    }
    if (!mode) {
      setModeWarning('⚠️ Select a mode before submitting.');
      return;
    }
    if (mode === 'answer' && !question.trim()) {
      setModeWarning('⚠️ Enter a question for Q&A mode.');
      return;
    }

    setLoading(true);
    setError('');
    setOutput('');
    setTimeout(() => loadingRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);

    try {
      let response;
      if (file) {
        const formData = new FormData();
        formData.append('file', file);
        if (mode === 'answer') formData.append('question', question);
        const url = mode === 'summary'
          ? 'http://127.0.0.1:8000/summarize-file'
          : 'http://127.0.0.1:8000/answer-file';

        response = await axios.post(url, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        const payload = mode === 'summary'
          ? { text: inputText }
          : { text: inputText, question };

        const url = mode === 'summary'
          ? 'http://127.0.0.1:8000/summarize'
          : 'http://127.0.0.1:8000/answer';

        response = await axios.post(url, payload);
      }

      if (response?.data) {
        const pretty = mode === "summary"
          ? `Summary:\n${response.data?.summary || response.data}`
          : `Answer:\n${response.data?.answer || response.data}`;

        setOutput(pretty);

        const userObj = JSON.parse(localStorage.getItem("user"));
        const user = userObj?.username || "unknown_user";
        const filenameOrText = file ? file.name : "text";

        if (mode === "summary" && response.data?.summary) {
          await axios.post("http://localhost:5000/api/summaries", {
            user,
            filename: filenameOrText,
            summary: response.data.summary
          });
        }

        if (mode === "answer" && response.data?.answer) {
          await axios.post("http://localhost:5000/api/qa", {
            user,
            filename: filenameOrText,
            question,
            answer: response.data.answer
          });
        }

        setTimeout(() => outputRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
      } else {
        setError('Server returned empty response.');
      }
    } catch (err) {
      setError('Failed to reach server. Check console / backend.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full font-[Segoe_UI,sans-serif] bg-[#e0e2e4] dark:bg-[#1a1a1a] text-[#625750] dark:text-[#e0e0e0] min-h-screen">

      {/* Toggle */}
     
      {/* Hero */}
      <section className="flex justify-center pt-14 px-4 md:px-6">
        <div className="bg-white dark:bg-[#2c2c2c] p-10 rounded-xl shadow-xl flex flex-col md:flex-row items-center gap-8 w-full max-w-7xl">
          <div className="max-w-xl">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">Your AI Legal Assistant.</h1>
            <p className="text-lg mb-6">TALQS helps you understand complex legal documents, ask questions, and get intelligent summaries with ease.</p>
            <ul className="list-disc list-inside space-y-1 mt-4">
              <li>Get Case Summaries</li>
              <li>Ask Legal Questions</li>
              <li>Understand Judgments</li>
              <li>Summarize Court Documents</li>
            </ul>
          </div>
          <img src="public/undraw_coming-soon_7lvi.svg" alt="Legal Assistant" className="w-80 md:ml-40" />
        </div>
      </section>

      {/* Input + Mode */}
      <section className="flex flex-col items-center justify-center min-h-screen px-6 md:px-24 py-12">
        <div className="flex flex-col md:flex-row gap-8 w-full max-w-6xl">
          {/* Input */}
          <div className="bg-white dark:bg-[#2c2c2c] rounded-2xl shadow-lg flex-1 p-8">
            <h2 className="text-3xl font-bold mb-6 text-center">Input</h2>
            <input type="file" accept=".pdf,.txt,image/png,image/jpeg" onChange={handleFileChange} className="w-full p-2 border border-gray-300 rounded-lg bg-[#f0f0f0] dark:bg-[#3b3b3b]" />
            {fileWarning && <p className="text-red-600 text-sm mt-2">{fileWarning}</p>}
            <textarea rows={6} value={inputText} onChange={handleTextChange} placeholder="Paste your legal text here..." className="w-full mt-4 p-3 border border-gray-300 rounded-lg bg-[#f0f0f0] dark:bg-[#3b3b3b]" />
            {textWarning && <p className="text-red-600 text-sm mt-2">{textWarning}</p>}
          </div>

          {/* Mode */}
          <div className="bg-white dark:bg-[#2c2c2c] rounded-2xl shadow-lg flex-1 p-8">
            <h2 className="text-3xl font-bold mb-6 text-center">Select Mode</h2>
            <label className="flex items-center gap-3 mb-3">
              <input type="radio" name="mode" value="answer" onClick={handleModeChange} className="accent-[#625750]" />
              Answer Questions
            </label>
            <label className="flex items-center gap-3 mb-3">
              <input type="radio" name="mode" value="summary" onClick={handleModeChange} className="accent-[#625750]" />
              Generate Summary
            </label>
            {modeWarning && <p className="text-red-600 text-sm mt-2">{modeWarning}</p>}
            {mode === 'answer' && (
              <textarea rows={4} value={question} onChange={handleQuestionChange} placeholder="e.g. What was the verdict?" className="w-full mt-4 p-3 border border-gray-300 rounded-lg bg-[#f0f0f0] dark:bg-[#3b3b3b]" />
            )}
            <div className="text-center mt-6">
              <button onClick={handleSubmit} className="bg-[#625750] text-white py-2 px-6 rounded-lg hover:bg-[#4e4841]" disabled={loading}>Submit</button>
            </div>
            {error && <p className="text-red-600 text-center mt-4">{error}</p>}
          </div>
        </div>

        {/* Loading Spinner */}
        {loading && (
          <div ref={loadingRef} className="flex justify-center items-center w-full max-w-full my-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-[#625750]"></div>
            <p className="ml-4 text-lg font-semibold">
              {mode === 'answer' ? 'Generating answer, please wait...' : 'Generating summary, please wait...'}
            </p>
          </div>
        )}
      </section>

      {/* Output */}
      {output && (
        <section ref={outputRef} className="flex justify-center px-6 md:px-24 pb-24 relative z-10">
          <div className="bg-white dark:bg-[#2c2c2c] rounded-2xl shadow-lg p-8 w-full max-w-6xl">
            <h2 className="text-3xl font-bold mb-6 text-center">Output</h2>
            <div className="border border-gray-300 rounded-lg p-6 bg-[#f0f0f0] dark:bg-[#3b3b3b] whitespace-pre-line">
              {output}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
