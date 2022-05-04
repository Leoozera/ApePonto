/*
Amarelo: FEE250
Claro: 575759
Escuro 434345
*/


const { MessageEmbed } = require('discord.js');

const msgPonto = new MessageEmbed()
    .setColor('#FEE250')
    .setImage('https://www.google.com/url?sa=i&url=https%3A%2F%2Fmanezinhonews.com.br%2Fnoticia%2F6943%2Fskr-construtora-em-sao-paulo-expande-fronteiras-e-amplia-experiencia-de-morador-com-apepe&psig=AOvVaw1PXBv_rfxGJTGTmUJaBNpS&ust=1651792953590000&source=images&cd=vfe&ved=0CAwQjRxqFwoTCPjm7bP-xvcCFQAAAAAdAAAAABAD')
    .setTitle('Aviso')
    .setAuthor({name: "Amigo do KENJI", iconURL: "https://media.discordapp.net/attachments/804350503445987370/963433910627336282/02_09_KENJI_-_SKWIZ_LAB.jpg?width=560&height=659"})
    .addFields({ name: 'Bater ponto', value: 'Não se esquecam' })
    .setDescription('Apepê - Funcionários')
    .setTimestamp()