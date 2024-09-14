const express = require('express');
const bodyParser = require('body-parser');
require('../Saloon/Db')
const serviceManage=require('../Saloon/service/serviceManage')
const employeeService=require('../Saloon/service/employee')
const appoinmentService=require('../Saloon/service/Appoinment')
const customerService=require('../Saloon/service/customer')




const app = express();
const port = 3001;


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));




app.use(express.static('Public'));
app.set('views', './Views');
app.set('view engine', 'ejs');




// Middleware



app.get('/Dashboard',(req, res) => {
    res.render('Dashboard');
});




const Services = express.Router();
const AdminRouter = express.Router();
const Products = express.Router();
const priceManage =express.Router();
const Appoinment =express.Router();
const customer =express.Router();



app.use('/product',Products);
Products.get('/view/:Pid', serviceManage.getproductByid);
Products.get('/view', serviceManage.getAllproducts);



app.use('/service',Services);
Services.get('/view', serviceManage.getAllservices);
Services.get('/view/:Sid', serviceManage.getByidservice);



app.use('/pricemanage',priceManage);
priceManage.get('/view',serviceManage.fetchPriceManageData);
priceManage.get('/view/:id',serviceManage.fetchPriceManageDataByid);
priceManage.get('/view/price/:id',serviceManage.fetchEmployeeDataByid);


app.use('/appoinment',Appoinment);
Appoinment.post('/add',appoinmentService.createappoinment);
Appoinment.get('/count',appoinmentService.getAppointmentscount);
Appoinment.get('/view',appoinmentService.getAllAppointments);
Appoinment.put('/update',appoinmentService.updateAppoinment);
Appoinment.delete('/delete/:id',appoinmentService.deleteCalander);
Appoinment.get('/view/:id',appoinmentService.getByid);
Appoinment.get('/data/:Id',appoinmentService.getappoinmentByid);



app.use('/employee',AdminRouter);
AdminRouter.get('/view/:EmpID', employeeService.getByid);
AdminRouter.get('/view',employeeService.getAll);
AdminRouter.get('/search',employeeService.getByName);
AdminRouter.get('/suggestions',employeeService.getSuggestion);


app.use('/customer',customer);
customer.get('/view',customerService.viewCustomer);
customer.get('/view/:id',customerService.viewCustomerbyid);




// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

