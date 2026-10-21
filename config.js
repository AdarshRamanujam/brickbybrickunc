// Pick ONE way to store reports (or leave everything empty for "this browser only"):
//
// A) Your own PC running server.js.
//      - If people open the site through server.js itself, you don't need to edit anything.
//      - If the site is on GitHub Pages, put the public tunnel address here, e.g.
//        apiUrl: "https://random-words.trycloudflare.com/api"
//
// B) Supabase (always on, no PC needed): fill in the two Supabase lines.
window.BRICK_CONFIG = {
  apiUrl: "",
  supabaseUrl: "",
  supabaseKey: ""
};
