const taskInput = document.getElementById("taskInput");
const priorityInput = document.getElementById("priority");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const filterButtons = document.querySelectorAll(".filter-btn");
const searchInput = document.getElementById("searchInput");
const themeBtn = document.getElementById("themeBtn");

const totalTasks = document.getElementById("totalTasks");
const progress = document.getElementById("progress");
const urgentTasks = document.getElementById("urgentTasks");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

let currentFilter = "all";
let progressChart;
let totalChart;
let urgentChart;

function saveTasks(){
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTasks(){

  taskList.innerHTML = "";

  let filteredTasks = tasks;

  if(currentFilter === "pending"){
    filteredTasks = tasks.filter(task => !task.completed);
  }

  if(currentFilter === "completed"){
    filteredTasks = tasks.filter(task => task.completed);
  }

  const search = searchInput.value.toLowerCase();

  filteredTasks = filteredTasks.filter(task =>
    task.text.toLowerCase().includes(search)
  );

  filteredTasks.forEach((task,index)=>{

    const li = document.createElement("li");

    li.classList.add("task");

    if(task.completed){
      li.classList.add("completed");
    }

    li.innerHTML = `
      <div class="task-info">
        <span>${task.text}</span>

        <span class="priority ${task.priority.toLowerCase()}">
          Prioridad: ${task.priority}
        </span>
      </div>

      <div class="actions">
        <button class="complete-btn">
          ${task.completed ? "↩️" : "✅"}
        </button>

        <button class="delete-btn">🗑️</button>
      </div>
    `;

    const completeBtn = li.querySelector(".complete-btn");
    const deleteBtn = li.querySelector(".delete-btn");

    completeBtn.addEventListener("click", ()=>{

      task.completed = !task.completed;

      saveTasks();
      renderTasks();

    });

    deleteBtn.addEventListener("click", ()=>{

      tasks.splice(index,1);

      saveTasks();
      renderTasks();

    });

    taskList.appendChild(li);

  });

  updateDashboard();
}

function updateDashboard(){

  totalTasks.textContent = tasks.length;

  const completed = tasks.filter(task => task.completed).length;

  const pending = tasks.length - completed;

  const percentage = tasks.length
    ? Math.round((completed / tasks.length) * 100)
    : 0;

  progress.textContent = percentage + "%";

  const urgent = tasks.filter(task => task.priority === "Alta").length;

  urgentTasks.textContent = urgent;

  createProgressChart(completed, pending);

  createTotalChart(completed, pending);

  createUrgentChart(urgent);
}

function createProgressChart(completed, pending){

  const ctx = document.getElementById("progressChart");

  if(progressChart){
    progressChart.destroy();
  }

  progressChart = new Chart(ctx, {

    type: "doughnut",

    data: {
      labels:["Completadas","Pendientes"],

      datasets:[{
        data:[completed,pending],

        backgroundColor:[
          "#22c55e",
          "#ef4444"
        ]
      }]
    }

  });
}

function createTotalChart(completed, pending){

  const ctx = document.getElementById("totalChart");

  if(totalChart){
    totalChart.destroy();
  }

  totalChart = new Chart(ctx, {

    type:"pie",

    data:{
      labels:["Completadas","Pendientes"],

      datasets:[{
        data:[completed,pending],

        backgroundColor:[
          "#3b82f6",
          "#f59e0b"
        ]
      }]
    }

  });
}

function createUrgentChart(urgent){

  const ctx = document.getElementById("urgentChart");

  if(urgentChart){
    urgentChart.destroy();
  }

  urgentChart = new Chart(ctx, {

    type:"bar",

    data:{
      labels:["Urgentes"],

      datasets:[{
        label:"Cantidad",

        data:[urgent],

        backgroundColor:"#dc2626"
      }]
    },

    options:{
      scales:{
        y:{
          beginAtZero:true
        }
      }
    }

  });
}

function createChart(completed, pending){

  const ctx = document.getElementById("progressChart");

  if(progressChart){
    progressChart.destroy();
  }

  progressChart = new Chart(ctx, {

    type: "doughnut",

    data: {
      labels: ["Completadas", "Pendientes"],

      datasets: [{
        data: [completed, pending],

        backgroundColor: [
          "#16a34a",
          "#dc2626"
        ],

        borderWidth: 2
      }]
    },

    options: {
      responsive: true,

      plugins: {
        legend: {
          position: "bottom"
        }
      }
    }

  });
}

addTaskBtn.addEventListener("click", ()=>{

  const text = taskInput.value.trim();

  if(text === "") return;

  const task = {
    text,
    priority: priorityInput.value,
    completed:false
  };

  tasks.push(task);

  saveTasks();
  renderTasks();

  taskInput.value = "";

});

filterButtons.forEach(button=>{

  button.addEventListener("click", ()=>{

    currentFilter = button.dataset.filter;

    document.querySelector(".active")?.classList.remove("active");

    button.classList.add("active");

    renderTasks();

  });

});

searchInput.addEventListener("input", renderTasks);

themeBtn.addEventListener("click", ()=>{

  document.body.classList.toggle("dark-mode");

});

renderTasks();
