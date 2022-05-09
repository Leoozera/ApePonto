const { Client, Intents, MessageEmbed } = require('discord.js');
const { isEqual, parse } = require('date-fns');
const { schedule } = require('node-cron');
const dotenv = require('dotenv');

dotenv.config();

const main = async () => {
    const client = await initializeApp();
    listen(client);
};

const initializeApp = async () => {
    const client = new Client({
        intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS],
        partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
    });
    client.login(process.env.TOKEN);

    return client;
};

const listen = (client) => {
    var { executeAt, day, employeesName, embedPattern, reactionUsersList, messageId } = utils;
    const { getChannelByCache, getChannel, clearChat, clearData, sendMessage, pingEmployees, editSituation } = getClientActions(client);

    const handlerReady = async () => {
        console.log("SISTEMA: Bot iniciado");

        if(day == "Sabado" || day == "Domingo") return;

        executeAt('*/20 * * * * * will run every 20 sec.', async () => {
            try {
                await clearChat(await getChannelByCache());
                await clearData(reactionUsersList, messageId)

                const message = await sendMessage(await getChannel(), embedPattern, messageId);
                messageId = message.id;

                setTimeout(async () => {
                    await pingEmployees(reactionUsersList, getChannelByCache(), employeesName, message);
                }, 5000) // 15 minutos 900000

            } catch (error) {
                console.log(error)
            };
        })

        client.user.setActivity("O ar condicionado esta no 23?", {
            type: "LISTENING",
            url: "https://www.youtube.com/bicicleta_com_rodinha"
        });
    };

    const handlerReactionAdd = async (reaction, user) => {
        if (user.bot) return;

        const channel = await getChannelByCache();
        const reactionMessageID = reaction.message.id;
        const reactionUserID = user.id;

        if (messageId != reactionMessageID);
        const employeeData = await employeesName.find(employee => employee.id == user.id)

        await editSituation(reaction, user, employeeData, reactionUsersList)

    }

    client.on('ready', handlerReady);
    client.on('messageReactionAdd', (reaction, user) => handlerReactionAdd(reaction, user))
};

var utils = {
    executeAt: (cronNotation, cb) => schedule(cronNotation, cb, { timezone: "America/Sao_Paulo" }),

    reactionUsersList: [],
    messageId: "",
    day: ["Domingo","Segunda","Terça","Quarta","Quinta","Sexta","Sabado"][new Date(Date.now()).getDay()],
    employeesName: [
        { name: "Antonny", id: "307687975993606146" },
        { name: "Kenji", id: "572137293054214165" },
        { name: "Kowas", id: "463821733431083018" },
        { name: "Renato", id: "487082466977251348" },
        { name: "Vitor", id: "331123567863529472" },
        { name: "Leo", id: "323501959560691712" }
    ],

    embedPattern: new MessageEmbed().setColor('#36393F').setThumbnail('https://apepe.com/wp-content/uploads/elementor/thumbs/logo-branco-apepe-pg9re5qxfzspc9e6cptxrx077il0ojis9gg4d08si8.png').setFooter({ text: "Apepê - Funcionários", iconURL: "https://i.pinimg.com/originals/e2/82/e2/e282e2739af30635723b9e2701bb8148.gif" }).addFields({ name: `ApêPonto • ${new Date().toLocaleDateString()}`, value: `‎\nAntonny: ⏳\nKenji: ⏳\nKowas: ⏳\nRenato: ⏳\nVitor: ⏳\nLeo: ⏳` }).setTimestamp()
}

const getClientActions = (client) => ({

    getChannelByCache: () => { return client.channels.cache.get(process.env.CHANNEL_ID); },
    getChannel: () => { return client.channels.fetch(process.env.CHANNEL_ID); },

    clearChat: (channel) => channel.bulkDelete(20),

    clearData: (reactionUsersList, messageId) => {
        reactionUsersList = [];
        messageId = "";
    },

    sendMessage: async (channel, embed, messageId) => {
        let msg = await channel.send({ embeds: [embed] });
        messageId = msg.id;
        await msg.react('📱');
        return msg;
    },

    editSituation: async (reaction, user, employeeData, reactionUsersList) => {

        const embed = reaction.message.embeds[0];
        embed.fields[0] = { name: embed.fields[0].name, value: embed.fields[0].value.replace(`${employeeData.name}: ⏳`, `${employeeData.name}: 📱`) };

        if (reactionUsersList.find(employee => employee == employeeData.id)) return;

        await reaction.message.edit({ embeds: [embed] });
        await reactionUsersList.push(`${employeeData.id}`)
    },

    pingEmployees: async (reactionUsersList, channel, employeesName, message) => {
        await message.reactions.removeAll();

        const missingIds = await employeesName.filter(employee => !reactionUsersList.includes(employee.id))
        missingIds.forEach(employee => {
            channel.send(`${employee.name} - Não relatou se bateu o ponto`);
        })
    },
});

main().catch(error => console.log(error));

// Erro de logica a corrigir: Se o usuario remover o emoji, não irá contar como resolvido;
// Solução que eu pensei: Pegar na EMBED editada.
// Adicionar FOLGA NO FDS PELO AMOR DE DEEEUS PINGOU O DIA TODO