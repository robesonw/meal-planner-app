export default function handler(req, res) {
  if (req.method === 'GET') {
    return res.status(200).json({ message: 'API route is working!', method: req.method });
  }
  if (req.method === 'POST') {
    return res.status(200).json({ message: 'POST method works!', body: req.body });
  }
  return res.status(405).json({ error: 'Method not allowed' });
}