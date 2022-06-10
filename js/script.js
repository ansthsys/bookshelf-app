/**
 * [
 *    {
 *      id: <int>
 *      bookTitle: <string>
 *      bookWriter: <string>
 *      releasedDate: <int>
 *      isDone: <boolean>
 *    }
 * ]
 */
const books = [];
const bookFilter = [];
const RENDER_EVENT = "render-book";
const RENDER_SEARCH = "looking-for-book";
const SAVED_EVENT = "saved-book";
const STORAGE_KEY = "BOOK_APPS";

function generateId() {
    return +new Date();
}

function generateBookObject(id, bookTitle, bookWriter, releasedDate, isDone) {
    return {
        id,
        bookTitle,
        bookWriter,
        releasedDate,
        isDone
    }
}

function findBook(bookId) {
    for (bookItem of books) {
        if (bookItem.id === bookId) {
            return bookItem
        }
    }
    return null
}

function findBookIndex(bookId) {
    for (index in books) {
        if (books[index].id === bookId) {
            return index
        }
    }
    return -1
}


/**
  * Fungsi ini digunakan untuk memeriksa apakah localStorage didukung oleh browser atau tidak
  * 
  * @returns boolean 
  */
function isStorageExist() /* boolean */ {
    if (typeof (Storage) === undefined) {
        alert("Browser kamu tidak mendukung local storage");
        return false
    }
    return true;
}

/**
 * Fungsi ini digunakan untuk menyimpan data ke localStorage
 * berdasarkan KEY yang sudah ditetapkan sebelumnya.
 */
function saveData() {
    if (isStorageExist()) {
        const parsed /* string */ = JSON.stringify(books);
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent(new Event(SAVED_EVENT));

    }
}

/**
 * Fungsi ini digunakan untuk memuat data dari localStorage
 * Dan memasukkan data hasil parsing ke variabel {@see books}
 */
function loadDataFromStorage() {
    const serializedData /* string */ = localStorage.getItem(STORAGE_KEY);

    let data = JSON.parse(serializedData);

    if (data !== null) {
        for (book of data) {
            books.push(book);
        }
    }

    document.dispatchEvent(new Event(RENDER_EVENT));
}

function makeBook(bookObject) {

    const { id, bookTitle, bookWriter, releasedDate, isDone } = bookObject;

    const judulBuku = document.createElement("h5");
    judulBuku.classList.add("fs-5");
    judulBuku.innerText = bookTitle;

    const penulisBuku = document.createElement("h6");
    penulisBuku.classList.add("fs-6", "text-muted")
    penulisBuku.innerText = bookWriter;

    const tahunBuku = document.createElement("h6");
    tahunBuku.classList.add("fs-6", "text-muted")
    tahunBuku.innerText = releasedDate;

    const removeBook = document.createElement("button");
    removeBook.classList.add("btn", "btn-outline-danger", "btn-sm");
    removeBook.innerText = "Delete Book";
    removeBook.addEventListener("click", function () {
        const confDel = confirm('You want delete "' + bookTitle + '"?');
        if (confDel) {
            deleteBook(id);
        }
    });

    const kiriContainer = document.createElement("div");
    kiriContainer.classList.add("flex-grow-1");
    kiriContainer.setAttribute("id", "kiri");
    kiriContainer.append(tahunBuku, judulBuku, penulisBuku);

    const kananContainer = document.createElement("div");
    kananContainer.classList.add("d-flex", "gap-2", "my-auto");
    kananContainer.setAttribute("id", "kanan");

    if (isDone === true) {
        const undoDone = document.createElement("button");
        undoDone.classList.add("btn", "btn-outline-warning", "btn-sm");
        undoDone.innerText = "Unread Book";
        undoDone.addEventListener("click", function () {
            const confMove = confirm('Move "' + bookTitle + '" to unread shelf?');
            console.log(confMove);
            if (confMove) {
                undoBookFromCompleted(id);
            }
        });

        kananContainer.append(undoDone, removeBook);
    } else {
        const doneRead = document.createElement("button");
        doneRead.classList.add("btn", "btn-outline-primary", "btn-sm");
        doneRead.innerText = "Done Reading";
        doneRead.addEventListener("click", function () {
            const confDone = confirm('Already read "' + bookTitle + '"?');
            if (confDone) {
                addBookToCompleted(id);
            }
        });

        kananContainer.append(doneRead, removeBook);
    }

    const listContainer = document.createElement("li");
    listContainer.classList.add("list-group-item", "py-3", "d-flex")
    listContainer.append(kiriContainer, kananContainer);
    listContainer.setAttribute("id", `book-${id}`);

    return listContainer;
}

function addBook() {
    const bookTitle = document.getElementById("title").value;
    const bookWriter = document.getElementById("writer").value;
    const releasedDate = document.getElementById("year").value;
    const isDone = document.getElementById("readed").checked;

    const generatedID = generateId();
    const bookObject = generateBookObject(generatedID, bookTitle, bookWriter, parseInt(releasedDate), isDone);
    books.push(bookObject);

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();

}

// ================== Finding Title
function cariBuku() {
    const keyword = document.getElementById("keySearch").value;

    if (keyword != null) {
        for (index in books) {
            if (
                (books[index].bookTitle.toLowerCase() === keyword.toLowerCase()) ||
                (books[index].bookWriter.toLowerCase() === keyword.toLowerCase()) ||
                (books[index].releasedDate === parseInt(keyword))
            ) {
                console.log(books[index]);
                let asdf = books[index];
                bookFilter.push(asdf);
            }
        }
        return bookFilter;
    } else {
        document.dispatchEvent(new Event(RENDER_EVENT));
    }
}
// ===================

function addBookToCompleted(bookId /* HTMLELement */) {

    const bookTarget = findBook(bookId);
    if (bookTarget == null) return;

    bookTarget.isDone = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function deleteBook(bookId /* HTMLELement */) {
    const bookTarget = findBookIndex(bookId);
    if (bookTarget === -1) return;
    books.splice(bookTarget, 1);

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function undoBookFromCompleted(bookId /* HTMLELement */) {

    const bookTarget = findBook(bookId);
    if (bookTarget == null) return;

    bookTarget.isDone = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

document.addEventListener("DOMContentLoaded", function () {

    const submitForm /* HTMLFormElement */ = document.querySelector("#addbook");
    const searchBtn = document.querySelector("#searchBox");

    submitForm.addEventListener("submit", function (event) {
        event.preventDefault();
        alert("Success adding book");
        addBook();
        submitForm.reset();
    });


    searchBtn.addEventListener("submit", function (e) {
        e.preventDefault();
        cariBuku();
        document.dispatchEvent(new Event(RENDER_SEARCH));
        submitForm.reset();
    });

    if (isStorageExist()) {
        loadDataFromStorage();
    }
});

document.addEventListener(SAVED_EVENT, () => {
    console.log("Data berhasil di simpan.");
});

document.addEventListener(RENDER_EVENT, function () {
    const uncompletedTODOList = document.getElementById("canberes");
    const listCompleted = document.getElementById("beres");

    // clearing list item
    uncompletedTODOList.innerHTML = "";
    listCompleted.innerHTML = "";

    for (bookItem of books) {
        const bookElement = makeBook(bookItem);
        if (bookItem.isDone) {
            listCompleted.append(bookElement);
        } else {
            uncompletedTODOList.append(bookElement);
        }
    }
});

document.addEventListener(RENDER_SEARCH, function () {
    const uncompletedTODOList = document.getElementById("canberes");
    const listCompleted = document.getElementById("beres");

    // clearing list item
    uncompletedTODOList.innerHTML = "";
    listCompleted.innerHTML = "";

    for (bookItem of bookFilter) {
        const bookElementFilter = makeBook(bookItem);
        if (bookItem.isDone) {
            listCompleted.append(bookElementFilter);
        } else {
            uncompletedTODOList.append(bookElementFilter);
        }
    }
});