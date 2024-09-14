document.addEventListener('DOMContentLoaded', async function () {
  const calendarEl = document.getElementById('calendar');
  const myModal = new bootstrap.Modal(document.getElementById('form'));
  const dangerAlert = document.getElementById('danger-alert');
  const close = document.querySelector('.btn-close');
  const form = document.getElementById('event-form');
  const deleteButton = document.getElementById('delete-button');
  const deleteModal = new bootstrap.Modal(document.getElementById('delete-modal'));
  const confirmDeleteButton = document.getElementById('confirm-delete-button');
  const statusDropdown = document.getElementById('status_dropdown');

  let currentEvent = null;  // Track the current event being edited

  const calendar = new FullCalendar.Calendar(calendarEl, {
     plugins: ['dayGrid', 'timeGrid', 'interaction'],
     customButtons: {
        customButton: {
           text: 'ADD appoinment',
           click: function () {
              currentEvent = null;  // Reset current event when adding new
              myModal.show();
              const modalTitle = document.getElementById('modal-title');
              const submitButton = document.getElementById('submit-button');
              modalTitle.innerHTML = 'ADD appoinment';
              submitButton.innerHTML = 'Add appoinment';
              submitButton.classList.remove('btn-primary');
              submitButton.classList.add('btn-success');
              deleteButton.style.display = 'none';
              close.addEventListener('click', () => {
                 myModal.hide();
              });
           }
        }
     },
     header: {
        left: 'prev,next today',
        center: 'title',
        right: 'customButton dayGridMonth,timeGridWeek,timeGridDay'
     },
     initialView: 'dayGridMonth',
     allDay: false,
     editable: true,
     selectable: true,
     selectHelper: true,
     unselectAuto: false,
     displayEventTime: true,
     eventClick: async function (info) {
      currentEvent = info.event;  // Set current event when editing
      const editModal = new bootstrap.Modal(document.getElementById('form'));
      const modalTitle = document.getElementById('modal-title');
      const titleInput = document.getElementById('event-title');
      const customerInput = document.getElementById('customerid');
      const contactInput = document.getElementById('event-contact');
      const addressInput = document.getElementById('event-address');
      const employeeName = document.getElementById('event-employee');
      const employeeid = document.getElementById('Aemployeeid');
      const startDateInput = document.getElementById('start-date');
      const endDateInput = document.getElementById('end-date');
      const colorInput = document.getElementById('event-color');
      const submitButton = document.getElementById('submit-button');
      const selectedServicesDropdown = document.getElementById('selectedServices');
  
      const eventDataResponse = await axios.get(`appoinment/view/${info.event.id}`);
      const eventData = eventDataResponse.data;
      console.log(eventData)
      modalTitle.innerHTML = 'Edit appointment';
      titleInput.value = info.event.title;
      customerInput.value = eventData.customer_id;
      contactInput.value = eventData.telephone;
      addressInput.value = eventData.address;
      employeeName.value = eventData.empName;
      employeeid.value = eventData.employee_id;
      startDateInput.value = moment(info.event.start).format('YYYY-MM-DDTHH:mm');
      endDateInput.value = moment(info.event.end).format('YYYY-MM-DDTHH:mm');
      colorInput.value = info.event.backgroundColor;
      statusDropdown.value =  eventData.status;
      submitButton.innerHTML = 'Save Changes';
      deleteButton.style.display = 'block';
      const selectedServices = document.getElementById('selectedServices');
      selectedServices.innerHTML = ''; // Clear existing options
      
      if (eventData && eventData.services && Array.isArray(eventData.services)) {
        eventData.services.forEach(service => {
          const option = document.createElement('option');
          option.value = service.Sid; // Assuming each service has a unique ID
          option.textContent = `${service.Sname} - ${service.Sprice}`;
          selectedServices.appendChild(option);
        });
      }
      

   
    removeServiceButton.addEventListener('click', function() {
        const selectedOptions = selectedServicesDropdown.selectedOptions;
        for (let i = selectedOptions.length - 1; i >= 0; i--) {
            selectedServicesDropdown.remove(selectedOptions[i].index);
        }
    });
  
      editModal.show();
      submitButton.classList.remove('btn-success');
      submitButton.classList.add('btn-primary');

    
       deleteButton.onclick = function () {
          deleteModal.show();
       };
    
       confirmDeleteButton.onclick = async function () {
          try {
             await axios.delete(`appoinment/delete/${info.event.id}`);
             info.event.remove();
             deleteModal.hide();
             editModal.hide();
             form.reset();
             location.reload();
          } catch (error) {
             console.error('Error deleting event:', error);
          }
       };
    }
  });

  calendar.on('select', function (info) {
     // Select handling code
  });

  calendar.render();

  form.addEventListener('submit', async function (event) {
     event.preventDefault();

     const title = document.querySelector('#event-title').value;
     const contact = document.querySelector('#event-contact').value;
     const address = document.querySelector('#event-address').value;
     const customerid =document.querySelector('#customerid').value;
     const employeeid = document.querySelector('#Aemployeeid').value;
     const startDate = document.querySelector('#start-date').value;
     const endDate = document.querySelector('#end-date').value;
     let color = document.querySelector('#event-color').value;
     const status = statusDropdown.value; // Get selected status

     // Set event color based on status
   
     if (status === 'Pending') {
         color = 'green';
     } else if (status === 'Postpone') {
        color = 'blue';
     } else if (status === 'Cancel') {
        color = 'red';
     }
     const selectedServices = [];
     const selectedOptions = document.querySelectorAll('#selectedServices option');
     selectedOptions.forEach(option => {
       selectedServices.push(option.value);
     });



     if (endDate <= startDate) {
        dangerAlert.style.display = 'block';
        return;
     }

     if (currentEvent) {
        // Update existing event
        const updatedEvent = {
           id: currentEvent.id,
           title: title,
           telephone:contact,
           address:address,
           start:startDate,
           end: endDate,
           backgroundColor:color,
           status: status, 
           employee_id:employeeid,
           customer_id:customerid,
           services:selectedServices
        };

        try {
           await axios.put('appoinment/update', updatedEvent);
           currentEvent.setProp('title', updatedEvent.title);
           currentEvent.setStart(updatedEvent.start);
           currentEvent.setEnd(updatedEvent.end);
           currentEvent.setProp('backgroundColor', updatedEvent.backgroundColor);

           myModal.hide();
           dangerAlert.style.display = 'none';
           form.reset();
           location.reload();
        } catch (error) {
           console.error('Error updating event:', error);
        }
     } else {
        // Add new event
        const newEvent = {
          title: title,
          telephone: contact,
          address: address,
          start: startDate,
          end: endDate,
          allDay: false,
          backgroundColor: color,
          status: status, 
          employee_id: employeeid,
          customer_id: customerid,
          services:selectedServices
        };

        try {
           const response = await axios.post('appoinment/add', newEvent);
           calendar.addEvent(response.data); // Assuming the response contains the new event data with an ID
           myModal.hide();
           form.reset();
           location.reload();
        } catch (error) {
           console.error('Error adding event:', error);
        }
     }
  });

  myModal._element.addEventListener('hide.bs.modal', function () {
     dangerAlert.style.display = 'none';
     form.reset();
  });

  document.getElementById('EmployeeForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    // Get the selected employee ID
    const Id = document.getElementById('employeeid').value;

    try {
        // Fetch appointment data based on the selected employee ID
        const response = await axios.get(`/appoinment/data/${Id}`);
        const eventData = response.data;

        // Check if eventData is null or an empty array
        if (eventData === null || eventData.length === 0) {
            alert('No appointments found for the selected employee.');
            location.reload();
        } else {
            // Clear existing events on the calendar
            calendar.removeAllEvents();

            // Add the fetched appointment data to the calendar
            calendar.addEventSource(eventData);
        }
    } catch (error) {
        alert('No appointments found for the selected employee.');
    }
});


});



function moveToSelectedName(dropdown) {
 const selectedOption = dropdown.options[dropdown.selectedIndex];
 const employeeNameInput = document.getElementById('Empsearch');
 const employeeidInput = document.getElementById('employeeid');

 employeeNameInput.value = selectedOption.text.split(' - ')[0]; // Extract name from the combined string
 employeeidInput.value = selectedOption.value;
}

function moveToSelectedEname(dropdown) {
 const selectedOption = dropdown.options[dropdown.selectedIndex];
 const employeeNameInput = document.getElementById('event-employee');
 const employeeidInput = document.getElementById('Aemployeeid');

 employeeNameInput.value = selectedOption.text.split(' - ')[0]; // Extract name from the combined string
 employeeidInput.value = selectedOption.value;

}



document.getElementById('customerForm').addEventListener('submit', function(event) {
 event.preventDefault(); // Prevent the default form submission

 // Get form data
 const cusname = document.getElementById('Cname').value;
 const contact = document.getElementById('Contactnum').value;
 const address = document.getElementById('Caddress').value;
 const Rdate   = document.getElementById('Rdate').value;



 // Create form data object
 const formData = {
    cusName:cusname,
    contact:contact,
    address:address,
    Rdate:Rdate,
 };

 // Send data using Axios
 axios.post('/customer/add', formData)
     .then(function(response) {
         alert('added successfully');
         location.reload();
     })
     .catch(function(error) {
       
         console.error(error);
     });
});





document.addEventListener('DOMContentLoaded', async function() {
 try {
     const response = await axios.get('/customer/view');
     const customers = response.data;

  
     // Populate the dropdown with customer names and contact numbers
     const dropdown = document.getElementById('customer_dropdown1');

     customers.forEach(customer => {
         const option = document.createElement('option');
         option.value = `${customer.cusID} - ${customer.address}`; // Combine ID and address
         option.text = `${customer.cusName} - ${customer.contact}`; // Display name and contact in dropdown
         dropdown.add(option);
     });
 } catch (error) {
     console.error('Error fetching customer data:', error);
 }
});

function moveToSelectedCName(dropdown) {
 const selectedOption = dropdown.options[dropdown.selectedIndex];
 const customerNameInput = document.getElementById('event-title');
 const customeridInput = document.getElementById('customerid');
 const customerAddressInput = document.getElementById('event-address');
 const customercontactInput = document.getElementById('event-contact');

 const selectedValueParts = selectedOption.value.split(' - ');
 customerNameInput.value = selectedOption.text.split(' - ')[0]; // Extract name from the combined string
 customeridInput.value = selectedValueParts[0]; // Extract ID from the value
 customercontactInput.value = selectedOption.text.split(' - ')[1]; // Extract contact number from the value
 customerAddressInput.value = selectedValueParts.slice(1).join(' - '); // Extract and join the address parts
}








 document.addEventListener('DOMContentLoaded', async () => {
 try {
   const response = await axios.get('/employee/view');
   const employees = response.data;

   // Attach event listener to input field for click event
   document.getElementById('Empsearch').addEventListener('click', function() {
     if (this.value.trim() === '') {
       displayAllEmployees(employees);
     }
   });

   // Input event listener for filtering employees
   document.getElementById('Empsearch').addEventListener('input', function() {
     const val = this.value.trim(); // Trim whitespace from input value
     if (val.length === 0) {
       displayAllEmployees(employees);
       return;
     }

     const filteredEmployees = employees.filter(employee =>
       employee.empName.toLowerCase().includes(val.toLowerCase()) ||
       employee.Telephone.includes(val)
     );

     displayFilteredEmployees(filteredEmployees);
   });

   function displayAllEmployees(employees) {
     closeAllLists();
     const listContainer = document.createElement('DIV');
     listContainer.setAttribute('id', 'event-employee-autocomplete-list');
     listContainer.setAttribute('class', 'autocomplete-items');
     document.getElementById('event-employee').parentNode.appendChild(listContainer);

     employees.forEach(employee => {
       const itemDiv = document.createElement('DIV');
       itemDiv.innerHTML = `<strong>${employee.empName}</strong> - ${employee.Telephone}`;
       itemDiv.innerHTML += `<input type='hidden' value='${employee.empName} - ${employee.Telephone}' data-id='${employee.EmpID}'>`;
       itemDiv.addEventListener('click', function() {
         document.getElementById('Empsearch').value = this.getElementsByTagName('input')[0].value;
         document.getElementById('employeeid').value = this.getElementsByTagName('input')[0].getAttribute('data-id');
         closeAllLists();
       });
       listContainer.appendChild(itemDiv);
     });
   }

   function displayFilteredEmployees(filteredEmployees) {
     closeAllLists();
     const listContainer = document.createElement('DIV');
     listContainer.setAttribute('id', 'Empsearch-autocomplete-list');
     listContainer.setAttribute('class', 'autocomplete-items');
     document.getElementById('Empsearch').parentNode.appendChild(listContainer);

     filteredEmployees.forEach(employee => {
       const itemDiv = document.createElement('DIV');
       itemDiv.innerHTML = `<strong>${employee.empName}</strong> - ${employee.Telephone}`;
       itemDiv.innerHTML += `<input type='hidden' value='${employee.empName} - ${employee.Telephone}' data-id='${employee.EmpID}'>`;
       itemDiv.addEventListener('click', function() {
         document.getElementById('Empsearch').value = this.getElementsByTagName('input')[0].value;
         document.getElementById('employeeid').value = this.getElementsByTagName('input')[0].getAttribute('data-id');
         closeAllLists();
       });
       listContainer.appendChild(itemDiv);
     });
   }

   function closeAllLists() {
     const items = document.getElementsByClassName('autocomplete-items');
     for (let i = 0; i < items.length; i++) {
       items[i].parentNode.removeChild(items[i]);
     }
   }

   document.addEventListener('click', function(e) {
     closeAllLists(e.target);
   });
 } catch (error) {
   console.error('Error fetching employee data:', error);
 }
});










document.addEventListener('DOMContentLoaded', async () => {
try {
  const response = await axios.get('/employee/view');
  const employees = response.data;

  // Attach event listener to input field for click event
  document.getElementById('event-employee').addEventListener('click', function() {
    if (this.value.trim() === '') {
      displayAllEmployees(employees);
    }
  });

  // Input event listener for filtering employees
  document.getElementById('event-employee').addEventListener('input', function() {
    const val = this.value.trim(); // Trim whitespace from input value
    if (val.length === 0) {
      displayAllEmployees(employees);
      return;
    }

    const filteredEmployees = employees.filter(employee =>
      employee.empName.toLowerCase().includes(val.toLowerCase()) ||
      employee.Telephone.includes(val)
    );

    displayFilteredEmployees(filteredEmployees);
  });

  function displayAllEmployees(employees) {
    closeAllLists();
    const listContainer = document.createElement('DIV');
    listContainer.setAttribute('id', 'event-employee-autocomplete-list');
    listContainer.setAttribute('class', 'autocomplete-items');
    document.getElementById('event-employee').parentNode.appendChild(listContainer);

    employees.forEach(employee => {
      const itemDiv = document.createElement('DIV');
      itemDiv.innerHTML = `<strong>${employee.empName}</strong> - ${employee.Telephone}`;
      itemDiv.innerHTML += `<input type='hidden' value='${employee.empName} - ${employee.Telephone}' data-id='${employee.EmpID}'>`;
      itemDiv.addEventListener('click', async function() {
        document.getElementById('event-employee').value = this.getElementsByTagName('input')[0].value;
        const empId = document.getElementById('Aemployeeid').value = this.getElementsByTagName('input')[0].getAttribute('data-id');
        document.getElementById('Aemployeeid').value = empId;
        closeAllLists();
        await fetchEmployeeRelatedData(empId);
      });
      listContainer.appendChild(itemDiv);
    });
  }

  function displayFilteredEmployees(filteredEmployees) {
    closeAllLists();
    const listContainer = document.createElement('DIV');
    listContainer.setAttribute('id', 'event-employee-autocomplete-list');
    listContainer.setAttribute('class', 'autocomplete-items');
    document.getElementById('event-employee').parentNode.appendChild(listContainer);

    filteredEmployees.forEach(employee => {
      const itemDiv = document.createElement('DIV');
      itemDiv.innerHTML = `<strong>${employee.empName}</strong> - ${employee.Telephone}`;
      itemDiv.innerHTML += `<input type='hidden' value='${employee.empName} - ${employee.Telephone}' data-id='${employee.EmpID}'>`;
      itemDiv.addEventListener('click', async function() {
        document.getElementById('event-employee').value = this.getElementsByTagName('input')[0].value;
        const empId = document.getElementById('Aemployeeid').value = this.getElementsByTagName('input')[0].getAttribute('data-id');
        document.getElementById('Aemployeeid').value = empId;
        closeAllLists();
        await fetchEmployeeRelatedData(empId);
      });
      listContainer.appendChild(itemDiv);
    });
  }

  function closeAllLists() {
    const items = document.getElementsByClassName('autocomplete-items');
    for (let i = 0; i < items.length; i++) {
      items[i].parentNode.removeChild(items[i]);
    }
  }

  document.addEventListener('click', function(e) {
    closeAllLists(e.target);
  });

  // Populate the dropdown with employee names
  const dropdown = document.getElementById('employee_dropdown');
  const dropdown2 = document.getElementById('employee_dropdown2');
  employees.forEach(employee => {
    const option = document.createElement('option');
    option.value = employee.EmpID; // Assuming each employee has a unique ID
    option.text = `${employee.empName} - ${employee.Telephone}`; // Combine name and telephone
    dropdown.add(option);

    const option2 = document.createElement('option');
    option2.value = employee.EmpID; // Assuming each employee has a unique ID
    option2.text = `${employee.empName} - ${employee.Telephone}`; // Combine name and telephone
    dropdown2.add(option2);
  });

  dropdown2.addEventListener('change', async function() {
    const empId = this.value;
    document.getElementById('Aemployeeid').value = empId;
    await fetchEmployeeRelatedData(empId);
  });

  async function fetchEmployeeRelatedData(empId) {
    try {
      const response = await axios.get(`pricemanage/view/price/${empId}`);
      const { data } = response.data;
      console.log('Employee related data fetched:', data);

      // Clear the existing options in the dropdown
      const dropdown = document.getElementById('service_dropdown');
      dropdown.innerHTML = ''; // Clear existing options

      // Add empty option as the first option
      const emptyOption = document.createElement('option');
      emptyOption.value = ''; // Set value to empty string
      emptyOption.text = 'Select Service'; // Set text to empty string
      dropdown.appendChild(emptyOption);

      // Populate the dropdown with the fetched product names and service prices
      data.forEach(item => {
        const option = document.createElement('option');
        option.value = item.Sid; // Assuming each product has a unique ID
        option.text = `${item.Sname} - ${item.servicePrice}`; // Displaying product name and service price
        option.dataset.sid = item.Sid; // Store service ID in a data attribute
        dropdown.appendChild(option);
      });

      const serviceDropdown = document.getElementById('service_dropdown');
      serviceDropdown.addEventListener('change', function() {
        const selectedOption = this.options[this.selectedIndex];

        // Skip if the default option or an empty value is selected
        if (!selectedOption || selectedOption.value === '') {
          return;
        }

        const selectedServicesDropdown = document.getElementById('selectedServices');

        // Create new option for selected service and price
        const newOption = document.createElement('option');
        newOption.value = selectedOption.value;
        newOption.text = `${selectedOption.text} (ID: ${selectedOption.dataset.sid})`;

        // Append the new option to selectedServices dropdown
        selectedServicesDropdown.appendChild(newOption);
      });

      const removeServiceButton = document.getElementById('removeServiceButton');
      removeServiceButton.addEventListener('click', function() {
          const selectedServicesDropdown = document.getElementById('selectedServices');
          const selectedOptions = selectedServicesDropdown.selectedOptions;
          
          // Remove selected options from selectedServices dropdown
          for (let i = selectedOptions.length - 1; i >= 0; i--) {
              selectedServicesDropdown.remove(selectedOptions[i].index);
          }
      });



    } catch (error) {
      console.error('Error fetching employee-related data:', error);
      alert("Services aren't assigned")
    }
  }
} catch (error) {
  console.error('Error fetching employee data:', error);
}
});










document.addEventListener('DOMContentLoaded', async function() {
 try {
     const response = await axios.get('/customer/view');
     const customers = response.data;

     // Populate the dropdown with employee names
     const dropdown = document.getElementById('customer_dropdown');
    
     customers.forEach(customer => {
         const option = document.createElement('option');
         option.value = customer.cusaId; // Assuming each employee has a unique ID
         option.text = customer.Cname; // Assuming each employee object has a 'name' property
         dropdown.add(option);
     });

 } catch (error) {
     console.error('Error fetching employee data:', error);
 }
});

function moveToSelectedName(dropdown) {
const selectedOption = dropdown.options[dropdown.selectedIndex];
const employeeNameInput = document.getElementById('Empsearch');
const employeeidInput = document.getElementById('employeeid');
//  const employeeTelephoneInput = document.getElementById('employeeTelephone');

employeeNameInput.value = selectedOption.text;
employeeidInput.value = selectedOption.value;
//  employeeTelephoneInput.value = selectedOption.dataset.telephone;
}




document.addEventListener('DOMContentLoaded', async () => {
  try {
      const response = await axios.get('/customer/view');
      const customers = response.data;

      // Attach event listener to input field for click event
      document.getElementById('event-title').addEventListener('click', function() {
          if (this.value.trim() === '') {
              displayAllCustomers(customers);
          }
      });

      // Input event listener for filtering customers
      document.getElementById('event-title').addEventListener('input', function() {
          const val = this.value.trim(); // Trim whitespace from input value
          if (val.length === 0) {
              displayAllCustomers(customers);
              return;
          }

          const filteredCustomers = customers.filter(customer =>
              customer.cusName.toLowerCase().includes(val.toLowerCase()) ||
              customer.contact.includes(val)
          );

          displayFilteredCustomers(filteredCustomers);
      });

      function displayAllCustomers(customers) {
          closeAllLists();
          const listContainer = document.createElement('DIV');
          listContainer.setAttribute('id', 'event-title-autocomplete-list');
          listContainer.setAttribute('class', 'autocomplete-items');
          document.getElementById('event-title').parentNode.appendChild(listContainer);

          customers.forEach(customer => {
              const itemDiv = document.createElement('DIV');
              itemDiv.innerHTML = `<strong>${customer.cusName}</strong> - ${customer.contact}`;
              itemDiv.innerHTML += `<input type='hidden' value='${customer.cusName} - ${customer.contact}' data-id='${customer.cusID}' data-contact='${customer.contact}' data-address='${customer.address}'>`;
              itemDiv.addEventListener('click', function() {
                  document.getElementById('event-title').value = this.getElementsByTagName('input')[0].value;
                  document.getElementById('customerid').value = this.getElementsByTagName('input')[0].getAttribute('data-id');
                  document.getElementById('event-contact').value = this.getElementsByTagName('input')[0].getAttribute('data-contact');
                  document.getElementById('event-address').value = this.getElementsByTagName('input')[0].getAttribute('data-address');
                  closeAllLists();
              });
              listContainer.appendChild(itemDiv);
          });
      }

      function displayFilteredCustomers(filteredCustomers) {
          closeAllLists();
          const listContainer = document.createElement('DIV');
          listContainer.setAttribute('id', 'event-title-autocomplete-list');
          listContainer.setAttribute('class', 'autocomplete-items');
          document.getElementById('event-title').parentNode.appendChild(listContainer);

          filteredCustomers.forEach(customer => {
              const itemDiv = document.createElement('DIV');
              itemDiv.innerHTML = `<strong>${customer.cusName}</strong> - ${customer.contact}`;
              itemDiv.innerHTML += `<input type='hidden' value='${customer.cusName} - ${customer.contact}' data-id='${customer.cusID}' data-contact='${customer.contact}' data-address='${customer.address}'>`;
              itemDiv.addEventListener('click', function() {
                  document.getElementById('event-title').value = this.getElementsByTagName('input')[0].value;
                  document.getElementById('customerid').value = this.getElementsByTagName('input')[0].getAttribute('data-id');
                  document.getElementById('event-contact').value = this.getElementsByTagName('input')[0].getAttribute('data-contact');
                  document.getElementById('event-address').value = this.getElementsByTagName('input')[0].getAttribute('data-address');
                  closeAllLists();
              });
              listContainer.appendChild(itemDiv);
          });
      }

      function closeAllLists() {
          const items = document.getElementsByClassName('autocomplete-items');
          for (let i = 0; i < items.length; i++) {
              items[i].parentNode.removeChild(items[i]);
          }
      }

      document.addEventListener('click', function(e) {
          closeAllLists(e.target);
      });

  } catch (error) {
      console.error('Error fetching customer data:', error);
  }
});