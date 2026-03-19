/**
 * Skrypt do generowania hasha hasła dla admina
 * Użycie: node scripts/generate-password-hash.js <hasło>
 */

const bcrypt = require('bcryptjs');

async function generateHash(password) {
  if (!password) {
    console.error('Błąd: Podaj hasło jako argument');
    console.log('Użycie: node scripts/generate-password-hash.js <hasło>');
    process.exit(1);
  }

  const saltRounds = 12;
  const hash = await bcrypt.hash(password, saltRounds);
  
  console.log('\n=== Hash hasła wygenerowany ===');
  console.log('Hasło:', password);
  console.log('Hash:', hash);
  console.log('\nDodaj do .env.local:');
  console.log(`ADMIN_PASSWORD_HASH="${hash}"`);
  console.log('================================\n');
}

const password = process.argv[2];
generateHash(password).catch((error) => {
  console.error('Błąd podczas generowania hasha:', error);
  process.exit(1);
});
