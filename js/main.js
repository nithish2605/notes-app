let Notes = [];
let btnAdd_notes = document.querySelector('.btn-add');
let MyDialog = document.querySelector('dialog');
let main_container = document.querySelector('.main-container');
let note_title = document.querySelector('#note-title');
let note_desc = document.querySelector('#note-desc');
let btn_close_dialog = document.querySelector('.btn-close-dialog');
let close_dialog = document.querySelector('.close-dialog');
let btn_submit = document.querySelector('.btn-submit');

//To show the dialog
btnAdd_notes.addEventListener('click', () => {
    MyDialog.showModal();
});

//To close the dialog
btn_close_dialog.addEventListener('click', (e) => {
    e.preventDefault();
    MyDialog.close();
});

//To close the dialog
close_dialog.addEventListener('click', () => MyDialog.close());

//To add a note
btn_submit.addEventListener('click', (e) => {
    e.preventDefault();

    let title = note_title.value.trim();
    let desc = note_desc.value.trim();

    let newNote = {
        id: Date.now(),
        title: title,
        desc: desc
    };

    if (title == "" && desc == "") {
        alert("enter all the fields")
    }
    else {
        Notes.push(newNote);
        note_title.value = "";
        note_desc.value = "";
        MyDialog.close();
        localStorage.setItem("notes", JSON.stringify(Notes));
        rendrenotes();
    }
});

function rendrenotes() {
    main_container.innerHTML = "";

    Notes.forEach(Note => {
        main_container.innerHTML += `<div class="note-container">
           <div class = "note-header">
                <h3 class="note-title">${Note.title}</h3>
                <div class="modify-container">
                    <i class="fa-solid fa-pen-to-square" id="edit"></i>
                    <i class="fa-solid fa-trash"></i>
                </div>
            </div>
                <p class="desc">${Note.desc}</p>
        </div>`;
    });
}


document.addEventListener("DOMContentLoaded", () => {
    //To display already added  notes.
    Notes = JSON.parse(localStorage.getItem("notes")) || [];
    rendrenotes();

    //To modify the notes
    var btn_edit = document.querySelector('#edit');
    btn_edit.addEventListener('click', () => {
        // Notes.filter(ele => ele.id === this.id);
        // note_title.innerHTML = this.title;
        MyDialog.showModal();
    });
});

