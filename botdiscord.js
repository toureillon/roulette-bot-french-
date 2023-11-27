const Discord = require('discord.js');
const sqlite3 = require('sqlite3').verbose();
const client = new Discord.Client();
const db = new sqlite3.Database('database.db'); //  'database.db' --> nom de votre base de données SQLite  (jsp)


const prefix = '!'; // Préfixe des commandes du bot

const xpMin = 3; // XP minimum par message
const xpMax = 9; // XP maximum par message
const levelXPBase = 100; // XP de base pour atteindre le niveau 1
const levelXPMultiplier = 1.5; // Multiplicateur d'XP nécessaire pour chaque niveau supplémentaire

// Salon prédéfini pour les messages de niveaux
const levelChannelID = 'YOUR_LEVEL_CHANNEL_ID';
const rouletteChannelID = 'YOUR_ROULETTE_CHANNEL_ID';

// Rôles de récompense par niveau
const levelRoles = {
  5: '1144011497014567035',
  10: '1144011739508265121',
  15: '1144011860782350476',
  20: '1144012000662405230',
  25: '1144012287083020368',
  30: '1144012154152943758',
  40: '1144012398106263603',
  50: '1144012579669299373',
  // Ajoutez d'autres niveaux et rôles ici
};

client.on('ready', () => {
  console.log(`Connecté en tant que ${client.user.tag}`);
});

client.on('message', (message) => {
  // Vérifiez si le message provient d'un bot ou n'a pas le préfixe
  if (message.author.bot || !message.content.startsWith(prefix)) return;

  // Séparez la commande et les arguments
  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  if (command === 'xp') {
    // Générez un montant aléatoire d'XP par message
    const xpGained = Math.floor(Math.random() * (xpMax - xpMin + 1)) + xpMin;

    // Calculez le niveau actuel de l'utilisateur
    const userXP = /* récupérez l'XP de l'utilisateur depuis la base de données */;
    let userLevel = 1;
    let xpToNextLevel = levelXPBase;

    while (userXP >= xpToNextLevel) {
      userXP -= xpToNextLevel;
      userLevel++;
      xpToNextLevel = Math.floor(xpToNextLevel * levelXPMultiplier);
    }

    // Mettez à jour l'XP de l'utilisateur dans la base de données
 

    // Vérifiez si l'utilisateur a gagné un niveau
    if (userLevel > 1 && levelRoles[userLevel]) {
      const role = message.guild.roles.cache.get(levelRoles[userLevel]);
      if (role) {
        // Ajoutez le rôle de récompense au membre
        message.member.roles.add(role);
        message.channel.send(`Félicitations, vous avez atteint le niveau ${userLevel} et obtenu le rôle ${role.name} !`);
      }
    }

    // Enregistrez le montant d'XP gagné pour l'utilisateur
    message.channel.send(`Vous avez gagné ${xpGained} XP.`);
    // Mettez à jour l'XP de l'utilisateur dans la base de données
  }

  if (command === 'roulette') {
    if (message.channel.id !== 1146550010222219405) {
      message.reply('Vous ne pouvez jouer à la roulette que dans le salon approprié.');
      return;
    }

    // Logique de la roulette (à implémenter)

  // Générez un nombre aléatoire entre 0 et 1
  const rouletteResult = Math.random();

  // Chance de gagner à la roulette 
  const winChance = 0.6;

  if (rouletteResult <= winChance) {
    // L'utilisateur a gagné à la roulette
    const xpWon = Math.floor(Math.random() * 10) + 1; // Gagnez entre 1 et 10 XP

    // Mettez à jour l'XP de l'utilisateur dans la base de données
       // Mettez à jour l'XP de l'utilisateur dans la base de données (ajoutez XP gagné)
    db.run(`UPDATE users SET xp = xp + ? WHERE discord_id = ?`, [xpWon, message.author.id], (err) => {
      if (err) {
        console.error(err);
      } else {
        message.reply(`Vous avez gagné à la roulette et obtenu ${xpWon} XP !`);
      }
    });
  } else {

    message.reply(`Vous avez gagné à la roulette et obtenu ${xpWon} XP !`);
  } else {
    
    // L'utilisateur a perdu à la roulette
    const xpLost = Math.floor(Math.random() * 10) + 1; // Perdez entre 1 et 8 XP

    // Mettez à jour l'XP de l'utilisateur dans la base de données (soustrayez XP perdu)
    db.run(`UPDATE users SET xp = xp - ? WHERE discord_id = ?`, [xpLost, message.author.id], (err) => {
      if (err) {
        console.error(err);
      } else {
        message.reply(`Vous avez perdu à la roulette et perdu ${xpLost} XP.`);
      }
    });
  }

    message.reply(`Vous avez perdu à la roulette et perdu ${xpLost} XP.`);
  }

  // Mettez à jour le cooldown de la roulette pour l'utilisateur
  message.member.lastRouletteTime = Date.now(); // Assurez-vous d'ajouter cette propriété à l'objet 'message.member'
}


   

    
  }
});

// Connectez le bot à Discord
client.login('YOUR_BOT_TOKEN');
