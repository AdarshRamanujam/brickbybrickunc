# UNC Brick Issue Map: setup guide

Files in this folder:

| File | What it is |
|---|---|
| `index.html` | The website (map, photo upload, issue-type dropdown) |
| `config.js` | Tells the site where to store reports |
| `server.js` | A small server for your PC. It saves photos and reports to folders. No installs needed beyond Node.js |
| `start-windows.bat` | Double-click to start the server on Windows |
| `supabase.sql` | Only needed if you choose the always-on Supabase option instead |

Photos are shrunk in the browser before upload (longest side 1280 px, JPEG quality 0.7, usually 150-400 KB).
The GPS position is read from the original photo first and saved with the report, so the pin lands in the right place.
The map shows each report's photo in a popup at its pin. Hovering a pin shows a small preview.

---

## Part 1: Run it on your PC (photos saved to a folder)

1. Install Node.js (the LTS version) from https://nodejs.org. Accept the defaults.
2. Put this folder somewhere permanent, for example `C:\brick-map`.
3. Double-click **start-windows.bat**. Type an editor password when asked. That password is how you edit or delete reports later.
   - Mac/Linux: open a terminal in the folder and run `ADMIN_PASSWORD=pickone node server.js`
4. Open **http://localhost:3000** in your browser. Add a photo and it appears on the map.

Where things are saved, inside the same folder:
- `photos/` has the compressed photos (a small thumbnail and a bigger copy for each report)
- `data/reports.json` has the locations, issue types, notes and dates

Back up the folder to back up everything. Leave the black server window open: closing it stops the site.

### Letting other people use it

- **Same Wi-Fi** (for example a campus meeting): find your PC's address (`ipconfig` shows "IPv4 Address", such as 10.1.2.3) and have people open `http://10.1.2.3:3000`. Windows may ask to allow Node through the firewall: allow it for private networks.
- **Anyone, anywhere (free):** use a Cloudflare quick tunnel. It gives your PC a public https address without opening any router ports.
  1. Install it: in a Windows terminal, `winget install --id Cloudflare.cloudflared`
  2. With the server running, in a second terminal: `cloudflared tunnel --url http://localhost:3000`
  3. It prints an address like `https://random-words.trycloudflare.com`. Send that link to people.
  4. The address changes every time you restart the tunnel. A permanent address needs a free Cloudflare account plus a domain name.

The site only works while your PC is on, the server window is open and (for outside access) the tunnel is running.

---

## Part 2: Put the website on GitHub Pages

GitHub Pages hosts only the page itself. It cannot store photos, so the photos still go to your PC through the tunnel. If you don't need a fixed address, skip this part and just share the tunnel link from Part 1.

1. Create a free account at https://github.com, then click **New repository**. Name it `brick-map`. Set it to **Public** and click **Create**.
2. On the new repo's page click **uploading an existing file**. Drag in `index.html` and `config.js` (and `README.md` if you like). Do **not** upload `photos/` or `data/`. Click **Commit changes**.
3. Go to **Settings > Pages**. Under "Build and deployment" choose **Deploy from a branch**, branch `main`, folder `/ (root)`, then **Save**.
4. After a minute your site is live at `https://YOUR-USERNAME.github.io/brick-map/`.
5. Connect it to your PC. Open `config.js` on GitHub (pencil icon) and set:
   ```js
   window.BRICK_CONFIG = {
     apiUrl: "https://random-words.trycloudflare.com/api",
     supabaseUrl: "",
     supabaseKey: ""
   };
   ```
   using your current tunnel address, and keep the `/api` on the end. Commit the change.
6. Restart the server so it accepts requests from your GitHub site. In the terminal first set the allowed origin, then run it:
   - Windows (cmd): `set ALLOW_ORIGIN=https://YOUR-USERNAME.github.io` then `start-windows.bat`
   - Mac/Linux: `ALLOW_ORIGIN=https://YOUR-USERNAME.github.io ADMIN_PASSWORD=pickone node server.js`

Every time the quick-tunnel address changes you must update `apiUrl` in `config.js` on GitHub. That is the main drawback of this setup.

---

## Part 3 (alternative): Always-on, no PC needed

If you want the site to work when your PC is off, use Supabase's free tier instead of `server.js`:

1. Create a project at https://supabase.com. In **SQL Editor** paste and run `supabase.sql`.
2. In Project Settings > API copy the Project URL and the anon key into `supabaseUrl` and `supabaseKey` in `config.js`. Leave `apiUrl` empty.
3. In Authentication > Users add an editor account, and turn off public sign-ups.
4. Host the folder on GitHub Pages (steps 1-4 above) or Netlify Drop.

Anyone with the link can view and add reports. Only signed-in editors can edit or delete.

---

## Good to know

- **Campus box:** edit `BOUNDS` near the top of the script in `index.html`, and the `LAT`/`LNG` lines in `server.js` (or the numbers in `supabase.sql`).
- **Photos without GPS:** the upload window asks you to click the map to place them.
- **Safety:** the server accepts only JPEGs, limits sizes, rejects locations outside campus, and only changes or deletes reports when the editor password is sent. Anyone with the link can still add reports, so check the map occasionally.
- **Satellite imagery:** Esri World Imagery (default) is free with attribution for light use. USGS imagery and OpenStreetMap are in the layer picker.
