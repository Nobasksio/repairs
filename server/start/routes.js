'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.on('/').render('welcome').middleware('auth')

Route.get('/api/test', ()=>{
    return {massage:"test_ok"}
})

Route.post('/api/register','UserController.register')
Route.post('/api/login','UserController.login')

Route.get('/api/equipments', 'EquipmentController.list')
Route.post('/api/equipment', 'EquipmentController.create').middleware('auth');
Route.post('api/equipment/checknumber', 'EquipmentController.checkNumber')
Route.get('/api/equipment/:id', 'EquipmentController.equipment')
Route.delete('/api/equipment/:id', 'EquipmentController.delete')

Route.get('/api/repair', 'RepairController.list')
Route.post('/api/repair', 'RepairController.create')
Route.get('/api/repair/:id', 'RepairController.repair')
Route.delete('/api/repair/:id', 'RepairController.delete')

Route.get('/api/transfer', 'TransferController.list')
Route.post('/api/transfer', 'TransferController.create')
Route.get('/api/transfer/:id', 'TransferController.transfer')
Route.delete('/api/transfer/:id', 'TransferController.delete')


Route.get('/api/department','DepartmentController.list')
Route.post('/api/department','DepartmentController.create')
Route.get('/api/department/tree','DepartmentController.list_tree')
Route.get('/api/department/:id', 'DepartmentController.department')
Route.delete('/api/department/:id','DepartmentController.delete')

Route.post('/api/provider', 'ProviderController.create')
Route.get('/api/provider/:id', 'ProviderController.provider')
Route.delete('/api/provider/:id', 'ProviderController.delete')

Route.get('/api/lists','ListController.main')



Route.post('/api/type','TypeEqController.create')
Route.get('/api/group/:id','TypeEqController.group')
Route.delete('/api/group/:id','TypeEqController.delete')

Route.post('/api/upload_photo/:type', 'EquipmentController.upload')
Route.delete('/api/photo/:id', 'EquipmentController.delete_photo')

Route.post('/api/inventory','InventoryController.create')
Route.get('/api/inventory','InventoryController.list')