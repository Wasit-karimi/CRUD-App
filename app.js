// Global variables
const form = document.getElementById("form");
const list = document.getElementById("list");
const submit = document.getElementById("submit");
const div = document.getElementById("form-submit-container");

// Loads the users from localStorage
function getUsers() {
  const users = loader()
  list.innerHTML = "";

  users.forEach((user) => {
    const tr = document.createElement("tr");
    tr.className =
      "w-full px-2 py-1 my-4 rounded-md shadow-md text-xs md:text-lg text-center cursor-pointer hover:bg-gray-600 duration-200 transition-all  group";

    tr.innerHTML = `
                  <td class = "py-2 capitalize">${user.userName}</td>
                  <td>${user.userEmail}</td>
                  <td>${user.userAddress}</td>
                  <td class="relative">
                  <div class="absolute right-2 lg:right-10 top-1/2 -translate-y-1/2  h-[70%] px-2 flex gap-1 justify-center items-center shadow-md">
                  <i class="bi bi-trash2 group-hover:text-gray-400 hover:text-gray-200 duration-200 transition-all" data-id = "${user.id}"></i>
                  <i class="bi bi-pen group-hover:text-gray-400 hover:text-gray-200 duration-200 transition-all" data-id = "${user.id}"></i></div>
                  </td>
  `;

    list.appendChild(tr);
  });
}

function loader() {
  return  JSON.parse(localStorage.getItem("users")) || []
}

function saveUsers(users) {
  localStorage.setItem("users", JSON.stringify(users))
}

// Loads all users after rendering DOM
window.addEventListener("DOMContentLoaded", getUsers);

// Add eventListener for adding user
form.addEventListener("submit", (e) => {
  e.preventDefault();

  // Instance of FormData
  const formdata = new FormData(form);

  // Gets form fields
  const name = formdata.get("name").trim();
  const email = formdata.get("email").trim();
  const address = formdata.get("address").trim();

  // Validates empty fields
  if (!name) return alert("name is required");
  if (!email) return alert("email is required");
  if (!address) return alert("address is required");

  // Loads array of users from localStorage if exists otherwise initiate empty array
  let users = loader()

  // Gets the edit id if the form is in update situation
  const editId = form.getAttribute("data-edit-id");

  // Checks if there is an edit id update the user with that specific id
  if (editId) {
    users = users.map((user) =>
      user.id == editId
        ? { ...user, userName: name, userEmail: email, userAddress: address }
        : user
    );

    alert("user has been updated");

    // Remove edit id after finishing the update
    form.removeAttribute("data-edit-id");

    // Changes the submit button text
    submit.value = "Add User";
  } else {
    // If there is no edit id then create new object of the user
    let user = {
      id: Date.now(),
      userName: name,
      userEmail: email,
      userAddress: address,
    };

    // And push it in users array
    users.push(user);

    // Remove edit id after finishing the update
    form.removeAttribute("data-edit-id");

    // Changes the submit button text
    submit.value = "Add User";
  }

  // log for testing (optional)
  console.log(users);

  // Store the array back to the localStorage
  saveUsers(users)

  // And reload the page
  getUsers();

  // Then reset the form
  form.reset();
});

// After creating the user we can add functions to the buttons but its not the ideal way we should use eventDelegation concept so add the eventListener to th list
list.addEventListener("click", (e) => {

  // Load the data from localStorage again
  let users = loader()

  // See if the target is remove button
  if (e.target.classList.contains("bi-trash2")) {
    // Store the id of that specific user thats been passed through the id attribute
    let userId = Number(e.target.dataset.id);

    console.log(e.target.dataset)

    // Check if the user confirm deletion and the remove it using filter method save the array in the localStorage and load the page again
    if (confirm("Are You Sure ?")) {
      users = users.filter((user) => user.id !== userId);
      saveUsers(users)
      getUsers();
    }
  }

  // See if the target is update button
  if (e.target.classList.contains("bi-pen")) {
    // Get the id of that user
    let userId = Number(e.target.dataset.id);

    // Find it
    const user = users.find((user) => user.id === userId);

    if (!user) return alert("User not found");

    // Populate the form using the user info
    form.elements["name"].value = user.userName;
    form.elements["email"].value = user.userEmail;
    form.elements["address"].value = user.userAddress;

    // Set id to form for defining state of form wether its in update situation or creat situation
    form.setAttribute("data-edit-id", userId);

    // Change the submit button text to "Save"
    submit.value = "Save";

    console.log(userId);
  }
});

