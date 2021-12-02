import { MessageEmbed } from 'discord.js';

export function generateEmbed(title, description, color, arrFieldNames, arrFieldValues, footer, footerimg) {
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
                if (typeof (footer) != 'undefined') {
                    response.setFooter(footer, footerimg);
                }
                resolve(response);

            }
        } else {
            const response = new MessageEmbed()
                .setTitle(title)
                .setDescription(description);
            if (typeof (footer) != 'undefined') {
                response.setFooter(footer, footerimg);
            }
            resolve(response);
        }

    });
}