import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Interfejsy dla typów błędów
interface SMTPError extends Error {
  code?: string;
  command?: string;
  response?: string;
  responseCode?: number;
}

export async function POST(request: Request) {
  console.log('Rozpoczynam obsługę żądania wysłania maila');
  
  try {
    const body = await request.json();
    console.log('Otrzymane dane:', JSON.stringify(body, null, 2));
    
    const { personalData, vehicleData, paymentData, policyData } = body;

    console.log('Sprawdzam zmienne środowiskowe:', {
      SMTP_HOST: process.env.SMTP_HOST,
      SMTP_PORT: process.env.SMTP_PORT,
      SMTP_USER: process.env.SMTP_USER,
      SMTP_FROM: process.env.SMTP_FROM,
      HAS_SMTP_PASS: !!process.env.SMTP_PASS
    });

    // Konfiguracja transportera
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '465'),
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    console.log('Konfiguracja SMTP:', {
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: true,
      user: process.env.SMTP_USER
    });

    // Weryfikacja połączenia
    try {
      await transporter.verify();
      console.log('Połączenie z serwerem SMTP zweryfikowane pomyślnie');
    } catch (verifyError) {
      const smtpError = verifyError as SMTPError;
      console.error('Błąd weryfikacji połączenia SMTP:', smtpError);
      throw new Error(`Błąd weryfikacji SMTP: ${smtpError.message}`);
    }

    // Przygotowanie treści maila
    const mailOptions = {
      from: process.env.SMTP_FROM,
      to: personalData.email,
      subject: 'Potwierdzenie zamówienia ubezpieczenia GAP',
      text: `
Dziękujemy za zamówienie ubezpieczenia GAP

Szanowny/a ${personalData.firstName} ${personalData.lastName},

Potwierdzamy otrzymanie Twojego zamówienia ubezpieczenia GAP.

Dane osobowe:
- Imię i nazwisko: ${personalData.firstName} ${personalData.lastName}
- Email: ${personalData.email}
- Telefon: ${personalData.phoneNumber}
- Adres: ${personalData.address.street}, ${personalData.address.postCode} ${personalData.address.city}

Dane pojazdu:
- VIN: ${vehicleData.vin}
- Nr rejestracyjny: ${vehicleData.vrm}
- Data zakupu: ${new Date(vehicleData.purchasedOn).toLocaleDateString()}
- Przebieg: ${vehicleData.mileage} km
- Cena zakupu: ${(vehicleData.purchasePrice / 100).toLocaleString()} zł

Szczegóły ubezpieczenia:
- Wariant produktu: ${policyData.productCode}
- Okres ochrony: ${paymentData.term} miesięcy
- Limit roszczeń: ${paymentData.claimLimit}
- Składka: ${(policyData.premium / 100).toLocaleString()} zł
- Forma płatności: ${paymentData.paymentMethod === 'PM_PBC' ? 'Przelew bankowy' : 'Karta płatnicza'}

${paymentData.paymentMethod === 'PM_PBC' ? `
Dane do przelewu:
- Nr konta: XX XXXX XXXX XXXX XXXX XXXX XXXX
- Tytuł przelewu: GAP-${vehicleData.vin}
- Kwota: ${(policyData.premium / 100).toLocaleString()} zł
` : ''}

Nasz konsultant skontaktuje się z Tobą w ciągu 24 godzin w celu potwierdzenia zamówienia.

Pozdrawiamy,
Zespół Ubezpieczeń
      `
    };

    console.log('Przygotowano opcje maila:', {
      to: mailOptions.to,
      from: mailOptions.from,
      subject: mailOptions.subject
    });

    try {
      console.log('Próba wysłania maila...');
      const info = await transporter.sendMail(mailOptions);
      console.log('Mail wysłany pomyślnie:', {
        messageId: info.messageId,
        response: info.response
      });
      return NextResponse.json({ 
        success: true, 
        messageId: info.messageId,
        response: info.response 
      });
    } catch (sendError) {
      const smtpError = sendError as SMTPError;
      console.error('Szczegóły błędu wysyłania:', {
        code: smtpError.code,
        command: smtpError.command,
        response: smtpError.response,
        responseCode: smtpError.responseCode,
        stack: smtpError.stack
      });
      throw new Error(`Błąd wysyłania: ${smtpError.message}`);
    }
  } catch (error) {
    const serverError = error as Error;
    console.error('Błąd główny:', serverError);
    return NextResponse.json(
      { 
        error: 'Wystąpił błąd podczas wysyłania maila', 
        details: serverError.message,
        stack: serverError.stack 
      },
      { status: 500 }
    );
  }
} 