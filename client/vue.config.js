module.exports = {
    devServer:{
        proxy:{
            '^/api':{
                target:'http://127.0.0.1:3334',
            },
            '^/uploads':{
                target:'http://127.0.0.1:3334',
            }
        },
        // disableHostCheck: true,
        // public: 'http://repairs.rest38.ru/',
    }
}