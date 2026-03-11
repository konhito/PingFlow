const chalk = require("chalk");
const gradient = require("gradient-string").default;

const logoGradient = gradient("#ff512f", "#dd2476");
const textGradient = gradient("#00c6ff", "#0072ff");

const logo = `
██████╗ ██╗███╗   ██╗ ██████╗ ███████╗██╗      ██████╗ ██╗    ██╗
██╔══██╗██║████╗  ██║██╔════╝ ██╔════╝██║     ██╔═══██╗██║    ██║
██████╔╝██║██╔██╗ ██║██║  ███╗█████╗  ██║     ██║   ██║██║ █╗ ██║
██╔═══╝ ██║██║╚██╗██║██║   ██║██╔══╝  ██║     ██║   ██║██║███╗██║
██║     ██║██║ ╚████║╚██████╔╝██║     ███████╗╚██████╔╝╚███╔███╔╝
╚═╝     ╚═╝╚═╝  ╚═══╝ ╚═════╝ ╚═╝     ╚══════╝ ╚═════╝  ╚══╝╚══╝
`;

console.log(logoGradient(logo));

console.log(
  textGradient(`
🚀 Booting PingFlow Dev Server
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚡ Framework  : Next.js
🌐 Local URL  : http://localhost:3000
📦 Environment: development
🧠 Status     : Initializing modules...

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`),
);
