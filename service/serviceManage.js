const connection = require('../Db');
const flatted = require('flatted');



exports.getAllservices = async (req, res) => {
    try {
      connection.query('SELECT * FROM services WHERE status = 1', (error, results) => {
        if (error) {
          console.error('Error:', error);
          return res.status(500).json({ error: 'Internal Server Error' });
        }
        
        if (results.length === 0) {
          return res.status(404).json({ error: ' not found' });
        }
       
        console.log('successfully fetched ');
        return res.status(200).json(results);
      });
    } catch (error) {
      console.error('Error:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  };



  exports.getByidservice = async (req, res) => {
    const Sid = req.params.Sid; // Extract empID from request parameters
  
    try {
      connection.query('SELECT * FROM services WHERE Sid = ?', [Sid], (error, results) => {
        if (error) {
          console.error('Error:', error);
          return res.status(500).json({ error: 'Internal Server Error' });
        }

        if (results.length === 0) {
          return res.status(404).json({ error: 'not found' });
        }
       
        console.log('successfully fetched id');
        return res.status(200).json(results[0]); // Assuming you only expect one result
      });
    } catch (error) {
      console.error('Error:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  };









exports.getproductByid = async (req, res) => {  
    const Pid = req.params.Pid; // Extract empID from request parameters
  
    try {
      connection.query('SELECT * FROM products WHERE Pid = ?', [Pid], (error, results) => {
        if (error) {
          console.error('Error:', error);
          return res.status(500).json({ error: 'Internal Server Error' });
        }
        
        if (results.length === 0) {
          return res.status(404).json({ error: 'not found' });
        }

        const formatDate = (dateStr) => {
          const date = new Date(dateStr);
          const year = date.getFullYear();
          const month = ('0' + (date.getMonth() + 1)).slice(-2);
          const day = ('0' + date.getDate()).slice(-2);
          return `${year}-${month}-${day}`;
      };

      // Format dates in the results
      const formattedResults = results.map(item => {
          return {
              ...item,
              Mtf_date: formatDate(item.Mtf_date),
              Exp_date: formatDate(item.Exp_date)
          };
      });
       
        console.log('successfully fetched id');
        return res.status(200).json(formattedResults[0]); // Assuming you only expect one result
      });
    } catch (error) {
      console.error('Error:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  };



  exports.getAllproducts = async (req, res) => {
    try {
        connection.query('SELECT * FROM products  WHERE status = 1', (error, results) => {
            if (error) {
                console.error('Error:', error);
                return res.status(500).json({ error: 'Internal Server Error' });
            }

            if (results.length === 0) {
                return res.status(404).json({ error: 'Not found' });
            }

            // Function to format date to YYYY-MM-DD
            const formatDate = (dateStr) => {
                const date = new Date(dateStr);
                const year = date.getFullYear();
                const month = ('0' + (date.getMonth() + 1)).slice(-2);
                const day = ('0' + date.getDate()).slice(-2);
                return `${year}-${month}-${day}`;
            };

            // Format dates in the results
            const formattedResults = results.map(item => {
                return {
                    ...item,
                    Mtf_date: formatDate(item.Mtf_date),
                    Exp_date: formatDate(item.Exp_date)
                };
            });

            console.log('Successfully fetched');
            return res.status(200).json(flatted.parse(flatted.stringify(formattedResults)));
        });

    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};













exports.fetchPriceManageData = (req, res) => {
  try {
      // SQL query to fetch data with joins
      const query = `
      SELECT pm.id, e.empName, e.Telephone, s.Sname, pm.servicePrice, p.Pname, pm.Date
      FROM price_manage pm
      JOIN employee e ON pm.empId = e.empId
      JOIN services s ON pm.sid = s.Sid
      JOIN products p ON pm.pid = p.Pid
      WHERE pm.status = 1
  `;
  

      // Execute the query
      connection.query(query, (err, results) => {
          if (err) {
              console.error('Error fetching price_manage data:', err);
              return res.status(500).json({ error: 'Internal Server Error' });
          }

          // Function to format the date
          const formatDate = (dateStr) => {
              const date = new Date(dateStr);
              const year = date.getFullYear();
              const month = ('0' + (date.getMonth() + 1)).slice(-2);
              const day = ('0' + date.getDate()).slice(-2);
              return `${year}-${month}-${day}`;
          };

          // Format dates in the results
          const formattedResults = results.map(item => {
              return {
                  ...item,
                  Date: formatDate(item.Date),
              };
          });

          console.log('Price manage data fetched successfully');
          return res.status(200).json({ data: formattedResults });
      });
  } catch (error) {
      console.error('Error:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
  }
};




exports.fetchPriceManageDataByid = (req, res) => {
  try {
    const id = req.params.id; // Assuming the ID is passed in the request parameters

    // SQL query to fetch data with joins and filter by ID
    const query = `
      SELECT pm.id, e.empId, e.empName, e.Telephone, s.Sid, s.Sname, pm.servicePrice, p.Pid, p.Pname, pm.Date
      FROM price_manage pm
      JOIN employee e ON pm.empId = e.empId
      JOIN services s ON pm.sid = s.Sid
      JOIN products p ON pm.pid = p.Pid
      WHERE pm.id = ?
    `;

    // Execute the query with the ID as a parameter
    connection.query(query, [id], (err, results) => {
      if (err) {
        console.error('Error fetching price_manage data:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      // If the result is empty, return a 404 Not Found response
      if (results.length === 0) {
        return res.status(404).json({ error: 'Price management data not found' });
      }

      // Function to format the date
      const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        const year = date.getFullYear();
        const month = ('0' + (date.getMonth() + 1)).slice(-2);
        const day = ('0' + date.getDate()).slice(-2);
        return `${year}-${month}-${day}`;
      };

      // Format dates in the results
      const formattedResults = results.map(item => {
        return {
          ...item,
          Date: formatDate(item.Date),
        };
      });

      console.log('Price manage update data fetched successfully');
      return res.status(200).json({ data: formattedResults });
    });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};






exports.fetchEmployeeDataByid = (req, res) => {
  try {
      const empId = req.params.id; // Assuming the employee ID is passed in the request parameters
      console.log(`Fetching data for employee ID: ${empId}`);

      const query = `
          SELECT 
              e.EmpId, 
              e.empName, 
              e.Telephone, 
              s.Sid, 
              s.Sname, 
              pm.servicePrice, 
              p.Pid, 
              p.Pname, 
              pm.Date
          FROM 
              price_manage pm
          JOIN 
              employee e ON pm.empId = e.EmpID
          JOIN 
              services s ON pm.sid = s.Sid
          JOIN 
              products p ON pm.pid = p.Pid
          WHERE 
              e.EmpID = ?
      `;

      // Execute the query with the employee ID as a parameter
      connection.query(query, [empId], (err, results) => {
          if (err) {
              console.error('Error fetching data:', err);
              return res.status(500).json({ error: 'Internal Server Error' });
          }

          // If the result is empty, return a 404 Not Found response
          if (results.length === 0) {
              return res.status(404).json({ error: 'No data found for the given employee ID' });
          }

          // Format dates in the results
          const formatDate = (dateStr) => {
              const date = new Date(dateStr);
              const year = date.getFullYear();
              const month = ('0' + (date.getMonth() + 1)).slice(-2);
              const day = ('0' + date.getDate()).slice(-2);
              return `${year}-${month}-${day}`;
          };

          const formattedResults = results.map(item => ({
              ...item,
              Date: formatDate(item.Date),
          }));

          console.log('Data fetched successfully');
          return res.status(200).json({ data: formattedResults });
      });
  } catch (error) {
      console.error('Error:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
  }
};