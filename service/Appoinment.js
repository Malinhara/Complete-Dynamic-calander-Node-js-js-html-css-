const connection = require('../Db');

exports.createappoinment = async (req, res) => {
  const { title, telephone, address, start, end, backgroundColor,status, employee_id, customer_id, services } = req.body;
  
  // Insert the new appointment into the appointments table
  const insertEventQuery = `INSERT INTO appointments (title, telephone, address, start, end, backgroundColor,status, employee_id, customer_id) VALUES (?, ?,?,?, ?, ?, ?, ?, ?)`;

  connection.query(insertEventQuery, [title, telephone, address, start, end, backgroundColor,status, employee_id, customer_id], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: 'Error adding event' });
    }
    
    const appointmentId = result.insertId;

    // Insert the associated services into the appointment_services table
    const insertServiceQuery = `INSERT INTO appointment_services (AppointmentID, ServiceID) VALUES (?, ?)`;
    const servicePromises = services.map(serviceId => {
      return new Promise((resolve, reject) => {
        connection.query(insertServiceQuery, [appointmentId, serviceId], (err, result) => {
          if (err) {
            console.log(err);
            reject(err);
          } else {
            resolve(result);
          }
        });
      });
    });

    // Wait for all service insertions to complete
    Promise.all(servicePromises)
      .then(() => {
        res.status(201).json({ message: 'Event added successfully', id: appointmentId });
      })
      .catch(serviceErr => {
        console.log(serviceErr);
        res.status(500).json({ error: 'Error adding services' });
      });
  });
};


exports.getappoinmentByid = async (req, res) => {
 
   const {Id} =req.params;

    try {
        connection.query('SELECT * FROM appointments where employee_id = ? ',[Id], (error, results) => {
            if (error) {
                console.error('Error:', error);
                return res.status(500).json({ error: 'Internal Server Error' });
            }

            if (results.length === 0) {
                return res.status(404).json({ error: 'No events found' });
            }

            
            console.log('Successfully fetched appointments events now:', results);
            return res.status(200).json(results);
        });
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};





exports.getByid = async (req, res) => {
  const { id } = req.params;

  try {
    // Query to fetch the appointment and the associated employee name
    const appointmentQuery = `
      SELECT c.*, e.empName 
      FROM appointments c 
      INNER JOIN employee e ON c.employee_id = e.EmpID 
      WHERE c.id = ?`;

    // Query to fetch the services associated with the appointment
    const servicesQuery = `
      SELECT s.Sid, s.Sname, s.Sprice 
      FROM appointment_services sa 
      INNER JOIN services s ON sa.ServiceID = s.Sid 
      WHERE sa.AppointmentID = ?`;

    // Execute the first query
    connection.query(appointmentQuery, [id], (appointmentError, appointmentResults) => {
      if (appointmentError) {
        console.error('Error fetching appointment:', appointmentError);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      if (appointmentResults.length === 0) {
        return res.status(200).json(null); // Send null when no records are found
      }

      const appointment = appointmentResults[0];

      // Execute the second query to fetch the related services
      connection.query(servicesQuery, [id], (servicesError, servicesResults) => {
        if (servicesError) {
          console.error('Error fetching services:', servicesError);
          return res.status(500).json({ error: 'Internal Server Error' });
        }

        appointment.services = servicesResults; // Add the services to the appointment object

        console.log('Successfully fetched appointment and services:', appointment);
        return res.status(200).json(appointment);
      });
    });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

  





exports.updateAppoinment = async (req, res) => {
  const { id, title, telephone, address, start, end, backgroundColor,status, employee_id, customer_id, services } = req.body;

  try {
      // Update the appointment details
      await connection.query(
          'UPDATE appointments SET title = ?, telephone = ?, address = ?, start = ?, end = ?, backgroundColor = ?,status= ? , employee_id = ?, customer_id = ? WHERE id = ?',
          [title, telephone, address, start, end, backgroundColor,status, employee_id, customer_id, id]
      );

      // Delete existing service records associated with the appointment
      await connection.query('DELETE FROM appointment_services WHERE AppointmentID = ?', [id]);

      // Insert new service records for the appointment
      if (services && services.length > 0) {
          const values = services.map(serviceID => [id, serviceID]);
          await connection.query('INSERT INTO appointment_services (AppointmentID, ServiceID) VALUES ?', [values]);
      }

      return res.status(200).json({ message: 'Appointment updated successfully' });
  } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal Server Error' });
  }
};




exports.deleteCalander = async (req, res) => {
    const { id } = req.params;
    try {
        // If the event exists, proceed with deletion
        await connection.query('UPDATE appointments SET status = 0 WHERE id = ?', [id]);

        return res.status(200).json({ message: 'Deleted successfully' });
    } catch (error) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};





exports.getAllAppointments = async (req, res) => {
  try {
    // Query to fetch all appointments with associated employee and customer names
    const appointmentQuery = `
      SELECT a.*, e.empName, c.CusName as customerName
      FROM appointments a 
      INNER JOIN employee e ON a.employee_id = e.EmpID 
      INNER JOIN customers c ON a.customer_id = c.CusID`;

    // Query to fetch the services associated with the appointments
    const servicesQuery = `
      SELECT s.Sid, s.Sname, s.Sprice, sa.AppointmentID 
      FROM appointment_services sa 
      INNER JOIN services s ON sa.ServiceID = s.Sid`;

    // Execute the first query to fetch all appointments
    connection.query(appointmentQuery, (appointmentError, appointmentResults) => {
      if (appointmentError) {
        console.error('Error fetching appointments:', appointmentError);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      if (appointmentResults.length === 0) {
        return res.status(200).json({ appointmentCount: 0, appointments: [] }); // Send empty array and count
      }

      // Execute the second query to fetch the related services
      connection.query(servicesQuery, (servicesError, servicesResults) => {
        if (servicesError) {
          console.error('Error fetching services:', servicesError);
          return res.status(500).json({ error: 'Internal Server Error' });
        }

        // Create a map of appointment ID to services
        const servicesMap = {};
        servicesResults.forEach(service => {
          if (!servicesMap[service.AppointmentID]) {
            servicesMap[service.AppointmentID] = [];
          }
          servicesMap[service.AppointmentID].push(`${service.Sname} - ${service.Sprice} (ID: ${service.Sid})`);
        });

        // Add the services to each appointment
        appointmentResults.forEach(appointment => {
          appointment.services = servicesMap[appointment.id] ? servicesMap[appointment.id].join(', ') : '';
        });

        console.log('Successfully fetched appointments and services:');
        return res.status(200).json({ appointmentCount: appointmentResults.length, appointments: appointmentResults });
      });
    });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};





exports.getAppointmentscount = async (req, res) => {
  try {
      // Get today's date in yyyy-mm-dd format

  console.log('ok')
      const today = new Date().toISOString().split('T')[0];

      // MySQL query to fetch count of appointments for today
      const sql = `
          SELECT COUNT(*) AS appointmentCount
          FROM appointments
          WHERE DATE(start) = ?;
      `;

      // Execute the query
      connection.query(sql, [today], (err, results) => {
          if (err) {
              console.error('Error fetching today\'s appointments:', err);
              res.status(500).json({ error: 'An error occurred while fetching appointments' });
              return;
          }
          // Extract appointment count from the result
          const appointmentCount = results[0].appointmentCount;
          res.json({ appointmentCount });
      });
  } catch (error) {
      console.error('Error fetching appointment data:', error);
      res.status(500).json({ error: 'An error occurred while fetching appointments' });
  }
};
