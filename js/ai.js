document.addEventListener("DOMContentLoaded", function () {
    const chatWidget = document.querySelector(".chat-widget");
    const chatToggle = document.querySelector(".chat-toggle");
    const closeBtn = document.querySelector(".close-btn");
    const chatMessages = document.querySelector(".chat-messages");
    const chatInput = document.querySelector("#chat-input");
    const sendBtn = document.querySelector(".send-btn");
    const quickReplies = document.querySelectorAll(".quick-replies button");
    const recordBtn = document.querySelector(".record-btn");

    let recordTimer;
    let seconds = 0;
    let mediaRecorder;
    let audioChunks = [];
    let recordingAllowed = false;

    chatToggle.addEventListener("click", function () {
        chatWidget.style.display = "flex";
    });

    closeBtn.addEventListener("click", function () {
        chatWidget.style.display = "none";
    });

    // Function to format seconds into "mm:ss"
    function formatTime(sec) {
        const minutes = Math.floor(sec / 60);
        const remainingSeconds = sec % 60;
        return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
    }

    // Function to add messages
    function addMessage(content, sender, isAudio = false, thereLink = false, paramObj = false) {
        const messageDiv = document.createElement("div");
        messageDiv.classList.add("message", sender === "user" ? "user-message" : "bot-message");

        if (isAudio) {git add *
            messageDiv.innerHTML = `🎤───────────  ${content}`; // Display as text-based timer
        } else {
            messageDiv.textContent = content;
        }

         // If there's a link, append an anchor element
  if (thereLink && paramObj) {
    const link = document.createElement("a");
    var urlData = JSON.stringify(paramObj["obj"]);
    console.log(urlData+" here is the url data ");
    
    link.href = `category.html?objs=${encodeURIComponent(urlData)}`;
    link.textContent = " Click here to view them 👉";
    link.style.color = "blue";
    link.style.textDecoration = "underline";

    messageDiv.appendChild(link);
}

    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight; // Auto-scroll
       
    }

   
    
    // Voice recording logic
    recordBtn.addEventListener("mousedown", function () {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            alert("Your browser does not support voice recording.");
            return;
        }

        navigator.mediaDevices.getUserMedia({ audio: true })
            .then((stream) => {
                recordingAllowed = true;
                mediaRecorder = new MediaRecorder(stream);
                audioChunks = [];

                mediaRecorder.ondataavailable = (event) => {
                    audioChunks.push(event.data);
                };

                mediaRecorder.onstop = () => {
                    const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
                    const audioUrl = URL.createObjectURL(audioBlob);
                    addMessage(formatTime(seconds), "user", true);

                    sendAudio(audioBlob);


                };

                mediaRecorder.start();

                seconds = 0;
                recordBtn.textContent = "⏳ 0:00";
                recordTimer = setInterval(() => {
                    seconds++;
                    recordBtn.textContent = `⏳ ${formatTime(seconds)}`;
                }, 1000);
            })
            .catch(() => {
                alert("Microphone permission denied. Please enable it in your browser settings.");
                recordingAllowed = false;
                recordBtn.textContent = "🎤"; // Reset UI
            });
    });

    async function sendAudio(audioBlob) {
        const formData = new FormData();
        formData.append("file", audioBlob, "audio.webm");
    
        try {
            const response = await fetch("http://localhost:5000/process_audio", {
                method: "POST",
                body: formData
            });
    
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
    
            const data = await response.json();
            console.log("✅ Transcription:", data.text);
            
          let res = processUserMessage(data.text);
          let resMessage = res["message"];
  
          if (resMessage.endsWith('.')) {
              setTimeout(() => addMessage(resMessage, "bot", false, true, res), 1000);
          } else {
              setTimeout(() => addMessage(resMessage, "bot"), 1000);
          }

            console.log("✅ Success !!!!!!@@@@");
        } catch (error) {
            console.error("❌ Error:", error);
        }
    }
    

    // Stop recording
    recordBtn.addEventListener("mouseup", function () {
        if (!recordingAllowed) return;

        clearInterval(recordTimer);
        recordBtn.textContent = "🎤"; // Reset UI

        if (mediaRecorder && mediaRecorder.state !== "inactive") {
            mediaRecorder.stop();
        }
    });

    recordBtn.addEventListener("mouseleave", function () {
        if (!recordingAllowed) return;

        clearInterval(recordTimer);
        recordBtn.textContent = "🎤"; // Reset UI
    });

    // Send button click
    sendBtn.addEventListener("click", function () {
      const message = chatInput.value.trim();
      if (message) {
          addMessage(message, "user");
          chatInput.value = "";
  
          let res = processUserMessage(message);
          let resMessage = res["message"];
  
          if (resMessage.endsWith('.')) {
              setTimeout(() => addMessage(resMessage, "bot", false, true, res), 1000);
          } else {
              setTimeout(() => addMessage(resMessage, "bot"), 1000);
          }
      }
  });
  

    // Handle Enter key press
    chatInput.addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            sendBtn.click();
        }
    });

    // Quick reply buttons
    quickReplies.forEach((button) => {
        button.addEventListener("click", function () {
            addMessage(button.textContent, "user");
            var message = button.textContent;
            let res = processUserMessage(message);
            let resMessage = res["message"];
    
            if (resMessage.endsWith('.')) {
                setTimeout(() => addMessage(resMessage, "bot", false, true, res), 1000);
            } else {
                setTimeout(() => addMessage(resMessage, "bot"), 1000);
            }
            //setTimeout(() => addMessage("Let me find some info for you!", "bot"), 1000);
        });
    });
  
    function extractData(text) {
      const data = { year: "", color: "", size: "", make: "", name: "" };
  
      // Define possible keywords
      const colors = ["black", "white", "red", "blue", "silver", "gray"];
      const carMake = ["Camry", "Corolla", "Toyota", "Suzuki", "Kia", "kia", "rolls royce","Rolls Royce"];
      const carNames = ["Toyota Camry", "Suzuki Swift","Toyota Sienna", "Kia Sportage","Rolls Royce Ghost", "Toyota Corolla", "Mercedes-Benz C-Class", "Mercedes Benz GLE"];
   
      // Split text into words
      const words = text.split(/\s+/);
  
      let found = false; // Track if any keyword is found
  
      words.forEach((word) => {
          let lowerWord = word.toLowerCase();
  
          // Extract Year (e.g., 2018, 2022)
          if (/^(19|20)\d{2}$/.test(word)) {
              data.year = word;
              found = true;
          }
          // Extract Color
          else if (colors.includes(lowerWord)) {
              data.color = lowerWord;
              found = true;
          }
          // Extract Car Make
          else if (carMake.includes(word)) {
              data.make = word;
              found = true;
          }
              // Extract Car Make
          else if (carNames.includes(word)) {
                data.make = word;
                found = true;
          }
      });
  
      // Only return if at least one keyword is found
      return found ? { data } : null;
  }
  
  // Correctly calling extractData without infinite recursion
   //console.log(extractData("Show me all Corolla cars"));
  // console.log(extractData("Show me blue cars"));
  // console.log(extractData("Do you have 2020 models?"));
  // console.log(extractData("I just want a car.")); // Should return null
  
  
  function checkForGreetings(message) {
    // Define possible greeting keywords
    const greetings = ["hello", "hi", "how are you doing", "good day", "good morning"];

    // Convert the input message to lowercase for case-insensitive matching
    const lowerMessage = message.toLowerCase();

    // Check if any greeting word is included in the message
    for (let greeting of greetings) {
        if (lowerMessage.includes(greeting)) {
            return { message: `Hello! How can I assist you today? 😊` , obj: null};
        }
    }

    // Return null if no greeting is found
    return checkForAppreciation(message);
}

function checkForAppreciation(message) {
  // Define possible greeting keywords
  const greetings = ["Thanks", "Thank you", "Bye"];

  // Convert the input message to lowercase for case-insensitive matching
  const lowerMessage = message.toLowerCase();

  // Check if any greeting word is included in the message
  for (let greeting of greetings) {
      if (lowerMessage.includes(greeting)) {
          return { message: `You're welcome! Happy buying 😊` , obj: null};
      }
  }

  // Return null if no greeting is found
  return  {message: "Am sorry i dont understand you", obj:null};
}

  
  function processUserMessage(message){
    var inObj = extractData(message);
console.log(inObj +' here is the extracted data called in process u m');

    if(inObj != null){
      console.log("extracted data isnt null");

    var resultList = searchCars(inObj);
    console.log("searched finished here is the result "+resultList.toString()+" did u see it");
    let size = resultList.length;
    if(size > 0){
      return {message: "You are in luck, we have about "+size+ " of the in store .", obj: resultList}
    }else{
      return {message: "If you asked for cars, we dont have those in store", obj: null}
    }
  }else{
    return checkForGreetings(message);
    //return {message: "Am sorry i dont understand you", obj:null}
  }
  }

   var cars = [
      {
        "Toyota": {
          "cars": [
            {
              "name": "Toyota Camry",
              "make": "Toyota",
              "year": "2018",
              "color": "Silver",
              "engine": "2.5L 4-Cylinder",
              "imgLink": "./img/silver-camery-small.jpg"
            },
            {
              "name": "Toyota Sienna",
              "make": "Toyota",
              "year": "2023",
              "color": "White",
              "engine": "3.5L V6",
              "imgLink": "./img/toyota-sienna.png"
            },
            {
              "name": "Toyota Corolla",
              "make": "Toyota",
              "year": "2021",
              "color": "White",
              "engine": "1.8L 4-Cylinder",
              "imgLink": "./img/toyota-corrolla.png"
            }
          ]
        }
      },
      {
        "Mercedes-Benz": {
          "cars": [
            {
              "name": "Mercedes Benz GLE",
              "make": "Mercedes-Benz",
              "year": "2021",
              "color": "Black",
              "engine": "3.0L Inline-6 Turbo",
              "imgLink": "./img/black-benz.png"
                          },
            {
              "name": "Mercedes-Benz C-Class",
              "make": "Mercedes-Benz",
              "year": "2019",
              "color": "White",
              "engine": "2.0L Turbocharged",
              "imgLink": "./img/white-benz.png"
            }
          ]
        }
      },
      {
        "Rolls-Royce": {
          "cars": [
            {
              "name": "Rolls-Royce Ghost",
              "make": "Rolls-Royce",
              "year": "2019",
              "color": "Blue",
              "engine": "6.75L V12",
              "imgLink": "./img/royce-ghost.png"
             },
            {
              "name": "Rolls-Royce Phantom",
              "make": "Rolls-Royce",
              "year": "2021",
              "color": "Silver",
              "engine": "6.75L V12",
              "imgLink": "./img/royce-phantom.png"
            }
          ]
        }
      },
      {
        "Suzuki": {
            "cars": [
                {
                    "name": "Suzuki Swift",
                    "make": "Suzuki",
                    "year": "2022",
                    "color": "Red",
                    "engine": "1.2L Inline-4",
                    "imgLink": "./img/suzuki-swift-red.png"
                },
                {
                    "name": "Suzuki Vitara",
                    "make": "Suzuki",
                    "year": "2021",
                    "color": "Blue",
                    "engine": "1.4L Turbo Inline-4",
                    "imgLink": "./img/suzuki-vitara-blue.png"
                },
                {
                    "name": "Suzuki Jimny",
                    "make": "Suzuki",
                    "year": "2021",
                    "color": "Green",
                    "engine": "1.5L Inline-4",
                    "imgLink": "./img/suzuki-jimny-green.png"
                },
                {
                    "name": "Suzuki Ciaz",
                    "make": "Suzuki",
                    "year": "2023",
                    "color": "White",
                    "engine": "1.5L Inline-4",
                    "imgLink": "./img/suzuki-ciaz-white.png"
                }
            ]
        }
    },
    {
      "Kia": {
  "cars": [
      {
          "name": "Kia Sportage",
          "make": "Kia",
          "year": "2023",
          "color": "Black",
          "engine": "2.5L Inline-4",
          "imgLink": "./img/kia-sportage-black.png"
      },
      {
          "name": "Kia Sorento",
          "make": "Kia",
          "year": "2022",
          "color": "White",
          "engine": "2.5L Turbo Inline-4",
          "imgLink": "./img/kia-sorento-white.png"
      },
      {
          "name": "Kia Seltos",
          "make": "Kia",
          "year": "2023",
          "color": "Red",
          "engine": "1.6L Turbo Inline-4",
          "imgLink": "./img/kia-seltos-red.png"
      },
      {
          "name": "Kia Rio",
          "make": "Kia",
          "year": "2021",
          "color": "Blue",
          "engine": "1.6L Inline-4",
          "imgLink": "./img/kia-rio-blue.png"
      }
  ]
}

    }
    
    ]
    
    
function searchCars(query) {
  let results = [];

  cars.forEach(brand => {
      // Extract all keys from the brand object (e.g., "Toyota", "Mercedes-Benz", etc.)
      Object.keys(brand).forEach(brandName => {
          let brandData = brand[brandName]; // Get the brand's car object

          if (!brandData || !Array.isArray(brandData.cars)) {
              console.warn(`Invalid data structure for ${brandName}:`, brand);
              return;
          }

          // Loop through all cars in the brand
          brandData.cars.forEach(car => {
              let match = true;

              for (let key in query.data) {
                  if (query.data[key] !== "" && car[key] !== undefined) {
                      if (car[key].toString().toLowerCase() !== query.data[key].toString().toLowerCase()) {
                          match = false;
                          break;
                      }
                  }
              }

              if (match) {
                  results.push(car);
              }
          });
      });
  });
  console.log("searched finished here is the result "+results[0]+" did u see it");
  return results;
}

// Test cases
let query1 = { data: { year: '', color: '', size: '', name: '', make: 'Toyota' } };
console.log(searchCars(query1)); // Should return all Toyota cars

let query2 = { data: { name: 'Mercedes-Benz GLE' } };
console.log(searchCars(query2)); // Should return only "Mercedes-Benz GLE"

let query3 = { data: { year: '2021', color: 'White' } };
console.log(searchCars(query3)); // Should return "Toyota Corolla" and "Mercedes-Benz C-Class"
  
    

});
