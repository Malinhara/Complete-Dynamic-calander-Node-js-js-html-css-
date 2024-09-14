const connection = require('../Db');
// const { isAdmin, isCashier, isEmployee } = require('../authMiddleware');





// In your Express.js route file
exports.getAll = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10; // Default limit to 5 if not provided
    const offset = parseInt(req.query.offset) || 0; // Default offset to 0 if not provided
    
    connection.query('SELECT * FROM employee WHERE hide = 1 LIMIT ? OFFSET ?', [limit, offset], (error, results) => {
      if (error) {
        console.error('Error:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      if (results.length === 0) {
        return res.status(404).json({ error: 'Employees not found' });
      }

      console.log('Successfully fetched employees');
      return res.status(200).json(results);
    });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};



exports.getByid = async (req, res) => {  
  const empID = req.params.EmpID; // Extract empID from request parameters

  try {
    connection.query('SELECT * FROM employee WHERE EmpID = ?', [empID], (error, results) => {
      if (error) {
        console.error('Error:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
      
      if (results.length === 0) {
        return res.status(404).json({ error: 'Employee not found' });
      }
     
      console.log('successfully fetched employee id');
      return res.status(200).json(results[0]); // Assuming you only expect one result
    });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};




    exports.getName = async (req, res) => {
        try {
            const { empName } = req.query;
    
            let query = 'SELECT * FROM employee';
            const values = [];
    
            // If empName is provided, add a search condition to the query
            if (empName) {
                query += ' WHERE empName LIKE ?';
                values.push(`%${empName}%`);
            }sss
    
            const result = await Connection.query(query, values);
    
            if (result.length === 0) {
                return res.status(404).json({ error: 'Employee not found' });
            }
    
            console.log('Successfully fetched employees');
            return res.status(200).json(result);
        } catch (error) {
            console.error('Error:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    };



    exports.getByName = async (req, res) => {
      const query = req.query.q;
      if (!query) {
          res.status(400).json({ error: 'Search query is required' });
          return;
      }
      // Perform a search query in the database
      connection.query('SELECT * FROM employee WHERE empName LIKE ? OR Telephone LIKE ?', [`%${query}%`, `%${query}%`], (error, results) => {
          if (error) {
              console.error('Error searching employees:', error);
              res.status(500).json({ error: 'Internal server error' });
              return;
          }
          res.json(results);
      });
  };



  
  exports.getSuggestion = async (req, res) => {
    const query = req.query.q;
    // Query your database for suggestions
    const sql = "SELECT empName FROM employee WHERE empName LIKE ? LIMIT 4";
    connection.query(sql, [`%${query}%`], (error, results) => {
      if (error) {
        console.error('Error fetching suggestions:', error);
        res.status(500).json({ error: 'Internal server error' });
        return;
      }
      const suggestions = results.map(row => row.empName);
      res.json(suggestions);
    });

  }
 

   // employeeController.js



