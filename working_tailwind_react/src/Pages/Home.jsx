import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

/* ------------------------------------------------------------------
   Home.jsx  – integrates backend API calls for summarization (text/file)
                 and Q&A (text/file) using Axios.
   ------------------------------------------------------------------ */

export default function Home() {
  /* --------------------------- fun‑fact popup -------------------------- */
  const funFacts = [
    "What did the PDF file say to TALQS?\nPlease be easy, I’ve been judged too many times already.",
    "In Bihar, a judge fined a mobile phone for ringing in court. The phone was confiscated, and the ‘accused’ was locked up… in a drawer.",
    "In 2011, a macaque monkey took a selfie with a photographer’s camera. There was a court case debating if the monkey owned the copyright. Spoiler: monkeys can't sue… yet.",
    "In Samoa, forgetting your wife's birthday is literally illegal.\nThis law was likely passed after a lot of pressure from angry wives."
  ];

  const [showPopup, setShowPopup] = useState(false);
  const [currentJoke, setCurrentJoke] = useState('');
  const togglePopup = () => {
    const randomIndex = Math.floor(Math.random() * funFacts.length);
    setCurrentJoke(funFacts[randomIndex]);
    setShowPopup(!showPopup);
  };

  /* ------------------------- form‑related state ------------------------ */
  const [file, setFile]         = useState(null);
  const [inputText, setInputText] = useState('');
  const [question, setQuestion] = useState('');
  const [mode, setMode]         = useState('');           // "summary" | "answer"

  const [output, setOutput]     = useState('');           // server response
  const [loading, setLoading]   = useState(false);        // spinner flag
  const [error, setError]       = useState('');           // network / server error

  const [fileWarning, setFileWarning] = useState('');
  const [modeWarning, setModeWarning] = useState('');
  const [textWarning, setTextWarning] = useState('');

  const outputRef = useRef(null);

  /* Scroll top when component mounts */
  useEffect(() => window.scrollTo({ top: 0 }), []);

  /* --------------------------- handlers ------------------------------- */
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

  /* ----------------------- MAIN SUBMIT LOGIC -------------------------- */
  const handleSubmit = async () => {
    // client‑side validation
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

    // reset
    setLoading(true);
    setError('');
    setOutput('');

    try {
      let response;

      /* --- 1. build payload --- */
      if (file) {
        const formData = new FormData();
        formData.append('file', file);
        if (mode === 'answer') formData.append('question', question);

        // choose endpoint based on mode
        const url = mode === 'summary'
          ? 'http://127.0.0.1:8000/summarize-file'
          : 'http://127.0.0.1:8000/answer-file';

        response = await axios.post(url, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        // text input
        const payload = mode === 'summary'
          ? { text: inputText }
          : { text: inputText, question };

        const url = mode === 'summary'
          ? 'http://127.0.0.1:8000/summarize'
          : 'http://127.0.0.1:8000/answer';

        response = await axios.post(url, payload);
      }

      /* --- 2. display server response --- */
      if (response?.data) {
       const pretty = mode === "summary"
  ? `Summary:\n${response.data?.summary || response.data}`
  : `Answer:\n${response.data?.answer || response.data}`;

        console.log('Server response:', response.data);


        setOutput(pretty);
          if (mode === "summary" && response?.data?.summary) {
        const saveData = new FormData();
        saveData.append("text", inputText);
        saveData.append("summary", response.data.summary);

        await axios.post("http://localhost:8000/save-summary", saveData);
        console.log("Summary saved to MongoDB.");
      }
        setTimeout(() => outputRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
      } else {
        setError('Server returned empty response.');
      }
    } catch (err) {
      console.error(err);
      setError('Failed to reach server. Check console / backend.');
    } finally {
      setLoading(false);
    }
  };

  /* ----------------------------- UI ---------------------------------- */
  return (
    <div className="relative w-full text-[#625750] font-[Segoe_UI,sans-serif] bg-[#e0e2e4] min-h-screen">
      {/* faint background glyph */}
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none select-none opacity-5 text-[30rem] z-0">
        𓍝
      </div>

      {/* ------------- HERO ------------- */}
      <section className="relative z-10 flex justify-center pt-14 px-4 md:px-6">
        <div className="bg-white p-10 rounded-xl shadow-xl flex flex-col md:flex-row items-center gap-8 w-full max-w-7xl">
          <div className="max-w-xl">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">Your AI Legal Assistant.</h1>
            <p className="text-lg mb-6">TALQS helps you understand complex legal documents, ask questions, and get intelligent summaries with ease.</p>
            <div className="mt-6 text-base">
              <p className="font-semibold mb-2 text-lg">THINGS YOU CAN DO WITH TALQS</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Get Case Summaries</li>
                <li>Ask Legal Questions</li>
                <li>Understand Judgments</li>
                <li>Auto-Generate Legal Q&A</li>
                <li>Summarize Court Documents</li>
              </ul>
            </div>
          </div>

          <img src="/Assets/undraw_coming-soon_7lvi.svg" alt="Legal Assistant" className="w-80 md:ml-40" />
        </div>
      </section>

      {/* ------------- INPUT & MODE ------------- */}
      <section className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 md:px-24 py-12">
        <div className="flex flex-col md:flex-row gap-8 w-full max-w-6xl">
          {/* Input Card */}
          <div className="bg-white rounded-2xl shadow-lg flex-1 p-8">
            <h2 className="text-3xl font-bold mb-6 text-center">Input</h2>
            <div className="mb-6">
              <label className="text-xl block mb-2">Upload PDF, TXT or Image File:</label>
              <input type="file" accept=".pdf,.txt,image/png,image/jpeg" onChange={handleFileChange} className="w-full p-2 border border-gray-300 rounded-lg bg-[#f0f0f0]" />
              {fileWarning && <p className="text-red-600 text-sm mt-2">{fileWarning}</p>}
            </div>
            <div className="mb-6">
              <label className="text-xl block mb-2">Or Enter Text Below:</label>
              <textarea rows={6} value={inputText} onChange={handleTextChange} placeholder="Paste your legal text here..." className="w-full p-3 border border-gray-300 rounded-lg bg-[#f0f0f0]" />
              {textWarning && <p className="text-red-600 text-sm mt-2">{textWarning}</p>}
            </div>
          </div>

          {/* Mode Card */}
          <div className="bg-white rounded-2xl shadow-lg flex-1 p-8">
            <h2 className="text-3xl font-bold mb-6 text-center">Select Mode</h2>
            <div className="space-y-4 text-lg">
              <label className="flex items-center gap-3"><input type="radio" name="mode" value="answer" onClick={handleModeChange} className="accent-[#625750]" />Answer Questions</label>
              <label className="flex items-center gap-3"><input type="radio" name="mode" value="summary" onClick={handleModeChange} className="accent-[#625750]" />Generate Summary</label>
              {modeWarning && <p className="text-red-600 text-sm mt-2">{modeWarning}</p>}
            </div>
            {mode === 'answer' && (
              <div className="mt-8">
                <label className="text-xl block mb-2">Your Question:</label>
                <textarea rows={5} value={question} onChange={handleQuestionChange} placeholder="e.g. What was the verdict?" className="w-full p-3 border border-gray-300 rounded-lg bg-[#f0f0f0]" />
              </div>
            )}
            <div className="text-center mt-6 space-x-4">
              <button onClick={handleSubmit} className="bg-[#625750] text-white py-2 px-6 rounded-lg hover:bg-[#4e4841] transition-colors disabled:opacity-50" disabled={loading}>Submit</button>
              {loading && <span className="animate-pulse text-[#625750]">Processing…</span>}
            </div>
            {error && <p className="text-red-600 text-center mt-4">{error}</p>}
          </div>
        </div>
      </section>

      {/* ------------- OUTPUT ------------- */}
      {output && (
        <section ref={outputRef} className="relative z-10 flex justify-center px-6 md:px-24 pb-24">
          <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-6xl">
            <h2 className="text-3xl font-bold mb-6 text-center">Output</h2>
            <pre className="border border-gray-300 rounded-lg p-6 bg-[#f0f0f0] whitespace-pre-wrap">{output}</pre>
          </div>
        </section>
      )}

      {/* ------------- FUN FACT POPUP TRIGGER ------------- */}
      <button onClick={togglePopup} className="fixed bottom-6 right-6 bg-[#625750] text-white text-3xl leading-none rounded-full w-14 h-14 flex items-center justify-center shadow-lg hover:bg-[#4e4841]" aria-label="Legal fun fact">
        𓍝
      </button>

      {/* popup itself */}
      {showPopup && (
        <div onClick={() => setShowPopup(false)} className="fixed bottom-24 right-6 bg-[#f0f0f0]/90 text-[#625750] shadow-lg p-6 rounded-2xl max-w-xs z-50 cursor-pointer">
          <p className="whitespace-pre-line font-semibold">{currentJoke}</p>
          <p className="mt-2 text-sm italic text-right">Click to close</p>
        </div>
      )}
    </div>
  );
}//env\Scripts\activate uvicorn main:app --reload