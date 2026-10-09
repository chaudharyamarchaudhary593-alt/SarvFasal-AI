
const $ = (id) => document.getElementById(id);

// Basic farming assistant demo — not connected to a live AI model.
$("chatForm").addEventListener("submit", function (event) {
  event.preventDefault();

  const input = $("questionInput");
  const question = input.value.trim();
  if (!question) return;

  addMessage(question, "user");
  input.value = "";

  const q = question.toLowerCase();
  let answer;

  if (/hello|hi\b|namaste|नमस्ते|नमस्कार/.test(q)) {
    answer = "Namaste! 🌾 Aap kis fasal ya farming problem ke baare mein jaanna chahte hain?";
  } else if (/wheat|गेहूं|gehu/.test(q)) {
    answer = "गेहूं की सही देखभाल के लिए मिट्टी, बुवाई का समय, सिंचाई और स्थानीय मौसम को ध्यान में रखें। अपने क्षेत्र के कृषि विशेषज्ञ की सलाह भी लें।";
  } else if (/rice|paddy|धान|dhan/.test(q)) {
    answer = "धान की खेती में किस्म, मिट्टी, पानी और रोपाई का समय महत्वपूर्ण हैं। पानी का प्रबंधन स्थानीय कृषि सलाह के अनुसार करें।";
  } else if (/disease|बीमारी|रोग|leaf|पत्ता|पत्ते/.test(q)) {
    answer = "पत्तियों की साफ फोटो लें और लक्षण देखें। केवल फोटो से बीमारी की पुष्टि नहीं होती। सही पहचान के लिए स्थानीय कृषि विशेषज्ञ से जाँच करवाएँ।";
  } else if (/water|irrigation|पानी|सिंचाई/.test(q)) {
    answer = "सिंचाई से पहले मिट्टी की नमी, फसल की अवस्था, बारिश और मिट्टी के प्रकार को देखें। जरूरत से ज्यादा पानी देने से बचें।";
  } else if (/fertilizer|खाद|उर्वरक/.test(q)) {
    answer = "खाद की सही मात्रा मिट्टी की जाँच, फसल और उसकी अवस्था पर निर्भर करती है। Soil test और कृषि विशेषज्ञ की सिफारिश के आधार पर खाद दें।";
  } else if (/price|mandi|भाव|मंडी/.test(q)) {
    answer = "मंडी भाव के लिए अपनी नजदीकी मंडी का नाम और फसल चुनें। इस demo में live prices उपलब्ध नहीं हैं। सरकारी Agmarknet पोर्टल पर भाव जाँचें।";
  } else if (/weather|मौसम|बारिश|rain/.test(q)) {
    answer = "मौसम की जानकारी के लिए अपने जिले का ताजा forecast देखें। यह demo live weather data नहीं दिखाता। बारिश और तेज हवा की चेतावनियों पर ध्यान दें।";
  } else {
    answer = "मैं अभी basic demo assistant हूँ, live AI नहीं। आप गेहूं, धान, सिंचाई, खाद, मौसम या मंडी भाव के बारे में पूछ सकते हैं।";
  }

  setTimeout(() => addMessage(answer, "bot"), 200);
});

function addMessage(text, type) {
  const messages = $("chatMessages");
  const message = document.createElement("div");
  message.className = "message " + type;
  message.textContent = text;
  messages.appendChild(message);
  messages.scrollTop = messages.scrollHeight;
}

// Crop leaf image preview — does not diagnose the disease.
$("leafImage").addEventListener("change", function () {
  const file = this.files[0];
  const preview = $("leafPreview");
  const message = $("imageMessage");

  preview.hidden = true;
  message.textContent = "";

  if (!file) return;

  if (!file.type.startsWith("image/")) {
    message.textContent = "Please select an image file.";
    this.value = "";
    return;
  }

  if (file.size > 5 * 1024 * 1024) {
    message.textContent = "Image must be smaller than 5 MB.";
    this.value = "";
    return;
  }

  const reader = new FileReader();

  reader.onload = function () {
    preview.src = reader.result;
    preview.hidden = false;
    message.textContent =
      "Image selected successfully. AI disease detection is not connected yet.";
  };

  reader.readAsDataURL(file);
});

// Feature buttons
document.querySelectorAll("[data-action]").forEach((button) => {
  button.addEventListener("click", () => {
    const action = button.dataset.action;

    const results = {
      weather: [
        "weatherResult",
        "Live weather is not connected. Check your district forecast before irrigation or spraying."
      ],
      water: [
        "waterResult",
        "Check soil moisture, crop growth stage and recent rainfall before deciding when to irrigate."
      ],
      fertilizer: [
        "fertilizerResult",
        "Get a soil test and follow crop-specific fertilizer recommendations from a local agricultural expert."
      ],
      mandi: [
        "mandiResult",
        "Live mandi prices are not connected. Check current prices on the official Agmarknet portal."
      ]
    };

    const [id, text] = results[action];
    $(id).textContent = text;
  });
});

// Crop profit calculator
$("calculateBtn").addEventListener("click", () => {
  const land = Number($("land").value);
  const yieldPerAcre = Number($("yield").value);
  const price = Number($("price").value);
  const cost = Number($("cost").value);
  const result = $("profitResult");

  if (
    !Number.isFinite(land) ||
    !Number.isFinite(yieldPerAcre) ||
    !Number.isFinite(price) ||
    !Number.isFinite(cost) ||
    land <= 0 ||
    yieldPerAcre < 0 ||
    price < 0 ||
    cost < 0 ||
    $("land").value === "" ||
    $("yield").value === "" ||
    $("price").value === "" ||
    $("cost").value === ""
  ) {
    result.textContent = "Please enter valid, non-negative values and a land area above zero.";
    return;
  }

  const production = land * yieldPerAcre;
  const revenue = production * price;
  const profit = revenue - cost;

  result.replaceChildren();

  const lines = [
    `Estimated production: ${production.toLocaleString("en-IN")} quintals`,
    `Estimated revenue: ${formatINR(revenue)}`,
    `Total farming cost: ${formatINR(cost)}`,
    `${profit >= 0 ? "Estimated profit" : "Estimated loss"}: ${formatINR(Math.abs(profit))}`
  ];

  lines.forEach((line) => {
    const p = document.createElement("p");
    p.textContent = line;
    result.appendChild(p);
  });
});

function formatINR(value) {
  return value.toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2
  });
}

// Simple English / Hindi hero text toggle
let hindiMode = false;

$("languageBtn").addEventListener("click", () => {
  hindiMode = !hindiMode;

  $("heroTitle").innerHTML = hindiMode
    ? "स्मार्ट खेती।<br><span>बेहतर भविष्य।</span>"
    : "Smart Farming.<br><span>Better Future.</span>";

  $("heroText").textContent = hindiMode
    ? "फसल की देखभाल, खेती के उपयोगी टूल और स्मार्ट कृषि सहायता — सब एक जगह।"
    : "Your smart farming companion. Get crop care guidance, farming tools and AI-powered assistance in one place.";

  $("exploreBtn").textContent = hindiMode
    ? "सुविधाएँ देखें →"
    : "Explore Features →";

  $("askBtn").textContent = hindiMode
    ? "AI सहायक से पूछें"
    : "Ask AI Assistant";
});