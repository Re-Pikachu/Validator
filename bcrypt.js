const bcrypt = require('bcrypt');

async function testBcrypt() {
  const password = 'codesmith';
  const hashedPassword = await bcrypt.hash(password, 10);

  const isPasswordValid = await bcrypt.compare(password, hashedPassword);
  console.log('Is Password Valid:', isPasswordValid);
}

console.log(testBcrypt('codesmith'));





// const bcrypt = require('bcrypt');

// async function generateHash() {
//   const password = 'codesmith'; // Replace with the password you want to hash
//   const saltRounds = 10;

//   try {
//     const hash = await bcrypt.hash(password, saltRounds);
//     console.log('Generated hash:', hash);
//   } catch (error) {
//     console.error('Error generating hash:', error);
//   }
// }

// // Call the function
// generateHash("codesmith");