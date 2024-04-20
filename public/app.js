async function searchProducts() {
  const query = document.getElementById('search').value;
  const searchResultsDiv = document.getElementById('searchResults');
  
  try {
    const response = await fetch(`/search?q=${query}`);
    const data = await response.json();

    let resultsHTML = '';

    data.forEach(product => {
      resultsHTML += `
        <div>
          <h3>${product.document.name}</h3>
          <p>${product.document.description}</p>
        </div>
      `;
    });

    searchResultsDiv.innerHTML = resultsHTML;
  } catch (error) {
    console.error('Error:', error);
  }
}
