window.onload = function () {
  // timeout is to wait until the doctolib script that handle the DOM populate are loaded,
  // i didn't find a another, if you have one i will be happy to know about it
  setTimeout(() => {
    const practiciens = document.getElementsByClassName(
      'dl-search-result-title'
    );
    if (practiciens.length > 0) {
      for (let practicien of practiciens) {
        const name = practicien.querySelector(
          'h3[data-test="dl-search-result-name"]'
        )?.innerText;
        const profession = practicien.querySelector(
          '.dl-search-result-subtitle'
        )?.innerText;
        console.log(name, profession);
        if (name) {
          chrome.runtime.sendMessage(
            { practicien: `${name} ${profession}` },
            (response) => {
              console.log(response);
              const { notFound, rating, totalRatings, link } = response;

              console.log('received user data', practicien.innerText, rating);
              const newDiv = document.createElement('div');
              let newContent = '';
              if (notFound) {
                newContent = document.createTextNode(
                  `Aucune note trouvé pour ce praticien`
                );
              } else {
                const stars = createStarRating(rating);
                const rate = document.createTextNode(`Note: ${rating} `);
                newDiv.appendChild(rate);
                newDiv.appendChild(stars);
                newContent = document.createElement('a');
                const anchor = document.createTextNode(
                  ` pour (${totalRatings} votes)`
                );
                newContent.href = link;
                newContent.target = '_blank';
                newContent.appendChild(anchor);
              }
              newDiv.appendChild(newContent);
              practicien.appendChild(newDiv.cloneNode(true));
            }
          );
        }
      }
    }
  }, 2000);
};

function starsToPixels(stars) {
  const starsWidth = 68; // px
  const gapWidth = 3; // px

  const starWidth = (starsWidth - gapWidth * 4) / 5;
  const fullStars = Math.floor(stars);
  const fractionStar = stars - fullStars;
  // return the number of pixels for the stars
  return fullStars * (starWidth + gapWidth) + fractionStar * starWidth;
}

// create a function that display a components of 5 stars
function createStarRating(numStarsToColor) {
  const starContainer = document.createElement('div');
  starContainer.classList.add('star-container');

  const style = document.createElement('style');
  style.innerHTML = `
        .star-container {
            background-image: url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 23.44 19'><polygon fill='%23dadce0' points='10,15.27 16.18,19 14.54,11.97 20,7.24 12.81,6.63 10,0 7.19,6.63 0,7.24 5.46,11.97 3.82,19'/></svg>");
            background-repeat: repeat-x;
            display: inline-block;
            overflow: hidden;
            position: relative;
            width: 68px;
            height: 11.4px;
        }
  
        .star {
            display: block;
            background-image: url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 23.44 19'><polygon fill='%23fbbc04' points='10,15.27 16.18,19 14.54,11.97 20,7.24 12.81,6.63 10,0 7.19,6.63 0,7.24 5.46,11.97 3.82,19'/></svg>");
            background-repeat: repeat-x;
            background-size: 14px 11.4px;
            height: 11.4px;
        }
    
    `;

  document.head.appendChild(style);

  const star = document.createElement('span');
  star.classList.add('star');

  star.style.width = `${starsToPixels(numStarsToColor)}px`;
  starContainer.appendChild(star);

  return starContainer;
}
