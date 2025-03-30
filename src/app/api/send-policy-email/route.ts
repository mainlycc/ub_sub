import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { to, subject, policyDetails } = data;

    // Konfiguracja transportera z danymi z .env.local
    const transporter = nodemailer.createTransport({
      host: 'ceres.getspace.us',
      port: 465,
      secure: true, // używamy SSL
      auth: {
        user: 'kontakt@gapauto.pl',
        pass: 'NoweSuperBezpieczneHasło123!',
      },
      debug: true
    });

    // Przygotuj treść maila w formacie HTML
    const htmlContent = `
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .section { margin-bottom: 20px; padding: 15px; border: 1px solid #ddd; border-radius: 5px; }
            h2 { color: #300FE6; margin-bottom: 15px; }
            .label { color: #666; font-size: 0.9em; }
            .value { font-weight: bold; margin-bottom: 10px; }
          </style>
        </head>
        <body>
          <h1>Podsumowanie polisy GAP</h1>
          
          <div class="section">
            <h2>Wariant ubezpieczenia</h2>
            <div class="label">Produkt:</div>
            <div class="value">${policyDetails.variant.name}</div>
            <div class="label">Sposób podpisu:</div>
            <div class="value">${policyDetails.variant.signatureType}</div>
          </div>

          <div class="section">
            <h2>Dane pojazdu</h2>
            <div class="label">Marka i model:</div>
            <div class="value">${policyDetails.vehicle.make} ${policyDetails.vehicle.model}</div>
            <div class="label">VIN:</div>
            <div class="value">${policyDetails.vehicle.vin}</div>
            <div class="label">Numer rejestracyjny:</div>
            <div class="value">${policyDetails.vehicle.registrationNumber}</div>
            <div class="label">Przebieg:</div>
            <div class="value">${policyDetails.vehicle.mileage} km</div>
            <div class="label">Data pierwszej rejestracji:</div>
            <div class="value">${policyDetails.vehicle.firstRegistrationDate}</div>
            <div class="label">Data zakupu:</div>
            <div class="value">${policyDetails.vehicle.purchaseDate}</div>
          </div>

          <div class="section">
            <h2>Dane osobowe</h2>
            <div class="label">Imię i nazwisko:</div>
            <div class="value">${policyDetails.personal.fullName}</div>
            <div class="label">PESEL:</div>
            <div class="value">${policyDetails.personal.pesel}</div>
            <div class="label">Email:</div>
            <div class="value">${policyDetails.personal.email}</div>
            <div class="label">Telefon:</div>
            <div class="value">${policyDetails.personal.phone}</div>
            <div class="label">Adres:</div>
            <div class="value">${policyDetails.personal.address}</div>
          </div>

          <p style="color: #666; font-size: 0.8em; margin-top: 30px;">
            To jest automatycznie wygenerowana wiadomość. Prosimy na nią nie odpowiadać.
          </p>
        </body>
      </html>
    `;

    // Wyślij maila
    await transporter.sendMail({
      from: 'kontakt@gapauto.pl',
      to,
      subject,
      html: htmlContent,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Błąd podczas wysyłania maila:', error);
    return NextResponse.json(
      { error: 'Wystąpił błąd podczas wysyłania maila' },
      { status: 500 }
    );
  }
} 