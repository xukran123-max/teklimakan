module.exports = (req, res) => {
  const url = req.url || '';
  const match = url.match(/google[a-zA-Z0-9_-]+\.html/i);
  const fileName = match ? match[0] : 'google0665b7e663873c46.html';
  
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=86400');
  res.status(200).send(`google-site-verification: ${fileName}`);
};
