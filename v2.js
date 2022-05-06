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
    const client = new Client({ intents: [Intents.FLAGS.GUILDS] })
    client.login(process.env.TOKEN); // Tirei o await por problema de demora para logar - muitas vezes nao logando
    return client;
};

const listen = (client) => {
    const handler = async () => {
        const { executeAt, embedPattern, employees, employeesData } = utils;
        const { clearChat, clearArray, getChannelByCache, getChannel, sendMessage, checkEmployees, pingEmployees } = getClientActions(client);

        console.log("SISTEMA: Bot iniciado")

        client.user.setActivity("O ar condicionado esta no 23?", {
            type: "LISTENING",
            url: "https://www.youtube.com/bicicleta_com_rodinha"
        });

        executeAt('29 13,18 * * *', async () => {
            try {
                await clearChat(await getChannelByCache());
                await clearArray(employeesData)

                const message = await sendMessage(await getChannel(), embedPattern);

                setTimeout(async () => {
                    await checkEmployees(getChannelByCache(), message.id, employeesData);
                    await pingEmployees(employees, employeesData, getChannelByCache());
                }, 5000)

            } catch (error) {
                console.log(error);
            }
        }, {
            timezone: "America/Sao_Paulo"
        });
    };

    client.on('ready', handler);
};

const utils = {
    employeesData: [],
    executeAt: (cronNotation, cb) => schedule(cronNotation, cb),
    embedPattern: new MessageEmbed().setColor('#FEE250').setThumbnail('https://apepe.com/wp-content/uploads/elementor/thumbs/logo-branco-apepe-pg9re5qxfzspc9e6cptxrx077il0ojis9gg4d08si8.png').setFooter({ text: "Apepê - Funcionários", iconURL: "https://media.discordapp.net/attachments/804350503445987370/963433910627336282/02_09_KENJI_-_SKWIZ_LAB.jpg?width=560&height=659" }).addFields({ name: 'Bater ponto no aplicativo', value: '‎' }).setTimestamp(),
    employees: ["971506845380386846", "323501959560691712", "307687975993606146", "572137293054214165", "463821733431083018", "487082466977251348", "331123567863529472"]
}

const getClientActions = (client) => ({
    getChannelByCache: () => {
        return client.channels.cache.get(process.env.CHANNEL_ID);
    },
    getChannel: () => {
        return client.channels.fetch(process.env.CHANNEL_ID);
    },
    clearChat: (channel) => {
        channel.bulkDelete(20);
    },
    clearArray: (employeesData) => {
        employeesData = [];
    },
    sendMessage: async (channel, embed) => {
        const msg = await channel.send({ embeds: [embed] });
        await msg.react('👍');
        return msg;
    },
    checkEmployees: async (channel, messageID, employeesData) => {
        const fetchMessage = await channel.messages.fetch(messageID);
        const reactionUsers = await fetchMessage.reactions.resolve('👍').users.fetch();
        const reactionUsersMap = await reactionUsers.map((user) => user.id);

        employeesData.push(...reactionUsersMap);
    },
    pingEmployees: async (employees, reactionUsersMap, channel) => {
        const arrayDifference = await employees.filter(employee => !reactionUsersMap.includes(employee));

        arrayDifference.forEach(employee => {
            channel.send(`<@${employee}> - Não relatou se bateu o ponto`)
        })
    }
});

main().catch(error => console.log(error));


