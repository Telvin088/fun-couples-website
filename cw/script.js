// Check if user is logged in
function checkAuth() {
    const currentUser = sessionStorage.getItem('currentUser');
    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }
    
    // Add user display to the page
    const container = document.querySelector('.container');
    const userDisplay = document.createElement('div');
    userDisplay.className = 'user-display';
    userDisplay.innerHTML = `
        Logged in as: ${currentUser}
        <button onclick="logout()" style="margin-left: 10px">Logout</button>
    `;
    container.insertBefore(userDisplay, container.firstChild);
}

function logout() {
    sessionStorage.removeItem('currentUser');
    window.location.href = 'login.html';
}

// Call checkAuth immediately
checkAuth();

// Initialize Firebase
const firebaseConfig = {
  // TODO: Replace with your Firebase configuration
  apiKey: "AIzaSyAD6yA_kt9fmyBRkGnn15Q8dSRX3WNMtr0",
  authDomain: "luzlulu-52207.firebaseapp.com",
  databaseURL: "https://luzlulu-52207-default-rtdb.firebaseio.com",
  projectId: "luzlulu-52207",
  storageBucket: "luzlulu-52207.firebasestorage.app",
  messagingSenderId: "481518499058",
  appId: "1:481518499058:web:22edce046078b74a99cc6b",
  measurementId: "G-9ZC4Q6WECV",
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// Memories
const memoriesList = document.getElementById("memoriesList");
const addMemoryForm = document.getElementById("addMemoryForm");
const newMemoryInput = document.getElementById("newMemory");

db.ref("memories").on("value", (snapshot) => {
  memoriesList.innerHTML = "";
  const memories = snapshot.val();
  if (memories) {
    Object.entries(memories)
      .sort((a, b) => new Date(b[1].date) - new Date(a[1].date))
      .forEach(([key, memory]) => {
        const li = document.createElement("li");
        li.innerHTML = `
          <div class="memory-content">
            <div class="memory-header">
              <span class="author-tag">${memory.author || "Anonymous"}</span>
            </div>
            <p>${memory.text}</p>
          </div>
        `;
        li.className = "fade-in";
        memoriesList.appendChild(li);
      });
  }
});

addMemoryForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = newMemoryInput.value.trim();
  if (text) {
    db.ref("memories").push({
      text: text,
      date: new Date().toISOString(),
      author: sessionStorage.getItem('currentUser')
    });
    newMemoryInput.value = "";
  }
});

// Love Notes
const notesList = document.getElementById("notesList");
const addNoteForm = document.getElementById("addNoteForm");
const newNoteInput = document.getElementById("newNote");

db.ref("notes").on("value", (snapshot) => {
  notesList.innerHTML = "";
  const notes = snapshot.val();
  if (notes) {
    Object.entries(notes)
      .sort((a, b) => b[1].createdAt - a[1].createdAt)
      .forEach(([key, note]) => {
        const div = document.createElement("div");
        div.className = "note fade-in";
        div.innerHTML = `
          <div class="note-header">
            <span class="author-tag">${note.author || "Anonymous"}</span>
          </div>
          <div class="note-content">
            ${note.text}
          </div>
        `;
        notesList.appendChild(div);
      });
  }
});

addNoteForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = newNoteInput.value.trim();
  if (text) {
    db.ref("notes").push({
      text: text,
      createdAt: Date.now(),
      author: sessionStorage.getItem('currentUser')
    });
    newNoteInput.value = "";
  }
});

// Bucket List
const bucketList = document.getElementById("bucketList");
const addBucketItemForm = document.getElementById("addBucketItemForm");
const newBucketItemInput = document.getElementById("newBucketItem");

db.ref("bucketList").on("value", (snapshot) => {
  bucketList.innerHTML = "";
  const items = snapshot.val();
  if (items) {
    Object.entries(items)
      .sort((a, b) => a[1].createdAt - b[1].createdAt)
      .forEach(([key, item]) => {
        const li = document.createElement("li");
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = item.completed;
        checkbox.addEventListener("change", () => {
          db.ref(`bucketList/${key}`).update({ completed: checkbox.checked });
        });
        const span = document.createElement("span");
        span.textContent = item.text;
        if (item.completed) {
          span.style.textDecoration = "line-through";
          span.style.color = "#888";
        }
        li.appendChild(checkbox);
        li.appendChild(span);
        li.className = "fade-in";
        bucketList.appendChild(li);
      });
  }
});

addBucketItemForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = newBucketItemInput.value.trim();
  if (text) {
    db.ref("bucketList").push({
      text: text,
      completed: false,
      createdAt: Date.now(),
    });
    newBucketItemInput.value = "";
  }
});

// Photo Album
const photoGallery = document.getElementById("photoGallery");
const photos = [
  { src: "https://via.placeholder.com/300x200", width: 3, height: 2 },
  { src: "https://via.placeholder.com/300x200", width: 3, height: 2 },
  { src: "https://via.placeholder.com/300x200", width: 3, height: 2 },
  { src: "https://via.placeholder.com/300x200", width: 3, height: 2 },
];

photos.forEach((photo) => {
  const img = document.createElement("img");
  img.src = photo.src;
  img.alt = "Couple photo";
  img.className = "fade-in";
  photoGallery.appendChild(img);
});

// Countdown Timer
const countdownTimer = document.getElementById("countdownTimer");
const now = new Date();
const targetDate = new Date(now.getTime() + (7 * 24 * 60 * 60 * 1000)); // 7 days from now

function updateCountdown() {
  const currentTime = new Date().getTime();
  const distance = targetDate - currentTime;

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  countdownTimer.textContent = `${days}d ${hours}h ${minutes}m ${seconds}s`;
}

setInterval(updateCountdown, 1000);
updateCountdown();
