import React, { useState } from 'react';
import axios from 'axios';

const EmailTest: React.FC = () => {
  const [status, setStatus] = useState('');

  const sendTestEmail = async () => {
    try {
      const res = await axios.get('http://localhost:5000/test-email');
      setStatus(res.data || '✅ Email sent successfully!');
    } catch (err: any) {
      console.error(err);
      setStatus('❌ Failed to send email.');
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">📧 Test Reminder Email</h2>
      <button
        onClick={sendTestEmail}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
      >
        Send Test Email
      </button>
      {status && <p className="mt-4 text-sm">{status}</p>}
    </div>
  );
};

export default EmailTest;
