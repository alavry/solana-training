import 'dotenv/config';
import {
  Connection,
  LAMPORTS_PER_SOL,
  clusterApiUrl,
} from '@solana/web3.js';
import {
  getKeypairFromEnvironment,
  airdropIfRequired,
} from '@solana-developers/helpers';

const connection = new Connection(
  clusterApiUrl('devnet'),
  'confirmed',
);

const keypair = getKeypairFromEnvironment('SECRET_KEY');

const balance = await connection.getBalance(keypair.publicKey);

console.log(`Balance of keypair is: ${balance}`);

const newBalance = await airdropIfRequired(
  connection,
  keypair.publicKey,
  1 * LAMPORTS_PER_SOL,
  0.5 * LAMPORTS_PER_SOL,
);

console.log(`New balance of keypair is: ${newBalance}`);
