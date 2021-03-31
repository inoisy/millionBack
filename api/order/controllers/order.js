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
    async create(ctx) {
        // console.log("create -> ctx", ctx.request.body)
        const {
            name,
            phone,
            message,
            email,
            companyName,
            point
            // isTest = false,
        } = ctx.request.body
        // console.log("create -> summa", summa)

        if (!name || !phone) return

        const contentText = `Новый заказ от ${name} \n Телефон: ${phone} \n Email: ${email} \n  Имя: ${name} \n Компания: ${companyName} \n Сообщение: ${message} \n Точка: ${point}  `
        const contentHTML = `<p>Новый заказ от ${name}</p><p>Телефон: ${phone}</p><p>Email: ${email}</p><p>Имя: ${name}</p><p>Компания: ${companyName}</p><p>Сообщение: ${message}</p><p>Точка: ${point}</p>`
        // console.log("🚀 ~ file: order.js ~ line 35 ~ create ~ contentHTML", contentHTML)
        // console.log("create -> busketHtml", busketHtml)
        const data = {
            phone,
            email,
            name,
            message,
            companyName,
            point
        }
        // console.log("create -> data", data)
        let entity = await strapi.services.order.create(data);

        try {
            await strapi.plugins['email'].services.email.send({
                to: process.env.MAIL_TO,
                from: process.env.SMTP_USERNAME,
                subject: `Новый заказ`,
                text: contentText,
                html: contentHTML
            });
        } catch (error) {
            console.log("create -> error", error)
        }
        return sanitizeEntity(entity, {
            model: strapi.models.order
        });
    },

};