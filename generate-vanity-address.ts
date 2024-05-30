import {
  Keypair,
} from '@solana/web3.js';

const vanityPrefix = 'Andrew';

let keypair = Keypair.generate();

let publicKey = keypair.publicKey.toBase58();

let count = 0;

while (!publicKey.startsWith(vanityPrefix)) {
  keypair = Keypair.generate();
  publicKey = keypair.publicKey.toBase58();
  count += 1;
}

console.log(`Found a vanity address after ${count} iterations!`);

console.log('The public key is: ', publicKey);

console.log('The private key is: ', keypair.secretKey);
