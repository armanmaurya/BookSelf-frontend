# Setup
This portion will guide you to set up project across different apps

Run below command at the root level of project
```
yarn install
```

## Web
Create a new .env file in the `apps/web` and Provide these information
```
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000 
NEXT_PUBLIC_GOOGLE_OAUTH2_CLIENT_ID = <Client-Id>
NEXT_PUBLIC_GOGGLE_REDIRECT_URL_ENDPOINT=http://127.0.0.1:3000
``` 
# Run Project
Run without turbo 
```
yarn workspace web run dev
```

Run with Turbo
```
yarn dev --filter=web
```

# Git Commands
Change the Last commit Message
```
git commit --amend
```
Force Push over the Old commit
```
git push --force origin example-branch
```

# TO-DO
- [ ] Math Support
- [ ] Mermaid Support

