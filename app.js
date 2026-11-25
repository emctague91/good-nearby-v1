const places=[
{id:"p556",name:"Park 556 DFA",area:"Logan Square",cat:"Run",icon:"🐕",badges:["OFF-LEASH","VERIFIED"],desc:"Official Chicago Park District dog-friendly area.",good:"Dogs must be leashed before entering and after leaving the DFA."},
{id:"parkfield",name:"Park & Field",area:"Logan Square",cat:"Eat",icon:"🍔",badges:["DOGS ALLOWED OUTSIDE","VERIFIED"],desc:"Large outdoor space for food, drinks, and hanging with your pup.",good:"Outdoor dog access is the key feature; confirm current patio conditions."},
{id:"logwalk",name:"Logan Boulevard",area:"Logan Square",cat:"Walk",icon:"🚶",badges:["WALK","GOOD NEARBY"],desc:"A neighborhood walking option that pairs naturally with nearby dog stops.",good:"Use the route as a connector between dog-friendly destinations."},
{id:"perch",name:"The Perch Kitchen & Tap",area:"Wicker Park",cat:"Eat",icon:"🍔",badges:["DOG-FRIENDLY PATIO","VERIFIED"],desc:"Dog-friendly patio with a dog menu.",good:"Outdoor seating is the dog-friendly zone."},
{id:"wickerdfa",name:"Wicker Park DFA",area:"Wicker Park",cat:"Run",icon:"🐕",badges:["OFF-LEASH","VERIFIED"],desc:"Official Chicago Park District DFA at Wicker Park.",good:"Official DFA rules apply."},
{id:"southloop",name:"Spoke & Bird",area:"South Loop",cat:"Eat",icon:"🍔",badges:["DOG-FRIENDLY OUTDOOR","VERIFIED"],desc:"Coffee, food, and an outdoor area that works for a pup outing.",good:"Outdoor dog access should be treated separately from indoor access."},
{id:"montrose",name:"Montrose Beach DFA",area:"Uptown / Montrose",cat:"Run",icon:"🌊",badges:["OFF-LEASH","VERIFIED"],desc:"Official lakefront DFA near Montrose.",good:"Beach, swimming, and Natural Area access are separate rules."},
{id:"dock",name:"The Dock at Montrose Beach",area:"Uptown / Montrose",cat:"Eat",icon:"🍔",badges:["DOGS ALLOWED","SEASONAL"],desc:"Seasonal waterfront food stop with dog-friendly access.",good:"Check seasonal/current status before heading out."},
{id:"nicky",name:"Nicky’s of Beverly",area:"Beverly",cat:"Eat",icon:"🍔",badges:["DOGS ALLOWED OUTSIDE","VERIFIED"],desc:"Neighborhood food stop with outdoor dog access.",good:"Outdoor seating is the dog-friendly zone."},
{id:"roselandhelp",name:"Anti-Cruelty Pet Resource Center",area:"Roseland",cat:"Help",icon:"🩵",badges:["PET HELP","COMMUNITY"],desc:"Food, supplies, care navigation, behavior guidance, and support programs.",good:"Eligibility and schedules vary by program—verify before visiting."},
{id:"bigmarsh",name:"Big Marsh Park",area:"South Deering",cat:"Explore",icon:"🌿",badges:["NO PETS","RESTRICTED"],desc:"Large ecological recreation destination with trails and habitat.",good:"Official FAQ says service animals are the only domestic animals allowed."},
{id:"lakefront",name:"Lakefront Trail",area:"Chicago Lakefront",cat:"Walk",icon:"🚶",badges:["18-MILE TRAIL","STATUS CHECK"],desc:"Major lakefront walking/running corridor.",good:"Maintenance and construction can change route conditions; check current alerts."}
];
const events=[
["Bronzeville Farmers Market","Sunday • Bronzeville","🐕 Dogs welcome"],
["Wicker Park Farmers Market","Sunday • Wicker Park","🐕 Pet-friendly"],
["Logan Square Farmers Market","Sunday • Logan Square","🐕 Pet-friendly"],
["Lincoln Park Farmers Market","Saturday • Lincoln Park","🐕 Pet-friendly"],
["Ravenswood Community Farmers Market","Wednesday • Ravenswood","🐕 Pet-friendly"],
["Uptown Farmers Market","Wednesday • Uptown","🐕 Pet-friendly"]
];
const vibes=[["🌳","Chill + quiet"],["⚡","High energy"],["🌊","Water day"],["🐕","Off-leash adventure"],["🍔","Food + patio"],["🛍️","Errands"],["🧺","Something happening today"],["🩵","Pet help"]];
const chips=["All","Run","Walk","Explore","Eat","Shop","Care","Events","Help"];let active="All",query="",saved=new Set();
const $=id=>document.getElementById(id);
function renderChips(){$("categoryChips").innerHTML=chips.map(c=>`<button class="chip ${active===c?"active":""}" data-cat="${c}">${c==="All"?"✨ All":c}</button>`).join("");document.querySelectorAll(".chip").forEach(b=>b.onclick=()=>{active=b.dataset.cat;renderChips();renderPlaces()})}
function renderTextPlaces(){const q=query.toLowerCase();const filtered=places.filter(p=>(active==="All"||p.cat===active)&&(p.name+" "+p.area+" "+p.cat+" "+p.desc).toLowerCase().includes(q));$("resultsTitle").textContent=q?`Results for “${query}”`:active==="All"?"Good stuff nearby":`${active} near you`;$("placeCards").innerHTML=filtered.map(p=>`<article class="card"><div class="card-top"><div class="icon">${p.icon}</div><button class="save ${saved.has(p.id)?"saved":""}" data-save="${p.id}">${saved.has(p.id)?"♥":"♡"}</button></div><div class="badges">${p.badges.map(b=>`<span class="badge ${b.includes("NO ")||b.includes("RESTRICTED")?"warn":b==="GOOD NEARBY"?"gray":""}">${b}</span>`).join("")}</div><h3>${p.name}</h3><div class="meta">${p.area} • ${p.cat}</div><p class="desc">${p.desc}</p><button class="add" data-add="${p.id}">＋ ADD TO DOG DAY</button></article>`).join("")||`<div class="card"><h3>No verified option yet</h3><p class="desc">Good Nearby would show nearby alternatives instead of padding the neighborhood with weak matches.</p></div>`;bindCardButtons()}
function bindCardButtons(){document.querySelectorAll("[data-save]").forEach(b=>b.onclick=()=>{const id=b.dataset.save;saved.has(id)?saved.delete(id):saved.add(id);renderPlaces();toast(saved.has(id)?"Saved to Good Nearby":"Removed from Saved")});document.querySelectorAll("[data-add]").forEach(b=>b.onclick=()=>toast("Added to your Dog Day 🐾"))}
// ZIP search: pulls published places from /api/places, ranked by distance from the ZIP centroid.
const ZIP_RE=/^\d{5}$/;let zipRequest=0,zipCache={};
const CHIP_CATEGORIES={Run:["DOG_AREA","PARK"],Walk:["WALK","TRAIL"],Explore:["PARK","TRAIL","OTHER"],Eat:["RESTAURANT","CAFE"],Shop:["SHOP"],Care:["VET","URGENT_CARE","EMERGENCY_CARE","GROOMING","TRAINING","BOARDING","DAYCARE"],Events:["EVENT_VENUE"],Help:["RESOURCE"]};
const CATEGORY_ICONS={DOG_AREA:"🐕",PARK:"🌳",WALK:"🚶",TRAIL:"🌿",RESTAURANT:"🍔",CAFE:"☕",SHOP:"🛍️",VET:"🩺",URGENT_CARE:"🩺",EMERGENCY_CARE:"🚑",GROOMING:"✂️",TRAINING:"🎓",BOARDING:"🏠",DAYCARE:"🏠",RESOURCE:"🩵",EVENT_VENUE:"🧺",OTHER:"📍"};
const ACCESS_LABELS={OFF_LEASH:"OFF-LEASH",LEASHED:"LEASHED",DOGS_ALLOWED:"DOGS ALLOWED",RESTRICTED:"RESTRICTED",NO_DOGS:"NO DOGS",SERVICE_ANIMALS_ONLY:"SERVICE ANIMALS ONLY",UNKNOWN:"DOG ACCESS UNKNOWN"};
const STATUS_LABELS={CLOSED:"CLOSED",TEMPORARILY_CLOSED:"TEMPORARILY CLOSED",PARTIAL:"PARTIAL CLOSURE",SEASONAL:"SEASONAL",WEATHER_DEPENDENT:"WEATHER DEPENDENT",CONSTRUCTION:"CONSTRUCTION"};
const esc=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const miles=d=>d==null?"":`${d<0.1?"<0.1":d.toFixed(1)} mi`;
function placeBadges(p,zip){const b=[];
 // Never present unverified dog access as verified.
 if(p.verified){b.push([ACCESS_LABELS[p.dog_access]||"DOG ACCESS UNKNOWN",["RESTRICTED","NO_DOGS","SERVICE_ANIMALS_ONLY"].includes(p.dog_access)?"warn":""]);b.push(["VERIFIED",""])}
 else b.push(["NEEDS VERIFICATION","warn"]);
 if(STATUS_LABELS[p.current_status])b.push([STATUS_LABELS[p.current_status],"warn"]);
 b.push([p.tier==="IN"?`IN ${zip}`:p.tier,p.tier==="REGIONAL"?"gray":"tier"]);return b}
function zipCard(p,zip){const where=p.tier==="IN"?`In ${zip}`:p.tier==="NEARBY"?`Nearby • ${miles(p.distance_miles)} from ${zip}`:`Regional alternative • ${miles(p.distance_miles)} from ${zip}`;
 const area=[p.neighborhood,p.postal_code&&`${p.city||"Chicago"} ${p.postal_code}`].filter(Boolean).join(" • ");
 const desc=p.description||[p.address,p.source_name&&`Source: ${p.source_name}`].filter(Boolean).join(". ");
 return `<article class="card ${p.tier==="REGIONAL"?"regional":""}"><div class="card-top"><div class="icon">${CATEGORY_ICONS[p.category]||"📍"}</div><button class="save ${saved.has(p.id)?"saved":""}" data-save="${esc(p.id)}">${saved.has(p.id)?"♥":"♡"}</button></div><div class="badges">${placeBadges(p,zip).map(([t,c])=>`<span class="badge ${c}">${esc(t)}</span>`).join("")}</div><h3>${esc(p.name)}</h3><div class="meta">${esc(where)}${area?` • ${esc(area)}`:""}</div><p class="desc">${esc(desc)}</p><button class="add" data-add="${esc(p.id)}">＋ ADD TO DOG DAY</button></article>`}
function tierHeading(title,note){return `<div class="tier-head"><p class="eyebrow">${esc(title)}</p><span>${esc(note)}</span></div>`}
async function renderZipPlaces(zip){const req=++zipRequest;$("resultsTitle").textContent=`Results for “${zip}”`;let json=zipCache.zip===zip?zipCache.json:null;
 if(!json){$("placeCards").innerHTML=`<div class="card"><h3>Finding dog-friendly places near ${zip}…</h3></div>`;
 try{const r=await fetch(`/api/places?zip=${zip}`);json=await r.json();if(!r.ok)throw new Error(json.error);zipCache={zip,json}}catch(e){if(req===zipRequest)$("placeCards").innerHTML=`<div class="card"><h3>Search is unavailable right now</h3><p class="desc">Please try again in a moment.</p></div>`;return}}
 if(req!==zipRequest)return;
 const cats=CHIP_CATEGORIES[active];const rows=(json.data||[]).filter(p=>!cats||cats.includes(p.category));
 if(json.meta&&json.meta.zip_found===false){$("placeCards").innerHTML=`<div class="card"><h3>No verified option yet</h3><p class="desc">${esc(json.meta.message)}</p></div>`;return}
 const local=rows.filter(p=>p.tier!=="REGIONAL"),regional=rows.filter(p=>p.tier==="REGIONAL");let html="";
 if(local.length)html+=tierHeading(`IN ${zip} & NEARBY`,"Same ZIP or within 3 miles, closest first")+local.map(p=>zipCard(p,zip)).join("");
 else html+=`<div class="card tier-empty"><h3>No verified option yet</h3><p class="desc">Nothing in ${zip} or within 3 miles yet${regional.length?". Regional alternatives are listed below.":"."}</p></div>`;
 if(regional.length)html+=tierHeading("REGIONAL ALTERNATIVES","3–10 miles away — not local to this ZIP")+regional.map(p=>zipCard(p,zip)).join("");
 $("placeCards").innerHTML=html;bindCardButtons()}
function renderPlaces(){const q=query.trim();if(ZIP_RE.test(q))return renderZipPlaces(q);zipRequest++;renderTextPlaces()}
function renderEvents(){$("eventCards").innerHTML=events.map(e=>`<article class="event"><div class="event-date">${e[0]}</div><h3>${e[1]}</h3><p>${e[2]} • Current/seasonal details should be verified before launch.</p></article>`).join("")}
function renderVibes(){$("vibeGrid").innerHTML=vibes.map((v,i)=>`<button class="vibe ${i===0?"active":""}" data-vibe="${i}">${v[0]} <b>${v[1]}</b></button>`).join("");document.querySelectorAll(".vibe").forEach(b=>b.onclick=()=>{document.querySelectorAll(".vibe").forEach(x=>x.classList.remove("active"));b.classList.add("active")})}
function openModal(){$("dogDayModal").classList.remove("hidden")}function closeModal(){$("dogDayModal").classList.add("hidden")}
function generateDay(){const vibe=document.querySelector(".vibe.active b")?.textContent||"Chill + quiet";let picks;if(vibe.includes("Food"))picks=[places.find(p=>p.id==="p556"),places.find(p=>p.id==="logwalk"),places.find(p=>p.id==="parkfield")];else if(vibe.includes("Water"))picks=[places.find(p=>p.id==="montrose"),places.find(p=>p.id==="dock"),places.find(p=>p.id==="lakefront")];else if(vibe.includes("help"))picks=[places.find(p=>p.id==="roselandhelp")];else if(vibe.includes("Off-leash"))picks=[places.find(p=>p.id==="wickerdfa"),places.find(p=>p.id==="p556"),places.find(p=>p.id==="parkfield")];else picks=[places.find(p=>p.id==="p556"),places.find(p=>p.id==="logwalk"),places.find(p=>p.id==="parkfield")];$("dogDayResult").innerHTML=`<div class="result-day"><p class="eyebrow">YOUR DOG DAY</p><h3>${vibe}</h3>${picks.filter(Boolean).map((p,i)=>`<div class="stop"><div>${i+1}</div><div><b>${p.icon} ${p.name}</b><small>${p.area} • ${p.badges[0]}</small></div></div>`).join("")}<button class="primary full" onclick="toast('Dog Day saved! 🐾')">♡ SAVE DOG DAY</button></div>`}
function toast(msg){$("toast").textContent=msg;$("toast").classList.remove("hidden");setTimeout(()=>$("toast").classList.add("hidden"),2200)}
$("searchInput").oninput=e=>{query=e.target.value;renderPlaces()};$("clearBtn").onclick=()=>{query="";active="All";$("searchInput").value="";renderChips();renderPlaces()};$("buildBtn").onclick=openModal;$("closeModal").onclick=closeModal;$("generateBtn").onclick=generateDay;$("distance").oninput=e=>$("distanceValue").textContent=`${e.target.value} mile${e.target.value==1?"":"s"}`;$("locationBtn").onclick=()=>toast("Location search is ready for the next data layer 📍");
document.querySelectorAll(".nav-item").forEach(b=>b.onclick=()=>{document.querySelectorAll(".nav-item").forEach(x=>x.classList.remove("active"));b.classList.add("active");if(b.dataset.tab==="dogday")openModal();else if(b.dataset.tab==="saved")toast("Saved places are ready when you are 🐾")});
renderChips();renderPlaces();renderEvents();renderVibes();
