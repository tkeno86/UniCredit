// api/list.js
import { google } from 'googleapis';

export default async function handler(req, res) {
  const { accessToken, folderId } = req.query;

  if (!accessToken || !folderId) {
    return res.status(400).json({ error: 'Missing accessToken or folderId' });
  }

  const auth = new google.auth.OAuth2();
  auth.setCredentials({ access_token: accessToken });

  const drive = google.drive({ version: 'v3', auth });

  try {
    const response = await drive.files.list({
      q: `'${folderId}' in parents and trashed = false`,
      fields: 'files(id, name, mimeType)',
    });

    res.status(200).json(response.data.files);
  } catch (error) {
    console.error('Drive API error:', error);
    res.status(500).json({ error: error.message });
  }
}
