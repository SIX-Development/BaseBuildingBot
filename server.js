import express from 'express';
import { MessageEmbed } from 'discord.js';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();
function generateEmbed(title, description, color, arrFieldNames, arrFieldValues) {
    return new Promise((resolve) => {
        if (typeof (arrFieldNames) != 'undefined') {
            if (arrFieldNames.length == arrFieldValues.length) {
                const response = new MessageEmbed()
                    .setColor(color)
                    .setTitle(title)
                    .setDescription(description);
                for (var i = 0; i < arrFieldNames.length; i++) {
                    response.addField(arrFieldNames[i], arrFieldValues[i]);
                }
                resolve(response);
            }
        } else {
            const response = new MessageEmbed()
                .setTitle(title)
                .setDescription(description);
            resolve(response);
        }
    });
}


export const startServer = client => {
    const app = express();
    app.use(express.json());
    app.use(express.urlencoded({
        extended: true
    }));
    app.use(express.static(path.join(path.dirname(fileURLToPath(import.meta.url)), 'public')));
    app.set('view engine', 'ejs');


    app.get('/', async (_, res) => {
        const title = 'Home';
        var guildCount = await client.guilds.fetch();
        guildCount = guildCount.size;
        res.render('pages/index', {
            title: title,
            guildCount: guildCount
        });
    });
    app.get('/api', async (_, res) => {
        res.redirect('/');
    });
    app.post('/api', async (req, res) => {
        const data = req.body;
        // console.log(data)
        const auth = data.auth;

        if (process.env.AUTHORIZATION === auth) {
            const user = data.userid;
            const title = data.title;
            const message = data.message;
            const color = data.color;
            const fieldTitles = data.fieldTitles;
            const fieldValues = data.fieldValues;
            const member = await client.users.fetch(user);

            const response = await generateEmbed(title, message, color, fieldTitles, fieldValues);
            member
                .createDM()
                .then((DMChannel) => {
                    DMChannel
                        .send({ embeds: [response] })
                        .catch(err => console.log(err, `Error with ${member}, Could not send DM, member has messages from server member's disabled`));
                });
            res.sendStatus(200);
        } else {
            res.sendStatus(403);
        }

    });

    app.use('/', router);
    return app;
};