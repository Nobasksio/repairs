'use strict'
const Mail = use('Mail')

class TochkaController {


    async createRait({ request }){

        const rait = request.all().rait;
        const ip = request.ips()

        let list = `
        Оценка: ${rait}
    
        `;
        const send = await Mail.raw(list, (message) => {
            message
                .to('aapo@rest38.ru')
                .from('order@antrekotbar.ru')
                .subject('Оценка Суши точка')
        })

        console.log(list)

        return 'спасибо'

    }

    async create ({ request }) {

        const order = request.all().order
        const products =this.makeProductString(request.all().products)
        const time = order.time || '';
        let earlyText = '';
        if (order.early) {
            earlyText = '\r\nКак можно раньше!!!!'
        }
        let list = `Имя: ${order.name}\r\nТелефон: ${order.phone}\r\nАдрес: ${order.address}${earlyText}\r\n
        Время: ${time}\r\n\r\nЗаказ:\r\n ${products}
        \r\n\r\nКомментарий: ${order.comment}`


        await Mail.raw(list, (message) => {
            message
                .to('order@sushitochka.com')
                .from('order@antrekotbar.ru')
                .subject('Заказик')
        })


        return 'мяку'
    }

    makeProductString(products){
        let productString = '', all_sum = 0;
        for(let i = 0; i < products.length; i++){
            let summ = products[i].count * products[i].PROPERTIES.PRICE.VALUE;
            all_sum = all_sum + summ
            productString = `${productString}${products[i].NAME}: ${products[i].count } шт ${ summ }\r\n`
        }
        productString = `${productString} \r\n итого ${all_sum}`
        return productString
    }
}

module.exports = TochkaController
