'use strict'
const Mail = use('Mail')

class AntrekotController {


    async create ({ request }) {

        const order = request.all().order
        const products =this.makeProductString(request.all().products)
        let earlyText = '';
        const emailTo = 'delivery@pho-me.ru';
        let payment = 'Тип оплаты: наличные';

        if (order.payment === '2') {
            payment = 'Тип оплаты: карта'
        }
        if (order.early) {
            earlyText = '' +
                'Как можно раньше!!!!'
        }
        let list = `
        Имя: ${order.name}
        Телефон: ${order.phone}
        ${payment}
        Промокод: ${order.promocode}
        Приборов: ${order.forks}
        Адрес: ${order.address} кв. ${order.apartment}
        Время: ${order.time} ${earlyText}\n
        Заказ:
        ${products}
        \n\nКомментарий: ${order.comment}`


        await Mail.raw(list, (message) => {
            message
                .to(emailTo)
                .from('order@antrekotbar.ru')
                .subject('Заказик')
        })


        return 'мяку'
    }

    makeProductString(products){
        let productString = '', all_sum = 0;
        for(let i = 0; i < products.length; i++){
            let summ = products[i].count * products[i].price;
            all_sum = all_sum + summ
            productString = `${productString}
        ${products[i].name}: ${products[i].count } шт ${ summ }`
        }
        productString = `
        ${productString}
        итого ${all_sum}`
        return productString
    }
}

module.exports = AntrekotController
