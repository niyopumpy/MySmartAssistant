import { useState, useEffect } from "react";

// ─── Design Tokens ─────────────────────────────────────────────────────────
const C = {
  bg:"#080B12", surface:"#0E1220", card:"#131929", border:"#1C2640",
  accent:"#5B9BFF", accentGlow:"rgba(91,155,255,0.18)",
  green:"#2DD4A0", red:"#FF6B72", amber:"#FFBA45", purple:"#B08AFF",
  teal:"#38D9D9", pink:"#FF7EB3", text:"#E8EDF8", muted:"#8A9DC0", dim:"#6B7FA3",
};
const G = {
  blue:`linear-gradient(135deg,#1B3A7A,#0E1F4A)`,
  hero:`linear-gradient(160deg,#0E1F4A 0%,#080B12 60%)`,
};

// ─── Global CSS ────────────────────────────────────────────────────────────
const gCSS = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Orbitron:wght@500;700&family=DM+Mono:wght@400;500&display=swap');
*{margin:0;padding:0;box-sizing:border-box;-webkit-tap-highlight-color:transparent}
html{height:100%;height:-webkit-fill-available}
body{min-height:100%;min-height:-webkit-fill-available;min-height:100dvh;
  font-family:'DM Sans',sans-serif;background:${C.bg};color:${C.text};font-size:14px;overflow:hidden}
input,textarea,select,button{font-family:'DM Sans',sans-serif;outline:none}
::-webkit-scrollbar{width:3px;height:3px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:${C.dim};border-radius:2px}
input[type=date]::-webkit-calendar-picker-indicator,input[type=datetime-local]::-webkit-calendar-picker-indicator,input[type=time]::-webkit-calendar-picker-indicator{filter:invert(1) opacity(.4)}
@keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}
@keyframes blink{0%,49%{opacity:1}50%,100%{opacity:0}}
.fu{animation:fadeUp .3s ease both}
.orb{font-family:'Orbitron',monospace}
.mono{font-family:'DM Mono',monospace}
`;

// ─── Holidays Database ─────────────────────────────────────────────────────
const HOLIDAYS = [
  {month:1,day:1,  name:"New Year's Day",          emoji:"🎆",type:"national"},
  {month:1,day:15, name:"Martin Luther King Jr Day",emoji:"✊",type:"national"},
  {month:2,day:14, name:"Valentine's Day",          emoji:"💝",type:"cultural"},
  {month:2,day:20, name:"Presidents' Day",          emoji:"🇺🇸",type:"national"},
  {month:3,day:8,  name:"International Women's Day",emoji:"🌸",type:"awareness"},
  {month:3,day:17, name:"St. Patrick's Day",        emoji:"🍀",type:"cultural"},
  {month:4,day:1,  name:"April Fools' Day",         emoji:"🃏",type:"cultural"},
  {month:4,day:7,  name:"World Health Day",         emoji:"🏥",type:"awareness"},
  {month:4,day:22, name:"Earth Day",                emoji:"🌍",type:"awareness"},
  {month:5,day:1,  name:"International Labour Day", emoji:"⚒️",type:"national"},
  {month:5,day:12, name:"Mother's Day",             emoji:"💐",type:"cultural"},
  {month:5,day:27, name:"Memorial Day",             emoji:"🎖️",type:"national"},
  {month:6,day:5,  name:"World Environment Day",    emoji:"🌿",type:"awareness"},
  {month:6,day:16, name:"Father's Day",             emoji:"👔",type:"cultural"},
  {month:6,day:19, name:"Juneteenth",               emoji:"✊",type:"national"},
  {month:7,day:4,  name:"Independence Day",         emoji:"🎇",type:"national"},
  {month:9,day:2,  name:"Labor Day (US)",           emoji:"🛠️",type:"national"},
  {month:10,day:10,name:"World Mental Health Day",  emoji:"🧠",type:"awareness"},
  {month:10,day:14,name:"Columbus Day",             emoji:"⚓",type:"national"},
  {month:10,day:31,name:"Halloween",                emoji:"🎃",type:"cultural"},
  {month:11,day:11,name:"Veterans Day",             emoji:"🎖️",type:"national"},
  {month:11,day:28,name:"Thanksgiving",             emoji:"🦃",type:"national"},
  {month:12,day:24,name:"Christmas Eve",            emoji:"🎄",type:"cultural"},
  {month:12,day:25,name:"Christmas Day",            emoji:"🎁",type:"national"},
  {month:12,day:31,name:"New Year's Eve",           emoji:"🥂",type:"cultural"},
];
const holidayForDay=(m,d)=>HOLIDAYS.find(h=>h.month===m+1&&h.day===d);
const holidaysForMonth=m=>HOLIDAYS.filter(h=>h.month===m+1);

// ─── Meal Database — Nigerian Cuisine 🇳🇬 ──────────────────────────────────
const MEALS_DB = {
  Breakfast:[
    {name:"Akara & Ogi",cal:380,time:"30 min",
      ingredients:["2 cups black-eyed peas (peeled)","1 onion blended","2 scotch bonnet peppers","Salt to taste","Vegetable oil for frying","2 cups corn flour (for ogi)","Water","Sugar or honey to serve"],
      steps:["Soak peeled beans overnight, blend smooth with onion and pepper","Beat batter vigorously to incorporate air — this makes akara fluffy","Heat oil in deep pan, scoop spoonfuls of batter and fry until golden brown, 3–4 min each side","For ogi: dissolve corn flour in cold water, pour into boiling water stirring constantly until thick","Serve akara alongside warm ogi sweetened to taste"],
      tags:["classic","protein","street-food"]},
    {name:"Moi Moi with Custard",cal:420,time:"45 min",
      ingredients:["2 cups peeled black-eyed peas","1 red bell pepper","2 scotch bonnet","1 onion","3 tbsp palm oil","2 boiled eggs halved","Salt & seasoning cubes","Banana leaves or foil for wrapping","4 tbsp custard powder","500ml milk","Sugar to taste"],
      steps:["Blend beans, pepper, onion and scotch bonnet very smooth","Stir in palm oil, seasoning and salt to form thick batter","Pour into greased foil cups or banana leaf parcels, place half a boiled egg in each","Steam in a pot with water for 40–45 min until firm","Mix custard powder with cold milk, pour into hot milk stirring until thick, sweeten","Serve moi moi warm with a bowl of smooth custard"],
      tags:["protein","steamed","filling"]},
    {name:"Eba & Egg Sauce",cal:490,time:"20 min",
      ingredients:["2 cups garri (cassava flakes)","Hot boiling water","4 eggs whisked","2 tomatoes diced","1 onion diced","2 scotch bonnet peppers","2 tbsp vegetable oil","Salt & seasoning cube","Spring onions to garnish"],
      steps:["Pour boiling water into garri gradually, stirring vigorously until stiff and smooth — add more hot water if needed to get right consistency","Cover and rest eba for 2 min","Fry onion and scotch bonnet in oil 2 min, add tomatoes and cook 5 min","Pour in whisked eggs, stir gently until just set and creamy","Serve egg sauce over or beside eba, garnish with spring onions"],
      tags:["carb-rich","quick","classic"]},
    {name:"Pap (Akamu) & Fried Fish",cal:360,time:"20 min",
      ingredients:["3 tbsp fermented corn powder (akamu)","500ml water","Salt to taste","Sugar or honey","2 mackerel or tilapia fillets","1 tsp suya spice","1 tsp garlic powder","Vegetable oil for frying"],
      steps:["Dissolve akamu powder in a little cold water to form a smooth paste","Bring remaining water to a rolling boil in a pot","Pour boiling water over paste while stirring quickly until it thickens to desired consistency","Season fish with suya spice, garlic and salt","Shallow-fry fish in hot oil 4–5 min each side until crispy and golden","Serve pap warm with fried fish on the side"],
      tags:["traditional","gluten-free","light"]},
    {name:"Yam & Egg Sauce",cal:510,time:"25 min",
      ingredients:["½ medium yam tuber peeled and sliced","4 eggs","2 tomatoes diced","1 onion sliced","1 scotch bonnet diced","2 tbsp palm oil or vegetable oil","Salt","Seasoning cube","Crayfish (optional)"],
      steps:["Boil yam slices in salted water for 15–20 min until tender and easily pierced with fork","Drain and set aside","Heat oil in a pan, fry onion until soft, add tomatoes and scotch bonnet, cook 5 min","Add crayfish and seasoning, stir well","Beat eggs and pour over the sauce, scramble gently until just cooked","Serve alongside or over boiled yam"],
      tags:["protein","filling","classic"]},
    {name:"Banana Porridge (Ogede Porridge)",cal:340,time:"20 min",
      ingredients:["4 ripe plantains (yellow, not black)","2 cups water","1 cup milk","2 tbsp sugar","Pinch of nutmeg","Pinch of cinnamon","1 tbsp butter"],
      steps:["Peel and slice plantains into chunks","Blend plantains with water until smooth","Pour into pot and cook over medium heat stirring constantly for 10 min","Add milk, sugar, butter, nutmeg and cinnamon","Continue stirring until thick and creamy, about 5 more min","Serve warm in bowls"],
      tags:["vegan","sweet","energizing"]},
    {name:"Bread & Beans (Ewa Agoyin)",cal:460,time:"40 min",
      ingredients:["2 cups honey beans (ewa oloyin)","Water to cook","1 large onion finely sliced","4 dried chili peppers (tatashe and rodo)","4 tbsp palm oil","Salt","Seasoning cubes","4 slices white or agege bread"],
      steps:["Cook honey beans in plenty of water until very soft and mushy — about 35 min, mash slightly","In a separate pan heat palm oil until hot, fry onion until deeply caramelised and almost burnt (this is the secret)","Add ground dried peppers to the oil, stir and fry 5 min to release smoky flavour","Pour the sauce over beans, mix well and season to taste","Serve beans hot with agege bread for dipping"],
      tags:["street-food","high-protein","spicy"]},
  ],
  Lunch:[
    {name:"Jollof Rice & Chicken",cal:620,time:"60 min",
      ingredients:["3 cups long grain parboiled rice","500g chicken pieces","400ml blended tomatoes","2 red bell peppers blended","3 scotch bonnet peppers","1 onion","3 tbsp tomato paste","4 tbsp vegetable oil","1L chicken stock","Bay leaves","Thyme","Curry powder","Seasoning cubes","Salt"],
      steps:["Season chicken with thyme, curry, seasoning and salt, grill or fry until golden — set aside","Fry onion in oil until soft, add tomato paste and fry 5 min","Add blended tomatoes, peppers and scotch bonnet, cook down 20 min until oil rises to surface","Add chicken stock, bay leaves and bring to a boil","Wash rice, add to pot, stir well, cover tightly and cook on low heat 30 min","Check every 10 min, stir from the bottom to avoid burning","Serve with fried chicken"],
      tags:["party-favourite","Nigerian-classic","spicy"]},
    {name:"Egusi Soup & Pounded Yam",cal:680,time:"55 min",
      ingredients:["2 cups ground egusi (melon seeds)","500g assorted meat (goat, beef, tripe)","2 cups palm oil","Blended tomatoes and peppers","1 bunch bitter leaf or spinach","Stockfish (optional)","Crayfish ground","Seasoning cubes","Salt","Ogiri or iru (locust beans)"],
      steps:["Cook assorted meat with seasoning until tender, reserve stock","Heat palm oil in pot, fry blended pepper and tomatoes 15 min","Mix egusi with water to form a paste, add to pot in lumps or fry separately in oil first","Add meat, stockfish, crayfish and ogiri, stir gently","Add meat stock, cover and cook 20 min — egusi will form nuggets","Add washed bitter leaf or spinach, cook 5 more min","Serve with pounded yam or eba"],
      tags:["protein-rich","traditional","hearty"]},
    {name:"Ofe Onugbu (Bitter Leaf Soup) & Fufu",cal:650,time:"60 min",
      ingredients:["500g goat meat or beef","2 cups cocoyam (ede) peeled","1 bunch bitter leaf — washed thoroughly","2 tbsp palm oil","Stockfish","Crayfish ground","Seasoning cubes","Salt","Ogiri","For fufu: cassava dough or plantain flour"],
      steps:["Boil cocoyam until soft, pound or blend smooth — this is the thickener","Cook meat and stockfish together until very tender","Add palm oil to the pot, add crayfish, ogiri and seasoning","Add pounded cocoyam paste to thicken soup, stir well","Add bitter leaf, cook 10 min — the bitterness mellows with cooking","Prepare fufu by mixing flour with hot water to a smooth, stretchy consistency","Serve bitter leaf soup with fufu"],
      tags:["Igbo-classic","protein","aromatic"]},
    {name:"Banga Soup & Starch",cal:590,time:"50 min",
      ingredients:["1 kg fresh palm fruits or 400ml concentrated banga extract","500g catfish or beef","Banga spices (atama leaves, dried oburunbebe stick)","Crayfish ground","Seasoning cubes","Salt","For starch: starch flour, hot water"],
      steps:["Boil palm fruits until soft, pound and extract juice — or use ready-made extract","Cook fish or meat separately until tender","Combine palm extract with meat stock, bring to boil","Add crayfish, banga spices, seasoning and cooked meat","Simmer 20–25 min stirring occasionally until thick and fragrant","For starch: stir starch flour into boiling water until smooth and stretchy","Serve banga soup with starch"],
      tags:["Delta-classic","aromatic","rich"]},
    {name:"Afang Soup & Semovita",cal:570,time:"45 min",
      ingredients:["200g afang leaves (okazi) — shredded finely","500g waterleaf — roughly chopped","500g assorted meat","2 tbsp palm oil","Crayfish ground","Periwinkle or snails (optional)","Seasoning cubes","Salt","Semovita flour for swallow"],
      steps:["Cook assorted meat with seasoning until tender","Add palm oil and crayfish to meat pot, bring to boil","Add waterleaf first — it releases a lot of water, cook 3 min","Add shredded afang leaves, periwinkle and seasoning","Do not over-cook afang — 5 min maximum to retain flavour and green colour","Mix semovita with boiling water, stir vigorously until smooth and stretchy","Serve afang soup with hot semovita"],
      tags:["Cross-River","leafy","nutrient-rich"]},
    {name:"Oha Soup & Pounded Yam",cal:640,time:"50 min",
      ingredients:["2 cups oha (ora) leaves — stripped from stem","500g goat meat","2 tbsp palm oil","2 cups cocoyam for thickening","Crayfish","Stockfish","Seasoning cubes","Salt","Uziza leaves (a few, optional)"],
      steps:["Cook goat meat and stockfish until tender, reserve the rich stock","Boil cocoyam, pound smooth and roll into small balls","Heat palm oil in pot, add stock, crayfish and seasoning — bring to boil","Drop cocoyam balls in, they will dissolve and thicken the soup","Shred oha leaves by rubbing between palms — this prevents blackening","Add oha leaves just 5 min before serving","Serve with freshly pounded yam"],
      tags:["Igbo-traditional","seasonal","comforting"]},
    {name:"Rice & Ofada Stew",cal:590,time:"45 min",
      ingredients:["3 cups ofada (local brown) rice","6 green tatashe peppers","4 scotch bonnet peppers","2 red bell peppers","1 large onion","500g assorted meat (offal mix)","4 tbsp palm oil","Locust beans (iru)","Seasoning cubes","Salt","Crayfish"],
      steps:["Wash ofada rice thoroughly many times until water runs clear, parboil 10 min","Cook assorted meats with seasoning until tender","Roast the peppers directly over flame or in dry pan until slightly charred — this gives ofada stew its signature smoky flavour","Blend roasted peppers and onion coarsely (not smooth)","Fry blended peppers in palm oil with locust beans 20 min, oil will rise to surface","Add meat, crayfish and season well","Serve ofada stew over par-cooked rice, finishing to cook together 5 min"],
      tags:["Yoruba-classic","smoky","aromatic"]},
  ],
  Dinner:[
    {name:"Pepper Soup (Catfish)",cal:310,time:"35 min",
      ingredients:["1 whole catfish (point & kill) — cut into pieces","2 tsp pepper soup spice mix","1 scotch bonnet pepper","1 onion quartered","Utazi leaves (a few)","Efirin/scent leaves (a few)","Seasoning cubes","Salt","Water"],
      steps:["Rinse catfish thoroughly with hot water to remove slime — squeeze lemon over and rinse","Place fish in pot with onion, scotch bonnet, seasoning and water to barely cover","Bring to boil, add pepper soup spice mix — do not over-spice","Cook 15 min on medium heat until fish is just tender — do not over-cook or it will fall apart","Add utazi and scent leaves in the last 3 min","Adjust seasoning and serve hot — this soup is meant to be light and brothy"],
      tags:["light","medicinal","spicy"]},
    {name:"Efo Riro & Pounded Yam",cal:520,time:"40 min",
      ingredients:["2 bunches spinach or soko leaves","500g beef or assorted meat","3 red bell peppers blended","2 scotch bonnet peppers","1 onion","3 tbsp palm oil","Crayfish","Locust beans (iru)","Seasoning cubes","Salt","Stockfish"],
      steps:["Cook meat and stockfish with onion and seasoning until tender","Heat palm oil in a wide pot, fry blended peppers and scotch bonnet 15 min until oil rises","Add crayfish, locust beans and cooked meat — stir and cook 5 min","Add washed and chopped spinach/soko leaves, stir well","Cook 5–7 min — do not overcook, leaves should stay bright green","Season to taste and serve with pounded yam or eba"],
      tags:["Yoruba-classic","leafy","nutritious"]},
    {name:"Ofe Akwu (Palm Nut Soup) & Rice",cal:610,time:"50 min",
      ingredients:["1 kg fresh palm fruits or 400ml tinned palm cream","500g chicken or goat meat","Crayfish ground","Uziza leaves or bitter leaf","Seasoning cubes","Salt","3 cups long grain rice"],
      steps:["Boil palm fruits until soft, pound in mortar, add water and squeeze to extract cream — strain out fibres and shells","Cook chicken or meat with seasoning until tender","Combine palm nut cream with meat stock, bring to gentle boil","Add meat, crayfish and seasoning, simmer 20 min until thickened","Add uziza leaves in the last 5 min","Cook plain white rice separately","Serve palm nut soup over or alongside white rice"],
      tags:["Igbo-classic","rich","protein"]},
    {name:"Suya & Garden Egg Salad",cal:430,time:"30 min",
      ingredients:["500g beef sirloin — thinly sliced","3 tbsp suya spice (yaji)","2 tbsp groundnut oil","4 garden eggs (white eggplant)","1 onion thinly sliced","2 tomatoes diced","Cucumber sliced","Salt"],
      steps:["Slice beef very thinly against the grain","Coat thoroughly with suya spice and groundnut oil, marinate 30 min (or overnight for best flavour)","Thread onto skewers and grill on very high heat or barbecue, 3–4 min each side","Boil garden eggs 10 min until tender, cool and slice","Combine garden eggs, sliced onion, tomatoes and cucumber","Season salad lightly with salt and serve alongside hot suya"],
      tags:["barbecue","Hausa-classic","street-food"]},
    {name:"Fisherman Soup & Semovita",cal:480,time:"40 min",
      ingredients:["500g fresh prawns","2 blue crabs or crayfish","300g tilapia fillets","3 tbsp palm oil","Blended tomatoes and peppers","Periwinkle","Crayfish ground","Seasoning cubes","Salt","Uziza leaves"],
      steps:["Clean all seafood thoroughly — remove crab shells for easy eating later if preferred","Heat palm oil, fry blended peppers 15 min until oil surfaces","Add crayfish, seasoning and a cup of water, bring to boil","Add crabs first (they take longest), cook 10 min","Add fish and prawns, cook 5 min","Add periwinkle and uziza leaves, cook 3 more min","Serve with semovita or eba"],
      tags:["seafood","Delta-style","aromatic"]},
    {name:"Nkwobi (Cow Foot Stew)",cal:550,time:"90 min",
      ingredients:["1 kg cow foot — cut into pieces","3 tbsp palm oil","2 tbsp ground utazi leaves","1 tsp edible potash (kaun)","Crayfish ground","1 scotch bonnet","Onion sliced","Seasoning cubes","Salt"],
      steps:["Cook cow foot in water with onion and seasoning for 60–75 min until very tender","Drain and set aside, keeping a little stock","Melt palm oil gently, add potash dissolved in a little water — this turns the oil yellow (nkwobi colour)","Add crayfish, scotch bonnet and seasoning to the oil mixture","Add cooked cow foot, toss to coat well in the sauce","Stir in ground utazi leaves, adjust seasoning","Serve in a wooden mortar as is traditional, garnish with sliced onions"],
      tags:["Igbo-classic","special-occasion","bold"]},
    {name:"Miyan Kuka & Tuwo Shinkafa",cal:540,time:"45 min",
      ingredients:["4 tbsp baobab leaf powder (kuka)","500g beef or lamb","2 tbsp groundnut oil","Dried fish","Crayfish","Locust beans (dawadawa)","Scotch bonnet","Onion","Seasoning cubes","Salt","3 cups short grain rice for tuwo"],
      steps:["Cook beef with onion and seasoning until tender, reserve stock","Fry onion in groundnut oil, add locust beans and scotch bonnet, cook 3 min","Add beef stock, dried fish and crayfish, bring to boil","Gradually whisk in kuka powder — it thickens the soup and gives a distinctive earthy flavour","Simmer 15 min, add cooked meat and season to taste","For tuwo: cook short grain rice with extra water until very soft and mushy, pound or blend smooth until stretchy","Serve miyan kuka with tuwo shinkafa"],
      tags:["Hausa-classic","northern-Nigerian","nutritious"]},
  ],
  Snack:[
    {name:"Chin Chin",cal:280,time:"45 min",
      ingredients:["2 cups plain flour","2 tbsp sugar","1 tsp nutmeg","Pinch of salt","1 egg","3 tbsp butter or margarine","Milk to bind","Vegetable oil for frying"],
      steps:["Mix flour, sugar, nutmeg and salt together","Rub in butter until sandy texture, add egg and enough milk to form a stiff dough","Roll out thinly on a floured surface, cut into small strips or squares","Heat oil to 160°C — not too hot or chin chin will brown outside but stay raw inside","Fry in batches for 5–7 min until golden and crispy","Drain on paper towels and cool completely before storing"],
      tags:["crunchy","snack","party-food"]},
    {name:"Roasted Groundnuts (Fried Peanuts)",cal:240,time:"15 min",
      ingredients:["2 cups raw peanuts (with skin)","Salt","1 tsp garlic powder (optional)","Vegetable oil or dry roast"],
      steps:["If dry roasting: heat a thick pan over medium heat, add peanuts and stir constantly for 10–12 min until skins start to split and nuts are golden","If frying: heat a little oil, fry peanuts on low heat stirring until golden","Sprinkle salt (and garlic powder if using) immediately while hot","Cool completely — they will crisp up further as they cool","Store in an airtight container"],
      tags:["protein","portable","traditional"]},
    {name:"Boli & Groundnut (Roasted Plantain)",cal:320,time:"20 min",
      ingredients:["2 ripe but firm plantains (yellow with some black spots)","½ cup roasted groundnuts","Salt (optional)"],
      steps:["Roast whole unpeeled plantains directly over open flame or on a grill, turning every 3–4 min","Cook until skin is charred on all sides and plantain is soft inside — about 15 min total","Peel carefully (they will be very hot)","Serve immediately with roasted groundnuts on the side","Sprinkle salt over plantain if desired"],
      tags:["street-food","vegan","classic"]},
    {name:"Puff Puff",cal:260,time:"30 min",
      ingredients:["2 cups plain flour","1 tsp instant yeast","2 tbsp sugar","Pinch of salt","Pinch of nutmeg","Warm water to mix","Vegetable oil for deep frying"],
      steps:["Mix flour, yeast, sugar, salt and nutmeg together","Add warm water gradually, mix into a thick smooth batter (thicker than pancake batter)","Cover and leave to rise in a warm place for 45 min until doubled","Heat oil to 170°C — drop small balls of batter using your hand or a spoon","Fry in batches, turning once, until golden brown on all sides — about 4 min","Drain on paper and dust with sugar if desired while still hot"],
      tags:["street-food","sweet","crowd-favourite"]},
  ],
};

// ─── Seed Data ─────────────────────────────────────────────────────────────
const now0 = new Date();
const SEED = {
  bp:[
    {id:1,systolic:118,diastolic:76,heartRate:68,notes:"Morning reading",arm:"left",position:"sitting",recordedAt:new Date(Date.now()-86400000*2).toISOString()},
    {id:2,systolic:122,diastolic:80,heartRate:72,notes:"After lunch",arm:"right",position:"sitting",recordedAt:new Date(Date.now()-86400000).toISOString()},
    {id:3,systolic:115,diastolic:74,heartRate:65,notes:"Evening rest",arm:"left",position:"lying",recordedAt:new Date().toISOString()},
  ],
  birthdays:[
    {id:1,name:"Mom",relationship:"Mother",birthdate:"1962-04-15",sendWishesEnabled:true,email:"mom@email.com",phone:"555-0101",notes:"Loves flowers"},
    {id:2,name:"James",relationship:"Friend",birthdate:"1990-07-22",sendWishesEnabled:true,email:"james@email.com",phone:"",notes:""},
    {id:3,name:"Sarah",relationship:"Sister",birthdate:"1995-03-10",sendWishesEnabled:false,email:"",phone:"555-0303",notes:""},
  ],
  meals:[
    // Monday
    {id:1, dayOfWeek:1,mealType:"Breakfast",mealName:"Akara & Ogi",              cal:380,servingSize:"4 akara + 1 bowl ogi",time:"07:30"},
    {id:2, dayOfWeek:1,mealType:"Lunch",   mealName:"Jollof Rice & Chicken",     cal:620,servingSize:"1 plate",             time:"13:00"},
    {id:3, dayOfWeek:1,mealType:"Dinner",  mealName:"Efo Riro & Pounded Yam",    cal:520,servingSize:"1 serving",           time:"19:00"},
    {id:4, dayOfWeek:1,mealType:"Snack",   mealName:"Roasted Groundnuts (Fried Peanuts)",cal:240,servingSize:"1 cup",       time:"16:00"},
    // Tuesday
    {id:5, dayOfWeek:2,mealType:"Breakfast",mealName:"Moi Moi with Custard",     cal:420,servingSize:"2 wraps + 1 bowl",    time:"07:30"},
    {id:6, dayOfWeek:2,mealType:"Lunch",   mealName:"Egusi Soup & Pounded Yam",  cal:680,servingSize:"1 full serving",      time:"13:00"},
    {id:7, dayOfWeek:2,mealType:"Dinner",  mealName:"Pepper Soup (Catfish)",     cal:310,servingSize:"1 bowl",              time:"19:30"},
    // Wednesday
    {id:8, dayOfWeek:3,mealType:"Breakfast",mealName:"Yam & Egg Sauce",          cal:510,servingSize:"4 yam slices",        time:"07:00"},
    {id:9, dayOfWeek:3,mealType:"Lunch",   mealName:"Ofe Onugbu (Bitter Leaf Soup) & Fufu",cal:650,servingSize:"1 serving", time:"13:00"},
    {id:10,dayOfWeek:3,mealType:"Dinner",  mealName:"Suya & Garden Egg Salad",   cal:430,servingSize:"1 skewer + salad",    time:"19:00"},
    {id:11,dayOfWeek:3,mealType:"Snack",   mealName:"Puff Puff",                 cal:260,servingSize:"4 pieces",            time:"16:00"},
    // Thursday
    {id:12,dayOfWeek:4,mealType:"Breakfast",mealName:"Eba & Egg Sauce",          cal:490,servingSize:"1 wrap + sauce",      time:"07:30"},
    {id:13,dayOfWeek:4,mealType:"Lunch",   mealName:"Banga Soup & Starch",       cal:590,servingSize:"1 serving",           time:"13:00"},
    {id:14,dayOfWeek:4,mealType:"Dinner",  mealName:"Ofe Akwu (Palm Nut Soup) & Rice",cal:610,servingSize:"1 bowl + rice",  time:"19:00"},
    // Friday
    {id:15,dayOfWeek:5,mealType:"Breakfast",mealName:"Pap (Akamu) & Fried Fish", cal:360,servingSize:"1 bowl + 1 fish",     time:"07:30"},
    {id:16,dayOfWeek:5,mealType:"Lunch",   mealName:"Afang Soup & Semovita",     cal:570,servingSize:"1 serving",           time:"13:00"},
    {id:17,dayOfWeek:5,mealType:"Dinner",  mealName:"Fisherman Soup & Semovita", cal:480,servingSize:"1 bowl",              time:"19:00"},
    {id:18,dayOfWeek:5,mealType:"Snack",   mealName:"Chin Chin",                 cal:280,servingSize:"1 cup",               time:"16:30"},
    // Saturday
    {id:19,dayOfWeek:6,mealType:"Breakfast",mealName:"Banana Porridge (Ogede Porridge)",cal:340,servingSize:"1 bowl",       time:"09:00"},
    {id:20,dayOfWeek:6,mealType:"Lunch",   mealName:"Rice & Ofada Stew",         cal:590,servingSize:"1 plate",             time:"13:30"},
    {id:21,dayOfWeek:6,mealType:"Dinner",  mealName:"Nkwobi (Cow Foot Stew)",    cal:550,servingSize:"1 portion",           time:"19:00"},
    {id:22,dayOfWeek:6,mealType:"Snack",   mealName:"Boli & Groundnut (Roasted Plantain)",cal:320,servingSize:"1 plantain", time:"16:00"},
    // Sunday
    {id:23,dayOfWeek:0,mealType:"Breakfast",mealName:"Bread & Beans (Ewa Agoyin)",cal:460,servingSize:"2 slices + bowl",    time:"09:30"},
    {id:24,dayOfWeek:0,mealType:"Lunch",   mealName:"Oha Soup & Pounded Yam",    cal:640,servingSize:"1 full serving",      time:"14:00"},
    {id:25,dayOfWeek:0,mealType:"Dinner",  mealName:"Miyan Kuka & Tuwo Shinkafa",cal:540,servingSize:"1 serving",           time:"19:00"},
  ],
  reminders:[
    {id:1,title:"Take medication",description:"Blood pressure pill with water",time:new Date(Date.now()+3600000*2).toISOString(),isCompleted:false,recurringType:"daily",recurringInterval:1,isArchived:false},
    {id:2,title:"Doctor appointment",description:"Annual checkup — City Clinic",time:new Date(Date.now()+86400000*3).toISOString(),isCompleted:false,recurringType:"none",recurringInterval:1,isArchived:false},
    {id:3,title:"Gym session",description:"Leg day",time:new Date(Date.now()+86400000).toISOString(),isCompleted:false,recurringType:"weekly",recurringInterval:1,isArchived:false},
  ],
  notes:[
    {id:1,title:"Doctor's Advice",content:"Reduce sodium intake. Walk 30 minutes daily. Recheck BP in 3 months. Avoid stress and caffeine after noon.",category:"Medical",tags:"health,bp",isPinned:true,isArchived:false,createdAt:new Date(Date.now()-86400000*5).toISOString(),updatedAt:new Date(Date.now()-86400000).toISOString()},
    {id:2,title:"Market Shopping List",content:"Black-eyed peas, garri, yam, plantain, palm oil, egusi (melon seeds), crayfish, stockfish, locust beans (iru), scotch bonnet peppers, tatashe, bitter leaf, uziza leaves, catfish, assorted meat, akamu (corn pap), suya spice",category:"Personal",tags:"food,market,shopping",isPinned:false,isArchived:false,createdAt:new Date(Date.now()-86400000*2).toISOString(),updatedAt:new Date(Date.now()-86400000*2).toISOString()},
  ],
};

// ─── Utils ─────────────────────────────────────────────────────────────────
const pad = n => String(n).padStart(2,"0");
const DAYS_L = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const DAYS_S = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
const MONTHS_L = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const MONTHS_S = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

const fmtShort = d => { const x=new Date(d); return `${MONTHS_S[x.getMonth()]} ${x.getDate()}`; };
const fmtFull  = d => { const x=new Date(d); return `${MONTHS_S[x.getMonth()]} ${x.getDate()} · ${pad(x.getHours())}:${pad(x.getMinutes())}`; };

const bpCat = (s,d) => {
  if(s<120&&d<80)  return {label:"Normal",    color:C.green};
  if(s<130&&d<80)  return {label:"Elevated",  color:C.amber};
  if(s<140||d<90)  return {label:"High Stg 1",color:"#FB923C"};
  return             {label:"High Stg 2",     color:C.red};
};

const daysUntil = bd => {
  const now=new Date(), b=new Date(bd);
  const next=new Date(now.getFullYear(),b.getMonth(),b.getDate());
  if(next<now) next.setFullYear(now.getFullYear()+1);
  return Math.ceil((next-now)/86400000);
};

// ─── Icons ─────────────────────────────────────────────────────────────────
const Icon = ({n,s=20,c="currentColor"}) => {
  const p={fill:"none",stroke:c,strokeWidth:1.8,strokeLinecap:"round",strokeLinejoin:"round"};
  const d={
    home:   <><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></>,
    heart:  <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>,
    cake:   <><rect x="2" y="10" width="20" height="12" rx="2"/><path d="M12 10V6M8 10V8M16 10V8"/><path d="M2 15h20"/></>,
    fork:   <><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 002-2V2"/><path d="M7 2v20M21 15V2a5 5 0 00-5 5v6c0 1.1.9 2 2 2h3zm0 0v7"/></>,
    bell:   <><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></>,
    file:   <><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></>,
    cal:    <><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></>,
    plus:   <><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></>,
    trash:  <><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></>,
    edit:   <><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></>,
    check:  <polyline points="20 6 9 17 4 12"/>,
    x:      <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>,
    chevL:  <polyline points="15 18 9 12 15 6"/>,
    chevR:  <polyline points="9 18 15 12 9 6"/>,
    pin:    <><line x1="12" y1="17" x2="12" y2="22"/><path d="M5 17h14v-1.76a2 2 0 00-1.11-1.79l-1.78-.9A2 2 0 0115 10.76V6h1a2 2 0 000-4H8a2 2 0 000 4h1v4.76a2 2 0 01-1.11 1.79l-1.78.9A2 2 0 005 15.24V17z"/></>,
    archive:<><polyline points="21 8 21 21 3 21 3 8"/><rect x="1" y="3" width="22" height="5"/><line x1="10" y1="12" x2="14" y2="12"/></>,
    therm:  <path d="M14 14.76V3.5a2.5 2.5 0 00-5 0v11.26a4.5 4.5 0 105 0z"/>,
    drop:   <path d="M12 2C6 9 4 13 4 16a8 8 0 0016 0c0-3-2-7-8-14z"/>,
    wind:   <><path d="M9.59 4.59A2 2 0 1111 8H2"/><path d="M12.59 19.41A2 2 0 1014 16H2"/><path d="M17.73 7.73A2.5 2.5 0 1119.5 12H2"/></>,
    sun:    <><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></>,
    cloud:  <path d="M18 10h-1.26A8 8 0 109 20h9a5 5 0 000-10z"/>,
    star:   <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>,
    book:   <><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></>,
    clock:  <><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></>,
    recur:  <><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/></>,
    wave:   <><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/></>,
  };
  return <svg width={s} height={s} viewBox="0 0 24 24" {...p}>{d[n]}</svg>;
};

// ─── Shared Atoms ──────────────────────────────────────────────────────────
const Pill=({color=C.accent,children,sm=false,style={}})=>(
  <span style={{background:`${color}22`,color,fontSize:sm?10:11,fontWeight:700,
    padding:sm?"1px 7px":"3px 10px",borderRadius:99,letterSpacing:.3,...style}}>{children}</span>
);
const Fld=({label,children,style={}})=>(
  <div style={{marginBottom:12,...style}}>
    <div style={{fontSize:10,fontWeight:700,color:C.muted,textTransform:"uppercase",letterSpacing:1,marginBottom:5}}>{label}</div>
    {children}
  </div>
);
const Inp=({value,onChange,placeholder,type="text",style={}})=>(
  <input value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} type={type}
    style={{width:"100%",background:C.dim,border:`1px solid ${C.border}`,borderRadius:10,
      color:C.text,fontSize:14,padding:"9px 12px",...style}}/>
);
const TA=({value,onChange,placeholder,rows=3})=>(
  <textarea value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} rows={rows}
    style={{width:"100%",background:C.dim,border:`1px solid ${C.border}`,borderRadius:10,
      color:C.text,fontSize:14,padding:"9px 12px",resize:"none"}}/>
);
const Sel=({value,onChange,children})=>(
  <select value={value} onChange={e=>onChange(e.target.value)}
    style={{width:"100%",background:C.dim,border:`1px solid ${C.border}`,borderRadius:10,
      color:C.text,fontSize:14,padding:"9px 12px"}}>
    {children}
  </select>
);
const Btn=({onClick,children,variant="primary",small=false,style={}})=>{
  const base={display:"inline-flex",alignItems:"center",gap:5,borderRadius:10,
    fontSize:small?11:13,fontWeight:600,padding:small?"5px 10px":"9px 15px",
    transition:"all .15s",border:"none",cursor:"pointer",...style};
  const v={primary:{background:C.accent,color:"#fff"},ghost:{background:"transparent",color:C.muted,border:`1px solid ${C.border}`},
    danger:{background:`${C.red}22`,color:C.red},success:{background:`${C.green}22`,color:C.green},amber:{background:`${C.amber}22`,color:C.amber}};
  return <button onClick={onClick} style={{...base,...v[variant]}}>{children}</button>;
};
const Card=({children,style={},onClick})=>(
  <div onClick={onClick} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:16,
    padding:14,marginBottom:10,cursor:onClick?"pointer":"default",...style}}>
    {children}
  </div>
);
const Modal=({title,onClose,children})=>(
  <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.78)",zIndex:200,
    display:"flex",alignItems:"flex-end",justifyContent:"center"}}
    onClick={e=>{if(e.target===e.currentTarget)onClose()}}>
    <div style={{background:C.surface,borderRadius:"20px 20px 0 0",width:"100%",maxWidth:480,
      maxHeight:"92vh",overflowY:"auto",padding:"20px 18px 30px",
      border:`1px solid ${C.border}`,borderBottom:"none",animation:"fadeUp .28s ease"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
        <span style={{fontWeight:700,fontSize:16}}>{title}</span>
        <Btn onClick={onClose} variant="ghost" small><Icon n="x" s={14}/></Btn>
      </div>
      {children}
    </div>
  </div>
);
const Empty=({icon,msg})=>(
  <div style={{textAlign:"center",padding:"42px 20px",color:C.muted}}>
    <div style={{opacity:.3,marginBottom:10}}><Icon n={icon} s={34} c={C.muted}/></div>
    <div style={{fontSize:13}}>{msg}</div>
  </div>
);

// ─── Live Clock ────────────────────────────────────────────────────────────
const LiveClock = () => {
  const [now, setNow] = useState(new Date());
  useEffect(()=>{
    const t = setInterval(()=>setNow(new Date()),1000);
    return ()=>clearInterval(t);
  },[]);

  const h=now.getHours(), m=now.getMinutes(), s=now.getSeconds();
  const h12=h%12||12, ampm=h>=12?"PM":"AM";
  const greeting = h<5?"Good Night":h<12?"Good Morning":h<17?"Good Afternoon":h<21?"Good Evening":"Good Night";
  const greetEmoji = h<5?"🌙":h<12?"🌅":h<17?"☀️":h<21?"🌆":"🌙";

  // Arc helper
  const arc=(pct,r)=>{
    const c=2*Math.PI*r;
    return {strokeDasharray:c,strokeDashoffset:c*(1-pct),transition:"stroke-dashoffset .5s linear"};
  };
  const pctH=((h%12)*60+m)/(720), pctM=(m*60+s)/3600, pctS=s/60;

  return (
    <div style={{background:G.hero,border:`1px solid ${C.border}`,borderRadius:20,
      padding:"18px 16px",marginBottom:12,position:"relative",overflow:"hidden"}}>
      <div style={{position:"absolute",inset:0,opacity:.025,
        backgroundImage:"linear-gradient(rgba(91,155,255,.8) 1px,transparent 1px),linear-gradient(90deg,rgba(91,155,255,.8) 1px,transparent 1px)",
        backgroundSize:"20px 20px",pointerEvents:"none"}}/>
      <div style={{display:"flex",gap:14,alignItems:"center"}}>
        {/* Concentric arc clock */}
        <div style={{position:"relative",flexShrink:0}}>
          <svg width={76} height={76} style={{transform:"rotate(-90deg)"}}>
            <circle cx={38} cy={38} r={33} fill="none" stroke={C.dim} strokeWidth={2.5}/>
            <circle cx={38} cy={38} r={26} fill="none" stroke={C.dim} strokeWidth={2}/>
            <circle cx={38} cy={38} r={19} fill="none" stroke={C.dim} strokeWidth={1.5}/>
            <circle cx={38} cy={38} r={33} fill="none" stroke={C.purple} strokeWidth={2.5} strokeLinecap="round" {...arc(pctH,33)}/>
            <circle cx={38} cy={38} r={26} fill="none" stroke={C.accent} strokeWidth={2} strokeLinecap="round" {...arc(pctM,26)}/>
            <circle cx={38} cy={38} r={19} fill="none" stroke={C.green} strokeWidth={1.5} strokeLinecap="round"
              style={{strokeDasharray:2*Math.PI*19,strokeDashoffset:2*Math.PI*19*(1-pctS),transition:"stroke-dashoffset .15s linear"}}/>
          </svg>
          <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center"}}>
            <span className="orb" style={{fontSize:9,color:"#8A9DC0",fontWeight:500}}>{pad(s)}</span>
          </div>
        </div>
        {/* Digits */}
        <div style={{flex:1}}>
          <div style={{display:"flex",alignItems:"baseline",gap:5,marginBottom:2}}>
            <span className="orb" style={{fontSize:32,fontWeight:700,color:C.text,letterSpacing:2,lineHeight:1}}>
              {pad(h12)}
              <span style={{animation:"blink 1s step-end infinite",color:C.accent}}>:</span>
              {pad(m)}
            </span>
            <span className="orb" style={{fontSize:13,color:C.muted}}>{ampm}</span>
          </div>
          <div style={{fontSize:13,fontWeight:600,color:C.accent,marginBottom:1}}>{greetEmoji} {greeting}</div>
          <div style={{fontSize:11,color:C.muted}}>{DAYS_L[now.getDay()]}, {MONTHS_L[now.getMonth()]} {now.getDate()}, {now.getFullYear()}</div>
        </div>
      </div>
    </div>
  );
};

// ─── Environment Panel ─────────────────────────────────────────────────────
const EnvPanel = () => {
  const [env,setEnv] = useState({temp:22.4,humidity:58,aqi:42,uv:3,wind:12.1,pressure:1013,condition:"Partly Cloudy"});
  useEffect(()=>{
    const t=setInterval(()=>setEnv(e=>({
      ...e,
      temp:    +(e.temp+(Math.random()-.5)*.2).toFixed(1),
      humidity:Math.min(95,Math.max(20,+(e.humidity+(Math.random()-.5)*.6).toFixed(0))),
      aqi:     Math.min(150,Math.max(5,+(e.aqi+(Math.random()-.5)*1.2).toFixed(0))),
      wind:    Math.min(50,Math.max(0,+(e.wind+(Math.random()-.5)*.8).toFixed(1))),
    })),3500);
    return ()=>clearInterval(t);
  },[]);

  const aqColor=env.aqi<50?C.green:env.aqi<100?C.amber:C.red;
  const aqLabel=env.aqi<50?"Good":env.aqi<100?"Moderate":"Poor";
  const uvColor=env.uv<3?C.green:env.uv<6?C.amber:C.red;
  const uvLabel=["Low","Low","Low","Moderate","Moderate","High","Very High","Very High","Extreme","Extreme","Extreme+"][Math.min(env.uv,10)];

  const tiles=[
    {i:"therm", l:"Temp",     v:`${env.temp}°C`,  sub:"Outdoor",    c:C.amber},
    {i:"drop",  l:"Humidity", v:`${env.humidity}%`,sub:"Relative",   c:C.teal},
    {i:"cloud", l:"Air",      v:aqLabel,           sub:`AQI ${env.aqi}`,c:aqColor},
    {i:"sun",   l:"UV",       v:env.uv,            sub:uvLabel,      c:uvColor},
    {i:"wind",  l:"Wind",     v:`${env.wind}km/h`, sub:"NE",         c:C.accent},
    {i:"wave",  l:"Pressure", v:`${env.pressure}`, sub:"hPa",        c:C.purple},
  ];

  return (
    <div style={{marginBottom:12}}>
      <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:8}}>
        <Icon n="sun" s={13} c={C.amber}/>
        <span style={{fontSize:10,fontWeight:700,color:"#8A9DC0",textTransform:"uppercase",letterSpacing:.9}}>
          Environment — {env.condition}
        </span>
        <span style={{marginLeft:"auto",fontSize:10,color:C.muted,display:"flex",alignItems:"center",gap:4}}>
          <span style={{width:5,height:5,borderRadius:"50%",background:C.green,display:"inline-block",animation:"pulse 2.5s infinite"}}/>
          Live
        </span>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:7}}>
        {tiles.map(t=>(
          <div key={t.l} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:13,padding:"10px 8px",textAlign:"center"}}>
            <Icon n={t.i} s={15} c={t.c}/>
            <div style={{fontSize:14,fontWeight:700,color:t.c,marginTop:4,lineHeight:1}}>{t.v}</div>
            <div style={{fontSize:9,color:C.muted,marginTop:3,fontWeight:700,textTransform:"uppercase",letterSpacing:.4}}>{t.l}</div>
            <div style={{fontSize:9,color:C.muted,marginTop:1}}>{t.sub}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── Dashboard ─────────────────────────────────────────────────────────────
const Dashboard = ({bp,birthdays,reminders,notes,meals}) => {
  const latest=bp[bp.length-1];
  const upcoming=[...birthdays].sort((a,b)=>daysUntil(a.birthdate)-daysUntil(b.birthdate)).slice(0,3);
  const pending=reminders.filter(r=>!r.isCompleted&&!r.isArchived).sort((a,b)=>new Date(a.time)-new Date(b.time)).slice(0,3);
  const pinned=notes.filter(n=>n.isPinned&&!n.isArchived);
  const todayMeals=meals.filter(m=>m.dayOfWeek===new Date().getDay());
  const cat=latest?bpCat(latest.systolic,latest.diastolic):null;

  return (
    <div style={{padding:"0 13px 80px"}} className="fu">
      <LiveClock/>
      <EnvPanel/>

      {/* Stats row */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:7,marginBottom:12}}>
        {[{l:"BP",v:bp.length,c:C.red},{l:"Alerts",v:pending.length,c:C.amber},{l:"Bdays",v:birthdays.length,c:C.purple},{l:"Notes",v:notes.filter(n=>!n.isArchived).length,c:C.green}].map(s=>(
          <div key={s.l} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:13,padding:"11px 8px"}}>
            <div style={{fontSize:20,fontWeight:700,color:s.c}}>{s.v}</div>
            <div style={{fontSize:9,color:"#8A9DC0",marginTop:2,fontWeight:700,textTransform:"uppercase",letterSpacing:.3}}>{s.l}</div>
          </div>
        ))}
      </div>

      {/* Latest BP */}
      {latest&&(
        <Card style={{marginBottom:12,background:G.blue,borderColor:`${C.accent}33`}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:7}}>
            <span style={{fontSize:10,fontWeight:700,color:C.muted,textTransform:"uppercase",letterSpacing:.7}}>Latest BP</span>
            <Pill color={cat.color}>{cat.label}</Pill>
          </div>
          <div style={{display:"flex",alignItems:"flex-end",gap:10}}>
            <span className="orb" style={{fontSize:30,fontWeight:700,color:cat.color,lineHeight:1}}>{latest.systolic}/{latest.diastolic}</span>
            <div style={{marginBottom:3}}>
              <div style={{fontSize:12,color:C.muted}}>♥ {latest.heartRate} bpm</div>
              <div style={{fontSize:10,color:C.muted}}>{fmtFull(latest.recordedAt)}</div>
            </div>
          </div>
        </Card>
      )}

      {/* Today's meals */}
      {todayMeals.length>0&&(
        <div style={{marginBottom:12}}>
          <div style={{fontSize:10,fontWeight:700,color:"#8A9DC0",textTransform:"uppercase",letterSpacing:.8,marginBottom:8}}>Today's Meals — {DAYS_L[new Date().getDay()]}</div>
          {["Breakfast","Lunch","Dinner"].map(mt=>{
            const m=todayMeals.find(x=>x.mealType===mt);
            const mc={Breakfast:C.amber,Lunch:C.green,Dinner:C.accent};
            const em={Breakfast:"🌅",Lunch:"☀️",Dinner:"🌙"};
            return (
              <div key={mt} style={{display:"flex",gap:10,alignItems:"center",background:C.card,
                border:`1px solid ${C.border}`,borderRadius:12,padding:"10px 13px",marginBottom:6}}>
                <span style={{fontSize:16}}>{em[mt]}</span>
                <div style={{flex:1}}>
                  <div style={{fontSize:10,fontWeight:700,color:mc[mt],textTransform:"uppercase",letterSpacing:.5}}>{mt}</div>
                  <div style={{fontSize:13,fontWeight:500,color:m?C.text:C.muted}}>{m?m.mealName:"Not planned"}</div>
                </div>
                {m&&<span style={{fontSize:11,color:C.muted}}>{m.cal} kcal</span>}
                {m?.time&&<span style={{fontSize:10,color:C.muted}}>🕐{m.time}</span>}
              </div>
            );
          })}
        </div>
      )}

      {/* Upcoming birthdays */}
      {upcoming.length>0&&(
        <div style={{marginBottom:12}}>
          <div style={{fontSize:10,fontWeight:700,color:"#8A9DC0",textTransform:"uppercase",letterSpacing:.8,marginBottom:8}}>Upcoming Birthdays</div>
          {upcoming.map(b=>{
            const d=daysUntil(b.birthdate);
            return (
              <Card key={b.id} style={{marginBottom:6,padding:"10px 13px"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <div><span style={{fontWeight:700,fontSize:13}}>{b.name}</span>
                    <span style={{fontSize:11,color:C.muted,marginLeft:8}}>{b.relationship}</span></div>
                  <Pill color={d===0?C.red:d<=7?C.amber:C.green}>{d===0?"Today!":d===1?"Tomorrow":`${d}d`}</Pill>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Pending reminders */}
      {pending.length>0&&(
        <div style={{marginBottom:12}}>
          <div style={{fontSize:10,fontWeight:700,color:"#8A9DC0",textTransform:"uppercase",letterSpacing:.8,marginBottom:8}}>Pending Reminders</div>
          {pending.map(r=>(
            <Card key={r.id} style={{marginBottom:6,padding:"10px 13px"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div><div style={{fontWeight:600,fontSize:13}}>{r.title}</div>
                  <div style={{fontSize:10,color:C.muted}}>{fmtFull(r.time)}</div></div>
                {r.recurringType!=="none"&&<Pill color={C.purple}>{r.recurringType}</Pill>}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Pinned notes */}
      {pinned.map(n=>(
        <Card key={n.id} style={{borderLeft:`3px solid ${C.accent}`,marginBottom:6}}>
          <div style={{fontSize:10,fontWeight:700,color:C.accent,marginBottom:2}}>📌 {n.title}</div>
          <div style={{fontSize:12,color:C.muted,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{n.content}</div>
        </Card>
      ))}
    </div>
  );
};

// ─── Blood Pressure ────────────────────────────────────────────────────────
const BloodPressure = ({data,setData}) => {
  const [modal,setModal]=useState(false);
  const [form,setForm]=useState({systolic:"",diastolic:"",heartRate:"",notes:"",arm:"left",position:"sitting"});
  const [err,setErr]=useState("");
  const f=k=>v=>setForm(p=>({...p,[k]:v}));
  const save=()=>{
    const s=+form.systolic,d=+form.diastolic,h=+form.heartRate;
    if(!s||!d||!h){setErr("All three readings required.");return;}
    if(s<=d){setErr("Systolic must be greater than diastolic.");return;}
    setData(p=>[...p,{id:Date.now(),...form,systolic:s,diastolic:d,heartRate:h,recordedAt:new Date().toISOString()}]);
    setModal(false);setForm({systolic:"",diastolic:"",heartRate:"",notes:"",arm:"left",position:"sitting"});setErr("");
  };
  return (
    <div style={{padding:"0 13px 80px"}} className="fu">
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
        <div><div style={{fontWeight:700,fontSize:17}}>Blood Pressure</div><div style={{fontSize:12,color:C.muted}}>{data.length} readings</div></div>
        <Btn onClick={()=>setModal(true)}><Icon n="plus" s={14}/>Log</Btn>
      </div>
      <Card style={{marginBottom:14}}>
        <div style={{fontSize:10,fontWeight:700,color:"#8A9DC0",textTransform:"uppercase",letterSpacing:.8,marginBottom:8}}>BP Categories Reference</div>
        {[{l:"Normal",sub:"< 120/80",c:C.green},{l:"Elevated",sub:"120–129 / < 80",c:C.amber},{l:"High Stage 1",sub:"130–139 / 80–89",c:"#FB923C"},{l:"High Stage 2",sub:"≥ 140 / ≥ 90",c:C.red}].map(x=>(
          <div key={x.l} style={{display:"flex",alignItems:"center",gap:8,marginBottom:5}}>
            <div style={{width:8,height:8,borderRadius:3,background:x.c}}/>
            <span style={{fontSize:12,fontWeight:600,color:x.c,width:88}}>{x.l}</span>
            <span style={{fontSize:11,color:C.muted}}>{x.sub}</span>
          </div>
        ))}
      </Card>
      {data.length===0?<Empty icon="heart" msg="No readings logged yet"/>:
        [...data].reverse().map(r=>{
          const cat=bpCat(r.systolic,r.diastolic);
          return (
            <Card key={r.id} style={{borderLeft:`3px solid ${cat.color}`}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                <div>
                  <div style={{display:"flex",alignItems:"baseline",gap:7,marginBottom:5}}>
                    <span className="orb" style={{fontSize:26,fontWeight:700,color:cat.color}}>{r.systolic}/{r.diastolic}</span>
                    <span style={{fontSize:11,color:C.muted}}>mmHg</span>
                  </div>
                  <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:4}}>
                    <Pill color={cat.color}>{cat.label}</Pill>
                    <Pill color={C.muted}>♥ {r.heartRate} bpm</Pill>
                    {r.arm&&<Pill color="#6B8FBF">{r.arm} arm</Pill>}
                    {r.position&&<Pill color="#6B8FBF">{r.position}</Pill>}
                  </div>
                  {r.notes&&<div style={{fontSize:12,color:C.muted}}>{r.notes}</div>}
                  <div style={{fontSize:10,color:C.muted,marginTop:3}}>{fmtFull(r.recordedAt)}</div>
                </div>
                <Btn onClick={()=>setData(p=>p.filter(x=>x.id!==r.id))} variant="danger" small><Icon n="trash" s={12}/></Btn>
              </div>
            </Card>
          );
        })}
      {modal&&(
        <Modal title="Log Blood Pressure" onClose={()=>{setModal(false);setErr("");}}>
          {err&&<div style={{background:`${C.red}22`,color:C.red,borderRadius:10,padding:"8px 12px",fontSize:13,marginBottom:12}}>{err}</div>}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:10}}>
            <Fld label="Systolic"><Inp value={form.systolic} onChange={f("systolic")} placeholder="120" type="number"/></Fld>
            <Fld label="Diastolic"><Inp value={form.diastolic} onChange={f("diastolic")} placeholder="80" type="number"/></Fld>
            <Fld label="Heart Rate"><Inp value={form.heartRate} onChange={f("heartRate")} placeholder="70" type="number"/></Fld>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:10}}>
            <Fld label="Arm"><Sel value={form.arm} onChange={f("arm")}><option value="left">Left</option><option value="right">Right</option></Sel></Fld>
            <Fld label="Position"><Sel value={form.position} onChange={f("position")}>{["sitting","standing","lying"].map(p=><option key={p}>{p}</option>)}</Sel></Fld>
          </div>
          <Fld label="Notes"><TA value={form.notes} onChange={f("notes")} placeholder="Any context…" rows={2}/></Fld>
          <Btn onClick={save} style={{width:"100%",justifyContent:"center"}}>Save Reading</Btn>
        </Modal>
      )}
    </div>
  );
};

// ─── Birthdays ─────────────────────────────────────────────────────────────
const Birthdays = ({data,setData}) => {
  const [modal,setModal]=useState(false);
  const [form,setForm]=useState({name:"",relationship:"",birthdate:"",sendWishesEnabled:true,email:"",phone:"",notes:""});
  const [err,setErr]=useState("");
  const f=k=>v=>setForm(p=>({...p,[k]:v}));
  const save=()=>{
    if(!form.name||!form.birthdate){setErr("Name and birthdate are required.");return;}
    if(form.sendWishesEnabled&&!form.email&&!form.phone){setErr("Add email or phone when wishes are on.");return;}
    setData(p=>[...p,{id:Date.now(),...form}]);
    setModal(false);setForm({name:"",relationship:"",birthdate:"",sendWishesEnabled:true,email:"",phone:"",notes:""});setErr("");
  };
  const sorted=[...data].sort((a,b)=>daysUntil(a.birthdate)-daysUntil(b.birthdate));
  return (
    <div style={{padding:"0 13px 80px"}} className="fu">
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
        <div><div style={{fontWeight:700,fontSize:17}}>Birthdays</div><div style={{fontSize:12,color:C.muted}}>{data.length} contacts</div></div>
        <Btn onClick={()=>setModal(true)}><Icon n="plus" s={14}/>Add</Btn>
      </div>
      {sorted.length===0?<Empty icon="cake" msg="No birthdays added yet"/>:
        sorted.map(b=>{
          const d=daysUntil(b.birthdate);
          const age=new Date().getFullYear()-new Date(b.birthdate).getFullYear();
          return (
            <Card key={b.id} style={{borderLeft:`3px solid ${d===0?C.red:d<=7?C.amber:C.purple}`}}>
              <div style={{display:"flex",justifyContent:"space-between"}}>
                <div style={{flex:1}}>
                  <div style={{display:"flex",gap:7,alignItems:"center",marginBottom:4}}>
                    <span style={{fontWeight:700,fontSize:14}}>{b.name}</span>
                    {b.sendWishesEnabled&&<Pill color={C.green} sm>Wishes ✓</Pill>}
                  </div>
                  <div style={{fontSize:11,color:C.muted,marginBottom:5}}>{b.relationship&&<>{b.relationship} · </>}{fmtShort(b.birthdate)} · Turns {age}</div>
                  <Pill color={d===0?C.red:d<=7?C.amber:C.muted}>{d===0?"🎂 Today!":d===1?"Tomorrow":`In ${d} days`}</Pill>
                  {b.notes&&<div style={{fontSize:12,color:C.muted,marginTop:5}}>{b.notes}</div>}
                </div>
                <Btn onClick={()=>setData(p=>p.filter(x=>x.id!==b.id))} variant="danger" small><Icon n="trash" s={12}/></Btn>
              </div>
            </Card>
          );
        })}
      {modal&&(
        <Modal title="Add Birthday" onClose={()=>{setModal(false);setErr("");}}>
          {err&&<div style={{background:`${C.red}22`,color:C.red,borderRadius:10,padding:"8px 12px",fontSize:13,marginBottom:12}}>{err}</div>}
          <Fld label="Name"><Inp value={form.name} onChange={f("name")} placeholder="Person's name"/></Fld>
          <Fld label="Relationship"><Inp value={form.relationship} onChange={f("relationship")} placeholder="e.g. Friend, Sister"/></Fld>
          <Fld label="Birthdate"><Inp value={form.birthdate} onChange={f("birthdate")} type="date"/></Fld>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
            <Fld label="Email"><Inp value={form.email} onChange={f("email")} placeholder="email@…" type="email"/></Fld>
            <Fld label="Phone"><Inp value={form.phone} onChange={f("phone")} placeholder="555-0100"/></Fld>
          </div>
          <Fld label="Notes"><TA value={form.notes} onChange={f("notes")} placeholder="Gift ideas…" rows={2}/></Fld>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}>
            <input type="checkbox" id="sw" checked={form.sendWishesEnabled} onChange={e=>setForm(p=>({...p,sendWishesEnabled:e.target.checked}))} style={{accentColor:C.accent,width:15,height:15}}/>
            <label htmlFor="sw" style={{fontSize:13}}>Enable birthday wishes</label>
          </div>
          <Btn onClick={save} style={{width:"100%",justifyContent:"center"}}>Save Birthday</Btn>
        </Modal>
      )}
    </div>
  );
};

// ─── Meal Plans ─────────────────────────────────────────────────────────────
const MC={Breakfast:C.amber,Lunch:C.green,Dinner:C.accent,Snack:C.purple};
const ME={Breakfast:"🌅",Lunch:"☀️",Dinner:"🌙",Snack:"🍎"};

const MealPlans = ({data,setData}) => {
  const [selDay,setSelDay]=useState(new Date().getDay());
  const [tab,setTab]=useState("Breakfast");
  const [modal,setModal]=useState(false);
  const [recipe,setRecipe]=useState(null);
  const [form,setForm]=useState({dayOfWeek:new Date().getDay(),mealType:"Breakfast",mealName:"",cal:"",servingSize:"",time:""});
  const f=k=>v=>setForm(p=>({...p,[k]:v}));

  const dayMeals=data.filter(m=>m.dayOfWeek===selDay);
  const tabMeals=dayMeals.filter(m=>m.mealType===tab);
  const totalCal=dayMeals.reduce((s,m)=>s+(m.cal||0),0);

  const save=()=>{
    if(!form.mealName)return;
    setData(p=>[...p,{id:Date.now(),...form,dayOfWeek:+form.dayOfWeek,cal:form.cal?+form.cal:null}]);
    setModal(false);setForm({dayOfWeek:selDay,mealType:tab,mealName:"",cal:"",servingSize:"",time:""});
  };
  const quickAdd=(mt,meal)=>setData(p=>[...p,{id:Date.now(),dayOfWeek:selDay,mealType:mt,mealName:meal.name,cal:meal.cal,servingSize:"1 serving",time:""}]);

  return (
    <div style={{padding:"0 13px 80px"}} className="fu">
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
        <div><div style={{fontWeight:700,fontSize:17}}>Meal Plans</div>
          <div style={{fontSize:12,color:C.muted}}>{totalCal>0?`${totalCal} kcal planned ${DAYS_S[selDay]}`:data.length+" meals total"}</div></div>
        <Btn onClick={()=>setModal(true)}><Icon n="plus" s={14}/>Add</Btn>
      </div>

      {/* Day strip with meal dots */}
      <div style={{display:"flex",gap:5,marginBottom:12,overflowX:"auto",paddingBottom:2}}>
        {DAYS_S.map((d,i)=>{
          const hasBf=data.some(m=>m.dayOfWeek===i&&m.mealType==="Breakfast");
          const hasL=data.some(m=>m.dayOfWeek===i&&m.mealType==="Lunch");
          const hasDi=data.some(m=>m.dayOfWeek===i&&m.mealType==="Dinner");
          return (
            <button key={d} onClick={()=>{setSelDay(i);}}
              style={{flex:"0 0 auto",padding:"7px 9px",borderRadius:11,fontSize:10,fontWeight:700,
                background:selDay===i?C.accent:C.card,color:selDay===i?"#fff":C.muted,
                border:`1px solid ${selDay===i?C.accent:C.border}`,minWidth:40}}>
              <div style={{marginBottom:4}}>{d}</div>
              <div style={{display:"flex",gap:2,justifyContent:"center"}}>
                {hasBf&&<div style={{width:4,height:4,borderRadius:"50%",background:selDay===i?"rgba(255,255,255,.7)":C.amber}}/>}
                {hasL&&<div style={{width:4,height:4,borderRadius:"50%",background:selDay===i?"rgba(255,255,255,.7)":C.green}}/>}
                {hasDi&&<div style={{width:4,height:4,borderRadius:"50%",background:selDay===i?"rgba(255,255,255,.7)":C.accent}}/>}
              </div>
            </button>
          );
        })}
      </div>

      {/* Meal type tabs */}
      <div style={{display:"flex",gap:5,marginBottom:14}}>
        {["Breakfast","Lunch","Dinner","Snack"].map(mt=>(
          <button key={mt} onClick={()=>setTab(mt)}
            style={{flex:1,padding:"7px 2px",borderRadius:10,fontSize:10,fontWeight:700,border:"none",
              background:tab===mt?`${MC[mt]}22`:C.card,color:tab===mt?MC[mt]:C.muted,
              borderBottom:tab===mt?`2px solid ${MC[mt]}`:"2px solid transparent"}}>
            {ME[mt]} {mt.slice(0,5)}
          </button>
        ))}
      </div>

      {/* Planned meals */}
      {tabMeals.length>0&&(
        <div style={{marginBottom:14}}>
          <div style={{fontSize:10,fontWeight:700,color:"#8A9DC0",textTransform:"uppercase",letterSpacing:.8,marginBottom:7}}>Planned for {DAYS_L[selDay]}</div>
          {tabMeals.map(m=>(
            <Card key={m.id} style={{borderLeft:`3px solid ${MC[m.mealType]}`}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                <div>
                  <div style={{fontWeight:700,fontSize:13,marginBottom:5}}>{m.mealName}</div>
                  <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
                    {m.cal&&<Pill color={MC[m.mealType]}>{m.cal} kcal</Pill>}
                    {m.servingSize&&<Pill color={C.muted}>{m.servingSize}</Pill>}
                    {m.time&&<Pill color="#6B8FBF">🕐 {m.time}</Pill>}
                  </div>
                </div>
                <div style={{display:"flex",gap:4}}>
                  <Btn onClick={()=>{const r=MEALS_DB[m.mealType]?.find(x=>x.name===m.mealName);if(r)setRecipe({...r,mealType:m.mealType});}} variant="ghost" small><Icon n="book" s={12}/></Btn>
                  <Btn onClick={()=>setData(p=>p.filter(x=>x.id!==m.id))} variant="danger" small><Icon n="trash" s={12}/></Btn>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Suggestions */}
      <div>
        <div style={{fontSize:10,fontWeight:700,color:"#8A9DC0",textTransform:"uppercase",letterSpacing:.8,marginBottom:7}}>{tab} Ideas</div>
        {(MEALS_DB[tab]||[]).map(meal=>{
          const added=tabMeals.some(m=>m.mealName===meal.name);
          return (
            <div key={meal.name} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:13,
              padding:"11px 12px",marginBottom:7,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div style={{flex:1,marginRight:8}}>
                <div style={{fontWeight:600,fontSize:13,marginBottom:4}}>{meal.name}</div>
                <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
                  <Pill color={MC[tab]}>{meal.cal} kcal</Pill>
                  <Pill color="#6B8FBF">{meal.time}</Pill>
                  {meal.tags.slice(0,2).map(t=><Pill key={t} color={C.muted}>{t}</Pill>)}
                </div>
              </div>
              <div style={{display:"flex",gap:4,flexShrink:0}}>
                <Btn onClick={()=>setRecipe({...meal,mealType:tab})} variant="ghost" small><Icon n="book" s={12}/></Btn>
                <Btn onClick={()=>!added&&quickAdd(tab,meal)} variant={added?"ghost":"success"} small style={{opacity:added?.5:1}}>
                  {added?"✓ Added":"+ Add"}
                </Btn>
              </div>
            </div>
          );
        })}
      </div>

      {/* Custom meal modal */}
      {modal&&(
        <Modal title="Add Custom Meal" onClose={()=>setModal(false)}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:10}}>
            <Fld label="Day"><Sel value={form.dayOfWeek} onChange={f("dayOfWeek")}>{DAYS_S.map((d,i)=><option key={d} value={i}>{d}</option>)}</Sel></Fld>
            <Fld label="Type"><Sel value={form.mealType} onChange={f("mealType")}>{["Breakfast","Lunch","Dinner","Snack"].map(t=><option key={t}>{t}</option>)}</Sel></Fld>
          </div>
          <Fld label="Meal Name"><Inp value={form.mealName} onChange={f("mealName")} placeholder="e.g. Grilled salmon…"/></Fld>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}>
            <Fld label="Calories"><Inp value={form.cal} onChange={f("cal")} placeholder="450" type="number"/></Fld>
            <Fld label="Serving"><Inp value={form.servingSize} onChange={f("servingSize")} placeholder="1 plate"/></Fld>
            <Fld label="Time"><Inp value={form.time} onChange={f("time")} type="time"/></Fld>
          </div>
          <Btn onClick={save} style={{width:"100%",justifyContent:"center",marginTop:4}}>Save Meal</Btn>
        </Modal>
      )}

      {/* Recipe modal */}
      {recipe&&(
        <Modal title={recipe.name} onClose={()=>setRecipe(null)}>
          <div style={{display:"flex",gap:7,flexWrap:"wrap",marginBottom:14}}>
            <Pill color={MC[recipe.mealType]}>{recipe.cal} kcal</Pill>
            <Pill color="#6B8FBF">{recipe.time}</Pill>
            {recipe.tags.map(t=><Pill key={t} color={C.muted}>{t}</Pill>)}
          </div>
          <div style={{marginBottom:16}}>
            <div style={{fontSize:10,fontWeight:700,color:"#8A9DC0",textTransform:"uppercase",letterSpacing:.8,marginBottom:8}}>Ingredients</div>
            {recipe.ingredients.map((ing,i)=>(
              <div key={i} style={{display:"flex",gap:9,alignItems:"center",padding:"6px 0",borderBottom:`1px solid ${C.border}`}}>
                <div style={{width:6,height:6,borderRadius:"50%",background:MC[recipe.mealType],flexShrink:0}}/>
                <span style={{fontSize:13}}>{ing}</span>
              </div>
            ))}
          </div>
          <div>
            <div style={{fontSize:10,fontWeight:700,color:"#8A9DC0",textTransform:"uppercase",letterSpacing:.8,marginBottom:8}}>Method</div>
            {recipe.steps.map((step,i)=>(
              <div key={i} style={{display:"flex",gap:10,alignItems:"flex-start",marginBottom:10}}>
                <div style={{minWidth:22,height:22,borderRadius:"50%",background:MC[recipe.mealType],
                  color:"#000",fontSize:11,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{i+1}</div>
                <div style={{fontSize:13,paddingTop:3,lineHeight:1.5}}>{step}</div>
              </div>
            ))}
          </div>
        </Modal>
      )}
    </div>
  );
};

// ─── Reminders ─────────────────────────────────────────────────────────────
const Reminders = ({data,setData}) => {
  const [modal,setModal]=useState(false);
  const [tab,setTab]=useState("active");
  const [form,setForm]=useState({title:"",description:"",time:"",recurringType:"none",recurringInterval:1});
  const f=k=>v=>setForm(p=>({...p,[k]:v}));
  const save=()=>{
    if(!form.title||!form.time)return;
    setData(p=>[...p,{id:Date.now(),...form,recurringInterval:+form.recurringInterval,isCompleted:false,isArchived:false}]);
    setModal(false);setForm({title:"",description:"",time:"",recurringType:"none",recurringInterval:1});
  };
  const toggle=id=>setData(p=>p.map(r=>r.id===id?{...r,isCompleted:!r.isCompleted}:r));
  const archive=id=>setData(p=>p.map(r=>r.id===id?{...r,isArchived:true}:r));
  const del=id=>setData(p=>p.filter(x=>x.id!==id));
  const active=data.filter(r=>!r.isArchived&&!r.isCompleted).sort((a,b)=>new Date(a.time)-new Date(b.time));
  const done=data.filter(r=>r.isCompleted&&!r.isArchived);
  const archived=data.filter(r=>r.isArchived);
  const shown=tab==="active"?active:tab==="done"?done:archived;
  return (
    <div style={{padding:"0 13px 80px"}} className="fu">
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
        <div><div style={{fontWeight:700,fontSize:17}}>Reminders</div><div style={{fontSize:12,color:C.muted}}>{active.length} pending</div></div>
        <Btn onClick={()=>setModal(true)}><Icon n="plus" s={14}/>New</Btn>
      </div>
      <div style={{display:"flex",gap:6,marginBottom:14}}>
        {[["active","Active"],["done","Done"],["archived","Archived"]].map(([k,l])=>(
          <button key={k} onClick={()=>setTab(k)} style={{flex:1,padding:"7px 4px",borderRadius:10,fontSize:12,fontWeight:600,border:"none",
            background:tab===k?C.accent:C.card,color:tab===k?"#fff":C.muted}}>{l}</button>
        ))}
      </div>
      {shown.length===0?<Empty icon="bell" msg={`No ${tab} reminders`}/>:
        shown.map(r=>(
          <Card key={r.id}>
            <div style={{display:"flex",gap:10,alignItems:"flex-start"}}>
              <button onClick={()=>toggle(r.id)} style={{width:22,height:22,borderRadius:"50%",
                border:`2px solid ${r.isCompleted?C.green:C.border}`,background:r.isCompleted?C.green:"transparent",
                display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:1,cursor:"pointer"}}>
                {r.isCompleted&&<Icon n="check" s={11} c="#000"/>}
              </button>
              <div style={{flex:1}}>
                <div style={{fontWeight:600,fontSize:13,marginBottom:2,textDecoration:r.isCompleted?"line-through":"none",color:r.isCompleted?C.muted:C.text}}>{r.title}</div>
                {r.description&&<div style={{fontSize:11,color:C.muted,marginBottom:4}}>{r.description}</div>}
                <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
                  <Pill color="#6B8FBF">{fmtFull(r.time)}</Pill>
                  {r.recurringType!=="none"&&<Pill color={C.purple}>🔁 {r.recurringType}</Pill>}
                </div>
              </div>
              <div style={{display:"flex",gap:3}}>
                {!r.isArchived&&<Btn onClick={()=>archive(r.id)} variant="ghost" small><Icon n="archive" s={12}/></Btn>}
                <Btn onClick={()=>del(r.id)} variant="danger" small><Icon n="trash" s={12}/></Btn>
              </div>
            </div>
          </Card>
        ))}
      {modal&&(
        <Modal title="New Reminder" onClose={()=>setModal(false)}>
          <Fld label="Title"><Inp value={form.title} onChange={f("title")} placeholder="Reminder title"/></Fld>
          <Fld label="Description"><TA value={form.description} onChange={f("description")} placeholder="Details…" rows={2}/></Fld>
          <Fld label="Date & Time"><Inp value={form.time} onChange={f("time")} type="datetime-local"/></Fld>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
            <Fld label="Repeats"><Sel value={form.recurringType} onChange={f("recurringType")}>{["none","daily","weekly","monthly","yearly"].map(r=><option key={r}>{r}</option>)}</Sel></Fld>
            {form.recurringType!=="none"&&<Fld label="Every N"><Inp value={form.recurringInterval} onChange={f("recurringInterval")} type="number" placeholder="1"/></Fld>}
          </div>
          <Btn onClick={save} style={{width:"100%",justifyContent:"center",marginTop:4}}>Set Reminder</Btn>
        </Modal>
      )}
    </div>
  );
};

// ─── Notes ─────────────────────────────────────────────────────────────────
const Notes = ({data,setData}) => {
  const [modal,setModal]=useState(false);
  const [editing,setEditing]=useState(null);
  const [search,setSearch]=useState("");
  const [form,setForm]=useState({title:"",content:"",category:"",tags:"",isPinned:false,isArchived:false});
  const f=k=>v=>setForm(p=>({...p,[k]:v}));
  const openNew=()=>{setEditing(null);setForm({title:"",content:"",category:"",tags:"",isPinned:false,isArchived:false});setModal(true);};
  const openEdit=n=>{setEditing(n.id);setForm({...n});setModal(true);};
  const save=()=>{
    if(!form.title||!form.content)return;
    const now=new Date().toISOString();
    if(editing)setData(p=>p.map(n=>n.id===editing?{...n,...form,updatedAt:now}:n));
    else setData(p=>[...p,{id:Date.now(),...form,createdAt:now,updatedAt:now}]);
    setModal(false);
  };
  const visible=data.filter(n=>!n.isArchived)
    .filter(n=>!search||(n.title+n.content+n.tags).toLowerCase().includes(search.toLowerCase()))
    .sort((a,b)=>b.isPinned-a.isPinned||(new Date(b.updatedAt)-new Date(a.updatedAt)));
  return (
    <div style={{padding:"0 13px 80px"}} className="fu">
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
        <div><div style={{fontWeight:700,fontSize:17}}>Notes</div><div style={{fontSize:12,color:C.muted}}>{data.filter(n=>!n.isArchived).length} notes</div></div>
        <Btn onClick={openNew}><Icon n="plus" s={14}/>New</Btn>
      </div>
      <Inp value={search} onChange={setSearch} placeholder="🔍  Search notes…" style={{marginBottom:14}}/>
      {visible.length===0?<Empty icon="file" msg="No notes yet"/>:
        visible.map(n=>(
          <Card key={n.id} onClick={()=>openEdit(n)} style={{borderLeft:n.isPinned?`3px solid ${C.accent}`:`1px solid ${C.border}`}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
              <div style={{flex:1,marginRight:8}}>
                <div style={{fontWeight:700,fontSize:14,marginBottom:3}}>{n.title}</div>
                <div style={{fontSize:12,color:C.muted,marginBottom:6,overflow:"hidden",
                  display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical"}}>{n.content}</div>
                <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
                  {n.category&&<Pill color={C.accent}>{n.category}</Pill>}
                  {n.tags&&n.tags.split(",").map(t=>t.trim()&&<Pill key={t} color={C.dim}>{t.trim()}</Pill>)}
                </div>
                <div style={{fontSize:10,color:C.muted,marginTop:4}}>{fmtFull(n.updatedAt)}</div>
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:4}} onClick={e=>e.stopPropagation()}>
                <Btn onClick={()=>setData(p=>p.map(x=>x.id===n.id?{...x,isPinned:!x.isPinned}:x))} variant="ghost" small>
                  <Icon n="pin" s={12} c={n.isPinned?C.accent:C.muted}/>
                </Btn>
                <Btn onClick={()=>setData(p=>p.filter(x=>x.id!==n.id))} variant="danger" small><Icon n="trash" s={12}/></Btn>
              </div>
            </div>
          </Card>
        ))}
      {modal&&(
        <Modal title={editing?"Edit Note":"New Note"} onClose={()=>setModal(false)}>
          <Fld label="Title"><Inp value={form.title} onChange={f("title")} placeholder="Note title"/></Fld>
          <Fld label="Content"><TA value={form.content} onChange={f("content")} placeholder="Write…" rows={5}/></Fld>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
            <Fld label="Category"><Inp value={form.category} onChange={f("category")} placeholder="Medical"/></Fld>
            <Fld label="Tags"><Inp value={form.tags} onChange={f("tags")} placeholder="health,diet"/></Fld>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}>
            <input type="checkbox" id="pin" checked={form.isPinned} onChange={e=>setForm(p=>({...p,isPinned:e.target.checked}))} style={{accentColor:C.accent,width:15,height:15}}/>
            <label htmlFor="pin" style={{fontSize:13}}>Pin this note</label>
          </div>
          <Btn onClick={save} style={{width:"100%",justifyContent:"center"}}>{editing?"Save Changes":"Create Note"}</Btn>
        </Modal>
      )}
    </div>
  );
};

// ─── Calendar ──────────────────────────────────────────────────────────────
const Calendar = ({birthdays,reminders}) => {
  const now=new Date();
  const [year,setYear]=useState(now.getFullYear());
  const [month,setMonth]=useState(now.getMonth());
  const [selDay,setSelDay]=useState(now.getDate());

  const prevM=()=>{if(month===0){setMonth(11);setYear(y=>y-1);}else setMonth(m=>m-1);setSelDay(null);};
  const nextM=()=>{if(month===11){setMonth(0);setYear(y=>y+1);}else setMonth(m=>m+1);setSelDay(null);};

  const firstDay=new Date(year,month,1).getDay();
  const dim=new Date(year,month+1,0).getDate();
  const dip=new Date(year,month,0).getDate();
  const isToday=(y,m,d)=>y===now.getFullYear()&&m===now.getMonth()&&d===now.getDate();

  const getEvents=d=>{
    const evs=[];
    const h=holidayForDay(month,d);
    if(h)evs.push({type:"holiday",...h});
    birthdays.forEach(b=>{
      const bd=new Date(b.birthdate);
      if(bd.getMonth()===month&&bd.getDate()===d) evs.push({type:"birthday",name:b.name,emoji:"🎂"});
    });
    reminders.filter(r=>!r.isArchived&&!r.isCompleted).forEach(r=>{
      const rd=new Date(r.time);
      if(rd.getFullYear()===year&&rd.getMonth()===month&&rd.getDate()===d)
        evs.push({type:"reminder",name:r.title,emoji:"🔔"});
    });
    return evs;
  };

  // Build cells
  const cells=[];
  for(let i=firstDay-1;i>=0;i--)cells.push({day:dip-i,cur:false});
  for(let d=1;d<=dim;d++)cells.push({day:d,cur:true});
  const rem=(7-(cells.length%7))%7;
  for(let d=1;d<=rem;d++)cells.push({day:d,cur:false});

  const selEvs=selDay?getEvents(selDay):[];
  const mHolidays=holidaysForMonth(month);

  return (
    <div style={{padding:"0 13px 80px"}} className="fu">
      {/* Month nav */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
        <Btn onClick={prevM} variant="ghost" small><Icon n="chevL" s={14}/></Btn>
        <div style={{textAlign:"center"}}>
          <div style={{fontWeight:700,fontSize:17}}>{MONTHS_L[month]} {year}</div>
          <div style={{fontSize:11,color:C.muted}}>{mHolidays.length} holidays this month</div>
        </div>
        <Btn onClick={nextM} variant="ghost" small><Icon n="chevR" s={14}/></Btn>
      </div>

      {/* Weekday header */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:2,marginBottom:3}}>
        {["Su","Mo","Tu","We","Th","Fr","Sa"].map(d=>(
          <div key={d} style={{textAlign:"center",fontSize:10,fontWeight:700,color:C.muted,padding:"3px 0"}}>{d}</div>
        ))}
      </div>

      {/* Grid */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:2,marginBottom:14}}>
        {cells.map((cell,i)=>{
          const evs=cell.cur?getEvents(cell.day):[];
          const hasH=evs.some(e=>e.type==="holiday");
          const hasB=evs.some(e=>e.type==="birthday");
          const hasR=evs.some(e=>e.type==="reminder");
          const isSel=cell.cur&&selDay===cell.day;
          const tod=cell.cur&&isToday(year,month,cell.day);
          return (
            <button key={i} onClick={()=>cell.cur&&setSelDay(cell.day)}
              style={{aspectRatio:"1",borderRadius:9,border:`1px solid ${isSel?C.accent:tod?`${C.accent}55`:C.border}`,
                background:isSel?C.accent:tod?C.accentGlow:C.card,cursor:cell.cur?"pointer":"default",
                opacity:cell.cur?1:.2,display:"flex",flexDirection:"column",alignItems:"center",
                justifyContent:"center",gap:1,padding:2,minHeight:34}}>
              <span style={{fontSize:11,fontWeight:tod||isSel?700:400,color:isSel?"#fff":tod?C.accent:C.text,lineHeight:1}}>{cell.day}</span>
              <div style={{display:"flex",gap:1}}>
                {hasH&&<div style={{width:4,height:4,borderRadius:"50%",background:isSel?"rgba(255,255,255,.8)":C.amber}}/>}
                {hasB&&<div style={{width:4,height:4,borderRadius:"50%",background:isSel?"rgba(255,255,255,.8)":C.purple}}/>}
                {hasR&&<div style={{width:4,height:4,borderRadius:"50%",background:isSel?"rgba(255,255,255,.8)":C.green}}/>}
              </div>
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div style={{display:"flex",gap:12,marginBottom:14,padding:"9px 13px",background:C.card,borderRadius:11,border:`1px solid ${C.border}`}}>
        {[{c:C.amber,l:"Holiday"},{c:C.purple,l:"Birthday"},{c:C.green,l:"Reminder"}].map(x=>(
          <div key={x.l} style={{display:"flex",alignItems:"center",gap:5,fontSize:11,color:C.muted}}>
            <div style={{width:7,height:7,borderRadius:"50%",background:x.c}}/>{x.l}
          </div>
        ))}
      </div>

      {/* Selected day */}
      {selDay&&(
        <div style={{marginBottom:14}}>
          <div style={{fontSize:10,fontWeight:700,color:"#8A9DC0",textTransform:"uppercase",letterSpacing:.8,marginBottom:8}}>
            {MONTHS_L[month]} {selDay} — {selEvs.length} event{selEvs.length!==1?"s":""}
          </div>
          {selEvs.length===0?(
            <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:"13px",textAlign:"center",fontSize:12,color:C.muted}}>
              No events on this day
            </div>
          ):selEvs.map((ev,i)=>(
            <div key={i} style={{background:C.card,borderRadius:12,padding:"11px 13px",marginBottom:7,
              borderLeft:`3px solid ${ev.type==="holiday"?C.amber:ev.type==="birthday"?C.purple:C.green}`,
              border:`1px solid ${C.border}`,display:"flex",gap:10,alignItems:"center"}}>
              <span style={{fontSize:20}}>{ev.emoji}</span>
              <div>
                <div style={{fontWeight:700,fontSize:13}}>{ev.name}</div>
                <div style={{fontSize:10,color:"#8A9DC0",textTransform:"capitalize"}}>{ev.type}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Holidays this month */}
      <div>
        <div style={{fontSize:10,fontWeight:700,color:"#8A9DC0",textTransform:"uppercase",letterSpacing:.8,marginBottom:8}}>
          All Holidays in {MONTHS_S[month]}
        </div>
        {mHolidays.length===0?(
          <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:"13px",textAlign:"center",fontSize:12,color:C.muted}}>No holidays this month</div>
        ):mHolidays.map((h,i)=>{
          const isPast=year===now.getFullYear()&&month===now.getMonth()&&h.day<now.getDate();
          const dl=Math.ceil((new Date(year,month,h.day)-now)/86400000);
          return (
            <div key={i} onClick={()=>setSelDay(h.day)}
              style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,
                padding:"10px 13px",marginBottom:7,display:"flex",justifyContent:"space-between",
                alignItems:"center",cursor:"pointer",opacity:isPast?.55:1}}>
              <div style={{display:"flex",gap:10,alignItems:"center"}}>
                <span style={{fontSize:20}}>{h.emoji}</span>
                <div>
                  <div style={{fontWeight:600,fontSize:13}}>{h.name}</div>
                  <div style={{fontSize:10,color:C.muted}}>{MONTHS_S[month]} {h.day} · {h.type}</div>
                </div>
              </div>
              {isPast?<Pill color="#6B8FBF">Past</Pill>:dl<=0?<Pill color={C.red}>Today!</Pill>:dl<=7?<Pill color={C.amber}>{dl}d</Pill>:<Pill color={C.muted}>{dl}d</Pill>}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ─── Nav Config ────────────────────────────────────────────────────────────
const NAV=[
  {k:"home",  i:"home", l:"Home"},
  {k:"bp",    i:"heart",l:"BP"},
  {k:"bday",  i:"cake", l:"Bdays"},
  {k:"meals", i:"fork", l:"Meals"},
  {k:"remind",i:"bell", l:"Alerts"},
  {k:"notes", i:"file", l:"Notes"},
  {k:"cal",   i:"cal",  l:"Cal"},
];

// ─── App Root ──────────────────────────────────────────────────────────────
export default function App(){
  const [tab,setTab]=useState("home");
  const [bp,setBp]=useState(SEED.bp);
  const [birthdays,setBirthdays]=useState(SEED.birthdays);
  const [meals,setMeals]=useState(SEED.meals);
  const [reminders,setReminders]=useState(SEED.reminders);
  const [notes,setNotes]=useState(SEED.notes);

  const pages={
    home:   <Dashboard bp={bp} birthdays={birthdays} reminders={reminders} notes={notes} meals={meals}/>,
    bp:     <BloodPressure data={bp} setData={setBp}/>,
    bday:   <Birthdays data={birthdays} setData={setBirthdays}/>,
    meals:  <MealPlans data={meals} setData={setMeals}/>,
    remind: <Reminders data={reminders} setData={setReminders}/>,
    notes:  <Notes data={notes} setData={setNotes}/>,
    cal:    <Calendar birthdays={birthdays} reminders={reminders}/>,
  };

  return (
    <>
      <style>{gCSS}</style>
      <div style={{maxWidth:480,margin:"0 auto",height:"100vh",height:"100dvh",display:"flex",
        flexDirection:"column",background:C.bg,position:"fixed",top:0,left:0,right:0,bottom:0,
        marginLeft:"auto",marginRight:"auto"}}>
        {/* Header */}
        <div style={{padding:"11px 15px 9px",background:C.surface,borderBottom:`1px solid ${C.border}`,flexShrink:0}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{width:28,height:28,borderRadius:8,
              background:`linear-gradient(135deg,${C.accent},${C.purple})`,
              display:"flex",alignItems:"center",justifyContent:"center"}}>
              <Icon n="star" s={13} c="#fff"/>
            </div>
            <div>
              <div style={{fontWeight:700,fontSize:14,lineHeight:1}}>My Smart Assistant</div>
              <div style={{fontSize:10,color:C.muted,lineHeight:1.4}}>{NAV.find(n=>n.k===tab)?.l}</div>
            </div>
          </div>
        </div>
        {/* Page */}
        <div style={{flex:1,overflowY:"auto",paddingTop:12}} key={tab}>
          {pages[tab]}
        </div>
        {/* Bottom nav */}
        <div style={{background:C.surface,borderTop:`1px solid ${C.border}`,display:"flex",flexShrink:0,
          paddingBottom:"env(safe-area-inset-bottom,12px)"}}>
          {NAV.map(n=>(
            <button key={n.k} onClick={()=>setTab(n.k)}
              style={{flex:1,padding:"10px 0 8px",display:"flex",flexDirection:"column",alignItems:"center",gap:3,
                background:"none",border:"none",color:tab===n.k?C.accent:C.muted,transition:"color .15s",position:"relative",minHeight:56}}>
              <div style={{transform:tab===n.k?"scale(1.2)":"scale(1)",transition:"transform .15s"}}>
                <Icon n={n.i} s={17} c={tab===n.k?C.accent:C.muted}/>
              </div>
              <span style={{fontSize:8,fontWeight:700,letterSpacing:.3,textTransform:"uppercase"}}>{n.l}</span>
              {tab===n.k&&<span style={{position:"absolute",top:0,left:"50%",transform:"translateX(-50%)",width:18,height:2,background:C.accent,borderRadius:2}}/>}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
