const CLIENT_ID = "ESZ1uxlW2ma3mPHr";

const drone = new ScaleDrone(CLIENT_ID, {
  data: {
    // Will be sent out as clientData via events
    name: getRandomName(),
    color: getRandomColor(),
  },
});
console.log(drone);

let members = [];

drone.on("open", (error) => {
  if (error) {
    return console.error(error);
  }
  console.log("Successfully connected to Scaledrone");

  const room = drone.subscribe("observable-room");
  room.on("open", (error) => {
    if (error) {
      return console.error(error);
    }
    console.log("Successfully joined room");
  });

  room.on("members", (m) => {
    members = m;
    updateMembersDOM();
  });

  room.on("member_join", (member) => {
    members.push(member);
    updateMembersDOM();
  });

  room.on("member_leave", ({ id }) => {
    const index = members.findIndex((member) => member.id === id);
    members.splice(index, 1);
    updateMembersDOM();
  });

  room.on("data", (text, member) => {
    if (member) {
      addMessageToListDOM(text, member);
    } else {
      // Message is from server
    }
  });
});

drone.on("close", (event) => {
  console.log("Connection was closed", event);
});

drone.on("error", (error) => {
  console.error(error);
});

function getRandomName() {
  const adjs = [
    "antun",
    "romeo",
    "marta",
    "šime",
    "vuk",
    "rajko",
    "marko",
    "žarko",
    "nikola",
    "nada",
    "vera",
    "veronika",
    "martina",
    "sandra",
    "ivana",
    "iva",
    "ivica",
    "ivan",
    "đuro",
    "krešimir",
    "velimir",
    "ratimir",
    "alen",
    "dunja",
    "žana",
    "senka",
    "pero",
    "matej",
    "matea",
    "alex",
    "aleksandar",
    "aleksandra",
    "ante",
    "svetin",
    "ivo",
    "matko",
    "natko",
    "mate",
    "danijel",
    "afrodita",
    "zoran",
    "zorana",
    "gordan",
    "goran",
    "nikola",
    "mirna",
    "maja",
    "marin",
    "andrea",
    "danira",
    "marta",
    "dorijan",
    "vedran",
    "marijan",
    "aleksej",
    "denis",
    "dome",
    "domagoj",
    "david",
    "davor",
    "jerko",
    "ana",
    "andrija",
    "antea",
  ];
  const nouns = [
    "antonio",
    "josip",
    "joško",
    "bilić",
    "slaven",
    "boban",
    "zvonimir",
    "zvone",
    "borna",
    "boško",
    "neno",
    "luka",
    "dado",
    "damir",
    "dani",
    "darinka",
    "dario",
    "mirko",
    "darko",
    "karlo",
    "diana",
    "dragica",
    "nevenka",
    "marija",
    "dušan",
    "duška",
    "edo",
    "filip",
    "franko",
    "golub",
    "hajdi",
    "hrvoje",
    "papagaj",
    "ilir",
    "iva",
    "jaksa",
    "jasmin",
    "jasmina",
    "jerko",
    "željko",
    "jurica",
    "paprika",
    "jagoda",
    "katarina",
    "krešo",
    "kristijan",
    "lidija",
    "luka",
    "mate",
    "ljubo",
    "mamić",
    "marijana",
    "antonija",
    "marinko",
    "zlata",
    "mario",
    "marko",
    "martin",
    "mateo",
    "vodoinstalater",
    "mimi",
    "mirna",
    "mihael",
    "nermin",
  ];
  return (
    adjs[Math.floor(Math.random() * adjs.length)] +
    "_" +
    nouns[Math.floor(Math.random() * nouns.length)]
  );
}

function getRandomColor() {
  return "#" + Math.floor(Math.random() * 0xffffff).toString(16);
}

//------------- DOM STUFF

const DOM = {
  membersCount: document.querySelector(".members-count"),
  membersList: document.querySelector(".members-list"),
  messages: document.querySelector(".messages"),
  input: document.querySelector(".message-form__input"),
  form: document.querySelector(".message-form"),
};

DOM.form.addEventListener("submit", sendMessage);

function sendMessage() {
  const value = DOM.input.value;
  if (value === "") {
    return;
  }
  DOM.input.value = "";
  drone.publish({
    room: "observable-room",
    message: value,
  });
}

function createMemberElement(member) {
  const { name, color } = member.clientData;
  const el = document.createElement("div");
  el.appendChild(document.createTextNode(name));
  el.className = "member";
  el.style.color = color;
  return el;
}

function updateMembersDOM() {
  DOM.membersCount.innerText = `${members.length} users in room:`;
  DOM.membersList.innerHTML = "";
  members.forEach((member) =>
    DOM.membersList.appendChild(createMemberElement(member))
  );
}

function createMessageElement(text, member) {
  const el = document.createElement("div");
  el.appendChild(createMemberElement(member));
  el.appendChild(document.createTextNode(text));
  el.className = "message";
  if (member.id === drone.clientId) {
    el.classList.add("message-mine");
  }
  return el;
}

function addMessageToListDOM(text, member) {
  const el = DOM.messages;
  const wasTop = el.scrollTop === el.scrollHeight - el.clientHeight;
  el.appendChild(createMessageElement(text, member));
  DOM.messages.lastElementChild.scrollIntoView({ behavior: "smooth" });
}
