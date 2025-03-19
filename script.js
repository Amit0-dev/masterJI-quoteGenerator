const quoteContainer = document.querySelector(".quote");
const quoteBtn = document.getElementById("quoteBtn");
const clipboardIcon = document.getElementById("clipboard-icon");
const twitterIcon = document.getElementById("twitter-icon");
const popUpCont = document.querySelector(".pop-up");
const downloadBtn = document.getElementById("download");

// for keep track wheather the pop-up is visible or not
let isVisible = false;

// fetch quote from APIs
async function quoteGenerator() {
  try {
    const response = await fetch(
      "https://api.freeapi.app/api/v1/public/quotes/quote/random"
    );

    const data = await response.json();

    return data;
  } catch (error) {
    console.log(`Error: ${error}`);
  }
}

//  create a quote card that includes quote content , author and tags
function createQuoteCard(quoteData) {
  const h3 = document.createElement("h3");
  h3.classList.add("quote-content");
  h3.textContent = quoteData.content;

  const div = document.createElement("div");
  div.classList.add("quote-info");

  const p = document.createElement("p");
  p.textContent = `~ ${quoteData.author}`;

  const span1 = document.createElement("span");
  span1.textContent = `Tags: `;

  const wrapperDiv = document.createElement("div");

  wrapperDiv.appendChild(h3);
  div.appendChild(p);
  div.appendChild(span1);
  wrapperDiv.appendChild(div);

  quoteData.tags.forEach((tag, index) => {
    if (index != 2) {
      const span = document.createElement("span");
      span.textContent = tag;
      div.appendChild(span);
      wrapperDiv.appendChild(div);
    }
  });

  if (quoteData.tags.length == 0) {
    const span = document.createElement("span");
    span.textContent = "Unavailable";
    div.appendChild(span);
    wrapperDiv.appendChild(div);
  }

  return wrapperDiv;
}

// new quote functionality
quoteBtn.addEventListener("click", async () => {
  clear();
  const quoteData = await quoteGenerator();
  const quoteCard = createQuoteCard(quoteData.data);
  quoteContainer.appendChild(quoteCard);
});

// when DOM load it fetch new quote and show on screen
document.addEventListener("DOMContentLoaded", async () => {
  const quoteData = await quoteGenerator();
  const quoteCard = createQuoteCard(quoteData.data);
  quoteContainer.appendChild(quoteCard);
});

// just clear the DOM when new Quote generate
function clear() {
  quoteContainer.innerHTML = "";
}

// for showing pop-up when quote is copied to clipboard
function showPopUp() {
  popUpCont.style.transform = `translate(0%)`;
  isVisible = true;
}


// copy to clipboard feature
clipboardIcon.addEventListener("click", () => {
  const text = document.querySelector(".quote-content").textContent;
  navigator.clipboard.writeText(text);
  showPopUp();

  if (isVisible) {
    setTimeout(() => {
      popUpCont.style.transform = `translate(-100%)`;
    }, 1000);
  }
});


// functionality for share the quote to twitter
twitterIcon.addEventListener("click", () => {
  const text = document.querySelector(".quote-content").textContent;
  twitterIcon.href = `https://twitter.com/intent/tweet?text=${text}`;
});


// functionality for saving the image of quote in system
downloadBtn.addEventListener("click", () => {
  html2canvas(document.querySelector(".quote"), {
    backgroundColor: "#80808027",
  }).then((canvas) => {
    let link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = "card.png";
    link.click();
  });
});
