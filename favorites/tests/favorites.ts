
import { Program, Wallet, AnchorProvider, setProvider, workspace, web3, getProvider, BN } from "@coral-xyz/anchor";
import { airdropIfRequired } from "@solana-developers/helpers";
import { Favorites } from "../target/types/favorites";
import { assert } from "chai";

describe("favorites", () => {
  const provider = AnchorProvider.env();
  setProvider(provider);
  const user = (provider.wallet as Wallet).payer
  const someRandomGuy = web3.Keypair.generate();
  const program = workspace.Favorites as Program<Favorites>;
  const favoriteNumber = new BN(23);
  const favoriteColor = "purple";
  const favoriteHobbies = ["skiing", "skydiving", "biking"];

  before(async () => {
    await airdropIfRequired(
      getProvider().connection,
      user.publicKey,
      0.5 * web3.LAMPORTS_PER_SOL,
      1 * web3.LAMPORTS_PER_SOL
    );
  })

  it("Writes our favorites to the blockchain", async () => {
      await program.methods
        .setFavorites(favoriteNumber, favoriteColor, favoriteHobbies)
        .signers([user])
        .rpc();
  });

  it("Checks that unknown signer are unable to write to the blockchain", async () => {
    const favoritesPdaAndBump = web3.PublicKey.findProgramAddressSync(
      [Buffer.from("favorites"), user.publicKey.toBuffer()],
      program.programId
    );
    
    const favoritesPda = favoritesPdaAndBump[0];
    
    const dataFromPda = await program.account.favorites.fetch(favoritesPda);
    
    assert.equal(dataFromPda.color, favoriteColor);
    assert.equal(dataFromPda.number.toString(), favoriteNumber.toString());
    assert.deepEqual(dataFromPda.hobbies, favoriteHobbies);

    try {
      await program.methods.setFavorites(favoriteNumber, favoriteColor, favoriteHobbies)
      .signers([someRandomGuy])
      .rpc();
    }
    catch (error) {
      const errorMessage = (error as Error).message;
      assert.isTrue(errorMessage.includes("unknown signer"))
    }
  });
});
