# Sun Movement Project

This repository contains the Sun Movement application which consists of a .NET Core backend and a Next.js frontend.

## Project Structure
- `sun-movement-backend`: .NET Core backend application
- `sun-movement-frontend`: Next.js frontend application

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- [Git](https://git-scm.com/downloads)
- [.NET SDK 8.0 or later](https://dotnet.microsoft.com/download)
- [Node.js 20.x or later](https://nodejs.org/)
- [SQL Server](https://www.microsoft.com/en-us/sql-server/sql-server-downloads) (or SQL Server Express)
- A code editor such as [Visual Studio Code](https://code.visualstudio.com/) or [Visual Studio](https://visualstudio.microsoft.com/)

### Cloning the Repository

1. Open a terminal or command prompt
2. Clone the repository using Git:
   ```
   git clone https://github.com/quancoi2ka3/DATN.git
   ```
3. Navigate to the project directory:
   ```
   cd DATN
   ```

## Running the Backend

1. Navigate to the backend project directory:
   ```
   cd sun-movement-backend
   ```

2. Restore NuGet packages:
   ```
   dotnet restore SunMovement.sln
   ```

3. Update the database connection string in `SunMovement.Web/appsettings.json` to match your SQL Server instance.

4. Apply database migrations:
   ```
   cd SunMovement.Web
   dotnet ef database update
   ```

5. Run the backend application:
   ```
   dotnet run
   ```
   The API should now be running at `https://localhost:5001` and `http://localhost:5000`.

## Running the Frontend

1. Navigate to the frontend project directory:
   ```
   cd sun-movement-frontend
   ```

2. Install npm packages:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm run dev
   ```
   The frontend should now be running at `http://localhost:3000`.

## Making Changes and Updating GitHub

### Workflow for Making Changes

1. Before starting work, always pull the latest changes:
   ```
   git pull
   ```

2. Make your changes to the codebase.

3. Stage the changes you want to commit:
   ```
   git add .
   ```
   Or to add specific files:
   ```
   git add path/to/file1 path/to/file2
   ```

4. Commit your changes with a meaningful message:
   ```
   git commit -m "A clear description of the changes"
   ```

5. Push your changes to GitHub:
   ```
   git push
   ```

### Best Practices for Collaborative Development

1. **Create Feature Branches**:
   ```
   git checkout -b feature/your-feature-name
   ```

2. **Regular Updates**: Pull changes regularly to avoid conflicts:
   ```
   git pull origin master
   ```

3. **Meaningful Commits**: Write clear commit messages that explain what and why, not how.

4. **Pull Requests**: Instead of pushing directly to master, create a pull request:
   ```
   git push origin feature/your-feature-name
   ```
   Then create a pull request on GitHub.

5. **Code Review**: Have team members review your code before merging into master.

## Continuous Integration/Continuous Deployment (CI/CD)

This project is set up with GitHub Actions workflows that automatically build and test the code when changes are pushed. The workflows are located in the `.github/workflows` directory.

- Backend workflow: `.github/workflows/backend.yml`
- Frontend workflow: `.github/workflows/frontend.yml`

These workflows will help ensure that code quality is maintained as the project evolves.

## Troubleshooting

### Common Backend Issues

- Database connection issues: Verify the connection string in `appsettings.json`
- Migration errors: Ensure you're running migrations from the correct directory

### Common Frontend Issues

- Node module issues: Try deleting the `node_modules` folder and running `npm install` again
- Next.js build errors: Check that all imports are correct and that components are properly exported

## License

This project is licensed under the MIT License - see the LICENSE file for details.