# Setup for App to source locales from ContentStack


1. Set variables in ./src/App.js:
```
    const STACK_API_KEY='<STACK_API_KEY_HERE>';
    const ACCESS_TOKEN='<ACCESS_TOKEN_HERE>';
```
2. Set ADO Personal Access Token (PAT) as environment variable:
```
    export NPM_TOKEN=<TOKEN GOES HERE>
```  
3. Get on corporate VPN
4. npm i
5. npm run start 

Visit http://localhost:3000

Look for a SystemDown message.  Notice its translated text from the ContentStack entry "Common".

