const { EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");
const fs = require("fs");
const path = require("path");
const permissions = require("../utils/permissions");

module.exports = {
    name: "welcome",
    description: "Bienvenue à un utilisateur",
    options: [
        {
            name: "user",
            description: "Select a user",
            type: ApplicationCommandOptionType.User,
            required: false,
        },
    ],
    runSlash: async (_, interaction) => {
        if (!permissions.isAllowed(interaction)) {
            return interaction.reply({ content: "Vous n'avez pas la permission d'exécuter cette commande.", ephemeral: true });
        }
        const member = interaction.member;
        const memberCount = member.guild.memberCount;

        const embedData = JSON.parse(
            fs.readFileSync(
                path.join(__dirname, "../embeds/welcome.json"),
                "utf8"
            )
        );

        const description = embedData.description.replace(
            "{memberCount}",
            memberCount
        );

        const welcomingEmbed = new EmbedBuilder()
            .setTitle(embedData.title)
            .setDescription(description)
            .setColor(embedData.color)
            .setAuthor({
                name: embedData.author.name,
                url: embedData.author.url || "https://www.ecole-directe.plus/",
                iconURL: embedData.author.iconUrl,
            });

        await interaction.reply({ embeds: [welcomingEmbed] });
    },
};
