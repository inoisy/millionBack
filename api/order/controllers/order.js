'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/3.0.0-beta.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */
const {
    parseMultipartData,
    sanitizeEntity
} = require('strapi-utils');

module.exports = {
    /**
     * Create a record.
     *
     * @return {Object}
     */
    // async find(ctx) {
    //     // console.log("find -> ctx", ctx.query.user)
    //     // console.log("find -> ctx.query", ctx.state.user.id)
    //     let entities;
    //     if (!ctx.state || !ctx.state.user || !ctx.state.user.id) {
    //         return ctx.unauthorized(`You can't get this entry`);
    //     }


    //     if (ctx.query._q) {

    //         entities = await strapi.services.order.search({
    //             ...ctx.query,
    //             user: ctx.state.user.id
    //         });
    //     } else {
    //         entities = await strapi.services.order.find({
    //             ...ctx.query,
    //             user: ctx.state.user.id
    //         });
    //     }

    //     return entities.map(entity => sanitizeEntity(entity, {
    //         model: strapi.models.order
    //     }));
    // },
    async create(ctx) {
        // console.log("create -> ctx", ctx.request.body)
        const {
            name,
            phone,
            message,
            email,
            isTest = false,
        } = ctx.request.body
        // console.log("create -> summa", summa)

        if (!name || !phone) return

        const contentText = `Новый заказ от ${name} \n Телефон: ${phone} \n Имя: ${name} \n Сообщение: ${message} `
        const contentHTML = `<p>Новый заказ от ${name}</p><p>Телефон: ${phone}</p><p>Имя: ${name}</p><p>Сообщение: ${message}</p>`
        // console.log("create -> busketHtml", busketHtml)
        const data = {
            phone,
            email,
            name,
            message,
        }
        console.log("create -> data", data)
        let entity = await strapi.services.order.create(data);
        // if (!isTest) {
        try {
            await strapi.plugins['email'].services.email.send({
                to: "inoisy@bk.ru",
                from: "noreply@prodaem-kolbasu.ru",
                subject: `Новый заказ`,
                text: contentText,
                html: contentHTML
            });
        } catch (error) {
            console.log("create -> error", error)
        }
        // }

        return sanitizeEntity(entity, {
            model: strapi.models.order
        });
    },

};