import "dotenv/config";
import {
  getExplorerLink,
  getKeypairFromEnvironment,
} from "@solana-developers/helpers";
import {
  Connection,
  PublicKey,
  clusterApiUrl,
  Transaction,
  sendAndConfirmTransaction
} from "@solana/web3.js";
import { createCreateMetadataAccountV3Instruction } from "@metaplex-foundation/mpl-token-metadata";

const user = getKeypairFromEnvironment("SECRET_KEY");

const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

console.log(`Loaded our keypair securely, using an env file! Our public key is ${user.publicKey.toBase58()}`);

const TOKEN_METADATA_PROGRAM_ID = new PublicKey(
  "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
);

const tokenMintAccount = new PublicKey(
  process.env.MINT!
);

const metadataData = {
  name: "Solana Training Token",
  symbol: "TRAINING",
  uri: "https://raw.githubusercontent.com/solana-developers/professional-education/main/labs/sample-token-metadata.json",
  sellerFeeBasisPoints: 0,
  creators: null,
  collection: null,
  uses: null
}

const metadataPDAAndBump = PublicKey.findProgramAddressSync(
  [
    Buffer.from("metadata"),
    TOKEN_METADATA_PROGRAM_ID.toBuffer(),
    tokenMintAccount.toBuffer()
  ],
  TOKEN_METADATA_PROGRAM_ID
);

const metadataPDA = metadataPDAAndBump[0];

const transaction = new Transaction();

const createMetadataAccountInstruction = 
 createCreateMetadataAccountV3Instruction(
  {
    metadata: metadataPDA,
    mint: tokenMintAccount,
    mintAuthority: user.publicKey,
    payer: user.publicKey,
    updateAuthority: user.publicKey,
  },
  {
    createMetadataAccountArgsV3: {
      collectionDetails: null,
      data: metadataData,
      isMutable: true
    }
  },
  TOKEN_METADATA_PROGRAM_ID
)

transaction.add(createMetadataAccountInstruction);

const signature = await sendAndConfirmTransaction(
  connection,
  transaction,
  [user]
);

const link = getExplorerLink("transaction", signature, "devnet");

console.log(`Success! Metadata Account: ${link}`);
