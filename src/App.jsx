import { useState } from 'react';

const sampleXml = `<?xml version="1.0" encoding="UTF-8"?>
<catalog>
  <book id="bk101">
    <author>Gambardella, Matthew</author>
    <title>XML Developer's Guide</title>
    <genre>Computer</genre>
    <price>44.95</price>
    <publish_date>2000-10-01</publish_date>
    <description>An in-depth look at creating applications with XML.</description>
  </book>
  <book id="bk102">
    <author>Ralls, Kim</author>
    <title>Midnight Rain</title>
    <genre>Fantasy</genre>
    <price>5.95</price>
    <publish_date>2000-12-16</publish_date>
    <description>A former architect battles corporate zombies.</description>
  </book>
</catalog>`;

function App() {
  const [xmlInput, setXmlInput] = useState(sampleXml);
  const [jsonOutput, setJsonOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleConvert = async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/convert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ xml: xmlInput }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Conversion failed');
      }

      setJsonOutput(JSON.stringify(data.data, null, 2));
    } catch (err) {
      setError(err.message || 'Something went wrong while converting XML.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!jsonOutput) {
      return;
    }

    try {
      await navigator.clipboard.writeText(jsonOutput);
      setError('JSON copied to clipboard.');
    } catch {
      setError('Unable to copy. You can highlight and copy manually.');
    }
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Utility Tool</p>
          <h1>XML to JSON Converter Pro</h1>
        </div>
      </header>

      <main className="converter-grid">
        <section className="panel input-panel">
          <div className="panel-header">
            <h2>XML Input</h2>
            <button type="button" className="secondary" onClick={() => setXmlInput(sampleXml)}>
              Load Example
            </button>
          </div>

          <textarea
            value={xmlInput}
            onChange={(e) => setXmlInput(e.target.value)}
            placeholder="Paste or type XML here..."
          />

          <div className="actions">
            <button type="button" onClick={handleConvert} disabled={isLoading}>
              {isLoading ? 'Converting...' : 'Convert to JSON'}
            </button>
            <button type="button" className="secondary" onClick={() => setXmlInput('')}>
              Clear
            </button>
          </div>
        </section>

        <section className="panel output-panel">
          <div className="panel-header">
            <h2>JSON Output</h2>
            <button type="button" className="secondary" onClick={handleCopy} disabled={!jsonOutput}>
              Copy JSON
            </button>
          </div>

          {error ? <div className="error-box">{error}</div> : null}

          <pre>{jsonOutput || '{\n  "output": "Your converted JSON will appear here"\n}'}</pre>
        </section>
      </main>
    </div>
  );
}

export default App;
