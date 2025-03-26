import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  console.log('Rozpoczynam obsługę żądania wysłania maila');
  
  try {
    const body = await request.json();
    console.log('Otrzymane dane:', JSON.stringify(body, null, 2));
    
    const { personalData, vehicleData, paymentData, calculationResult, policyData } = body;

    // Konfiguracja transportera dla Gmail
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'stanislaw.blich@gmail.com',
        pass: 'viqa wtok gxwj cwhq'
      }
    });

    console.log('Transporter skonfigurowany, weryfikuję połączenie...');

    // Weryfikacja połączenia
    try {
      await transporter.verify();
      console.log('Połączenie z serwerem SMTP zweryfikowane pomyślnie');
    } catch (verifyError: any) {
      console.error('Błąd weryfikacji połączenia SMTP:', verifyError);
      throw new Error(`Błąd weryfikacji SMTP: ${verifyError.message}`);
    }

    // Przygotowanie treści maila
    const mailOptions = {
      from: 'stanislaw.blich@gmail.com',
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
    } catch (sendError: any) {
      console.error('Szczegóły błędu wysyłania:', {
        code: sendError.code,
        command: sendError.command,
        response: sendError.response,
        responseCode: sendError.responseCode,
        stack: sendError.stack
      });
      throw new Error(`Błąd wysyłania: ${sendError.message}`);
    }
  } catch (error: any) {
    console.error('Błąd główny:', error);
    return NextResponse.json(
      { 
        error: 'Wystąpił błąd podczas wysyłania maila', 
        details: error.message,
        stack: error.stack 
      },
      { status: 500 }
    );
  }
} 