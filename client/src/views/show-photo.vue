<template >

</template >

<script >
    import HTTTP from '../http';
    export default {
        name: "show-photo",
        props:['photo','dialog_up'],
        data: () => {
            return {
                maaa2:'',
                dialog:this.dialog_up,
                maaa:''
            }
        },
        methods:{
            delete_photo(photo){
                HTTTP().delete('/photo/'+photo.id,
                ).then((response) => {


                    this.$parent.equipment.photo.forEach((item, i, arr)=>{
                        if (item.id == photo.id){
                            this.$parent.equipment.photo.splice(i,1)
                        }
                    })
                    this.photo = {
                        id:0,
                        link:''
                    }
                    this.dialog = false
                })
                    .catch((error) => {
                        console.log(error);

                        this.error_alert = true
                    });
            },
        }
    }
</script >

<style scoped >

</style >