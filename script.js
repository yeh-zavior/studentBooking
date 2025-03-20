// 🔹 Firebase 設定（請替換 YOUR_FIREBASE_CONFIG）
const firebaseConfig = {
    apiKey: "AIzaSyDBsLGAY5EqJL-yBGpaZ6QuOB1Nj4nDb-s",
    authDomain: "studentbooking-584d1.firebaseapp.com",
    projectId: "studentbooking-584d1",
    storageBucket: "studentbooking-584d1.appspot.com",
    messagingSenderId: "992766354676",
    appId: "YOUR_APP_ID"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// 🔹 Google 登入
function login() {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
}

// 🔹 登出
function logout() {
    auth.signOut();
}

// 🔹 監聽登入狀態
auth.onAuthStateChanged(user => {
    if (user) {
        loadSchedules();
    } else {
        document.getElementById("scheduleList").innerHTML = "";
    }
});

// 🔹 加載可預約時段
function loadSchedules() {
    db.collection("schedules").orderBy("date").onSnapshot(snapshot => {
        let html = "";
        snapshot.forEach(doc => {
            let data = doc.data();
            html += `<p>${data.date} ${data.time} - ${data.bookedCount}/${data.maxCapacity} 人
                     <button onclick="bookAppointment('${doc.id}')">預約</button></p>`;
        });
        document.getElementById("scheduleList").innerHTML = html;
    });
}

// 🔹 預約時段
async function bookAppointment(scheduleID) {
    const user = auth.currentUser;
    if (!user) return alert("請先登入");

    await db.collection("appointments").add({
        studentID: user.uid,
        scheduleID: scheduleID,
        status: "pending",
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });

    alert("預約成功！");
}
