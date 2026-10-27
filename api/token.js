const { RtcTokenBuilder, RtcRole } = require('agora-access-token');

module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const canal = req.query.canal;
  if (!canal) {
    return res.status(400).json({ error: 'Falta el parametro canal' });
  }

  const appId = process.env.AGORA_APP_ID;
  const appCertificate = process.env.AGORA_APP_CERTIFICATE;
  const role = RtcRole.PUBLISHER;
  const expirationTimeInSeconds = 3600;
  const currentTimestamp = Math.floor(Date.now() / 1000);
  const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;

  try {
    const token = RtcTokenBuilder.buildTokenWithUid(
      appId,
      appCertificate,
      canal,
      0,
      role,
      privilegeExpiredTs
    );
    return res.status(200).json({ token: token, canal: canal });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
