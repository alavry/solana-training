import "dotenv/config";
import {
  Connection,
  PublicKey,
  clusterApiUrl,
} from "@solana/web3.js";
import { getExplorerLink, getKeypairFromEnvironment } from "@solana-developers/helpers";
import { getOrCreateAssociatedTokenAccount, transfer } from "@solana/spl-token";

import { classroomWallets } from "./classroom-wallets";

const user = getKeypairFromEnvironment("SECRET_KEY")

const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
const recipient = new PublicKey(classroomWallets.RAM);

console.log(
  `Loaded our keypair securely, using an env file! Our public key is ${user.publicKey.toBase58()}`
)

const tokenMintAccount = new PublicKey(process.env.MINT!);
const MINOR_UNITS_PER_MAJOR_UNIT = Math.pow(10, 2);

console.log(`Attempting to send 1 token to ${recipient.toBase58()}...`)

const sourceTokenAccount = await getOrCreateAssociatedTokenAccount(
  connection,
  user,
  tokenMintAccount,
  user.publicKey,
);

const destinationTokenAccount = await getOrCreateAssociatedTokenAccount(
  connection,
  user,
  tokenMintAccount,
  recipient,
);

const signature = await transfer(
  connection,
  user,
  sourceTokenAccount.address,
  destinationTokenAccount.address,
  user,
  100 * MINOR_UNITS_PER_MAJOR_UNIT
);

const explorerLink = getExplorerLink("transaction", signature, "devnet");

console.log(`Transaction confirmed, explorer link is: ${explorerLink}`)
