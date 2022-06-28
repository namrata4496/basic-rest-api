const deleteBook = (isbn) => {
  
  const xhttp = new XMLHttpRequest();

  xhttp.open("DELETE", `http://localhost:3000/books/${isbn}`, false);
  xhttp.send();

  location.reload();
};



const setEditModal = (isbn) => {
  const xhttp = new XMLHttpRequest();

  var v = document.getElementById("editBookModal");
  v.style.display = "block";

  xhttp.open("GET", `http://localhost:3000/books/${isbn}`, false);
  xhttp.send();

  const book = JSON.parse(xhttp.responseText);

  document.getElementById("isbn").value = isbn;
  document.getElementById("title").value = book[0].title;
  document.getElementById("author").value = book[0].author;
  document.getElementById("publisher").value = book[0].publisher;
  document.getElementById("publish_date").value = book[0].publish_date;
  document.getElementById("numOfPages").value = book[0].numOfPages;

  document.getElementById(
    "editForm"
  ).action = `http://localhost:3000/books/${isbn}`;

};



const cll = () => {
  var v = document.getElementById("editBookModal");
  v.style.display = "none";
};
