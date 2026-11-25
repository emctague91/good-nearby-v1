// Sample cards. `category` uses the database category enum so place types come from one mapping.
// `access` / `verification` / `tags` keep the original badge text exactly as before.
const places=[
{id:"p556",name:"Park 556 DFA",area:"Logan Square",cat:"Run",category:"DOG_AREA",official_dfa:true,icon:"🐕",access:"OFF-LEASH",verification:"VERIFIED",tags:[],desc:"Official Chicago Park District dog-friendly area.",good:"Dogs must be leashed before entering and after leaving the DFA."},
{id:"parkfield",name:"Park & Field",area:"Logan Square",cat:"Eat",category:"RESTAURANT",icon:"🍔",access:"DOGS ALLOWED OUTSIDE",verification:"VERIFIED",tags:[],desc:"Large outdoor space for food, drinks, and hanging with your pup.",good:"Outdoor dog access is the key feature; confirm current patio conditions."},
{id:"logwalk",name:"Logan Boulevard",area:"Logan Square",cat:"Walk",category:"WALK",icon:"🚶",access:null,verification:null,tags:["GOOD NEARBY"],desc:"A neighborhood walking option that pairs naturally with nearby dog stops.",good:"Use the route as a connector between dog-friendly destinations."},
{id:"perch",name:"The Perch Kitchen & Tap",area:"Wicker Park",cat:"Eat",category:"RESTAURANT",icon:"🍔",access:"DOG-FRIENDLY PATIO",verification:"VERIFIED",tags:[],desc:"Dog-friendly patio with a dog menu.",good:"Outdoor seating is the dog-friendly zone."},
{id:"wickerdfa",name:"Wicker Park DFA",area:"Wicker Park",cat:"Run",category:"DOG_AREA",official_dfa:true,icon:"🐕",access:"OFF-LEASH",verification:"VERIFIED",tags:[],desc:"Official Chicago Park District DFA at Wicker Park.",good:"Official DFA rules apply."},
{id:"southloop",name:"Spoke & Bird",area:"South Loop",cat:"Eat",category:"CAFE",icon:"☕",access:"DOG-FRIENDLY OUTDOOR",verification:"VERIFIED",tags:[],desc:"Coffee, food, and an outdoor area that works for a pup outing.",good:"Outdoor dog access should be treated separately from indoor access."},
{id:"montrose",name:"Montrose Beach DFA",area:"Uptown / Montrose",cat:"Run",category:"DOG_AREA",official_dfa:true,icon:"🌊",access:"OFF-LEASH",verification:"VERIFIED",tags:[],desc:"Official lakefront DFA near Montrose.",good:"Beach, swimming, and Natural Area access are separate rules."},
{id:"dock",name:"The Dock at Montrose Beach",area:"Uptown / Montrose",cat:"Eat",category:"RESTAURANT",icon:"🍔",access:"DOGS ALLOWED",verification:null,tags:["SEASONAL"],desc:"Seasonal waterfront food stop with dog-friendly access.",good:"Check seasonal/current status before heading out."},
{id:"nicky",name:"Nicky’s of Beverly",area:"Beverly",cat:"Eat",category:"RESTAURANT",icon:"🍔",access:"DOGS ALLOWED OUTSIDE",verification:"VERIFIED",tags:[],desc:"Neighborhood food stop with outdoor dog access.",good:"Outdoor seating is the dog-friendly zone."},
{id:"roselandhelp",name:"Anti-Cruelty Pet Resource Center",area:"Roseland",cat:"Help",category:"RESOURCE",icon:"🩵",access:null,verification:null,tags:["PET HELP","COMMUNITY"],desc:"Food, supplies, care navigation, behavior guidance, and support programs.",good:"Eligibility and schedules vary by program—verify before visiting."},
{id:"bigmarsh",name:"Big Marsh Park",area:"South Deering",cat:"Explore",category:"PARK",icon:"🌿",access:"NO PETS",verification:null,tags:["RESTRICTED"],desc:"Large ecological recreation destination with trails and habitat.",good:"Official FAQ says service animals are the only domestic animals allowed."},
{id:"lakefront",name:"Lakefront Trail",area:"Chicago Lakefront",cat:"Walk",category:"TRAIL",icon:"🚶",access:null,verification:null,tags:["18-MILE TRAIL","STATUS CHECK"],desc:"Major lakefront walking/running corridor.",good:"Maintenance and construction can change route conditions; check current alerts."}
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
const chips=["All","Run","Walk","Explore","Eat","Shop","Care","Events","Help"];let active="All",query="",saved=new Set(),view="home",known={};
const $=id=>document.getElementById(id);
function renderChips(){$("categoryChips").innerHTML=chips.map(c=>`<button class="chip ${active===c?"active":""}" data-cat="${c}">${c==="All"?"✨ All":c}</button>`).join("");document.querySelectorAll(".chip").forEach(b=>b.onclick=()=>{active=b.dataset.cat;setView("home");renderChips();renderPlaces()})}
// ZIP search: pulls published places from /api/places, ranked by distance from the ZIP centroid.
const ZIP_RE=/^\d{5}$/;let zipRequest=0,zipCache={};
const CHIP_CATEGORIES={Run:["DOG_AREA","PARK"],Walk:["WALK","TRAIL"],Explore:["PARK","TRAIL","OTHER"],Eat:["RESTAURANT","CAFE"],Shop:["SHOP"],Care:["VET","URGENT_CARE","EMERGENCY_CARE","GROOMING","TRAINING","BOARDING","DAYCARE"],Events:["EVENT_VENUE"],Help:["RESOURCE"]};
const CATEGORY_ICONS={DOG_AREA:"🐕",PARK:"🌳",WALK:"🚶",TRAIL:"🌿",RESTAURANT:"🍔",CAFE:"☕",SHOP:"🛍️",VET:"🩺",URGENT_CARE:"🩺",EMERGENCY_CARE:"🚑",GROOMING:"✂️",TRAINING:"🎓",BOARDING:"🏠",DAYCARE:"🏠",RESOURCE:"🩵",EVENT_VENUE:"🧺",OTHER:"📍"};
const ACCESS_LABELS={OFF_LEASH:"OFF-LEASH",LEASHED:"LEASHED",DOGS_ALLOWED:"DOGS ALLOWED",RESTRICTED:"RESTRICTED",NO_DOGS:"NO DOGS",SERVICE_ANIMALS_ONLY:"SERVICE ANIMALS ONLY",UNKNOWN:"DOG ACCESS UNKNOWN"};
const STATUS_LABELS={CLOSED:"CLOSED",TEMPORARILY_CLOSED:"TEMPORARILY CLOSED",PARTIAL:"PARTIAL CLOSURE",SEASONAL:"SEASONAL",WEATHER_DEPENDENT:"WEATHER DEPENDENT",CONSTRUCTION:"CONSTRUCTION"};
// Place type = what the place IS, derived only from the database category (and subcategory where needed).
// It never says anything about dog access; that stays in the separate access badge.
const PLACE_TYPES={PARK:"PUBLIC PARK",WALK:"WALKING ROUTE",TRAIL:"WALKING TRAIL",RESTAURANT:"DOG-FRIENDLY RESTAURANT",CAFE:"DOG-FRIENDLY CAFE",VET:"VETERINARY CLINIC",URGENT_CARE:"VETERINARY CLINIC",EMERGENCY_CARE:"VETERINARY CLINIC",GROOMING:"DOG GROOMING",DAYCARE:"DOG DAYCARE & BOARDING",BOARDING:"DOG DAYCARE & BOARDING",RESOURCE:"COMMUNITY PET RESOURCE",EVENT_VENUE:"EVENT / FARMERS MARKET"};
const UNVERIFIED_TYPE="PLACE TYPE NEEDS VERIFICATION";
// Only officially designated DFAs get the dog-area type: a DOG_AREA record sourced from the Chicago Park District DFA program.
function isOfficialDfa(p){return p.category==="DOG_AREA"&&(p.official_dfa===true||/chicago park district/i.test(`${p.managing_authority||""} ${p.source_name||""}`))}
function placeType(p){
 if(p.category==="DOG_AREA")return isOfficialDfa(p)?{label:"OFFICIAL OFF-LEASH DOG AREA",known:true}:{label:UNVERIFIED_TYPE,known:false};
 // SHOP covers any store; only label it a pet supply store when the subcategory doesn't say otherwise.
 if(p.category==="SHOP")return !p.subcategory||/pet|dog|animal|supply|supplies|feed/i.test(p.subcategory)?{label:"PET SUPPLY STORE",known:true}:{label:UNVERIFIED_TYPE,known:false};
 return PLACE_TYPES[p.category]?{label:PLACE_TYPES[p.category],known:true}:{label:UNVERIFIED_TYPE,known:false}}
const esc=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const escRe=v=>String(v).replace(/[.*+?^${}()|[\]\\]/g,"\\$&");
const miles=d=>d==null?"":`${d<0.1?"<0.1":d.toFixed(1)} mi`;
const WARN_TAG=/NO |RESTRICTED|SEASONAL|STATUS CHECK|CLOSED|CONSTRUCTION/;
const badgeClass=b=>/NO |RESTRICTED|SEASONAL|STATUS CHECK|NEEDS VERIFICATION|CLOSED|CONSTRUCTION|SERVICE ANIMALS/.test(b)?"warn":"";
// One address line: "street, city, state ZIP" with nothing repeated. Records without a street address fall back to their area.
function formatAddress(p){if(!p.address)return p.area||p.neighborhood||"";
 const city=p.city||"Chicago",state=p.state||"IL",zip=p.postal_code||"";let street=p.address.trim();
 if(zip)street=street.replace(new RegExp(`[,\\s]*${escRe(zip)}$`),"");
 street=street.replace(new RegExp(`,\\s*${escRe(state)}$`,"i"),"").replace(new RegExp(`,\\s*${escRe(city)}$`,"i"),"");
 return `${street}, ${city}, ${state}${zip?` ${zip}`:""}`}
// Normalize a sample card or an API record (optionally with ZIP tier) into one card model.
// Access, verification and warnings stay separate; access is only stated when the record supplies it.
function cardModel(p,zip){const type=placeType(p);let access=null,verification,warnings=[],extras=[],note;
 if(p.api){
  // Never present unverified dog access as verified: API access labels only show on VERIFIED records.
  if(p.verified){access=ACCESS_LABELS[p.dog_access]||"DOG ACCESS UNKNOWN";verification="VERIFIED"}else verification="NEEDS VERIFICATION";
  if(STATUS_LABELS[p.current_status])warnings.push(STATUS_LABELS[p.current_status]);
  note=p.description||p.status_reason||"";
 }else{
  access=p.access||null;verification=p.verification==="VERIFIED"?"VERIFIED":"NEEDS VERIFICATION";
  p.tags.forEach(t=>(WARN_TAG.test(t)?warnings:extras).push(t));
  note=p.desc||p.good||"";
 }
 const badges=[access,verification,...warnings].filter(Boolean).map(t=>[t,badgeClass(t)]);
 let tier=null;if(p.tier&&zip)tier={label:p.tier==="IN"?`IN ${zip}`:p.tier,cls:p.tier==="REGIONAL"?"gray":"tier",distance:p.distance_miles==null?"":p.tier==="IN"?`${miles(p.distance_miles)} away`:`${miles(p.distance_miles)} from ${zip}`};
 return {id:p.id,name:p.name,icon:p.api?CATEGORY_ICONS[p.category]||"📍":p.icon,type,badges,tier,address:formatAddress(p),note,extras,regional:p.tier==="REGIONAL"}}
function typeLine(type){return `<p class="place-type ${type.known?"":"unknown"}">${esc(type.label)}</p>`}
const badgeRow=m=>`<div class="badges">${m.badges.map(([t,c])=>`<span class="badge ${c}">${esc(t)}</span>`).join("")}</div>`;
const detailHref=id=>`#place/${encodeURIComponent(id)}`;
// The one card used by every result view: name → type → access → verification → warnings → tier & distance → address → note → action.
function placeCard(p,zip){known[p.id]={p,zip};const m=cardModel(p,zip);const s=saved.has(m.id);
 return `<article class="card ${m.regional?"regional":""}"><div class="card-top"><div class="icon">${m.icon}</div><button class="save ${s?"saved":""}" data-save="${esc(m.id)}" aria-label="${s?"Remove from saved":"Save place"}">${s?"♥":"♡"}</button></div><h3><a class="place-link" href="${esc(detailHref(m.id))}">${esc(m.name)}</a></h3>${typeLine(m.type)}${badgeRow(m)}${m.tier?`<div class="where"><span class="badge ${m.tier.cls}">${esc(m.tier.label)}</span>${m.tier.distance?`<span>${esc(m.tier.distance)}</span>`:""}</div>`:""}${m.address?`<div class="meta">${esc(m.address)}</div>`:""}${m.note?`<p class="desc">${esc(m.note)}</p>`:""}<button class="add" data-add="${esc(m.id)}">＋ ADD TO DOG DAY</button></article>`}
// Place detail page (#place/<id>): everything on the card plus "Information & Sources".
const CONFIDENCE_LABELS={VERIFIED:"Verified",COMMUNITY_VERIFIED:"Community reported — not yet verified by Good Nearby",UNKNOWN:"Not yet verified",RESTRICTED:"Restricted",NEEDS_REVIEW:"Needs review"};
const fmtDate=v=>{const d=new Date(v);return isNaN(d)?"":d.toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric",timeZone:"UTC"})};
function sourcesSection(p){const rows=[];
 if(p.api){rows.push(["Verification",CONFIDENCE_LABELS[p.access_confidence]||"Not yet verified"]);
  if(p.managing_authority)rows.push(["Managed by",esc(p.managing_authority)]);
  if(p.source_name||p.source_url){const url=/^https?:\/\//i.test(p.source_url||"")?p.source_url:"";rows.push(["Source",url?`<a href="${esc(url)}" target="_blank" rel="noopener">${esc(p.source_name||url)}</a>`:esc(p.source_name)])}
  if(p.last_verified_at)rows.push(["Last verified",esc(fmtDate(p.last_verified_at))]);
  if(p.source_notes)rows.push(["Notes",esc(p.source_notes)]);
 }else rows.push(["Verification",p.verification==="VERIFIED"?"Verified":"Not yet verified"]);
 const empty=rows.length<2?`<p class="desc">Source details haven't been recorded for this listing yet.</p>`:"";
 return `<section class="detail-block"><p class="eyebrow">INFORMATION & SOURCES</p><dl class="sources">${rows.map(([k,v])=>`<dt>${k}</dt><dd>${v}</dd>`).join("")}</dl>${empty}</section>`}
function detailHtml(p,zip){const m=cardModel(p,zip);const s=saved.has(m.id);const good=p.api?(p.description&&p.status_reason?p.status_reason:""):(p.desc&&p.good?p.good:"");
 return `<button class="text-btn back" data-back>← Back to results</button><article class="detail-card"><div class="card-top"><div class="icon">${m.icon}</div><button class="save ${s?"saved":""}" data-save="${esc(m.id)}" aria-label="${s?"Remove from saved":"Save place"}">${s?"♥":"♡"}</button></div><h2>${esc(m.name)}</h2>${typeLine(m.type)}${badgeRow(m)}${m.tier?`<div class="where"><span class="badge ${m.tier.cls}">${esc(m.tier.label)}</span>${m.tier.distance?`<span>${esc(m.tier.distance)}</span>`:""}</div>`:""}${m.address?`<div class="meta">${esc(m.address)}</div>`:""}${m.note?`<p class="desc">${esc(m.note)}</p>`:""}${good?`<p class="desc"><b>Good to know:</b> ${esc(good)}</p>`:""}${m.extras.length?`<div class="badges">${m.extras.map(t=>`<span class="badge gray">${esc(t)}</span>`).join("")}</div>`:""}<button class="add" data-add="${esc(m.id)}">＋ ADD TO DOG DAY</button>${sourcesSection(p)}</article>`}
let detailRequest=0;
async function renderDetail(id){const req=++detailRequest;document.body.classList.add("detail-open");const el=$("placeDetail");window.scrollTo&&window.scrollTo(0,0);
 const k=known[id],sample=places.find(p=>p.id===id);let p=k?k.p:sample,zip=k?k.zip:undefined;
 if(!p||p.api){el.innerHTML=`<p class="desc">Loading place…</p>`;
  try{const r=await fetch(`/api/places?id=${encodeURIComponent(id)}`);const j=await r.json();if(!r.ok)throw new Error(j.error);
   // Keep the ZIP tier/distance from the result the user came from; detail fields come from the API.
   p={...(k?k.p:{}),...j.data,api:true}}catch(e){if(req===detailRequest)el.innerHTML=`<button class="text-btn back" data-back>← Back to results</button><div class="card"><h3>We couldn't load this place</h3><p class="desc">It may have been unpublished, or search is unavailable right now.</p></div>`;bindDetail();return}}
 if(req!==detailRequest)return;el.innerHTML=detailHtml(p,zip);bindDetail()}
function bindDetail(){document.querySelectorAll("[data-back]").forEach(b=>b.onclick=()=>{location.hash=""});
 $("placeDetail").querySelectorAll("[data-save]").forEach(b=>b.onclick=()=>{const id=b.dataset.save;saved.has(id)?saved.delete(id):saved.add(id);b.classList.toggle("saved",saved.has(id));b.textContent=saved.has(id)?"♥":"♡";toast(saved.has(id)?"Saved to Good Nearby":"Removed from Saved")});
 $("placeDetail").querySelectorAll("[data-add]").forEach(b=>b.onclick=()=>toast("Added to your Dog Day 🐾"))}
function route(){const m=location.hash.match(/^#place\/(.+)$/);if(m)return renderDetail(decodeURIComponent(m[1]));detailRequest++;if(document.body.classList.contains("detail-open")){document.body.classList.remove("detail-open");renderPlaces()}}
window.addEventListener("hashchange",route);
function renderTextPlaces(){const q=query.toLowerCase();const filtered=places.filter(p=>(active==="All"||p.cat===active)&&(p.name+" "+p.area+" "+p.cat+" "+placeType(p).label+" "+p.desc).toLowerCase().includes(q));$("resultsTitle").textContent=q?`Results for “${query}”`:active==="All"?"Good stuff nearby":`${active} near you`;$("placeCards").innerHTML=filtered.map(p=>placeCard(p)).join("")||`<div class="card"><h3>No verified option yet</h3><p class="desc">Good Nearby would show nearby alternatives instead of padding the neighborhood with weak matches.</p></div>`;bindCardButtons()}
function renderSaved(){zipRequest++;$("resultsEyebrow").textContent="SAVED";$("resultsTitle").textContent="Saved places";const items=[...saved].map(id=>known[id]).filter(Boolean);
 $("placeCards").innerHTML=items.map(({p,zip})=>placeCard(p,zip)).join("")||`<div class="card tier-empty"><h3>Nothing saved yet</h3><p class="desc">Tap ♡ on any place to keep it here.</p></div>`;bindCardButtons()}
function bindCardButtons(){document.querySelectorAll("[data-save]").forEach(b=>b.onclick=()=>{const id=b.dataset.save;saved.has(id)?saved.delete(id):saved.add(id);renderPlaces();toast(saved.has(id)?"Saved to Good Nearby":"Removed from Saved")});document.querySelectorAll("[data-add]").forEach(b=>b.onclick=()=>toast("Added to your Dog Day 🐾"))}
function tierHeading(title,note){return `<div class="tier-head"><p class="eyebrow">${esc(title)}</p><span>${esc(note)}</span></div>`}
async function renderZipPlaces(zip){const req=++zipRequest;$("resultsTitle").textContent=`Results for “${zip}”`;let json=zipCache.zip===zip?zipCache.json:null;
 if(!json){$("placeCards").innerHTML=`<div class="card"><h3>Finding dog-friendly places near ${zip}…</h3></div>`;
 try{const r=await fetch(`/api/places?zip=${zip}`);json=await r.json();if(!r.ok)throw new Error(json.error);zipCache={zip,json}}catch(e){if(req===zipRequest)$("placeCards").innerHTML=`<div class="card"><h3>Search is unavailable right now</h3><p class="desc">Please try again in a moment.</p></div>`;return}}
 if(req!==zipRequest)return;
 const cats=CHIP_CATEGORIES[active];const rows=(json.data||[]).map(p=>({...p,api:true})).filter(p=>!cats||cats.includes(p.category));
 if(json.meta&&json.meta.zip_found===false){$("placeCards").innerHTML=`<div class="card"><h3>No verified option yet</h3><p class="desc">${esc(json.meta.message)}</p></div>`;return}
 const local=rows.filter(p=>p.tier!=="REGIONAL"),regional=rows.filter(p=>p.tier==="REGIONAL");let html="";
 if(local.length)html+=tierHeading(`IN ${zip} & NEARBY`,"Same ZIP or within 3 miles, closest first")+local.map(p=>placeCard(p,zip)).join("");
 else html+=`<div class="card tier-empty"><h3>No verified option yet</h3><p class="desc">Nothing in ${zip} or within 3 miles yet${regional.length?". Regional alternatives are listed below.":"."}</p></div>`;
 if(regional.length)html+=tierHeading("REGIONAL ALTERNATIVES","3–10 miles away — not local to this ZIP")+regional.map(p=>placeCard(p,zip)).join("");
 $("placeCards").innerHTML=html;bindCardButtons()}
function renderPlaces(){if(view==="saved")return renderSaved();$("resultsEyebrow").textContent="NEAR YOU";const q=query.trim();if(ZIP_RE.test(q))return renderZipPlaces(q);zipRequest++;renderTextPlaces()}
function setView(v){view=v;const a=document.querySelector(".nav-item.active");if(v!=="saved"&&a&&a.dataset.tab==="saved"){a.classList.remove("active");document.querySelector('[data-tab="home"]').classList.add("active")}}
const EVENT_TYPE=placeType({category:"EVENT_VENUE"});
function renderEvents(){$("eventCards").innerHTML=events.map(e=>`<article class="event"><div class="event-date">${e[0]}</div>${typeLine(EVENT_TYPE)}<h3>${e[1]}</h3><p>${e[2]} • Current/seasonal details should be verified before launch.</p></article>`).join("")}
function renderVibes(){$("vibeGrid").innerHTML=vibes.map((v,i)=>`<button class="vibe ${i===0?"active":""}" data-vibe="${i}">${v[0]} <b>${v[1]}</b></button>`).join("");document.querySelectorAll(".vibe").forEach(b=>b.onclick=()=>{document.querySelectorAll(".vibe").forEach(x=>x.classList.remove("active"));b.classList.add("active")})}
function openModal(){$("dogDayModal").classList.remove("hidden")}function closeModal(){$("dogDayModal").classList.add("hidden")}
// Dog Day stops use the same hierarchy in compact form: name → place type → access/verification/warnings → area.
function dogDayStop(p,i){const m=cardModel(p);return `<div class="stop"><div>${i+1}</div><div><b>${m.icon} <a class="place-link" href="${esc(detailHref(m.id))}">${esc(m.name)}</a></b>${typeLine(m.type)}${badgeRow(m)}<small>${esc(m.address)}</small></div></div>`}
function generateDay(){const vibe=document.querySelector(".vibe.active b")?.textContent||"Chill + quiet";let picks;if(vibe.includes("Food"))picks=[places.find(p=>p.id==="p556"),places.find(p=>p.id==="logwalk"),places.find(p=>p.id==="parkfield")];else if(vibe.includes("Water"))picks=[places.find(p=>p.id==="montrose"),places.find(p=>p.id==="dock"),places.find(p=>p.id==="lakefront")];else if(vibe.includes("help"))picks=[places.find(p=>p.id==="roselandhelp")];else if(vibe.includes("Off-leash"))picks=[places.find(p=>p.id==="wickerdfa"),places.find(p=>p.id==="p556"),places.find(p=>p.id==="parkfield")];else picks=[places.find(p=>p.id==="p556"),places.find(p=>p.id==="logwalk"),places.find(p=>p.id==="parkfield")];$("dogDayResult").onclick=e=>{if(e.target.closest(".place-link"))closeModal()};$("dogDayResult").innerHTML=`<div class="result-day"><p class="eyebrow">YOUR DOG DAY</p><h3>${vibe}</h3>${picks.filter(Boolean).map(dogDayStop).join("")}<button class="primary full" onclick="toast('Dog Day saved! 🐾')">♡ SAVE DOG DAY</button></div>`}
function toast(msg){$("toast").textContent=msg;$("toast").classList.remove("hidden");setTimeout(()=>$("toast").classList.add("hidden"),2200)}
$("searchInput").oninput=e=>{query=e.target.value;if(location.hash)location.hash="";setView("home");renderPlaces()};$("clearBtn").onclick=()=>{query="";active="All";$("searchInput").value="";setView("home");renderChips();renderPlaces()};$("buildBtn").onclick=openModal;$("closeModal").onclick=closeModal;$("generateBtn").onclick=generateDay;$("distance").oninput=e=>$("distanceValue").textContent=`${e.target.value} mile${e.target.value==1?"":"s"}`;$("locationBtn").onclick=()=>toast("Location search is ready for the next data layer 📍");
document.querySelectorAll(".nav-item").forEach(b=>b.onclick=()=>{document.querySelectorAll(".nav-item").forEach(x=>x.classList.remove("active"));b.classList.add("active");const tab=b.dataset.tab;if(tab!=="dogday"&&location.hash)location.hash="";if(tab==="dogday")openModal();else if(tab==="saved"||tab==="explore"||tab==="home"){view=tab==="saved"?"saved":"home";renderPlaces();if(tab!=="home")$("placeCards").scrollIntoView({behavior:"smooth",block:"start"})}});
renderChips();renderPlaces();renderEvents();renderVibes();route();
