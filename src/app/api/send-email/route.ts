import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { personalData, vehicleData, paymentData, calculationResult } = body;

    // Konfiguracja transportera dla Gmail
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: true, // Gmail wymaga SSL
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Dodajemy logowanie dla debugowania
    console.log('Konfiguracja SMTP:', {
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      user: process.env.SMTP_USER ? 'Ustawiony' : 'Brak',
      pass: process.env.SMTP_PASS ? 'Ustawione' : 'Brak',
    });

    // Przygotowanie treści maila
    const mailOptions = {
      from: process.env.SMTP_FROM,
      to: personalData.email,
      subject: 'Potwierdzenie zamówienia ubezpieczenia GAP',
      html: `
        <h1>Dziękujemy za zamówienie ubezpieczenia GAP</h1>
        <p>Szanowny/a ${personalData.firstName} ${personalData.lastName},</p>
        <p>Potwierdzamy otrzymanie Twojego zamówienia ubezpieczenia GAP.</p>
        
        <h2>Szczegóły zamówienia:</h2>
        <h3>Dane pojazdu:</h3>
        <ul>
          <li>VIN: ${vehicleData.vin}</li>
          <li>Nr rejestracyjny: ${vehicleData.vrm}</li>
          <li>Data zakupu: ${new Date(vehicleData.purchasedOn).toLocaleDateString()}</li>
        </ul>

        <h3>Szczegóły ubezpieczenia:</h3>
        <ul>
          <li>Składka: ${calculationResult.premium.toLocaleString()} zł</li>
          <li>Okres ochrony: ${calculationResult.details.coveragePeriod}</li>
          <li>Maksymalna ochrona: ${calculationResult.details.maxCoverage}</li>
        </ul>

        ${paymentData.paymentMethod === 'PM_PBC' ? `
          <h3>Dane do przelewu:</h3>
          <ul>
            <li>Nr konta: XX XXXX XXXX XXXX XXXX XXXX XXXX</li>
            <li>Tytuł przelewu: GAP-${vehicleData.vin}</li>
            <li>Kwota: ${calculationResult.premium.toLocaleString()} zł</li>
          </ul>
        ` : ''}

        <p>Nasz konsultant skontaktuje się z Tobą w ciągu 24 godzin w celu potwierdzenia zamówienia.</p>
        
        <p>Pozdrawiamy,<br>Zespół Ubezpieczeń</p>
      `,
    };

    console.log('Próba wysłania maila do:', personalData.email);

    try {
      // Wysłanie maila
      const info = await transporter.sendMail(mailOptions);
      console.log('Mail wysłany:', info.messageId);
      return NextResponse.json({ success: true, messageId: info.messageId });
    } catch (sendError: any) {
      console.error('Błąd podczas wysyłania:', sendError);
      throw new Error(`Błąd wysyłania: ${sendError.message}`);
    }
  } catch (error: any) {
    console.error('Błąd podczas wysyłania maila:', error);
    return NextResponse.json(
      { error: 'Wystąpił błąd podczas wysyłania maila', details: error.message },
      { status: 500 }
    );
  }
} 