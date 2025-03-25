import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  try {
    const { formData } = await req.json();

    // Konfiguracja transportera nodemailer
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    // Formatowanie JSON do czytelnej postaci
    const formattedJson = JSON.stringify(formData, null, 2);

    // Email do administratora
    const adminMailOptions = {
      from: process.env.EMAIL_USER,
      to: 'mainly.agn@gmail.com',
      subject: 'Nowe zgłoszenie ubezpieczenia GAP',
      text: 'Nowe zgłoszenie ubezpieczenia GAP - szczegóły w załączniku.',
      attachments: [
        {
          filename: `policy-registration-${new Date().toISOString().split('T')[0]}.json`,
          content: formattedJson
        }
      ]
    };

    // Email do klienta
    const clientMailOptions = {
      from: process.env.EMAIL_USER,
      to: formData.personalData.email,
      subject: 'Potwierdzenie zgłoszenia ubezpieczenia GAP',
      html: `
        <h2>Dziękujemy za zgłoszenie ubezpieczenia GAP</h2>
        <p>Szanowny/a ${formData.personalData.firstName} ${formData.personalData.lastName},</p>
        <p>Potwierdzamy otrzymanie Twojego zgłoszenia ubezpieczenia GAP. Poniżej znajdziesz podsumowanie najważniejszych informacji:</p>
        
        <h3>Dane pojazdu:</h3>
        <ul>
          <li>Marka: ${formData.vehicleData.make || 'Nie podano'}</li>
          <li>Model: ${formData.vehicleData.model || 'Nie podano'}</li>
          <li>VIN: ${formData.vehicleData.vin}</li>
          <li>Przebieg: ${formData.vehicleData.mileage} km</li>
        </ul>

        <h3>Wybrane ubezpieczenie:</h3>
        <ul>
          <li>Wariant: ${formData.calculationResult?.details.productName || 'Standardowy'}</li>
          <li>Okres ochrony: ${formData.calculationResult?.details.coveragePeriod || '36 miesięcy'}</li>
          <li>Suma ubezpieczenia: ${formData.calculationResult?.details.maxCoverage || 'Nie określono'}</li>
          <li>Składka: ${formData.calculationResult?.premium || 0} PLN</li>
        </ul>

        <p>Nasz konsultant skontaktuje się z Tobą w ciągu 24 godzin roboczych w celu finalizacji procesu.</p>
        
        <p>W razie pytań, prosimy o kontakt:</p>
        <ul>
          <li>Email: mainly.agn@gmail.com</li>
          <li>Telefon: +48 XXX XXX XXX</li>
        </ul>

        <p>Pozdrawiamy,<br>Zespół Ubezpieczeń GAP</p>
      `
    };

    // Wysłanie obu emaili
    await Promise.all([
      transporter.sendMail(adminMailOptions),
      transporter.sendMail(clientMailOptions)
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Błąd wysyłania emaila:', error);
    return NextResponse.json(
      { error: 'Wystąpił błąd podczas wysyłania emaila' },
      { status: 500 }
    );
  }
} 