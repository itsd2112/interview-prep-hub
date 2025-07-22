# Contributing Guide

Thank you for your interest in contributing to Interview Prep Hub! This guide will help you get started with contributing to this project.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Contribution Workflow](#contribution-workflow)
- [Coding Standards](#coding-standards)
- [Testing Guidelines](#testing-guidelines)
- [Documentation](#documentation)
- [Pull Request Process](#pull-request-process)

## Code of Conduct

This project follows a standard code of conduct. Please be respectful and constructive in all interactions.

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn
- MongoDB (local or cloud)
- Git
- Code editor (VS Code recommended)

### Development Setup

1. **Fork and clone the repository:**
```bash
git clone https://github.com/your-username/interview-prep-hub.git
cd interview-prep-hub
```

2. **Backend setup:**
```bash
cd backend
npm install
cp .env.example .env  # Configure your environment variables
npm run dev
```

3. **Frontend setup:**
```bash
cd frontend
npm install
npm start
```

4. **Verify setup:**
- Backend: http://localhost:8080
- Frontend: http://localhost:4200

## Contribution Workflow

### 1. Create a Feature Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

### 2. Make Your Changes

Follow the coding standards and ensure your changes are well-tested.

### 3. Commit Your Changes

Use conventional commit messages:

```bash
git commit -m "feat: add new question category filter"
git commit -m "fix: resolve CORS issue in production"
git commit -m "docs: update API documentation"
```

**Commit Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### 4. Push and Create Pull Request

```bash
git push origin feature/your-feature-name
```

Then create a pull request on GitHub.

## Coding Standards

### TypeScript/JavaScript

- Use TypeScript for all new code
- Follow ESLint configuration
- Use meaningful variable and function names
- Add JSDoc comments for public APIs

**Example:**
```typescript
/**
 * Retrieves questions filtered by category
 * @param category - The category to filter by
 * @returns Promise resolving to array of questions
 */
export const getQuestionsByCategory = async (category: string): Promise<Question[]> => {
  // Implementation
};
```

### Backend Standards

- Use async/await instead of callbacks
- Implement proper error handling
- Follow RESTful API conventions
- Use environment variables for configuration

**Example Controller:**
```typescript
export const getQuestions = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category } = req.params;
    const questions = await QuestionModel.find({ category });
    res.json(questions);
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
```

### Frontend Standards

- Use Angular best practices
- Implement OnPush change detection where applicable
- Use Angular Signals for state management
- Follow Angular style guide

**Example Component:**
```typescript
@Component({
  selector: 'app-question-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `...`
})
export class QuestionListComponent implements OnInit {
  questions = signal<Question[]>([]);
  
  constructor(private questionsService: QuestionsService) {}
  
  ngOnInit(): void {
    this.loadQuestions();
  }
  
  private loadQuestions(): void {
    this.questionsService.getQuestions().subscribe({
      next: (questions) => this.questions.set(questions),
      error: (error) => console.error('Failed to load questions:', error)
    });
  }
}
```

## Testing Guidelines

### Backend Testing

Use Jest for backend testing:

```typescript
describe('QuestionController', () => {
  describe('getQuestionsByCategory', () => {
    it('should return questions for valid category', async () => {
      // Test implementation
    });
    
    it('should handle database errors gracefully', async () => {
      // Test implementation
    });
  });
});
```

### Frontend Testing

Use Jasmine/Karma for Angular testing:

```typescript
describe('QuestionsComponent', () => {
  let component: QuestionsComponent;
  let fixture: ComponentFixture<QuestionsComponent>;
  let questionsService: jasmine.SpyObj<QuestionsService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('QuestionsService', ['getQuestions']);
    
    TestBed.configureTestingModule({
      imports: [QuestionsComponent],
      providers: [
        { provide: QuestionsService, useValue: spy }
      ]
    });
    
    fixture = TestBed.createComponent(QuestionsComponent);
    component = fixture.componentInstance;
    questionsService = TestBed.inject(QuestionsService) as jasmine.SpyObj<QuestionsService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
```

### Running Tests

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

## Documentation

### Code Documentation

- Add JSDoc comments for all public APIs
- Include examples in documentation
- Update README.md for significant changes

### API Documentation

When adding new endpoints, update `docs/API.md`:

```markdown
#### New Endpoint Name

**Endpoint:** `METHOD /path`

**Description:** Brief description of what this endpoint does.

**Parameters:**
| Parameter | Type | Description | Required |
|-----------|------|-------------|----------|
| param1 | string | Description | Yes |

**Response:**
```json
{
  "example": "response"
}
```

**Example Request:**
```bash
curl -X GET http://localhost:8080/api/new-endpoint
```
```

## Pull Request Process

### Before Submitting

1. **Test your changes:**
```bash
# Run all tests
npm test

# Check TypeScript compilation
npm run build

# Lint your code
npm run lint
```

2. **Update documentation:**
- Update relevant documentation files
- Add/update API documentation if needed
- Update README.md if necessary

3. **Check your commits:**
- Use conventional commit messages
- Squash related commits if needed
- Ensure commit history is clean

### Pull Request Template

When creating a pull request, include:

```markdown
## Description
Brief description of changes made.

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Refactoring
- [ ] Performance improvement

## Testing
- [ ] Tests pass locally
- [ ] Added new tests for changes
- [ ] Manual testing completed

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No breaking changes (or clearly documented)
```

### Review Process

1. **Automated checks:** Ensure all CI checks pass
2. **Code review:** Address reviewer feedback
3. **Testing:** Verify functionality works as expected
4. **Documentation:** Ensure docs are updated
5. **Merge:** Maintainer will merge when approved

## Issue Guidelines

### Reporting Bugs

Use the bug report template:

```markdown
**Bug Description**
Clear description of the bug.

**Steps to Reproduce**
1. Step one
2. Step two
3. Step three

**Expected Behavior**
What should happen.

**Actual Behavior**
What actually happens.

**Environment**
- OS: [e.g., macOS, Windows, Linux]
- Node.js version: [e.g., 18.17.0]
- Browser: [e.g., Chrome 91]
```

### Feature Requests

Use the feature request template:

```markdown
**Feature Description**
Clear description of the proposed feature.

**Use Case**
Why is this feature needed?

**Proposed Solution**
How should this be implemented?

**Additional Context**
Any other relevant information.
```

## Development Tips

### Useful Commands

```bash
# Backend development
npm run dev          # Start development server
npm run build        # Build TypeScript
npm run lint         # Run ESLint
npm run test         # Run tests

# Frontend development
npm start            # Start development server
npm run build        # Build for production
npm run test         # Run tests
npm run lint         # Run ESLint
```

### Debugging

- Use VS Code debugger for both frontend and backend
- Enable source maps for better debugging experience
- Use browser dev tools for frontend debugging
- Check MongoDB logs for database issues

### Common Issues

1. **CORS errors:** Check backend CORS configuration
2. **Database connection:** Verify MongoDB URI and connection
3. **Port conflicts:** Ensure ports 4200 and 8080 are available
4. **Dependencies:** Clear node_modules and reinstall if needed

## Getting Help

- **Documentation:** Check the `/docs` folder
- **Issues:** Search existing issues before creating new ones
- **Discussions:** Use GitHub Discussions for questions
- **Code Review:** Ask for help in pull request comments

Thank you for contributing to Interview Prep Hub! 🚀
