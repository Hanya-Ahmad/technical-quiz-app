//API Key for Quiz API for technical quizzes
const apiKey='bv7Ixknq4KRtsfaGp8PGztwYNpE5TA9zRYpxw5e2';


function getQuiz(e){

    const baseURL=`https://quizapi.io/api/v1/questions?apiKey=${apiKey}&category=${chosenCategory}`;
    const getData = async (baseURL)=>{
        const res = await fetch(baseURL)
  
        try {
          const data = await res.json();
          //Store the questions returned from the API in local storage
          localStorage.setItem("questions",JSON.stringify(data));
          return data;
        }  catch(error) {
          console.log("error", error); 
        }
      }
      getData(baseURL);
}

//Add click event listener for each category element
const categoryElements = document.querySelectorAll(".category");
let chosenCategory;

for (let i =0; i<categoryElements.length; i++){
    categoryElements[i].addEventListener('click', (e) =>
    { 
      // Retrieve id from clicked element
      let elementId = e.target.id;
      // If element has id
      if (elementId !== '') {
          chosenCategory = elementId;
        
          getQuiz(e);
      }
   

    setTimeout(1000);
  }
  );
}