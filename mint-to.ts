import {
  getOrCreateAssociatedTokenAccount,
  mintTo,
} from '@solana/spl-token';
import 'dotenv/config';
import {
  getKeypairFromEnvironment,
  getExplorerLink,
} from '@solana-developers/helpers';
import {
  Connection,
  clusterApiUrl,
  PublicKey,
} from '@solana/web3.js';

const keypair = getKeypairFromEnvironment('SECRET_KEY');

console.log(
  `Finished! We've loaded our keypair, securely, using an env file! Our public key is: ${keypair.publicKey.toBase58()}`,
);

const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');

const tokenPublicKey = new PublicKey('4xJfFi2g9xyQnGPmUrvKY4EMsEM2VcYDThx5NG2sTBRs');

const tokenAccount = await getOrCreateAssociatedTokenAccount(
  connection,
  keypair,
  tokenPublicKey,
  keypair.publicKey,
);

const signature = await mintTo(
  connection,
  keypair,
  tokenPublicKey,
  tokenAccount.address,
  keypair,
  1000000000000,
);

const link = getExplorerLink('transaction', signature, 'devnet');

console.log(
  `Success! Mint Token Transaction: ${link}`,
);
