const connection = require('../Db');



exports.viewCustomer = async (req,res)=>{

    try {
        connection.query('SELECT * FROM customers WHERE status = 1', (error, results) => {
          if (error) {
            console.error('Error:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
          }
          
          if (results.length === 0) {
            return res.status(404).json({ error: ' not found' });
          }

          const formatDate = (dateStr) => {
            const date = new Date(dateStr);
            const year = date.getFullYear();
            const month = ('0' + (date.getMonth() + 1)).slice(-2);
            const day = ('0' + date.getDate()).slice(-2);
            return `${year}-${month}-${day}`;
          };
    
          // Format dates in the results
          const formattedResults = results.map(customer => {
            return {
              ...customer,
             Rdate: customer.Rdate ? formatDate(customer.Rdate) : null, // Ensure Rdate is handled properly
              
            };
    
      
          });
    
         
          console.log('successfully fetched ');
          return res.status(200).json(formattedResults);
        });
      } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

}



exports.viewCustomerbyid = async (req, res) => {
  const cusid = req.params.id;
  
  try {
    connection.query('SELECT * FROM customers WHERE cusID = ?', [cusid], (error, results) => {
      if (error) {
        console.error('Error:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
      
      if (results.length === 0) {
        return res.status(404).json({ error: 'Employee not found' });
      }

      const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        const year = date.getFullYear();
        const month = ('0' + (date.getMonth() + 1)).slice(-2);
        const day = ('0' + date.getDate()).slice(-2);
        return `${year}-${month}-${day}`;
      };

      // Format dates in the results
      const formattedResults = results.map(customer => {
        return {
          ...customer,
         Rdate: customer.Rdate ? formatDate(customer.Rdate) : null, // Ensure Rdate is handled properly
          
        };

  
      });


      return res.status(200).json(formattedResults[0]); // Assuming you only expect one result
    });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};




