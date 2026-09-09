import { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

function App() {
  const [count, setCount] = useState(0);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [history, setHistory] = useState({});

  const formatDateKey = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    fetch('http://localhost:8080/api/logs')
      .then((res) => res.json())
      .then((data) => {
        const historyMap = {};
        data.forEach((log) => {
          let dateStr = log.logDate;
          if (Array.isArray(log.logDate)) {
            const [y, m, d] = log.logDate;
            dateStr = `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
          }
          historyMap[dateStr] = log.count;
        });
        setHistory(historyMap);

        const todayKey = formatDateKey(new Date());
        if (historyMap[todayKey] !== undefined) {
          setCount(historyMap[todayKey]);
        }
      })
      .catch((err) => console.error('Error fetching logs:', err));
  }, []);

  // Dynamic status styling based on count volume
  let warningMessage = "Stay strong. Every smoke-free moment heals your lungs.";
  let warningBg = "#064e3b33";
  let warningBorder = "#059669";
  let warningColor = "#6ee7b7";
  
  if (count >= 5 && count < 10) {
    warningMessage = "Warning: Each cigarette constricts your blood vessels and raises your heart rate.";
    warningBg = "#7c2d1233";
    warningBorder = "#f97316";
    warningColor = "#fdba74";
  } else if (count >= 10 && count < 15) {
    warningMessage = "Danger: Tar buildup is accelerating in your airways. Cardiovascular strain is rising.";
    warningBg = "#451a0333";
    warningBorder = "#d97706";
    warningColor = "#fcd34d";
  } else if (count >= 15) {
    warningMessage = "CRITICAL HAZARD: High risk of severe respiratory damage! Stop immediately.";
    warningBg = "#7f1d1d44";
    warningBorder = "#ef4444";
    warningColor = "#fca5a5";
  }

  const handleLog = () => {
    const newCount = count + 1;
    setCount(newCount);
    const dateKey = formatDateKey(selectedDate);
    setHistory({ ...history, [dateKey]: newCount });

    fetch('http://localhost:8080/api/logs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ logDate: dateKey, count: newCount }),
    }).catch((err) => console.error('Error saving log:', err));
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    const dateKey = formatDateKey(date);
    setCount(history[dateKey] !== undefined ? history[dateKey] : 0);
  };

  const addTileContent = ({ date, view }) => {
    if (view === 'month') {
      const dateKey = formatDateKey(date);
      const dayCount = history[dateKey];
      if (dayCount !== undefined && dayCount > 0) {
        return (
          <div style={{ fontSize: '10px', fontWeight: 'bold', color: '#f87171', marginTop: '2px' }}>
            {dayCount} 🚬
          </div>
        );
      }
    }
    return null;
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0f172a',
      color: '#ffffff',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start',
      padding: '40px 20px',
      fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif'
    }}>
      
      {/* Header */}
      <header style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', background: 'linear-gradient(to right, #f87171, #fb923c, #fbbf24)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: 0 }}>
          Breathe: No Smoking Tracker
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '0.95rem', marginTop: '8px' }}>Take control of your health, one day at a time.</p>
      </header>

      {/* Main Card */}
      <div style={{
        width: '100%',
        maxWidth: '520px',
        backgroundColor: '#1e293b',
        border: '1px solid #334155',
        borderRadius: '24px',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)',
        padding: '32px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>

        {/* Counter Display */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1.5px', color: '#94a3b8', fontWeight: '700' }}>
            {formatDateKey(selectedDate) === formatDateKey(new Date()) ? "Today's Progress" : `Viewing: ${formatDateKey(selectedDate)}`}
          </span>
          <div style={{ fontSize: '4rem', fontWeight: '900', marginTop: '8px', letterSpacing: '-1px', color: '#f87171' }}>
            {count} <span style={{ fontSize: '1rem', fontWeight: '500', color: '#94a3b8' }}>cigarettes smoked</span>
          </div>
        </div>

        {/* Hazard Quote Box */}
        <div style={{
          width: '100%',
          padding: '16px',
          marginBottom: '28px',
          borderRadius: '16px',
          border: `1px solid ${warningBorder}`,
          backgroundColor: warningBg,
          color: warningColor,
          textAlign: 'center',
          fontSize: '0.9rem',
          fontWeight: '500',
          boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2)',
          boxSizing: 'border-box'
        }}>
          {warningMessage}
        </div>

        {/* Action Button */}
        <div style={{ width: '100%', marginBottom: '32px' }}>
          <button 
            onClick={handleLog}
            style={{
              width: '100%',
              padding: '16px',
              backgroundColor: '#dc2626',
              color: 'white',
              border: 'none',
              borderRadius: '16px',
              fontSize: '1.1rem',
              fontWeight: '700',
              cursor: 'pointer',
              boxShadow: '0 10px 15px -3px rgba(220, 38, 38, 0.4)',
              transition: 'background-color 0.2s'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#b91c1c'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#dc2626'}
          >
            +1 cigarette
          </button>
        </div>

        {/* Calendar Section */}
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '24px', borderTop: '1px solid #334155' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: '600', color: '#cbd5e1', marginBottom: '16px', letterSpacing: '0.5px' }}>Historical Calendar</h2>
          <div style={{ backgroundColor: '#0f172a', padding: '16px', borderRadius: '16px', border: '1px solid #334155', width: '100%', boxSizing: 'border-box', display: 'flex', justifyContent: 'center' }}>
            <Calendar 
              onChange={handleDateChange} 
              value={selectedDate}
              tileContent={addTileContent}
            />
          </div>
        </div>

      </div>

    </div>
  );
}

export default App;