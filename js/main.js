//global declaration
let Notes = JSON.parse(localStorage.getItem("notes")) || [];
let existing_id = null;


//DOM elements
let btnAdd_notes = document.querySelector('.btn-add');
let MyDialog = document.querySelector('dialog');
let main_container = document.querySelector('.main-container');
let note_title = document.querySelector('#note-title');
let note_desc = document.querySelector('#note-desc');
let btn_close_dialog = document.querySelectorAll('.btn-close-dialog');
let btn_submit = document.querySelector('.btn-submit');
let search_input = document.querySelector('.search-bar');

//icon Mapping
const icons = {
    home: '<i class="fa-solid fa-house"></i>',
    work: '<i class="fa-solid fa-business-time"></i>',
    reminders: '<i class="fa-solid fa-bell"></i>'
};

//To display already added  notes when it  is refreshed also
rendernotes();
console.log(Notes);

//To show the dialog
btnAdd_notes.addEventListener('click', () => MyDialog.showModal());

//To close the dialog
btn_close_dialog.forEach(close_btn => {
    close_btn.addEventListener('click', (e) => {
        e.preventDefault();
        ClearAll();
        MyDialog.close();
    });
});

//search functionality 
search_input.addEventListener('input', () => {
    let searchText = search_input.value.toLowerCase().trim();
    if (searchText === "") return rendernotes();
    filterNotes(searchText);
});

note_title.addEventListener('input', () => {

    // let len_noteTitle = note_title.value.length;
    if (note_title.value.length > 18) {
        note_title.value = note_title.value.slice(0, 18);
        alert("Max limit is 18characters");
    }
});

//To add a note
btn_submit.addEventListener('click', (e) => {
    e.preventDefault();

    let title = note_title.value.trim();
    let desc = note_desc.value.trim();

    let selectedCategory = document.querySelector('input[name="category"]:checked');

    if (!title || !desc) return alert("enter all the fields");

    if (!selectedCategory) return alert("please select a category");

    if (existing_id) {
        let index = Notes.findIndex(n => n.id == existing_id);
        Notes[index].title = title;
        Notes[index].desc = desc;
        Notes[index].category = selectedCategory.value;
        existing_id = null;
    }
    else {
        Notes.push({
            id: Date.now(),
            title: title,
            desc: desc,
            category: selectedCategory.value
        });
    }
    storeAndRefresh();
});

function rendernotes() {
    main_container.innerHTML = "";
    console.log("entering");
    // if(Notes.length === 0) return main_container.innerHTML = "<h2 class='error'>You dont have any Notes</h2>";
    Notes.forEach(Note => {
        const icon = icons[Note.category];
        main_container.innerHTML += `<div class="note-container">
           <div class = "note-header">
                <h3 class="note-title">${Note.title}</h3>
                <div class="modify-container">
                    <i class="fa-solid fa-pencil" data-id="${Note.id}"></i>
                    <i class="fa-solid fa-trash del" data-id="${Note.id}"></i>
                </div>
            </div>
                <div class="desc">${Note.desc}</div>
                <div class="category-tag">${icon}${Note.category}</div>
        </div>`;
    });
}


// Edit/Delete
main_container.addEventListener('click', (e) => {
    const del_btn = e.target.closest('.del');
    if (del_btn) {
        const id = del_btn.getAttribute('data-id');
        Notes = Notes.filter(n => n.id != id);
        storeAndRefresh();
    }

    const edit_btn = e.target.closest('.fa-pencil')
    if (edit_btn) {
        const id = edit_btn.getAttribute('data-id');
        StartEditNote(id);
    }
});



// Edit Start
function StartEditNote(id) {
    existing_id = id;
    const note = Notes.find(n => n.id == id);
    note_title.value = note.title;
    note_desc.value = note.desc;
    document.querySelector(`input[name="category"][value="${note.category}"]`).checked = true;
    MyDialog.showModal();
}

function filterNotes(query) {
    let filtered = Notes.filter(n =>
        n.title.toLowerCase().includes(query) ||
        n.desc.toLowerCase().includes(query) ||
        n.category.toLowerCase().includes(query)
    );
    renderFilteredNotes(filtered);
}

//render filtered function
function renderFilteredNotes(filtered) {
    main_container.innerHTML = "";
    filtered.forEach(Note => {
        const icon = icons[Note.category];
        main_container.innerHTML += `<div class="note-container">
           <div class = "note-header">
                <h3 class="note-title">${Note.title}</h3>
                <div class="modify-container">
                    <i class="fa-solid fa-pencil" data-id="${Note.id}"></i>
                    <i class="fa-solid fa-trash del" data-id="${Note.id}"></i>
                </div>
            </div>
                <div class="desc">${Note.desc}</div>
                <div class="category-tag">${icon}${Note.category}</div>
        </div>`;
    });
}

//nav tab displaying based on category
document.querySelector('.tag-tabs').addEventListener('click', (e) => {
    const tabelement = e.target.closest('li');

    if (tabelement) {
        document.querySelectorAll('.tag-tabs li').forEach(t => {
            t.classList.remove('active');
        })
        tabelement.classList.add('active');
        const tabname = tabelement.innerText.toLowerCase().trim();
        if (tabname === "all") rendernotes();
        else filterNotes(tabname);
    }
})


//clearing fields
function ClearAll() {
    note_title.value = "";
    note_desc.value = "";
    document.querySelectorAll('input[name="category"]').forEach(radio => {
        radio.checked = false;
    });

}

function storeAndRefresh() {
    localStorage.setItem("notes", JSON.stringify(Notes));
    ClearAll();
    rendernotes();
    MyDialog.close();
}