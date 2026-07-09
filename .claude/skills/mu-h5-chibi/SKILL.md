```markdown
# mu-h5-chibi Development Patterns

> Auto-generated skill from repository analysis

## Overview
This skill introduces the core development patterns and conventions used in the `mu-h5-chibi` TypeScript codebase. It covers file organization, code style, commit message standards, and testing patterns. By following these guidelines, contributors can ensure consistency and maintainability across the project.

## Coding Conventions

### File Naming
- **Pattern:** PascalCase
- **Example:**  
  ```plaintext
  MyComponent.ts
  UserProfile.ts
  ```

### Import Style
- **Pattern:** Relative imports
- **Example:**
  ```typescript
  import { MyFunction } from './utils/MyFunction';
  ```

### Export Style
- **Pattern:** Named exports
- **Example:**
  ```typescript
  // In MyFunction.ts
  export function MyFunction() { /* ... */ }
  ```

### Commit Messages
- **Pattern:** Conventional commits with `chore` prefix
- **Example:**
  ```plaintext
  chore: update dependencies to latest versions
  ```

## Workflows

### Code Contribution
**Trigger:** When adding or updating code in the repository  
**Command:** `/contribute`

1. Create new files using PascalCase for file names.
2. Use relative imports for referencing other modules.
3. Export functions, classes, or constants using named exports.
4. Write or update tests in files matching the `*.test.*` pattern.
5. Commit changes using the conventional commit format, typically starting with `chore:`.
6. Submit a pull request for review.

### Testing
**Trigger:** When verifying code functionality  
**Command:** `/test`

1. Write tests in files following the `*.test.*` naming convention.
2. Use the project's preferred (undetected) testing framework.
3. Run tests locally to ensure all pass before committing.
4. Address any test failures before submitting code for review.

## Testing Patterns

- **Test File Naming:**  
  Test files should match the pattern `*.test.*` (e.g., `MyComponent.test.ts`).
- **Framework:**  
  The specific testing framework is not detected; follow existing patterns or consult the team.
- **Example:**
  ```typescript
  // MyComponent.test.ts
  import { MyComponent } from './MyComponent';

  describe('MyComponent', () => {
    it('should perform expected behavior', () => {
      // test implementation
    });
  });
  ```

## Commands
| Command      | Purpose                                  |
|--------------|------------------------------------------|
| /contribute  | Steps for contributing code              |
| /test        | Steps for writing and running tests      |
```
