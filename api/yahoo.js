module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const { ticker, range } = req.query;
  if (!ticker) return res.status(400).json({ error: 'ticker required' });

  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(ticker)}?interval=1d&range=${range || '2y'}`;
  try {
    const r = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0', 'Accept': 'application/json' }
    });
    if (!r.ok) throw new Error(`Yahoo returned ${r.status}`);
    const data = await r.json();
    res.setHeader('Cache-Control', 's-maxage=300');
    return res.status(200).json(data);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};
