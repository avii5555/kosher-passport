// ---------- Sample kosher directory data ----------
// This is SAMPLE / DEMO data only — names, hechsherim, and descriptions here
// are illustrative and have NOT been independently verified. Before relying
// on this for a real trip, replace this file with data sourced from a real
// kashrut authority, a local Chabad house, or your own verified research.
// See .claude/agents/kosher-passport-builder.md for the data-sourcing plan.

const DATA = {
  Rome: [
    {id:'r1', cat:'restaurant', name:"Ba'Ghetto", desc:"Roman-Jewish trattoria in the old ghetto, known for carciofi alla giudia.", hechsher:"OU", level:"Mehadrin", tags:["Meat","Dinner"]},
    {id:'r2', cat:'restaurant', name:"Yotvata Kosher Deli", desc:"Fast, casual deli near the synagogue — sandwiches and salads.", hechsher:"Rabbanut", level:"Standard", tags:["Dairy","Lunch"]},
    {id:'r3', cat:'hotel', name:"Hotel Artemide", desc:"Central hotel with a kosher breakfast option arranged on request.", hechsher:"On request", level:"Standard", tags:["4-star","Central"]},
    {id:'r4', cat:'synagogue', name:"Tempio Maggiore di Roma", desc:"The Great Synagogue of Rome, on the Tiber — daily minyan.", hechsher:"—", level:"—", tags:["Daily minyan","Historic"]},
    {id:'r5', cat:'store', name:"Kosher World Roma", desc:"Grocery in the Jewish Quarter stocking packaged kosher goods.", hechsher:"OU", level:"Standard", tags:["Groceries"]},
  ],
  Paris: [
    {id:'p1', cat:'restaurant', name:"Le Marais Kosher Grill", desc:"Classic meat grill in the Marais, popular with tourists and locals alike.", hechsher:"Beth Din de Paris", level:"Mehadrin", tags:["Meat","Dinner"]},
    {id:'p2', cat:'restaurant', name:"Boulangerie Korcarz", desc:"Kosher bakery with pastries, bread, and a small lunch counter.", hechsher:"Beth Din de Paris", level:"Pas Yisrael", tags:["Dairy","Bakery"]},
    {id:'p3', cat:'hotel', name:"Hotel Bastille de Launay", desc:"Boutique hotel near several kosher restaurants in the 11th.", hechsher:"On request", level:"Standard", tags:["3-star","Walkable"]},
    {id:'p4', cat:'synagogue', name:"Synagogue de la Victoire", desc:"Grand Paris synagogue, the seat of the Chief Rabbi of France.", hechsher:"—", level:"—", tags:["Daily minyan","Historic"]},
    {id:'p5', cat:'store', name:"Naouri Cacherland", desc:"Large kosher supermarket chain, several central locations.", hechsher:"Beth Din de Paris", level:"Standard", tags:["Groceries"]},
  ],
  Bangkok: [
    {id:'b1', cat:'restaurant', name:"Bangkok Chabad House Kitchen", desc:"Meals for travelers, reservations recommended during holidays.", hechsher:"Chabad Thailand", level:"Mehadrin", tags:["Meat","Dinner"]},
    {id:'b2', cat:'restaurant', name:"Or Menachem Cafe", desc:"Casual dairy cafe near Khao San, popular with backpackers.", hechsher:"Chabad Thailand", level:"Chalav Yisrael", tags:["Dairy","Lunch"]},
    {id:'b3', cat:'hotel', name:"Buddy Lodge", desc:"Central hotel; kosher meal delivery arranged via nearby Chabad.", hechsher:"On request", level:"Standard", tags:["Central","Khao San"]},
    {id:'b4', cat:'synagogue', name:"Even Chen Synagogue", desc:"Bangkok's main Sephardic synagogue, active daily minyanim.", hechsher:"—", level:"—", tags:["Daily minyan"]},
    {id:'b5', cat:'store', name:"Chabad House Grocery Corner", desc:"Small kosher pantry stocked for travelers, essentials only.", hechsher:"Chabad Thailand", level:"Standard", tags:["Groceries"]},
  ],
  London: [
    {id:'l1', cat:'restaurant', name:"Reubens Restaurant", desc:"Long-running meat restaurant and deli in Marylebone.", hechsher:"KLBD", level:"Mehadrin", tags:["Meat","Dinner"]},
    {id:'l2', cat:'restaurant', name:"Met Su Yan", desc:"Kosher Chinese food in Golders Green, a neighborhood favorite.", hechsher:"KLBD", level:"Standard", tags:["Meat","Lunch"]},
    {id:'l3', cat:'hotel', name:"The Bristol Hotel Golders Green", desc:"Small hotel in a heavily Jewish neighborhood, walk to shuls and shops.", hechsher:"On request", level:"Standard", tags:["Central","Golders Green"]},
    {id:'l4', cat:'synagogue', name:"Western Marble Arch Synagogue", desc:"Central London synagogue with regular weekday and Shabbat services.", hechsher:"—", level:"—", tags:["Daily minyan","Central"]},
    {id:'l5', cat:'store', name:"Kosher Kingdom", desc:"Large kosher supermarket on Golders Green Road.", hechsher:"KLBD", level:"Standard", tags:["Groceries"]},
  ],
  Barcelona: [
    {id:'ba1', cat:'restaurant', name:"Maccabi Restaurant", desc:"Kosher restaurant run by the local Jewish community, near the synagogue.", hechsher:"Comunitat Israelita de Barcelona", level:"Standard", tags:["Meat","Dinner"]},
    {id:'ba2', cat:'restaurant', name:"Jaffa Cafe", desc:"Casual dairy and fish cafe close to the Gothic Quarter.", hechsher:"Comunitat Israelita de Barcelona", level:"Standard", tags:["Dairy","Lunch"]},
    {id:'ba3', cat:'hotel', name:"Hotel Colon", desc:"Hotel opposite the cathedral; kosher breakfast box arranged on request.", hechsher:"On request", level:"Standard", tags:["Central"]},
    {id:'ba4', cat:'synagogue', name:"Comunitat Israelita de Barcelona", desc:"The city's main synagogue, active since the early 20th century.", hechsher:"—", level:"—", tags:["Shabbat services"]},
    {id:'ba5', cat:'store', name:"Kosher Corner Barcelona", desc:"Small grocery stocking imported kosher packaged goods.", hechsher:"OU", level:"Standard", tags:["Groceries"]},
  ],
  Prague: [
    {id:'pr1', cat:'restaurant', name:"Shalom Restaurant", desc:"Kosher dining in the Jewish Quarter, steps from the Old-New Synagogue.", hechsher:"Chabad Prague", level:"Mehadrin", tags:["Meat","Dinner"]},
    {id:'pr2', cat:'restaurant', name:"King Solomon Kosher Restaurant", desc:"Long-standing kosher restaurant near the Spanish Synagogue.", hechsher:"Chief Rabbi of Prague", level:"Chalav Yisrael", tags:["Meat","Lunch"]},
    {id:'pr3', cat:'hotel', name:"Hotel Josef", desc:"Design hotel in the Jewish Quarter, walkable to all sites.", hechsher:"On request", level:"Standard", tags:["Central","Design"]},
    {id:'pr4', cat:'synagogue', name:"Old-New Synagogue", desc:"Europe's oldest active synagogue, in continuous use since the 13th century.", hechsher:"—", level:"—", tags:["Historic","Daily minyan"]},
    {id:'pr5', cat:'store', name:"Chabad Prague Pantry", desc:"Small kosher grocery corner run by the local Chabad house.", hechsher:"Chabad Prague", level:"Standard", tags:["Groceries"]},
  ],
  Tokyo: [
    {id:'t1', cat:'restaurant', name:"Chabad Tokyo Kitchen", desc:"Meals for travelers by reservation, especially around Jewish holidays.", hechsher:"Chabad Japan", level:"Mehadrin", tags:["Meat","Dinner"]},
    {id:'t2', cat:'hotel', name:"Shibuya Excel Hotel Tokyu", desc:"Central hotel; kosher meal delivery arranged through Chabad Tokyo.", hechsher:"On request", level:"Standard", tags:["Central","Shibuya"]},
    {id:'t3', cat:'synagogue', name:"Jewish Community of Japan", desc:"Tokyo's main synagogue and community center, Shabbat services weekly.", hechsher:"—", level:"—", tags:["Shabbat services"]},
    {id:'t4', cat:'store', name:"Chabad Tokyo Pantry Corner", desc:"Small stock of packaged kosher essentials for travelers.", hechsher:"Chabad Japan", level:"Standard", tags:["Groceries"]},
  ],
  BuenosAires: [
    {id:'bu1', cat:'restaurant', name:"El Galpon Kosher Parrilla", desc:"Kosher Argentine steakhouse, a rare place to get real asado kosher.", hechsher:"AMIA", level:"Mehadrin", tags:["Meat","Dinner"]},
    {id:'bu2', cat:'restaurant', name:"Mokka Cafe", desc:"Dairy cafe in the Once neighborhood, popular for breakfast.", hechsher:"AMIA", level:"Chalav Yisrael", tags:["Dairy","Breakfast"]},
    {id:'bu3', cat:'hotel', name:"Hotel Once", desc:"Budget-friendly hotel in the Jewish quarter, walk to shuls and shops.", hechsher:"On request", level:"Standard", tags:["Central","Once"]},
    {id:'bu4', cat:'synagogue', name:"Templo Libertad", desc:"Buenos Aires' historic main synagogue, adjoining the Jewish museum.", hechsher:"—", level:"—", tags:["Historic","Shabbat services"]},
    {id:'bu5', cat:'store', name:"Supermercado Kosher Once", desc:"Full kosher supermarket in the Once neighborhood.", hechsher:"AMIA", level:"Standard", tags:["Groceries"]},
  ]
};

const CITY_META = {
  Rome: {country:"Italy"},
  Paris: {country:"France"},
  Bangkok: {country:"Thailand"},
  London: {country:"United Kingdom"},
  Barcelona: {country:"Spain"},
  Prague: {country:"Czechia"},
  Tokyo: {country:"Japan"},
  BuenosAires: {country:"Argentina"}
};
