import 'dotenv/config';
import {
  Connection,
  LAMPORTS_PER_SOL,
  PublicKey,
  clusterApiUrl,
  SystemProgram,
  sendAndConfirmTransaction,
  Transaction,
  TransactionInstruction,
} from '@solana/web3.js';
import {
  getKeypairFromEnvironment,
} from '@solana-developers/helpers';

import classroomWallets from './classroom-wallets.ts';

const sender = getKeypairFromEnvironment('SECRET_KEY');

const connection = new Connection(clusterApiUrl('devnet'));

console.log(
  `Loaded our keypair securely, using an env file! Our public key is ${sender.publicKey.toBase58()}`,
);

const recipient = new PublicKey(classroomWallets.RAM);

console.log(
  `Attempting to send 0.01 SOL to ${recipient.toBase58()}...`,
);

const transaction = new Transaction();

const sendSolInstruction = SystemProgram.transfer({
  fromPubkey: sender.publicKey,
  toPubkey: recipient,
  lamports: 0.01 * LAMPORTS_PER_SOL,
});

transaction.add(sendSolInstruction);

const memoProgram = new PublicKey(
  'MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr',
);

const memoText = 'Hello from Solana!';

const addMemoInstruction = new TransactionInstruction({
  keys: [],
  programId: memoProgram,
  data: Buffer.from(memoText, 'utf-8'),
});

transaction.add(addMemoInstruction);

console.log(`memo is ${memoText}...`);

const signature = await sendAndConfirmTransaction(
  connection,
  transaction,
  [sender],
);

console.log(`Transaction confirmed, signature: ${signature}`);
