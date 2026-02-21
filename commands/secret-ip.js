import { SlashCommandBuilder, PermissionsBitField } from 'discord.js'
import DB from '../DB.js'

async function getPublicIPv4() {
  // Try a public IP service first
  try {
    const res = await fetch('https://api.ipify.org?format=json', { cache: 'no-store' })
    if (res.ok) {
      const j = await res.json()
      if (j && j.ip) return j.ip
    }
  } catch (e) {
    return null
  }

  return null
}

export const data = new SlashCommandBuilder()
  .setName('secret-ip')
  .setDescription('Admin only: privately send you the server IPv4 address')

export async function execute(interaction) {
  // Ensure this is used in a guild and by a member
  if (!interaction.guild || !interaction.member) {
    await interaction.reply({ content: 'This command must be used in a server.', ephemeral: true })
    return
  }

  // Check server administrator permission
  const perms = interaction.member.permissions
  if (!perms || !perms.has(PermissionsBitField.Flags.Administrator)) {
    await interaction.reply({ content: 'You must be a server administrator to use this command.', ephemeral: true })
    return
  }

  // Additionally require the user to be a registered bot admin in the DB
  if (!DB.isAdmin(interaction.user.id)) {
    await interaction.reply({ content: 'You must be a bot admin (registered in the bot DB) to use this command.', ephemeral: true })
    return
  }

  const ip = await getPublicIPv4()
  if (!ip) {
    await interaction.reply({ content: 'Could not determine server IPv4 address.', ephemeral: true })
    return
  }

  try {
    // Send via DM to avoid potential channel permission issues
    await interaction.user.send('Server IPv4 address: ' + ip)
    await interaction.reply({ content: 'I have sent you the server IP via DM.', ephemeral: true })
  } catch (err) {
    await interaction.reply({ content: "Couldn't DM you — please enable DMs from server members.", ephemeral: true })
  }
}
