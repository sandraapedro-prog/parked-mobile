
### What is PARKED.?

PARKED. is an idea and hobby parking lot where users can “park” their ideas and hobbies in a simple and judgement-free way. Instead of letting it clutter their brain or do-to list, users can organise and pause things they mean to come back to. Not abandoned, just parked. 

### The Problem

Many people collect ideas and hobbies faster than they can act on them. 
This often leads to:
- Mental Overload
- Forgotten Ideas
- Guilt from unfinished projects

### The Solution

- Park ideas or hobbies for later
- Unpark them when you're ready to give it attention
- Revisit them through gentle check-in reminders

### Features
- **Park an idea or hobby:** 
Add title, description, category, and energy level<br>
- **Check-in system:**
Set optional dates to revisit ideas and hobbies<br>
- **Dashboard overview:**
View all ideas and hobbies and see what’s due for attention<br>
- **Unpark & revive:**
Move ideas or hobbies back into active focus<br>
- **Snooze functionality:**
Delay check-ins when you’re not ready<br>
- **Release ideas:**
Let go without guilt<br>
- **Archive system:**
Manage active vs parked ideas and hobbies<br>

<img width="1920" height="auto" alt="4" src="https://github.com/user-attachments/assets/249102bd-587c-4304-b9ca-bc5e177fb54f" />

### Demo & Try it on your phone
Scan the QR code below using Expo Go to open the app instantly.

<img width="302" height="auto" alt="Add Item Gif" src="https://github.com/user-attachments/assets/30ae9678-161b-47d6-8055-5cf900e75d15" /> 
<img width="460" height="auto" alt="DEMO QR Code" src="https://github.com/user-attachments/assets/26094c68-22be-4f91-bdf6-7e0532c9b73d" />


### Design process & Early Wireframes
PARKED. started as a simple idea sketched on paper, focusing on reducing mental clutter without adding pressure by creating quick hand-drawn layouts to explore structure and user flow. 
After this, the interface was refined on Figma focusing on calm, minimal, and distraction-free design.

<img width="1920" height="auto" alt="Wireframes_Figma_Designs" src="https://github.com/user-attachments/assets/041f6ac2-b65d-497c-8c63-eccca4478014" />

<details>
  <summary><strong>Tech Stack</strong></summary><br>

<strong>Framework & Language:</strong><br>
- React Native 0.81 with Expo SDK 54<br>
- TypeScript 5.9<br>
- Expo Router 6<br>
<br>
<strong>UI & Styling:</strong><br>
- StyleSheet<br>
- expo-linear-gradient, expo-blur<br>
- reanimated + gesture-handler<br>
- safe-area-context<br>
- vector-icons<br>
- Custom fonts<br>
<br>
<strong>State & Storage:</strong><br>
- React Context<br>
- AsyncStorage<br>
- Zod<br>
<br>
<strong>Build & Deploy:</strong><br>
- Node.js build script<br>
- Custom server<br>
- Replit deployment<br>
</details>

<details>
<summary><strong>Full Project Structure</strong></summary><br>

The architecture separates UI, state, and logic to keep the app maintainable and easy to scale.
<br>
<pre>
app/
  index.tsx
  welcome.tsx
  sign-in.tsx
  register.tsx
  _layout.tsx
  (app)/
    index.tsx
    active.tsx
    park.tsx
    item/[id].tsx
    park-again/
    trash.tsx
    settings.tsx

components/
  Button, Input, Pill, ItemCard, etc.

contexts/
  AuthContext
  ItemsContext

lib/
  storage.ts
  format.ts
  fonts.ts
  confirm.ts
  categoryColors.ts

constants/
  colors.ts
  parked.ts

scripts/build.js
server/serve.js
</pre>

</details>

### License
MIT

### Author
Sandra Pedro<br>
<a href="https://github.com/sandraapedro-prog?tab=repositories" target="_blank">GitHub</a><br>
<a href="https://www.linkedin.com/in/sandra-p-485753357" target="_blank">LinkedIn</a>
