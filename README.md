# Project Setup

This guide will help you set up and run the project across different apps.

## Prerequisites

Make sure you have the following installed:
- [Node.js](https://nodejs.org/)
- [Yarn](https://yarnpkg.com/)

## Installation

Run the following command at the root level of the project to install all dependencies:

```bash
yarn install
```

## Web Application Setup

1. Create a new `.env` file in the `apps/web` directory and provide the following information:

```
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000 
NEXT_PUBLIC_GOOGLE_OAUTH2_CLIENT_ID=<Client-Id>
NEXT_PUBLIC_GOOGLE_REDIRECT_URL_ENDPOINT=http://127.0.0.1:3000
```

2. Run the web application:
    - **Without Turbo**
    ```bash
    yarn workspace web run dev
    ```
    - **With Turbo**
    ```bash
    yarn dev:web
    ```

## Contributing

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes.
4. Commit your changes (`git commit -m 'Add some feature'`).
5. Push to the branch (`git push origin feature-branch`).
6. Open a pull request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

If you have any questions, feel free to reach out:

- Email: [your-email@example.com](mailto:your-email@example.com)
- GitHub: [your-github-username](https://github.com/your-github-username)

