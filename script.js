fetch("nav.html")
  .then(function(response) {
    return response.text();
  })
  .then(function(data) {
    document.getElementById("nav-placeholder").innerHTML = data;
  })
  .catch(function(error) {
    console.log("Navigation load failed:", error);
  });
