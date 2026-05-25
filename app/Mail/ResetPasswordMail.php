<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ResetPasswordMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public string $code,
        public string $userName
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Code de réinitialisation - MoroccoArt',
        );
    }

    public function content(): Content
    {
        return new Content(
            htmlString: "
                <!DOCTYPE html>
                <html>
                <head><meta charset='utf-8'></head>
                <body style='font-family:Arial,sans-serif;background:#f9fafb;padding:20px'>
                  <div style='max-width:500px;margin:0 auto;background:white;border-radius:16px;overflow:hidden'>
                    <div style='background:#059669;padding:32px;text-align:center'>
                      <h1 style='color:white;margin:0'>🌿 MoroccoArt</h1>
                    </div>
                    <div style='padding:32px'>
                      <p>Bonjour <strong>{$this->userName}</strong>,</p>
                      <p>Voici votre code de réinitialisation :</p>
                      <div style='background:#f0fdf4;border:2px solid #059669;border-radius:12px;padding:20px;text-align:center;margin:24px 0'>
                        <div style='font-size:40px;font-weight:bold;letter-spacing:10px;color:#059669;font-family:monospace'>{$this->code}</div>
                      </div>
                      <p style='color:#ef4444;font-size:13px'>⚠️ Ce code expire dans <strong>10 minutes</strong>.</p>
                      <p style='color:#6b7280;font-size:13px'>Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.</p>
                    </div>
                    <div style='background:#f9fafb;padding:16px;text-align:center;font-size:12px;color:#9ca3af'>
                      © 2024 MoroccoArt — Artisanat Marocain Authentique
                    </div>
                  </div>
                </body>
                </html>
            ",
        );
    }
}

// namespace App\Mail;

// use Illuminate\Bus\Queueable;
// use Illuminate\Mail\Mailable;
// use Illuminate\Mail\Mailables\Content;
// use Illuminate\Mail\Mailables\Envelope;
// use Illuminate\Queue\SerializesModels;

// class ResetPasswordMail extends Mailable
// {
//     use Queueable, SerializesModels;

//     public function __construct(
//         public string $code,
//         public string $userName
//     ) {}

//     public function envelope(): Envelope
//     {
//         return new Envelope(
//             subject: 'Code de réinitialisation - MoroccoArt',
//         );
//     }

//     public function content(): Content
//     {
//         return new Content(
//             view: 'emails.reset-password',
//             with: [
//                 'code'     => $this->code,
//                 'userName' => $this->userName,
//             ]
//         );
//     }
// }

// namespace App\Mail;

// use Illuminate\Bus\Queueable;
// use Illuminate\Contracts\Queue\ShouldQueue;
// use Illuminate\Mail\Mailable;
// use Illuminate\Mail\Mailables\Attachment;
// use Illuminate\Mail\Mailables\Content;
// use Illuminate\Mail\Mailables\Envelope;
// use Illuminate\Queue\SerializesModels;

// class ResetPasswordMail extends Mailable
// {
//     use Queueable, SerializesModels;

//     /**
//      * Create a new message instance.
//      */
//     public function __construct()
//     {
//         //
//     }

//     /**
//      * Get the message envelope.
//      */
//     public function envelope(): Envelope
//     {
//         return new Envelope(
//             subject: 'Reset Password Mail',
//         );
//     }

//     /**
//      * Get the message content definition.
//      */
//     public function content(): Content
//     {
//         return new Content(
//             view: 'view.name',
//         );
//     }

//     /**
//      * Get the attachments for the message.
//      *
//      * @return array<int, Attachment>
//      */
//     public function attachments(): array
//     {
//         return [];
//     }
// }
