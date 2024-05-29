import { getOrCreateAssociatedTokenAccount, mintTo } from "@solana/spl-token";
import "dotenv/config";
import {
  getKeypairFromEnvironment,
  getExplorerLink
} from "@solana-developers/helpers";
import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";
import { classroomWallets } from "./classroom-wallets";

const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

const MINOR_UNITS_PER_MAJOR_UNIT = Math.pow(10, 9);

const sender = getKeypairFromEnvironment("SECRET_KEY");

const tokenMintAccount = new PublicKey(process.env.MINT!);

const recipientAssociatedTokenAccount = await getOrCreateAssociatedTokenAccount(
  connection,
  sender,
  tokenMintAccount,
  new PublicKey(classroomWallets.ANDREW)
);

const transactionSignature = await mintTo(
  connection,
  sender,
  tokenMintAccount,
  recipientAssociatedTokenAccount.address,
  sender,
  10 * MINOR_UNITS_PER_MAJOR_UNIT
);

const link = getExplorerLink("transaction", transactionSignature, "devnet");

console.log(`Success! Mint Token Transaction: ${link}`);
