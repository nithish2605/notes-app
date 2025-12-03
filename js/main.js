let Notes = [];
let btnAdd_notes = document.querySelector('.btn-add');
let MyDialog = document.querySelector('dialog');
let main_container = document.querySelector('.main-container');
let note_title = document.querySelector('#note-title');
let note_desc = document.querySelector('#note-desc');
let btn_close_dialog = document.querySelector('.btn-close-dialog');
let close_dialog = document.querySelector('.close-dialog');
let btn_submit = document.querySelector('.btn-submit');

//To display already added  notes when it  is refreshed also
document.addEventListener("DOMContentLoaded", () => {
    Notes = JSON.parse(localStorage.getItem("notes")) || [];
    rendernotes();
});


//To show the dialog
btnAdd_notes.addEventListener('click', () => {
    MyDialog.showModal();
});

//To close the dialog
btn_close_dialog.addEventListener('click', (e) => {
    e.preventDefault();
    ClearAll();
    MyDialog.close();
});

//To close the dialog
close_dialog.addEventListener('click', () => {
    ClearAll();
    MyDialog.close();
});

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
        alert("enter all the fields");
        return;
    }

    if (existing_id) {
        let index = Notes.findIndex(n => n.id == existing_id);
        Notes[index].title = title;
        Notes[index].desc = desc;
        existing_id = null;
    }
    else {
        Notes.push(newNote);
    }
    ClearAll();
    MyDialog.close();
    localStorage.setItem("notes", JSON.stringify(Notes));
    rendernotes();
});

function rendernotes() {
    main_container.innerHTML = "";
    Notes.forEach(Note => {
        main_container.innerHTML += `<div class="note-container">
           <div class = "note-header">
                <h3 class="note-title">${Note.title}</h3>
                <div class="modify-container">
                    <i class="fa-solid fa-pencil" data-id="${Note.id}"></i>
                    <i class="fa-solid fa-trash del" data-id="${Note.id}"></i>
                </div>
            </div>
                <p class="desc">${Note.desc}</p>
        </div>`;
    });
    editnote();

    //To delete a Note
    var del_note = document.querySelectorAll('.del');
    del_note.forEach(note => {
        note.addEventListener('click', () => {
            let id = note.getAttribute('data-id');
            let Indexof_DelId = Notes.findIndex(n => n.id == id);
            Notes.splice(Indexof_DelId, 1);
            localStorage.setItem("notes", JSON.stringify(Notes));
            rendernotes();
        });
    });
}

//To modify the notes
function editnote() {
    var btn_edit = document.querySelectorAll('.fa-pencil');
    btn_edit.forEach(btn => {
        btn.addEventListener('click', () => {
            let id = btn.getAttribute('data-id');
            StartEditNote(id);
        })
    });
}
let existing_id = null;

function StartEditNote(id) {
    existing_id = id;
    let curr_Note = Notes.find(n => n.id == id);
    note_title.value = curr_Note.title;
    note_desc.value = curr_Note.desc;
    MyDialog.showModal();
}

//clearing fields
function ClearAll() {
    note_title.value = "";
    note_desc.value = "";
}
