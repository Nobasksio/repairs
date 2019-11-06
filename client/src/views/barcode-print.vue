<template >
    <div class="print d-print-block" >

        <div  id="print">
            <div class="shcoke_blk" v-for="item in equipments">
                <div class="text-center " >
                    <span>{{item.name}}</span>
                    <div>
                    <barcode :value="item.in_number_uniq"
                             tag="img"
                             :options="{ displayValue: true, width:2, height:70 }"></barcode>
                    </div>
                </div>
            </div>
            </div>


        <div class="d-print-none new_str">
            <v-col>
            <v-btn
                    @click="print()"
                    class="mx-4 print-button "

            >
                Напечатать штрихкоды
            </v-btn>
            </v-col>
        </div>

    </div >
</template >

<script >
    const axios = require('axios');
    import VueBarcode from '@xkeshi/vue-barcode';

    function CallPrint(strid) {
        var prtContent = document.getElementById(strid);

        // var prtCSS = '<link rel="stylesheet" href="/src/assets/print_css.css" type="text/css" />';
        // var WinPrint = window.open('','','left=10,top=10,width=1200,height=800,toolbar=0,scrollbars=1,status=0');
        // WinPrint.document.write('<html><body><div id="print" class="contentpane">');
        // WinPrint.document.write(prtCSS);
        // WinPrint.document.write(prtContent.innerHTML);
        // WinPrint.document.write('</div></body></html>');
        // WinPrint.document.close();
        // WinPrint.focus();
        window.print();
        // WinPrint.close();
        // prtContent.innerHTML=strOldOne;
    }

    export default {
        name: "barcode2",
        components:{
            'barcode':VueBarcode
        },
        props:['equipments'],
        data: () => {
            return {
                tab: null,
                id_page: null,
                photo_dialog:false,

            }
        },
        mounted(){
            this.$parent.drawer = null
        },
        methods: {
            print(){

                CallPrint('print')
            }
        },
        watch: {

        },
        computed: {

        }
    }
</script >

<style scoped >
    .print{

        max-width: 1200px;
    }
    .shcoke_blk{
        padding: 10px 30px;
        float: left;
    }
    .new_str{
        clear: left;
    }

    @media print { /* Стиль для печати */
        .shcoke_blk {
            page-break-inside: avoid;
        }
        /* Блок который нужно отобразить */
        .v-application--wrap{
            display: block;
        }
        .shcoke_blk {
            visibility: visible;
            padding: 20px 30px;
        }
    }
</style >