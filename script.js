const apiKey = "AIzaSyCrjnTcs4691Loilr9mfy4EF9lnOpoeyRc";
const queries = [
  { title: "Grind", author: "Mark Maynard", state: "Nevada" },
  { title: "Close Range", author: "Annie Proulx", state: "Wyoming" },
  { title: "True Grit", author: "Charles Portis", state: "Oklahoma" },
  { title: "Malachi", author: "Alan Brennert", state: "Hawaii" },
];

const bookInfoContainer = document.getElementById("book-info");

async function fetchBookData(query) {
  const apiUrl = `https://www.googleapis.com/books/v1/volumes?q=intitle:${encodeURIComponent(
    query.title
  )}+inauthor:${encodeURIComponent(query.author)}
  +${encodeURIComponent("subject:" + query.state)}&maxResults=1&key=${apiKey}`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (data.totalItems > 0) {
      const book = data.items[0].volumeInfo;
      const authors = book.authors ? book.authors.join(", ") : "N/A";
      const coverImage = book.imageLinks ? book.imageLinks.thumbnail : "";

      return {
        title: book.title,
        authors,
        coverImage,
        publishedDate: book.publishedDate,
      };
    } else {
      console.warn(`No results found for ${query.title} in ${query.state}`);
      return {
        title: query.title,
        authors: "N/A",
        coverImage: "",
        publishedDate: "N/A",
      };
    }
  } catch (error) {
    console.error(
      `Error fetching data for ${query.title} in ${query.state}:`,
      error
    );
    return {
      title: query.title,
      authors: "N/A",
      coverImage: "",
      publishedDate: "N/A",
    };
  }
}

async function displayBookInfo() {
  for (const query of queries) {
    const bookData = await fetchBookData(query);

    const bookElement = document.createElement("div");
    bookElement.innerHTML = `
            <h3>${bookData.title}</h3>
            <p>Authors: ${bookData.authors}</p>
            <p>Published Date: ${bookData.publishedDate}</p>
            <img src="${bookData.coverImage}" alt="${bookData.title} Cover">
            <hr>
        `;

    bookInfoContainer.appendChild(bookElement);
  }
}

displayBookInfo();
