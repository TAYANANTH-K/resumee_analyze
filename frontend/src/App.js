import { useState } from 'react';
import './App.css';
import axios from 'axios';

function App() {
  const [pdf, setPdf] = useState(null);
  const [jd, setJd] = useState('');
  const [result, setResult] = useState(null);

  const handle = async (e) => {
    e.preventDefault();

    if (!pdf || !jd.trim()) {
      alert("Please upload a resume and enter a job description.");
      return;
    }

    const formData = new FormData();
    formData.append('resume', pdf);
    formData.append('jobDescription', jd);

    try {
      const res = await axios.post('http://localhost:4000/analyze', formData);
      setResult(res.data);  
      console.log("Result:", res.data);
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Error submitting form. Check server or console.");
    }
  };

  return (
    <div style={{ marginTop:"20%",maxWidth: '600px', margin: '0 auto', border: '2px solid black', padding: '20px', borderRadius: '8px' }}>
     
      <h1 style={{ textAlign: 'center' }}>Resume Analyzer</h1>
      
      <form onSubmit={handle}>
        <label><strong>Resume (PDF):</strong></label><br/>
        <input
          type='file'
          accept=".pdf"
          onChange={(e) => setPdf(e.target.files[0])}
        />
        <br/><br/>

        <label><strong>Job Description:</strong></label><br/>
        <textarea
          rows={6}
          value={jd}
          onChange={(e) => setJd(e.target.value)}
          placeholder="Paste job description here..."
          style={{ width: '100%' }}
        />
        <br/><br/>

        <button type="submit" style={{ width: '100%', padding: '10px', fontWeight: 'bold' }}>Submit</button>
      </form>

      {result && (
        <div style={{ marginTop: '20px', padding: '10px', border: '1px solid green' }}>
          <h3>Analysis Result</h3>
          <p><strong>Match Score:</strong> {result.score}%</p>
          <p><strong>Matched Keywords:</strong> {result.matched.join(', ') || 'None'}</p>
          <p><strong>Missing Keywords:</strong> {result.missing.join(', ') || 'None'}</p>
        </div>
      )}
    </div>
  );
}

export default App;
