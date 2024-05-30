use anchor_lang::prelude::*;

// Don't need to manually change this
declare_id!("NSijMqQBfiHVSseiyyyUGzr2pzuouiQKfrLC5GRM2ur");

// Anchor accounts use 8 bytes to determine the account type
pub const ANCHOR_DISCRIMINATOR_SIZE: usize = 8;

#[program]
pub mod favorites {
    use super::*;

    pub fn set_favorites(context: Context<SetFavorites>, number: u64, color: String, hobbies: Vec<String>) -> Result<()> {
        let user_public_key = context.accounts.user.key();
        msg!("Greetings from {}", context.program_id);
        msg!("User {}'s favorite number is {}, favorite color is {}", user_public_key, number, color);

        msg!("User's hobbies are: {:?}", hobbies);

        context.accounts.favorites.set_inner(Favorites {
            number,
            color,
            hobbies,
        });

        Ok(())
    }
    
    // We can also add a get_favorites instruction handler to get favorites
}

#[account]
#[derive(InitSpace)]
pub struct Favorites {
    pub number: u64,

    #[max_len(50)]
    pub color: String,

    #[max_len(5, 50)]
    pub hobbies: Vec<String>
}

#[derive(Accounts)]
pub struct SetFavorites<'info> {
    #[account(mut)]
    pub user: Signer<'info>,

    #[account(
        init_if_needed,
        payer = user,
        space = ANCHOR_DISCRIMINATOR_SIZE + Favorites::INIT_SPACE,
        seeds=[b"favorites".as_ref(), user.key().as_ref()],
        bump
    )]
    pub favorites: Account<'info, Favorites>,

    pub system_program: Program<'info, System>,
}