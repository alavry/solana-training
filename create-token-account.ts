import { getOrCreateAssociatedTokenAccount } from '@solana/spl-token';
import "dotenv/config";
import {
  getExplorerLink,
  getKeypairFromEnvironment,
} from "@solana-developers/helpers";
import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";
import { classroomWallets } from './classroom-wallets';

const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

const sender = getKeypairFromEnvironment("SECRET_KEY");

console.log(
  `Loaded our keypair securely, using an env file! Our public key is ${sender.publicKey.toBase58()}`
);

const tokenMintAccount = new PublicKey(process.env.MINT!);

const recipient = new PublicKey(classroomWallets.ANDREW);

const tokenAccount = await getOrCreateAssociatedTokenAccount(
  connection,
  sender,
  tokenMintAccount,
  recipient,
);

console.log(`Token Account: ${tokenAccount.address.toBase58}`)

const link = getExplorerLink(
  "address",
  tokenAccount.address.toBase58(),
  "devnet"
);

console.log(`Created token account: ${link}`);
