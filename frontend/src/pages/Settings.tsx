import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Settings: React.FC = () => {
  const [cronExpression, setCronExpression] = useState('0 2 * * *');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Load current cron schedule
    axios.get('http://localhost:5000/api/settings/cron')
      .then(res => setCronExpression(res.data.cronExpression))
      .catch(err => console.error('Failed to load cron schedule:', err));
  }, []);

  const updateCronSchedule = async () => {
    setLoading(true);
    try {
      await axios.put('http://localhost:5000/api/settings/cron', { cronExpression });
      setMessage('Cron schedule updated successfully');
    } catch (err) {
      setMessage('Failed to update cron schedule');
    }
    setLoading(false);
  };

  const manualSync = async () => {
    setLoading(true);
    try {
      await axios.post('http://localhost:5000/api/settings/sync');
      setMessage('Manual sync completed successfully');
    } catch (err) {
      setMessage('Manual sync failed');
    }
    setLoading(false);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Settings</h2>
      
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow mb-6">
        <h3 className="text-lg font-semibold mb-4">Codeforces Data Sync</h3>
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">
            Cron Schedule (Default: 0 2 * * * = 2 AM daily)
          </label>
          <input
            type="text"
            value={cronExpression}
            onChange={(e) => setCronExpression(e.target.value)}
            className="w-full border px-3 py-2 rounded dark:bg-gray-700 dark:border-gray-600"
            placeholder="0 2 * * *"
          />
          <p className="text-sm text-gray-500 mt-1">
            Format: minute hour day month dayOfWeek
          </p>
        </div>
        
        <div className="flex gap-4">
          <button
            onClick={updateCronSchedule}
            disabled={loading}
            className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            {loading ? 'Updating...' : 'Update Schedule'}
          </button>
          
          <button
            onClick={manualSync}
            disabled={loading}
            className="bg-green-500 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            {loading ? 'Syncing...' : 'Sync Now'}
          </button>
        </div>
        
        {message && (
          <div className="mt-4 p-3 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded">
            {message}
          </div>
        )}
      </div>
      
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Common Cron Expressions</h3>
        <ul className="space-y-2 text-sm">
          <li><code>0 2 * * *</code> - Every day at 2:00 AM</li>
          <li><code>0 */6 * * *</code> - Every 6 hours</li>
          <li><code>0 0 */2 * *</code> - Every 2 days at midnight</li>
          <li><code>0 1 * * 0</code> - Every Sunday at 1:00 AM</li>
        </ul>
      </div>
    </div>
  );
};

export default Settings;