

const firebaseConfig = {
    apiKey: "AIzaSyDPW9PvCnT2MJKQvqW8W93CgHAPjnsgOY8",
    authDomain: "at-prp.firebaseapp.com",
    projectId: "at-prp",
    storageBucket: "at-prp.firebasestorage.app",
    messagingSenderId: "737228081010",
    appId: "1:737228081010:web:88b9f02d6fca760398bfeb"
};


const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

const ADMIN_EMAIL = "admin@pilani.bits-pilani.ac.in";

function signIn() {
    const provider = new firebase.auth.GoogleAuthProvider();
    provider.setCustomParameters({ hd: "pilani.bits-pilani.ac.in" });
    auth.signInWithPopup(provider).then((result) => {
        const user = result.user;
        if (!user.email.endsWith("@pilani.bits-pilani.ac.in")) {
            alert("Only BITS Pilani email allowed.");
            auth.signOut();
            return;
        }
        document.getElementById("attendance-section").style.display = "block";
        if (user.email === ADMIN_EMAIL) {
            document.getElementById("admin-section").style.display = "block";
        }
    });
}

function markAttendance() {
    const name = document.getElementById("name").value.trim();
    const roll = document.getElementById("roll").value.trim();
    if (!name || !roll) return alert("Enter all fields");

    const uid = auth.currentUser.uid;
    const email = auth.currentUser.email;
    const docRef = db.collection("attendance").doc(uid);
    docRef.get().then(doc => {
        if (doc.exists) {
            alert("Already marked attendance.");
        } else {
            docRef.set({
                name, roll, email,
                time: new Date().toISOString()
            }).then(() => alert("Attendance marked"));
        }
    });
}

function downloadCSV() {
    db.collection("attendance").get().then(snapshot => {
        let csv = "Name,Roll,Email,Time\n";
        snapshot.forEach(doc => {
            const data = doc.data();
            csv += `${data.name},${data.roll},${data.email},${data.time}\n`;
        });
        const blob = new Blob([csv], { type: 'text/csv' });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "attendance.csv";
        link.click();
    });
}
