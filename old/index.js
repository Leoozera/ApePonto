const {Client, Intents, MessageEmbed} = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS] })
const funcionarios = ["971506845380386846", "323501959560691712", "307687975993606146", "572137293054214165", "463821733431083018", "487082466977251348", "331123567863529472"]
const canalID = "971505982922432554";

const msgPonto = new MessageEmbed()
    .setColor('#FEE250')
    .setThumbnail('https://apepe.com/wp-content/uploads/elementor/thumbs/logo-branco-apepe-pg9re5qxfzspc9e6cptxrx077il0ojis9gg4d08si8.png')
    .setFooter({text: "Apepê - Funcionários", iconURL: "https://media.discordapp.net/attachments/804350503445987370/963433910627336282/02_09_KENJI_-_SKWIZ_LAB.jpg?width=560&height=659"})
    .addFields({ name: 'Bater ponto no aplicativo', value: 'Não se esqueçam' })
    .setTimestamp()

client.login('OTcxNTA2ODQ1MzgwMzg2ODQ2.YnLgQQ.UfHRqrdeZqSiw65FBi8JLdWWoAg')

client.on('ready', async () => {
    console.log('*BOT Iniciado*');

    client.user.setActivity("O Antonny ja reclamou do ar condicionado hoje?", {
        type: "STREAMING",
        url: "https://www.youtube.com/bicicleta_com_rodinha"
      });

    let canal = client.channels.cache.get(canalID)
    await canal.bulkDelete(100)

    setInterval(function(){
        checarHorario();
    }, 1000) // 60 minutos (1000 * 60 * 60)
})

var arrayCheck = []; 

async function checarHorario() {
    let horario = new Date().toLocaleTimeString(); 
    // console.log(horario)
    if(horario.startsWith('19')) {
        enviarMensagem("entrada");

    }   

    if(horario.startsWith('18') /*&& horario.includes('PM')*/) {
        enviarMensagem("saida");
    }
}


async function enviarMensagem(ponto) {
    let dia = new Date().toLocaleDateString();
    let canal = await client.channels.fetch(canalID);
    let checkPoint = await arrayCheck.find(object => object = {dia: dia, ponto: ponto} );

    if(checkPoint == undefined) { 

        let mensagem_ponto = await canal.send({embeds: [msgPonto]});
        await arrayCheck.push({dia: dia, ponto: ponto, idmsg: mensagem_ponto.id});
        await mensagem_ponto.react('👍');

        setTimeout(async function() {
            await checarFuncionarios(mensagem_ponto.id);
        }, 5000)

        return;
    }

    if(checkPoint != undefined) return; 
}

async function checarFuncionarios(idmsg) {
    let msg = await client.channels.cache.get(canalID).messages.fetch(idmsg);
    let users = await msg.reactions.resolve('👍').users.fetch()
    let usersMap = await users.map((user) => user.id);

    await mencionarFuncionarios(usersMap)
}

async function mencionarFuncionarios(usersMap) {
    console.log(usersMap)
    let diferenca = await funcionarios.filter(filtro => !usersMap.includes(filtro))
    
    diferenca.forEach(funcionario => {
        client.channels.cache.get(canalID).send(`<@${funcionario}> - Não relatou se bateu o ponto`)
    })
}

