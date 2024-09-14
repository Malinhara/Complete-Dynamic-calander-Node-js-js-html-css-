 
 
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
 const userId = urlParams.get('userId');

document.addEventListener('DOMContentLoaded', async function () {
  const calendarEl = document.getElementById('calendar');

  // Remove unnecessary elements
  new bootstrap.Modal(document.getElementById('form'));
  document.getElementById('delete-button');
  new bootstrap.Modal(document.getElementById('delete-modal'));
  document.getElementById('confirm-delete-button');
  document.getElementById('event-form');

  // Define currentEvent variable
  let currentEvent = null;

  const calendar = new FullCalendar.Calendar(calendarEl, {
      plugins: ['dayGrid', 'timeGrid', 'interaction'],
      header: {
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay'
      },
      initialView: 'dayGridMonth',
      allDay: false,
      editable: false, // Disable editing
      selectable: false, // Disable selecting
      selectHelper: false,
      unselectAuto: false,
      displayEventTime: true
  });

  calendar.render();

  // Get userId from the URL
 
  

  try {
      // Fetch appointment data based on the user ID
      const response = await axios.get(`/appoinment/data/${userId}`);
      const eventData = response.data;

      // Clear existing events on the calendar
      calendar.removeAllEvents();

      // Add the fetched appointment data to the calendar
      calendar.addEventSource(eventData);
  } catch (error) {
      console.error('Error fetching appointment data:', error);
  }
});


document.addEventListener('DOMContentLoaded', async function () {
  try {
    // Fetch appointment data based on the user ID
    const response = await axios.get(`/employee/view/${userId}`);
    const eventData = response.data;

    // Update the content of the <p> elements
    document.getElementById('empname').textContent = `Employee Name: ${eventData.empName}`;
    document.getElementById('contact').textContent = `Employee Contact: ${eventData.Telephone}`;
  } catch (error) {
    console.error('Error fetching appointment data:', error);
  }
});



