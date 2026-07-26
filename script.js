fetch("./nav.html?v=26")
  .then(function(response) {
    return response.text();
  })
  .then(function(data) {
    var navPlaceholder = document.getElementById("nav-placeholder");

    if (navPlaceholder) {
      navPlaceholder.innerHTML = data;
    }
  })
  .catch(function(error) {
    console.log("Navigation load failed:", error);
  });
