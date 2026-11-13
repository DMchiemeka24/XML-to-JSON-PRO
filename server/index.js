import express from 'express';
import cors from 'cors';
import { parseStringPromise } from 'xml2js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '2mb' }));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'XML to JSON converter server is running.' });
});

app.post('/api/convert', async (req, res) => {
  try {
    const { xml } = req.body || {};

    if (!xml || typeof xml !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Please provide valid XML input.',
      });
    }

    const parsed = await parseStringPromise(xml, {
      explicitArray: false,
      trim: true,
      explicitCharkey: false,
      mergeAttrs: false,
      attrkey: '_attributes',
      charkey: '_text',
    });

    return res.json({
      success: true,
      data: parsed,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: 'Invalid XML: ' + error.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
