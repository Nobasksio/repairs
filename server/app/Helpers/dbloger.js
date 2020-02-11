
const History = use('App/Models/History')
const Entity = use('App/Models/Entity')


class Dbloger {

    async createRecord(old_state,new_state, user_id, entity_name,entity_id){

        let entity = await Entity.findBy('name', entity_name),
            history = new History();


            if (!entity){
                entity = new Entity();
                entity.name = entity_name;
                await entity.save()
            }

            history.entity = entity.id
            history.old_state = old_state
            history.new_state = new_state
            history.user_id = user_id
            history.entity_id = entity_id
            history.created_at = new Date()

            try {
                await history.save()
                return response.json({name: 'ok',text:'ok' })

            } catch (e){
                return response.json({name: 'error',text:e })

            }
    }


}

module.exports = Dbloger