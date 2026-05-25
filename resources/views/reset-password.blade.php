<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; background: #f9fafb; margin: 0; padding: 20px; }
    .container { max-width: 500px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.07); }
    .header { background: #059669; padding: 32px; text-align: center; }
    .header h1 { color: white; margin: 0; font-size: 24px; }
    .body { padding: 32px; }
    .code-box { background: #f0fdf4; border: 2px solid #059669; border-radius: 12px; padding: 20px; text-align: center; margin: 24px 0; }
    .code { font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #059669; font-family: monospace; }
    .footer { background: #f9fafb; padding: 16px; text-align: center; font-size: 12px; color: #9ca3af; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🌿 MoroccoArt</h1>
    </div>
    <div class="body">
      <p>Bonjour <strong>{{ $userName }}</strong>,</p>
      <p>Vous avez demandé une réinitialisation de votre mot de passe. Voici votre code :</p>
      <div class="code-box">
        <div class="code">{{ $code }}</div>
      </div>
      <p style="color: #ef4444; font-size: 13px;">⚠️ Ce code expire dans <strong>10 minutes</strong>.</p>
      <p style="color: #6b7280; font-size: 13px;">Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.</p>
    </div>
    <div class="footer">
      © 2024 MoroccoArt — Artisanat Marocain Authentique
    </div>
  </div>
</body>
</html>